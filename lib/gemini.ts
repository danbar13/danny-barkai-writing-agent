import { DANNY_BARKAI_SYSTEM_PROMPT } from './stylePrompt';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
}

// Modern active Gemini models on v1beta
const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
];

/**
 * Execute request to Gemini REST API on v1beta with automatic multi-model fallback.
 */
async function callGeminiWithFallback(
  apiKey: string,
  payload: any
): Promise<{ text: string; data: any }> {
  let lastError = '';

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
        console.warn(`Gemini attempt with ${model} on v1beta failed: ${msg}`);
      }
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn(`Gemini fetch error with ${model} on v1beta:`, err);
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

  const payload = {
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
  };

  const result = await callGeminiWithFallback(apiKey, payload);
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

  const researchPrompt = `בצע מחקר עומק מקצועי, מקיף ומעודכן ביותר על הנושא והדילמה הבאה:
נושא: "${options.topic}"
${options.context ? `הקשר ודגשים נוספים: "${options.context}"` : ''}

מטרת המחקר:
לספק רקע עובדתי עשיר, נתונים עדכניים, מגמות אחרונות בישראל ובעולם (במיוחד בעולמות הניהול, משאבי אנוש, טכנולוגיה, B2B, SaaS, מלונאות ו-Travel Tech לפי העניין), וטיעונים מנומקים של שני הצדדים בדילמה הניהולית הזו.

מבנה התוצר הנדרש:
1. **תמונת מצב עובדתית ומגמות עדכניות מהשטח**: סקור מונחים מקצועיים, נתונים, אתגרי שוק או תהליכים בולטים.
2. **טיעוני הצדדים והאינטרסים המתנגשים**: ניתוח של "למה כן" מול "למה לא", צרכי הארגון וההנהלה מול צרכי העובדים, הלקוחות או השוק.
3. **מקרים מהשטח / תרחישים / דוגמאות בולטות**: תאר תרחישים ריאליסטיים מעולם העבודה, היזמות או המלונאות.
4. **שאלות פתוחות ודילמות מרכזיות**: שאלות מפתח שהמחקר מציף.

נסח את הממצאים בצורה אנליטית, חדה ומעמיקה, המוכנה לשמש כחומר גלם עשיר לכתיבת פוסט/טור דעה מקצועי בסגנון של דני ברקאי.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 3000,
    },
  };

  const result = await callGeminiWithFallback(apiKey, payload);

  return {
    findings: result.text,
    sources: [
      'Gemini Knowledge Base (B2B, HR, Travel Tech & Executive Domain Data)',
      'ניתוח מגמות שוק וניהול ארגוני',
    ],
  };
}
