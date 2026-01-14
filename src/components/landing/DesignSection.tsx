import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Leaf, Smartphone, Monitor, Tablet, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesignSection() {
  return (
    <section className="py-20 sm:py-28">
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
              <Palette className="w-4 h-4" />
              Design & Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for Daily Use. Designed for Calm.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              A clean, minimal interface that doesn't overwhelm. 
              No learning curve—just open and start building better days.
            </p>
            
            {/* Theme Options */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-4">Three beautiful themes</p>
              <div className="flex gap-4">
                {[
                  { icon: Sun, label: 'Light', bg: 'bg-[hsl(150,20%,98%)]', border: 'border-[hsl(150,15%,88%)]' },
                  { icon: Moon, label: 'Dark', bg: 'bg-[hsl(160,30%,6%)]', border: 'border-[hsl(160,20%,18%)]' },
                  { icon: Leaf, label: 'Calm', bg: 'bg-[hsl(200,30%,97%)]', border: 'border-[hsl(220,20%,90%)]' },
                ].map((theme) => (
                  <motion.div
                    key={theme.label}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1"
                  >
                    <div className={cn("aspect-video rounded-lg mb-2 flex items-center justify-center border", theme.bg, theme.border)}>
                      <theme.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-center font-medium">{theme.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Device Support */}
            <div className="flex items-center gap-6">
              {[
                { icon: Smartphone, label: 'Mobile' },
                { icon: Tablet, label: 'Tablet' },
                { icon: Monitor, label: 'Desktop' },
              ].map((device) => (
                <div key={device.label} className="flex items-center gap-2 text-muted-foreground">
                  <device.icon className="w-5 h-5" />
                  <span className="text-sm">{device.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual - Device Mockups */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl" />
            
            {/* Desktop Frame */}
            <div className="relative bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-secondary/30">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="p-6 space-y-4">
                {/* Mock UI Elements */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-foreground/20 rounded" />
                    <div className="h-3 w-24 bg-muted-foreground/20 rounded mt-2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                      <div className="h-3 w-16 bg-foreground/20 rounded" />
                      <div className="h-2 w-12 bg-muted-foreground/20 rounded mt-2" />
                    </div>
                  ))}
                </div>
                
                <div className="h-24 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                  <div className="h-3 w-24 bg-foreground/20 rounded mb-3" />
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 rounded bg-primary/30"
                        style={{ height: `${30 + Math.random() * 40}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Frame - Overlapping */}
            <div className="absolute -bottom-4 -right-4 w-32 sm:w-40 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="h-4 bg-secondary/30 flex justify-center items-center">
                <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="p-3 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-primary/20" />
                <div className="h-2 w-full bg-foreground/20 rounded" />
                <div className="h-2 w-3/4 bg-muted-foreground/20 rounded" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-8 rounded bg-secondary/50" />
                  <div className="h-8 rounded bg-secondary/50" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
