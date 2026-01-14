import { useMemo } from 'react';
import { useHabits } from './useHabits';
import { useJournal } from './useJournal';
import { useGoals } from './useGoals';
import { useRoutines } from './useRoutines';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'habits' | 'journal' | 'goals' | 'routines' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress: number; // 0-100
  requirement: number;
  current: number;
}

const ACHIEVEMENT_DEFINITIONS = [
  // Habit achievements
  { id: 'first_habit', name: 'First Step', description: 'Complete your first habit', icon: 'Footprints', category: 'habits', tier: 'bronze', requirement: 1 },
  { id: 'habit_streak_7', name: 'Week Warrior', description: '7-day streak on any habit', icon: 'Flame', category: 'habits', tier: 'silver', requirement: 7 },
  { id: 'habit_streak_30', name: 'Monthly Master', description: '30-day streak on any habit', icon: 'Trophy', category: 'habits', tier: 'gold', requirement: 30 },
  { id: 'habit_completions_50', name: 'Consistency Champion', description: 'Complete 50 total habits', icon: 'Target', category: 'habits', tier: 'silver', requirement: 50 },
  { id: 'habit_completions_100', name: 'Centurion', description: 'Complete 100 total habits', icon: 'Medal', category: 'habits', tier: 'gold', requirement: 100 },
  
  // Journal achievements
  { id: 'first_journal', name: 'Dear Diary', description: 'Write your first journal entry', icon: 'BookOpen', category: 'journal', tier: 'bronze', requirement: 1 },
  { id: 'journal_streak_7', name: 'Reflective Week', description: 'Journal for 7 days straight', icon: 'Sparkles', category: 'journal', tier: 'silver', requirement: 7 },
  { id: 'journal_entries_30', name: 'Thoughtful Writer', description: 'Write 30 journal entries', icon: 'PenTool', category: 'journal', tier: 'gold', requirement: 30 },
  
  // Goal achievements
  { id: 'first_goal', name: 'Aim High', description: 'Create your first goal', icon: 'Mountain', category: 'goals', tier: 'bronze', requirement: 1 },
  { id: 'goal_completed', name: 'Goal Crusher', description: 'Complete a goal', icon: 'CheckCircle2', category: 'goals', tier: 'silver', requirement: 1 },
  { id: 'goals_completed_5', name: 'Dream Achiever', description: 'Complete 5 goals', icon: 'Crown', category: 'goals', tier: 'gold', requirement: 5 },
  
  // Routine achievements
  { id: 'morning_routine', name: 'Early Bird', description: 'Complete morning routine', icon: 'Sunrise', category: 'routines', tier: 'bronze', requirement: 1 },
  { id: 'night_routine', name: 'Night Owl', description: 'Complete night routine', icon: 'Moon', category: 'routines', tier: 'bronze', requirement: 1 },
  { id: 'routine_streak_7', name: 'Routine Master', description: '7-day routine streak', icon: 'Repeat', category: 'routines', tier: 'silver', requirement: 7 },
  
  // Special achievements
  { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all habits in one day', icon: 'Star', category: 'special', tier: 'gold', requirement: 1 },
  { id: 'balanced_life', name: 'Life Balance', description: 'Habits in all 4 life areas', icon: 'Heart', category: 'special', tier: 'platinum', requirement: 4 },
] as const;

export function useAchievements() {
  const { habits, getHabitStats } = useHabits();
  const { entries: journalEntries, getStats: getJournalStats } = useJournal();
  const { goals } = useGoals();
  const { routines, completions: routineCompletions } = useRoutines();

  const achievements = useMemo((): Achievement[] => {
    const journalStats = getJournalStats();
    
    // Calculate various stats
    const allHabitStats = habits.map(h => getHabitStats(h));
    const totalCompletions = allHabitStats.reduce((sum, s) => sum + s.totalCompletions, 0);
    const longestStreak = Math.max(...allHabitStats.map(s => s.longestStreak), 0);
    const completedGoals = goals.filter(g => g.isCompleted).length;
    const morningRoutineCompletions = routineCompletions.filter(c => 
      routines.find(r => r.id === c.routineId && r.type === 'morning')
    ).length;
    const nightRoutineCompletions = routineCompletions.filter(c => 
      routines.find(r => r.id === c.routineId && r.type === 'night')
    ).length;
    
    // Check for perfect day (all habits completed today)
    const today = new Date().toISOString().split('T')[0];
    const todayCompletedHabits = habits.filter(h => 
      h.completedDates.includes(today)
    ).length;
    const hasPerfectDay = habits.length > 0 && todayCompletedHabits === habits.length;
    
    // Check for life balance (habits in all 4 areas)
    const lifeAreas = new Set(habits.map(h => h.lifeArea).filter(Boolean));
    
    // Calculate routine streak
    const routineStreak = calculateRoutineStreak(routineCompletions);

    return ACHIEVEMENT_DEFINITIONS.map(def => {
      let current = 0;
      let unlockedAt: string | undefined;

      switch (def.id) {
        case 'first_habit':
          current = totalCompletions > 0 ? 1 : 0;
          break;
        case 'habit_streak_7':
        case 'habit_streak_30':
          current = longestStreak;
          break;
        case 'habit_completions_50':
        case 'habit_completions_100':
          current = totalCompletions;
          break;
        case 'first_journal':
          current = journalEntries.length > 0 ? 1 : 0;
          break;
        case 'journal_streak_7':
          current = journalStats.currentStreak;
          break;
        case 'journal_entries_30':
          current = journalEntries.length;
          break;
        case 'first_goal':
          current = goals.length > 0 ? 1 : 0;
          break;
        case 'goal_completed':
          current = completedGoals > 0 ? 1 : 0;
          break;
        case 'goals_completed_5':
          current = completedGoals;
          break;
        case 'morning_routine':
          current = morningRoutineCompletions > 0 ? 1 : 0;
          break;
        case 'night_routine':
          current = nightRoutineCompletions > 0 ? 1 : 0;
          break;
        case 'routine_streak_7':
          current = routineStreak;
          break;
        case 'perfect_day':
          current = hasPerfectDay ? 1 : 0;
          break;
        case 'balanced_life':
          current = lifeAreas.size;
          break;
      }

      const progress = Math.min(100, Math.round((current / def.requirement) * 100));
      const isUnlocked = current >= def.requirement;

      if (isUnlocked) {
        unlockedAt = new Date().toISOString();
      }

      return {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category as Achievement['category'],
        tier: def.tier as Achievement['tier'],
        progress,
        requirement: def.requirement,
        current,
        unlockedAt: isUnlocked ? unlockedAt : undefined,
      };
    });
  }, [habits, getHabitStats, journalEntries, getJournalStats, goals, routines, routineCompletions]);

  const unlockedAchievements = useMemo(() => 
    achievements.filter(a => a.unlockedAt), 
    [achievements]
  );

  const inProgressAchievements = useMemo(() => 
    achievements.filter(a => !a.unlockedAt && a.progress > 0).sort((a, b) => b.progress - a.progress),
    [achievements]
  );

  const totalPoints = useMemo(() => {
    const tierPoints = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
    return unlockedAchievements.reduce((sum, a) => sum + tierPoints[a.tier], 0);
  }, [unlockedAchievements]);

  return {
    achievements,
    unlockedAchievements,
    inProgressAchievements,
    totalPoints,
  };
}

function calculateRoutineStreak(completions: { date: string }[]): number {
  if (completions.length === 0) return 0;
  
  const dates = [...new Set(completions.map(c => c.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let checkDate = today;
  
  for (const date of dates) {
    if (date === checkDate) {
      streak++;
      const nextDate = new Date(checkDate);
      nextDate.setDate(nextDate.getDate() - 1);
      checkDate = nextDate.toISOString().split('T')[0];
    } else if (date < checkDate) {
      break;
    }
  }
  
  return streak;
}
