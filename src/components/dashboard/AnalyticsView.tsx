import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, Award, Target, Flame, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habit';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { ProgressRing } from '@/components/habits/ProgressRing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const LIFE_BALANCE_CATEGORIES: HabitCategory[] = ['health', 'career', 'mind', 'relationships'];

export function AnalyticsView() {
  const { habits, getHabitStats, getDailyProgress, getMonthlyProgress, getBestHabit, getWeakestHabit } = useHabits();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const bestHabit = getBestHabit();
  const weakestHabit = getWeakestHabit();

  // Weekly data for the last 7 days
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const progress = getDailyProgress(dateStr);
      return {
        day: format(date, 'EEE'),
        date: format(date, 'MMM d'),
        percentage: progress.percentage,
        completed: progress.completedCount,
        total: progress.totalCount,
      };
    });
  }, [getDailyProgress]);

  // Monthly data
  const monthlyData = useMemo(() => {
    return getMonthlyProgress(selectedMonth).map(day => ({
      day: format(new Date(day.date), 'd'),
      percentage: day.percentage,
      completed: day.completedCount,
    }));
  }, [getMonthlyProgress, selectedMonth]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<HabitCategory, { count: number; avgCompletion: number }> = {
      health: { count: 0, avgCompletion: 0 },
      career: { count: 0, avgCompletion: 0 },
      mind: { count: 0, avgCompletion: 0 },
      relationships: { count: 0, avgCompletion: 0 },
      custom: { count: 0, avgCompletion: 0 },
    };

    habits.forEach(habit => {
      const stats = getHabitStats(habit);
      const category = breakdown[habit.category] ? habit.category : 'custom';
      breakdown[category].count++;
      breakdown[category].avgCompletion += stats.completionRate;
    });

    Object.keys(breakdown).forEach(cat => {
      const category = cat as HabitCategory;
      if (breakdown[category].count > 0) {
        breakdown[category].avgCompletion = Math.round(
          breakdown[category].avgCompletion / breakdown[category].count
        );
      }
    });

    return breakdown;
  }, [habits, getHabitStats]);

  // Overall stats
  const overallStats = useMemo(() => {
    if (habits.length === 0) return { avgCompletion: 0, totalStreaks: 0, longestStreak: 0 };

    let totalCompletion = 0;
    let totalStreaks = 0;
    let longestStreak = 0;

    habits.forEach(habit => {
      const stats = getHabitStats(habit);
      totalCompletion += stats.completionRate;
      totalStreaks += stats.currentStreak;
      longestStreak = Math.max(longestStreak, stats.longestStreak);
    });

    return {
      avgCompletion: Math.round(totalCompletion / habits.length),
      totalStreaks,
      longestStreak,
    };
  }, [habits, getHabitStats]);

  // Habit rankings
  const habitRankings = useMemo(() => {
    return habits
      .map(habit => ({
        habit,
        stats: getHabitStats(habit),
      }))
      .sort((a, b) => b.stats.completionRate - a.stats.completionRate);
  }, [habits, getHabitStats]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary font-bold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and discover patterns
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Avg. Completion</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{overallStats.avgCompletion}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-streak/15">
              <Flame className="w-5 h-5 text-streak" />
            </div>
            <span className="text-sm text-muted-foreground">Active Streaks</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{overallStats.totalStreaks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/15">
              <Award className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Longest Streak</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{overallStats.longestStreak}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Total Habits</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{habits.length}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-4">Last 7 Days</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="percentage" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Trend</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[100px] text-center">
                {format(selectedMonth, 'MMM yyyy')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedMonth(prev => {
                  const next = new Date(prev);
                  next.setMonth(next.getMonth() + 1);
                  return next > new Date() ? prev : next;
                })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown & Habit Rankings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-4">Life Balance Performance</h3>
          <div className="space-y-4">
            {LIFE_BALANCE_CATEGORIES.map(category => {
              const data = categoryBreakdown[category];
              if (data.count === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className={cn(
                          "w-3 h-3 rounded-full",
                          category === 'health' && "bg-category-health",
                          category === 'career' && "bg-category-career",
                          category === 'mind' && "bg-category-mind",
                          category === 'relationships' && "bg-category-relationships"
                        )}
                      />
                      <span className="text-sm font-medium">{CATEGORY_CONFIG[category].label}</span>
                    </div>
                    <span className="text-sm font-bold">{data.avgCompletion}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.avgCompletion}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        category === 'health' && "bg-category-health",
                        category === 'career' && "bg-category-career",
                        category === 'mind' && "bg-category-mind",
                        category === 'relationships' && "bg-category-relationships"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Habit Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-4">Habit Rankings</h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {habitRankings.map(({ habit, stats }, index) => (
              <div 
                key={habit.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index === 0 && "bg-achievement text-white",
                  index === 1 && "bg-muted-foreground/20 text-muted-foreground",
                  index === 2 && "bg-streak/20 text-streak",
                  index > 2 && "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </span>
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg",
                    habit.category === 'health' && "bg-category-health/15 text-category-health",
                    habit.category === 'career' && "bg-category-career/15 text-category-career",
                    habit.category === 'mind' && "bg-category-mind/15 text-category-mind",
                    habit.category === 'relationships' && "bg-category-relationships/15 text-category-relationships",
                    habit.category === 'custom' && "bg-primary/15 text-primary"
                  )}
                >
                  <HabitIcon name={habit.icon} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{habit.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {stats.completionRate > 70 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : stats.completionRate < 30 ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : null}
                  <span className="text-sm font-bold">{stats.completionRate}%</span>
                </div>
              </div>
            ))}

            {habitRankings.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Add habits to see rankings
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
