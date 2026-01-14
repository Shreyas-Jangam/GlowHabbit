import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Flame, Target, Calendar, TrendingUp } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournal } from '@/hooks/useJournal';
import { useGoals } from '@/hooks/useGoals';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function ProgressAnalyticsCard() {
  const { habits, getHabitStats } = useHabits();
  const { getStats: getJournalStats } = useJournal();
  const { goals } = useGoals();

  const stats = useMemo(() => {
    const habitStats = habits.map(h => getHabitStats(h));
    const avgCompletion = habitStats.length > 0
      ? Math.round(habitStats.reduce((s, h) => s + h.completionRate, 0) / habitStats.length)
      : 0;
    const longestStreak = Math.max(...habitStats.map(h => h.longestStreak), 0);
    const totalCompletions = habitStats.reduce((s, h) => s + h.totalCompletions, 0);
    const journalStats = getJournalStats();
    const activeGoals = goals.filter(g => !g.isCompleted).length;
    const completedGoals = goals.filter(g => g.isCompleted).length;

    return {
      avgCompletion,
      longestStreak,
      totalCompletions,
      journalStreak: journalStats.currentStreak,
      totalJournalEntries: journalStats.totalEntries,
      activeGoals,
      completedGoals,
      totalHabits: habits.length,
    };
  }, [habits, getHabitStats, getJournalStats, goals]);

  const metrics = [
    { 
      label: 'Avg Completion', 
      value: `${stats.avgCompletion}%`, 
      icon: BarChart3,
      color: 'text-primary',
      progress: stats.avgCompletion,
    },
    { 
      label: 'Longest Streak', 
      value: `${stats.longestStreak} days`, 
      icon: Flame,
      color: 'text-accent',
      progress: Math.min(100, stats.longestStreak * 3.33), // 30 days = 100%
    },
    { 
      label: 'Total Actions', 
      value: stats.totalCompletions.toString(), 
      icon: Target,
      color: 'text-success',
      progress: Math.min(100, stats.totalCompletions),
    },
    { 
      label: 'Journal Days', 
      value: stats.totalJournalEntries.toString(), 
      icon: Calendar,
      color: 'text-calm-lavender-foreground',
      progress: Math.min(100, stats.totalJournalEntries * 3.33),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="w-4 h-4 text-primary" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-3 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={cn("w-4 h-4", metric.color)} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-xl font-bold mb-2">{metric.value}</p>
                <Progress value={metric.progress} className="h-1" />
              </motion.div>
            ))}
          </div>

          {/* Goals Summary */}
          {(stats.activeGoals > 0 || stats.completedGoals > 0) && (
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Goals</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeGoals} active · {stats.completedGoals} completed
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {stats.activeGoals + stats.completedGoals}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
