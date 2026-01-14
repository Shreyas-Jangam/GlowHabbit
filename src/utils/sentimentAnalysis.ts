import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export type EmotionTag = 
  | 'calm' 
  | 'stressed' 
  | 'happy' 
  | 'anxious' 
  | 'motivated' 
  | 'overwhelmed' 
  | 'grateful'
  | 'sad'
  | 'excited'
  | 'peaceful';

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface SentimentResult {
  score: number; // -100 to +100
  comparative: number;
  label: SentimentLabel;
  confidence: 'low' | 'medium' | 'high';
  emotions: EmotionTag[];
  positiveWords: string[];
  negativeWords: string[];
}

// Emotion keyword mappings
const EMOTION_KEYWORDS: Record<EmotionTag, string[]> = {
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'still', 'centered', 'balanced', 'composed'],
  stressed: ['stressed', 'pressure', 'overwhelmed', 'tense', 'anxious', 'worried', 'frantic', 'hectic', 'deadline', 'rush'],
  happy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'delighted', 'thrilled', 'elated', 'cheerful'],
  anxious: ['anxious', 'nervous', 'worried', 'uneasy', 'restless', 'uncertain', 'apprehensive', 'afraid', 'fear', 'panic'],
  motivated: ['motivated', 'inspired', 'driven', 'determined', 'focused', 'energized', 'ambitious', 'productive', 'goal', 'achieve'],
  overwhelmed: ['overwhelmed', 'exhausted', 'tired', 'drained', 'burned', 'too much', 'can\'t', 'difficult', 'hard', 'struggling'],
  grateful: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'lucky', 'gratitude', 'thanks', 'appreciate'],
  sad: ['sad', 'unhappy', 'down', 'depressed', 'lonely', 'empty', 'hurt', 'disappointed', 'upset', 'crying', 'tears'],
  excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'pumped', 'can\'t wait', 'looking forward', 'anticipating'],
  peaceful: ['peace', 'content', 'satisfied', 'harmony', 'gentle', 'soft', 'rest', 'meditate', 'mindful', 'present'],
};

// Map sentiment to mood categories
export function getSentimentMood(label: SentimentLabel, score: number): 'great' | 'good' | 'okay' | 'low' | 'rough' {
  if (label === 'positive') {
    return score >= 50 ? 'great' : 'good';
  } else if (label === 'neutral') {
    return 'okay';
  } else {
    return score <= -50 ? 'rough' : 'low';
  }
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      comparative: 0,
      label: 'neutral',
      confidence: 'low',
      emotions: [],
      positiveWords: [],
      negativeWords: [],
    };
  }

  const result = sentiment.analyze(text);
  
  // Normalize score to -100 to +100 range
  // The raw score can vary widely, so we use comparative (per word) and scale it
  const normalizedScore = Math.max(-100, Math.min(100, result.comparative * 50));
  
  // Determine sentiment label
  let label: SentimentLabel;
  if (normalizedScore > 10) {
    label = 'positive';
  } else if (normalizedScore < -10) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  // Calculate confidence based on number of sentiment-bearing words
  const totalWords = text.split(/\s+/).length;
  const sentimentWords = result.positive.length + result.negative.length;
  const sentimentRatio = sentimentWords / Math.max(totalWords, 1);
  
  let confidence: 'low' | 'medium' | 'high';
  if (sentimentRatio < 0.05 || totalWords < 10) {
    confidence = 'low';
  } else if (sentimentRatio < 0.15) {
    confidence = 'medium';
  } else {
    confidence = 'high';
  }
  
  // Detect emotions based on keywords
  const lowerText = text.toLowerCase();
  const detectedEmotions: EmotionTag[] = [];
  
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedEmotions.push(emotion as EmotionTag);
    }
  }
  
  // Limit to top 3 most relevant emotions
  const emotions = detectedEmotions.slice(0, 3);
  
  return {
    score: Math.round(normalizedScore),
    comparative: result.comparative,
    label,
    confidence,
    emotions,
    positiveWords: result.positive,
    negativeWords: result.negative,
  };
}

// Get emotion display config
export const EMOTION_CONFIG: Record<EmotionTag, { label: string; emoji: string; color: string }> = {
  calm: { label: 'Calm', emoji: '😌', color: 'text-teal-500' },
  stressed: { label: 'Stressed', emoji: '😰', color: 'text-orange-500' },
  happy: { label: 'Happy', emoji: '😊', color: 'text-yellow-500' },
  anxious: { label: 'Anxious', emoji: '😟', color: 'text-purple-500' },
  motivated: { label: 'Motivated', emoji: '💪', color: 'text-primary' },
  overwhelmed: { label: 'Overwhelmed', emoji: '😵', color: 'text-red-500' },
  grateful: { label: 'Grateful', emoji: '🙏', color: 'text-pink-500' },
  sad: { label: 'Sad', emoji: '😢', color: 'text-blue-400' },
  excited: { label: 'Excited', emoji: '🎉', color: 'text-amber-500' },
  peaceful: { label: 'Peaceful', emoji: '🧘', color: 'text-cyan-500' },
};

// Get sentiment emoji
export function getSentimentEmoji(label: SentimentLabel): string {
  switch (label) {
    case 'positive': return '😊';
    case 'neutral': return '😐';
    case 'negative': return '😔';
  }
}

// Get sentiment color class
export function getSentimentColor(label: SentimentLabel): string {
  switch (label) {
    case 'positive': return 'text-success';
    case 'neutral': return 'text-muted-foreground';
    case 'negative': return 'text-warning';
  }
}

// Calculate emotional stability score (0-100)
export function calculateEmotionalStability(scores: number[]): number {
  if (scores.length < 2) return 100;
  
  // Calculate variance
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Convert to stability score (lower variance = higher stability)
  // Max expected stdDev is around 50, so we scale accordingly
  const stability = Math.max(0, 100 - stdDev * 2);
  return Math.round(stability);
}
