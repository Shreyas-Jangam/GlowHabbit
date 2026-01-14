import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Sunrise, Moon, Target, Brain, Sparkles } from 'lucide-react';
import { LogoIcon } from '@/components/brand/Logo';

const HERO_FEATURES = [
  'Habits & Routines',
  'Journaling & Mood',
  'Goals & Life Balance',
  'Deep Work & Focus',
];

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Your Personal Growth Command Center
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="block text-foreground">Build Discipline.</span>
            <span className="block text-foreground">Track Habits.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Master Your Life.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            An all-in-one habit, routine, journal, and life-planning system 
            designed for focus, balance, and consistency.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {HERO_FEATURES.map((feature, i) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 text-sm font-medium"
              >
                <Check className="w-4 h-4 text-primary" />
                {feature}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 text-lg px-8 h-14 group">
                Start Building Better Days
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 h-14 border-2">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Free forever • No credit card required • Your data stays private
          </motion.p>
        </div>

        {/* Hero Visual - App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-20 relative"
        >
          {/* Dashboard Mockup */}
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Mock Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-secondary/50 text-xs text-muted-foreground">
                    glowhabit.app
                  </div>
                </div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Morning Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <Sunrise className="w-8 h-8 text-amber-500 mb-3" />
                  <p className="text-sm font-medium">Morning</p>
                  <p className="text-xs text-muted-foreground">6 habits</p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
                
                {/* Focus Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <Target className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-sm font-medium">Focus</p>
                  <p className="text-xs text-muted-foreground">2h 30m</p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
                
                {/* Mind Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                  <Brain className="w-8 h-8 text-violet-500 mb-3" />
                  <p className="text-sm font-medium">Journal</p>
                  <p className="text-xs text-muted-foreground">Day 14</p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                  </div>
                </div>
                
                {/* Night Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
                  <Moon className="w-8 h-8 text-indigo-500 mb-3" />
                  <p className="text-sm font-medium">Night</p>
                  <p className="text-xs text-muted-foreground">5 habits</p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
