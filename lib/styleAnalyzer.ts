import { StyleAnalysis, StyleMetric } from './types';

export function analyzePostStyle(text: string): StyleAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      totalWords: 0,
      totalSentences: 0,
      avgSentenceLength: 0,
      metrics: [],
      detectedAnchors: [],
      suggestions: ['הזן טקסט כדי לנתח את מידת התאמתו לסגנון החתום של דני ברקאי.'],
    };
  }

  // Word count
  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Sentences (split by period, exclamation, question mark, newline)
  const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 5);
  const totalSentences = sentences.length || 1;
  const avgSentenceLength = Math.round(totalWords / totalSentences);

  // 1. Ellipses count (...)
  const ellipsesMatches = text.match(/\.{3}|…/g) || [];
  const ellipsesCount = ellipsesMatches.length;

  // 2. Dash separators (-)
  const dashMatches = text.match(/(\s-\s|–|—)/g) || [];
  const dashCount = dashMatches.length;

  // 3. Parentheses for side notes (...)
  const parenMatches = text.match(/\([^)]+\)/g) || [];
  const parenCount = parenMatches.length;

  // 4. Rhetorical questions (?)
  const questionMatches = text.match(/\?/g) || [];
  const questionCount = questionMatches.length;

  // 5. Signature anchors and vocabulary
  const anchorPatterns = [
    { name: 'לתפישתי / לדעתי', regex: /(לתפישתי|לדעתי)/g },
    { name: 'מחד... מאידך', regex: /(מחד|מאידך)/g },
    { name: 'יחד עם זאת / אך', regex: /(יחד עם זאת|\bאך\b)/g },
    { name: 'מענה (במקום פתרון)', regex: /(מענה|מענה הולם|מתן מענה)/g },
    { name: 'וכו\'', regex: /וכו'/g },
    { name: 'בין הפטיש לסדן', regex: /בין הפטיש לסדן/g },
    { name: 'השוואה היסטורית (בעבר... כיום)', regex: /(בעבר|כיום|לאורך השנים)/g },
    { name: 'אי אפליה / דייברסיטי', regex: /(דייברסיטי|אי[- ]אפליה|גיוון)/g },
    { name: 'מחוייבות (י כפולה)', regex: /מחוייבות/g },
  ];

  const detectedAnchors: string[] = [];
  let anchorMatchesTotal = 0;

  anchorPatterns.forEach(item => {
    const matches = text.match(item.regex);
    if (matches && matches.length > 0) {
      detectedAnchors.push(item.name);
      anchorMatchesTotal += matches.length;
    }
  });

  // Build metrics
  const metrics: StyleMetric[] = [
    {
      name: 'ellipses',
      label: 'שלוש נקודות (...) להשהיה והרהור',
      count: ellipsesCount,
      expectedMin: 3,
      passed: ellipsesCount >= 2,
      explanation: ellipsesCount >= 2
        ? 'שימוש מצוין בשלוש נקודות ליצירת השהיות ומחשבה פתוחה.'
        : 'מומלץ להוסיף 2-3 מקומות עם שלוש נקודות (...) ליצירת השהיה או אירוניה דקה.',
    },
    {
      name: 'dashes',
      label: 'מקפים מפרידים (-) לקצב ומעברים',
      count: dashCount,
      expectedMin: 2,
      passed: dashCount >= 2,
      explanation: dashCount >= 2
        ? 'מקפים מפרידים מעניקים קצב דיבורי ודינמי למשפטים.'
        : 'שלב מקפים מפרידים (-) במקום נקודתיים או פסיקים בכותרת ובמעברי פסקאות.',
    },
    {
      name: 'parentheses',
      label: 'סוגריים להסתייגויות והערות בזמן אמת',
      count: parenCount,
      expectedMin: 1,
      passed: parenCount >= 1,
      explanation: parenCount >= 1
        ? 'הסוגריים מוסיפים שקיפות, כנות ורובד מחשבתי נוסף.'
        : 'שלב הערת סוגריים המבטאת הסתייגות אישית או מגבלה אמיתית.',
    },
    {
      name: 'questions',
      label: 'שאלות רטוריות לחקירה משותפת',
      count: questionCount,
      expectedMin: 1,
      passed: questionCount >= 1,
      explanation: questionCount >= 1
        ? 'שאלות רטוריות מעודדות את הקורא לחשוב יחד איתך על הדילמה.'
        : 'מומלץ להציג שאלה רטורית פתוחה אחת או שתיים בלב הדילמה.',
    },
    {
      name: 'anchors',
      label: 'ביטויי מפתח ועוגנים חתומים',
      count: detectedAnchors.length,
      expectedMin: 3,
      passed: detectedAnchors.length >= 3,
      explanation: detectedAnchors.length >= 3
        ? `זוהו ${detectedAnchors.length} עוגנים לשוניים חתומים של דני.`
        : 'מומלץ לשלב עוד מביטויי החתימה ("לתפישתי", "מחד... מאידך", "מענה", "וכו\'").',
    },
    {
      name: 'sentenceLength',
      label: 'אורך משפטים ממוצע (עומק ומורכבות)',
      count: avgSentenceLength,
      expectedMin: 18,
      passed: avgSentenceLength >= 15,
      explanation: avgSentenceLength >= 15
        ? `אורך משפט ממוצע (${avgSentenceLength} מילים) מתאים לכתיבה אנליטית מצטברת.`
        : 'המשפטים מעט קצרים מדי; בסגנון של דני משפטים נבנים בשכבות פסוקיות מחוברות.',
    },
  ];

  // Calculate score
  const passedCount = metrics.filter(m => m.passed).length;
  const rawScore = (passedCount / metrics.length) * 80 + Math.min(20, anchorMatchesTotal * 2);
  const score = Math.min(100, Math.max(10, Math.round(rawScore)));

  // Generate suggestions
  const suggestions: string[] = [];
  metrics.forEach(m => {
    if (!m.passed) {
      suggestions.push(m.explanation);
    }
  });

  if (!text.includes('לתפישתי') && !text.includes('לדעתי')) {
    suggestions.push('זכור לסמן את העמדה האישית במפורש כדעה ("לתפישתי" / "לדעתי") ולא כעובדה גורפת.');
  }

  if (!text.includes('בהצלחה') && !text.includes('צ\'אנס')) {
    suggestions.push('שקול לסיים במסר מעודד וצנוע (כמו "בהצלחה!" או קריאה מתונה לפעולה).');
  }

  return {
    score,
    totalWords,
    totalSentences,
    avgSentenceLength,
    metrics,
    detectedAnchors,
    suggestions: suggestions.length > 0 ? suggestions : ['הטקסט תואם באופן מצוין את קול הכתיבה והחתימה של דני ברקאי!'],
  };
}

export const analyzeStyle = analyzePostStyle;

