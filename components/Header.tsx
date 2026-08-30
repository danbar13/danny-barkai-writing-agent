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
    <header className="bg-white dark:bg-danbar-900 border-b border-gray-200 dark:border-danbar-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Branding */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 dark:border-danbar-700 flex items-center justify-center overflow-hidden">
              <img
                src="/danbar-logo.jpg"
                alt="DANBAR דנבר ייעוץ אסטרטגי, ארגוני ומשאבי אנוש"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  סוכן הכתיבה של דני ברקאי
                </h1>
                <span className="hidden sm:inline-block bg-danbar-100 dark:bg-danbar-800 text-danbar-800 dark:text-gold-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-danbar-200 dark:border-danbar-700">
                  DANBAR Consulting
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 max-w-xl">
                ניהול ומשאבי אנוש, חדשנות ויזמות, טרבל-טק ו-AI במלונאות ובעסקים — חשיבה רפלקטיבית "בין הפטיש לסדן"
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors flex items-center gap-1.5 text-sm font-medium border border-gray-200 dark:border-danbar-700"
              title="היסטוריית פוסטים שמורים"
            >
              <History className="w-4 h-4 text-danbar-600 dark:text-danbar-400" />
              <span className="hidden sm:inline">פוסטים שמורים</span>
              {savedCount > 0 && (
                <span className="bg-gold-500 text-danbar-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="relative p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors flex items-center gap-1.5 text-sm font-medium border border-gray-200 dark:border-danbar-700"
              title="הגדרות API ומודל"
            >
              <Settings className="w-4 h-4 text-danbar-600 dark:text-danbar-400" />
              <span className="hidden sm:inline">הגדרות</span>
              {hasCustomKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white dark:ring-danbar-900" />
              )}
            </button>

            {/* Blog Reference Link */}
            <a
              href="https://danbarblogs.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-danbar-600 dark:hover:text-gold-400 px-3 py-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-danbar-800 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>הבלוג המקורי</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
