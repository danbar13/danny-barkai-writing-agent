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
  const [selectedCategory, setSelectedCategory] = useState<string>('×”×›×œ');
  const [selectedIdea, setSelectedIdea] = useState<SampleIdea | null>(null);

  // Reset all selections to defaults
  const handleResetSelections = () => {
    setTopic('');
    setRawContent('');
    setSelectedIdea(null);
    setSelectedCategory('×”×›×œ');
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
    '×”×›×œ',
    'TravelTech & B2B SaaS',
    '×‘×™× ×” ×ž×œ××›×•×ª×™×ª ×•×ž× ×”×™×’×•×ª',
    '×ž×©××‘×™ ×× ×•×© ×•×™×—×¡×™ ×¢×‘×•×“×”',
    '××¡×˜×¨×˜×’×™×” ×•×—×“×©× ×•×ª',
    '×¢×•×œ× ×”×¢×‘×•×“×” ×”×¢×ª×™×“×™',
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
    selectedCategory === '×”×›×œ'
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
        throw new Error(data.error || '×©×’×™××” ×‘×‘×™×¦×•×¢ ×ž×—×§×¨ ×”×¨×©×ª');
      }

      setResearchFindings(data.findings || '');
      setResearchSources(data.sources || []);
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || '×©×’×™××” ×‘×‘×™×¦×•×¢ ×”×ž×—×§×¨');
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
                '×”×¦×¢ 3 ×¨×¢×™×•× ×•×ª ×ž×§×•×¨×™×™× ×•×—×“×™× ×œ×¤×•×¡×˜×™× ×ž×§×¦×•×¢×™×™× ×‘×“×™×œ×ž×•×ª × ×™×”×•×œ, ×˜×¨×‘×œ-×˜×§, SaaS, ×ž×©××‘×™ ×× ×•×© ×•-AI ×‘×¢×¡×§×™×. ×”×—×–×¨ ×‘×ž×‘× ×” JSON ×‘×œ×‘×“: [{"title": "×›×•×ª×¨×ª ×ž×œ××” ×©×œ ×”×“×™×œ×ž×”", "category": "TravelTech & B2B SaaS | ×‘×™× ×” ×ž×œ××›×•×ª×™×ª ×•×ž× ×”×™×’×•×ª | ×ž×©××‘×™ ×× ×•×© ×•×™×—×¡×™ ×¢×‘×•×“×” | ××¡×˜×¨×˜×’×™×” ×•×—×“×©× ×•×ª", "prompt": "×ª×™××•×¨ ×ž×¤×•×¨×˜ ×©×œ ×”×“×™×œ×ž×” ×•×©× ×™ ×”×¦×“×“×™×"}]',
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
        throw new Error(data.error || '×©×’×™××” ×‘×‘×™×¦×•×¢ ×ž×—×§×¨ ×”×¨×©×ª');
      }

      setResearchFindings(data.findings || '');
      setResearchSources(data.sources || []);
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || '×©×’×™××” ×‘×‘×™×¦×•×¢ ×”×ž×—×§×¨');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawContent.trim() && !topic.trim() && !researchFindings.trim()) return;

    onGenerate({
      topic: topic.trim() || '×“×™×œ×ž×” × ×™×”×•×œ×™×ª ×•×ž×§×¦×•×¢×™×ª',
      rawContent: rawContent.trim() || (researchFindings.trim() ? '×ž×ž×¦××™ ×ž×—×§×¨ ×•×¨×¢×™×•× ×•×ª ×¨×§×¢' : ''),
      contentType,
      postLength,
      researchFindings: researchFindings.trim() ? researchFindings : undefined,
      seriesPart: contentType === 'series' ? seriesPart : undefined,
      customInstructions: customInstructions.trim() ? customInstructions : undefined,
    });
  };

  const contentTypes = [
    { id: 'blog', label: '×¤×•×¡×˜ ×‘×œ×•×’ ×ž×¢×ž×™×§', icon: FileText, desc: '×ž×‘× ×” ×§×œ××¡×™ ×ž×œ×: ×¨×§×¢, ×“×™×œ×ž×”, ×‘×¢×“/× ×’×“, ×“×•×’×ž×”, ×¢×ž×“×” ×–×”×™×¨×”' },
    { id: 'linkedin', label: '×¤×•×¡×˜ ×œ×™× ×§×“××™×Ÿ / ×¨×©×ª×•×ª', icon: Share2, desc: '×ž×ž×•×§×“ ×•×ž×¢×•×¨×¨ ×ž×—×©×‘×”, ×©×•×ž×¨ ×¢×œ ×§×•×œ ×¨×¤×œ×§×˜×™×‘×™ ×•×¤×™×¡×•×§ ×—×ª×•×' },
    { id: 'opinion', label: '×ž××ž×¨ ×“×¢×” ×ž×§×¦×•×¢×™', icon: MessageSquare, desc: '× ×™×ª×•×— ×¨×—×‘ ×©×œ ×ª×•×¤×¢×” ×ž×¢×¨×›×ª×™×ª ×‘×¢×¡×§×™× ×•×‘× ×™×”×•×œ' },
    { id: 'series', label: '×—×œ×§ ×ž×¡×“×¨×” (X/Y)', icon: Layers, desc: '×¤×•×¡×˜ ×ž×ª×ž×©×š ×›×—×œ×§ ×ž×¡×“×¨×ª ×ž××ž×¨×™× ×ž×§×¦×•×¢×™×ª' },
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
            ×™×¦×™×¨×” ×ž×”×™×¨×”: ×ž×—×•×ž×¨ ×’×•×œ×ž×™ ×œ×¤×•×¡×˜ ×—×ª×•×
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans">
            ×‘×—×¨ × ×•×©× ×ž×•×¦×¢ ×œ×¢×™×•×Ÿ ×•×§×‘×œ×ª ×ž×™×“×¢ ×ž×œ×, ××• ×”×–×Ÿ × ×•×©× ×•×¨××©×™× ×ž×©×œ×š â€” ×•×”×¡×•×›×Ÿ ×™×¤×ª×— ××•×ª× ×œ×¤×•×¡×˜ ×ž×§×™×£ ×•×ž××•×–×Ÿ ×‘×§×•×œ×š.
          </p>
        </div>

        {/* Toolbar: Reset & Dynamic Idea Generator */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleResetSelections}
            className="text-xs font-bold bg-[#101827] hover:bg-[#182338] text-slate-300 hover:text-white border border-slate-700/80 rounded-xl px-3.5 py-2.5 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="××™×¤×•×¡ ×›×œ ×”×‘×—×™×¨×•×ª, ×”× ×•×©×, ×”××•×¨×š ×•×”×©×“×•×ª ×œ×‘×¨×™×¨×•×ª ×”×ž×—×“×œ"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>××™×¤×•×¡ ×‘×—×™×¨×•×ª ×•×©×“×•×ª</span>
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
            <span>{isGeneratingIdeas ? '×ž×™×™×¦×¨ ×¨×¢×™×•× ×•×ª...' : 'âœ¨ ×”×¦×¢ ×¢×•×“ ×¨×¢×™×•× ×•×ª (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Ideas Section with Category Filter and Expanded Info Box */}
      <div className="mt-6 pb-6 border-b border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-heading font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-danbar-400" />
            <span>× ×•×©××™× ×•×“×™×œ×ž×•×ª ×ž×•×¦×¢×™× ×œ×›×ª×™×‘×” (×œ×—×¥ ×œ×‘×—×™×¨×” ×•×ž×™×“×¢ ×ž×•×¨×—×‘):</span>
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
                        ×¨×¢×™×•×Ÿ × ×‘×—×¨ âœ“
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                        ×œ×—×¥ ×œ×‘×—×™×¨×”
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
                  <span>{isSelected ? 'âœ“ ×¨×¢×™×•×Ÿ ×¤×¢×™×œ (×œ×—×¥ ×œ×¦×ž×¦×•×)' : '×œ×—×¥ ×œ×”×¨×—×‘×” ×•×‘×—×™×¨×”'}</span>
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
                  <span className="text-xs text-slate-400">×ž×™×“×¢ ×ž×œ× ××•×“×•×ª ×”× ×•×©× ×”× ×‘×—×¨</span>
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
                ×¡×’×•×¨ ×ž×™×“×¢ âœ•
              </button>
            </div>

            {/* Dilemma Description */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-heading font-bold text-danbar-300">
                ðŸŽ¯ ×”×“×™×œ×ž×” ×•×”××ª×’×¨ ×”×ž×¨×›×–×™:
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-[#0e172a] p-3 rounded-xl border border-slate-800">
                {selectedIdea.description}
              </p>
            </div>

            {/* Raw Points / Perspectives */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-heading font-bold text-danbar-300">
                ðŸ’¡ ×¨××©×™ ×¤×¨×§×™×, ×˜×™×¢×•× ×™ ×‘×¢×“ ×•× ×’×“ ×•×—×•×ž×¨ ×¨×§×¢:
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
                  <span>âœ“ ×‘×—×¨ ×•×”×—×œ × ×•×©× ×–×” ×¢×œ ×©×“×•×ª ×”×›×ª×™×‘×”</span>
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
                      <span>×—×•×§×¨ ×‘×ž×§×•×¨×•×ª ×ž×™×“×¢...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-danbar-400" />
                      <span>×‘×¦×¢ ×ž×—×§×¨ ×¢×•×ž×§ ×‘×¨×©×ª ×¢×œ × ×•×©× ×–×”</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                × ×™×ª×Ÿ ×œ×¢×¨×•×š ×•×œ×”×•×¡×™×£ ×ž×—×©×‘×•×ª ××™×©×™×•×ª ×œ××—×¨ ×”×”×—×œ×”
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
              âœ“ ×¨×¢×™×•×Ÿ ×¤×¢×™×œ
            </span>
            <div>
              <span className="text-[11px] font-bold text-danbar-300 block font-heading">
                × ×•×©× × ×‘×—×¨ ×œ×¤×•×¡×˜ (×”×©×“×•×ª ×”×•×–× ×• ××•×˜×•×ž×˜×™×ª):
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
            title="×‘×˜×œ ×‘×—×™×¨×” ×•××¤×¡ ××ª ×”×©×“×•×ª"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>××™×¤×•×¡ ×‘×—×™×¨×” ×•×©×“×•×ª</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Content Type Selector */}
        <div>
          <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-3">
            ×¤×•×¨×ž×˜ ×•×¡×•×’ ×”×ª×•×›×Ÿ
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
            ××•×¨×š ×”×¤×•×¡×˜ ×”×ž×‘×•×§×©
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                id: 'short' as PostLength,
                label: '×§×¦×¨ ×•×ž×ž×•×§×“',
                range: '300-450 ×ž×™×œ×™×',
                desc: '×ª×ž×¦×™×ª×™ ×•×ž×”×•×“×§, ××™×“×™××œ×™ ×œ×¨×©×ª×•×ª ×ž×§×¦×•×¢×™×•×ª',
              },
              {
                id: 'medium' as PostLength,
                label: '×‘×™× ×•× ×™ (×§×œ××¡×™)',
                range: '600-850 ×ž×™×œ×™×',
                desc: '×¤×•×¡×˜ ×‘×œ×•×’ ×ž××•×–×Ÿ ×•×ž×œ× ×‘×›×œ ×ž×¨×›×™×‘×™ ×”×“×™×œ×ž×”',
              },
              {
                id: 'long' as PostLength,
                label: '××¨×•×š ×•×ž×¢×ž×™×§',
                range: '1000-1500 ×ž×™×œ×™×',
                desc: '×ž××ž×¨ ×“×¢×” ×¨×—×‘ ×™×¨×™×¢×”, × ×™×ª×•×— ×”×™×¡×˜×•×¨×™ ×ž×¢×ž×™×§ ×•×ž×¡×¤×¨ ×“×•×’×ž××•×ª.',
              },
            ]*®j·µ…À ¡½ÁÐ¤€ôøì(€€€€€€€€€€€€€½¹ÍÐ¥ÍM•±•Ñ•€ôÁ½ÍÑ1•¹Ñ €ôôô½ÁÐ¹¥ì(€€€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€€€€€­•äõí½ÁÐ¹¥‘ô(€€€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•ÑA½ÍÑ1•¹Ñ ¡½ÁÐ¹¥¥ô(€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”õí™±•à™±•àµ½°Ñ•áÐµÉ¥¡ÐÀ´ÐÉ½Õ¹‘•´Éá°ÑÉ…¹Í¥Ñ¥½¸µ…±°€‘ì(€€€€€€€€€€€€€€€€€€€¥ÍM•±•Ñ•(€€€€€€€€€€€€€€€€€€€€€€ü€‰½É‘•È´È‰½É‘•ÈµlŒá‘ˆÜÄÝt‰œµlŒÄÈÈÌÍtÉ¥¹œ´ÈÉ¥¹œµlŒá‘ˆÜÄÝt¼ÌÀÍ¡…‘½Üµ±½ÜµÍ´œ(€€€€€€€€€€€€€€€€€€€€€€è€‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´àÀÀ‰œµlŒÀäÁ˜Åt¼äÀ¡½Ù•Èé‰½É‘•ÈµÍ±…Ñ”´ÜÀÀ¡½Ù•Èé‰œµlŒÁ˜ÄÜÉ…tœ(€€€€€€€€€€€€€€€€€õô(€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Èµˆ´Ä¸Ôˆø(€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµ¡•…‘¥¹œ™½¹Ðµ‰½±Ñ•áÐµÝ¡¥Ñ”ˆø(€€€€€€€€€€€€€€€€€€€€€í½ÁÐ¹±…‰•±ô(€€€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÅÁát™½¹Ðµ‰½±Ñ•áÐµ‘…¹‰…È´ÌÀÀ‰œµ‘…¹‰…È´äÔÀÁà´È¸ÔÁä´À¸ÔÉ½Õ¹‘•µ™Õ±°‰½É‘•È‰½É‘•Èµ‘…¹‰…È´ÜÀÀ¼ÔÀˆø(€€€€€€€€€€€€€€€€€€€€€í½ÁÐ¹É…¹•ô(€€€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµÍ±…Ñ”´ÐÀÀ±•…‘¥¹œµÍ¹Õœˆø(€€€€€€€€€€€€€€€€€€€í½ÁÐ¹‘•Íô(€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€ô¥ô(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½‘¥Øø((€€€€€€€ì¼¨M•É¥•ÌÁ…ÉÐ¥˜Í•±•Ñ•€¨½ô(€€€€€€€í½¹Ñ•¹ÑQåÁ”€ôôô€Í•É¥•Ìœ€˜˜€ (€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰‰œµlŒÀäÁ˜ÅtÀ´ÐÉ½Õ¹‘•´Éá°‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´àÀÀ™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ðˆø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµµ•‘¥Õ´Ñ•áÐµÍ±…Ñ”´ÌÀÀˆø(€€€€€€€€€€€€€ƒ^{^‡^“^ ƒ^_^s^œƒ^G^‡^O^£^P€£^o^K^W^|€Ä¼Ì°€È¼Ð¤è(€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€ñ¥¹ÁÕÐ(€€€€€€€€€€€€€ÑåÁ”ô‰Ñ•áÐˆ(€€€€€€€€€€€€€Ù…±Õ”õíÍ•É¥•ÍA…ÉÑô(€€€€€€€€€€€€€½¹¡…¹”õì¡”¤€ôøÍ•ÑM•É¥•ÍA…ÉÐ¡”¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Ü´ÈÐÑ•áÐµ•¹Ñ•È™½¹Ðµ‰½±Áà´ÌÁä´Ä¸Ô‰œµlŒÁ”ÄØÈÙt‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´ÜÀÀÑ•áÐµÝ¡¥Ñ”É½Õ¹‘•µá°Ñ•áÐµÍ´™½ÕÌéÉ¥¹œ´È™½ÕÌéÉ¥¹œµ‘…¹‰…È´ÔÀÀ½ÕÑ±¥¹”µ¹½¹”ˆ(€€€€€€€€€€€€€Á±…•¡½±‘•ÈôˆÄ¼Ìˆ(€€€€€€€€€€€€¼ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€¥ô((€€€€€€€ì¼¨Q½Á¥Œ¥¹ÁÕÐÝ¥Ñ ]•ˆI•Í•…É 	ÕÑÑ½¸€¨½ô(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à™±•àµ½°Í´é™±•àµÉ½ÜÍ´é¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Èµˆ´È¸Ôˆø(€€€€€€€€€€€€ñ±…‰•°±…ÍÍ9…µ”ô‰‰±½¬Ñ•áÐµáÌ™½¹Ðµ¡•…‘¥¹œ™½¹Ðµ•áÑÉ…‰½±Ñ•áÐµÍ±…Ñ”´ÌÀÀÕÁÁ•É…Í”ÑÉ…­¥¹œµÝ¥‘•Èˆø(€€€€€€€€€€€€€ƒ^ƒ^W^§^@ƒ^S^“^W^‡^`€¼ƒ^o^W^«^£^¨ƒ^£^‹^g^W^ƒ^g^¨(€€€€€€€€€€€€ð½±…‰•°ø((€€€€€€€€€€€ì¼¨ÕÑ½¹½µ½ÕÌ]•ˆI•Í•…É 	ÕÑÑ½¸€¨½ô(€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€½¹±¥¬õì¡…¹‘±•½¹‘ÕÑI•Í•…É¡ô(€€€€€€€€€€€€€‘¥Í…‰±•õí¥ÍI•Í•…É¡¥¹œñð€ …Ñ½Á¥Œ¹ÑÉ¥´ ¤€˜˜€…É…Ý½¹Ñ•¹Ð¹ÑÉ¥´ ¤¥ô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Ñ•áÐµáÌ™½¹Ðµ‰½±Ñ•áÐµ‘…¹‰…È´ÌÀÀ¡½Ù•ÈéÑ•áÐµÝ¡¥Ñ”‰œµlŒÄÐÈÈÌát¡½Ù•Èé‰œµlŒÅˆÉÑ‰tÁà´Ì¸ÔÁä´Ä¸ÔÉ½Õ¹‘•µá°‰½É‘•È‰½É‘•Èµ‘…¹‰…È´ÔÀÀ¼ÐÀÑÉ…¹Í¥Ñ¥½¸µ…±°™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ä¸ÔÍ•±˜µÍÑ…ÉÐÍ´éÍ•±˜µ…ÕÑ¼‘¥Í…‰±•é½Á…¥Ñä´ÔÀ‘¥Í…‰±•éÕÉÍ½Èµ¹½Ðµ…±±½Ý•Í¡…‘½Ü´ÉáÌˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€í¥ÍI•Í•…É¡¥¹œ€ü€ (€€€€€€€€€€€€€€€€ðø(€€€€€€€€€€€€€€€€€€ñ1½…‘•ÈÈ±…ÍÍ9…µ”ô‰Ü´Ì¸Ô ´Ì¸Ô…¹¥µ…Ñ”µÍÁ¥¸Ñ•áÐµ‘…¹‰…È´ÐÀÀˆ€¼ø(€€€€€€€€€€€€€€€€€€ñÍÁ…¸û^{^G^›^ˆƒ^{^_^Ÿ^ ƒ^‹^W^{^œƒ^G^£^§^¨¸¸¸ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ð¼ø(€€€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€€€ðø(€€€€€€€€€€€€€€€€€€ñ±½‰”±…ÍÍ9…µ”ô‰Ü´Ì¸Ô ´Ì¸ÔÑ•áÐµ‘…¹‰…È´ÐÀÀˆ€¼ø(€€€€€€€€€€€€€€€€€€ñÍÁ…¸û^G^›^ˆƒ^{^_^Ÿ^ ƒ^‹^›^{^C^dƒ^G^C^g^ƒ^c^£^ƒ^`ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ð¼ø(€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€ð½‘¥Øø((€€€€€€€€€€ñ¥¹ÁÕÐ(€€€€€€€€€€€¥ô‰Ñ½Á¥Œµ¥¹ÁÕÐµ™¥•±ˆ(€€€€€€€€€€€ÑåÁ”ô‰Ñ•áÐˆ(€€€€€€€€€€€Ù…±Õ”õíÑ½Á¥ô(€€€€€€€€€€€½¹¡…¹”õì¡”¤€ôøÍ•ÑQ½Á¥Œ¡”¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€Á±…•¡½±‘•Èô‹^s^O^W^K^{^Pèƒ^§^g^W^W^œÉƒ^§^pƒ^«^W^o^ƒ^W^¨M……Lƒ^G^‹^W^s^tƒ^S^c^£^G^p·^c^œƒ^{^W^pƒ^§^{^£^ƒ^W^¨ƒ^«^“^‹^W^s^g^¨¸¸¸ˆ(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°Áà´ÐÁä´Ì¸Ô‰œµlŒÀàÁÄÝtÑ•áÐµÝ¡¥Ñ”‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´ÜÀÀ¼àÀÉ½Õ¹‘•´Éá°™½ÕÌé‰½É‘•Èµ‘…¹‰…È´ÔÀÀ™½ÕÌéÉ¥¹œ´Ð™½ÕÌéÉ¥¹œµ‘…¹‰…È´ÔÀÀ¼ÄÔ½ÕÑ±¥¹”µ¹½¹”ÑÉ…¹Í¥Ñ¥½¸µ…±°Ñ•áÐµÍ´Í´éÑ•áÐµ‰…Í”Á±…•¡½±‘•ÈµÍ±…Ñ”´ÔÀÀÍ¡…‘½Üµ¥¹¹•Èˆ(€€€€€€€€€€¼ø(€€€€€€€€ð½‘¥Øø((€€€€€€€ì¼¨]•ˆI•Í•…É I•ÍÕ±ÑÌ	½à€¡¥˜…Ù…¥±…‰±”¤€¨½ô(€€€€€€€íÉ•Í•…É¡ÉÉ½È€˜˜€ (€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰À´Ì‰œµÉ•´äÔÀ¼ÐÀ‰½É‘•È‰½É‘•ÈµÉ•´àÀÀÉ½Õ¹‘•µá°Ñ•áÐµáÌÑ•áÐµÉ•´ÌÀÀˆø(€€€€€€€€€€€íÉ•Í•…É¡ÉÉ½Éô(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€¥ô((€€€€€€€íÉ•Í•…É¡¥¹‘¥¹Ì€˜˜€ (€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰‰œµlŒÀäÁ˜Åt‰½É‘•È‰½É‘•Èµ‘…¹‰…È´àÀÀ¼àÀÉ½Õ¹‘•´Éá°À´ÔÍÁ…”µä´È¸Ôˆø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à©ÕÍÑ¥™äµ‰•ÑÝ••¸¥Ñ•µÌµ•¹Ñ•Èˆø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµáÌ™½¹Ðµ¡•…‘¥¹œ™½¹Ðµ‰½±Ñ•áÐµ‘…¹‰…È´ÌÀÀ™±•à¥Ñ•µÌµ•¹Ñ•È…À´Èˆø(€€€€€€€€€€€€€€€€ñ±½‰”±…ÍÍ9…µ”ô‰Ü´Ð ´ÐÑ•áÐµ‘…¹‰…È´ÐÀÀˆ€¼ø(€€€€€€€€€€€€€€€ƒ^{^{^›^C^dƒ^{^_^Ÿ^ ƒ^£^§^¨ƒ^‹^›^{^C^d€£^g^§^W^s^G^Tƒ^G^o^«^g^G^P¤è(€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•ÑM¡½ÝI•Í•…É¡	½à …Í¡½ÝI•Í•…É¡	½à¥ô(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµÍ±…Ñ”´ÐÀÀ¡½Ù•ÈéÑ•áÐµÍ±…Ñ”´ÈÀÀ™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ä™½¹Ðµµ•‘¥Õ´ˆ(€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€ñÍÁ…¸ùíÍ¡½ÝI•Í•…É¡	½à€ü€Ÿ^›^{^›^tœ€è€Ÿ^S^›^Hƒ^{^{^›^C^g^tôð½ÍÁ…¸ø(€€€€€€€€€€€€€€€íÍ¡½ÝI•Í•…É¡	½à€ü€ñ¡•ÙÉ½¹UÀ±…ÍÍ9…µ”ô‰Ü´Ì¸Ô ´Ì¸Ôˆ€¼ø€è€ñ¡•ÙÉ½¹½Ý¸±…ÍÍ9…µ”ô‰Ü´Ì¸Ô ´Ì¸Ôˆ€¼ùô(€€€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€ð½‘¥Øø((€€€€€€€€€€€íÍ¡½ÝI•Í•…É¡	½à€˜˜€ (€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÍÁ…”µä´ÌÁÐ´Èˆø(€€€€€€€€€€€€€€€€ñÑ•áÑ…É•„(€€€€€€€€€€€€€€€€€É½ÝÌõìÙô(€€€€€€€€€€€€€€€€€Ù…±Õ”õíÉ•Í•…É¡¥¹‘¥¹Íô(€€€€€€€€€€€€€€€€€½¹¡…¹”õì¡”¤€ôøÍ•ÑI•Í•…É¡¥¹‘¥¹Ì¡”¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°À´Ì¸Ô‰œµlŒÁ”ÄØÈÙtÑ•áÐµÍ±…Ñ”´ÈÀÀ‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´ÜÀÀÉ½Õ¹‘•µá°Ñ•áÐµáÌ±•…‘¥¹œµÉ•±…á•™½¹ÐµÍ…¹Ì½ÕÑ±¥¹”µ¹½¹”™½ÕÌéÉ¥¹œ´È™½ÕÌéÉ¥¹œµ‘…¹‰…È´ÔÀÀˆ(€€€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€€íÉ•Í•…É¡M½ÕÉ•Ì¹±•¹Ñ €ø€À€˜˜€ (€€€€€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÁÐ´È‰½É‘•ÈµÐ‰½É‘•ÈµÍ±…Ñ”´àÀÀˆø(€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÅÁát™½¹Ðµ‰½±Ñ•áÐµÍ±…Ñ”´ÐÀÀ‰±½¬µˆ´Äˆø(€€€€€€€€€€€€€€€€€€€€€ƒ^{^Ÿ^W^£^W^¨ƒ^W^Ÿ^g^§^W^£^g^tƒ^§^ƒ^{^›^C^Tè(€€€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€€€ñÕ°±…ÍÍ9…µ”ô‰ÍÁ…”µä´Äˆø(€€€€€€€€€€€€€€€€€€€€€íÉ•Í•…É¡M½ÕÉ•Ì¹µ…À ¡ÍÉŒ°¤¤€ôø€ (€€€€€€€€€€€€€€€€€€€€€€€€ñ±¤­•äõí¥ô±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÅÁátÑ•áÐµ‘…¹‰…È´ÐÀÀÑÉÕ¹…Ñ”ˆø(€€€€€€€€€€€€€€€€€€€€€€€€€ƒŠˆíÍÉô(€€€€€€€€€€€€€€€€€€€€€€€€ð½±¤ø(€€€€€€€€€€€€€€€€€€€€€€¤¥ô(€€€€€€€€€€€€€€€€€€€€ð½Õ°ø(€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€¥ô(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€¥ô((€€€€€€€ì¼¨I…Üµ…Ñ•É¥…°Ñ•áÐ…É•„€¨½ô(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à©ÕÍÑ¥™äµ‰•ÑÝ••¸¥Ñ•µÌµ•¹Ñ•Èµˆ´È¸Ôˆø(€€€€€€€€€€€€ñ±…‰•°±…ÍÍ9…µ”ô‰‰±½¬Ñ•áÐµáÌ™½¹Ðµ¡•…‘¥¹œ™½¹Ðµ•áÑÉ…‰½±Ñ•áÐµÍ±…Ñ”´ÌÀÀÕÁÁ•É…Í”ÑÉ…­¥¹œµÝ¥‘•Èˆø(€€€€€€€€€€€€€ƒ^_^W^{^ ƒ^K^W^s^{^d°ƒ^ƒ^Ÿ^W^O^W^¨ƒ^{^£^o^[^g^W^¨°ƒ^c^g^W^c^Pƒ^C^Tƒ^{^_^§^G^W^¨(€€€€€€€€€€€€ð½±…‰•°ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµÍ±…Ñ”´ÐÀÀˆø(€€€€€€€€€€€€€íÉ…Ý½¹Ñ•¹Ð¹ÍÁ±¥Ð ½qÌ¬¼¤¹™¥±Ñ•È¡	½½±•…¸¤¹±•¹Ñ¡ôƒ^{^g^s^g^t(€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñÑ•áÑ…É•„(€€€€€€€€€€€É½ÝÌõìáô(€€€€€€€€€€€Ù…±Õ”õíÉ…Ý½¹Ñ•¹Ñô(€€€€€€€€€€€½¹¡…¹”õì¡”¤€ôøÍ•ÑI…Ý½¹Ñ•¹Ð¡”¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€Á±…•¡½±‘•Èõíƒ^S^O^G^œƒ^o^C^|ƒ^C^¨ƒ^S^ƒ^Ÿ^W^O^W^¨ƒ^§^s^h¸¸¸ƒ^s^{^§^pè(´ƒ^{^Pƒ^S^O^g^s^{^Pƒ^S^{^£^o^[^g^¨ƒ^W^{^Pƒ^S^o^W^_^W^¨ƒ^§^{^«^ƒ^K^§^g^tü(´ƒ^{^Pƒ^S^§^g^Ÿ^W^s^g^tƒ^G^‹^Lƒ^W^ƒ^K^Lü(´ƒ^C^g^[^Pƒ^‡^g^“^W^ ƒ^{^S^§^c^\ƒ^C^Tƒ^ƒ^g^‡^g^W^|ƒ^C^g^§^dƒ^{^{^_^g^¤ƒ^C^¨ƒ^S^{^›^Dü(´ƒ^{^Pƒ^S^‹^{^O^Pƒ^S^C^g^§^g^¨ƒ^§^«^£^›^Pƒ^s^S^G^g^ˆƒ^G^‡^g^W^týô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°À´Ð‰œµlŒÀàÁÄÝtÑ•áÐµÝ¡¥Ñ”‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´ÜÀÀ¼àÀÉ½Õ¹‘•´Éá°™½ÕÌé‰½É‘•Èµ‘…¹‰…È´ÔÀÀ™½ÕÌéÉ¥¹œ´Ð™½ÕÌéÉ¥¹œµ‘…¹‰…È´ÔÀÀ¼ÄÔ½ÕÑ±¥¹”µ¹½¹”ÑÉ…¹Í¥Ñ¥½¸µ…±°Ñ•áÐµÍ´Í´éÑ•áÐµ‰…Í”Á±…•¡½±‘•ÈµÍ±…Ñ”´ÔÀÀ±•…‘¥¹œµÉ•±…á•™½¹ÐµÍ…¹ÌÍ¡…‘½Üµ¥¹¹•Èˆ(€€€€€€€€€€¼ø(€€€€€€€€ð½‘¥Øø((€€€€€€€ì¼¨‘Ù…¹•%¹ÍÑÉÕÑ¥½¹ÌQ½±”€¨½ô(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•ÑM¡½Ý‘Ù…¹• …Í¡½Ý‘Ù…¹•¥ô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµ‘…¹‰…È´ÐÀÀ¡½Ù•ÈéÑ•áÐµ‘…¹‰…È´ÌÀÀ¡½Ù•ÈéÕ¹‘•É±¥¹”™½¹Ðµ‰½±™±•à¥Ñ•µÌµ•¹Ñ•È…À´Äˆ(€€€€€€€€€€ø(€€€€€€€€€€€íÍ¡½Ý‘Ù…¹•€ü€œ´ƒ^S^‡^«^ ƒ^S^ƒ^_^g^W^¨ƒ^{^W^«^C^{^W^¨ƒ^C^g^§^g^¨œ€è€œ¬ƒ^S^W^‡^Œƒ^O^K^§^g^tƒ^C^Tƒ^S^ƒ^_^g^W^¨ƒ^{^g^W^_^O^W^¨ƒ^s^o^«^g^G^Pô(€€€€€€€€€€ð½‰ÕÑÑ½¸ø((€€€€€€€€€íÍ¡½Ý‘Ù…¹•€˜˜€ (€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´Ìˆø(€€€€€€€€€€€€€€ñÑ•áÑ…É•„(€€€€€€€€€€€€€€€É½ÝÌõìÉô(€€€€€€€€€€€€€€€Ù…±Õ”õíÕÍÑ½µ%¹ÍÑÉÕÑ¥½¹Íô(€€€€€€€€€€€€€€€½¹¡…¹”õì¡”¤€ôøÍ•ÑÕÍÑ½µ%¹ÍÑÉÕÑ¥½¹Ì¡”¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€€€€€Á±…•¡½±‘•Èô‹^s^{^§^pèƒ^S^O^K^¤ƒ^G^{^g^W^_^Lƒ^C^¨ƒ^‹^W^s^tƒ^PµM……Lƒ^W^S^§^W^œƒ^S^G^g^ƒ^s^C^W^{^dìƒ^§^s^Dƒ^C^¨ƒ^S^“^«^K^t€Ÿ^C^s^g^Pƒ^W^Ÿ^W^”ƒ^G^Pœìƒ^§^{^W^ ƒ^‹^pƒ^c^W^|ƒ^[^S^g^ ƒ^W^{^C^W^[^|¸¸¸ˆ(€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°À´Ì¸Ô‰œµlŒÀàÁÄÝtÑ•áÐµÝ¡¥Ñ”‰½É‘•È‰½É‘•ÈµÍ±…Ñ”´ÜÀÀÉ½Õ¹‘•µá°™½ÕÌéÉ¥¹œ´È™½ÕÌéÉ¥¹œµ‘…¹‰…È´ÔÀÀ½ÕÑ±¥¹”µ¹½¹”Ñ•áÐµáÌÍ´éÑ•áÐµÍ´Á±…•¡½±‘•ÈµÍ±…Ñ”´ÔÀÀˆ(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¥ô(€€€€€€€€ð½‘¥Øø((€€€€€€€ì¼¨MÕ‰µ¥Ð	ÕÑÑ½¸€¨½ô(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÁÐ´Ð™±•Ü©ÕÍÑ¥™äµ•¹ˆø(€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€ÑåÁ”ô‰ÍÕ‰µ¥Ðˆ(€€€€€€€€€€€‘¥Í…‰±•õí¥Í1½…‘¥¹œñð€ …É…Ý½¹Ñ•¹Ð¹ÑÉ¥´ ¤€˜˜€…Ñ½Á¥Œ¹ÑÉ¥´ ¤€˜˜€…É•Í•…É¡¥¹‘¥¹Ì¹ÑÉ¥´ ¤¥ô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°Í´éÜµ…ÕÑ¼Áà´äÁä´ÐÉ½Õ¹‘•´Éá°‰œµÉ…‘¥•¹ÐµÑ¼µÈ™É½´µ‘…¹‰…È´ØÀÀÑ¼µ‘…¹‰…È´ÜÀÀ¡½Ù•Èé™É½´µ‘…¹‰…È´ÔÀÀ¡½Ù•ÈéÑ¼µ‘…¹‰…È´ØÀÀÑ•áÐµÝ¡¥Ñ”™½¹Ðµ¡•…‘¥¹œ™½¹Ðµ‰±…¬Ñ•áÐµ‰…Í”Í¡…‘½Üµ±½Üµµ¡½Ù•ÈéÍ…±”µlÄ¸ÀÉt…Ñ¥Ù”éÍ…±”µlÀ¸äátÑÉ…¹Í¥Ñ¥½¸µ…±°‘¥Í…‰±•é½Á…¥Ñä´ÔÀ‘¥Í…‰±•éÕÉÍ½Èµ¹½Ðµ…±±½Ý•™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•È…À´È¸ÔÉ½ÕÀˆ(€€€€€€€€€€ø(€€€€€€€€€€€í¥Í1½…‘¥¹œ€ü€ (€€€€€€€€€€€€€€ðø(€€€€€€€€€€€€€€€€ñ1½…‘•ÈÈ±…ÍÍ9…µ”ô‰Ü´Ô ´Ô…¹¥µ…Ñ”µÍÁ¥¸Ñ•áÐµÝ¡¥Ñ”ˆ€¼ø(€€€€€€€€€€€€€€€€ñÍÁ…¸û^o^W^«^Dƒ^G^‡^K^ƒ^W^|ƒ^S^_^«^W^tƒ^§^s^h¸¸¸ð½ÍÁ…¸ø(€€€€€€€€€€€€€€ð¼ø(€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€ðø(€€€€€€€€€€€€€€€€ñMÁ…É­±•Ì±…ÍÍ9…µ”ô‰Ü´Ô ´ÔÑ•áÐµÝ¡¥Ñ”É½ÕÀµ¡½Ù•ÈéÉ½Ñ…Ñ”´ÄÈÑÉ…¹Í¥Ñ¥½¸µÑÉ…¹Í™½É´ˆ€¼ø(€€€€€€€€€€€€€€€€ñÍÁ…¸û^S^“^œƒ^“^W^‡^`ƒ^{^s^@ƒ^G^‡^K^ƒ^W^|ƒ^§^pƒ^O^ƒ^dð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ñÉÉ½Ý1•™Ð±…ÍÍ9…µ”ô‰Ü´Ð ´ÐÉ½ÕÀµ¡½Ù•ÈèµÑÉ…¹Í±…Ñ”µà´ÄÑÉ…¹Í¥Ñ¥½¸µÑÉ…¹Í™½É´ˆ€¼ø(€€€€€€€€€€€€€€ð¼ø(€€€€€€€€€€€€¥ô(€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€ð½‘¥Øø((€€€€€€ð½™½É´ø(€€€€ð½‘¥Øø(€€¤ì)ôì4