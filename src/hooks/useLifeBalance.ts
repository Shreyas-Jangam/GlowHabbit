import { useMemo, useCallback } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { Habit } from '@/types/habit';
import { Goal } from '@/types/habit';
import { LifeArea, LifeAreaScore, LifeBalanceData, LIFE_AREAS } from '@/types/routine';

// Map habit categories to life areas
const CATEGORY_TO_LIFE_AREA: Record<string, LifeArea> = {
  fitness: 'health',
  nutrition: 'health',
  wellness: 'mind',
  growth: 'mind',
  custom: 'career', // Default for custom
};

export function useLifeBalance(habits: Habit[], goals: Goal[]) {
  const getHabitLifeArea = useCallback((habit: Habit): LifeArea => {
    return CATEGORY_TO_LIFE_AREA[habit.category] || 'career';
  }, []);

  const calculateAreaScore = useCallback((
    areaHabits: Habit[],
    areaGoals: Goal[],
    days: number = 30
  ): LifeAreaScore => {
    const area = areaHabits.length > 0 
      ? getHabitLifeArea(areaHabits[0]) 
      : 'health';

    if (areaHabits.length === 0 && areaGoals.length === 0) {
      return {
        area,
        score: 0,
        habitCount: 0,
        completionRate: 0,
        goalProgress: 0,
        trend: 'stable',
      };
    }

    // Calculate habit completion rate for last N days
    let totalCompletions = 0;
    let possibleCompletions = 0;

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      areaHabits.forEach((habit) => {
        if (parseISO(habit.createdAt) <= parseISO(date)) {
          possibleCompletions++;
          if (habit.completedDates.includes(date)) {
            totalCompletions++;
          }
        }
      });
    }

    const completionRate = possibleCompletions > 0 
      ? (totalCompletions / possibleCompletions) * 100 
      : 0;

    // Calculate goal progress
    const goalProgress = areaGoals.length > 0
      ? areaGoals.reduce((sum, g) => sum + g.progress, 0) / areaGoals.length
      : 0;

    // Calculate overall score (weighted average)
    const habitWeight = 0.6;
    const goalWeight = 0.4;
    const score = Math.round(completionRate * habitWeight + goalProgress * goalWeight);

    // Calculate trend (compare last 7 days to previous 7 days)
    let recentCompletions = 0;
    let olderCompletions = 0;
    let recentPossible = 0;
    let olderPossible = 0;

    for (let i = 0; i < 7; i++) {
      const recentDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const olderDate = format(subDays(new Date(), i + 7), 'yyyy-MM-dd');
      
      areaHabits.forEach((habit) => {
        if (parseISO(habit.createdAt) <= parseISO(recentDate)) {
          recentPossible++;
          if (habit.completedDates.includes(recentDate)) {
            recentCompletions++;
          }
        }
        if (parseISO(habit.createdAt) <= parseISO(olderDate)) {
          olderPossible++;
          if (habit.completedDates.includes(olderDate)) {
            olderCompletions++;
          }
        }
      });
    }

    const recentRate = recentPossible > 0 ? recentCompletions / recentPossible : 0;
    const olderRate = olderPossible > 0 ? olderCompletions / olderPossible : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentRate > olderRate + 0.1) trend = 'up';
    else if (recentRate < olderRate - 0.1) trend = 'down';

    return {
      area,
      score,
      habitCount: areaHabits.length,
      completionRate: Math.round(completionRate),
      goalProgress: Math.round(goalProgress),
      trend,
    };
  }, [getHabitLifeArea]);

  const lifeBalanceData = useMemo((): LifeBalanceData => {
    const areaScores: LifeAreaScore[] = LIFE_AREAS.map((areaConfig) => {
      const areaHabits = habits.filter((h) => getHabitLifeArea(h) === areaConfig.id);
      const areaGoals = goals.filter((g) => {
        // For now, assign goals based on keywords in title
        const title = g.title.toLowerCase();
        if (areaConfig.id === 'health') {
          return title.includes('health') || title.includes('fitness') || title.includes('exercise') || title.includes('weight');
        }
        if (areaConfig.id === 'career') {
          return title.includes('work') || title.includes('career') || title.includes('project') || title.includes('learn');
        }
        if (areaConfig.id === 'mind') {
          return title.includes('mental') || title.includes('meditat') || title.includes('read') || title.includes('mindful');
        }
        if (areaConfig.id === 'relationships') {
          return title.includes('friend') || title.includes('family') || title.includes('social') || title.includes('relationship');
        }
        return false;
      });

      return calculateAreaScore(areaHabits, areaGoals);
    });

    // Calculate overall score
    const totalScore = areaScores.reduce((sum, s) => sum + s.score, 0);
    const overallScore = areaScores.length > 0 
      ? Math.round(totalScore / areaScores.length) 
      : 0;

    // Calculate stability score (how balanced the areas are)
    const scores = areaScores.map((s) => s.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length || 0;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length || 0;
    const stabilityScore = Math.max(0, Math.round(100 - Math.sqrt(variance)));

    // Generate insights
    const insights: string[] = [];
    
    const sortedByScore = [...areaScores].sort((a, b) => b.score - a.score);
    if (sortedByScore.length > 0) {
      const best = LIFE_AREAS.find((a) => a.id === sortedByScore[0].area);
      const worst = LIFE_AREAS.find((a) => a.id === sortedByScore[sortedByScore.length - 1].area);
      
      if (best && sortedByScore[0].score >= 50) {
        insights.push(`${best.label} is thriving with ${sortedByScore[0].score}% score`);
      }
      if (worst && sortedByScore[sortedByScore.length - 1].score < 30) {
        insights.push(`${worst.label} needs attention — only ${sortedByScore[sortedByScore.length - 1].score}%`);
      }
    }

    const upTrends = areaScores.filter((s) => s.trend === 'up');
    const downTrends = areaScores.filter((s) => s.trend === 'down');
    
    if (upTrends.length > 0) {
      const areas = upTrends.map((s) => LIFE_AREAS.find((a) => a.id === s.area)?.label).filter(Boolean);
      insights.push(`Improving: ${areas.join(', ')}`);
    }
    if (downTrends.length > 0) {
      const areas = downTrends.map((s) => LIFE_AREAS.find((a) => a.id === s.area)?.label).filter(Boolean);
      insights.push(`Declining: ${areas.join(', ')}`);
    }

    if (stabilityScore >= 80) {
      insights.push('Great balance! Your life areas are well-distributed');
    } else if (stabilityScore < 50) {
      insights.push('Consider redistributing focus for better balance');
    }

    return {
      overallScore,
      areaScores,
      stabilityScore,
      insights,
    };
  }, [habits, goals, getHabitLifeArea, calculateAreaScore]);

  return {
    lifeBalanceData,
    getHabitLifeArea,
    LIFE_AREAS,
  };
}
