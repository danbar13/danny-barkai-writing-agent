import { DANNY_BARKAI_SYSTEM_PROMPT } from './stylePrompt';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
}

// Preferred priority order when selecting models
const PREFERRED_MODEL_ORDER = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
];

/**
 * Dynamically discover available models supported by the provided API key.
 */
async function getAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      const modelsList: Array<{ name: string; supportedGenerationMethods?: string[] }> =
        data.models || [];

      const supported = modelsList
        .filter(
          (m) =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes('generateContent')
        )
        .map((m) => m.name.replace(/^models\//, ''));

      if (supported.length > 0) {
        // Sort models by preference
        return supported.sort((a, b) => {
          const idxA = PREFERRED_MODEL_ORDER.indexOf(a);
          const idxB = PREFERRED_MODEL_ORDER.indexOf(b);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
      }
    } else {
      const err = await response.json().catch(() => ({}));
      console.warn('ListModels failed, using default candidate list:', err);
    }
  } catch (e) {
    console.warn('Failed to query models list from Gemini API:', e);
  }

  return PREFERRED_MODEL_ORDER;
}

/**
 * Execute request to Gemini REST API with automatic multi-model fallback and dynamic discovery.
 */
async function callGeminiWithFallback(
  apiKey: string,
  payload: any
): Promise<{ text: string; data: any }> {
  const models = await getAvailableModels(apiKey);
  let lastError = '';

  for (const model of models) {
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
        console.warn(`Gemini attempt with ${model} failed: ${msg}`);

        // If the key itself is invalid, no need to loop through all models
        if (errData?.error?.status === 'INVALID_ARGUMENT' && msg.includes('API key')) {
          throw new Error('מפתח ה-Gemini API שהוזן אינו תקין. אנא בדוק את המפתח בהגדרות.');
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes('אינו תקין')) {
        throw err;
      }
      lastError = err.message || String(err);
      console.warn(`Gemini fetch error with ${model}:`, err);
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

  const researchPrompt = `בצע מחקר עומק מקצועי, מקיף ומעודכן ביותר אך ורק על הנושא והדילמה הבאה:
נושא: "${options.topic}"
${options.context ? `הקשר ודגשים נוספים: "${options.context}"` : ''}

הוראת שפה קריטית ובלתי מתפשרת:
כתוב את כל ממצאי המחקר אך ורק בשפה העברית (עברית עשירה, רהוטה, מקצועית ומדויקת)! אל תכתוב באנגלית כלל.

מטרת המחקר:
לספק רקע עובדתי עשיר, נתונים עדכניים, מגמות אחרונות בישראל ובעולם (במיוחד בעולמות הניהול, משאבי אנוש, טכנולוגיה, B2B SaaS, מלונאות ו-Travel Tech הרלוונטיים בדיוק לנושא זה), וטיעונים מנומקים של שני הצדדים בדילמה הניהולית הזו.

מבנה התוצר הנדרש (כולו בעברית):
1. **תמונת מצב עובדתית ומגמות עדכניות מהשטח**: סקור מונחים מקצועיים, נתונים, אתגרי שוק או תהליכים בולטים בנושא "${options.topic}".
2. **טיעוני הצדדים והאינטרסים המתנגשים**: ניתוח של "למה כן" מול "למה לא", צרכי הארגון וההנהלה מול צרכי העובדים, הלקוחות או השוק.
3. **מקרים מהשטח / תרחישים / דוגמאות בולטות**: תאר תרחישים ריאליסטיים מעולם העבודה, היזמות, התיירות או המלונאות.
4. **שאלות פתוחות ודילמות מרכזיות**: שאלות מפתח שהמחקר מציף.

נסח את הממצאים בצורה אנליטית, חדה ומעמיקה בעברית, המוכנה לשמש כחומר גלם עשיר לכתיבת פוסט/טור דעה מקצועי בסגנון של דני ברקאי.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
    systemInstruction: {
      parts: [
        {
          text: 'אתה חוקר מומחה ואנליסט עסקי בכיר. עליך לכתוב את כל ממצאי המחקר, הניתוחים והדוגמאות אך ורק בשפה העברית בצורה רהוטה, מקצועית, מעמיקה וממוקדת בנושא הנדרש.',
        },
      ],
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3000,
    },
  };

  const result = await callGeminiWithFallback(apiKey, payload);
  let findingsText = result.text;

  // Safeguard: Check if findings were generated in English, and auto-translate to Hebrew if needed
  const hebrewCharCount = (findingsText.match(/[\u0590-\u05FF]/g) || []).length;
  const englishCharCount = (findingsText.match(/[a-zA-Z]/g) || []).length;

  if (englishCharCount > 100 && englishCharCount > hebrewCharCount) {
    const translatePayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `תרגם ועבד את כל ממצאי המחקר הבאים לשפה העברית בלבד (עברית רהוטה, מקצועית ואנליטית מעולמות הניהול, משאבי אנוש וטכנולוגיה עבור מנהלים בכירים):\n\n${findingsText}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3000,
      },
    };
    try {
      const hebrewResult = await callGeminiWithFallback(apiKey, translatePayload);
      if (hebrewResult.text) {
        findingsText = hebrewResult.text;
      }
    } catch (e) {
      console.warn('Failed to auto-translate research to Hebrew:', e);
    }
  }

  return {
    findings: findingsText,
    sources: [
      'מאגר הידע המקצועי של Gemini (טרבל-טק, B2B SaaS, משאבי אנוש וניהול בכיר)',
      'סקירת מגמות שוק וניהול ארגוני',
    ],
  };
}
