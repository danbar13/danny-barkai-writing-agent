'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RawMaterialTab } from '@/components/RawMaterialTab';
import { WizardTab } from '@/components/WizardTab';
import { ChatTab } from '@/components/ChatTab';
import { PostPreview } from '@/components/PostPreview';
import { StyleInspector } from '@/components/StyleInspector';
import { SettingsModal } from '@/components/SettingsModal';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { TabType, WizardData, PostFormat, SavedPost, StyleAnalysis, ChatMessage } from '@/lib/types';
import { analyzeStyle } from '@/lib/styleAnalyzer';
import { PenTool, HelpCircle, MessageSquare, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('raw');
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | undefined>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load API key and saved posts from LocalStorage on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('danbar_gemini_api_key');
      if (storedKey) setApiKey(storedKey);

      const storedPosts = localStorage.getItem('danbar_saved_posts');
      if (storedPosts) setSavedPosts(JSON.parse(storedPosts));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  // Update style analysis whenever generated post changes
  useEffect(() => {
    if (generatedPost) {
      const analysis = analyzeStyle(generatedPost);
      setStyleAnalysis(analysis);
    } else {
      setStyleAnalysis(undefined);
    }
  }, [generatedPost]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem('danbar_gemini_api_key', key);
    } catch (e) {
      console.error('Failed to save API key to localStorage', e);
    }
  };

  const handleSavePost = (title: string, content: string) => {
    const newPost: SavedPost = {
      id: Date.now().toString(),
      title: title || 'פוסט ללא כותרת',
      content,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...savedPosts];
    setSavedPosts(updated);
    try {
      localStorage.setItem('danbar_saved_posts', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save post to localStorage', e);
    }
  };

  const handleDeleteSavedPost = (id: string) => {
    const updated = savedPosts.filter((p) => p.id !== id);
    setSavedPosts(updated);
    try {
      localStorage.setItem('danbar_saved_posts', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update saved posts in localStorage', e);
    }
  };

  const handleSelectSavedPost = (post: SavedPost) => {
    setGeneratedPost(post.content);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Chat message sender
  const handleSendChatMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          customApiKey: apiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה בקבלת תשובה מהסוכן');

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      setChatMessages([...newMessages, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `שגיאה: ${err.message || 'לא ניתן היה לקבל תשובה'}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages([...newMessages, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100 flex flex-col font-sans selection:bg-danbar-500/30 selection:text-danbar-200">

      {/* Executive Floating Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedPosts.length}
        hasCustomKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

        {/* Navigation Tabs Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0e1626]/90 backdrop-blur-xl border border-slate-700/60 shadow-luxury-card">

            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-heading font-extrabold transition-all ${
                activeTab === 'raw'
                  ? 'bg-danbar-600 text-white shadow-glow-sm scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>חומר גולמי לפוסט</span>
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-heading font-extrabold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-danbar-600 text-white shadow-glow-sm scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>אשף שאלות מונחה</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-heading font-extrabold transition-all ${
                activeTab === 'chat'
                  ? 'bg-danbar-600 text-white shadow-glow-sm scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>סיעור מוחות עם הסוכן</span>
            </button>

          </div>
        </div>

        {/* Tab 1: Raw Material to Post */}
        {activeTab === 'raw' && (
          <RawMaterialTab
            apiKey={apiKey}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            setGeneratedPost={setGeneratedPost}
          />
        )}

        {/* Tab 2: Guided Dilemma Wizard */}
        {activeTab === 'wizard' && (
          <WizardTab
            apiKey={apiKey}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            setGeneratedPost={setGeneratedPost}
          />
        )}

        {/* Tab 3: Interactive Brainstorm Chat */}
        {activeTab === 'chat' && (
          <ChatTab
            messages={chatMessages}
            isLoading={isChatLoading}
            onSendMessage={handleSendChatMessage}
            onClearChat={() => setChatMessages([])}
          />
        )}

        {/* Post Preview & Live Editor (Always visible when a post is generated) */}
        {generatedPost && (
          <div id="post-preview-section" className="space-y-8 animate-fadeIn">
            <PostPreview
              postContent={generatedPost}
              onUpdateContent={setGeneratedPost}
              onSavePost={handleSavePost}
            />

            {/* Signature Style Scorecard */}
            {styleAnalysis && (
              <StyleInspector analysis={styleAnalysis} />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a12] py-8 text-center text-xs text-slate-500 font-sans mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} DANBAR ייעוץ אסטרטגי, ארגוני ומשאבי אנוש — דני ברקאי. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://danbarblogs.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-danbar-400 transition-colors"
            >
              בלוג דילמות מעולמו של מנהל משאבי אנוש
            </a>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-danbar-400 transition-colors"
            >
              הגדרות API
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPosts={savedPosts}
        onSelectPost={handleSelectSavedPost}
        onDeletePost={handleDeleteSavedPost}
      />

    </div>
  );
}
