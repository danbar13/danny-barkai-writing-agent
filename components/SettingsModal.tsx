import React, { useState } from 'react';
import { X, Key, ExternalLink, HelpCircle, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-danbar-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-danbar-800 max-w-lg w-full p-6 sm:p-8 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-danbar-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              הגדרות Google Gemini API
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              מפתח Gemini API אישי (נשמר מקומית בדפדפן בלבד)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-danbar-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-sm font-mono placeholder-gray-400"
            />
            <p className="text-xs text-gray-400 mt-2">
              אם לא תזין מפתח, האפליקציה תשתמש במשתנה הסביבה <code className="bg-gray-100 dark:bg-danbar-800 px-1 py-0.5 rounded text-danbar-600 dark:text-gold-400">GEMINI_API_KEY</code> שהוגדר ב-Vercel.
            </p>
          </div>

          <div className="bg-danbar-50/60 dark:bg-danbar-800/40 p-4 rounded-xl border border-danbar-100 dark:border-danbar-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5 font-bold text-danbar-800 dark:text-gold-400">
              <HelpCircle className="w-4 h-4" />
              <span>איך משיגים מפתח בחינם?</span>
            </div>
            <p>
              מפתח Gemini API ניתן לקבל בחינם לגמרי תוך דקה דרך פורטל Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-danbar-600 dark:text-gold-400 font-bold hover:underline"
            >
              <span>קבל מפתח ב-Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-danbar-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-danbar-800 hover:bg-danbar-900 text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-gold-400" />
                  <span>נשמר!</span>
                </>
              ) : (
                <span>שמור הגדרות</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
