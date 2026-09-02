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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-between p-4">
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
              ×”×’×“×¨×•×ª Google Gemini API
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
              ×™ízMz­yrvVÖ–æ’’yyzy’zzyíz‚yíz}y]yíyz¢yy=zMy=zMyòyyÍyy2¢ÂöÆ&VÃà¢Æ–çW@¢G—SÒ'77v÷&B ¢fÇVS×·FV×¶W—Ð¢öä6†ævS×²†R’Óâ6WEFV×¶W’†RçF&vWBçfÇVR—Ð¢Æ6V†öÆFW#Ò$—¦7’âââ ¢6Æ74æÖSÒ'rÖgVÆÂ‚ÓB’Ó2ãR&rÕ²3ƒCuÒFW‡B×v†—FR&÷&FW"&÷&FW"×6ÆFRÓsóƒ&÷VæFVBÓ'†Âfö7W3¦&÷&FW"ÖFæ&"ÓSfö7W3§&–ærÓ"fö7W3§&–ærÖFæ&"ÓSó#÷WFÆ–æRÖæöæRFW‡B×6ÒföçBÖÖöæòÆ6V†öÆFW"×6ÆFRÓS6†F÷rÖ–ææW" ¢óà¢Ç6Æ74æÖSÒ'FW‡B×‡2FW‡B×6ÆFRÓC×BÓ"föçB×6ç2#à¢yyÒyÍyz­ymyyòyízMz­yrÂyMyzMyÍyz}zmyyBz­zz­yíz’yyízz­zyByMzyyyyBÆ6öFR6Æ74æÖSÒ&&rÕ²3“c5Ò‚Ó"’ÓãR&÷VæFVBFW‡BÖFæ&"ÓCföçBÖ&öÆB&÷&FW"&÷&FW"×6ÆFRÓƒ#ätTÔ”ä•ô•ô´U“Âö6öFSâzyMy]y-y=z‚yÕfW&6VÂà¢Â÷à¢ÂöF—cà ¢²ò¢†VÇ&÷‚¢÷Ð¢ÆF—b6Æ74æÖSÒ&&rÕ²3“c5ÒÓB&÷VæFVBÓ'†Â&÷&FW"&÷&FW"×6ÆFRÓƒ76R×’Ó"FW‡B×‡2FW‡B×6ÆFRÓ3#à¢ÆF—b6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"vÓ"föçBÖ†VF–ærföçBÖ&öÆBFW‡BÖFæ&"Ó3#à¢Ä†VÇ6—&6ÆR6Æ74æÖSÒ'rÓB‚ÓBFW‡BÖFæ&"ÓC"óà¢Ç7ãíyyy¢yízyy-yyÒyízMz­yryy}yzyÓóÂ÷7ãà¢ÂöF—cà¢Ç6Æ74æÖSÒ&föçB×6ç2ÆVF–ær×&VÆ†VB#à¢yízMz­yrvVÖ–æ’’zyz­yòyÍz}yyÂyy}yzyÒyÍy-yízy’z­y]y¢y=z}yBy=zy¢zMy]zyyÂvöövÆR’7GVF–òà¢Â÷à¢Æ¢‡&VcÒ&‡GG3¢òö—7GVF–òævöövÆRæ6öÒöö–¶W’ ¢F&vWCÒ%ö&Ææ² ¢&VÃÒ&æö÷VæW"æ÷&VfW'&W" ¢6Æ74æÖSÒ&–æÆ–æRÖfÆW‚—FV×2Ö6VçFW"vÓFW‡BÖFæ&"ÓCföçBÖ&öÆB†÷fW#§VæFW&Æ–æR ¢à¢Ç7ãíz}yyÂyízMz­yryÔvöövÆR’7GVF–óÂ÷7ãà¢ÄW‡FW&æÄÆ–æ²6Æ74æÖSÒ'rÓ2ãR‚Ó2ãR"óà¢Âöà¢ÂöF—cà ¢²ò¢'WGFöç2¢÷Ð¢ÆF—b6Æ74æÖSÒ&fÆW‚§W7F–g’ÖVæBvÓ2BÓB&÷&FW"×B&÷&FW"×6ÆFRÓƒ#à¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×¶öä6Æ÷6WÐ¢6Æ74æÖSÒ'‚ÓR’Ó"ãR&÷VæFVB×†Â&÷&FW"&÷&FW"×6ÆFRÓsFW‡B×6ÆFRÓ3FW‡B×6ÒföçB×6VÖ–&öÆB†÷fW#¦&r×6ÆFRÓƒG&ç6—F–öâÖ6öÆ÷'26†F÷r×‡2 ¢à¢yyyy]yÀ¢Âö'WGFöãà¢Æ'WGFöà¢G—SÒ'7V&Ö—B ¢6Æ74æÖSÒ'‚Ób’Ó"ãR&÷VæFVB×†Â&rÖFæ&"Óc†÷fW#¦&rÖFæ&"ÓSFW‡B×v†—FRFW‡B×6ÒföçBÖ†VF–ærföçBÖ&öÆBG&ç6—F–öâÖÆÂfÆW‚—FV×2Ö6VçFW"vÓ"6†F÷rÖvÆ÷r×6Ò ¢à¢·6fVBò€¢Ãà¢Ä6†V6²6Æ74æÖSÒ'rÓB‚ÓBFW‡B×v†—FR"óà¢Ç7ãízzyíz‚Â÷7ãà¢Âóà¢’¢€¢Ç7ãízyíy]z‚yMy-y=zy]z£Â÷7ãà¢—Ð¢Âö'WGFöãà¢ÂöF—cà ¢Âöf÷&Óà ¢ÂöF—cà¢ÂöF—cà¢“°§Ó°Ð