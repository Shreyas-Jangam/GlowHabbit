import { motion } from 'framer-motion';
import { X, Check, ArrowRight, Zap } from 'lucide-react';

const PROBLEMS = [
  'Inconsistent habits that never stick',
  'Lack of discipline and follow-through',
  'Overthinking instead of taking action',
  'No clarity across health, career, mind, and money',
  'Using 5+ apps that don\'t talk to each other',
];

const SOLUTIONS = [
  'One unified system for everything',
  'Habits, routines, journaling, goals',
  'Discipline tracking that actually works',
  'Deep work mode for real focus',
  'Life balance dashboard for clarity',
];

export function ProblemSolutionSection() {
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop Juggling. Start Growing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop using 5 apps. Start using 1 system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-destructive/5 rounded-3xl blur-xl" />
            <div className="relative p-6 sm:p-8 rounded-2xl border border-destructive/20 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">The Problem</h3>
              </div>
              <ul className="space-y-4">
                {PROBLEMS.map((problem, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{problem}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl" />
            <div className="relative p-6 sm:p-8 rounded-2xl border border-primary/20 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">The Solution</h3>
              </div>
              <ul className="space-y-4">
                {SOLUTIONS.map((solution, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{solution}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Arrow connector for desktop */}
        <div className="hidden md:flex justify-center -mt-32 mb-32 relative z-10">
          <div className="w-16 h-16 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
