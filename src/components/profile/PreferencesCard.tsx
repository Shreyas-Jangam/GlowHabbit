import { motion } from 'framer-motion';
import { Sun, Moon, Leaf, Bell, Eye, EyeOff, Mail, Lock, LogOut, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/hooks/useProfile';

interface PreferencesCardProps {
  preferences: UserProfile['preferences'];
  onUpdatePreferences: (updates: Partial<UserProfile['preferences']>) => void;
  onLogout?: () => void;
}

export function PreferencesCard({ preferences, onUpdatePreferences, onLogout }: PreferencesCardProps) {
  const appearanceModes = [
    { 
      id: 'light' as const, 
      icon: Sun, 
      label: 'Light',
      description: 'Bright and clear',
      preview: {
        bg: 'bg-white',
        accent: 'bg-primary/20',
        text: 'bg-foreground/60'
      }
    },
    { 
      id: 'dark' as const, 
      icon: Moon, 
      label: 'Dark',
      description: 'Easy on the eyes',
      preview: {
        bg: 'bg-slate-900',
        accent: 'bg-emerald-500/30',
        text: 'bg-slate-400'
      }
    },
    { 
      id: 'calm' as const, 
      icon: Cloud, 
      label: 'Calm',
      description: 'Soothing & mindful',
      preview: {
        bg: 'bg-gradient-to-br from-[hsl(270,50%,92%)] via-[hsl(200,40%,93%)] to-[hsl(140,30%,92%)]',
        accent: 'bg-[hsl(270,45%,75%)]/40',
        text: 'bg-[hsl(220,20%,50%)]'
      }
    },
  ];

  const handleAppearanceChange = (mode: 'light' | 'dark' | 'calm') => {
    onUpdatePreferences({ appearance: mode });
    
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'calm');
    
    // Apply theme
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'calm') {
      document.documentElement.classList.add('calm');
    }
    
    localStorage.setItem('theme', mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Appearance</p>
            <div className="grid grid-cols-3 gap-3">
              {appearanceModes.map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                    preferences.appearance === mode.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  )}
                  onClick={() => handleAppearanceChange(mode.id)}
                >
                  {/* Preview Card */}
                  <div className={cn(
                    "w-full h-14 rounded-lg overflow-hidden p-2 flex flex-col gap-1",
                    mode.preview.bg
                  )}>
                    <div className={cn("w-6 h-1.5 rounded-full", mode.preview.accent)} />
                    <div className={cn("w-10 h-1 rounded-full opacity-40", mode.preview.text)} />
                    <div className={cn("w-8 h-1 rounded-full opacity-30", mode.preview.text)} />
                  </div>
                  
                  {/* Icon and Label */}
                  <div className="flex items-center gap-1.5">
                    <mode.icon className={cn(
                      "h-3.5 w-3.5",
                      preferences.appearance === mode.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      preferences.appearance === mode.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {mode.label}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <span className="text-[10px] text-muted-foreground leading-tight text-center">
                    {mode.description}
                  </span>

                  {/* Selected indicator */}
                  {preferences.appearance === mode.id && (
                    <motion.div
                      layoutId="appearance-indicator"
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Leaf className="w-2.5 h-2.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Calm Mode Special Note */}
            {preferences.appearance === 'calm' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg bg-calm-lavender/20 border border-calm-lavender/30"
              >
                <div className="flex items-start gap-2">
                  <Cloud className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    A soothing, mindful theme designed to reduce stress. Enjoy soft pastels, gentle gradients, and peaceful colors.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-calm-lavender/30">
                <Bell className="h-4 w-4 text-calm-lavender-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Reminders</p>
                <p className="text-xs text-muted-foreground">Get gentle nudges</p>
              </div>
            </div>
            <Switch
              checked={preferences.reminderEnabled}
              onCheckedChange={(checked) => onUpdatePreferences({ reminderEnabled: checked })}
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-calm-mist/30">
                {preferences.statsPrivate ? (
                  <EyeOff className="h-4 w-4 text-calm-mist-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-calm-mist-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Private Stats</p>
                <p className="text-xs text-muted-foreground">Hide your progress from others</p>
              </div>
            </div>
            <Switch
              checked={preferences.statsPrivate}
              onCheckedChange={(checked) => onUpdatePreferences({ statsPrivate: checked })}
            />
          </div>

          <Separator className="bg-border/50" />

          {/* Account Management */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Account</p>
            <Button variant="outline" className="w-full justify-start gap-3 border-border/50 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" />
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-border/50 text-muted-foreground hover:text-foreground">
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
            {onLogout && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-calm-peach/50 text-calm-peach-foreground hover:bg-calm-peach/10"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
