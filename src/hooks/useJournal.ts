import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, JournalStats, MoodAnalytics, SentimentData } from '@/types/journal';
import { analyzeSentiment, getSentimentMood, calculateEmotionalStability, EmotionTag } from '@/utils/sentimentAnalysis';
import { format, subDays, parseISO, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const STORAGE_KEY = 'glowhabit-journal';
const SETTINGS_KEY = 'glowhabit-journal-settings';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getStoredEntries(): JournalEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export interface JournalSettings {
  sentimentAnalysisEnabled: boolean;
}

function getStoredSettings(): JournalSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { sentimentAnalysisEnabled: true };
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<JournalSettings>({ sentimentAnalysisEnabled: true });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEntries(getStoredEntries());
    setSettings(getStoredSettings());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((newSettings: Partial<JournalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const getEntryByDate = useCallback((date: string): JournalEntry | undefined => {
    return entries.find(e => e.date === date);
  }, [entries]);

  const getTodayEntry = useCallback((): JournalEntry | undefined => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return getEntryByDate(today);
  }, [getEntryByDate]);

  const analyzeAndGetSentiment = useCallback((content: string): SentimentData | undefined => {
    if (!settings.sentimentAnalysisEnabled || !content || content.trim().length < 10) {
      return undefined;
    }
    
    const result = analyzeSentiment(content);
    return {
      score: result.score,
      label: result.label,
      confidence: result.confidence,
      emotions: result.emotions,
      analyzedAt: new Date().toISOString(),
    };
  }, [settings.sentimentAnalysisEnabled]);

  const saveEntry = useCallback((
    date: string, 
    content: string, 
    mood?: JournalEntry['mood'], 
    habitsSummary?: JournalEntry['habitsSummary'],
    manualMood?: boolean
  ) => {
    const now = new Date().toISOString();
    
    // Run sentiment analysis
    const sentiment = analyzeAndGetSentiment(content);
    
    // If no manual mood provided and we have sentiment, auto-detect mood
    let finalMood = mood;
    let isManualMood = manualMood ?? false;
    
    if (!manualMood && sentiment && !mood) {
      finalMood = getSentimentMood(sentiment.label, sentiment.score);
    } else if (mood) {
      isManualMood = true;
    }
    
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === date);
      
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          content,
          mood: finalMood ?? existing.mood,
          manualMood: isManualMood || existing.manualMood,
          sentiment: sentiment ?? existing.sentiment,
          habitsSummary: habitsSummary ?? existing.habitsSummary,
          updatedAt: now,
        };
        return updated;
      } else {
        // Create new
        return [...prev, {
          id: generateId(),
          date,
          content,
          mood: finalMood,
          manualMood: isManualMood,
          sentiment,
          habitsSummary,
          createdAt: now,
          updatedAt: now,
        }];
      }
    });
  }, [analyzeAndGetSentiment]);

  const deleteEntry = useCallback((date: string) => {
    setEntries(prev => prev.filter(e => e.date !== date));
  }, []);

  const updateMood = useCallback((date: string, mood: JournalEntry['mood']) => {
    setEntries(prev => prev.map(entry => {
      if (entry.date !== date) return entry;
      return { ...entry, mood, manualMood: true, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const getStats = useCallback((): JournalStats => {
    const sortedDates = entries.map(e => e.date).sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Calculate current streak
    let currentStreak = 0;
    let checkDate = today;
    
    if (sortedDates.includes(today)) {
      currentStreak = 1;
      checkDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    }
    
    while (sortedDates.includes(checkDate)) {
      currentStreak++;
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
    }

    // If today is not complete but yesterday is, still count streak
    if (currentStreak === 0 && sortedDates.includes(format(subDays(new Date(), 1), 'yyyy-MM-dd'))) {
      checkDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      while (sortedDates.includes(checkDate)) {
        currentStreak++;
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    const allDates = [...sortedDates].sort();
    
    for (let i = 1; i < allDates.length; i++) {
      const diff = differenceInDays(parseISO(allDates[i]), parseISO(allDates[i - 1]));
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // This month entries
    const thisMonth = format(new Date(), 'yyyy-MM');
    const thisMonthEntries = entries.filter(e => e.date.startsWith(thisMonth)).length;

    // Average words per entry
    const totalWords = entries.reduce((acc, e) => acc + e.content.split(/\s+/).filter(w => w.length > 0).length, 0);
    const avgWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

    return {
      currentStreak,
      longestStreak,
      totalEntries: entries.length,
      thisMonthEntries,
      avgWordsPerEntry,
    };
  }, [entries]);

  const getMonthEntries = useCallback((month: Date): { date: string; hasEntry: boolean; wordCount: number; mood?: JournalEntry['mood']; sentiment?: SentimentData }[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      return {
        date: dateStr,
        hasEntry: !!entry,
        wordCount: entry ? entry.content.split(/\s+/).filter(w => w.length > 0).length : 0,
        mood: entry?.mood,
        sentiment: entry?.sentiment,
      };
    });
  }, [entries]);

  const getMoodTrend = useCallback((days: number = 30) => {
    const trend: { date: string; mood: JournalEntry['mood']; sentiment?: SentimentData }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === date);
      if (entry?.mood || entry?.sentiment) {
        trend.push({ date, mood: entry.mood, sentiment: entry.sentiment });
      }
    }
    
    return trend;
  }, [entries]);

  const getMoodAnalytics = useCallback((days: number = 30): MoodAnalytics => {
    const recentEntries = entries.filter(e => {
      const entryDate = parseISO(e.date);
      const cutoff = subDays(new Date(), days);
      return entryDate >= cutoff && e.sentiment;
    });

    const scores = recentEntries.map(e => e.sentiment!.score);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    const positiveCount = recentEntries.filter(e => e.sentiment!.label === 'positive').length;
    const positiveRatio = recentEntries.length > 0 
      ? Math.round((positiveCount / recentEntries.length) * 100) 
      : 0;

    const emotionalStability = calculateEmotionalStability(scores);

    // Count emotion frequencies
    const emotionCounts: Record<string, number> = {};
    recentEntries.forEach(e => {
      e.sentiment!.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const dominantEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion: emotion as EmotionTag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const moodByDay = recentEntries.map(e => ({
      date: e.date,
      score: e.sentiment!.score,
      label: e.sentiment!.label,
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
      averageScore,
      positiveRatio,
      emotionalStability,
      dominantEmotions,
      moodByDay,
    };
  }, [entries]);

  const getHabitMoodCorrelation = useCallback(() => {
    const entriesWithBoth = entries.filter(e => e.habitsSummary && e.sentiment);
    
    if (entriesWithBoth.length < 3) {
      return null;
    }

    // Calculate correlation between habit completion and mood
    const highCompletionDays = entriesWithBoth.filter(e => {
      const completionRate = e.habitsSummary!.completed / Math.max(e.habitsSummary!.total, 1);
      return completionRate >= 0.7;
    });

    const lowCompletionDays = entriesWithBoth.filter(e => {
      const completionRate = e.habitsSummary!.completed / Math.max(e.habitsSummary!.total, 1);
      return completionRate < 0.3;
    });

    const avgMoodHighCompletion = highCompletionDays.length > 0
      ? highCompletionDays.reduce((sum, e) => sum + e.sentiment!.score, 0) / highCompletionDays.length
      : 0;

    const avgMoodLowCompletion = lowCompletionDays.length > 0
      ? lowCompletionDays.reduce((sum, e) => sum + e.sentiment!.score, 0) / lowCompletionDays.length
      : 0;

    // Generate insights
    const insights: string[] = [];
    
    if (highCompletionDays.length >= 2 && avgMoodHighCompletion > avgMoodLowCompletion + 15) {
      insights.push("Your mood improves on days you complete more habits");
    }
    
    if (lowCompletionDays.length >= 2 && avgMoodLowCompletion < -10) {
      insights.push("Lower mood detected on low-habit completion days");
    }

    // Check for specific habit correlations
    const habitMoodMap: Record<string, number[]> = {};
    entriesWithBoth.forEach(e => {
      e.habitsSummary!.habits.forEach(habit => {
        if (!habitMoodMap[habit]) habitMoodMap[habit] = [];
        habitMoodMap[habit].push(e.sentiment!.score);
      });
    });

    Object.entries(habitMoodMap).forEach(([habit, scores]) => {
      if (scores.length >= 3) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avgScore > 30) {
          insights.push(`Completing "${habit}" correlates with better mood`);
        }
      }
    });

    return {
      highCompletionAvgMood: Math.round(avgMoodHighCompletion),
      lowCompletionAvgMood: Math.round(avgMoodLowCompletion),
      insights: insights.slice(0, 3),
      dataPoints: entriesWithBoth.length,
    };
  }, [entries]);

  return {
    entries,
    settings,
    isLoaded,
    updateSettings,
    getEntryByDate,
    getTodayEntry,
    saveEntry,
    deleteEntry,
    updateMood,
    getStats,
    getMonthEntries,
    getMoodTrend,
    getMoodAnalytics,
    getHabitMoodCorrelation,
  };
}
