import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { useAchievements, Achievement } from '@/hooks/useAchievements';
import { cn } from '@/lib/utils';

const TIER_STYLES = {
  bronze: 'from-amber-600 to-amber-800 text-amber-100',
  silver: 'from-slate-300 to-slate-500 text-slate-900',
  gold: 'from-yellow-400 to-amber-500 text-amber-900',
  platinum: 'from-violet-300 to-purple-500 text-purple-900',
};

const TIER_BORDER = {
  bronze: 'border-amber-500/30',
  silver: 'border-slate-400/30',
  gold: 'border-yellow-500/30',
  platinum: 'border-purple-500/30',
};

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const isUnlocked = !!achievement.unlockedAt;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all",
        isUnlocked 
          ? cn("bg-gradient-to-br shadow-md", TIER_STYLES[achievement.tier], TIER_BORDER[achievement.tier])
          : "bg-muted/50 border-border/50 opacity-60"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center mb-2",
        isUnlocked ? "bg-white/20" : "bg-muted"
      )}>
        {isUnlocked ? (
          <HabitIcon name={achievement.icon} className="w-5 h-5" />
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <span className={cn(
        "text-xs font-medium text-center leading-tight",
        !isUnlocked && "text-muted-foreground"
      )}>
        {achievement.name}
      </span>
      {!isUnlocked && achievement.progress > 0 && (
        <div className="w-full mt-2">
          <Progress value={achievement.progress} className="h-1" />
        </div>
      )}
    </motion.div>
  );
}

export function AchievementsCard() {
  const { unlockedAchievements, inProgressAchievements, totalPoints } = useAchievements();
  
  // Show first 6 unlocked + 3 in progress
  const displayUnlocked = unlockedAchievements.slice(0, 6);
  const displayProgress = inProgressAchievements.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="w-4 h-4 text-accent" />
              Achievements
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {totalPoints} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {unlockedAchievements.length === 0 && inProgressAchievements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Start building habits to unlock achievements!
            </p>
          ) : (
            <>
              {displayUnlocked.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Unlocked ({unlockedAchievements.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {displayUnlocked.map(a => (
                      <AchievementBadge key={a.id} achievement={a} />
                    ))}
                  </div>
                </div>
              )}
              
              {displayProgress.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    In Progress
                  </p>
                  <div className="space-y-2">
                    {displayProgress.map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <HabitIcon name={a.icon} className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.current}/{a.requirement}</p>
                        </div>
                        <Progress value={a.progress} className="w-16 h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
