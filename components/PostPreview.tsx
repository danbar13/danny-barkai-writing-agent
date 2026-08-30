import React, { useState } from 'react';
import { Copy, Download, Bookmark, Check, Edit3, Eye, FileCheck } from 'lucide-react';
import { StyleAnalysis } from '@/lib/types';

interface PostPreviewProps {
  content: string;
  onChangeContent: (newContent: string) => void;
  analysis?: StyleAnalysis;
  onSaveToHistory: (content: string, title?: string) => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  onChangeContent,
  analysis,
  onSaveToHistory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!content) return null;

  const firstLine = content.trim().split('\n')[0] || '';
  const title = firstLine.startsWith('#') ? firstLine.replace(/^#+\s*/, '') : 'פוסט ללא כותרת';

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.slice(0, 30).replace(/[/\\?%*:|"<>]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSaveToHistory(content, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-danbar-900 rounded-2xl shadow-sm border border-gray-200 dark:border-danbar-800 overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="p-4 sm:p-5 bg-gray-50/80 dark:bg-danbar-800/60 border-b border-gray-200 dark:border-danbar-700 flex flex-wrap items-center justify-between gap-3">
        
        {/* Meta Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
            <FileCheck className="w-4 h-4 text-danbar-600 dark:text-gold-400" />
            {wordCount} מילים
          </span>
          <span>•</span>
          <span>כ-{readTimeMinutes} דק' קריאה</span>
          {analysis && (
            <>
              <span>•</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                analysis.score >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-gold-400'
              }`}>
                ציון סגנון: {analysis.score}/100
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-danbar-800 transition-colors flex items-center gap-1.5"
            title={isEditing ? 'תצוגה מקדימה' : 'עריכת טקסט'}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'תצוגה מקדימה' : 'ערוך'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-danbar-800 transition-colors flex items-center gap-1.5"
            title="העתק ללוח"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'הועתק!' : 'העתק'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-danbar-800 transition-colors flex items-center gap-1.5"
            title="הורד כקובץ Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">הורד (.md)</span>
          </button>

          <button
            onClick={handleSave}
            className="p-2 text-xs font-medium rounded-lg bg-danbar-700 hover:bg-danbar-800 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            title="שמור בהיסטוריה מקומית"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-gold-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'נשמר בהצלחה!' : 'שמור פוסט'}</span>
          </button>
        </div>

      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-10">
        {isEditing ? (
          <textarea
            rows={20}
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-danbar-950 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed border border-gray-200 dark:border-danbar-800 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none"
          />
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none text-right font-sans text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg whitespace-pre-wrap selection:bg-gold-500/20">
            {content}
          </div>
        )}
      </div>

    </div>
  );
};
