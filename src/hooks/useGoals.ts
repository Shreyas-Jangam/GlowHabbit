import { useState, useEffect, useCallback } from 'react';
import { Goal } from '@/types/habit';

const STORAGE_KEY = 'glowhabit-goals';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getStoredGoals(): Goal[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setGoals(getStoredGoals());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'progress' | 'isCompleted' | 'createdAt'>) => {
    setGoals(prev => [...prev, {
      ...goal,
      id: generateId(),
      progress: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const newProgress = Math.min(100, Math.max(0, progress));
      return {
        ...goal,
        progress: newProgress,
        isCompleted: newProgress >= 100,
      };
    }));
  }, []);

  const removeGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const toggleGoalComplete = useCallback((goalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      return {
        ...goal,
        isCompleted: !goal.isCompleted,
        progress: !goal.isCompleted ? 100 : goal.progress,
      };
    }));
  }, []);

  return {
    goals,
    isLoaded,
    addGoal,
    updateGoalProgress,
    removeGoal,
    toggleGoalComplete,
  };
}
