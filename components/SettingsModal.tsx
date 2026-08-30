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

          {/* Key Input */}
          <div>
            <label className="block text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider mb-2.5">
              מפתח Gemini API אישי (נשמר מקומית בדפדפן בלבד)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3.5 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-2 focus:ring-danbar-500/20 outline-none text-sm font-mono placeholder-slate-500 shadow-inner"
            />
            <p className="text-xs text-slate-400 mt-2 font-sans">
              אם לא תזין מפתח, האפליקציה תשתמש במשתנה הסביבה <code className="bg-[#090f1c] px-2 py-0.5 rounded text-danbar-400 font-bold border border-slate-800">GEMINI_API_KEY</code> שהוגדר ב-Vercel.
            </p>
          </div>

          {/* Help box */}
          <div className="bg-[#090f1c] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-heading font-bold text-danbar-300">
              <HelpCircle className="w-4 h-4 text-danbar-400" />
              <span>איך משיגים מפתח בחינם?</span>
            </div>
            <p className="font-sans leading-relaxed">
              מפתח Gemini API ניתן לקבל בחינם לגמרי תוך דקה דרך פורטל Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-danbar-400 font-bold hover:underline"
            >
              <span>קבל מפתח ב-Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white text-sm font-heading font-bold transition-all flex items-center gap-2 shadow-glow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
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
