import { useState, useEffect, useCallback } from 'react';

export interface MonthlyIntention {
  id: string;
  month: string; // YYYY-MM format
  intention: string;
  personalNote?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'glowhabit-intentions';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

function getStoredIntentions(): MonthlyIntention[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useIntentions() {
  const [intentions, setIntentions] = useState<MonthlyIntention[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIntentions(getStoredIntentions());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(intentions));
    }
  }, [intentions, isLoaded]);

  const getCurrentIntention = useCallback((): MonthlyIntention | undefined => {
    const currentMonth = getCurrentMonth();
    return intentions.find(i => i.month === currentMonth);
  }, [intentions]);

  const setMonthlyIntention = useCallback((intention: string, personalNote?: string) => {
    const currentMonth = getCurrentMonth();
    const now = new Date().toISOString();
    
    setIntentions(prev => {
      const existing = prev.find(i => i.month === currentMonth);
      
      if (existing) {
        return prev.map(i => 
          i.month === currentMonth 
            ? { ...i, intention, personalNote, updatedAt: now }
            : i
        );
      }
      
      return [...prev, {
        id: generateId(),
        month: currentMonth,
        intention,
        personalNote,
        createdAt: now,
        updatedAt: now,
      }];
    });
  }, []);

  const getIntentionForMonth = useCallback((month: string): MonthlyIntention | undefined => {
    return intentions.find(i => i.month === month);
  }, [intentions]);

  const getPastIntentions = useCallback((limit: number = 6): MonthlyIntention[] => {
    const currentMonth = getCurrentMonth();
    return intentions
      .filter(i => i.month < currentMonth)
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, limit);
  }, [intentions]);

  return {
    intentions,
    isLoaded,
    getCurrentIntention,
    setMonthlyIntention,
    getIntentionForMonth,
    getPastIntentions,
  };
}
