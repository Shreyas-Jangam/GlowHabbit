import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sun, Moon, Leaf } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

type AppearanceMode = 'light' | 'dark' | 'calm';

interface ThemeOption {
  id: AppearanceMode;
  name: string;
  icon: React.ElementType;
  description: string;
  preview: {
    bg: string;
    accent: string;
    text: string;
  };
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    description: 'Clean & bright',
    preview: {
      bg: 'bg-[hsl(150,20%,98%)]',
      accent: 'bg-[hsl(160,84%,39%)]',
      text: 'text-[hsl(160,30%,12%)]',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    description: 'Easy on eyes',
    preview: {
      bg: 'bg-[hsl(160,30%,6%)]',
      accent: 'bg-[hsl(160,80%,45%)]',
      text: 'text-[hsl(150,20%,96%)]',
    },
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: Leaf,
    description: 'Soft pastels',
    preview: {
      bg: 'bg-[hsl(200,30%,97%)]',
      accent: 'bg-[hsl(270,45%,65%)]',
      text: 'text-[hsl(220,20%,25%)]',
    },
  },
];

export function ThemeCard() {
  const { profile, updatePreferences, applyTheme } = useProfile();

  const handleThemeChange = (theme: AppearanceMode) => {
    updatePreferences({ appearance: theme });
    applyTheme(theme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Palette className="w-4 h-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((theme) => {
              const isActive = profile.preferences.appearance === theme.id;
              const Icon = theme.icon;

              return (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(theme.id)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                    isActive
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border/50 bg-secondary/30 hover:border-primary/50"
                  )}
                >
                  {/* Theme Preview */}
                  <div className={cn(
                    "w-full aspect-video rounded-lg mb-2 overflow-hidden flex items-center justify-center",
                    theme.preview.bg
                  )}>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", theme.preview.accent)} />
                      <div className={cn("w-6 h-1 rounded-full", theme.preview.accent, "opacity-50")} />
                    </div>
                  </div>
                  
                  <Icon className={cn(
                    "w-4 h-4 mb-1",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {theme.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
