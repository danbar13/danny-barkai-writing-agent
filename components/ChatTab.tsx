import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
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
    'בוא נפתח דילמה חדשה: עובדי קבלן מול עובדי בית במלון...',
    'איך היית מנסח דוגמה מוחשית ("דמיינו לעצמכם") לנושא שחיקת מנהלים?',
    'עזור לי ללטש את טיעוני הבעד והנגד סביב מבחני מיון ממוחשבים.',
    'כתוב לי פסקת פתיחה בסגנון "בעבר היה נהוג ש-... כיום...".',
  ];

  return (
    <div className="bg-white dark:bg-danbar-900 rounded-2xl shadow-sm border border-gray-200 dark:border-danbar-800 flex flex-col h-[650px]">
      
      {/* Chat Top Bar */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-danbar-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-danbar-100 dark:bg-danbar-800 text-danbar-700 dark:text-gold-400 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              שיחה וסיעור מוחות עם הסוכן
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              חושבים בקול יחד על דילמות ניהוליות, מלטשים פסקאות ורעיונות
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-danbar-800 flex items-center gap-1"
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
            <div className="w-14 h-14 rounded-2xl bg-danbar-50 dark:bg-danbar-800/80 text-danbar-600 dark:text-gold-400 flex items-center justify-center border border-danbar-200 dark:border-danbar-700 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                שלום דני! איך נוכל לעבוד היום?
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                תוכל להתייעץ איתי על כיוון לפוסט חדש, לבקש ממני לפתח דילמה ספציפית, או ללטש רעיון גולמי.
              </p>
            </div>

            {/* Quick prompts */}
            <div className="w-full pt-2 space-y-2">
              <span className="text-[11px] text-gray-400 block text-right font-medium">
                הצעות להתחלת שיחה:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-right text-xs bg-gray-50 dark:bg-danbar-800/60 hover:bg-danbar-50 dark:hover:bg-danbar-800 text-gray-700 dark:text-gray-200 p-2.5 rounded-xl border border-gray-200 dark:border-danbar-700 transition-colors"
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
                  <div className="w-8 h-8 rounded-lg bg-danbar-700 text-gold-400 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isAssistant
                      ? 'bg-gray-100 dark:bg-danbar-800 text-gray-900 dark:text-gray-100 rounded-tr-sm border border-gray-200/50 dark:border-danbar-700'
                      : 'bg-danbar-700 text-white rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {!isAssistant && (
                  <div className="w-8 h-8 rounded-lg bg-danbar-900 text-white flex items-center justify-center shrink-0 mt-1 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-danbar-700 text-gold-400 flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 dark:bg-danbar-800 rounded-2xl px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-danbar-600 dark:text-gold-400" />
              <span>דני חושב ומנסח...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-100 dark:border-danbar-800 bg-gray-50/50 dark:bg-danbar-900/50 flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה לסוכן הכתיבה..."
          className="flex-1 px-4 py-3 bg-white dark:bg-danbar-800 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-sm placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-danbar-700 hover:bg-danbar-800 text-white rounded-xl disabled:opacity-40 transition-all shadow-sm"
          title="שלח"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
