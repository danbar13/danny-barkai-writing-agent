import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Search,
  Globe,
} from 'lucide-react';
import { WizardData, PostFormat, PostLength } from '@/lib/types';
import { SAMPLE_IDEAS, SampleIdea } from '@/lib/samplePosts';

interface WizardTabProps {
  apiKey: string;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  setGeneratedPost: (post: string) => void;
}

export const WizardTab: React.FC<WizardTabProps> = ({
  apiKey,
  isGenerating,
  setIsGenerating,
  setGeneratedPost,
}) => {
  const [step, setStep] = useState<number>(1);
  const [format, setFormat] = useState<PostFormat>('regular');
  const [postLength, setPostLength] = useState<PostLength>('medium');
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [formData, setFormData] = useState<WizardData>({
    dilemma: '',
    personalBackground: '',
    prosAndCons: '',
    concreteExample: '',
    personalStance: '',
  });

  const handleFieldChange = (field: keyof WizardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleLoadSample = (idea: SampleIdea) => {
    if (idea.wizardData) {
      setFormData(idea.wizardData);
    } else {
      setFormData({
        dilemma: idea.title,
        personalBackground: idea.description,
        prosAndCons: idea.rawContent,
        concreteExample: 'דוגמה מהשטח מתוך הפעילות והניסיון המעשי בארגון...',
        personalStance: 'לתפישתי, נדרש שילוב מאוזן והקשבה לשטח תוך אימוץ הדרגתי של הטכנולוגיה.',
      });
    }
  };

  const handleRunWebResearch = async () => {
    const topicQuery = (formData.dilemma || formData.personalBackground || '').trim().slice(0, 120);
    if (!topicQuery) {
      setErrorMessage('נא להזין את הדילמה או הרקע בשלב 1 לפני הפעלת מחקר רשת.');
      return;
    }
    setErrorMessage('');
    setIsResearching(true);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicQuery,
          customApiKey: apiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'שגיאה בביצוע מחקר הרשת');
      }

      setResearchSummary(data.researchSummary);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`שגיאה בביצוע מחקר רשת: ${err.message || 'נסה שוב מאוחר יותר'}`);
    } finally {
      setIsResearching(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.dilemma.trim()) {
      setErrorMessage('נא להגדיר לפחות את הדילמה המרכזית בשלב 1.');
      setStep(1);
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wizard',
          wizardData: formData,
          researchContext: researchSummary || undefined,
          postLength: postLength,
          format: format,
          customApiKey: apiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'שגיאה ביצירת הפוסט');
      }

      setGeneratedPost(data.post);
      setTimeout(() => {
        const previewElement = document.getElementById('post-preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'אירעה שגיאה בחיבור למודל.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stepsInfo = [
    {
      num: 1,
      title: 'הדילמה והמתח',
      sub: 'מהם שני הכוחות המתנגשים?',
      field: 'dilemma' as keyof WizardData,
      placeholder: 'למשל: יזמות ו-SaaS מול שמרנות תפעולית במלונאות, או AI אוטונומי מול שיקול דעת אנושי...',
      hint: 'תמיד לחשוב בשני קצוות: מחד כוח X ומאידך כוח Y.',
    },
    {
      num: 2,
      title: 'רקע וניגוד היסטורי',
      sub: 'מה היה בעבר לעומת המציאות כיום?',
      field: 'personalBackground' as keyof WizardData,
      placeholder: 'למשל: בעבר נדרשו חודשים להטמעת שינוי, כיום כלי AI מאפשרים אוטומציה מיידית...',
      hint: 'עוזר לקורא להבין את ציר הזמן ואת חשיבות הרגע הנוכחי.',
    },
    {
      num: 3,
      title: 'טיעוני בעד ונגד',
      sub: 'מהם השיקולים הלגיטימיים של כל צד?',
      field: 'prosAndCons' as keyof WizardData,
      placeholder: 'מחד: התייעלות, חיסכון בעלויות וזמינות 24/7. מאידך: פחד מאיבוד השירות האישי, התנגדות צוותי השטח...',
      hint: 'בסגנון דני אין "צד רע" — לשני הצדדים יש מניעים הגיוניים ומובנים.',
    },
    {
      num: 4,
      title: 'דוגמה מוחשית מהשטח',
      sub: 'דמיינו לעצמכם מקרה שבו...',
      field: 'concreteExample' as keyof WizardData,
      placeholder: 'למשל: מנהל משק שסירב לעבוד עם אפליקציית הטאבלט בגלל שפה והעדיף פנקס...',
      hint: 'העוגן הפרקטיקאי שנותן אמינות מיידית ומחבר את התיאוריה למציאות.',
    },
    {
      num: 5,
      title: 'עמדה זהירה ומסר מסיים',
      sub: 'מהי התובנה והעידוד לקורא?',
      field: 'personalStance' as keyof WizardData,
      placeholder: 'למשל: לתפישתי, הטכנולוגיה מנצחת רק כשמכבדים את המשתמשים בשטח. בהצלחה!',
      hint: 'זהירות במסקנה, הדגשה שזו עמדה אישית ("לתפישתי"), וסיום מעודד ("בהצלחה!").',
    },
  ];

  const currentStepInfo = stepsInfo[step - 1];

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-luxury-card transition-all space-y-8">

      {/* Top Header & Progress */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-danbar-400" />
              אשף כתיבה מונחה — 5 שלבי החשיבה של דני
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
              עונים על שאלה אחת בכל שלב ומייצרים פוסט אנליטי מושלם
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-heading font-bold">טען נושא מוכן:</span>
            <select
              onChange={(e) => {
                const found = SAMPLE_IDEAS.find((i) => i.id === e.target.value);
                if (found) handleLoadSample(found);
              }}
              className="text-xs bg-[#090f1c] text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 focus:border-danbar-500 outline-none font-sans"
              defaultValue=""
            >
              <option value="" disabled>בחר דילמה לדוגמה...</option>
              {SAMPLE_IDEAS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5 Steps Pill Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {stepsInfo.map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num || Boolean(formData[s.field]?.trim());
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`py-2 px-2 rounded-xl text-center transition-all border ${
                  isActive
                    ? 'bg-danbar-600 text-white border-danbar-500 shadow-glow-sm'
                    : isCompleted
                    ? 'bg-[#090f1c] text-danbar-400 border-danbar-700/40'
                    : 'bg-[#080d17] text-slate-500 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-heading font-black truncate">
                  {s.num}. {s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-sans">{errorMessage}</div>
        </div>
      )}

      {/* Current Step Input */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-danbar-400 uppercase tracking-wider font-heading">
              שלב {currentStepInfo.num} מתוך 5
            </span>
            <h3 className="text-base sm:text-lg font-heading font-black text-white mt-1">
              {currentStepInfo.title}: {currentStepInfo.sub}
            </h3>
          </div>
        </div>

        <textarea
          value={formData[currentStepInfo.field]}
          onChange={(e) => handleFieldChange(currentStepInfo.field, e.target.value)}
          rows={6}
          placeholder={currentStepInfo.placeholder}
          className="w-full p-4.5 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-2 focus:ring-danbar-500/20 outline-none text-sm leading-relaxed placeholder-slate-500 font-sans shadow-inner"
        />

        <div className="p-3.5 rounded-2xl bg-[#090f1c] border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-sans">
          <HelpCircle className="w-4 h-4 text-danbar-400 shrink-0" />
          <span>טיפ לסגנון דני: {currentStepInfo.hint}</span>
        </div>
      </div>

      {/* Web Research Button on Step 1 */}
      {step === 1 && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRunWebResearch}
              disabled={isResearching || !formData.dilemma.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-danbar-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-danbar-400" />
                  <span>מבצע מחקר עצמאי באינטרנט...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-danbar-400" />
                  <span>בצע מחקר עצמאי באינטרנט על הדילמה</span>
                </>
              )}
            </button>

            {researchSummary && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                ✓ מחקר הרשת הושלם וישולב בניסוח הפוסט
              </span>
            )}
          </div>

          {researchSummary && (
            <div className="p-4 rounded-2xl bg-[#090f1c] border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn font-sans">
              <div className="flex items-center justify-between font-heading font-bold text-white">
                <span className="flex items-center gap-1.5 text-danbar-400">
                  <Globe className="w-3.5 h-3.5" />
                  תמצית ממצאי מחקר הרשת:
                </span>
                <button
                  type="button"
                  onClick={() => setResearchSummary('')}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  הסר מחקר
                </button>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{researchSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* Options Row (Visible on Step 5 or accessible) */}
      {step === 5 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-2.5">
              אורך הפוסט המבוקש
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'short', label: 'קצר וממוקד', sub: '200-350 מילים' },
                { id: 'medium', label: 'בינוני (סטנדרטי)', sub: '400-600 מילים' },
                { id: 'long', label: 'ארוך ומעמיק', sub: '700-1100 מילים' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPostLength(opt.id as PostLength)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-center ${
                    postLength === opt.id
                      ? 'border-danbar-500 bg-danbar-950/50 text-white shadow-glow-sm ring-1 ring-danbar-500'
                      : 'border-slate-800 bg-[#090f1c] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-heading font-black">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-2.5">
              מבנה ופורמט הפוסט
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'regular', label: 'פוסט לינקדאין / בלוג', sub: 'מבנה מלא ואנליטי' },
                { id: 'short_pulse', label: 'פולס מהיר', sub: 'דילמה חדה וממוקדת' },
                { id: 'case_study', label: 'תיאור מקרה', sub: 'ניתוח אירוע מהשטח' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormat(fmt.id as PostFormat)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-center ${
                    format === fmt.id
                      ? 'border-danbar-500 bg-danbar-950/50 text-white shadow-glow-sm ring-1 ring-danbar-500'
                      : 'border-slate-800 bg-[#090f1c] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-heading font-black">{fmt.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{fmt.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-heading font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>שלב קודם</span>
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => Math.min(5, prev + 1))}
            className="px-6 py-2.5 rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-1.5 shadow-glow-sm"
          >
            <span>המשך לשלב הבא</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !formData.dilemma.trim()}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-danbar-600 to-danbar-500 hover:opacity-95 text-white text-sm sm:text-base font-heading font-black shadow-glow-md transition-all flex items-center gap-2 disabled:opacity-40"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>מנסח פוסט...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>הפק פוסט שלם</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
};
