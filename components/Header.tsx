import React from 'react';
import { History } from 'lucide-react';
import { DANBAR_LOGO_DATA_URI } from '@/lib/logo';

interface HeaderProps {
  
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
                src="/danbar-logo.svg"
                alt="DANBAR דנבר ייעוץ אסטרטגי, ארגוני ומשאבי אנוש"
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight">
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
            
          </div>
        </div>
      </div>
    </header>
  );
};
