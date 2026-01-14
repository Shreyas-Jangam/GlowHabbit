import { useState } from 'react';
import { Habit, HabitCategory, CATEGORY_CONFIG } from '@/types/habit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (habitId: string, updates: { name: string; category: HabitCategory }) => void;
}

const categories: { value: HabitCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'career', label: 'Career' },
  { value: 'mind', label: 'Mind' },
  { value: 'relationships', label: 'Relationships' },
];

export function EditHabitDialog({ habit, open, onOpenChange, onSave }: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState<HabitCategory>(habit.category);

  const handleSave = () => {
    if (name.trim()) {
      onSave(habit.id, { name: name.trim(), category });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Habit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="habit-name" className="text-sm font-medium">
              Habit Name
            </Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              className="h-10"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                    category === cat.value
                      ? cn(
                          "border-transparent text-white",
                          cat.value === 'health' && "bg-category-health",
                          cat.value === 'career' && "bg-category-career",
                          cat.value === 'mind' && "bg-category-mind",
                          cat.value === 'relationships' && "bg-category-relationships"
                        )
                      : cn(
                          "border-border bg-secondary/50 text-foreground hover:bg-secondary",
                          cat.value === 'health' && "hover:border-category-health/50",
                          cat.value === 'career' && "hover:border-category-career/50",
                          cat.value === 'mind' && "hover:border-category-mind/50",
                          cat.value === 'relationships' && "hover:border-category-relationships/50"
                        )
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
