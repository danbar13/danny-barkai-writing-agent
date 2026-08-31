import React, { useState } from 'react';
import {
  Copy,
  Download,
  Bookmark,
  Check,
  Edit3,
  Eye,
  FileCheck,
  Printer,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
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
  const [copiedDocs, setCopiedDocs] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!content) return null;

  // Extract title if starts with #
  const firstLine = content.trim().split('\n')[0] || '';
  const title = firstLine.startsWith('#')
    ? firstLine.replace(/^#+\s*/, '')
    : 'פוסט מאת דני ברקאי';

  // Words and reading time
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
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

  // Export to Word / Google Docs formatted .doc file
  const handleExportGoogleDoc = () => {
    const formattedHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; line-height: 1.6; color: #1e293b; padding: 20px; }
          h1 { color: #587310; font-size: 22pt; margin-bottom: 8pt; }
          .header { border-bottom: 2pt solid #8db717; padding-bottom: 10pt; margin-bottom: 20pt; }
          .author { font-size: 11pt; color: #64748b; margin-top: 4pt; }
          p { font-size: 12pt; margin-bottom: 12pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="author">דני ברקאי | DANBAR ייעוץ אסטרטגי, ארגוני ומשאבי אנוש</div>
        </div>
        <div>
          ${content
            .split('\n\n')
            .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
            .join('')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + formattedHtml], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.slice(0, 35).replace(/[/\\?%*:|"<>]/g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy with rich HTML & open Google Docs
  const handleOpenGoogleDocs = async () => {
    const htmlSnippet = `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h1 style="color: #587310; font-size: 20pt; margin-bottom: 8pt;">${title}</h1>
        <p style="font-size: 10pt; color: #64748b; border-bottom: 1px solid #8db717; padding-bottom: 8px;">
          מאת: <strong>דני ברקאי</strong> — DANBAR ייעוץ אסטרטגי, ארגוני ומשאבי אנוש
        </p>
        ${content
          .split('\n\n')
          .map((p) => `<p style="font-size: 12pt; margin-bottom: 12pt;">${p.replace(/\n/g, '<br/>')}</p>`)
          .join('')}
      </div>
    `;

    try {
      const textBlob = new Blob([content], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlSnippet], { type: 'text/html' });
      const item = new ClipboardItem({
        'text/plain': textBlob,
        'text/html': htmlBlob,
      });
      await navigator.clipboard.write([item]);
      setCopiedDocs(true);
      setTimeout(() => setCopiedDocs(false), 3000);

      window.open('https://docs.new', '_blank');
    } catch (e) {
      navigator.clipboard.writeText(content);
      window.open('https://docs.new', '_blank');
    }
  };

  // Download / Print as PDF
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="utf-8">
        <title>${title} - דני ברקאי</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap');
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            direction: rtl;
            text-align: right;
            line-height: 1.7;
            color: #0f172a;
            padding: 10px;
          }
          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #73970e;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .logo-text {
            font-size: 20pt;
            font-weight: 800;
            color: #73970e;
            letter-spacing: -0.5px;
          }
          .logo-sub {
            font-size: 9pt;
            color: #64748b;
          }
          .doc-meta {
            font-size: 9pt;
            color: #64748b;
            text-align: left;
          }
          h1 {
            color: #1e293b;
            font-size: 18pt;
            font-weight: 800;
            line-height: 1.3;
            margin-bottom: 20px;
          }
          p {
            font-size: 11.5pt;
            margin-bottom: 16px;
            color: #334155;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            font-size: 9pt;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div>
            <div class="logo-text">DANBAR</div>
            <div class="logo-sub">ייעוץ אסטרטגי, ארגוני ומשאבי אנוש | דני ברקאי</div>
          </div>
          <div class="doc-meta">
            <div>${new Date().toLocaleDateString('he-IL')}</div>
            <div>סוכן הכתיבה של דני ברקאי</div>
          </div>
        </div>

        <h1>${title}</h1>
        <div>
          ${content
            .split('\n\n')
            .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
            .join('')}
        </div>

        <div class="footer">
          נכתב באמצעות סוכן הכתיבה של דני ברקאי • DANBAR Consulting
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleSave = () => {
    onSaveToHistory(content, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-[#0e1626]/95 backdrop-blur-2xl rounded-3xl shadow-luxury-card border border-slate-700/60 overflow-hidden transition-all">
      {/* Top Luxury Toolbar */}
      <div className="p-4 sm:p-5 bg-[#0a101d] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
        {/* Meta Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-bold text-white flex items-center gap-1.5 bg-[#141f33] px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-xs font-heading">
            <FileCheck className="w-4 h-4 text-danbar-400" />
            {wordCount} מילים
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">כ-{readTimeMinutes} דק' קריאה</span>
          {analysis && typeof analysis.score === 'number' && (
            <>
              <span className="text-slate-600">•</span>
              <span
                className={`font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 ${
                  analysis.score >= 80
                    ? 'bg-danbar-950 text-danbar-300 border border-danbar-600/50 shadow-glow-sm'
                    : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                ציון התאמה לסגנון: {analysis.score}/100
              </span>
            </>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Edit / View Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-700 bg-[#121c2e] text-slate-200 hover:bg-[#1a2942] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
            title={isEditing ? 'תצוגה מעוצבת' : 'עריכת טקסט'}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5 text-danbar-400" /> : <Edit3 className="w-3.5 h-3.5 text-danbar-400" />}
            <span>{isEditing ? 'תצוגה מעוצבת' : 'ערוך'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-700 bg-[#121c2e] text-slate-200 hover:bg-[#1a2942] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
            title="העתק טקסט ללוח"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-danbar-400" /> : <Copy className="w-3.5 h-3.5 text-danbar-400" />}
            <span>{copied ? 'הועתק!' : 'העתק'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-danbar-700/60 bg-[#142238] text-danbar-300 hover:bg-[#1b2f4f] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
            title="הורד והדפס כקובץ PDF מעוצב"
          >
            <Printer className="w-3.5 h-3.5 text-danbar-400" />
            <span>הורד כ-PDF</span>
          </button>

          {/* Google Docs Export */}
          <button
            onClick={handleExportGoogleDoc}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-blue-800/60 bg-[#0d1e38] text-blue-300 hover:bg-[#142a4e] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
            title="הורד כקובץ Word / גוגל דוקס (.doc)"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>הורד כ-Docs (.doc)</span>
          </button>

          {/* Open Directly in Google Docs */}
          <button
            onClick={handleOpenGoogleDocs}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-blue-700/80 bg-[#12233f] text-blue-200 hover:bg-[#1a335a] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
            title="מעתיק את הפוסט מעוצב ופותח מסמך חדש ב-Google Docs להדבקה מיידית (Ctrl+V)"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>{copiedDocs ? 'הועתק! פותח Docs...' : 'פתח בגוגל דוקס'}</span>
          </button>

          {/* Save to History */}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-heading font-black rounded-xl bg-danbar-600 hover:bg-danbar-500 text-white transition-all flex items-center gap-1.5 shadow-glow-sm"
            title="שמור בארכיון הפוסטים האישי שלך"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'נשמר בהצלחה!' : 'שמור פוסט'}</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-12">
        {isEditing ? (
          <textarea
            rows={22}
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            className="w-full p-6 bg-[#080d17] text-slate-100 font-mono text-sm leading-relaxed border border-slate-700 rounded-2xl focus:ring-2 focus:ring-danbar-500 outline-none transition-all shadow-inner"
          />
        ) : (
          <div className="prose max-w-none text-right font-sans text-slate-100 leading-[2.1] text-base sm:text-[1.15rem] whitespace-pre-wrap selection:bg-danbar-500/30 selection:text-danbar-200">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
