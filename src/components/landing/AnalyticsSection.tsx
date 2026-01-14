import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Brain, Activity, PieChart, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const ANALYTICS_ITEMS = [
  { icon: BarChart3, label: 'Habit Analytics', description: 'Completion rates & patterns' },
  { icon: Activity, label: 'Routine Analytics', description: 'Consistency & timing' },
  { icon: Brain, label: 'Mood Insights', description: 'Sentiment trends & triggers' },
  { icon: LineChart, label: 'Deep Work Reports', description: 'Focus time & productivity' },
  { icon: PieChart, label: 'Life Balance Radar', description: 'Visual balance scoring' },
  { icon: TrendingUp, label: 'Progress Over Time', description: 'Weekly & monthly views' },
];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Analytics & Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See Patterns. Fix Leaks. Improve Daily.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Beautiful, actionable analytics that help you understand your behavior 
              and make better decisions every day.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {ANALYTICS_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative p-6 rounded-2xl border border-border/50 bg-card">
              {/* Mock Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Weekly Progress</h4>
                  <span className="text-sm text-primary font-medium">+12%</span>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={cn(
                        "flex-1 rounded-t-lg",
                        i === 5 ? "bg-gradient-to-t from-primary to-primary/60" : "bg-primary/20"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Mock Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Completion', value: '87%' },
                  { label: 'Streak', value: '14 days' },
                  { label: 'Stability', value: '92%' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="text-lg font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
