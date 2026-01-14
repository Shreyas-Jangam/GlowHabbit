import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, differenceInDays, startOfDay } from 'date-fns';
import {
  Routine,
  RoutineHabit,
  RoutineType,
  RoutineCompletion,
  RoutineStats,
  MORNING_ROUTINE_TEMPLATES,
  NIGHT_ROUTINE_TEMPLATES,
} from '@/types/routine';

const STORAGE_KEY = 'glowhabit-routines';
const COMPLETIONS_KEY = 'glowhabit-routine-completions';

const generateId = () => Math.random().toString(36).substring(2, 11);

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completions, setCompletions] = useState<RoutineCompletion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedRoutines = localStorage.getItem(STORAGE_KEY);
    const storedCompletions = localStorage.getItem(COMPLETIONS_KEY);
    
    if (storedRoutines) {
      setRoutines(JSON.parse(storedRoutines));
    }
    if (storedCompletions) {
      setCompletions(JSON.parse(storedCompletions));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    }
  }, [routines, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
    }
  }, [completions, isLoaded]);

  const createRoutineFromTemplate = useCallback((type: RoutineType): Routine => {
    const templates = type === 'morning' ? MORNING_ROUTINE_TEMPLATES : NIGHT_ROUTINE_TEMPLATES;
    const habits: RoutineHabit[] = templates.map((t) => ({
      ...t,
      id: generateId(),
      isCompleted: false,
    }));

    return {
      id: generateId(),
      name: type === 'morning' ? 'Morning Routine' : 'Night Routine',
      type,
      habits,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }, []);

  const addRoutine = useCallback((routine: Routine) => {
    setRoutines((prev) => [...prev, routine]);
  }, []);

  const updateRoutine = useCallback((routineId: string, updates: Partial<Routine>) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, ...updates } : r))
    );
  }, []);

  const removeRoutine = useCallback((routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }, []);

  const addHabitToRoutine = useCallback((routineId: string, habit: Omit<RoutineHabit, 'id' | 'isCompleted'>) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            habits: [...r.habits, { ...habit, id: generateId(), isCompleted: false }],
          };
        }
        return r;
      })
    );
  }, []);

  const removeHabitFromRoutine = useCallback((routineId: string, habitId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            habits: r.habits.filter((h) => h.id !== habitId),
          };
        }
        return r;
      })
    );
  }, []);

  const toggleRoutineHabit = useCallback((routineId: string, habitId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            habits: r.habits.map((h) =>
              h.id === habitId ? { ...h, isCompleted: !h.isCompleted } : h
            ),
          };
        }
        return r;
      })
    );
  }, []);

  const completeRoutine = useCallback((routineId: string, duration?: number) => {
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const completion: RoutineCompletion = {
      date: today,
      routineId,
      completedAt: new Date().toISOString(),
      duration,
      completedHabits: routine.habits.map((h) => h.id),
    };

    setCompletions((prev) => {
      // Remove existing completion for same routine on same day
      const filtered = prev.filter(
        (c) => !(c.routineId === routineId && c.date === today)
      );
      return [...filtered, completion];
    });

    // Mark all habits as completed
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            habits: r.habits.map((h) => ({ ...h, isCompleted: true })),
          };
        }
        return r;
      })
    );
  }, [routines]);

  const resetRoutineHabits = useCallback((routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            habits: r.habits.map((h) => ({ ...h, isCompleted: false })),
          };
        }
        return r;
      })
    );
  }, []);

  const isRoutineCompletedToday = useCallback((routineId: string): boolean => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return completions.some((c) => c.routineId === routineId && c.date === today);
  }, [completions]);

  const getRoutineStats = useCallback((routineId: string): RoutineStats => {
    const routineCompletions = completions.filter((c) => c.routineId === routineId);
    
    if (routineCompletions.length === 0) {
      return {
        consistencyRate: 0,
        averageCompletionTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
      };
    }

    // Calculate streaks
    const sortedDates = routineCompletions
      .map((c) => c.date)
      .sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = startOfDay(new Date());
    const mostRecent = parseISO(sortedDates[0]);
    
    if (differenceInDays(today, mostRecent) <= 1) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const curr = parseISO(sortedDates[i]);
        const prev = parseISO(sortedDates[i - 1]);
        if (differenceInDays(prev, curr) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const curr = parseISO(sortedDates[i]);
      const prev = parseISO(sortedDates[i - 1]);
      if (differenceInDays(prev, curr) === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Calculate consistency (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = routineCompletions.filter(
      (c) => parseISO(c.date) >= thirtyDaysAgo
    );
    const consistencyRate = (recentCompletions.length / 30) * 100;

    // Average completion time
    const completionsWithDuration = routineCompletions.filter((c) => c.duration);
    const averageCompletionTime = completionsWithDuration.length
      ? completionsWithDuration.reduce((sum, c) => sum + (c.duration || 0), 0) /
        completionsWithDuration.length
      : 0;

    return {
      consistencyRate: Math.round(consistencyRate),
      averageCompletionTime: Math.round(averageCompletionTime),
      currentStreak,
      longestStreak,
      totalCompletions: routineCompletions.length,
    };
  }, [completions]);

  const getMorningRoutine = useCallback((): Routine | undefined => {
    return routines.find((r) => r.type === 'morning' && r.isActive);
  }, [routines]);

  const getNightRoutine = useCallback((): Routine | undefined => {
    return routines.find((r) => r.type === 'night' && r.isActive);
  }, [routines]);

  return {
    routines,
    completions,
    isLoaded,
    createRoutineFromTemplate,
    addRoutine,
    updateRoutine,
    removeRoutine,
    addHabitToRoutine,
    removeHabitFromRoutine,
    toggleRoutineHabit,
    completeRoutine,
    resetRoutineHabits,
    isRoutineCompletedToday,
    getRoutineStats,
    getMorningRoutine,
    getNightRoutine,
  };
}
