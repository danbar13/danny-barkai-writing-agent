import { NextRequest, NextResponse } from 'next/server';
import { conductWebResearch } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, context, apiKey, customApiKey } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { success: false, error: 'יש להזין נושא או רעיון לביצוע המחקר.' },
        { status: 400 }
      );
    }

    const effectiveApiKey = customApiKey || apiKey;

    const researchResult = await conductWebResearch({
      topic,
      context,
      apiKey: effectiveApiKey,
    });

    return NextResponse.json({
      success: true,
      findings: researchResult.findings,
      researchSummary: researchResult.findings,
      sources: researchResult.sources,
    });
  } catch (error: any) {
    console.error('Error conducting web research:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'שגיאה בלתי צפויה בביצוע מחקר הרשת',
      },
      { status: 500 }
    );
  }
}
