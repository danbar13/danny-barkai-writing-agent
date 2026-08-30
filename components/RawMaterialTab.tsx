import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Search,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { PostFormat, PostLength } from '@/lib/types';
import { SAMPLE_IDEAS, SampleIdea } from '@/lib/samplePosts';

interface RawMaterialTabProps {
  apiKey: string;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  setGeneratedPost: (post: string) => void;
}

export const RawMaterialTab: React.FC<RawMaterialTabProps> = ({
  apiKey,
  isGenerating,
  setIsGenerating,
  setGeneratedPost,
}) => {
  const [rawText, setRawText] = useState('');
  const [format, setFormat] = useState<PostFormat>('regular');
  const [postLength, setPostLength] = useState<PostLength>('medium');
  const [isResearching, setIsResearching] = useState(false);
  const [researchSummary, setResearchSummary] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectIdea = (idea: SampleIdea) => {
    setSelectedIdeaId(idea.id);
    setRawText(idea.rawContent);
    setErrorMessage('');
  };

  const handleRunWebResearch = async () => {
    if (!rawText.trim()) {
      setErrorMessage('נא להזין נושא או רעיון ראשוני לפני הפעלת מחקר רשת.');
      return;
    }
    setErrorMessage('');
    setIsResearching(true);

    try {
      const topicQuery = rawText.trim().split('\n')[0].slice(0, 120);
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
    if (!rawText.trim()) {
      setErrorMessage('נא להזין חומר גולמי, רעיון או לבחור מנושאי ההשראה.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'raw',
          rawContent: rawText,
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
      setErrorMessage(err.message || 'אירעה שגיאה בחיבור למודל. אנא בדוק את הגדרות ה-API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Inspiration Cards */}
      <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-luxury-card transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
              <Lightbulb className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-white">
                רעיונות ודילמות מקוריות לכתיבה ומחקר
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
                בחר נושא להזנה מהירה או כתוב נושא חופשי בכל עולם תוכן:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SAMPLE_IDEAS.map((idea) => {
            const isSelected = selectedIdeaId === idea.id;
            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => handleSelectIdea(idea)}
                className={`text-right p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-danbar-500 bg-danbar-950/40 shadow-glow-sm ring-1 ring-danbar-500'
                    : 'border-slate-800 bg-[#090f1c] hover:border-slate-700 hover:bg-[#121c30]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-danbar-950 text-danbar-400 border border-danbar-800">
                    {idea.category}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-danbar-400 font-heading">
                      נבחר ✓
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-heading font-bold text-slate-100 group-hover:text-white line-clamp-2">
                  {idea.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                  {idea.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-luxury-card transition-all space-y-6">

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-sans">{errorMessage}</div>
          </div>
        )}

        {/* Textarea */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="block text-sm font-heading font-black text-white">
              חומר גולמי, נושא לפוסט או רשימת נקודות
            </label>
            <span className="text-xs text-slate-400 font-sans">
              טקסט חופשי, קישור לרעיון או תיאור מקרה
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setSelectedIdeaId(null);
            }}
            rows={7}
            placeholder="למשל: לאחרונה נתקלתי בדילמה סביב שיווק B2B של תוכנות SAAS בעולם הטרבל טק. מחד, יזמים מבטיחים אוטומציה של AI. מאידך, מנהלי בתי המלון חוששים מאובדן הקשר האנושי ומהחלפת מערכות ותיקות..."
            className="w-full p-4.5 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-2 focus:ring-danbar-500/20 outline-none text-sm leading-relaxed placeholder-slate-500 transition-all shadow-inner font-sans"
          />
        </div>

        {/* Web Research Button & Result */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRunWebResearch}
              disabled={isResearching || !rawText.trim()}
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
                  <span>בצע מחקר עצמאי באינטרנט</span>
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

        {/* Options Row: Post Length & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">

          {/* Post Length Selector */}
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

          {/* Format Selector */}
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

        {/* Generate Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !rawText.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-danbar-600 via-danbar-500 to-danbar-600 hover:opacity-95 text-white font-heading font-black text-base shadow-glow-md transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>דני ברקאי חושב, מנתח ומנסח את הפוסט...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>הפק פוסט בסגנון דני ברקאי (DANBAR)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
