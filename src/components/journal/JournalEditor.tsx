import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Maximize2, Minimize2, Sparkles, X, Check, Brain, Info } from 'lucide-react';
import { JournalEntry, MOOD_CONFIG, JOURNAL_PROMPTS, SentimentData } from '@/types/journal';
import { analyzeSentiment, getSentimentEmoji, EMOTION_CONFIG, EmotionTag } from '@/utils/sentimentAnalysis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface JournalEditorProps {
  date: string;
  initialContent: string;
  initialMood?: JournalEntry['mood'];
  initialSentiment?: SentimentData;
  habitsSummary?: JournalEntry['habitsSummary'];
  sentimentEnabled?: boolean;
  onSave: (content: string, mood?: JournalEntry['mood'], manualMood?: boolean) => void;
  onClose?: () => void;
}

export function JournalEditor({ 
  date, 
  initialContent, 
  initialMood,
  initialSentiment,
  habitsSummary,
  sentimentEnabled = true,
  onSave,
  onClose 
}: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<JournalEntry['mood'] | undefined>(initialMood);
  const [manualMood, setManualMood] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showPrompt, setShowPrompt] = useState(!initialContent);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [liveSentiment, setLiveSentiment] = useState(initialSentiment);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const sentimentTimeoutRef = useRef<NodeJS.Timeout>();

  // Get daily prompt based on date
  useEffect(() => {
    const dayOfYear = Math.floor((new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const promptIndex = dayOfYear % JOURNAL_PROMPTS.length;
    setCurrentPrompt(JOURNAL_PROMPTS[promptIndex]);
  }, [date]);

  // Live sentiment analysis with debounce
  useEffect(() => {
    if (!sentimentEnabled || content.trim().length < 20) {
      setLiveSentiment(undefined);
      return;
    }

    if (sentimentTimeoutRef.current) {
      clearTimeout(sentimentTimeoutRef.current);
    }

    sentimentTimeoutRef.current = setTimeout(() => {
      const result = analyzeSentiment(content);
      setLiveSentiment({
        score: result.score,
        label: result.label,
        confidence: result.confidence,
        emotions: result.emotions,
        analyzedAt: new Date().toISOString(),
      });
    }, 500);

    return () => {
      if (sentimentTimeoutRef.current) {
        clearTimeout(sentimentTimeoutRef.current);
      }
    };
  }, [content, sentimentEnabled]);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (content.trim() || mood) {
        onSave(content, mood, manualMood);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, mood, manualMood, onSave]);

  const handleMoodSelect = (m: JournalEntry['mood']) => {
    setMood(m);
    setManualMood(true);
  };

  const handleUsePrompt = () => {
    const newContent = content ? `${content}\n\n${currentPrompt}\n` : `${currentPrompt}\n`;
    setContent(newContent);
    setShowPrompt(false);
    textareaRef.current?.focus();
  };

  const isToday = date === format(new Date(), 'yyyy-MM-dd');

  const getSentimentBadgeColor = (label: string) => {
    switch (label) {
      case 'positive': return 'bg-success/15 text-success border-success/30';
      case 'negative': return 'bg-warning/15 text-warning border-warning/30';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "relative",
        isFocusMode && "fixed inset-0 z-50 bg-background p-4 md:p-8"
      )}
    >
      <div className={cn(
        "bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden",
        isFocusMode ? "h-full flex flex-col max-w-4xl mx-auto" : ""
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/30">
          <div>
            <h2 className="font-semibold text-foreground">
              {isToday ? "Today's Entry" : format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {content.split(/\s+/).filter(w => w.length > 0).length} words
              {content && ' • Auto-saved'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="h-8 w-8"
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {/* Live Sentiment Indicator */}
        <AnimatePresence>
          {sentimentEnabled && liveSentiment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 bg-secondary/10 border-b border-border/30"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Auto-detected:</span>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        getSentimentBadgeColor(liveSentiment.label)
                      )}>
                        <span>{getSentimentEmoji(liveSentiment.label)}</span>
                        <span className="capitalize">{liveSentiment.label}</span>
                        <span className="opacity-60">({liveSentiment.score > 0 ? '+' : ''}{liveSentiment.score})</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sentiment score: {liveSentiment.score} ({liveSentiment.confidence} confidence)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {liveSentiment.emotions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {liveSentiment.emotions.slice(0, 3).map(emotion => {
                      const config = EMOTION_CONFIG[emotion];
                      return (
                        <TooltipProvider key={emotion}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-base cursor-help">{config.emoji}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{config.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Sentiment is analyzed privately in your browser. You can override by selecting a mood manually.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits Summary */}
        {habitsSummary && habitsSummary.completed > 0 && (
          <div className="px-4 py-3 bg-success/5 border-b border-success/20">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-success" />
              <span className="text-success font-medium">
                {habitsSummary.completed}/{habitsSummary.total} habits completed
              </span>
              <span className="text-muted-foreground">
                ({habitsSummary.habits.slice(0, 3).join(', ')}{habitsSummary.habits.length > 3 ? '...' : ''})
              </span>
            </div>
          </div>
        )}

        {/* Daily Prompt */}
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary/5 border-b border-primary/20"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Today's Prompt</p>
                <p className="text-sm text-muted-foreground italic">"{currentPrompt}"</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPrompt(false)}
                  className="text-xs"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={handleUsePrompt}
                  className="text-xs gradient-primary text-primary-foreground"
                >
                  Use Prompt
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Editor */}
        <div className={cn("p-4", isFocusMode && "flex-1")}>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className={cn(
              "w-full resize-none border-0 bg-transparent focus-visible:ring-0 text-base leading-relaxed placeholder:text-muted-foreground/50",
              "font-serif",
              isFocusMode ? "h-full min-h-[60vh]" : "min-h-[300px]"
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          />
        </div>

        {/* Footer with quick prompts */}
        <div className="p-4 border-t border-border/30 bg-secondary/10">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-2">Quick prompts:</span>
            {JOURNAL_PROMPTS.slice(0, 4).map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  const newContent = content ? `${content}\n\n${prompt}\n` : `${prompt}\n`;
                  setContent(newContent);
                  textareaRef.current?.focus();
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
