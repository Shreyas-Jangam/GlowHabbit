import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Moon, 
  Sun, 
  Calendar,
  Target,
  BookOpen,
  Wallet,
  Sparkles,
  Flame,
  BarChart3,
  Shield,
  Clock,
  Volume2,
  VolumeX,
  Check,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { NotificationCategory } from '@/types/notification';
import notificationService from '@/services/NotificationService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryConfig {
  id: NotificationCategory;
  label: string;
  description: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'habits', label: 'Habits', description: 'Habit reminders & completion', icon: Target },
  { id: 'routines', label: 'Routines', description: 'Morning & night routines', icon: Sun },
  { id: 'skincare', label: 'Skin Care', description: 'AM/PM skincare reminders', icon: Sparkles },
  { id: 'deepwork', label: 'Deep Work', description: 'Focus session alerts', icon: Flame },
  { id: 'journal', label: 'Journal', description: 'Daily reflection reminders', icon: BookOpen },
  { id: 'budget', label: 'Budget', description: 'Expense & savings alerts', icon: Wallet },
  { id: 'discipline', label: 'Discipline', description: 'Gentle self-control reminders', icon: Shield },
  { id: 'streaks', label: 'Streaks', description: 'Milestone celebrations', icon: Flame },
  { id: 'insights', label: 'Insights', description: 'Weekly & monthly reports', icon: BarChart3 },
];

