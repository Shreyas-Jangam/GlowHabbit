import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Palette, Rocket, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const AUDIENCES = [
  { 
    icon: GraduationCap, 
    label: 'Students', 
    description: 'Build study habits, track assignments, balance academics and personal growth',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  { 
    icon: Briefcase, 
    label: 'Professionals', 
    description: 'Master productivity, deep work, and work-life balance in one system',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  { 
    icon: Palette, 
    label: 'Creators', 
    description: 'Track creative projects, build consistent practice habits, stay inspired',
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
  },
  { 
    icon: Rocket, 
    label: 'Entrepreneurs', 
    description: 'Execute on goals, maintain discipline, and track business alongside health',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-500',
  },
];

export function AudienceSection() {
  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <User className="w-4 h-4" />
            Who It's For
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built for Anyone Building Discipline & Clarity
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're studying, creating, or building a business—GlowHabit adapts to your life.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCES.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="group relative"
            >
              <div className={cn("absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br", audience.gradient)} />
              <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors text-center">
                <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center", audience.gradient)}>
                  <audience.icon className={cn("w-8 h-8", audience.iconColor)} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{audience.label}</h3>
                <p className="text-sm text-muted-foreground">{audience.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* General Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground">
            And anyone else who wants to{' '}
            <span className="text-foreground font-medium">
              build better habits, track their growth, and live with more intention
            </span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
