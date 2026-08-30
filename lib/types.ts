export type ContentType = 'blog' | 'linkedin' | 'opinion' | 'series';
export type PostLength = 'short' | 'medium' | 'long';

export interface PostGenerationRequest {
  mode: 'raw' | 'wizard';
  topic?: string;
  rawContent?: string;
  contentType: ContentType;
  postLength?: PostLength;
  researchFindings?: string;
  seriesPart?: string; // e.g. "1/3"
  wizardAnswers?: {
    dilemma: string;
    personalBackground: string;
    prosAndCons: string;
    concreteExample: string;
    personalStance: string;
  };
  customInstructions?: string;
  apiKey?: string;
}

export interface ResearchRequest {
  topic: string;
  context?: string;
  apiKey?: string;
}

export interface ResearchResponse {
  success: boolean;
  findings?: string;
  sources?: string[];
  error?: string;
}

export interface PostGenerationResponse {
  success: boolean;
  content?: string;
  title?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface StyleMetric {
  name: string;
  label: string;
  count: number;
  expectedMin: number;
  passed: boolean;
  explanation: string;
}

export interface StyleAnalysis {
  score: number; // 0 - 100
  totalWords: number;
  totalSentences: number;
  avgSentenceLength: number;
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
  tags?: string[];
}
