import React, { useState } from 'react';
import { Copy, Check, Bookmark, Download, Sparkles, FileText, Printer, FileDown, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PostPreviewProps {
  postContent: string;
  onUpdateContent: (content: string) => void;
  onSavePost: (title: string, content: string) => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  postContent,
  onUpdateContent,
  onSavePost,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Extract title (first line)
  const extractTitle = (text: string) => {
    const lines = text.trim().split('\n');
    return lines[0]?.replace(/^#*\s*/, '') || 'פוסט חדש';
  };

  const postTitle = extractTitle(postContent);

  const handleCopy = () => {
    navigator.clipboard.writeText(postContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSavePost(postTitle, postContent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([postContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${postTitle.slice(0, 30)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="utf-8">
        <title>${postTitle}</title>
        <style>
          body {
            font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;
            line-height: 1.8;
            padding: 40px;
            color: #1e293b;
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3 { font-family: 'Heebo', sans-serif; color: #0f172a; }
          .header { border-bottom: 2px solid #73970e; padding-bottom: 12px; margin-bottom: 24px; }
          .logo { font-size: 14px; font-weight: bold; color: #73970e; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #64748b; }
          .content { white-space: pre-wrap; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">DANBAR ייעוץ אסטרטגי, ארגוני ומשאבי אנוש — דני ברקאי</div>
        </div>
        <div class="content">${postContent.replace(/\n/g, '<br/>')}</div>
        <div class="footer">הופק באמצעות סוכן הכתיבה של דני ברקאי — ${new Date().toLocaleDateString('he-IL')}</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
      "xmlns='http://www.w3.org/TR/REC-html40'>"+
      "<head><meta charset='utf-8'><title>" + postTitle + "</title>"+
      "<style>body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; direction: rtl; }</style></head><body>";
    const footer = "</body></html>";
    const formattedContent = postContent.replace(/\n/g, "<br/>");
    const sourceHTML = header + "<h2>" + postTitle + "</h2>" + formattedContent + footer;

    const blob = new Blob(['\ufeff' + sourceHTML], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${postTitle.slice(0, 30)}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenGoogleDoc = () => {
    navigator.clipboard.writeText(postContent);
    window.open('https://docs.new', '_blank');
  };

  const wordCount = postContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = postContent.length;

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 transition-all overflow-hidden">

      {/* Top Toolbar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0a101d] flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 flex items-center justify-center font-bold shadow-glow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-heading font-black text-white line-clamp-1">
              {postTitle}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-sans mt-0.5">
              <span>{wordCount} מילים</span>
              <span>•</span>
              <span>{charCount} תווים</span>
              <span>•</span>
              <span className="text-danbar-400 font-medium">סגנון DANBAR חתום</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Edit / Preview Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            {isEditing ? 'תצוגה מקדימה' : 'עריכה ידנית'}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            title="העתק ללוח"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">הועתק!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>העתק</span>
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            title="שמור פוסט בהיסטוריה"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-danbar-400" />
                <span className="text-danbar-400">נשמר!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-danbar-400" />
                <span>שמור פוסט</span>
              </>
            )}
          </button>

          {/* PDF Export */}
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
            title="ייצוא והדפסה כ-PDF"
          >
            <Printer className="w-3.5 h-3.5 text-danbar-400" />
            <span>PDF</span>
          </button>

          {/* Word / Doc Export */}
          <button
            onClick={handleDownloadDoc}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
            title="הורדה כקובץ Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5 text-danbar-400" />
            <span>Word (.doc)</span>
          </button>

          {/* Google Docs */}
          <button
            onClick={handleOpenGoogleDoc}
            className="px-3.5 py-2 text-xs font-heading font-bold rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white transition-all flex items-center gap-1.5 shadow-glow-sm"
            title="העתק ופתח Google Doc חדש"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Docs</span>
          </button>
        </div>
      </div>

      {/* Post Content Area */}
      <div className="p-6 sm:p-10">
        {isEditing ? (
          <textarea
            value={postContent}
            onChange={(e) => onUpdateContent(e.target.value)}
            rows={18}
            className="w-full p-6 bg-[#080d17] text-white border border-slate-700/80 rounded-2xl focus:border-danbar-500 focus:ring-2 focus:ring-danbar-500/20 outline-none text-base sm:text-lg leading-[2.1] font-sans font-normal resize-y shadow-inner"
            placeholder="ערוך את תוכן הפוסט..."
          />
        ) : (
          <div className="prose max-w-none text-slate-100 font-sans text-base sm:text-lg leading-[2.1] whitespace-pre-wrap selection:bg-danbar-500/40">
            {postContent}
          </div>
        )}
      </div>

    </div>
  );
};
