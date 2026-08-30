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

  const handleConductResearch = async () => {
    const query = topic.trim() || rawContent.trim().slice(0, 100);
    if (!query) return;

    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          topic: query,\n          context: rawContent.trim() ? rawContent.trim().slice(0, 500) : undefined,\n          apiKey: apiKey || undefined,\n        }),\n      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'שגיאה בביצוע מחקר הרשת');
      }

      setResearchFindings(data.findings || '');
      setResearchSources(data.sources || []);
      setShowResearchBox(true);
    } catch (err: any) {\n      setResearchError(err.message || 'שגיאה בביצוע המחקר');\n    } finally {\n      setIsResearching(false);\n    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawContent.trim() && !topic.trim()) return;

    onGenerate({
      topic,
      rawContent,
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
    { id: 'opinion', label: 'מאמר דעה מקצועי', icon: MessageSquare, desc: 'ניתוח רחב של תופעה מערכתית בענף המלונאות והניהול' },
    { id: 'series', label: 'חלק מסדרה (X/Y)', icon: Layers, desc: 'פוסט מתמשך כחלק מסדרת מאמרים ממוספרת' },
  ];

  return (
    <div className="bg-white dark:bg-danbar-900 rounded-2xl shadow-sm border border-gray-200 dark:border-danbar-800 p-6 sm:p-8">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-danbar-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
            מצב מהיר: מחומר גולמי לפוסט חתום
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            הזן רעיון, טיוטה, הקלטה מתומללת או ראשי פרקים — והסוכן יעבד אותם לפוסט עשיר בסגנון של דני.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
            רעיונות מהשטח:
          </span>
          <select
            onChange={(e) => {
              const selected = SAMPLE_IDEAS.find((s) => s.id === e.target.value);
              if (selected) handleSelectSample(selected);
            }}
            defaultValue=""
            className="text-xs bg-gray-50 dark:bg-danbar-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-danbar-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-danbar-500 outline-none"
          >
            <option value="" disabled>בחר נושא לדוגמה...</option>
            {SAMPLE_IDEAS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Content Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2.5">
            סוג התוכן המבוקש
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setContentType(type.id as ContentType)}
                  className={`flex flex-col text-right p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-danbar-600 dark:border-gold-500 bg-danbar-50/80 dark:bg-danbar-800/80 ring-1 ring-danbar-600 dark:ring-gold-500'
                      : 'border-gray-200 dark:border-danbar-800 hover:border-gray-300 dark:hover:border-danbar-700 bg-white dark:bg-danbar-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-danbar-600 dark:text-gold-400' : 'text-gray-400'}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {type.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {type.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Length Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2.5">
            אורך הפוסט המבוקש
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'short' as PostLength, label: 'קצר וממוקד', range: '300-450 מילים', desc: 'תמציתי ומהודק, מעולה לרשתות חברתיות' },
              { id: 'medium' as PostLength, label: 'בינוני (קלאסי)', range: '600-850 מילים', desc: 'פוסט בלוג מאוזן ומלא בכל המרכיבים' },
              { id: 'long' as PostLength, label: 'ארוך ומעמיק', range: '1000-1500 מילים', desc: 'מאמר דעה רחב יריעה, ניתוח מערכתי מקיף' },
            ].map((opt) => {
              const isSelected = postLength === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPostLength(opt.id)}
                  className={`flex flex-col text-right p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-danbar-600 dark:border-gold-500 bg-danbar-50/80 dark:bg-danbar-800/80 ring-1 ring-danbar-600 dark:ring-gold-500'
                      : 'border-gray-200 dark:border-danbar-800 hover:border-gray-300 dark:hover:border-danbar-700 bg-white dark:bg-danbar-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-bold text-danbar-600 dark:text-gold-400 bg-danbar-100 dark:bg-danbar-800 px-2 py-0.5 rounded-md">
                      {opt.range}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Series part if selected */}
        {contentType === 'series' && (
          <div className="bg-danbar-50 dark:bg-danbar-800/50 p-4 rounded-xl border border-danbar-200 dark:border-danbar-700 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              מספר חלק בסדרה (כגון 1/3, 2/4):
            </span>
            <input
              type="text"
              value={seriesPart}
              onChange={(e) => setSeriesPart(e.target.value)}
              className="w-24 text-center font-bold px-3 py-1.5 bg-white dark:bg-danbar-900 border border-gray-300 dark:border-danbar-700 rounded-lg text-sm focus:ring-2 focus:ring-danbar-500 outline-none"
              placeholder="1/3"
            />
          </div>
        )}

        {/* Topic input with Web Research Button */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              נושא הפוסט / כותרת רעיונית
            </label>

            <button
              type="button"
              onClick={handleConductResearch}
              disabled={isResearching || (!topic.trim() && !rawContent.trim())}
              className="text-xs font-bold text-danbar-700 dark:text-gold-400 hover:text-danbar-900 dark:hover:text-gold-300 bg-danbar-100/70 dark:bg-danbar-800 hover:bg-danbar-200/80 px-3 py-1.5 rounded-lg border border-danbar-200 dark:border-danbar-700 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-danbar-600 dark:text-gold-400" />
                  <span>מבצע מחקר עומק ברשת...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-danbar-600 dark:text-gold-400" />
                  <span>בצע מחקר עצמאי באינטרנט</span>
                </>
              )}
            </button>
          </div>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="לדוגמה: דילמת מבחני המיון הממוחשבים מול אינטואיציה ניהולית..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-danbar-800/60 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 focus:bg-white dark:focus:bg-danbar-800 outline-none transition-all text-sm sm:text-base placeholder-gray-400"
          />
        </div>

        {/* Research Error Alert */}
        {researchError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex justify-between items-center">
            <span>{researchError}</span>
            <button onClick={() => setResearchError(null)} className="font-bold text-amber-600">סגור</button>
          </div>
        )}

        {/* Web Research Findings Box */}
        {researchFindings && (
          <div className="bg-danbar-50/70 dark:bg-danbar-800/50 rounded-2xl border border-danbar-200 dark:border-danbar-700 p-5 space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-danbar-600 dark:text-gold-400" />
                <span className="text-xs sm:text-sm font-bold text-danbar-900 dark:text-white">
                  ממצאי מחקר עצמאי מהרשת (יוטמעו ברקע הפוסט)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchBox(!showResearchBox)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 flex items-center gap-1 font-medium"
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
                  className="w-full p-3 bg-white dark:bg-danbar-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-danbar-700 rounded-xl text-xs leading-relaxed font-sans outline-none focus:ring-2 focus:ring-danbar-500"
                />
                {researchSources.length > 0 && (
                  <div className="pt-1 border-t border-danbar-100 dark:border-danbar-800">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">
                      מקורות וקישורים שנמצאו:
                    </span>
                    <ul className="space-y-1">
                      {researchSources.map((src, i) => (
                        <li key={i} className="text-[11px] text-danbar-700 dark:text-gold-400 truncate">
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              חומר גולמי, נקודות מרכזיות, טיוטה או מחשבות
            </label>
            <span className="text-xs text-gray-400">
              {rawContent.split(/\s+/).filter(Boolean).length} מילים
            </span>
          </div>
          <textarea
            rows={8}
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            placeholder="הדבק כאן את הנקודות שלך..."
            className="w-full p-4 bg-gray-50 dark:bg-danbar-800/60 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 focus:bg-white dark:focus:bg-danbar-800 outline-none transition-all text-sm sm:text-base placeholder-gray-400 leading-relaxed font-sans"
            required
          />
        </div>

        {/* Advanced Instructions Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-danbar-600 dark:text-gold-400 hover:underline font-medium flex items-center gap-1"
          >
            {showAdvanced ? '- הסתר הנחיות מותאמות אישית' : '+ הוסף דגשים או הנחיות מיוחדות לכתיבה'}
          </button>

          {showAdvanced && (
            <div className="mt-3">
              <textarea
                rows={2}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="למשל: הדגש במיוחד את ענף המלונאות באילת בשנות ה-90; שלב את הפתגם 'אליה וקוץ בה'; שמור על טון זהיר במיוחד..."
                className="w-full p-3 bg-gray-50 dark:bg-danbar-800/40 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-xs sm:text-sm placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || (!rawContent.trim() && !topic.trim())}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-danbar-700 to-danbar-900 hover:from-danbar-800 hover:to-danbar-950 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                <span>כותב בסגנון החתום שלך...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
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
