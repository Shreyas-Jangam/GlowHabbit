import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { PenTool, Plus, ArrowLeft, Trash2, Activity } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { useHabits } from '@/hooks/useHabits';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalCalendar } from '@/components/journal/JournalCalendar';
import { JournalInsights } from '@/components/journal/JournalInsights';
import { MoodInsights } from '@/components/journal/MoodInsights';
import { JournalEntry } from '@/types/journal';
import { getSentimentEmoji } from '@/utils/sentimentAnalysis';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

export function JournalView() {
  const { 
    entries, 
    settings,
    isLoaded, 
    getEntryByDate, 
    getTodayEntry, 
    saveEntry, 
    deleteEntry,
    getStats, 
    getMonthEntries,
    getMoodTrend,
    getMoodAnalytics,
    getHabitMoodCorrelation,
  } = useJournal();
  
  const { habits, getTodayProgress } = useHabits();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoodInsights, setShowMoodInsights] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = getTodayEntry();
  const stats = getStats();
  const monthEntries = getMonthEntries(currentMonth);
  const moodTrend = getMoodTrend(30);
  const moodAnalytics = getMoodAnalytics(30);
  const habitCorrelation = getHabitMoodCorrelation();
  const todayProgress = getTodayProgress();

  // Get habits summary for today
  const habitsSummary = useMemo(() => {
    const completedHabits = habits.filter(h => h.completedDates.includes(today));
    return {
      completed: completedHabits.length,
      total: habits.length,
      habits: completedHabits.map(h => h.name),
    };
  }, [habits, today]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsEditing(true);
  };

  const handleSave = useCallback((content: string, mood?: JournalEntry['mood'], manualMood?: boolean) => {
    const date = selectedDate || today;
    saveEntry(date, content, mood, date === today ? habitsSummary : undefined, manualMood);
  }, [selectedDate, today, saveEntry, habitsSummary]);

  const handleStartToday = () => {
    setSelectedDate(today);
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
    setSelectedDate(null);
  };

  const handleDelete = () => {
    if (selectedDate) {
      deleteEntry(selectedDate);
      handleBack();
    }
  };

  const currentEntry = selectedDate ? getEntryByDate(selectedDate) : undefined;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Journal
              </Button>
              
              {currentEntry && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Entry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your journal entry for {format(new Date(selectedDate!), 'MMMM d, yyyy')}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <JournalEditor
              date={selectedDate || today}
              initialContent={currentEntry?.content || ''}
              initialMood={currentEntry?.mood}
              initialSentiment={currentEntry?.sentiment}
              habitsSummary={selectedDate === today ? habitsSummary : currentEntry?.habitsSummary}
              sentimentEnabled={settings.sentimentAnalysisEnabled}
              onSave={handleSave}
            />
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Daily Journal</h1>
                <p className="text-muted-foreground mt-1">
                  Reflect, reset, and grow
                </p>
              </div>
              <Button 
                onClick={handleStartToday}
                className="gap-2 gradient-primary text-primary-foreground shadow-glow"
              >
                <PenTool className="w-4 h-4" />
                {todayEntry ? "Continue Writing" : "Write Today's Entry"}
              </Button>
              {moodAnalytics.moodByDay.length >= 3 && (
                <Button
                  variant="outline"
                  onClick={() => setShowMoodInsights(!showMoodInsights)}
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  {showMoodInsights ? 'Hide Insights' : 'Mood Insights'}
                </Button>
              )}
            </div>

            {/* Today's Entry Preview */}
            {todayEntry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-5 shadow-md border border-border/50 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handleStartToday}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Today's Entry</h3>
                  <span className="text-xs text-muted-foreground">
                    {todayEntry.content.split(/\s+/).filter(w => w.length > 0).length} words
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-3" style={{ fontFamily: "'Georgia', serif" }}>
                  {todayEntry.content || 'Start writing your thoughts...'}
                </p>
                {todayEntry.mood && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Feeling: {todayEntry.mood}
                    </span>
                    {todayEntry.sentiment && !todayEntry.manualMood && (
                      <span className="text-xs text-muted-foreground/70">(auto-detected)</span>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Mood Insights Panel */}
            <AnimatePresence>
              {showMoodInsights && moodAnalytics.moodByDay.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <MoodInsights analytics={moodAnalytics} habitCorrelation={habitCorrelation} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <JournalCalendar
                monthEntries={monthEntries}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onMonthChange={setCurrentMonth}
                onDateSelect={handleDateSelect}
              />

              {/* Insights */}
              <JournalInsights
                stats={stats}
                moodTrend={moodTrend}
                habits={{ completed: todayProgress.completedCount, total: todayProgress.totalCount }}
              />
            </div>

            {/* Recent Entries */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Entries</h2>
              
              {entries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-2xl border border-border/50"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <PenTool className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No entries yet</h3>
                  <p className="text-muted-foreground max-w-sm mb-4">
                    Start your journaling journey today. Write your thoughts, track your mood, and reflect on your growth.
                  </p>
                  <Button onClick={handleStartToday} className="gap-2 gradient-primary text-primary-foreground">
                    <Plus className="w-4 h-4" />
                    Write First Entry
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {entries
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 6)
                    .map((entry, index) => (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleDateSelect(entry.date)}
                        className="text-left bg-card rounded-xl p-4 shadow-sm border border-border/50 hover:shadow-md hover:border-border transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">
                            {format(new Date(entry.date), 'MMM d, yyyy')}
                          </span>
                          {entry.mood && (
                            <span className="text-lg">{entry.mood === 'great' ? '😊' : entry.mood === 'good' ? '🙂' : entry.mood === 'okay' ? '😐' : entry.mood === 'low' ? '😔' : '😢'}</span>
                          )}
                          {!entry.mood && entry.sentiment && (
                            <span className="text-lg">{getSentimentEmoji(entry.sentiment.label)}</span>
                          )}
                        </div>
                        <p 
                          className="text-sm text-muted-foreground line-clamp-2"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {entry.content || 'Empty entry'}
                        </p>
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <span className="text-xs text-muted-foreground">
                            {entry.content.split(/\s+/).filter(w => w.length > 0).length} words
                          </span>
                        </div>
                      </motion.button>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
