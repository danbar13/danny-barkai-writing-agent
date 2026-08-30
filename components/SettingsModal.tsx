import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldAlert, Check, HelpCircle } from 'lucide-react';

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-danbar-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-danbar-800 max-w-lg w-full p-6 sm:p-8 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-danbar-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              הגדרות סוכן ומפתח Gemini API
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Gemini API Key (Google AI Studio)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-danbar-800 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              המפתח נשמר בזיכרון המקומי של הדפדפן שלך בלבד (localStorage) ולעולם אינו נשלח לשרת צד-שלישי.
            </p>
          </div>

          {/* Model info card */}
          <div className="bg-danbar-50/60 dark:bg-danbar-800/40 p-4 rounded-xl border border-danbar-100 dark:border-danbar-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-danbar-900 dark:text-white">מודל ברירת מחדל:</span>
              <span className="font-mono bg-danbar-200/60 dark:bg-danbar-700 px-2 py-0.5 rounded text-danbar-800 dark:text-gold-400 font-bold">
                gemini-2.5-pro / flash
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              הסוכן משתמש בפרומפט מערכת ייעודי המכויל לפי חוקי הכתיבה, הפיסוק (שלוש נקודות, מקפים, סוגריים) והתפיסה המערכתית של דני ברקאי.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-danbar-600 dark:text-gold-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>קבל מפתח API בחינם מ-Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-danbar-700 hover:bg-danbar-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                {saved ? <Check className="w-4 h-4 text-gold-400" /> : null}
                <span>{saved ? 'נשמר בהצלחה!' : 'שמור מפתח'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
