import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey, isOpen]);

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

      <div className="relative bg-[#0e1626] rounded-3xl shadow-luxury-card border border-slate-700/80 max-w-lg w-full p-6 sm:p-8 z-10">

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
              <Key className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-heading font-black text-white">
              הגדרות Google Gemini API
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-heading font-bold text-slate-200 mb-2">
              מפתח ה-API האישי שלך:
            </label>
            <div className="relative">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#080d17] border border-slate-700/80 focus:border-danbar-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-danbar-500 font-mono tracking-wider"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-danbar-400 shrink-0" />
              <span>המפתח נשמר בדפדפן שלך בלבד ולא נשלח לשום שרת צד ג'.</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-danbar-950/40 border border-danbar-600/30 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-danbar-300">💡 היכן משיגים מפתח בחינם?</p>
            <p>
              ניתן להפיק מפתח API תוך שניות דרך פורטל המפתחים של גוגל:
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-danbar-400 hover:underline font-bold"
            >
              <span>Google AI Studio - Get API Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-danbar-600 hover:bg-danbar-500 shadow-glow-sm transition-all flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>נשמר בהצלחה!</span>
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
