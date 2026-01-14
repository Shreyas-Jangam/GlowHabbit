import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Lightbulb, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';
import { useJournal } from '@/hooks/useJournal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AISuggestion {
  suggestion: string;
  affirmation: string;
  tip?: string | null;
}

const FALLBACK_SUGGESTIONS: AISuggestion[] = [
  { suggestion: "Start with just 2 minutes today.", affirmation: "Small steps lead to big changes.", tip: "On busy days, micro-habits still count." },
  { suggestion: "Be gentle with yourself right now.", affirmation: "You're doing better than you think.", tip: null },
  { suggestion: "Focus on one thing that matters to you.", affirmation: "Progress over perfection.", tip: "Try habit stacking: attach a new habit to one you already do." },
];

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

export function AISuggestionCard() {
  const { habits, getHabitStats, getTodayProgress } = useHabits();
  const { getTodayEntry, getMoodAnalytics } = useJournal();
  
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchSuggestion = useCallback(async () => {
    if (habits.length === 0) {
      setSuggestion(FALLBACK_SUGGESTIONS[0]);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const today = new Date().toISOString().split('T')[0];
      const habitData = habits.map(h => {
        const stats = getHabitStats(h);
        return {
          name: h.name,
          category: h.category,
          completionRate: stats.completionRate,
          currentStreak: stats.currentStreak,
          isCompletedToday: h.completedDates.includes(today),
        };
      });

      const todayEntry = getTodayEntry();
      const moodAnalytics = getMoodAnalytics();
      
      let moodTrend: 'positive' | 'neutral' | 'negative' = 'neutral';
      if (moodAnalytics) {
        if (moodAnalytics.averageScore > 20) moodTrend = 'positive';
        else if (moodAnalytics.averageScore < -20) moodTrend = 'negative';
      }

      const { data, error } = await supabase.functions.invoke('habit-suggestions', {
        body: {
          habits: habitData,
          moodTrend,
          timeOfDay: getTimeOfDay(),
          journalMood: todayEntry?.mood || null,
        },
      });

      if (error) throw error;

      if (data?.error && data?.fallback) {
        setSuggestion(data.fallback);
      } else if (data) {
        setSuggestion(data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestion:', error);
      setHasError(true);
      // Use random fallback
      const randomFallback = FALLBACK_SUGGESTIONS[Math.floor(Math.random() * FALLBACK_SUGGESTIONS.length)];
      setSuggestion(randomFallback);
    } finally {
      setIsLoading(false);
    }
  }, [habits, getHabitStats, getTodayEntry, getMoodAnalytics]);

  // Fetch on mount and when habits change significantly
  useEffect(() => {
    fetchSuggestion();
  }, []);

  const handleRefresh = () => {
    fetchSuggestion();
  };

  if (!suggestion && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-accent/5 via-card to-primary/5">
        {/* Subtle animated glow */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
        />
        
        <CardContent className="relative p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Gentle Suggestion</h3>
                <p className="text-xs text-muted-foreground">Personalized for you</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 hover:bg-primary/10"
            >
              <RefreshCw className={cn(
                "w-4 h-4",
                isLoading && "animate-spin"
              )} />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="h-4 bg-secondary/50 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-secondary/30 rounded animate-pulse w-1/2" />
              </motion.div>
            ) : suggestion && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Main suggestion */}
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {suggestion.suggestion}
                  </p>
                </div>

                {/* Affirmation */}
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                  <Heart className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground/80 italic">
                    {suggestion.affirmation}
                  </p>
                </div>

                {/* Optional tip */}
                {suggestion.tip && (
                  <p className="text-xs text-muted-foreground pl-6">
                    💡 {suggestion.tip}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
