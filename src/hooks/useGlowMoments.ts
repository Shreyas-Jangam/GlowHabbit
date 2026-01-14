import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHabits } from './useHabits';
import { useJournal } from './useJournal';
import { useRoutines } from './useRoutines';

export interface GlowMoment {
  id: string;
  type: 'milestone' | 'streak' | 'consistency' | 'reflection' | 'balance';
  title: string;
  description: string;
  affirmation: string;
  unlockedAt?: string;
  tier: 'spark' | 'glow' | 'radiance' | 'brilliance';
}

export interface UnlockableReward {
  id: string;
  name: string;
  description: string;
  type: 'quote' | 'theme' | 'animation';
  content: string;
  requiredMoments: number;
  isUnlocked: boolean;
}

const AFFIRMATIONS = [
  "You're making progress, one step at a time.",
  "Small steps lead to big changes.",
  "Your consistency is inspiring.",
  "You showed up today. That matters.",
  "Every effort counts, no matter how small.",
  "You're building something meaningful.",
  "Trust the process. Growth takes time.",
  "You're stronger than you think.",
  "This journey is yours, and you're doing great.",
  "Be proud of how far you've come.",
];

const CALM_QUOTES = [
  { id: 'q1', quote: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { id: 'q2', quote: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { id: 'q3', quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { id: 'q4', quote: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { id: 'q5', quote: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { id: 'q6', quote: "The soul always knows what to do to heal itself. The challenge is to silence the mind.", author: "Caroline Myss" },
  { id: 'q7', quote: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
  { id: 'q8', quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
];

const GLOW_MOMENT_DEFINITIONS = [
  { id: 'first_spark', type: 'milestone', title: 'First Spark', description: 'You completed your first habit', tier: 'spark', requirement: { type: 'completions', value: 1 } },
  { id: 'week_glow', type: 'streak', title: 'Week of Glow', description: '7-day streak achieved', tier: 'glow', requirement: { type: 'streak', value: 7 } },
  { id: 'month_radiance', type: 'streak', title: 'Month of Radiance', description: '30-day streak achieved', tier: 'radiance', requirement: { type: 'streak', value: 30 } },
  { id: 'reflection_start', type: 'reflection', title: 'Inner Light', description: 'You started journaling', tier: 'spark', requirement: { type: 'journal', value: 1 } },
  { id: 'reflection_week', type: 'reflection', title: 'Mindful Week', description: 'Journaled for 7 days', tier: 'glow', requirement: { type: 'journal_streak', value: 7 } },
  { id: 'consistency_50', type: 'consistency', title: 'Steady Glow', description: '50 habits completed', tier: 'glow', requirement: { type: 'completions', value: 50 } },
  { id: 'consistency_100', type: 'consistency', title: 'Radiant Path', description: '100 habits completed', tier: 'radiance', requirement: { type: 'completions', value: 100 } },
  { id: 'balance_all', type: 'balance', title: 'Life in Balance', description: 'Habits in all 4 life areas', tier: 'brilliance', requirement: { type: 'balance', value: 4 } },
] as const;

const STORAGE_KEY = 'glowhabit-glow-moments';

function getStoredMoments(): { unlockedIds: string[] } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { unlockedIds: [] };
  } catch {
    return { unlockedIds: [] };
  }
}

export function useGlowMoments() {
  const { habits, getHabitStats } = useHabits();
  const { entries: journalEntries, getStats: getJournalStats } = useJournal();
  const { routines } = useRoutines();
  
  const [storedData, setStoredData] = useState(() => getStoredMoments());
  const [newlyUnlocked, setNewlyUnlocked] = useState<GlowMoment | null>(null);

  // Calculate current stats
  const stats = useMemo(() => {
    const allHabitStats = habits.map(h => getHabitStats(h));
    const totalCompletions = allHabitStats.reduce((sum, s) => sum + s.totalCompletions, 0);
    const longestStreak = Math.max(...allHabitStats.map(s => s.longestStreak), 0);
    const journalStats = getJournalStats();
    const lifeAreas = new Set(habits.map(h => h.lifeArea).filter(Boolean));

    return {
      totalCompletions,
      longestStreak,
      journalEntries: journalEntries.length,
      journalStreak: journalStats.currentStreak,
      lifeAreasCount: lifeAreas.size,
    };
  }, [habits, getHabitStats, journalEntries, getJournalStats]);

  // Calculate glow moments
  const glowMoments = useMemo((): GlowMoment[] => {
    return GLOW_MOMENT_DEFINITIONS.map(def => {
      let isUnlocked = false;
      
      switch (def.requirement.type) {
        case 'completions':
          isUnlocked = stats.totalCompletions >= def.requirement.value;
          break;
        case 'streak':
          isUnlocked = stats.longestStreak >= def.requirement.value;
          break;
        case 'journal':
          isUnlocked = stats.journalEntries >= def.requirement.value;
          break;
        case 'journal_streak':
          isUnlocked = stats.journalStreak >= def.requirement.value;
          break;
        case 'balance':
          isUnlocked = stats.lifeAreasCount >= def.requirement.value;
          break;
      }

      const affirmation = AFFIRMATIONS[Math.abs(def.id.charCodeAt(0)) % AFFIRMATIONS.length];

      return {
        id: def.id,
        type: def.type as GlowMoment['type'],
        title: def.title,
        description: def.description,
        affirmation,
        tier: def.tier as GlowMoment['tier'],
        unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      };
    });
  }, [stats]);

  const unlockedMoments = useMemo(() => 
    glowMoments.filter(m => m.unlockedAt),
    [glowMoments]
  );

  // Check for newly unlocked moments
  useEffect(() => {
    const currentUnlockedIds = unlockedMoments.map(m => m.id);
    const newUnlocked = currentUnlockedIds.filter(id => !storedData.unlockedIds.includes(id));
    
    if (newUnlocked.length > 0) {
      const newMoment = glowMoments.find(m => m.id === newUnlocked[0]);
      if (newMoment) {
        setNewlyUnlocked(newMoment);
        setStoredData({ unlockedIds: currentUnlockedIds });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlockedIds: currentUnlockedIds }));
      }
    }
  }, [unlockedMoments, storedData.unlockedIds, glowMoments]);

  const dismissNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  // Calculate unlockable rewards
  const unlockableRewards = useMemo((): UnlockableReward[] => {
    const momentCount = unlockedMoments.length;
    
    return [
      {
        id: 'quote_1',
        name: 'Calm Quote',
        description: 'Unlock a peaceful quote',
        type: 'quote',
        content: JSON.stringify(CALM_QUOTES[0]),
        requiredMoments: 1,
        isUnlocked: momentCount >= 1,
      },
      {
        id: 'quote_2',
        name: 'Wisdom Quote',
        description: 'Unlock words of wisdom',
        type: 'quote',
        content: JSON.stringify(CALM_QUOTES[1]),
        requiredMoments: 2,
        isUnlocked: momentCount >= 2,
      },
      {
        id: 'quote_3',
        name: 'Mindful Quote',
        description: 'Unlock mindful reflection',
        type: 'quote',
        content: JSON.stringify(CALM_QUOTES[2]),
        requiredMoments: 3,
        isUnlocked: momentCount >= 3,
      },
    ];
  }, [unlockedMoments.length]);

  const getRandomAffirmation = useCallback(() => {
    return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  }, []);

  const getUnlockedQuotes = useCallback(() => {
    return unlockableRewards
      .filter(r => r.type === 'quote' && r.isUnlocked)
      .map(r => JSON.parse(r.content) as { id: string; quote: string; author: string });
  }, [unlockableRewards]);

  return {
    glowMoments,
    unlockedMoments,
    newlyUnlocked,
    dismissNewlyUnlocked,
    unlockableRewards,
    getRandomAffirmation,
    getUnlockedQuotes,
    totalMoments: unlockedMoments.length,
  };
}
