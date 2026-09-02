import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Share2,
  MessageSquare,
  Layers,
  Lightbulb,
  ArrowLeft,
  Loader2,
  Globe,
  ChevronDown,
  ChevronUp,
  Wand2,
} from 'lucide-react';
import { ContentType, PostLength } from '@/lib/types';
import { SAMPLE_IDEAS, SampleIdea } from '@/lib/samplePosts';

interface RawMaterialTabProps {
  onGenerate: (data: {
    topic: string;
    rawContent: string;
    contentType: ContentType;
    postLength: PostLength;
    researchFindings?: string;
    seriesPart?: string;
    customInstructions?: string;
  }) => void;
  apiKey?: string;
  isLoading: boolean;
}

export const RawMaterialTab: React.FC<RawMaterialTabProps> = ({
  onGenerate,
  apiKey,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [postLength, setPostLength] = useState<PostLength>('medium');
  const [seriesPart, setSeriesPart] = useState('1/3');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dynamic AI Ideas
  const [customIdeas, setCustomIdeas] = useState<Array<{ title: string; category: string; prompt: string }>>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Web Research State
  const [isResearching, setIsResearching] = useState(false);
  const [researchFindings, setResearchFindings] = useState<string>('');
  const [researchSources, setResearchSources] = useState<string[]>([]);
  const [showResearchBox, setShowResearchBox] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const handleSelectSample = (sample: SampleIdea) => {
    setTopic(sample.title);
    setRawContent(sample.rawContent);
  };

  const handleGenerateFreshIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                'הצע 3 רעיונות מקוריים וחדים לפוסטים מקצועיים בדילמות ניהול, טרבל-טק, SaaS ו-AI בעסקים. החזר במבנה JSON: [{"title": "כותרת", "category": "קטגוריה", "prompt": "תיאור קצר של 2 משפטים על הדילמה"}]',
            },
          ],
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const jsonMatch = data.reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setCustomIdeas(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to generate dynamic ideas', e);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleConductResearch = async () => {
    const query = topic.trim() || rawContent.trim().slice(0, 100);
    if (!query) return;

    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: query,
          context: rawContent.trim() ? rawContent.trim().slice(0, 500) : undefined,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'שגיאה בביצוע מחקר הרשת');
      }

      setResearchFindings(data.findings || '');
      setResearchSources(data.sources || []);
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || 'שגיאה בביצוע המחקר');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawContent.trim() && !topic.trim() && !researchFindings.trim()) return;

    onGenerate({
      topic: topic.trim() || 'דילמה ניהולית ומקצועית',
      rawContent: rawContent.trim() || (researchFindings.trim() ? 'ממצאי מחקר ורעיונות רקע' : ''),
      contentType,
      postLength,
      researchFindings: researchFindings.trim() ? researchFindings : undefined,
      seriesPart: contentType === 'series' ? seriesPart : undefined,
      customInstructions: customInstructions.trim() ? customInstructions : undefined,
    });
  };

  const contentTypes = [
    { id: 'blog', label: 'פוסט בלוג מעמיק', icon: FileText, desc: 'מבנה קלאסי מלא: רקע, דילמה, בעד/נגד, דוגמה, עמדה זהירה' },
    { id: 'linkedin', label: 'פוסט לינקדאין / רשתות', icon: Share2, desc: 'ממוקד ומעורר מחשבה, שומר על קול רפלקטיבי ופיסוק חתום' },
    { id: 'opinion', label: 'מאמר דעה מקצועי', icon: MessageSquare, desc: 'ניתוח רחב של תופעה מערכתית בעסקים ובניהול' },
    { id: 'series', label: 'חלק מסדרה (X/Y)', icon: Layers, desc: 'פוסט מתמשך כחלק מסדרת מאמרים מקצועית' },
  ];

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 p-6 sm:p-10 transition-all">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-heading font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
              <FileText className="w-5 h-5" />
            </span>
            יצירה מהירה: מחומר גולמי לפוסט חתום
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans">
            הזן נושא, ראשי פרקים או מחשבות — והסוכן יפתח אותם לפוסט מקיף ומאוזן בקול הייחודי שלך.
          </p>
        </div>

        {/* Dynamic Idea Generator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateFreshIdeas}
            disabled={isGeneratingIdeas}
            className="text-xs font-bold bg-[#142238] text-danbar-300 border border-danbar-500/40 hover:border-danbar-400 hover:bg-[#1b2d4b] rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all shadow-glow-sm"
          >
            {isGeneratingIdeas ? (
              <Loader2 className="w-4 h-4 animate-spin text-danbar-400" />
            ) : (
              <Wand2 className="w-4 h-4 text-danbar-400" />
            )}
            <span>{isGeneratingIdeas ? 'יוצר רעיונות...' : '✨ הצע רעיונות מקוריים (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Ideas Carousel / Pills */}
      <div className="mt-5 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-3">
          <Lightbulb className="w-4 h-4 text-danbar-400" />
          <span>רעיונות ודילמות לעיון מהיר:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(customIdeas.length > 0
            ? customIdeas
            : SAMPLE_IDEAS.map((s) => ({ title: s.title, category: s.category, prompt: s.rawContent }))
          ).map((idea, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                setTopic(idea.title);
                setRawContent(idea.prompt);
              }}
              className="text-right p-3.5 rounded-2xl border border-slate-800 bg-[#090f1c]/90 hover:border-danbar-500/50 hover:bg-[#121c30] transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-danbar-300 line-clamp-1 font-heading">
                  {idea.title}
                </span>
                <span className="text-[10px] text-danbar-300 bg-danbar-950/80 px-2.5 py-0.5 rounded-full shrink-0 border border-danbar-700/40">
                  {idea.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {idea.prompt.slice(0, 120)}...
              </p>
            </button>
          ))}
        </div>
      </div>

            {/* Selected Topic Indication Banner */}
      {topic && (
        <div className="mt-4 bg-[#12233c] border-2 border-[#8db717] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(141,183,23,0.3)] animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-danbar-600 text-white font-black text-xs shadow-glow-sm">
              ✓ רעיון פעיל
            </span>
            <div>
              <span className="text-[11px] font-bold text-danbar-300 block font-heading">
                נושא נבחר לפוסט (השדות הוזנו אוטומטית):
              </span>
              <span className="text-sm font-bold text-white leading-snug">
                {topic}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetSelections}
            className="text-xs bg-red-950/80 hover:bg-red-900 text-red-300 px-3.5 py-2 rounded-xl border border-red-800/80 font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
            title="בטל בחירה ואפס את השדות"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>איפוס בחירה ושדות</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Content Type Selector */}
        <div>
          <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-3">
            פורמט וסוג התוכן
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setContentType(type.id as ContentType)}
                  className={`flex flex-col text-right p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-danbar-500/90 bg-[#121f33] ring-2 ring-danbar-500/25 shadow-glow-sm'
                      : 'border-slate-800 bg-[#090f1c]/90 hover:border-slate-700 hover:bg-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-danbar-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-sm font-heading font-bold text-white">
                      {type.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 leading-snug">
                    {type.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Length Selector */}
        <div>
          <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-3">
            אורך הפוסט המבוקש
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                id: 'short' as PostLength,
                label: 'קצר וממוקד',
                range: '300-450 מילים',
                desc: 'תמציתי ומהודק, אידיאלי לרשתות מקצועיות',
              },
              {
                id: 'medium' as PostLength,
                label: 'בינוני (קלאסי)',
                range: '600-850 מילים',
                desc: 'פוסט בלוג מאוזן ומלא בכל מרכיבי הדילמה',
              },
              {
                id: 'long' as PostLength,
                label: 'ארוך ומעמיק',
                range: '1000-1500 מילים',
                desc: 'מאמר דעה רחב יריעה, ניתוח מערכתי מקיף',
              },
            ].map((opt) => {
              const isSelected = postLength === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPostLength(opt.id)}
                  className={`flex flex-col text-right p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-danbar-500/90 bg-[#121f33] ring-2 ring-danbar-500/25 shadow-glow-sm'
                      : 'border-slate-800 bg-[#090f1c]/90 hover:border-slate-700 hover:bg-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-heading font-bold text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-bold text-danbar-300 bg-danbar-950 px-2.5 py-0.5 rounded-full border border-danbar-700/50">
                      {opt.range}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 leading-snug">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Series part if selected */}
        {contentType === 'series' && (
          <div className="bg-[#090f1c] p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">
              מספר חלק בסדרה (כגון 1/3, 2/4):
            </span>
            <input
              type="text"
              value={seriesPart}
              onChange={(e) => setSeriesPart(e.target.value)}
              className="w-24 text-center font-bold px-3 py-1.5 bg-[#0e1626] border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-danbar-500 outline-none"
              placeholder="1/3"
            />
          </div>
        )}

        {/* Topic input with Web Research Button */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider">
              נושא הפוסט / כותרת רעיונית
            </label>

            {/* Autonomous Web Research Button */}
            <button
              type="button"
              onClick={handleConductResearch}
              disabled={isResearching || (!topic.trim() && !rawContent.trim())}
              className="text-xs font-bold text-danbar-300 hover:text-white bg-[#142238] hover:bg-[#1b2d4b] px-3.5 py-1.5 rounded-xl border border-danbar-500/40 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-danbar-400" />
                  <span>מבצע מחקר עומק ברשת...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-danbar-400" />
                  <span>בצע מחקר עצמאי באינטרנט</span>
                </>
              )}
            </button>
          </div>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="לדוגמה: שיווק B2B של תוכנות SaaS בעולם הטרבל-טק מול שמרנות תפעולית..."
            className="w-full px-4 py-3.5 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-4 focus:ring-danbar-500/15 outline-none transition-all text-sm sm:text-base placeholder-slate-500 shadow-inner"
          />
        </div>

        {/* Web Research Results Box (if available) */}
        {researchError && (
          <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300">
            {researchError}
          </div>
        )}

        {researchFindings && (
          <div className="bg-[#090f1c] border border-danbar-800/80 rounded-2xl p-5 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-heading font-bold text-danbar-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-danbar-400" />
                ממצאי מחקר רשת עצמאי (ישולבו בכתיבה):
              </span>
              <button
                type="button"
                onClick={() => setShowResearchBox(!showResearchBox)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
              >
                <span>{showResearchBox ? 'צמצם' : 'הצג ממצאים'}</span>
                {showResearchBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showResearchBox && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={6}
                  value={researchFindings}
                  onChange={(e) => setResearchFindings(e.target.value)}
                  className="w-full p-3.5 bg-[#0e1626] text-slate-200 border border-slate-700 rounded-xl text-xs leading-relaxed font-sans outline-none focus:ring-2 focus:ring-danbar-500"
                />
                {researchSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      מקורות וקישורים שנמצאו:
                    </span>
                    <ul className="space-y-1">
                      {researchSources.map((src, i) => (
                        <li key={i} className="text-[11px] text-danbar-400 truncate">
                          • {src}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Raw material text area */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider">
              חומר גולמי, נקודות מרכזיות, טיוטה או מחשבות
            </label>
            <span className="text-xs text-slate-400">
              {rawContent.split(/\s+/).filter(Boolean).length} מילים
            </span>
          </div>
          <textarea
            rows={8}
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            placeholder={`הדבק כאן את הנקודות שלך... למשל:
- מה הדילמה המרכזית ומה הכוחות שמתנגשים?
- מה השיקולים בעד ונגד?
- איזה סיפור מהשטח או ניסיון אישי ממחיש את המצב?
- מה העמדה האישית שתרצה להביע בסיום?`}
            className="w-full p-4 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-4 focus:ring-danbar-500/15 outline-none transition-all text-sm sm:text-base placeholder-slate-500 leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* Advanced Instructions Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-danbar-400 hover:text-danbar-300 hover:underline font-bold flex items-center gap-1"
          >
            {showAdvanced ? '- הסתר הנחיות מותאמות אישית' : '+ הוסף דגשים או הנחיות מיוחדות לכתיבה'}
          </button>

          {showAdvanced && (
            <div className="mt-3">
              <textarea
                rows={2}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="למשל: הדגש במיוחד את עולם ה-SaaS והשוק הבינלאומי; שלב את הפתגם 'אליה וקוץ בה'; שמור על טון זהיר ומאוזן..."
                className="w-full p-3.5 bg-[#080d17] text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-xs sm:text-sm placeholder-slate-500"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || (!rawContent.trim() && !topic.trim() && !researchFindings.trim())}
            className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-danbar-600 to-danbar-700 hover:from-danbar-500 hover:to-danbar-600 text-white font-heading font-black text-base shadow-glow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>כותב בסגנון החתום שלך...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span>הפק פוסט מלא בסגנון של דני</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
