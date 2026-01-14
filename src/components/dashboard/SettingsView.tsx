import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Trash2, RefreshCw, Info, ExternalLink, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { NotificationSettingsPanel } from '@/components/notifications/NotificationSettingsPanel';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsView() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    toast.success(`Switched to ${newMode ? 'dark' : 'light'} mode`);
  };

  const handleClearData = () => {
    localStorage.removeItem('glowhabit-habits');
    localStorage.removeItem('glowhabit-goals');
    localStorage.removeItem('glowhabit-journal');
    localStorage.removeItem('glowhabit-journal-settings');
    localStorage.removeItem('glowhabit-routines');
    localStorage.removeItem('glowhabit-routine-completions');
    localStorage.removeItem('glowhabit-skincare');
    localStorage.removeItem('glowhabit-skincare-completions');
    localStorage.removeItem('glowhabit-skincare-settings');
    window.location.reload();
  };

  const handleResetToDefaults = () => {
    localStorage.removeItem('glowhabit-habits');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your GlowHabit experience
        </p>
      </div>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <NotificationSettingsPanel />
      </motion.section>

      {/* Data Management */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Data Management</h2>

        <div className="space-y-4">
          {/* Reset to Defaults */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Reset Habits</p>
                <p className="text-sm text-muted-foreground">
                  Reset to default habits (keeps goals)
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset habits?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all your habits and their progress, resetting to the default habits. Your goals will be preserved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetToDefaults}>
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Delete all habits, progress, and goals
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your habits, progress data, and goals.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.section>

      {/* Account */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Account</h2>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Log out of your account
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out of your account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.section>

      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">About GlowHabit</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Version 1.0.0</p>
              <p className="text-sm text-muted-foreground">
                Build better habits, one day at a time
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              GlowHabit is a beautiful, minimal habit tracker designed to help you build consistent routines and achieve your personal development goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              React
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              TypeScript
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Framer Motion
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
