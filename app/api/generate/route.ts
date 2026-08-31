import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/gemini';
import { buildPromptForPost, DANNY_BARKAI_SYSTEM_PROMPT } from '@/lib/stylePrompt';
import { analyzePostStyle } from '@/lib/styleAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mode,
      type,
      topic,
      rawContent,
      contentType,
      format,
      postLength,
      researchFindings,
      researchContext,
      seriesPart,
      wizardAnswers,
      wizardData,
      customInstructions,
      apiKey,
      customApiKey,
    } = body;

    const userPrompt = buildPromptForPost({
      topic,
      rawContent,
      contentType: contentType || format || 'regular',
      postLength: postLength || 'medium',
      researchFindings: researchFindings || researchContext,
      seriesPart,
      wizardAnswers: wizardAnswers || wizardData,
      customInstructions,
    });

    const effectiveApiKey = customApiKey || apiKey;

    const generatedText = await generateWithGemini({
      prompt: userPrompt,
      systemInstruction: DANNY_BARKAI_SYSTEM_PROMPT,
      apiKey: effectiveApiKey,
      temperature: 0.75,
    });

    const analysis = analyzePostStyle(generatedText);

    return NextResponse.json({
      success: true,
      post: generatedText,
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
