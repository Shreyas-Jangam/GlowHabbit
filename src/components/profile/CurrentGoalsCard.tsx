import { motion } from 'framer-motion';
import { Target, Calendar, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Goal } from '@/types/habit';

interface CurrentGoalsCardProps {
  goals: Goal[];
  onNavigateToGoals: () => void;
}

export function CurrentGoalsCard({ goals, onNavigateToGoals }: CurrentGoalsCardProps) {
  const activeGoals = goals.filter(g => !g.isCompleted).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-calm-mist-foreground" />
            Current Goals
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onNavigateToGoals}
          >
            View all
          </Button>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-calm-beige/50 flex items-center justify-center">
                  <Target className="h-7 w-7 text-calm-beige-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">No active goals yet</p>
              <Button
                variant="outline"
                className="border-border/50"
                onClick={onNavigateToGoals}
              >
                Set a goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{goal.title}</h4>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>Started {format(new Date(goal.createdAt), 'MMM d')}</span>
                    {goal.targetDate && (
                      <>
                        <span>•</span>
                        <span>Due {format(new Date(goal.targetDate), 'MMM d')}</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
