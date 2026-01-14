import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitStats, DailyProgress, DEFAULT_HABITS } from '@/types/habit';
import { format, subDays, parseISO, differenceInDays, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const STORAGE_KEY = 'glowhabit-habits';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getStoredHabits(): Habit[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default habits
  const now = new Date().toISOString();
  return DEFAULT_HABITS.slice(0, 8).map((habit, index) => ({
    ...habit,
    id: generateId(),
    completedDates: [],
    createdAt: now,
    order: index,
  }));
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHabits(getStoredHabits());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(date);
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date],
      };
    }));
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>) => {
    setHabits(prev => [...prev, {
      ...habit,
      id: generateId(),
      completedDates: [],
      createdAt: new Date().toISOString(),
      order: prev.length,
    }]);
  }, []);

  const removeHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, []);

  const updateHabit = useCallback((habitId: string, updates: Partial<Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>>) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      return {
        ...habit,
        ...updates,
        // Update lifeArea to match category if category is changed
        lifeArea: updates.category && updates.category !== 'custom' ? updates.category : habit.lifeArea,
      };
    }));
  }, []);

  const reorderHabits = useCallback((startIndex: number, endIndex: number) => {
    setHabits(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((h, i) => ({ ...h, order: i }));
    });
  }, []);

  const getHabitStats = useCallback((habit: Habit): HabitStats => {
    const sortedDates = [...habit.completedDates].sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Calculate current streak
    let currentStreak = 0;
    let checkDate = today;
    
    // Check if today is completed
    if (sortedDates.includes(today)) {
      currentStreak = 1;
      checkDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    }
    
    // Count consecutive days
    while (sortedDates.includes(checkDate)) {
      currentStreak++;
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
    }

    // If today is not completed but yesterday is, still count the streak
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
    const allDates = [...habit.completedDates].sort();
    
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

    // Calculate 30-day completion rate
    const last30Days = Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
    const completionsInPeriod = last30Days.filter(d => habit.completedDates.includes(d)).length;
    const completionRate = Math.round((completionsInPeriod / 30) * 100);

    return {
      currentStreak,
      longestStreak,
      completionRate,
      totalCompletions: habit.completedDates.length,
    };
  }, []);

  const getDailyProgress = useCallback((date: string): DailyProgress => {
    const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
    const totalCount = habits.length;
    return {
      date,
      completedCount,
      totalCount,
      percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    };
  }, [habits]);

  const getMonthlyProgress = useCallback((month: Date): DailyProgress[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => getDailyProgress(format(day, 'yyyy-MM-dd')));
  }, [getDailyProgress]);

  const getTodayProgress = useCallback(() => {
    return getDailyProgress(format(new Date(), 'yyyy-MM-dd'));
  }, [getDailyProgress]);

  const getBestHabit = useCallback(() => {
    if (habits.length === 0) return null;
    return habits.reduce((best, habit) => {
      const bestStats = getHabitStats(best);
      const currentStats = getHabitStats(habit);
      return currentStats.completionRate > bestStats.completionRate ? habit : best;
    });
  }, [habits, getHabitStats]);

  const getWeakestHabit = useCallback(() => {
    if (habits.length === 0) return null;
    return habits.reduce((weakest, habit) => {
      const weakestStats = getHabitStats(weakest);
      const currentStats = getHabitStats(habit);
      return currentStats.completionRate < weakestStats.completionRate ? habit : weakest;
    });
  }, [habits, getHabitStats]);

  return {
    habits,
    isLoaded,
    toggleHabit,
    addHabit,
    removeHabit,
    updateHabit,
    reorderHabits,
    getHabitStats,
    getDailyProgress,
    getMonthlyProgress,
    getTodayProgress,
    getBestHabit,
    getWeakestHabit,
  };
}
