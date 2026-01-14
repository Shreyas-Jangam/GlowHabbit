import { useState, useEffect, useCallback, useMemo } from 'react';
import { BudgetEntry, BudgetStats } from '@/types/discipline';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const STORAGE_KEY = 'glowhabit-budget';

export function useBudget() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEntries(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntry = useCallback((entry: Omit<BudgetEntry, 'id'>) => {
    const newEntry: BudgetEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, newEntry];
    });
  }, []);

  const getEntryForDate = useCallback((date: string): BudgetEntry | undefined => {
    return entries.find(e => e.date === date);
  }, [entries]);

  const toggleBudgetStatus = useCallback((date: string, field: 'stayedWithinBudget' | 'trackedExpenses') => {
    const existing = entries.find(e => e.date === date);
    if (existing) {
      setEntries(prev => prev.map(e => 
        e.date === date ? { ...e, [field]: !e[field] } : e
      ));
    } else {
      addEntry({
        date,
        stayedWithinBudget: field === 'stayedWithinBudget',
        trackedExpenses: field === 'trackedExpenses',
      });
    }
  }, [entries, addEntry]);

  const stats = useMemo((): BudgetStats => {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let consistencyStreak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    for (const entry of sortedEntries) {
      if (entry.stayedWithinBudget && entry.trackedExpenses) {
        consistencyStreak++;
      } else {
        break;
      }
    }

    const daysUnderBudget = entries.filter(e => e.stayedWithinBudget).length;
    const daysOverBudget = entries.filter(e => !e.stayedWithinBudget && e.trackedExpenses).length;
    
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const monthEntries = entries.filter(e => {
      const entryDate = parseISO(e.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    
    const goodDays = monthEntries.filter(e => e.stayedWithinBudget && e.trackedExpenses).length;
    const monthlyScore = Math.round((goodDays / Math.min(daysInMonth.length, new Date().getDate())) * 100);

    return {
      consistencyStreak,
      daysUnderBudget,
      daysOverBudget,
      monthlyScore,
      totalTrackedDays: entries.length,
    };
  }, [entries]);

  return {
    entries,
    isLoaded,
    addEntry,
    getEntryForDate,
    toggleBudgetStatus,
    stats,
  };
}
