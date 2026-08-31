import React from 'react';
import { PenTool, Settings, History, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenHistory,
  savedCount,
  hasCustomKey,
}) => {
  return (
    <header className="bg-[#0b1220]/85 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Branding */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-glow-sm border border-white/20 flex items-center justify-center shrink-0">
              <img
                src="/danbar-logo.jpg"
                alt="DANBAR דנבר ייעוץ אסטרטגי, ארגוני ומשאבי אנוש"
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-heading font-black text-white tracking-tight">
                  סוכן הכתיבה של דני ברקאי
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-danbar-950/90 text-danbar-300 text-xs px-3 py-1 rounded-full font-bold border border-danbar-600/40 shadow-glow-sm">
                  <span className="w-2 h-2 rounded-full bg-danbar-500 animate-pulse shadow-[0_0_8px_#8db717]" />
                  AI Executive Studio
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-danbar-500/40 transition-all flex items-center gap-2 text-sm font-semibold shadow-xs"
              title="היסטוריית פוסטים שמורים"
            >
              <History className="w-4 h-4 text-danbar-400" />
              <span className="hidden sm:inline">פוסטים שמורים</span>
              {savedCount > 0 && (
                <span className="bg-danbar-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-glow-sm">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-semibold shadow-xs ${
                hasCustomKey
                  ? 'bg-danbar-950/80 text-danbar-300 border-danbar-600/50 hover:bg-danbar-900/80'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700/60 hover:border-slate-600'
              }`}
              title="הגדרות API Key"
            >
              <Settings className={`w-4 h-4 ${hasCustomKey ? 'text-danbar-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">הגדרות</span>
              {hasCustomKey && (
                <span className="w-2 h-2 rounded-full bg-danbar-400 shadow-glow-sm" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
