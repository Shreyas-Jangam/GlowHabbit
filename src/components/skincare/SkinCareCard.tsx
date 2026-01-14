import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  Plus,
  Trash2,
  Edit2,
  Sun,
  Moon,
  Droplets,
  Info,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { useSkinCare } from '@/hooks/useSkinCare';
import { SkinCareRoutine, SKIN_TYPE_CONFIG, SkinType } from '@/types/skincare';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface SkinCareCardProps {
  routine: SkinCareRoutine | undefined;
  type: 'morning' | 'night';
  onComplete: () => void;
  compact?: boolean;
}

export function SkinCareCard({ routine, type, onComplete, compact = false }: SkinCareCardProps) {
  const {
    createRoutineFromTemplate,
    addRoutine,
    toggleStep,
    updateStep,
    addStep,
    removeStep,
    completeRoutine,
    resetRoutine,
    isRoutineCompletedToday,
    isAlternateDayToday,
    removeRoutine,
  } = useSkinCare();

  const [isExpanded, setIsExpanded] = useState(!compact);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [addingStep, setAddingStep] = useState(false);
  const [newStepName, setNewStepName] = useState('');

  const isMorning = type === 'morning';
  const Icon = isMorning ? Sun : Moon;
  const color = isMorning ? 'hsl(45, 93%, 55%)' : 'hsl(280, 70%, 65%)';
  const bgGradient = isMorning
    ? 'from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20'
    : 'from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20';

  const handleCreate = () => {
    const newRoutine = createRoutineFromTemplate(type);
    addRoutine(newRoutine);
    toast.success(`${isMorning ? 'Morning' : 'Night'} skin care routine created!`);
  };

  const handleComplete = () => {
    if (!routine) return;
    completeRoutine(routine.id);
    onComplete();
    toast.success('Skin care routine complete! ✨');
  };

  const handleAddStep = () => {
    if (!routine || !newStepName.trim()) return;
    addStep(routine.id, {
      name: newStepName,
      icon: 'Sparkles',
      isOptional: true,
      order: routine.steps.length,
    });
    setNewStepName('');
    setAddingStep(false);
    toast.success('Step added!');
  };

  const handleUpdateProduct = (stepId: string) => {
    if (!routine) return;
    updateStep(routine.id, stepId, { productName: newProductName });
    setEditingStep(null);
    setNewProductName('');
  };

  if (!routine) {
    return (
      <Card className={`border-dashed border-2 border-border/50 bg-gradient-to-br ${bgGradient}`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Droplets className="w-7 h-7" style={{ color }} />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            {isMorning ? 'Morning' : 'Night'} Skin Care
          </h3>
          <p className="text-muted-foreground text-sm text-center mb-3">
            {isMorning ? 'Protect and prep your skin' : 'Nourish and repair overnight'}
          </p>
          <Button onClick={handleCreate} size="sm" className="gradient-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add Routine
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = isRoutineCompletedToday(routine.id);
  const completedCount = routine.steps.filter((s) => s.isCompleted).length;
  const totalSteps = routine.steps.filter((s) => !s.isOptional || s.isCompleted).length || routine.steps.length;
  const progress = routine.steps.length > 0 ? (completedCount / routine.steps.length) * 100 : 0;
  const isAlternateDay = isAlternateDayToday();

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${bgGradient} border-0 shadow-sm`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}25` }}
            >
              <Droplets className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {isMorning ? 'Morning' : 'Night'} Skin Care
                {isCompleted && (
                  <Badge className="bg-success/20 text-success border-0 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                )}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {routine.steps.length} steps • ~{routine.steps.reduce((sum, s) => sum + (s.timeEstimate || 1), 0)} min
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-3 pt-2">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completedCount}/{routine.steps.length}</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                {routine.steps.map((step, index) => {
                  const shouldSkipToday = step.isAlternateDay && !isAlternateDay;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all ${
                        step.isCompleted
                          ? 'bg-success/10'
                          : shouldSkipToday
                          ? 'bg-muted/30 opacity-60'
                          : 'bg-background/60'
                      }`}
                    >
                      <button
                        onClick={() => toggleStep(routine.id, step.id)}
                        disabled={shouldSkipToday}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          step.isCompleted
                            ? 'bg-success border-success'
                            : shouldSkipToday
                            ? 'border-muted-foreground/20'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                      >
                        {step.isCompleted && <Check className="w-3 h-3 text-success-foreground" />}
                      </button>

                      <HabitIcon name={step.icon} className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm ${
                              step.isCompleted ? 'line-through text-muted-foreground' : ''
                            } ${shouldSkipToday ? 'text-muted-foreground' : ''}`}
                          >
                            {step.name}
                          </span>
                          {step.isOptional && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                              Optional
                            </Badge>
                          )}
                          {step.isAlternateDay && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1 py-0 h-4 ${
                                      shouldSkipToday ? 'bg-muted' : 'bg-accent/20 border-accent'
                                    }`}
                                  >
                                    {shouldSkipToday ? 'Rest day' : 'Active day'}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Alternate-day treatment (Mon, Wed, Fri, Sun)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {step.productName && (
                          <p className="text-xs text-muted-foreground truncate">{step.productName}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-60 hover:opacity-100"
                              onClick={() => {
                                setEditingStep(step.id);
                                setNewProductName(step.productName || '');
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>
                                Add the product name you use for this step
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input
                                  value={newProductName}
                                  onChange={(e) => setNewProductName(e.target.value)}
                                  placeholder="e.g., CeraVe Foaming Cleanser"
                                />
                              </div>
                              <Button onClick={() => handleUpdateProduct(step.id)} className="w-full">
                                Save Product
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-60 hover:opacity-100 text-destructive"
                          onClick={() => removeStep(routine.id, step.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Add Step */}
              {addingStep ? (
                <div className="flex gap-2">
                  <Input
                    value={newStepName}
                    onChange={(e) => setNewStepName(e.target.value)}
                    placeholder="New step name..."
                    className="h-8 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                  />
                  <Button size="sm" className="h-8" onClick={handleAddStep}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => setAddingStep(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={() => setAddingStep(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Step
                </Button>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {!isCompleted ? (
                  <>
                    <Button
                      className="flex-1 h-9 gradient-primary"
                      onClick={handleComplete}
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Complete Skin Care
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => resetRoutine(routine.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex-1 text-center text-sm text-muted-foreground py-2">
                    ✨ Glowing!
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive"
                  onClick={() => removeRoutine(routine.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed view */}
      {!isExpanded && (
        <CardContent className="pt-0 pb-3">
          <div className="flex items-center justify-between">
            <Progress value={progress} className="flex-1 h-1.5 mr-3" />
            <span className="text-xs text-muted-foreground">{completedCount}/{routine.steps.length}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Main Skin Care Section Component
export function SkinCareSection() {
  const {
    skinType,
    setSkinType,
    getMorningRoutine,
    getNightRoutine,
    getStats,
  } = useSkinCare();

  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const morningRoutine = getMorningRoutine();
  const nightRoutine = getNightRoutine();
  const stats = getStats();

  const handleComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 200, 100, 0.3)',
                    '0 0 60px rgba(255, 200, 100, 0.5)',
                    '0 0 20px rgba(255, 200, 100, 0.3)',
                  ],
                }}
                transition={{ repeat: 2, duration: 0.8 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-12 h-12 text-amber-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Skin Care Complete!</h2>
              <p className="text-muted-foreground">Your skin thanks you ✨</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Skin Care</h2>
        </div>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Info className="w-4 h-4 mr-1" />
              Skin Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Skin Type Settings</DialogTitle>
              <DialogDescription>
                Select your skin type to get personalized tips
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Select value={skinType || ''} onValueChange={(v) => setSkinType(v as SkinType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SKIN_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label} - {config.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {skinType && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Tips for {SKIN_TYPE_CONFIG[skinType].label} skin:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {SKIN_TYPE_CONFIG[skinType].tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats (if routines exist) */}
      {(morningRoutine || nightRoutine) && (
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-primary">{stats.currentStreak}</div>
            <div className="text-[10px] text-muted-foreground">Streak</div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-amber-500">{stats.morningConsistency}%</div>
            <div className="text-[10px] text-muted-foreground">AM</div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-purple-500">{stats.nightConsistency}%</div>
            <div className="text-[10px] text-muted-foreground">PM</div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-foreground">{stats.totalCompletions}</div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
        </div>
      )}

      {/* Routines */}
      <div className="grid gap-3">
        <SkinCareCard routine={morningRoutine} type="morning" onComplete={handleComplete} />
        <SkinCareCard routine={nightRoutine} type="night" onComplete={handleComplete} />
      </div>
    </div>
  );
}
