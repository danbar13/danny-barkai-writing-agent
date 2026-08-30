import React from 'react';
import { X, Bookmark, Trash2, Calendar, FileText, ArrowLeft, Download } from 'lucide-react';
import { SavedPost } from '@/lib/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPosts: SavedPost[];
  onSelectPost: (post: SavedPost) => void;
  onDeletePost: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedPosts,
  onSelectPost,
  onDeletePost,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e1626] shadow-2xl border-r border-slate-700/80 flex flex-col">

          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0a101d]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-danbar-950 text-danbar-400 border border-danbar-600/30 shadow-glow-sm">
                <Bookmark className="w-5 h-5" />
              </span>
              <h2 className="text-base font-heading font-black text-white">
                פוסטים שמורים ({savedPosts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {savedPosts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 py-12">
                <FileText className="w-12 h-12 stroke-1 text-slate-600" />
                <p className="text-sm font-heading font-bold text-slate-300">אין עדיין פוסטים שמורים</p>
                <p className="text-xs text-slate-500 max-w-[220px] font-sans">
                  לאחר הפקת פוסט תוכל ללחוץ על 'שמור פוסט' והוא יישמר כאן בדפדפן.
                </p>
              </div>
            ) : (
              savedPosts.map((post) => {
                const words = post.content.split(/\s+/).filter(Boolean).length;
                const dateStr = new Date(post.createdAt).toLocaleDateString('he-IL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-[#090f1c] hover:border-danbar-500/50 hover:bg-[#121c30] transition-all group shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-sm font-heading font-bold text-white line-clamp-2">
                        {post.title}
                      </h3>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="מחק מהשמורים"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed font-sans">
                      {post.content.slice(0, 140)}...
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-danbar-400" />
                        {dateStr}
                      </span>
                      <button
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="text-danbar-400 font-bold hover:underline flex items-center gap-1 font-heading"
                      >
                        <span>טען פוסט</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
