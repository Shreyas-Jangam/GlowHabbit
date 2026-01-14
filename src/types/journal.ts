import { EmotionTag, SentimentLabel } from '@/utils/sentimentAnalysis';

export interface SentimentData {
  score: number; // -100 to +100
  label: SentimentLabel;
  confidence: 'low' | 'medium' | 'high';
  emotions: EmotionTag[];
  analyzedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'low' | 'rough';
  manualMood?: boolean; // true if user manually set mood
  sentiment?: SentimentData;
  habitsSummary?: {
    completed: number;
    total: number;
    habits: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface JournalStats {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  thisMonthEntries: number;
  avgWordsPerEntry: number;
}

export interface MoodAnalytics {
  averageScore: number;
  positiveRatio: number;
  emotionalStability: number;
  dominantEmotions: { emotion: EmotionTag; count: number }[];
  moodByDay: { date: string; score: number; label: SentimentLabel }[];
}

export const MOOD_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  great: { label: 'Great', emoji: '😊', color: 'text-success' },
  good: { label: 'Good', emoji: '🙂', color: 'text-primary' },
  okay: { label: 'Okay', emoji: '😐', color: 'text-muted-foreground' },
  low: { label: 'Low', emoji: '😔', color: 'text-warning' },
  rough: { label: 'Rough', emoji: '😢', color: 'text-destructive' },
};

export const JOURNAL_PROMPTS = [
  "How do you feel today?",
  "What went well today?",
  "What challenged you today?",
  "What are you grateful for?",
  "What can you improve tomorrow?",
  "What's one thing you learned today?",
  "What made you smile today?",
  "What's on your mind right now?",
  "What are you looking forward to?",
  "How did you take care of yourself today?",
  "What would make tomorrow great?",
  "What's something you're proud of?",
  "Who made a positive impact on your day?",
  "What's a challenge you overcame recently?",
  "What's something you want to remember about today?",
];
