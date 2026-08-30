import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Lightbulb,
  RotateCcw,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ContentType, PostLength } from '@/lib/types';
import { SAMPLE_IDEAS, SampleIdea } from '@/lib/samplePosts';

interface WizardTabProps {
  onGenerate: (data: {
    contentType: ContentType;
    postLength: PostLength;
    researchFindings?: string;
    wizardAnswers: {
      dilemma: string;
      personalBackground: string;
      prosAndCons: string;
      concreteExample: string;
      personalStance: string;
    };
  }) => void;
  apiKey?: string;
  isLoading: boolean;
}

export const WizardTab: React.FC<WizardTabProps> = ({ onGenerate, apiKey, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [postLength, setPostLength] = useState<PostLength>('medium');

  // Web Research in Wizard
  const [isResearching, setIsResearching] = useState(false);
  const [researchFindings, setResearchFindings] = useState<string>('');
  const [showResearchBox, setShowResearchBox] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const [answers, setAnswers] = useState({
    dilemma: '',
    personalBackground: '',
    prosAndCons: '',
    concreteExample: '',
    personalStance: '',
  });

  const handleConductResearch = async () => {
    const query = answers.dilemma.trim();
    if (!query) return;

    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: query,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'שגיאה בביצוע מחקר הרשת');
      }

      setResearchFindings(data.findings || '');
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || 'שגיאה בביצוע המחקר');
    } finally {
      setIsResearching(false);
    }
  };

  const steps = [
    {
      step: 1,
      title: 'זיהוי הדילמה והמתח המרכזי',
      subtitle: 'המצב של "בין הפטיש לסדן"',
      question: 'מהי הדילמה הניהולית או המקצועית שעליה אנחנו רוצים לכתוב הפעם? מהם שני הכוחות, הערכים או האינטרסים שמתנגשים כאן?',
      placeholder: 'למשל: המתח שבין הצורך של הארגון בגמישות תפעולית לבין הצורך של העובד בביטחון תעסוקתי ויציבות...',
      field: 'dilemma' as const,
      tip: 'בדוק שאין כאן רק "צד צודק וצד טועה", אלא שני כוחות לגיטימיים שמושכים לכיוונים מנוגדים.',
    },
    {
      step: 2,
      title: 'ניסיון אישי ורקע היסטורי',
      subtitle: 'פרספקטיבה של "בעבר... כיום..."',
      question: 'איזה רקע מהניסיון האישי שלך בשטח (מלונאות, ניהול מש"א) מתחבר לנושא? איך הדברים נראו בעבר לעומת המציאות כיום?',
      placeholder: 'למשל: בתחילת שנות ה-90 במלונות באילת לא הכרנו כמעט עובדי קבלן... כיום כמעט בלתי אפשרי להפעיל מלון בלעדיהם...',
      field: 'personalBackground' as const,
      tip: 'העיגון בסיפור אישי או בניגוד היסטורי מעניק אותנטיות, סמכות ועומק לכל הניתוח.',
    },
    {
      step: 3,
      title: 'טיעוני הבעד והנגד',
      subtitle: 'פריסת המורכבות ("מחד... מאידך")',
      question: 'מהם הטיעונים המרכזיים של כל צד בדילמה? למה צד א\' צודק, ומאידך — מהם השיקולים הלגיטימיים של צד ב\'?',
      placeholder: 'מחד: ...\nמאידך: ...\nשיקולי עלות מול שירות, הוגנות מול מהירות...',
      field: 'prosAndCons' as const,
      tip: 'הצגת שני הצדדים לפני הבעת דעה בונה אמון ומראה לקורא שהדילמה נשקלה בכובד ראש אמיתי.',
    },
    {
      step: 4,
      title: 'דוגמה מוחשית / תסריט מהשטח',
      subtitle: '"דמיינו לעצמכם מקרה שבו..."',
      question: 'האם יש סצנה קונקרטית, מקרה מבחן או תרחיש יומיומי שאפשר להציג לקורא כדי להמחיש את הבעיה באופן חי?',
      placeholder: 'למשל: דמיינו לעצמכם מקרה בו מנהל מחלקה צעיר מקבל תוצאות מבחן מהימנות ומטיח אותן בעובד ברגע של כעס...',
      field: 'concreteExample' as const,
      tip: 'דוגמה מוחשית אחת שווה יותר מעשר פסקאות של ניתוח מופשט.',
    },
    {
      step: 5,
      title: 'העמדה האישית והתובנה הניהולית',
      subtitle: '"לתפישתי..." ומסר מסיים',
      question: 'מהי העמדה האישית שלך ("לתפישתי" / "לדעתי") לגבי דרך ההתמודדות הנכונה, ומהו המסר המאזן והמעודד לקורא בסיום?',
      placeholder: 'לדעתי, אין כאן פתרון קסם אחד אלא צורך במענה מערכתי מתמשך... אז בואו ניתן למהלך צ\'אנס ובהצלחה!',
      field: 'personalStance' as const,
      tip: 'זכור: עמדה זהירה שאינה מניפסט, מנוסחת כדעה אישית ("לתפישתי"), ומסתיימת בעידוד ("בהצלחה!").',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onGenerate({
      contentType,
      postLength,
      researchFindings: researchFindings.trim() ? researchFindings : undefined,
      wizardAnswers: answers,
    });
  };

  const handleLoadSample = (sample: SampleIdea) => {
    if (sample.id === 'foreign-workers') {
      setAnswers({
        dilemma: 'העסקת עובדים זרים וירדנים לעבודות משק וניקיון במלונות מול הרצון להעסיק ישראלים וחששות ביטחוניים ותרבותיים.',
        personalBackground: 'מעל 20 שנות ניהול משאבי אנוש במלונות באילת — ראיתי איך מענקים ממשלתיים לא הצליחו להביא ישראלים למקצועות הניקיון לאורך שנים.',
        prosAndCons: 'מחד: מענה מיידי ומציל למחסור הקריטי בידיים עובדות, רמת תחזוקה טובה. מאידך: חששות ביטחוניים, מחסום שפה מול האורח, תלות במדיניות ממשלתית.',
        concreteExample: 'דמיינו מנהל משק שעומד מול 100 חדרים לא מנוקים בשעה 14:00 כשהלובי מלא אורחים זועמים, ובלי עובדים זרים אין מי שינקה.',
        personalStance: 'לתפישתי, זו לא פשרה אידיאלית אלא מענה ישים והכרחי. יש לנהל זאת בכבוד, במקצועיות ובסובלנות. בהצלחה!',
      });
    } else {
      setAnswers({
        dilemma: sample.title,
        personalBackground: 'ניסיון שטח רב-שנים בענף הניהול והמלונאות.',
        prosAndCons: sample.rawContent,
        concreteExample: 'דמיינו מקרה שבו מנהל עומד מול החלטה קשה...',
        personalStance: 'לתפישתי, יש למצוא את האיזון הנכון בין הצרכים השונים. בהצלחה!',
      });
    }
  };

  const lengthOptions: { id: PostLength; label: string; range: string }[] = [
    { id: 'short', label: 'קצר', range: '300-450 מילים' },
    { id: 'medium', label: 'בינוני', range: '600-850 מילים' },
    { id: 'long', label: 'ארוך', range: '1000-1500 מילים' },
  ];

  return (
    <div className="bg-white dark:bg-danbar-900 rounded-2xl shadow-sm border border-gray-200 dark:border-danbar-800 p-6 sm:p-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-danbar-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
            אשף תשאול מונחה: פיתוח רעיון ב-5 שלבים
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            מענה על 5 שאלות מפתח מחלץ את הדילמה, הרקע, טיעוני הבעד/נגד והדוגמה המוחשית לפני כתיבת הפוסט.
          </p>
        </div>

        {/* Post Length Selector & Load sample */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-danbar-800 p-1 rounded-xl border border-gray-200 dark:border-danbar-700">
            {lengthOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPostLength(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  postLength === opt.id
                    ? 'bg-danbar-700 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
                title={opt.range}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_IDEAS[0])}
            className="text-xs bg-danbar-50 dark:bg-danbar-800 hover:bg-danbar-100 text-danbar-700 dark:text-gold-400 px-3 py-1.5 rounded-lg border border-danbar-200 dark:border-danbar-700 font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
            מלא לדוגמה: עובדים זרים
          </button>
        </div>
      </div>

      {/* Steps Progress Indicator */}
      <div className="mt-6">
        <div className="grid grid-cols-5 gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-danbar-600 dark:border-gold-500 bg-danbar-50 dark:bg-danbar-800 ring-2 ring-danbar-600/30 dark:ring-gold-500/30'
                    : isCompleted
                    ? 'border-emerald-300 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-danbar-800 text-gray-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full mb-1 text-xs font-bold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className={isCurrent ? 'text-danbar-800 dark:text-gold-400 font-bold' : ''}>
                      {s.step}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium hidden md:block truncate max-w-full">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Card */}
      <div className="mt-8 bg-gray-50/70 dark:bg-danbar-800/40 rounded-2xl border border-gray-200 dark:border-danbar-700 p-6">
        
        {/* Step Badge & Title */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-danbar-600 dark:text-gold-400">
              <span>שלב {currentStep} מתוך 5</span>
              <span>•</span>
              <span>{currentStepData.subtitle}</span>
            </div>

            {/* Research button for current dilemma */}
            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleConductResearch}
                disabled={isResearching || !answers.dilemma.trim()}
                className="text-xs font-bold text-danbar-700 dark:text-gold-400 hover:text-danbar-900 bg-white dark:bg-danbar-900 hover:bg-danbar-50 px-3 py-1 rounded-lg border border-danbar-200 dark:border-danbar-700 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                {isResearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-danbar-600 dark:text-gold-400" />
                    <span>חוקר ברשת...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-danbar-600 dark:text-gold-400" />
                    <span>בצע מחקר עצמאי באינטרנט</span>
                  </>
                )}
              </button>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {currentStepData.question}
          </h3>
        </div>

        {/* Research Error Alert if any */}
        {researchError && (
          <div className="mb-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex justify-between items-center">
            <span>{researchError}</span>
            <button onClick={() => setResearchError(null)} className="font-bold text-amber-600">סגור</button>
          </div>
        )}

        {/* Research Findings in Wizard */}
        {researchFindings && (
          <div className="mb-4 bg-white/80 dark:bg-danbar-900/80 rounded-xl border border-danbar-200 dark:border-danbar-700 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-danbar-800 dark:text-gold-400">
                <Globe className="w-3.5 h-3.5" />
                <span>ממצאי מחקר מהרשת עבור דילמה זו:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchBox(!showResearchBox)}
                className="text-[11px] text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span>{showResearchBox ? 'הסתר' : 'הצג ממצאים'}</span>
                {showResearchBox ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showResearchBox && (
              <textarea
                rows={4}
                value={researchFindings}
                onChange={(e) => setResearchFindings(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-danbar-950 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-danbar-800 rounded-lg text-xs leading-relaxed font-sans outline-none"
              />
            )}
          </div>
        )}

        {/* Input area */}
        <div className="mt-4">
          <textarea
            rows={5}
            value={answers[currentStepData.field]}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [currentStepData.field]: e.target.value,
              })
            }
            placeholder={currentStepData.placeholder}
            className="w-full p-4 bg-white dark:bg-danbar-900 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-sm sm:text-base placeholder-gray-400 leading-relaxed font-sans"
          />
        </div>

        {/* Tip */}
        <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-danbar-900/60 p-3 rounded-xl border border-gray-100 dark:border-danbar-800">
          <Lightbulb className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <span>{currentStepData.tip}</span>
        </div>

      </div>

      {/* Navigation & Action Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-danbar-800">
        
        {/* Prev button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-danbar-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>שלב קודם</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              setAnswers({ dilemma: '', personalBackground: '', prosAndCons: '', concreteExample: '', personalStance: '' });
              setCurrentStep(1);
            }}
            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="איפוס תשובות"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next / Generate button */}
          {currentStep < 5 ? (\n            <button\n              type=\"button\"\n              onClick={handleNext}\n              className=\"px-6 py-2.5 rounded-xl bg-danbar-800 hover:bg-danbar-900 text-white font-semibold transition-all flex items-center gap-2 text-sm shadow-sm\"\n            >\n              <span>המשך לשלב הבא</span>\n              <ArrowLeft className=\"w-4 h-4\" />\n            </button>\n          ) : (\n            <button\n              type=\"button\"\n              onClick={handleSubmit}\n              disabled={isLoading || !answers.dilemma.trim()}\n              className=\"px-8 py-3 rounded-xl bg-gradient-to-r from-danbar-700 to-danbar-900 hover:from-danbar-800 hover:to-danbar-950 text-white font-semibold shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50\"\n            >\n              {isLoading ? (\n                <>\n                  <Loader2 className=\"w-5 h-5 animate-spin text-gold-400\" />\n                  <span>מעבד וכותב את הפוסט...</span>\n                </>\n              ) : (\n                <>\n                  <Sparkles className=\"w-5 h-5 text-gold-400\" />\n                  <span>הפק פוסט שלם מהתשובות</span>\n                </>\n              )}\n            </button>\n          )}
        </div>

      </div>

    </div>
  );
};
