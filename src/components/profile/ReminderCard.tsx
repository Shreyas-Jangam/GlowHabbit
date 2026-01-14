import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Settings } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { cn } from '@/lib/utils';

interface ReminderCardProps {
  onOpenNotificationSettings?: () => void;
}

export function ReminderCard({ onOpenNotificationSettings }: ReminderCardProps) {
  const { profile, updatePreferences } = useProfile();
  const { permissionStatus, settings } = useNotificationSettings();

  const isEnabled = profile.preferences.reminderEnabled && permissionStatus === 'granted';
  const isBlocked = permissionStatus === 'denied';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bell className="w-4 h-4 text-accent" />
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Main Toggle */}
          <div className={cn(
            "flex items-center justify-between p-3 rounded-xl",
            isBlocked ? "bg-destructive/10" : "bg-secondary/30"
          )}>
            <div className="flex items-center gap-3">
              {isBlocked ? (
                <BellOff className="w-4 h-4 text-destructive" />
              ) : (
                <Bell className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isBlocked ? 'Notifications Blocked' : 'Push Notifications'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isBlocked 
                    ? 'Enable in browser settings' 
                    : isEnabled 
                      ? 'Receiving reminders'
                      : 'Turn on for reminders'
                  }
                </p>
              </div>
            </div>
            {!isBlocked && (
              <Switch
                checked={profile.preferences.reminderEnabled}
                onCheckedChange={(checked) => updatePreferences({ reminderEnabled: checked })}
              />
            )}
          </div>

          {/* Quick Stats */}
          {!isBlocked && isEnabled && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-secondary/20">
                <p className="text-sm font-medium">
                  {settings.categories.habits ? '✓' : '○'} Habits
                </p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/20">
                <p className="text-sm font-medium">
                  {settings.categories.routines ? '✓' : '○'} Routines
                </p>
              </div>
            </div>
          )}

          {/* Settings Button */}
          {onOpenNotificationSettings && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={onOpenNotificationSettings}
            >
              <Settings className="w-4 h-4" />
              Notification Settings
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
