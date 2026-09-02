import { NextRequest, NextResponse } from 'next/server';
import { DANNY_BARKAI_SYSTEM_PROMPT } from '@/lib/stylePrompt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey } = body;

    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        {\n          success: false,
          error: 'לא סופק מפתח Gemini API. אנא הגדר משתנה סביבה GEMINI_API_KEY או הזן מפתח בהגדרות.',
        },
        { status: 400 }
      );
    }

    // Format messages for Gemini API
    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    const payload = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: DANNY_BARKAI_SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `שגיאת תקשורת ${response.status}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const text = parts
      .map((p: any) => p.text || '')
      .join('')
      .trim();

    return NextResponse.json({
      success: true,
      message: text || 'לא התקבלה תשובה מהסוכן.',
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'שגיאה בשיחה עם הסוכן',
      },
      { status: 500 }
    );
  }
}
