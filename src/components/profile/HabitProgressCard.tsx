import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from '@/components/habits/ProgressRing';

interface HabitProgressCardProps {
  completionRate: number;
  longestStreak: number;
  totalCompletions: number;
}

export function HabitProgressCard({ completionRate, longestStreak, totalCompletions }: HabitProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-calm-lavender-foreground" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Ring */}
          <div className="flex justify-center py-6">
            <ProgressRing
              percentage={completionRate}
              size={140}
              strokeWidth={10}
              className="text-calm-sage"
            >
              <div className="text-center">
                <span className="text-3xl font-semibold text-foreground">{completionRate}%</span>
                <p className="text-xs text-muted-foreground mt-0.5">completion</p>
              </div>
            </ProgressRing>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-calm-sage/30">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-calm-sage/50">
                <TrendingUp className="h-5 w-5 text-calm-sage-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{longestStreak}</p>
                <p className="text-xs text-muted-foreground">longest streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-calm-lavender/30">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-calm-lavender/50">
                <Target className="h-5 w-5 text-calm-lavender-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{totalCompletions}</p>
                <p className="text-xs text-muted-foreground">days completed</p>
              </div>
            </div>
          </div>

          {/* Calm encouragement */}
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            Every step forward counts. You're doing great.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
