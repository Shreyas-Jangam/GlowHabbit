import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Pencil, Check, X, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useIntentions } from '@/hooks/useIntentions';
import { cn } from '@/lib/utils';

const INTENTION_PROMPTS = [
  "What's your focus this month?",
  "What matters most to you right now?",
  "What do you want to cultivate?",
  "What intention guides your days?",
];

export function IntentionCard() {
  const { getCurrentIntention, setMonthlyIntention, isLoaded } = useIntentions();
  const [isEditing, setIsEditing] = useState(false);
  const [intention, setIntention] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  const currentIntention = getCurrentIntention();
  const randomPrompt = INTENTION_PROMPTS[new Date().getDate() % INTENTION_PROMPTS.length];

  const handleEdit = () => {
    setIntention(currentIntention?.intention || '');
    setPersonalNote(currentIntention?.personalNote || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (intention.trim()) {
      setMonthlyIntention(intention.trim(), personalNote.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIntention('');
    setPersonalNote('');
  };

  if (!isLoaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-card to-accent/5">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50" />
        
        <CardContent className="relative p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Set Your Intention</span>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="My intention for this month..."
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    maxLength={100}
                  />
                  <Textarea
                    placeholder="Personal note (optional) - e.g., 'I want peace, not perfection'"
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[60px] resize-none"
                    maxLength={200}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!intention.trim()}
                    className="gap-1.5 gradient-primary text-primary-foreground"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </Button>
                </div>
              </motion.div>
            ) : currentIntention ? (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Monthly Intention
                      </span>
                    </div>
                    
                    <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                      {currentIntention.intention}
                    </p>
                    
                    {currentIntention.personalNote && (
                      <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30">
                        <Quote className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          {currentIntention.personalNote}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="h-8 w-8 flex-shrink-0 hover:bg-primary/10"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-2"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {randomPrompt}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Set Intention
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
