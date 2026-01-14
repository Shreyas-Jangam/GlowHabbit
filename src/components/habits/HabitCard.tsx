import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { Habit, HabitStats, HabitCategory, CATEGORY_CONFIG } from '@/types/habit';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { format, addDays, startOfMonth, endOfMonth, isSameMonth, isToday, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EditHabitDialog } from './EditHabitDialog';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  onToggle: (habitId: string, date: string) => void;
  onRemove: (habitId: string) => void;
  onUpdate: (habitId: string, updates: { name: string; category: HabitCategory }) => void;
  currentMonth: Date;
}

export function HabitCard({ habit, stats, onToggle, onRemove, onUpdate, currentMonth }: HabitCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG.custom;
  
  // Get days for the current month
  const monthStart = startOfMonth(currentMonth);
  const today = new Date();
  
  // Generate 31 days grid for the current month
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = addDays(monthStart, i);
    return isSameMonth(day, currentMonth) ? day : null;
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div 
          className={cn(
            "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex-shrink-0",
            habit.category === 'health' && "bg-category-health/15 text-category-health",
            habit.category === 'career' && "bg-category-career/15 text-category-career",
            habit.category === 'mind' && "bg-category-mind/15 text-category-mind",
            habit.category === 'relationships' && "bg-category-relationships/15 text-category-relationships",
            habit.category === 'custom' && "bg-primary/15 text-primary"
          )}
        >
          <HabitIcon name={habit.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </div>
        
        <div className="flex-1 min-w-0 flex items-center gap-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate text-xs sm:text-sm lg:text-base leading-tight">{habit.name}</h3>
            <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground truncate">{categoryConfig.label}</p>
          </div>
          
          {/* Menu - next to title */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-muted-foreground hover:text-foreground touch-target-sm"
              >
                <MoreVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover min-w-[140px]">
              <DropdownMenuItem onClick={() => setEditOpen(true)} className="touch-target-sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onRemove(habit.id)}
                className="text-destructive focus:text-destructive touch-target-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-streak/15 text-streak flex-shrink-0"
          >
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 animate-streak-pulse" />
            <span className="text-[10px] sm:text-xs font-bold">{stats.currentStreak}</span>
          </motion.div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditHabitDialog
        habit={habit}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onUpdate}
      />

      {/* 31-day Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-2 sm:mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[7px] sm:text-[8px] lg:text-[10px] text-muted-foreground text-center font-medium">
            {day}
          </div>
        ))}
        
        {/* Empty cells for alignment */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {days.map((day, index) => {
          if (!day) return <div key={`null-${index}`} className="aspect-square" />;
          
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCompleted = habit.completedDates.includes(dateStr);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day);
          
          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: isFutureDate ? 1 : 1.1 }}
              whileTap={{ scale: isFutureDate ? 1 : 0.9 }}
              onClick={() => !isFutureDate && onToggle(habit.id, dateStr)}
              disabled={isFutureDate}
              className={cn(
                "aspect-square rounded-[3px] sm:rounded flex items-center justify-center text-[7px] sm:text-[8px] lg:text-[10px] font-medium transition-all duration-200 touch-manipulation",
                isFutureDate && "opacity-30 cursor-not-allowed",
                !isCompleted && !isFutureDate && "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                isCompleted && habit.category === 'health' && "bg-category-health text-white",
                isCompleted && habit.category === 'career' && "bg-category-career text-white",
                isCompleted && habit.category === 'mind' && "bg-category-mind text-white",
                isCompleted && habit.category === 'relationships' && "bg-category-relationships text-white",
                isCompleted && habit.category === 'custom' && "bg-primary text-primary-foreground",
                isTodayDate && !isCompleted && "ring-1 ring-primary ring-offset-1 ring-offset-card"
              )}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="animate-check-bounce"
                >
                  <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </motion.div>
              ) : (
                format(day, 'd')
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="text-center">
            <p className="text-xs sm:text-sm lg:text-base font-bold text-foreground">{stats.completionRate}%</p>
            <p className="text-[7px] sm:text-[8px] lg:text-[10px] text-muted-foreground">Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm lg:text-base font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-[7px] sm:text-[8px] lg:text-[10px] text-muted-foreground">Best</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm lg:text-base font-bold text-foreground">{stats.totalCompletions}</p>
            <p className="text-[7px] sm:text-[8px] lg:text-[10px] text-muted-foreground">Total</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 ml-2 sm:ml-3 max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]">
          <div className="h-1 sm:h-1.5 lg:h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                habit.category === 'health' && "bg-category-health",
                habit.category === 'career' && "bg-category-career",
                habit.category === 'mind' && "bg-category-mind",
                habit.category === 'relationships' && "bg-category-relationships",
                habit.category === 'custom' && "bg-primary"
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
