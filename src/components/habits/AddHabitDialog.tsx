import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Habit, HabitCategory, CATEGORY_CONFIG, DEFAULT_HABITS } from '@/types/habit';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const ICONS = [
  'BookOpen', 'PenTool', 'Globe', 'Smartphone', 'Brain',
  'Dumbbell', 'Activity', 'ClipboardList', 'Pill', 'Footprints',
  'UtensilsCrossed', 'Droplets', 'Ban', 'Calculator', 'Apple',
  'Sparkles', 'Heart', 'Moon', 'Sun', 'MessageCircle',
  'Coffee', 'Music', 'Camera', 'Star', 'Target',
  'Sunrise', 'Shield', 'Wine', 'Wallet', 'Receipt',
  'Users', 'Phone', 'Clock', 'Briefcase', 'Ear',
];

const LIFE_BALANCE_CATEGORIES: HabitCategory[] = ['health', 'career', 'mind', 'relationships'];

interface AddHabitDialogProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>) => void;
  existingHabits: Habit[];
}

export function AddHabitDialog({ onAddHabit, existingHabits }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'templates' | 'custom'>('templates');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [icon, setIcon] = useState('Star');

  const availableTemplates = DEFAULT_HABITS.filter(
    template => !existingHabits.some(h => h.name === template.name)
  );

  const handleAddTemplate = (template: typeof DEFAULT_HABITS[0]) => {
    onAddHabit(template);
    setOpen(false);
  };

  const handleAddCustom = () => {
    if (!name.trim()) return;
    onAddHabit({
      name: name.trim(),
      icon,
      category,
      color: CATEGORY_CONFIG[category].color,
    });
    setName('');
    setCategory('custom');
    setIcon('Star');
    setStep('templates');
    setOpen(false);
  };

  const resetAndClose = () => {
    setStep('templates');
    setName('');
    setCategory('custom');
    setIcon('Star');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 'templates' ? 'Add a New Habit' : 'Create Custom Habit'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'templates' ? (
            <motion.div
              key="templates"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Create Custom Button */}
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex items-center justify-center gap-3 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                onClick={() => setStep('custom')}
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="font-medium">Create Custom Habit</span>
              </Button>

              {/* Template Categories */}
              {LIFE_BALANCE_CATEGORIES.map(cat => {
                const categoryTemplates = availableTemplates.filter(t => t.category === cat);
                if (categoryTemplates.length === 0) return null;

                return (
                  <div key={cat} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <span 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          cat === 'health' && "bg-category-health",
                          cat === 'career' && "bg-category-career",
                          cat === 'mind' && "bg-category-mind",
                          cat === 'relationships' && "bg-category-relationships"
                        )}
                      />
                      {CATEGORY_CONFIG[cat].label}
                    </h4>
                    <div className="grid gap-2">
                      {categoryTemplates.map(template => (
                        <motion.button
                          key={template.name}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAddTemplate(template)}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                        >
                          <div 
                            className={cn(
                              "flex items-center justify-center w-9 h-9 rounded-lg",
                              cat === 'health' && "bg-category-health/15 text-category-health",
                              cat === 'career' && "bg-category-career/15 text-category-career",
                              cat === 'mind' && "bg-category-mind/15 text-category-mind",
                              cat === 'relationships' && "bg-category-relationships/15 text-category-relationships"
                            )}
                          >
                            <HabitIcon name={template.icon} className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{template.name}</span>
                          <Plus className="w-4 h-4 ml-auto text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {availableTemplates.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  You've added all template habits! Create a custom one.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('templates')}
                className="mb-2"
              >
                ← Back to templates
              </Button>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  placeholder="e.g., Practice gratitude"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Life Balance Area</label>
                <div className="grid grid-cols-2 gap-2">
                  {([...LIFE_BALANCE_CATEGORIES, 'custom'] as HabitCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        category === cat 
                          ? "border-primary bg-primary/5" 
                          : "border-transparent bg-secondary/50 hover:bg-secondary"
                      )}
                    >
                      <span 
                        className={cn(
                          "w-3 h-3 rounded-full",
                          cat === 'health' && "bg-category-health",
                          cat === 'career' && "bg-category-career",
                          cat === 'mind' && "bg-category-mind",
                          cat === 'relationships' && "bg-category-relationships",
                          cat === 'custom' && "bg-primary"
                        )}
                      />
                      <span className="text-sm font-medium">{CATEGORY_CONFIG[cat].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {ICONS.map(iconName => (
                    <button
                      key={iconName}
                      onClick={() => setIcon(iconName)}
                      className={cn(
                        "aspect-square flex items-center justify-center rounded-lg transition-all",
                        icon === iconName
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <HabitIcon name={iconName} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <Button
                className="w-full h-11 gradient-primary text-primary-foreground"
                onClick={handleAddCustom}
                disabled={!name.trim()}
              >
                Create Habit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
