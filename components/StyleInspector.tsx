import React from 'react';
import { ShieldCheck, CheckCircle, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { StyleAnalysis } from '@/lib/types';

interface StyleInspectorProps {
  analysis?: StyleAnalysis;
}

export const StyleInspector: React.FC<StyleInspectorProps> = ({ analysis }) => {
  if (!analysis || analysis.totalWords === 0) return null;

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 p-6 sm:p-10 transition-all">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h3 className="text-lg sm:text-xl font-heading font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
              <ShieldCheck className="w-5 h-5" />
            </span>
            מנתח סגנון וחתימה (Signature Style Scorecard)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-sans">
            בדיקה אוטומטית של עמידה בכללי הסקיל הייחודיים של דני ברקאי
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3.5 self-start sm:self-auto bg-[#090f1c] px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading">ציון התאמה</span>
            <span className="text-xl font-heading font-black text-danbar-400">
              {effectiveAnalysis.score} / 100
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm bg-danbar-600 text-white shadow-glow-sm">
            {effectiveAnalysis.score >= 80 ? '✓' : '•'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {(effectiveAnalysis?.metrics || []).map((metric, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              metric.passed
                ? 'bg-emerald-950/20 border-emerald-700/40 text-emerald-100'
                : 'bg-amber-950/20 border-amber-700/40 text-amber-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-heading font-bold text-white flex items-center gap-2">
                {metric.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                {metric.label}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                metric.passed
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
              }`}>
                זוהו: {metric.count}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pr-6 font-sans">
              {metric.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Detected Anchors */}
      {effectiveAnalysis?.detectedAnchors && effectiveAnalysis.detectedAnchors.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-xs font-heading font-extrabold text-slate-400 uppercase tracking-wider block mb-2.5">
            עוגנים וביטויי מפתח שזוהו בטקסט:
          </span>
          <div className="flex flex-wrap gap-2">
            {effectiveAnalysis.detectedAnchors.map((anchor, i) => (
              <span
                key={i}
                className="bg-[#142238] text-danbar-300 border border-danbar-500/40 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-danbar-400" />
                {anchor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {effectiveAnalysis?.suggestions && effectiveAnalysis.suggestions.length > 0 && (
        <div className="mt-5 bg-[#090f1c] rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-heading font-bold text-danbar-300 block mb-2">
            המלצות לליטוש ודיוק הסגנון:
          </span>
          <ul className="space-y-1.5 font-sans">
            {effectiveAnalysis.suggestions.map((sug, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-danbar-400 font-bold">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
