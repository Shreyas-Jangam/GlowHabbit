import { motion } from 'framer-motion';
import { 
  Sunrise, Moon, Calendar, Flame, PenTool, Brain, 
  Target, Heart, Briefcase, Users, Timer, FolderKanban,
  Wallet, TrendingUp, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  iconColor: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, features, gradient, iconColor, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className={cn("absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity", gradient)} />
      <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", gradient.replace('bg-gradient', 'bg-gradient').replace('/20', '/10'))}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: Sunrise,
    title: 'Daily Routines',
    description: 'Morning & night routines with skin care',
    features: ['One-tap completion', 'Routine analytics', 'Skin care tracking', 'Custom templates'],
    gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-500',
  },
  {
    icon: Calendar,
    title: 'Habit Tracker',
    description: '31-day grid with streaks and progress',
    features: ['Visual habit grid', 'Streak tracking', 'Discipline habits', 'Unlimited habits'],
    gradient: 'bg-gradient-to-br from-primary/20 to-emerald-500/20',
    iconColor: 'text-primary',
  },
  {
    icon: PenTool,
    title: 'Journaling + Mood',
    description: 'Daily reflection with sentiment analysis',
    features: ['Auto mood detection', 'Emotion trends', 'Habit correlation', 'Private & secure'],
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
  },
  {
    icon: Target,
    title: 'Goals & Life Planning',
    description: 'Long-term goals aligned with daily habits',
    features: ['Life areas dashboard', 'Balance scoring', 'Progress tracking', 'Achievement system'],
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Timer,
    title: 'Deep Work & Projects',
    description: 'Focus sessions with project tracking',
    features: ['Focus timer', 'Project execution', 'Distraction-free mode', 'Session analytics'],
    gradient: 'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-500',
  },
  {
    icon: Wallet,
    title: 'Budget Awareness',
    description: 'Simple financial discipline tracking',
    features: ['Daily tracking', 'Spending streaks', 'Stress correlation', 'Budget goals'],
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six powerful modules working together to transform your daily life
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
          ))}
        </div>

        {/* Life Areas Mini Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-6 sm:p-8 rounded-2xl border border-border/50 bg-card"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Life Balance Dashboard</h3>
            <p className="text-muted-foreground">Track progress across all four life areas</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Heart, label: 'Health', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: Briefcase, label: 'Career', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { icon: Brain, label: 'Mind', color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { icon: Users, label: 'Relationships', color: 'text-rose-500', bg: 'bg-rose-500/10' },
            ].map((area) => (
              <div key={area.label} className="text-center p-4 rounded-xl bg-secondary/50">
                <div className={cn("w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center", area.bg)}>
                  <area.icon className={cn("w-6 h-6", area.color)} />
                </div>
                <p className="font-medium">{area.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
