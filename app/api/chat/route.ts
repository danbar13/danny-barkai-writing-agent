import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/gemini';
import { DANNY_BARKAI_SYSTEM_PROMPT } from '@/lib/stylePrompt';
import { ChatMessage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, customApiKey } = body as {
      messages: ChatMessage[];
      customApiKey?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'לא התקבלו הודעות' }, { status: 400 });
    }

    const conversationHistory = messages
      .map((m) => `${m.role === 'user' ? 'דני ברקאי' : 'סוכן הכתיבה'}: ${m.content}`)
      .join('\n\n');

    const prompt = `הנה היסטוריית השיחה בינך לבין דני ברקאי:
${conversationHistory}

השב לדני בהתאם להודעתו האחרונה. עזור לו לחשוב בקול רם על דילמות ניהוליות, סגנון כתיבה, רעיונות לפוסטים או לטיש ניסוחים בסגנון DANBAR.
שמור על הטון הרפלקטיבי, המעמיק והקולגיאלי של דני ברקאי.`;

    const reply = await generateWithGemini({
      prompt,
      systemInstruction: DANNY_BARKAI_SYSTEM_PROMPT,
      apiKey: customApiKey,
      temperature: 0.7,
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'אירעה שגיאה בעיבוד השיחה' },
      { status: 500 }
    );
  }
}
