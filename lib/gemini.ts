import { DANNY_BARKAI_SYSTEM_PROMPT } from './stylePrompt';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
}

export async function generateWithGemini(options: GenerateTextOptions): Promise<string> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('לא סופק מפתח Gemini API. אנא הגדר משתנה סביבה GEMINI_API_KEY ב-Vercel או הזן מפתח בהגדרות האפליקציה.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: options.prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: options.systemInstruction || DANNY_BARKAI_SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: 3500,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.error?.message || `שגיאת שרת: ${response.status} ${response.statusText}`;
    throw new Error(`שגיאה בפנייה ל-Gemini API: ${errorMessage}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('לא התקבלה תשובה תקינה מהמודל.');
  }

  return text;
}

export async function conductWebResearch(options: {
  topic: string;
  context?: string;
  apiKey?: string;
}): Promise<{ findings: string; sources: string[] }> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('לא סופק מפתח Gemini API. אנא הגדר משתנה סביבה GEMINI_API_KEY ב-Vercel או הזן מפתח בהגדרות.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const researchPrompt = `בצע מחקר עומק עצמאי ועדכני באינטרנט על הנושא והדילמה הבאה:
נושא: "${options.topic}"
${options.context ? `הקשר נוסף: "${options.context}"` : ''}

מטרת המחקר:
לספק רקע עובדתי עשיר, נתונים, מגמות אחרונות בישראל ובעולם, פסיקות/חוקים רלוונטיים (אם יש), וטיעונים מנומקים של שני הצדדים בדילמה הניהולית הזו (מנקודת מבט של משאבי אנוש, הנהלה, עובדים והציבור).

מבנה התוצר הנדרש:
1. תמונת מצב עובדתית ומגמות עדכניות (כולל מספרים, נתונים או אירועים בולטים אם קיימים).
2. טיעוני הצדדים והאינטרסים המתנגשים ("למה כן" מול "למה לא").
3. מקרים מהשטח / תקדימים / דוגמאות בולטות בארץ ובעולם.
4. שאלות פתוחות ודילמות מרכזיות שהמחקר מציף.

נסח את הממצאים בצורה תמציתית, מקצועית, מעמיקה ומוכנה לשילוב כחומר רקע בכתיבת פוסט דעה/בלוג.`;

  // Try with Google Search tool first, fallback to standard generation if not supported
  const payloadWithSearch = {
    contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
    tools: [{ googleSearch: {} }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2500,
    },
  };

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadWithSearch),
  });

  // If googleSearch tool syntax fails on standard API keys, fallback to standard synthesis
  if (!response.ok) {
    const payloadFallback = {
      contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2500,
      },
    };
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadFallback),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`שגיאה בביצוע מחקר רשת: ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract grounding metadata sources if available
  const sources: string[] = [];
  const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks)) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.title && chunk.web?.uri) {
        sources.push(`${chunk.web.title} (${chunk.web.uri})`);
      }
    });
  }

  return {
    findings: text,
    sources,
  };
}
