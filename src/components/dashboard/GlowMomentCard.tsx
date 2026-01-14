import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Moon, Star, Heart, X, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGlowMoments, GlowMoment } from '@/hooks/useGlowMoments';
import { cn } from '@/lib/utils';

const TIER_CONFIG = {
  spark: { 
    icon: Sparkles, 
    gradient: 'from-amber-200/20 via-orange-100/10 to-yellow-200/20',
    iconColor: 'text-amber-500',
    label: 'Spark'
  },
  glow: { 
    icon: Sun, 
    gradient: 'from-primary/20 via-emerald-100/10 to-teal-200/20',
    iconColor: 'text-primary',
    label: 'Glow'
  },
  radiance: { 
    icon: Star, 
    gradient: 'from-violet-200/20 via-purple-100/10 to-fuchsia-200/20',
    iconColor: 'text-violet-500',
    label: 'Radiance'
  },
  brilliance: { 
    icon: Heart, 
    gradient: 'from-rose-200/20 via-pink-100/10 to-red-200/20',
    iconColor: 'text-rose-500',
    label: 'Brilliance'
  },
};

function GlowMomentPopup({ moment, onDismiss }: { moment: GlowMoment; onDismiss: () => void }) {
  const config = TIER_CONFIG[moment.tier];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "relative max-w-sm w-full p-6 rounded-3xl bg-gradient-to-br",
          config.gradient,
          "bg-card border border-border/50 shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={cn(
              "absolute -inset-1/2 opacity-30 blur-3xl",
              moment.tier === 'spark' && "bg-amber-400",
              moment.tier === 'glow' && "bg-emerald-400",
              moment.tier === 'radiance' && "bg-violet-400",
              moment.tier === 'brilliance' && "bg-rose-400",
            )}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="relative text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={cn(
              "w-20 h-20 mx-auto rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-white/30 to-white/10 shadow-lg"
            )}
          >
            <Icon className={cn("w-10 h-10", config.iconColor)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {config.label} Moment
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {moment.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {moment.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4 border-t border-border/30"
          >
            <p className="text-sm italic text-foreground/80">
              "{moment.affirmation}"
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function GlowMomentCard() {
  const { 
    unlockedMoments, 
    newlyUnlocked, 
    dismissNewlyUnlocked,
    getRandomAffirmation,
    getUnlockedQuotes,
    totalMoments,
  } = useGlowMoments();

  const randomAffirmation = getRandomAffirmation();
  const unlockedQuotes = getUnlockedQuotes();
  const randomQuote = unlockedQuotes.length > 0 
    ? unlockedQuotes[Math.floor(Math.random() * unlockedQuotes.length)]
    : null;

  return (
    <>
      <AnimatePresence>
        {newlyUnlocked && (
          <GlowMomentPopup moment={newlyUnlocked} onDismiss={dismissNewlyUnlocked} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Glow Moments</h3>
                  <p className="text-xs text-muted-foreground">{totalMoments} unlocked</p>
                </div>
              </div>
            </div>

            {/* Unlocked moments display */}
            {unlockedMoments.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {unlockedMoments.slice(0, 4).map((moment) => {
                  const config = TIER_CONFIG[moment.tier];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={moment.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "bg-gradient-to-br from-white/10 to-white/5 border border-border/30"
                      )}
                      title={moment.title}
                    >
                      <Icon className={cn("w-4 h-4", config.iconColor)} />
                    </motion.div>
                  );
                })}
                {unlockedMoments.length > 4 && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/50 text-xs font-medium text-muted-foreground">
                    +{unlockedMoments.length - 4}
                  </div>
                )}
              </div>
            )}

            {/* Affirmation or Quote */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30">
              {randomQuote ? (
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground italic leading-relaxed">
                      "{randomQuote.quote}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      — {randomQuote.author}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 italic text-center">
                  "{randomAffirmation}"
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
