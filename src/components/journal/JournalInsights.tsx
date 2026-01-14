import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { Flame, BookOpen, PenTool, TrendingUp, Calendar, Award } from 'lucide-react';
import { JournalStats, JournalEntry, MOOD_CONFIG } from '@/types/journal';
import { cn } from '@/lib/utils';

interface JournalInsightsProps {
  stats: JournalStats;
  moodTrend: { date: string; mood: JournalEntry['mood'] }[];
  habits?: { completed: number; total: number };
}

export function JournalInsights({ stats, moodTrend, habits }: JournalInsightsProps) {
  // Calculate mood distribution
  const moodDistribution = useMemo(() => {
    const dist: Record<string, number> = { great: 0, good: 0, okay: 0, low: 0, rough: 0 };
    moodTrend.forEach(m => {
      if (m.mood) dist[m.mood]++;
    });
    return dist;
  }, [moodTrend]);

  const totalMoods = Object.values(moodDistribution).reduce((a, b) => a + b, 0);

  // Generate insight message
  const insight = useMemo(() => {
    if (stats.currentStreak >= 7) {
      return "Amazing! You're on a 7+ day journaling streak. Keep it up!";
    }
    if (moodDistribution.great + moodDistribution.good > moodDistribution.low + moodDistribution.rough) {
      return "Your mood trend is positive! Journaling seems to help.";
    }
    if (stats.avgWordsPerEntry > 100) {
      return "You write thoughtful entries. Reflection is powerful!";
    }
    return "Every entry counts. Keep reflecting on your journey.";
  }, [stats, moodDistribution]);

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-streak" />
            <span className="text-xs text-muted-foreground">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-achievement" />
            <span className="text-xs text-muted-foreground">Longest Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.longestStreak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Entries</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalEntries}</p>
          <p className="text-xs text-muted-foreground">all time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.thisMonthEntries}</p>
          <p className="text-xs text-muted-foreground">entries</p>
        </motion.div>
      </div>

      {/* Mood Distribution */}
      {totalMoods > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
        >
          <h4 className="text-sm font-medium text-foreground mb-3">Mood Distribution (30 days)</h4>
          <div className="flex items-center gap-1 h-6 rounded-full overflow-hidden bg-secondary">
            {(Object.keys(MOOD_CONFIG) as JournalEntry['mood'][]).map((mood) => {
              const count = moodDistribution[mood!] || 0;
              const percentage = (count / totalMoods) * 100;
              if (percentage === 0) return null;
              
              return (
                <motion.div
                  key={mood}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "h-full flex items-center justify-center",
                    mood === 'great' && "bg-success",
                    mood === 'good' && "bg-primary",
                    mood === 'okay' && "bg-muted-foreground",
                    mood === 'low' && "bg-warning",
                    mood === 'rough' && "bg-destructive"
                  )}
                  title={`${MOOD_CONFIG[mood!].label}: ${count}`}
                >
                  {percentage > 10 && (
                    <span className="text-[10px] text-white font-medium">
                      {MOOD_CONFIG[mood!].emoji}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {(Object.keys(MOOD_CONFIG) as JournalEntry['mood'][]).map((mood) => (
              <div key={mood} className="flex items-center gap-1">
                <span className="text-xs">{MOOD_CONFIG[mood!].emoji}</span>
                <span className="text-xs text-muted-foreground">{moodDistribution[mood!] || 0}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20"
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Insight</h4>
            <p className="text-sm text-muted-foreground">{insight}</p>
          </div>
        </div>
      </motion.div>

      {/* Writing Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
      >
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Writing Stats</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Average <span className="font-semibold text-foreground">{stats.avgWordsPerEntry}</span> words per entry
        </p>
      </motion.div>
    </div>
  );
}
