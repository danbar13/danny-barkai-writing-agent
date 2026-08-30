import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/gemini';
import { buildPromptForPost, DANNY_BARKAI_SYSTEM_PROMPT } from '@/lib/stylePrompt';
import { analyzePostStyle } from '@/lib/styleAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, topic, rawContent, contentType, postLength, researchFindings, seriesPart, wizardAnswers, customInstructions, apiKey } = body;

    const userPrompt = buildPromptForPost({
      topic,
      rawContent,
      contentType: contentType || 'blog',
      postLength,
      researchFindings,
      seriesPart,
      wizardAnswers,
      customInstructions,
    });

    const generatedText = await generateWithGemini({
      prompt: userPrompt,
      systemInstruction: DANNY_BARKAI_SYSTEM_PROMPT,
      apiKey,
      temperature: 0.75,
    });

    const analysis = analyzePostStyle(generatedText);

    return NextResponse.json({
      success: true,
      content: generatedText,
      analysis,
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'שגיאה בלתי צפויה בהפקת הפוסט',
      },
      { status: 500 }
    );
  }
}
