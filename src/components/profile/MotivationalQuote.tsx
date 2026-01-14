import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const QUOTES = [
  "Progress, not pressure.",
  "Small steps create big change.",
  "Every moment is a fresh start.",
  "Be gentle with yourself.",
  "Growth happens in quiet moments.",
  "You are exactly where you need to be.",
  "Trust the process, embrace the journey.",
  "Consistency is kindness to your future self.",
];

export function MotivationalQuote() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Get a quote based on the day to keep it consistent
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-8 mb-4"
    >
      <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-calm-lavender/20 via-calm-mist/20 to-calm-sage/20 border border-border/30">
        <Leaf className="h-5 w-5 text-calm-sage-foreground flex-shrink-0" />
        <p className="text-center text-muted-foreground font-medium italic">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
}
