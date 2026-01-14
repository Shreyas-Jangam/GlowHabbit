import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Award, Target, PenTool } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournal } from '@/hooks/useJournal';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { ProgressRing } from '@/components/habits/ProgressRing';
import { IntentionCard } from '@/components/dashboard/IntentionCard';
import { GlowMomentCard } from '@/components/dashboard/GlowMomentCard';
import { AISuggestionCard } from '@/components/dashboard/AISuggestionCard';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  onNavigateToJournal?: () => void;
}

const LIFE_BALANCE_CATEGORIES: HabitCategory[] = ['health', 'career', 'mind', 'relationships'];

export function DashboardView({ onNavigateToJournal }: DashboardViewProps) {
  const { 
    habits, 
    isLoaded, 
    toggleHabit, 
    addHabit, 
    removeHabit, 
    updateHabit,
    getHabitStats, 
    getTodayProgress,
    getBestHabit,
    getWeakestHabit
  } = useHabits();
  
  const { getTodayEntry } = useJournal();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const todayProgress = getTodayProgress();
  const bestHabit = getBestHabit();
  const weakestHabit = getWeakestHabit();
  const todayJournalEntry = getTodayEntry();

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter(h => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const totalStreak = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const stats = getHabitStats(habit);
      return acc + stats.currentStreak;
    }, 0);
  }, [habits, getHabitStats]);

  const categoryStats = useMemo(() => {
    const stats: Record<HabitCategory, { total: number; completed: number }> = {
      health: { total: 0, completed: 0 },
      career: { total: 0, completed: 0 },
      mind: { total: 0, completed: 0 },
      relationships: { total: 0, completed: 0 },
      custom: { total: 0, completed: 0 },
    };

    const today = format(new Date(), 'yyyy-MM-dd');
    habits.forEach(habit => {
      const category = stats[habit.category] ? habit.category : 'custom';
      stats[category].total++;
      if (habit.completedDates.includes(today)) {
        stats[category].completed++;
      }
    });

    return stats;
  }, [habits]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onNavigateToJournal && (
            <Button 
              variant="outline" 
              onClick={onNavigateToJournal}
              className="gap-2 text-xs sm:text-sm h-9 sm:h-10"
              size="sm"
            >
              <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{todayJournalEntry ? 'Continue Journal' : "Write Today's Entry"}</span>
              <span className="xs:hidden">Journal</span>
            </Button>
          )}
          <AddHabitDialog onAddHabit={addHabit} existingHabits={habits} />
        </div>
      </div>

      {/* Intention Card - Prominent Position */}
      <IntentionCard />

      {/* AI Suggestion Card */}
      <AISuggestionCard />

      {/* Glow Moments & Stats Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GlowMomentCard />
        </div>
        
        {/* Stats Cards - Now in a 2x2 grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 sm:col-span-1 bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <ProgressRing percentage={todayProgress.percentage} size={56} strokeWidth={5}>
              <span className="text-sm sm:text-lg font-bold">{todayProgress.percentage}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Today's Progress</p>
              <p className="text-lg sm:text-xl font-bold text-foreground">
                {todayProgress.completedCount}/{todayProgress.totalCount}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">habits completed</p>
            </div>
          </div>
        </motion.div>

        {/* Total Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-streak/15 flex-shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-streak animate-streak-pulse" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Streaks</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalStreak}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">days combined</p>
        </motion.div>

        {/* Best Habit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-success/15 flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Best Habit</span>
          </div>
          {bestHabit ? (
            <>
              <p className="text-base sm:text-lg font-bold text-foreground truncate">{bestHabit.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {getHabitStats(bestHabit).completionRate}% completion
              </p>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">Add habits to track</p>
          )}
        </motion.div>

        {/* Needs Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-warning/15 flex-shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Needs Focus</span>
          </div>
          {weakestHabit ? (
            <>
              <p className="text-base sm:text-lg font-bold text-foreground truncate">{weakestHabit.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {getHabitStats(weakestHabit).completionRate}% completion
              </p>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">Add habits to track</p>
          )}
        </motion.div>
        </div>
      </div>

      {/* Category Filter & Month Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Category Pills - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "rounded-full whitespace-nowrap flex-shrink-0 h-8 text-xs sm:text-sm",
              selectedCategory === 'all' && "gradient-primary text-primary-foreground"
            )}
          >
            All ({habits.length})
          </Button>
          {LIFE_BALANCE_CATEGORIES.map(cat => {
            const count = habits.filter(h => h.category === cat).length;
            if (count === 0) return null;
            const config = CATEGORY_CONFIG[cat];
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full gap-1.5 whitespace-nowrap flex-shrink-0 h-8 text-xs sm:text-sm",
                  selectedCategory === cat && cn(
                    cat === 'health' && "bg-category-health text-white hover:bg-category-health/90",
                    cat === 'career' && "bg-category-career text-white hover:bg-category-career/90",
                    cat === 'mind' && "bg-category-mind text-white hover:bg-category-mind/90",
                    cat === 'relationships' && "bg-category-relationships text-white hover:bg-category-relationships/90"
                  )
                )}
              >
                {config?.label || cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-end flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start building better habits! Click "Add Habit" to create your first one.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                stats={getHabitStats(habit)}
                onToggle={toggleHabit}
                onRemove={removeHabit}
                onUpdate={updateHabit}
                currentMonth={currentMonth}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
