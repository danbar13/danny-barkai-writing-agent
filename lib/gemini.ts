import { DANNY_BARKAI_SYSTEM_PROMPT } from './stylePrompt';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
}

// Modern active Gemini models
const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
];

const API_VERSIONS = ['v1beta', 'v1'];

/**
 * Execute request to Gemini REST API with automatic multi-model and multi-version fallback.
 */
async function callGeminiWithFallback(
  apiKey: string,
  payloadBuilder: (model: string, apiVersion: string) => any
): Promise<{ text: string; data: any }> {
  let lastError = '';

  for (const apiVersion of API_VERSIONS) {
    for (const model of CANDIDATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
      const payload = payloadBuilder(model, apiVersion);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return { text, data };
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          const msg = errData?.error?.message || response.statusText;
          lastError = msg;
          console.warn(`Gemini attempt with ${model} on ${apiVersion} failed: ${msg}`);
        }
      } catch (err: any) {
        lastError = err.message || String(err);
        console.warn(`Gemini fetch error with ${model} on ${apiVersion}:`, err);
      }
    }
  }

  throw new Error(`שגיאה בפנייה ל-Gemini API: ${lastError || 'לא ניתן למצוא מודל זמין עבור מפתח זה'}`);
}

export async function generateWithGemini(options: GenerateTextOptions): Promise<string> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'לא סופק מפתח Gemini API. אנא הגדר משתנה סביבה GEMINI_API_KEY ב-Vercel או הזן מפתח בהגדרות האפליקציה.'
    );
  }

  const result = await callGeminiWithFallback(apiKey, () => ({
    contents: [
      {
        role: 'user',
        parts: [{ text: options.prompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: options.systemInstruction || DANNY_BARKAI_SYSTEM_PROMPT }],
    },
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: 3500,
    },
  }));

  return result.text;
}

export async function conductWebResearch(options: {
  topic: string;
  context?: string;
  apiKey?: string;
}): Promise<{ findings: string; sources: string[] }> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'לא סופק מפתח Gemini API. אנא הגדר משתנה סביבה GEMINI_API_KEY ב-Vercel או הזן מפתח בהגדרות.'
    );
  }

  const researchPrompt = `בצע מחקר עומק עצמאי ועדכני על הנושא והדילמה הבאה:
נושא: "${options.topic}"
${options.context ? `הקשר ודגשים נוספים: "${options.context}"` : ''}

מטרת המחקר:
לספק רקע עובדתי עשיר, נתונים עדכניים, מגמות אחרונות בישראל ובעולם (במיוחד בעולמות הניהול, משאבי אנוש, טכנולוגיה, B2B, SaaS, מלונאות ו-Travel Tech לפי העניין), וטיעונים מנומקים של שני הצדדים בדילמה הניהולית הזו.

מבנה התוצר הנדרש:
1. תמונת מצב עובדתית ומגמות עדכניות מהשטח (כולל מונחים מקצועיים, נתונים או אירועים בולטים).
2. טיעוני הצדדים והאינטרסים המתנגשים ("למה כן" מול "למה לא", צרכי הארגון מול צרכי העובדים/השוק).
3. מקרים מהשטח / תרחישים / דוגמאות בולטות בארץ ובעולם.
4. שאלות פתוחות ודילמות מרכזיות שהמחקר מציף.

נסח את הממצאים בצורה תמציתית, מקצועית, מעמיקה ומוכנה לשילוב כחומר רקע בכתיבת פוסט דעה/בלוג בסגנון של דני ברקאי.`;

  let result: { text: string; data: any } | null = null;
  const sources: string[] = [];

  // Try standard knowledge research with Gemini
  try {
    result = await callGeminiWithFallback(apiKey, (model, apiVersion) => {
      // Only include Google Search on v1beta
      if (apiVersion === 'v1beta') {
        return {
          contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2500,
          },
        };
      }
      return {
        contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2500,
        },
      };
    });
  } catch (e) {
    // If tools/search fail, fallback to pure model generation
    result = await callGeminiWithFallback(apiKey, () => ({
      contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2500,
      },
    }));
  }

  const groundingChunks = result.data?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks)) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.title && chunk.web?.uri) {
        sources.push(`${chunk.web.title} (${chunk.web.uri})`);
      }
    });
  }

  return {
    findings: result.text,
    sources,
  };
}
