import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Helper to get a configured GoogleGenerativeAI instance
 */
export function getGeminiClient(apiKey?: string): GoogleGenerativeAI {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      'לא סופק מפתח Gemini API. אנא הזן מפתח בהגדרות או הגדר GEMINI_API_KEY במשתני הסביבה.'
    );
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Generate text using Gemini with custom system prompt and optional settings
 */
export async function generateWithGemini({
  prompt,
  systemInstruction,
  apiKey,
  temperature = 0.7,
  maxOutputTokens = 3000,
}: {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const genAI = getGeminiClient(apiKey);
  
  // Use gemini-1.5-flash for speed and reliability
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction ? {
      role: 'system',
      parts: [{ text: systemInstruction }],
    } : undefined,
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Conduct autonomous web research using Gemini's built-in Google Search grounding
 */
export async function conductWebResearch({
  topic,
  context,
  apiKey,
}: {
  topic: string;
  context?: string;
  apiKey?: string;
}): Promise<{ findings: string; sources: string[] }> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('נדרש מפתח Gemini API לביצוע מחקר רשת עצמאי.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const researchPrompt = `
בצע מחקר מעמיק, עובדתי ועדכני בנושא הבא לקראת כתיבת פוסט / מאמר דילמות ניהולי:
נושא: "${topic}"
${context ? `הקשר ודגשים נוספים: ${context}` : ''}

הנחיות לתוצאות המחקר:
1. תמצת את הנתונים, העובדות, המגמות וההתפתחויות האחרונות בנושא.
2. זהה את הדילמה המרכזית ואת שני הצדדים/האינטרסים המתנגשים (בעד ונגד, הנהלה מול עובדים, רגולציה מול מציאות, טכנולוגיה מול אנושיות).
3. הבא 2-3 דוגמאות מוחשיות או מקרים מהשטח (בארץ או בעולם).
4. הצג את המידע בצורה מובנית, אנליטית ותמציתית עם כותרות ונקודות (בפורמט Markdown).
`;

  const payload = {
    contents: [
      {
        parts: [{ text: researchPrompt }],
      },
    ],
    tools: [
      {
        google_search: {},
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2000,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `שגיאה בחיבור ל-Google Search API: ${response.status}`
    );
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  const findings = candidate?.content?.parts?.[0]?.text || 'לא נמצאו ממצאים מפורטים.';

  // Extract grounding citations/sources if present
  const sources: string[] = [];
  const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks)) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push(chunk.web.title ? `${chunk.web.title} (${chunk.web.uri})` : chunk.web.uri);
      }
    });
  }

  return { findings, sources: Array.from(new Set(sources)) };
}
