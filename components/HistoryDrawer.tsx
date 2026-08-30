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
        <div className="w-screen max-w-md bg-white dark:bg-danbar-900 shadow-2xl border-r border-gray-200 dark:border-danbar-800 flex flex-col">

          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-danbar-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-danbar-600 dark:text-gold-400" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                פוסטים שמורים ({savedPosts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-danbar-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {savedPosts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2 py-12">
                <FileText className="w-12 h-12 stroke-1 text-gray-300 dark:text-danbar-700" />
                <p className="text-sm font-medium">אין עדיין פוסטים שמורים</p>
                <p className="text-xs text-gray-400 max-w-[200px]">
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
                    className="p-4 rounded-xl border border-gray-200 dark:border-danbar-800 bg-gray-50/50 dark:bg-danbar-800/40 hover:border-danbar-400 dark:hover:border-danbar-600 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h3>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="מחק מהשמורים"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {post.content.slice(0, 140)}...
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 dark:border-danbar-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <button
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="text-danbar-600 dark:text-gold-400 font-bold hover:underline flex items-center gap-1"
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
