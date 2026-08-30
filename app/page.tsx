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
          apiKey: apiKey || undefined,
        }),
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');
      }

      setGeneratedContent(resData.content);
      setStyleAnalysis(resData.analysis);

      // Smooth scroll to preview
      setTimeout(() => {
        const el = document.getElementById('post-preview-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {\n      setErrorMessage(err.message || 'שגיאה בלתי צפויה');\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  // Generate Post (Wizard Mode)\n  const handleGenerateWizard = async (data: {\n    contentType: ContentType;\n    postLength: PostLength;\n    researchFindings?: string;\n    wizardAnswers: {\n      dilemma: string;\n      personalBackground: string;\n      prosAndCons: string;\n      concreteExample: string;\n      personalStance: string;\n    };\n  }) => {\n    setIsLoading(true);\n    setErrorMessage(null);\n    try {\n      const res = await fetch('/api/generate', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          mode: 'wizard',\n          contentType: data.contentType,\n          postLength: data.postLength,\n          researchFindings: data.researchFindings,\n          wizardAnswers: data.wizardAnswers,\n          apiKey: apiKey || undefined,\n        }),\n      });\n\n      const resData = await res.json();\n      if (!resData.success) {\n        throw new Error(resData.error || 'שגיאה בהפקת הפוסט');\n      }\n\n      setGeneratedContent(resData.content);\n      setStyleAnalysis(resData.analysis);\n\n      // Smooth scroll to preview\n      setTimeout(() => {\n        const el = document.getElementById('post-preview-section');\n        el?.scrollIntoView({ behavior: 'smooth' });\n      }, 200);\n    } catch (err: any) {\n      setErrorMessage(err.message || 'שגיאה בלתי צפויה');\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  // Send Chat Message\n  const handleSendChatMessage = async (text: string) => {\n    const userMsg: ChatMessage = {\n      id: Date.now().toString(),\n      role: 'user',\n      content: text,\n      timestamp: Date.now(),\n    };\n\n    const newMessages = [...chatMessages, userMsg];\n    setChatMessages(newMessages);\n    setIsLoading(true);\n    setErrorMessage(null);\n\n    try {\n      const res = await fetch('/api/chat', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),\n          apiKey: apiKey || undefined,\n        }),\n      });\n\n      const resData = await res.json();\n      if (!resData.success) {\n        throw new Error(resData.error || 'שגיאה בשיחה עם הסוכן');\n      }\n\n      const assistantMsg: ChatMessage = {\n        id: (Date.now() + 1).toString(),\n        role: 'assistant',\n        content: resData.message,\n        timestamp: Date.now(),\n      };\n\n      setChatMessages([...newMessages, assistantMsg]);\n    } catch (err: any) {\n      setErrorMessage(err.message || 'שגיאה בקבלת תשובה');\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  return (\n    <div className=\"min-h-screen flex flex-col\">\n      \n      {/* Header */}\n      <Header\n        onOpenSettings={() => setIsSettingsOpen(true)}\n        onOpenHistory={() => setIsHistoryOpen(true)}\n        savedCount={savedPosts.length}\n        hasCustomKey={!!apiKey}\n      />\n\n      {/* Main Content Container */}\n      <main className=\"flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8\">\n        \n        {/* Error Alert if any */}\n        {errorMessage && (\n          <div className=\"bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-start gap-3 text-red-800 dark:text-red-300 text-sm\">\n            <AlertCircle className=\"w-5 h-5 shrink-0 mt-0.5\" />\n            <div className=\"flex-1\">\n              <span className=\"font-bold block mb-0.5\">שגיאה בפעולה:</span>\n              <p>{errorMessage}</p>\n            </div>\n            <button\n              onClick={() => setErrorMessage(null)}\n              className=\"text-red-500 hover:text-red-700 font-bold text-xs\"\n            >\n              סגור\n            </button>\n          </div>\n        )}\n\n        {/* Tab Navigation */}\n        <div className=\"flex items-center justify-center\">\n          <div className=\"inline-flex p-1.5 rounded-2xl bg-white dark:bg-danbar-900 border border-gray-200 dark:border-danbar-800 shadow-sm max-w-full overflow-x-auto\">\n            <button\n              onClick={() => setActiveTab('raw')}\n              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${\n                activeTab === 'raw'\n                  ? 'bg-danbar-700 text-white shadow-sm'\n                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'\n              }`}\n            >\n              <FileText className=\"w-4 h-4\" />\n              <span>יצירה מהירה (מחומר גולמי)</span>\n            </button>\n\n            <button\n              onClick={() => setActiveTab('wizard')}\n              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${\n                activeTab === 'wizard'\n                  ? 'bg-danbar-700 text-white shadow-sm'\n                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'\n              }`}\n            >\n              <Compass className=\"w-4 h-4\" />\n              <span>אשף תשאול מונחה (5 שלבים)</span>\n            </button>\n\n            <button\n              onClick={() => setActiveTab('chat')}\n              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${\n                activeTab === 'chat'\n                  ? 'bg-danbar-700 text-white shadow-sm'\n                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'\n              }`}\n            >\n              <MessageSquare className=\"w-4 h-4\" />\n              <span>צ'אט סיעור מוחות</span>\n            </button>\n          </div>\n        </div>\n\n        {/* Tab Contents */}\n        <div className=\"transition-all\">\n          {activeTab === 'raw' && (\n            <RawMaterialTab\n              onGenerate={handleGenerateRaw}\n              apiKey={apiKey}\n              isLoading={isLoading}\n            />\n          )}\n\n          {activeTab === 'wizard' && (\n            <WizardTab\n              onGenerate={handleGenerateWizard}\n              apiKey={apiKey}\n              isLoading={isLoading}\n            />\n          )}\n\n          {activeTab === 'chat' && (\n            <ChatTab\n              messages={chatMessages}\n              onSendMessage={handleSendChatMessage}\n              onClearChat={() => setChatMessages([])}\n              isLoading={isLoading}\n            />\n          )}\n        </div>\n\n        {/* Generated Post Preview & Style Inspector Section */}\n        {generatedContent && (\n          <div id=\"post-preview-section\" className=\"space-y-6 pt-4\">\n            <PostPreview\n              content={generatedContent}\n              onChangeContent={setGeneratedContent}\n              analysis={styleAnalysis}\n              onSaveToHistory={handleSavePost}\n            />\n\n            <StyleInspector analysis={styleAnalysis} />\n          </div>\n        )}\n\n      </main>\n\n      {/* Footer */}\n      <footer className=\"mt-auto border-t border-gray-200 dark:border-danbar-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400\">\n        <p>© {new Date().getFullYear()} סוכן הכתיבה של דני ברקאי • DANBAR • מותאם לפריסה ב-Vercel</p>\n      </footer>\n\n      {/* Modals & Drawers */}\n      <HistoryDrawer\n        isOpen={isHistoryOpen}\n        onClose={() => setIsHistoryOpen(false)}\n        savedPosts={savedPosts}\n        onSelectPost={handleSelectPost}\n        onDeletePost={handleDeletePost}\n      />\n\n      <SettingsModal\n        isOpen={isSettingsOpen}\n        onClose={() => setIsSettingsOpen(false)}\n        apiKey={apiKey}\n        onSaveApiKey={handleSaveApiKey}\n      />\n\n    </div>\n  );\n}\n