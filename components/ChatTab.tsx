import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatTabProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const quickPrompts = [
    'אני מתלבט לגבי הטמעת כלי AI במשאבי אנוש לעומת היחס האישי. איך לבנות על זה פוסט?',
    'תן לי דוגמה מוחשית מהשטח לדילמה בין מנהל ישיר להנהלה בכירה סביב תגמול עובדים.',
    'איך לנסח פוסט על שיווק B2B של תוכנות טרבל-טק שמדגיש את השמרנות של המלונאים?',
  ];

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 flex flex-col h-[680px] transition-all overflow-hidden">

      {/* Chat Top Bar */}
      <div className="px-6 py-4 border-b border-slate-800/90 bg-[#0a101d] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-danbar-950 text-danbar-400 border border-danbar-600/40 shadow-glow-sm flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-black text-white">
              שיחה וסיעור מוחות עם הסוכן
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              חושבים בקול יחד על דילמות ניהוליות, מלטשים פסקאות ורעיונות
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-slate-800 flex items-center gap-1.5"
            title="נקה שיחה"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">נקה שיחה</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-danbar-950 text-danbar-400 flex items-center justify-center border border-danbar-600/30 shadow-glow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-heading font-black text-white">
                שלום דני! איך נוכל לעבוד היום?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed font-sans">
                תוכל להתייעץ איתי על כיוון לפוסט חדש, לבקש ממני לפתח דילמה ספציפית, או ללטש רעיון גולמי.
              </p>
            </div>

            {/* Quick prompts */}
            <div className="w-full pt-2 space-y-2">
              <span className="text-[11px] text-slate-400 block text-right font-bold">
                הצעות להתחלת שיחה:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-right text-xs bg-[#090f1c] hover:bg-[#142238] hover:border-danbar-500/40 text-slate-300 hover:text-white p-3 rounded-2xl border border-slate-800 transition-all font-sans"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 flex items-center justify-center shrink-0 mt-1 text-xs shadow-glow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                    isAssistant
                      ? 'bg-[#090f1c] text-slate-100 rounded-tr-sm border border-slate-800 shadow-sm'
                      : 'bg-danbar-600 text-white rounded-tl-sm shadow-glow-sm font-medium'
                  }`}
                >
                  {msg.content}
                </div>
                {!isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 flex items-center justify-center shrink-0 text-xs shadow-glow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#090f1c] rounded-2xl px-4 py-3 text-xs text-slate-400 border border-slate-800 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-danbar-400" />
              <span>דני חושב ומנסח...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-800/90 bg-[#0a101d] flex gap-2.5 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה לסוכן הכתיבה..."
          className="flex-1 px-4 py-3.5 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-2 focus:ring-danbar-500/20 outline-none text-sm placeholder-slate-500 font-sans shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3.5 bg-danbar-600 hover:bg-danbar-500 text-white rounded-2xl disabled:opacity-40 transition-all shadow-glow-sm"
          title="שלח"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
