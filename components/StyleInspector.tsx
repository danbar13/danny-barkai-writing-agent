import React from 'react';
import { ShieldCheck, CheckCircle, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { StyleAnalysis } from '@/lib/types';

interface StyleInspectorProps {
  analysis?: StyleAnalysis;
}

export const StyleInspector: React.FC<StyleInspectorProps> = ({ analysis }) => {
  if (!analysis || analysis.totalWords === 0) return null;

  return (
    <div className="bg-white dark:bg-danbar-900 rounded-2xl shadow-sm border border-gray-200 dark:border-danbar-800 p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-danbar-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
            מנתח סגנון וחתימה (Signature Style Scorecard)
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            בדיקה אוטומטית של עמידה בכללי הסקיל הייחודיים של דני ברקאי
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-gray-50 dark:bg-danbar-800/80 px-4 py-2 rounded-2xl border border-gray-200 dark:border-danbar-700">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">ציון התאמה</span>
            <span className="text-xl font-extrabold text-danbar-700 dark:text-gold-400">
              {analysis.score} / 100
            </span>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-danbar-600 to-danbar-900 text-gold-400 shadow-sm">
            {analysis.score >= 80 ? '✓' : '•'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {analysis.metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              metric.passed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                {metric.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                {metric.label}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                metric.passed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
              }`}>
                זוהו: {metric.count}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pr-5">
              {metric.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Detected Anchors */}
      {analysis.detectedAnchors.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-danbar-800">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
            עוגנים וביטויי מפתח שזוהו בטקסט:
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.detectedAnchors.map((anchor, i) => (
              <span
                key={i}
                className="bg-danbar-50 dark:bg-danbar-800 text-danbar-800 dark:text-danbar-200 border border-danbar-200 dark:border-danbar-700 text-xs px-3 py-1 rounded-lg font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-gold-500" />
                {anchor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="mt-5 bg-danbar-50/50 dark:bg-danbar-800/40 rounded-xl p-4 border border-danbar-100 dark:border-danbar-800">
          <span className="text-xs font-bold text-danbar-800 dark:text-gold-400 block mb-1.5">
            המלצות לליטוש ודיוק הסגנון:
          </span>
          <ul className="space-y-1">
            {analysis.suggestions.map((sug, i) => (
              <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="text-danbar-600 dark:text-gold-500 font-bold">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
