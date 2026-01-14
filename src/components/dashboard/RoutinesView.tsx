import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sunrise,
  Moon,
  Plus,
  Check,
  Play,
  RotateCcw,
  Trash2,
  Flame,
  TrendingUp,
  Sparkles,
  PartyPopper,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { useRoutines } from '@/hooks/useRoutines';
import { RoutineType, Routine } from '@/types/routine';
import { SkinCareSection } from '@/components/skincare/SkinCareCard';
import { useSkinCare } from '@/hooks/useSkinCare';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function RoutinesView() {
  const {
    routines,
    isLoaded,
    createRoutineFromTemplate,
    addRoutine,
    removeRoutine,
    toggleRoutineHabit,
    completeRoutine,
    resetRoutineHabits,
    isRoutineCompletedToday,
    getRoutineStats,
    getMorningRoutine,
    getNightRoutine,
    addHabitToRoutine,
    removeHabitFromRoutine,
  } = useRoutines();

  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime, setStartTime] = useState<Record<string, number>>({});
  const [newHabitName, setNewHabitName] = useState('');
  const [addingHabitTo, setAddingHabitTo] = useState<string | null>(null);

  const morningRoutine = getMorningRoutine();
  const nightRoutine = getNightRoutine();

  const handleCreateRoutine = (type: RoutineType) => {
    const routine = createRoutineFromTemplate(type);
    addRoutine(routine);
    toast.success(`${type === 'morning' ? 'Morning' : 'Night'} routine created!`);
  };

  const handleStartRoutine = (routineId: string) => {
    setStartTime((prev) => ({ ...prev, [routineId]: Date.now() }));
    resetRoutineHabits(routineId);
    toast.success('Routine started! Complete each step.');
  };

  const handleCompleteRoutine = (routineId: string) => {
    const duration = startTime[routineId]
      ? Math.round((Date.now() - startTime[routineId]) / 60000)
      : undefined;
    
    completeRoutine(routineId, duration);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    
    const message = duration 
      ? `Routine completed in ${duration} minutes!` 
      : 'Routine completed!';
    toast.success(message);
  };

  const handleAddHabit = (routineId: string) => {
    if (!newHabitName.trim()) return;
    
    addHabitToRoutine(routineId, {
      name: newHabitName,
      icon: 'Sparkles',
      order: routines.find((r) => r.id === routineId)?.habits.length || 0,
    });
    setNewHabitName('');
    setAddingHabitTo(null);
    toast.success('Habit added to routine!');
  };

  const RoutineCard = ({ routine, type }: { routine: Routine | undefined; type: RoutineType }) => {
    const isMorning = type === 'morning';
    const Icon = isMorning ? Sunrise : Moon;
    const color = isMorning ? 'hsl(38, 92%, 50%)' : 'hsl(270, 60%, 60%)';
    
    if (!routine) {
      return (
        <Card className="border-dashed border-2 border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isMorning ? 'Morning Routine' : 'Night Routine'}
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-4">
              {isMorning 
                ? 'Start your day with intention and energy' 
                : 'Wind down and reflect on your day'}
            </p>
            <Button 
              onClick={() => handleCreateRoutine(type)}
              className="gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create from Template
            </Button>
          </CardContent>
        </Card>
      );
    }

    const stats = getRoutineStats(routine.id);
    const isCompleted = isRoutineCompletedToday(routine.id);
    const completedCount = routine.habits.filter((h) => h.isCompleted).length;
    const progress = routine.habits.length > 0 
      ? (completedCount / routine.habits.length) * 100 
      : 0;

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <CardTitle className="text-lg">{routine.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {routine.habits.length} habits
                </p>
              </div>
            </div>
            {isCompleted && (
              <Badge className="bg-success text-success-foreground">
                <Check className="w-3 h-3 mr-1" />
                Done
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedCount}/{routine.habits.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Habits List */}
          <div className="space-y-2">
            {routine.habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  habit.isCompleted ? 'bg-success/10' : 'bg-secondary/50'
                }`}
              >
                <button
                  onClick={() => toggleRoutineHabit(routine.id, habit.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    habit.isCompleted
                      ? 'bg-success border-success'
                      : 'border-muted-foreground/30 hover:border-primary'
                  }`}
                >
                  {habit.isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
                </button>
                <HabitIcon name={habit.icon} className="w-5 h-5 text-muted-foreground" />
                <span className={`flex-1 ${habit.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {habit.name}
                </span>
                <button
                  onClick={() => removeHabitFromRoutine(routine.id, habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Add Habit */}
          {addingHabitTo === routine.id ? (
            <div className="flex gap-2">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="New habit name..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit(routine.id)}
              />
              <Button size="sm" onClick={() => handleAddHabit(routine.id)}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingHabitTo(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setAddingHabitTo(routine.id)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!isCompleted ? (
              <>
                {startTime[routine.id] ? (
                  <Button
                    className="flex-1 gradient-primary"
                    onClick={() => handleCompleteRoutine(routine.id)}
                    disabled={completedCount < routine.habits.length}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Complete Routine
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => handleStartRoutine(routine.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Routine
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => resetRoutineHabits(routine.id)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="flex-1 text-center text-sm text-muted-foreground py-2">
                ✨ Completed today!
              </div>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Routine?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this routine and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => removeRoutine(routine.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">{stats.consistencyRate}%</div>
              <div className="text-xs text-muted-foreground">Consistency</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{stats.totalCompletions}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Overall Stats
  const morningStats = morningRoutine ? getRoutineStats(morningRoutine.id) : null;
  const nightStats = nightRoutine ? getRoutineStats(nightRoutine.id) : null;
  const bestRoutine = morningStats && nightStats
    ? morningStats.consistencyRate >= nightStats.consistencyRate ? 'Morning' : 'Night'
    : morningStats ? 'Morning' : nightStats ? 'Night' : null;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 2, duration: 0.5 }}
              >
                <PartyPopper className="w-20 h-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Routine Complete!</h2>
              <p className="text-muted-foreground">Amazing work! Keep the momentum going.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Daily Routines
        </h1>
        <p className="text-muted-foreground">
          Start strong, end intentionally
        </p>
      </div>

      {/* Quick Stats */}
      {(morningStats || nightStats) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Sunrise className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{morningStats?.consistencyRate || 0}%</div>
              <div className="text-xs text-muted-foreground">Morning Consistency</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Moon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{nightStats?.consistencyRate || 0}%</div>
              <div className="text-xs text-muted-foreground">Night Consistency</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.max(morningStats?.currentStreak || 0, nightStats?.currentStreak || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{bestRoutine || '-'}</div>
              <div className="text-xs text-muted-foreground">Best Routine</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for Routines and Skin Care */}
      <Tabs defaultValue="routines" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="routines" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="skincare" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Skin Care
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routines" className="space-y-6">
          {/* Routines Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <RoutineCard routine={morningRoutine} type="morning" />
            <RoutineCard routine={nightRoutine} type="night" />
          </div>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Routine Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Start small — 3-5 habits per routine works best</li>
                    <li>• Morning routines set your energy for the day</li>
                    <li>• Night routines help you wind down and reflect</li>
                    <li>• Consistency matters more than perfection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skincare">
          <SkinCareSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
