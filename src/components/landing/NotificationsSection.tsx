import { motion } from 'framer-motion';
import { Bell, Sunrise, Moon, Timer, VolumeX, Smartphone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const NOTIFICATION_FEATURES = [
  { icon: Sunrise, label: 'Morning Routine', time: '6:00 AM', active: true },
  { icon: Timer, label: 'Deep Work Session', time: '9:00 AM', active: true },
  { icon: Bell, label: 'Habit Reminder', time: '2:00 PM', active: false },
  { icon: Moon, label: 'Night Routine', time: '9:00 PM', active: true },
];

export function NotificationsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-2xl" />
            <div className="relative p-6 rounded-2xl border border-border/50 bg-card">
              <div className="space-y-3">
                {NOTIFICATION_FEATURES.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      item.active 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-secondary/30 border-border/50 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        item.active ? "bg-primary/10" : "bg-muted"
                      )}>
                        <item.icon className={cn(
                          "w-5 h-5",
                          item.active ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full p-1 transition-colors",
                      item.active ? "bg-primary" : "bg-muted"
                    )}>
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform",
                        item.active ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quiet Hours Badge */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <VolumeX className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Quiet Hours Active</p>
                  <p className="text-xs text-muted-foreground">10 PM - 7 AM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <Bell className="w-4 h-4" />
              Smart Notifications
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Reminders That Respect Your Focus
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Context-aware notifications that know when to nudge and when to stay quiet. 
              Works on both web and mobile.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Smartphone, label: 'Works on APK & Web', description: 'Cross-platform notifications' },
                { icon: Bell, label: 'Context-Aware', description: 'Smart suppression for completed tasks' },
                { icon: VolumeX, label: 'Quiet Hours & Monk Mode', description: 'Respect your focus time' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
