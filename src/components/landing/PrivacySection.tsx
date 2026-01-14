import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Heart, Database, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIVACY_FEATURES = [
  { icon: Lock, label: 'Journals are Private', description: 'Your thoughts stay yours' },
  { icon: Eye, label: 'Optional Passcode', description: 'Biometric lock support' },
  { icon: UserX, label: 'No Social Pressure', description: 'No public profiles or feeds' },
  { icon: Heart, label: 'No Shame Design', description: 'Encouraging, not punishing' },
  { icon: Database, label: 'Your Data, Your Control', description: 'Export or delete anytime' },
  { icon: Shield, label: 'Local-First Storage', description: 'Data stays on your device' },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Privacy & Trust
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Growth Journey, Completely Private
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe personal growth is personal. No social feeds, no public profiles, 
            no judgment. Just you and your progress.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIVACY_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.label}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
