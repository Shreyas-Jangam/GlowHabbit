import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isToday, isFuture, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JournalEntry, MOOD_CONFIG, SentimentData } from '@/types/journal';
import { getSentimentEmoji } from '@/utils/sentimentAnalysis';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JournalCalendarProps {
  monthEntries: { date: string; hasEntry: boolean; wordCount: number; mood?: JournalEntry['mood']; sentiment?: SentimentData }[];
  currentMonth: Date;
  selectedDate: string | null;
  onMonthChange: (month: Date) => void;
  onDateSelect: (date: string) => void;
}

export function JournalCalendar({
  monthEntries,
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
}: JournalCalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  
  // Get intensity based on word count
  const getIntensity = (wordCount: number): string => {
    if (wordCount === 0) return '';
    if (wordCount < 50) return 'bg-primary/20';
    if (wordCount < 150) return 'bg-primary/40';
    if (wordCount < 300) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-md border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Journal Calendar</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            disabled={isSameMonth(currentMonth, new Date())}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-xs text-muted-foreground text-center font-medium py-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for alignment */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Calendar days */}
        {monthEntries.map((entry) => {
          const date = new Date(entry.date);
          const isTodayDate = isToday(date);
          const isFutureDate = isFuture(date);
          const isSelected = selectedDate === entry.date;
          
          return (
            <motion.button
              key={entry.date}
              whileHover={{ scale: isFutureDate ? 1 : 1.1 }}
              whileTap={{ scale: isFutureDate ? 1 : 0.95 }}
              onClick={() => !isFutureDate && onDateSelect(entry.date)}
              disabled={isFutureDate}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                isFutureDate && "opacity-30 cursor-not-allowed",
                !entry.hasEntry && !isFutureDate && "bg-secondary/50 hover:bg-secondary text-muted-foreground",
                entry.hasEntry && getIntensity(entry.wordCount),
                entry.hasEntry && "text-primary-foreground",
                isTodayDate && !entry.hasEntry && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                isSelected && "ring-2 ring-accent ring-offset-1 ring-offset-card"
              )}
            >
              <span className="font-medium">{format(date, 'd')}</span>
              {(entry.mood || entry.sentiment) && (
                <span className="text-[10px] absolute -bottom-0.5">
                  {entry.mood ? MOOD_CONFIG[entry.mood].emoji : entry.sentiment ? getSentimentEmoji(entry.sentiment.label) : ''}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-secondary" />
            <div className="w-3 h-3 rounded bg-primary/20" />
            <div className="w-3 h-3 rounded bg-primary/40" />
            <div className="w-3 h-3 rounded bg-primary/60" />
            <div className="w-3 h-3 rounded bg-primary/80" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
