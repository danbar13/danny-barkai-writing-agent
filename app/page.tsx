'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RawMaterialTab } from '@/components/RawMaterialTab';
import { WizardTab } from '@/components/WizardTab';
import { ChatTab } from '@/components/ChatTab';
import { PostPreview } from '@/components/PostPreview';
import { StyleInspector } from '@/components/StyleInspector';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { ContentType, PostLength, StyleAnalysis, SavedPost, ChatMessage } from '@/lib/types';
import { FileText, Compass, MessageSquare, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'raw' | 'wizard' | 'chat'>('raw');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings & History
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('danny_custom_api_key');
      if (storedKey) setApiKey(storedKey);

      const storedPosts = localStorage.getItem('danny_saved_posts');
      if (storedPosts) setSavedPosts(JSON.parse(storedPosts));
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

  // Save API Key
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      if (key) {
        localStorage.setItem('danny_custom_api_key', key);
      } else {
        localStorage.removeItem('danny_custom_api_key');
      }
    } catch (e) {
      console.error('Failed to save API key:', e);
    }
  };

  // Save Post to History
  const handleSavePost = (content: string, title?: string) => {
    const newPost: SavedPost = {
      id: Date.now().toString(),
      title: title || 'פוסט שמור',
      content,
      contentType: 'blog',
      createdAt: Date.now(),
    };
    const updated = [newPost, ...savedPosts];
    setSavedPosts(updated);
    try {
      localStorage.setItem('danny_saved_posts', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save post to local storage:', e);
    }
  };

  // Delete Post from History
  const handleDeletePost = (id: string) => {
    const updated = savedPosts.filter((p) => p.id !== id);
    setSavedPosts(updated);
    try {
      localStorage.setItem('danny_saved_posts', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete post:', e);
    }
  };

  // Select Post from History
  const handleSelectPost = (post: SavedPost) => {
    setGeneratedContent(post.content);
  };

  // Generate Post (Raw Mode)
  const handleGenerateRaw = async (data: {
    topic: string;
    rawContent: string;
    contentType: ContentType;
    postLength: PostLength;
    researchFindings?: string;
    seriesPart?: string;
    customInstructions?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'raw',
          topic: data.topic,
          rawContent: data.rawContent,
          contentType: data.contentType,
          postLength: data.postLength,
          researchFindings: data.researchFindings,
          seriesPart: data.seriesPart,
          customInstructions: data.customInstructions,
          apiKey: apiKey || undefined,
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');
      }

      setGeneratedContent(resData.content);
      setStyleAnalysis(resData.analysis);

      setTimeout(() => {
        const el = document.getElementById('post-preview-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Post (Wizard Mode)
  const handleGenerateWizard = async (data: {
    contentType: ContentType;
    postLength: PostLength;
    researchFindings?: string;
    wizardAnswers: {
      dilemma: string;
      personalBackground: string;
      prosAndCons: string;
      concreteExample: string;
      personalStance: string;
    };
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'wizard',
          contentType: data.contentType,
          postLength: data.postLength,
          researchFindings: data.researchFindings,
          wizardAnswers: data.wizardAnswers,
          apiKey: apiKey || undefined,
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');
      }

      setGeneratedContent(resData.content);
      setStyleAnalysis(resData.analysis);

      setTimeout(() => {
        const el = document.getElementById('post-preview-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  // Send Chat Message
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          apiKey: apiKey || undefined,
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בשיחה עם הסוכן');
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resData.message,
        timestamp: Date.now(),
      };

      setChatMessages([...newMessages, assistantMsg]);
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאה בקבלת תשובה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedPosts.length}
        hasCustomKey={!!apiKey}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-start gap-3 text-red-800 dark:text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">שגיאה בפעולה:</span>
              <p>{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs"
            >
              סגור
            </button>
          </div>
        )}

        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-danbar-900 border border-gray-200 dark:border-danbar-800 shadow-sm max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'raw'
                  ? 'bg-danbar-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>יצירה מהירה (מחומר גולמי)</span>
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'wizard'
                  ? 'bg-danbar-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>אשף תשאול מונחה (5 שלבים)</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-danbar-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>צ'אט סיעור מוחות</span>
            </button>
          </div>
        </div>

        <div className="transition-all">
          {activeTab === 'raw' && (
            <RawMaterialTab
              onGenerate={handleGenerateRaw}
              apiKey={apiKey}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'wizard' && (
            <WizardTab
              onGenerate={handleGenerateWizard}
              apiKey={apiKey}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'chat' && (
            <ChatTab
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              onClearChat={() => setChatMessages([])}
              isLoading={isLoading}
            />
          )}
        </div>

        {generatedContent && (
          <div id="post-preview-section" className="space-y-6 pt-4">
            <PostPreview
              content={generatedContent}
              onChangeContent={setGeneratedContent}
              analysis={styleAnalysis}
              onSaveToHistory={handleSavePost}
            />

            <StyleInspector analysis={styleAnalysis} />
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-gray-200 dark:border-danbar-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} סוכן הכתיבה של דני ברקאי • DANBAR • מותאם לפריסה ב-Vercel</p>
      </footer>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPosts={savedPosts}
        onSelectPost={handleSelectPost}
        onDeletePost={handleDeletePost}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
