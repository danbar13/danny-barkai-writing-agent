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
  RotateCcw,
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

  // Selected Idea & Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('הכל');
  const [selectedIdea, setSelectedIdea] = useState<SampleIdea | null>(null);

  // Reset all selections to defaults
  const handleResetSelections = () => {
    setTopic('');
    setRawContent('');
    setSelectedIdea(null);
    setSelectedCategory('הכל');
    setPostLength('medium');
    setContentType('blog');
    setSeriesPart('1/3');
    setCustomInstructions('');
    setResearchFindings('');
    setResearchSources([]);
    setShowResearchBox(false);
    setResearchError(null);
  };

  const categories = [
    'הכל',
    'TravelTech & B2B SaaS',
    'בינה מלאכותית ומנהיגות',
    'משאבי אנוש ויחסי עבודה',
    'אסטרטגיה וחדשנות',
    'עולם העבודה העתידי',
  ];

  const allIdeas: SampleIdea[] = [
    ...SAMPLE_IDEAS,
    ...customIdeas.map((ci, idx) => ({
      id: `custom-${idx}`,
      title: ci.title,
      category: ci.category,
      description: ci.prompt,
      rawContent: ci.prompt,
    })),
  ];

  const filteredIdeas =
    selectedCategory === 'הכל'
      ? allIdeas
      : allIdeas.filter((idea) => idea.category === selectedCategory);

  const handleSelectIdeaCard = (idea: SampleIdea) => {
    if (selectedIdea?.id === idea.id && topic === idea.title) {
      // If clicked again, just collapse the details view but keep content
      setSelectedIdea(null);
    } else {
      setSelectedIdea(idea);
      setTopic(idea.title);
      setRawContent(idea.rawContent);
    }
  };

  const handleApplySelectedIdea = (idea: SampleIdea) => {
    setSelectedIdea(idea);
    setTopic(idea.title);
    setRawContent(idea.rawContent);
    // Smooth scroll down to the inputs
    setTimeout(() => {
      const el = document.getElementById('topic-input-field');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
    }, 100);
  };

  const handleConductResearchForIdea = async (idea: SampleIdea) => {
    setTopic(idea.title);
    setRawContent(idea.rawContent);
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
      setResearchSources(data.sources || []);
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || 'שגיאה בביצוע המחקר');
    } finally {
      setIsResearching(false);
    }
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
                'הצע 3 רעיונות מקוריים וחדים לפוסטים מקצועיים בדילמות ניהול, טרבל-טק, SaaS, משאבי אנוש ו-AI בעסקים. החזר במבנה JSON בלבד: [{"title": "כותרת מלאה של הדילמה", "category": "TravelTech & B2B SaaS | בינה מלאכותית ומנהיגות | משאבי אנוש ויחסי עבודה | אסטרטגיה וחדשנות", "prompt": "תיאור מפורט של הדילמה ושני הצדדים"}]',
            },
          ],
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.reply || data.message) {
        const replyText = data.reply || data.message;
        const jsonMatch = replyText.match(/\[[\s\S]*\]/);
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
    const query = topic.trim() || (selectedIdea ? selectedIdea.title : rawContent.trim().slice(0, 100));
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
            בחר נושא מוצע לעיון וקבלת מידע מלא, או הזן נושא וראשים משלך — והסוכן יפתח אותם לפוסט מקיף ומאוזן בקולך.
          </p>
        </div>

        {/* Toolbar: Reset & Dynamic Idea Generator */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleResetSelections}
            className="text-xs font-bold bg-[#101827] hover:bg-[#182338] text-slate-300 hover:text-white border border-slate-700/80 rounded-xl px-3.5 py-2.5 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="איפוס כל הבחירות, הנושא, האורך והשדות לברירות המחדל"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>איפוס בחירות ושדות</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateFreshIdeas}
            disabled={isGeneratingIdeas}
            className="text-xs font-bold bg-[#142238] text-danbar-300 border border-danbar-500/40 hover:border-danbar-400 hover:bg-[#1b2d4b] rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all shadow-glow-sm cursor-pointer"
          >
            {isGeneratingIdeas ? (
              <Loader2 className="w-4 h-4 animate-spin text-danbar-400" />
            ) : (
              <Wand2 className="w-4 h-4 text-danbar-400" />
            )}
            <span>{isGeneratingIdeas ? 'מייצר רעיונות...' : '✨ הצע עוד רעיונות (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Ideas Section with Category Filter and Expanded Info Box */}
      <div className="mt-6 pb-6 border-b border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-heading font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-danbar-400" />
            <span>נושאים ודילמות מוצעים לכתיבה (לחץ לבחירה ומידע מורחב):</span>
          </div>

          {/* Category Filter Pills */}
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

        {/* Topics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredIdeas.map((idea) => {
            const isSelected = selectedIdea?.id === idea.id || (Boolean(topic) && topic.trim() === idea.title.trim());
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
                        רעיון נבחר ✓
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
                  <span>{isSelected ? '✓ רעיון פעיל (לחץ לצמצום)' : 'לחץ להרחבה ובחירה'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180 text-danbar-300' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Idea Expanded Details Box */}
        {selectedIdea && (
          <div className="bg-[#091120] border-2 border-danbar-500/70 rounded-2xl p-5 sm:p-6 shadow-glow-md space-y-4 animate-fadeIn transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-danbar-300 bg-danbar-950 px-3 py-1 rounded-full border border-danbar-700/50">
                    {selectedIdea.category}
                  </span>
                  <span className="text-xs text-slate-400">מידע מלא אודות הנושא הנבחר</span>
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

            {/* Raw Points / Perspectives */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-heading font-bold text-danbar-300">
                💡 ראשי פרקים, טיעוני בעד ונגד וחומר רקע:
              </h5>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-[#0e172a] p-3.5 rounded-xl border border-slate-800 whitespace-pre-line">
                {selectedIdea.rawContent}
              </div>
            </div>

            {/* Action Buttons inside Info Box */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleApplySelectedIdea(selectedIdea)}
                  className="px-5 py-2.5 rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white text-xs sm:text-sm font-heading font-bold shadow-glow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✓ בחר והחל נושא זה על שדות הכתיבה</span>
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
                      <span>בצע מחקר עומק ברשת על נושא זה</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                ניתן לערוך ולהוסיף מחשבות אישיות לאחר ההחלה
              </span>
            </div>
          </div>
        )}
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
                  className={`flex flex-col text-right p-4 rounded-2xl transition-all ${
                    isSelected
                      ? 'border-2 border-[#8db717] bg-[#12233c] ring-2 ring-[#8db717]/30 shadow-glow-sm'
                      : 'border border-slate-800 bg-[#090f1c]/90 hover:border-slate-700 hover:bg-[#0f172a]'
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
                desc: 'מאמר דעה רחב יריעה, ניתוח מערכתיך ח�קיף',
              },
            ].map((opt) => {
              const isSelected = postLength === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPostLength(opt.id)}
                  className={`flex flex-col text-right p-4 rounded-2xl transition-all ${
                    isSelected
                      ? 'border-2 border-[#8db717] bg-[#12233c] ring-2 ring-[#8db717]/30 shadow-glow-sm'
                      : 'border border-slate-800 bg-[#090f1c]/90 hover:border-slate-700 hover:bg-[#0f172a]'
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
            id="topic-input-field"
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
