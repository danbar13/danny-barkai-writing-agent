import { StyleAnalysis, StyleMetric } from './types';

/**
 * Deterministic Style Analyzer for Danny Barkai's writing style.
 * Evaluates posts against the signature rules and provides rubric scoring.
 */
export function analyzePostStyle(text: string): StyleAnalysis {
  if (!text || !text.trim()) {
    return {
      score: 0,
      totalWords: 0,
      totalSentences: 0,
      avgWordsPerSentence: 0,
      metrics: [],
      detectedAnchors: [],
      suggestions: ['הזן טקסט כדי לנתח את מידת ההתאמה לסגנון.'],
    };
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Split into sentences (by . ! ? or newlines)
  const sentenceDelimiters = /[.!?\n]+/;
  const sentences = text
    .split(sentenceDelimiters)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
  const totalSentences = Math.max(1, sentences.length);
  const avgWordsPerSentence = Math.round(totalWords / totalSentences);

  const metrics: StyleMetric[] = [];
  const detectedAnchors: string[] = [];
  const suggestions: string[] = [];

  let score = 0;

  // 1. Check for Ellipses (...)
  const ellipsesMatches = text.match(/\.{3}|…/g) || [];
  const ellipsesCount = ellipsesMatches.length;
  const hasGoodEllipses = ellipsesCount >= 2;
  if (hasGoodEllipses) {
    score += 15;
    metrics.push({
      ruleName: 'שימוש בשלוש נקודות (...)',
      passed: true,
      count: ellipsesCount,
      label: 'פיסוק חותם: שלוש נקודות (...)',
      explanation: `נמצאו ${ellipsesCount} מופעים של שלוש נקודות. יוצר השהיה רפלקטיבית וסקרנות.`,
    });
  } else {
    metrics.push({
      ruleName: 'שימוש בשלוש נקודות (...)',
      passed: false,
      count: ellipsesCount,
      label: 'פיסוק חותם: שלוש נקודות (...)',
      explanation: 'מומלץ להוסיף 2-3 מקומות עם שלוש נקודות (...) להשהיה ומחשבה פתוחה.',
    });
    suggestions.push('הוסף שלוש נקודות (...) במקומות של השהיה רטורית או ספקנות ("אז זהו-שמסתבר...").');
  }

  // 2. Check for Em-dashes / hyphens (-)
  const dashMatches = text.match(/\s+-\s+|\s+—\s+/g) || [];
  const dashCount = dashMatches.length;
  const hasGoodDashes = dashCount >= 2;
  if (hasGoodDashes) {
    score += 15;
    metrics.push({
      ruleName: 'שימוש במקפים ומעברים (-)',
      passed: true,
      count: dashCount,
      label: 'מעברים אסוציאטיביים: מקפים (-)',
      explanation: `נמצאו ${dashCount} מקפים המחברים רעיונות ומעברים בזמן אמת.`,
    });
  } else {
    metrics.push({
      ruleName: 'שימוש במקפים ומעברים (-)',
      passed: false,
      count: dashCount,
      label: 'מעברים אסוציאטיביים: מקפים (-)',
      explanation: 'מומלץ לחבר משפטים ומעברים עם מקף מפריד ("-") במקום נקודה או פסיק.',
    });
    suggestions.push('השתמש במקף מפריד (-) לחיבור מחשבות ומעברים בין פסוקיות.');
  }

  // 3. Check for Parentheses ()
  const parenMatches = text.match(/\([^)]+\)/g) || [];
  const parenCount = parenMatches.length;
  const hasGoodParens = parenCount >= 2;
  if (hasGoodParens) {
    score += 15;
    metrics.push({
      ruleName: 'הסתייגויות והערות בסוגריים',
      passed: true,
      count: parenCount,
      label: 'מחשבות שנייה והסתייגויות: בסוגריים ()',
      explanation: `נמצאו ${parenCount} הערות בסוגריים. מעניק תחושת שיחה וחשיבה בקול.`,
    });
  } else {
    metrics.push({
      ruleName: 'הסתייגויות והערות בסוגריים',
      passed: false,
      count: parenCount,
      label: 'מחשבות שנייה והסתייגויות: בסוגריים ()',
      explanation: 'מומלץ להוסיף הסתייגויות או הערות רקע בסוגריים.',
    });
    suggestions.push('הוסף הסתייגות או הערת צד בסוגריים (למשל: מחשבה שנייה או הבהרה מהשטח).');
  }

  // 4. Check for Rhetorical Questions (?)
  const questionMatches = text.match(/\?/g) || [];
  const questionCount = questionMatches.length;
  const hasQuestions = questionCount >= 1;
  if (hasQuestions) {
    score += 15;
    metrics.push({
      ruleName: 'שאלות רטוריות לחקירה משותפת',
      passed: true,
      count: questionCount,
      label: 'דיאלוג עם הקורא: שאלות רטוריות (?)',
      explanation: `נמצאו ${questionCount} שאלות המזמינות את הקורא לחשוב יחד על הדילמה.`,
    });
  } else {
    metrics.push({
      ruleName: 'שאלות רטוריות לחקירה משותפת',
      passed: false,
      count: questionCount,
      label: 'דיאלוג עם הקורא: שאלות רטוריות (?)',
      explanation: 'מומלץ לשלב שאלות רטוריות המציגות את הדילמה.',
    });
    suggestions.push('שלב שאלה רטורית פתוחה המאתגרת את התפיסה המקובלת.');
  }

  // 5. Check Signature Vocabulary & Anchors
  const anchorPatterns = [
    { name: 'בין הפטיש לסדן', pattern: /בין הפטיש לסדן/i },
    { name: 'מחד / מאידך', pattern: /מחד|מאידך/i },
    { name: 'לתפישתי / לדעתי', pattern: /לתפישתי|לדעתי|לתפיסתי/i },
    { name: 'יחד עם זאת', pattern: /יחד עם זאת/i },
    { name: 'בעבר... כיום', pattern: /בעבר|כיום|מאז ועד היום/i },
    { name: 'מענה (במקום פתרון)', pattern: /מענה/i },
    { name: 'אליה וקוץ בה / פתגם', pattern: /אליה וקוץ בה|הפרה רוצה להניק|חרב פיפיות|שכרנו בהפסדנו/i },
    { name: 'וכו\'', pattern: /וכו'/i },
    { name: 'מחוייבות (י כפולה)', pattern: /מחוייב/i },
  ];

  let anchorMatchesCount = 0;
  anchorPatterns.forEach((anchor) => {
    if (anchor.pattern.test(text)) {
      anchorMatchesCount++;
      detectedAnchors.push(anchor.name);
    }
  });

  if (anchorMatchesCount >= 3) {
    score += 25;
    metrics.push({
      ruleName: 'אוצר מילים ועוגני חשיבה חתומים',
      passed: true,
      count: anchorMatchesCount,
      label: 'עוגנים לשוניים וביטויים מזוהים',
      explanation: `זוהו ${anchorMatchesCount} עוגנים לשוניים אופייניים לדני ברקאי (${detectedAnchors.join(', ')}).`,
    });
  } else {
    score += anchorMatchesCount * 6;
    metrics.push({
      ruleName: 'אוצר מילים ועוגני חשיבה חתומים',
      passed: false,
      count: anchorMatchesCount,
      label: 'עוגנים לשוניים וביטויים מזוהים',
      explanation: `זוהו רק ${anchorMatchesCount} עוגנים לשוניים. מומלץ לשלב ביטויים כמו "לתפישתי", "מחד... מאידך", "בין הפטיש לסדן".`,
    });
    suggestions.push('שלב ביטויים כמו "לתפישתי", "מחד... מאידך", או פתגם ישראלי מוכר.');
  }

  // 6. Sentence Length & Rhythm Variety (Long sentences + short punchy sentences)
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 22).length;
  const shortSentences = sentences.filter((s) => s.split(/\s+/).length <= 8).length;
  const hasGoodRhythm = longSentences >= 2 && (shortSentences >= 1 || sentences.length < 5);

  if (hasGoodRhythm) {
    score += 15;
    metrics.push({
      ruleName: 'קצב ומבנה משפטים מורכב ומצטבר',
      passed: true,
      count: longSentences,
      label: 'גיוון קצב: משפטים ארוכים מצטברים + נקודות נשימה קצרות',
      explanation: `נמצאו ${longSentences} משפטים מורכבים ורב-פסוקתיים לצד משפטים קצרים לאוורור.`,
    });
  } else {
    metrics.push({
      ruleName: 'קצב ומבנה משפטים מורכב ומצטבר',
      passed: false,
      count: longSentences,
      label: 'גיוון קצב: משפטים ארוכים מצטברים + נקודות נשימה קצרות',
      explanation: 'הסגנון של דני מתאפיין במשפטים ארוכים, מרובי פסוקיות (אשר, מאחר ו-, כך ש-), לצד משפט קצר כנקודת נשימה.',
    });
    suggestions.push('הרחב חלק מהמשפטים באמצעות פסוקיות זיקה ("אשר", "הואיל ו-", "כך ש-") כדי ליצור עומק אנליטי.');
  }

  // Ensure score is bounded [0, 100]
  score = Math.min(100, Math.max(10, score));

  return {
    score,
    totalWords,
    totalSentences,
    avgWordsPerSentence,
    metrics,
    detectedAnchors,
    suggestions,
  };
}
