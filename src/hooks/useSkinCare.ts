import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, differenceInDays, startOfDay, isToday, getDay } from 'date-fns';
import {
  SkinCareRoutine,
  SkinCareStep,
  SkinCareCompletion,
  SkinCareStats,
  SkinType,
  MORNING_SKINCARE_TEMPLATE,
  NIGHT_SKINCARE_TEMPLATE,
} from '@/types/skincare';

const STORAGE_KEY = 'glowhabit-skincare';
const COMPLETIONS_KEY = 'glowhabit-skincare-completions';
const SETTINGS_KEY = 'glowhabit-skincare-settings';

const generateId = () => Math.random().toString(36).substring(2, 11);

export function useSkinCare() {
  const [routines, setRoutines] = useState<SkinCareRoutine[]>([]);
  const [completions, setCompletions] = useState<SkinCareCompletion[]>([]);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedRoutines = localStorage.getItem(STORAGE_KEY);
    const storedCompletions = localStorage.getItem(COMPLETIONS_KEY);
    const storedSettings = localStorage.getItem(SETTINGS_KEY);

    if (storedRoutines) {
      setRoutines(JSON.parse(storedRoutines));
    }
    if (storedCompletions) {
      setCompletions(JSON.parse(storedCompletions));
    }
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setSkinType(settings.skinType || null);
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

  useEffect(() => {
    if (isLoaded && skinType) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ skinType }));
    }
  }, [skinType, isLoaded]);

  const createRoutineFromTemplate = useCallback((type: 'morning' | 'night'): SkinCareRoutine => {
    const template = type === 'morning' ? MORNING_SKINCARE_TEMPLATE : NIGHT_SKINCARE_TEMPLATE;
    const steps: SkinCareStep[] = template.map((t) => ({
      ...t,
      id: generateId(),
      isCompleted: false,
    }));

    return {
      id: generateId(),
      type,
      steps,
      skinType: skinType || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }, [skinType]);

  const addRoutine = useCallback((routine: SkinCareRoutine) => {
    setRoutines((prev) => [...prev, routine]);
  }, []);

  const updateRoutine = useCallback((routineId: string, updates: Partial<SkinCareRoutine>) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, ...updates } : r))
    );
  }, []);

  const removeRoutine = useCallback((routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }, []);

  const toggleStep = useCallback((routineId: string, stepId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: r.steps.map((s) =>
              s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
            ),
          };
        }
        return r;
      })
    );
  }, []);

  const updateStep = useCallback((routineId: string, stepId: string, updates: Partial<SkinCareStep>) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: r.steps.map((s) =>
              s.id === stepId ? { ...s, ...updates } : s
            ),
          };
        }
        return r;
      })
    );
  }, []);

  const addStep = useCallback((routineId: string, step: Omit<SkinCareStep, 'id' | 'isCompleted'>) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: [...r.steps, { ...step, id: generateId(), isCompleted: false }],
          };
        }
        return r;
      })
    );
  }, []);

  const removeStep = useCallback((routineId: string, stepId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: r.steps.filter((s) => s.id !== stepId),
          };
        }
        return r;
      })
    );
  }, []);

  const completeRoutine = useCallback((routineId: string) => {
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const completion: SkinCareCompletion = {
      date: today,
      routineId,
      type: routine.type,
      completedAt: new Date().toISOString(),
      completedSteps: routine.steps.filter((s) => s.isCompleted).map((s) => s.id),
      skippedSteps: routine.steps.filter((s) => !s.isCompleted && s.isOptional).map((s) => s.id),
    };

    setCompletions((prev) => {
      const filtered = prev.filter(
        (c) => !(c.routineId === routineId && c.date === today)
      );
      return [...filtered, completion];
    });

    // Mark all steps as completed
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: r.steps.map((s) => ({ ...s, isCompleted: true })),
          };
        }
        return r;
      })
    );
  }, [routines]);

  const resetRoutine = useCallback((routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            steps: r.steps.map((s) => ({ ...s, isCompleted: false })),
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

  const isAlternateDayToday = useCallback((): boolean => {
    // Simple logic: alternate days based on day of week (Mon, Wed, Fri, Sun)
    const dayOfWeek = getDay(new Date());
    return [0, 1, 3, 5].includes(dayOfWeek);
  }, []);

  const getMorningRoutine = useCallback((): SkinCareRoutine | undefined => {
    return routines.find((r) => r.type === 'morning' && r.isActive);
  }, [routines]);

  const getNightRoutine = useCallback((): SkinCareRoutine | undefined => {
    return routines.find((r) => r.type === 'night' && r.isActive);
  }, [routines]);

  const getStats = useCallback((): SkinCareStats => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const morningRoutine = getMorningRoutine();
    const nightRoutine = getNightRoutine();

    const morningCompletions = completions.filter(
      (c) => c.type === 'morning' && parseISO(c.date) >= thirtyDaysAgo
    );
    const nightCompletions = completions.filter(
      (c) => c.type === 'night' && parseISO(c.date) >= thirtyDaysAgo
    );

    // Calculate streaks
    const allDates = [...new Set(completions.map((c) => c.date))].sort(
      (a, b) => parseISO(b).getTime() - parseISO(a).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    if (allDates.length > 0) {
      const today = startOfDay(new Date());
      const mostRecent = parseISO(allDates[0]);

      if (differenceInDays(today, mostRecent) <= 1) {
        currentStreak = 1;
        for (let i = 1; i < allDates.length; i++) {
          const curr = parseISO(allDates[i]);
          const prev = parseISO(allDates[i - 1]);
          if (differenceInDays(prev, curr) === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      for (let i = 1; i < allDates.length; i++) {
        const curr = parseISO(allDates[i]);
        const prev = parseISO(allDates[i - 1]);
        if (differenceInDays(prev, curr) === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    }

    // Product usage tracking
    const productCounts: Record<string, number> = {};
    completions.forEach((c) => {
      const routine = routines.find((r) => r.id === c.routineId);
      if (routine) {
        routine.steps.forEach((step) => {
          if (step.productName && c.completedSteps.includes(step.id)) {
            productCounts[step.productName] = (productCounts[step.productName] || 0) + 1;
          }
        });
      }
    });

    const mostUsedProducts = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      morningConsistency: Math.round((morningCompletions.length / 30) * 100),
      nightConsistency: Math.round((nightCompletions.length / 30) * 100),
      currentStreak,
      longestStreak,
      totalCompletions: completions.length,
      mostUsedProducts,
    };
  }, [completions, routines, getMorningRoutine, getNightRoutine]);

  return {
    routines,
    completions,
    skinType,
    isLoaded,
    setSkinType,
    createRoutineFromTemplate,
    addRoutine,
    updateRoutine,
    removeRoutine,
    toggleStep,
    updateStep,
    addStep,
    removeStep,
    completeRoutine,
    resetRoutine,
    isRoutineCompletedToday,
    isAlternateDayToday,
    getMorningRoutine,
    getNightRoutine,
    getStats,
  };
}
