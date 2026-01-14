import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MOOD_CONFIG } from '@/types/journal';

const EMOTION_COLORS: Record<string, string> = {
  joy: 'bg-yellow-400/20 text-yellow-600',
  gratitude: 'bg-pink-400/20 text-pink-600',
  hope: 'bg-green-400/20 text-green-600',
  calm: 'bg-blue-400/20 text-blue-600',
  love: 'bg-rose-400/20 text-rose-600',
  excitement: 'bg-orange-400/20 text-orange-600',
  sadness: 'bg-indigo-400/20 text-indigo-600',
  anxiety: 'bg-violet-400/20 text-violet-600',
  frustration: 'bg-red-400/20 text-red-600',
  stress: 'bg-amber-400/20 text-amber-600',
};

export function EmotionalTrackingCard() {
  const { getMoodAnalytics, getHabitMoodCorrelation, getMoodTrend } = useJournal();
  
  const analytics = useMemo(() => getMoodAnalytics(14), [getMoodAnalytics]);
  const correlation = useMemo(() => getHabitMoodCorrelation(), [getHabitMoodCorrelation]);
  const recentMoods = useMemo(() => getMoodTrend(7), [getMoodTrend]);

  // Determine trend
  const trend = useMemo(() => {
    if (analytics.moodByDay.length < 3) return 'neutral';
    const recent = analytics.moodByDay.slice(-3);
    const older = analytics.moodByDay.slice(0, 3);
    const recentAvg = recent.reduce((s, m) => s + m.score, 0) / recent.length;
    const olderAvg = older.reduce((s, m) => s + m.score, 0) / older.length;
    if (recentAvg > olderAvg + 10) return 'up';
    if (recentAvg < olderAvg - 10) return 'down';
    return 'stable';
  }, [analytics]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  const hasData = analytics.moodByDay.length > 0 || recentMoods.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Heart className="w-4 h-4 text-calm-lavender-foreground" />
            Emotional Wellness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasData ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Start journaling to track your emotional patterns
            </p>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendIcon className={cn("w-4 h-4", trendColor)} />
                  </div>
                  <p className="text-lg font-semibold">{trend === 'up' ? 'Rising' : trend === 'down' ? 'Dipping' : 'Steady'}</p>
                  <p className="text-xs text-muted-foreground">Trend</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-lg font-semibold">{analytics.positiveRatio}%</p>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-lg font-semibold">{analytics.emotionalStability}%</p>
                  <p className="text-xs text-muted-foreground">Stability</p>
                </div>
              </div>

              {/* Recent Moods */}
              {recentMoods.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Last 7 Days</p>
                  <div className="flex gap-1.5 justify-between">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      const dateStr = date.toISOString().split('T')[0];
                      const mood = recentMoods.find(m => m.date === dateStr);
                      const moodKey = mood?.mood;
                      const config = moodKey ? MOOD_CONFIG[moodKey] : null;
                      
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "flex-1 h-10 rounded-lg flex items-center justify-center text-lg transition-all",
                            config ? "bg-primary/10" : "bg-muted/30"
                          )}
                          title={dateStr}
                        >
                          {config ? config.emoji : '·'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dominant Emotions */}
              {analytics.dominantEmotions.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Common Feelings</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.dominantEmotions.slice(0, 5).map(({ emotion, count }) => (
                      <span
                        key={emotion}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                          EMOTION_COLORS[emotion] || 'bg-secondary text-foreground'
                        )}
                      >
                        {emotion} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Habit-Mood Insights */}
              {correlation && correlation.insights.length > 0 && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-calm-lavender/20 to-calm-sage/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Insights</span>
                  </div>
                  <ul className="space-y-1">
                    {correlation.insights.map((insight, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