export function NotificationSettingsPanel() {
  const { toast } = useToast();
  const {
    settings,
    permissionStatus,
    requestPermission,
    recheckPermission,
    updateSettings,
    toggleCategory,
    toggleGlobal,
    setQuietHours,
    resetToDefaults,
  } = useNotificationSettings();

  const [isInitializing, setIsInitializing] = useState(false);

  const handleEnableNotifications = async () => {
    setIsInitializing(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        toggleGlobal(true);
        notificationService.scheduleDailyReminders(settings);
        toast({
          title: 'Notifications enabled',
          description: 'You\'ll receive helpful reminders throughout the day.',
        });
      } else {
        toast({
          title: 'Permission denied',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCheckAgain = () => {
    const newStatus = recheckPermission();
    if (newStatus === 'granted') {
      toggleGlobal(true);
      toast({
        title: 'Notifications enabled!',
        description: 'Your browser permissions have been updated.',
      });
    } else if (newStatus === 'denied') {
      toast({
        title: 'Still blocked',
        description: 'Please check your browser settings and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTestNotification = async () => {
    await notificationService.sendNotification(
      {
        id: 'test',
        title: 'Test Notification',
        body: 'Notifications are working! 🎉',
        category: 'habits',
      },
      settings
    );
  };

  // Reschedule notifications when settings change
  useEffect(() => {
    if (settings.enabled && permissionStatus === 'granted') {
      notificationService.scheduleDailyReminders(settings);
    }
  }, [settings, permissionStatus]);

  return (
    <div className="space-y-6">
      {/* Header & Global Toggle */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Smart, non-intrusive reminders</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {permissionStatus === 'granted' ? (
                <Badge variant="outline" className="text-calm-sage border-calm-sage/30 bg-calm-sage/10">
                  <Check className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : permissionStatus === 'denied' ? (
                <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Blocked
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Not Set
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {permissionStatus === 'denied' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="font-medium text-foreground mb-2">Notifications are blocked</p>
                <p className="text-sm text-muted-foreground mb-3">
                  To enable notifications, please update your browser settings:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mb-4">
                  <li>Click the lock/info icon in your browser's address bar</li>
                  <li>Find "Notifications" and change to "Allow"</li>
                  <li>Click "Check Again" below</li>
                </ol>
                <Button
                  onClick={handleCheckAgain}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Check Again
                </Button>
              </div>
            </div>
          ) : permissionStatus !== 'granted' ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">Enable push notifications</p>
                <p className="text-sm text-muted-foreground">Get timely reminders for your habits and routines</p>
              </div>
              <Button
                onClick={handleEnableNotifications}
                disabled={isInitializing}
                className="bg-gradient-to-r from-calm-lavender to-calm-sage text-white"
              >
                {isInitializing ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.enabled ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <Label className="text-base">All Notifications</Label>
                  <p className="text-sm text-muted-foreground">Master toggle for all alerts</p>
                </div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={toggleGlobal}
              />
            </div>
          )}

          {settings.enabled && permissionStatus === 'granted' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleTestNotification}>
                Test Notification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-calm-lavender/10">
                    <Moon className="w-5 h-5 text-calm-lavender" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quiet Hours</CardTitle>
                    <CardDescription>Pause notifications during rest time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Quiet Hours</Label>
                  <Switch
                    checked={settings.quietHoursEnabled}
                    onCheckedChange={(enabled) => 
                      setQuietHours(settings.quietHoursStart, settings.quietHoursEnd, enabled)
                    }
                  />
                </div>

                {settings.quietHoursEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Start</Label>
                      <Input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) => 
                          setQuietHours(e.target.value, settings.quietHoursEnd, true)
                        }
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">End</Label>
                      <Input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) => 
                          setQuietHours(settings.quietHoursStart, e.target.value, true)
                        }
                        className="bg-background/50"
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Timing */}
      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-calm-sage/10">
                    <Clock className="w-5 h-5 text-calm-sage" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Reminder Times</CardTitle>
                    <CardDescription>Customize when you receive reminders</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Sun className="w-4 h-4 text-amber-500" />
                      Morning Routine
                    </Label>
                    <Input
                      type="time"
                      value={settings.morningRoutineTime}
                      onChange={(e) => updateSettings({ morningRoutineTime: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      Night Routine
                    </Label>
                    <Input
                      type="time"
                      value={settings.nightRoutineTime}
                      onChange={(e) => updateSettings({ nightRoutineTime: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-calm-lavender" />
                      Journal Reminder
                    </Label>
                    <Input
                      type="time"
                      value={settings.journalReminderTime}
                      onChange={(e) => updateSettings({ journalReminderTime: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      Budget Check
                    </Label>
                    <Input
                      type="time"
                      value={settings.budgetCheckTime}
                      onChange={(e) => updateSettings({ budgetCheckTime: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Toggles */}
      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Notification Categories</CardTitle>
                    <CardDescription>Choose what you want to be reminded about</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CATEGORIES.map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <category.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">{category.label}</Label>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.categories[category.id]}
                        onCheckedChange={(checked) => toggleCategory(category.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Suppression */}
      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <VolumeX className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Smart Suppression</CardTitle>
                    <CardDescription>Intelligent notification management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Skip completed items</Label>
                    <p className="text-xs text-muted-foreground">Don't remind if already done</p>
                  </div>
                  <Switch
                    checked={settings.suppressWhenCompleted}
                    onCheckedChange={(checked) => updateSettings({ suppressWhenCompleted: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduce on high consistency</Label>
                    <p className="text-xs text-muted-foreground">Fewer reminders for strong habits</p>
                  </div>
                  <Switch
                    checked={settings.reduceOnHighConsistency}
                    onCheckedChange={(checked) => updateSettings({ reduceOnHighConsistency: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Pause during Deep Work</Label>
                    <p className="text-xs text-muted-foreground">No interruptions while focusing</p>
                  </div>
                  <Switch
                    checked={settings.suppressDuringDeepWork}
                    onCheckedChange={(checked) => updateSettings({ suppressDuringDeepWork: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frequency Control */}
      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-calm-mist/30">
                    <Calendar className="w-5 h-5 text-calm-mist" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Notification Frequency</CardTitle>
                    <CardDescription>Control how often you're notified</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Select
                  value={settings.frequency}
                  onValueChange={(value: 'minimal' | 'normal') => updateSettings({ frequency: value })}
                >
                  <SelectTrigger className="w-full bg-background/50">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">
                      <div className="flex flex-col">
                        <span>Normal</span>
                        <span className="text-xs text-muted-foreground">All scheduled reminders</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="minimal">
                      <div className="flex flex-col">
                        <span>Minimal</span>
                        <span className="text-xs text-muted-foreground">Only essential alerts</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset */}
      <div className="flex justify-center pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetToDefaults}
          className="text-muted-foreground hover:text-foreground"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
