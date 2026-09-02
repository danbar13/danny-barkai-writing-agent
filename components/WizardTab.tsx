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

  // Answers State
  const [answers, setAnswers] = useState({
    dilemma: '',
    personalBackground: '',
    prosAndCons: '',
    concreteExample: '',
    personalStance: '',
  });

  // Selected Idea & Category Filter in Wizard
  const [selectedCategory, setSelectedCategory] = useState<string>('הכל');
  const [selectedIdea, setSelectedIdea] = useState<SampleIdea | null>(null);
  const [showIdeasPicker, setShowIdeasPicker] = useState<boolean>(true);

  const categories = [
    'הכל',
    'TravelTech & B2B SaaS',
    'בינה מלאכותית ומנהיגות',
    'משאבי אנוש ויחסי עבודה',
    'אסטרטגיה וחדשנות',
    'עולם העבודה העתידי',
  ];

  const filteredIdeas =
    selectedCategory === 'הכל'
      ? SAMPLE_IDEAS
      : SAMPLE_IDEAS.filter((idea) => idea.category === selectedCategory);

  const handleSelectIdeaCard = (idea: SampleIdea) => {
    if (selectedIdea?.id === idea.id && answers.dilemma === idea.title) {
      setSelectedIdea(null);
    } else {
      setSelectedIdea(idea);
      if (idea.wizardData) {
        setAnswers({
          dilemma: idea.wizardData.dilemma,
          personalBackground: idea.wizardData.personalBackground,
          prosAndCons: idea.wizardData.prosAndCons,
          concreteExample: idea.wizardData.concreteExample,
          personalStance: idea.wizardData.personalStance,
        });
      } else {
        setAnswers({
          dilemma: idea.title,
          personalBackground: 'ניסיון שטח ומנהיגות בעולמות הניהול, הטכנולוגיה והאירוח.',
          prosAndCons: idea.rawContent,
          concreteExample: 'דמיינו מקרה שבו מנהל עומד מול צומת החלטות מורכב בין הטמעת מערכת חדשה לשמירה על יציבות הצוות...',
          personalStance: 'לתפישתי, יש למצוא את האיזון הראוי בין קידמה טכנולוגית לערך אנושי. בהצלחה!',
        });
      }
    }
  };

  const handleApplyIdeaToWizard = (idea: SampleIdea) => {
    if (idea.wizardData) {
      setAnswers({
        dilemma: idea.wizardData.dilemma,
        personalBackground: idea.wizardData.personalBackground,
        prosAndCons: idea.wizardData.prosAndCons,
        concreteExample: idea.wizardData.concreteExample,
        personalStance: idea.wizardData.personalStance,
      });
    } else {
      setAnswers({
        dilemma: idea.title,
        personalBackground: 'ניסיון שטח ומנהיגות בעולמות הניהול, הטכנולוגיה והאירוח.',
        prosAndCons: idea.rawContent,
        concreteExample: 'דמיינו מקרה שבו מנהל עומד מול צומת החלטות מורכב בין הטמעת מערכת חדשה לשמירה על יציבות הצוות...',
        personalStance: 'לתפישתי, יש למצוא את האיזון הראוי בין קידמה טכנולוגית לערך אנושי. בהצלחה!',
      });
    }
    setCurrentStep(1);
    setShowIdeasPicker(false);
  };

  const handleConductResearchForIdea = async (idea: SampleIdea) => {
    handleApplyIdeaToWizard(idea);
    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: idea.title,
          context: idea.rawContent || idea.description,
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

  // Reset Wizard to defaults
  const handleResetWizard = () => {
    setAnswers({
      dilemma: '',
      personalBackground: '',
      prosAndCons: '',
      concreteExample: '',
      personalStance: '',
    });
    setCurrentStep(1);
    setSelectedIdea(null);
    setSelectedCategory('הכל');
    setPostLength('medium');
    setContentType('blog');
    setResearchFindings('');
    setShowResearchBox(false);
    setResearchError(null);
    setShowIdeasPicker(true);
  };

  const lengthOptions: { id: PostLength; label: string; range: string }[] = [
    { id: 'short', label: 'קצר', range: '300-450 מילים' },
    { id: 'medium', label: 'בינוני', range: '600-850 מילים' },
    { id: 'long', label: 'ארוך', range: '1000-1500 מילים' },
  ];

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 p-6 sm:p-10 transition-all">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-heading font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
              <Compass className="w-5 h-5" />
            </span>
            אשף תשאול מונחה: פיתוח רעיון ב-5 שלבים
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans">
            מענה על 5 שאלות מפתח מחלץ את הדילמה, הרקע, טיעוני הבעד/נגד והדוגמה המוחשית לפני כתיבת הפוסט.
          </p>
        </div>

        {/* Post Length Selector, Reset, & Load sample */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetWizard}
            className="text-xs bg-[#101827] hover:bg-[#182338] text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700/80 font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="איפוס כל שלבי האשף, הבחירות, הנושא, האורך והשדות לברירות המחדל"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>איפוס שלבים</span>
          </button>

          <div className="flex items-center gap-1 bg-[#090f1c] p-1.5 rounded-2xl border border-slate-800">
            {lengthOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPostLength(opt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  postLength === opt.id
                    ? 'bg-danbar-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={opt.range}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowIdeasPicker(!showIdeasPicker)}
            className="text-xs bg-[#142238] hover:bg-[#1b2d4b] text-danbar-300 px-3.5 py-2 rounded-xl border border-danbar-500/40 font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-danbar-400" />
            <span>{showIdeasPicker ? 'הסתר הצעות לנושאים' : '💡 בחר נושא מוצע לאשף'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Topics Selector in Wizard */}
      {showIdeasPicker && (
        <div className="mt-6 pb-6 border-b border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-heading font-extrabold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-danbar-400" />
              <span>נושאים ודילמות מוצעים למילוי האשף (לחץ לבחירה ומידע מורחב):</span>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-danbar-600 text-white shadow-glow-sm'
                      : 'bg-[#090f1c] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIdeas.map((idea) => {
              const isSelected =
                selectedIdea?.id === idea.id ||
                (Boolean(answers.dilemma) &&
                  (answers.dilemma.trim() === idea.title.trim() ||
                    (idea.wizardData && answers.dilemma.trim() === idea.wizardData.dilemma.trim())));
              return (
                <button
                  type="button"
                  key={idea.id}
                  onClick={() => handleSelectIdeaCard(idea)}
                  className={`text-right p-4 rounded-2xl transition-all text-sm flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#8db717] bg-[#12233c] ring-4 ring-[#8db717]/35 shadow-[0_0_22px_rgba(141,183,23,0.45)]'
                      : 'border border-slate-800 bg-[#090f1c]/90 hover:border-danbar-500/50 hover:bg-[#0f182c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-danbar-300 bg-danbar-950/90 px-2.5 py-0.5 rounded-full border border-danbar-700/40">
                        {idea.category}
                      </span>
                      {isSelected ? (
                        <span className="text-[11px] font-bold text-white bg-danbar-600 px-2.5 py-0.5 rounded-full border border-danbar-400 shadow-glow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          רעיון נבחר לאשף ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                          לחץ לבחירה
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-heading font-bold text-slate-100 group-hover:text-white line-clamp-2 leading-snug mb-1.5">
                      {idea.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {idea.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-danbar-400 font-semibold">
                    <span>{isSelected ? '✓ רעיון פעיל באשף (לחץ לצמצום)' : 'לחץ להרחבה ובחירה'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180 text-danbar-300' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Idea Details in Wizard */}
          {selectedIdea && (
            <div className="bg-[#091120] border-2 border-danbar-500/70 rounded-2xl p-5 sm:p-6 shadow-glow-md space-y-4 animate-fadeIn transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-danbar-300 bg-danbar-950 px-3 py-1 rounded-full border border-danbar-700/50">
                      {selectedIdea.category}
                    </span>
                    <span className="text-xs text-slate-400">מידע מלא אודות הדילמה</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white leading-snug">
                    {selectedIdea.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIdea(null)}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 self-start shrink-0"
                >
                  סגור מידע ✕
                </button>
              </div>

              {/* Dilemma Description */}
              <div className="space-y-1.5">
                <h5 className="text-xs font-heading font-bold text-danbar-300">
                  🎯 הדילמה והאתגר המרכזי:
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-[#0e172a] p-3 rounded-xl border border-slate-800">
                  {selectedIdea.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleApplyIdeaToWizard(selectedIdea)}
                    className="px-5 py-2.5 rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white text-xs sm:text-sm font-heading font-bold shadow-glow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>✓ החל נושא זה על כל 5 שלבי האשף</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConductResearchForIdea(selectedIdea)}
                    disabled={isResearching}
                    className="px-4 py-2.5 rounded-xl bg-[#14233c] hover:bg-[#1b2f50] text-danbar-300 hover:text-white border border-danbar-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isResearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-danbar-400" />
                        <span>חוקר במקורות מידע...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-danbar-400" />
                        <span>בצע מחקר עומק ברשת על דילמה זו</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Topic Indication Banner in Wizard */}
      {selectedIdea && (
        <div className="mt-4 bg-[#12233c] border-2 border-[#8db717] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(141,183,23,0.3)] animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-danbar-600 text-white font-black text-xs shadow-glow-sm">
              ✓ רעיון פעיל באשף
            </span>
            <div>
              <span className="text-[11px] font-bold text-danbar-300 block font-heading">
                נושא נבחר לתשאול מונחה:
              </span>
              <span className="text-sm font-bold text-white leading-snug">
                {selectedIdea.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetWizard}
            className="text-xs bg-red-950/80 hover:bg-red-900 text-red-300 px-3.5 py-2 rounded-xl border border-red-800/80 font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
            title="אפס את כל שלבי האשף והבחירה"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>איפוס שלבי האשף</span>
          </button>
        </div>
      )}

      {/* Steps Progress Indicator */}
      <div className="mt-6">
        <div className="grid grid-cols-5 gap-2.5">
          {steps.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-danbar-500 bg-[#121f33] ring-2 ring-danbar-500/25 shadow-glow-sm'
                    : isCompleted
                    ? 'border-emerald-700/60 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-[#090f1c]/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full mb-1 text-xs font-heading font-bold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className={isCurrent ? 'text-danbar-400 font-black' : ''}>
                      {s.step}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold font-heading hidden md:block truncate max-w-full">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Card */}
      <div className="mt-8 bg-[#090f1c] rounded-2xl border border-slate-800 p-6 sm:p-8">
        
        {/* Step Badge & Title */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-heading font-extrabold uppercase tracking-wider text-danbar-400">
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
                className="text-xs font-bold text-danbar-300 hover:text-white bg-[#142238] hover:bg-[#1b2d4b] px-3.5 py-1.5 rounded-xl border border-danbar-500/40 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                {isResearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-danbar-400" />
                    <span>חוקר ברשת...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-danbar-400" />
                    <span>בצע מחקר עצמאי באינטרנט</span>
                  </>
                )}
              </button>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-heading font-bold text-white">
            {currentStepData.question}
          </h3>
        </div>

        {/* Research Error Alert if any */}
        {researchError && (
          <div className="mb-3 bg-red-950/40 border border-red-800 p-3 rounded-xl text-xs text-red-300 flex justify-between items-center">
            <span>{researchError}</span>
            <button onClick={() => setResearchError(null)} className="font-bold text-red-400">סגור</button>
          </div>
        )}

        {/* Research Findings in Wizard */}
        {researchFindings && (
          <div className="mb-4 bg-[#0e1626] rounded-xl border border-danbar-800/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-danbar-300">
                <Globe className="w-3.5 h-3.5 text-danbar-400" />
                <span>ממצאי מחקר מהרשת עבור דילמה זו:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchBox(!showResearchBox)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <span>{showResearchBox ? 'הסתר' : 'הצג ממצאים'}</span>
                {showResearchBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
            {showResearchBox && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={4}
                  value={researchFindings}
                  onChange={(e) => setResearchFindings(e.target.value)}
                  className="w-full p-3 bg-[#080d17] text-slate-200 border border-slate-700 rounded-xl text-xs leading-relaxed font-sans outline-none focus:ring-2 focus:ring-danbar-500"
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
            className="w-full p-4 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-4 focus:ring-danbar-500/15 outline-none text-sm sm:text-base placeholder-slate-500 leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* Tip */}
        <div className="mt-3.5 flex items-start gap-2.5 text-xs text-slate-400 bg-[#0e1626] p-3.5 rounded-xl border border-slate-800">
          <Lightbulb className="w-4 h-4 text-danbar-400 shrink-0 mt-0.5" />
          <span>{currentStepData.tip}</span>
        </div>

      </div>

      {/* Navigation & Action Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
        
        {/* Prev button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm shadow-xs"
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
            className="p-2.5 text-slate-400 hover:text-white transition-colors"
            title="איפוס תשובות"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next / Generate button */}
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold transition-all flex items-center gap-2 text-sm shadow-xs"
            >
              <span>המשך לשלב הבא</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !answers.dilemma.trim()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-danbar-600 to-danbar-700 hover:from-danbar-500 hover:to-danbar-600 text-white font-heading font-black shadow-glow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>מעבד וכותב את הפוסט...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>הפק פוסט שלם מהתשובות</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
