'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RawMaterialTab } from '@/components/RawMaterialTab';
import { WizardTab } from '@/components/WizardTab';
import { ChatTab } from '@/components/ChatTab';
import { PostPreview } from '@/components/PostPreview';
import { StyleModal } from '@/components/StyleInspector';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { ContentType, PostLength, StyleAnalysis, SavedPost, ChatMessage } from '@/lib/types';
import { FileText, Compass, MessageSquare, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'raw' | 'wizard' | 'chat'>('raw');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & History
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem('danny_saved_posts');
      if (storedPosts) setSavedPosts(JSON.parse(storedPosts));
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

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
    // Optionally trigger analysis
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
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');
      }

      const generated = resData.content || resData.post || '';
      setGeneratedContent(generated);
      setStyleAnalysis(resData.analysis);

      // Smooth scroll to preview
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const el = document.getElementById('post-preview-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
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
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');
      }

      const generated = resData.content || resData.post || '';
      setGeneratedContent(generated);
      setStyleAnalysis(resData.analysis);

      // Smooth scroll to preview
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const el = document.getElementById('post-preview-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
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

  // Reset Post and Start Fresh
  const handleResetPost = () => {
    setGeneratedContent('');
    setStyleAnalysis(undefined);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        savedCount={savedPosts.length}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Alert if any */}
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

        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0b1220]/90 backdrop-blur-xl border border-slate-700/70 shadow-luxury-card max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-heading font-black transition-all whitespace-nowrap ${
                activeTab === 'raw'
                  ? 'bg-danbar-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-danbar-300" />
              <span>יצירה מהירה (מח�]מר גולמי)</span>
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-heading font-black transition-all whitespace-nowrap ${
                activeTab === 'wizard'
                  ? 'bg-danbar-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-danbar-300" />
              <span>אשף תשאול מונחה (5 שלבים)</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-heading font-black transition-all whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-danbar-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-danbar-300" />
              <span>קאט סיעור מוחות</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="transition-all">
          {activeTab === 'raw' && (
            <RawMaterialTab
              onGenerate={handleGenerateRaw}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'wizard' && (
            <WizardTab
              onGenerate={handleGenerateWizard}
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

        {/* Generated Post Preview */}
        {generatedContent && (
          <div id="post-preview-section" className="pt-4">
            <PostPreview
              content={generatedContent}
              onChangeContent={setGeneratedContent}
              analysis={styleAnalysis}
              onSaveToHistory={handleSavePost}
              onResetPost={handleResetPost}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-sans">
        <p className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} סוכן הכתיבה של דני ברקאי</span>
          <span className="w-1.5 h-1.5 rounded-full bg-danbar-500 inline-block" />
          <span className="text-slate-400 font-bold">DANBAR Executive Consulting</span>
        </p>
      </footer>

      {/* Modals & Drawers */}
      <StyleModal
        isOpen={isStyleGuideOpen}
        onClose={() => setIsStyleGuideOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPosts={savedPosts}
        onSelectPost={handleSelectPost}
        onDeletePost={handleDeletePost}
      />
    </div>
  );
}
