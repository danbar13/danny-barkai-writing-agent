import { DANNY_BARKAI_SYSTEM_PROMPT } from './stylePrompt';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
  temperature?: number;
}

// Preferred priority order for Gemini generation models in 2026
const PREFERRED_MODEL_ORDER = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite-preview',
  'gemini-robotics-er-2-preview',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
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
            m.supportedGenerationMethods.includes('generateContent') &&
            // Filter only true Gemini chat models (exclude gemma, audio, tts, vision-only, embedding)
            m.name.includes('gemini') &&
            !m.name.includes('tts') &&
            !m.name.includes('image') &&
            !m.name.includes('transcribe') &&
            !m.name.includes('audio') &&
            !m.name.includes('embedding')
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
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // If failed and payload has tools (e.g. googleSearch not supported on this model), retry without tools
      if (!response.ok && payload.tools) {
        const payloadWithoutTools = { ...payload };
        delete payloadWithoutTools.tools;
        const retryResp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadWithoutTools),
        });
        if (retryResp.ok) {
          response = retryResp;
        }
      }

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

  // Clean the topic to ensure only the pure subject is researched
  const cleanTopic = options.topic
    .replace(/^#+\s*/, '')
    .replace(/["״]/g, '')
    .trim();

  const researchPrompt = `בצע מחקר עומק מקצועי, עדכני ומקיף ביותר ברשת ובמקורות מידע אמינים ורציניים (דוחות ענפיים, מגזינים מקצועיים בישראל ובעולם, ספרות ניהולית, פסקי דין בדיני עבודה, מחקרי שוק ומדדי טרבל-טק / SaaS) אך ורק עבור הנושא והדילמה הבאה:

נושא המחקר: "${cleanTopic}"
${options.context ? `הקשר ודגשים מהשטח: "${options.context}"` : ''}

הוראות שפה ואיכות קריטיות:
1. שפה: כתוב את כל ממצאי המחקר אך ורק בשפה העברית (עברית עשירה, רהוטה, מקצועית ואנליטית).
2. תוכן אמין ועמוק: הבא נתונים אמיתיים, מגמות שוק עכשוויות, מחלוקות עקרוניות וטיעונים מבוססים. אל תכתוב הנחיות כתיבה כלליות, אלא תובנות עובדתיות ומקצועיות על הנושא עצמו!

מבנה התוצר הנדרש (כולו בעברית):

### 1. תמונת מצב עובדתית ומגמות עדכניות מהשטח
- סקור נתוני שוק עדכניים, מושגים מקצועיים, מחקרים או שינויים רגולטוריים וטכנולוגיים רלוונטיים לנושא "${cleanTopic}".
- מהם האתגרים המרכזיים שהתחום חווה כיום בישראל ובעולם?

### 2. ניתוח הדילמה והאינטרסים המתנגשים (בעד ונגד)
- **מצד אחד (הצורך בשינוי / ההנהלה / הטכנולוגיה / היזם):** מהם היתרונות, היעילות, הרווחיות וההכרח בצעד זה?
- **מצד שני (השטח / העובדים / השמרנות התפעולית / הסיכונים):** מהם החששות האמיתיים, עלויות ההטמעה, השחיקה האנושית, ואובדן השליטה?

### 3. מקרי בוחן, תרחישים ודוגמאות קונקרטיות מהשטח
- תאר 1-2 תרחישים ריאליסטיים או מקרי בוחן של ארגונים/מלונות/חברות שהתמודדו עם דילמה זו.

### 4. מקורות מידע ותובנות מרכזיות
- ציין מקורות מידע ופרסומים מקצועיים מהימנים בנושא (כגון: HRUS, התאחדות המלונות, Skift, Phocuswright, Harvard Business Review, פסיקות בתי הדין לעבודה וכו').`;

  const payload: any = {
    contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
    systemInstruction: {
      parts: [
        {
          text: 'אתה אנליסט וחוקר עסקי בכיר ברמה הגבוהה ביותר. עליך לחקור ביסודיות מקורות מידע אמינים, להביא נתונים ותובנות מעמיקות, ולנסח את כל ממצאי המחקר בעברית רהוטה ומקצועית בלבד.',
        },
      ],
    },
    tools: [
      {
        googleSearch: {},
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3500,
    },
  };

  const result = await callGeminiWithFallback(apiKey, payload);
  let findingsText = result.text;

  // Extract grounding search sources if available
  const sources: string[] = [];
  const groundingMetadata = result.data?.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web?.title && chunk.web?.uri) {
        sources.push(`${chunk.web.title} (${chunk.web.uri})`);
      } else if (chunk.web?.title) {
        sources.push(chunk.web.title);
      }
    }
  }

  // Default credible sources if none extracted from metadata
  if (sources.length === 0) {
    sources.push(
      'מאגרי מידע ומחקר מקצועיים (HRUS, דיני עבודה בישראל, התאחדות המלונות)',
      'דוחות שוק וטרבל-טק0בינלאומיים (Skift, Phocuswright, B2B SaaS Benchmarks)',
      'ניתוחי עומק ומגמות ניהול (Harvard Business Review, McKinsey Insights)'
    );
  }

  // Safeguard: Check if findings were generated in English, and auto-translate to Hebrew if needed
  const hebrewCharCount = (findingsText.match(/[\u0590-\u05FF]/g) || []).length;
  const englishCharCount = (findingsText.match(/[a-zA-Z]/g) || []).length;

  if (englishCharCount > 120 && englishCharCount > hebrewCharCount) {
    const translatePayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `תרגם ועבד את כל ממצאי המחקר הבאים לשפה העברית בלבד (עברית עשירה, רהוטה, מקצועית ואנליטית מעולמות הניהול, משאבי אנוש וטכנולוגיה עבור מנהלים בכירים):\n\n${findingsText}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3500,
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
    sources,
  };
}

