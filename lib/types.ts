export type ContentType = 'blog' | 'linkedin' | 'opinion' | 'series';
export type PostLength = 'short' | 'medium' | 'long';

export interface StyleMetric {
  ruleName: string;
  passed: boolean;
  count: number;
  label: string;
  explanation: string;
}

export interface StyleAnalysis {
  score: number;
  totalWords: number;
  totalSentences: number;
  avgWordsPerSentence: number;
  metrics: StyleMetric[];
  detectedAnchors: string[];
  suggestions: string[];
}

export interface SavedPost {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  createdAt: number;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
