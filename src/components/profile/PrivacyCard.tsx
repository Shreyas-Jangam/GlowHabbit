import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Download, Trash2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
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

export function PrivacyCard() {
  const { profile, updatePreferences } = useProfile();
  const { toast } = useToast();

  const handleExportData = () => {
    // Collect all localStorage data
    const exportData: Record<string, unknown> = {};
    const keys = ['glowhabit-profile', 'glowhabit-habits', 'glowhabit-journal', 'glowhabit-goals', 'glowhabit-routines'];
    
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        exportData[key] = JSON.parse(data);
      }
    });

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glowhabit-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Your data has been downloaded as a JSON file.',
    });
  };

  const handleClearData = () => {
    const keys = ['glowhabit-profile', 'glowhabit-habits', 'glowhabit-journal', 'glowhabit-goals', 'glowhabit-routines', 'glowhabit-skincare', 'glowhabit-notification-settings'];
    keys.forEach(key => localStorage.removeItem(key));
    
    toast({
      title: 'Data cleared',
      description: 'All your data has been removed. The page will reload.',
    });

    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Private Stats</p>
                <p className="text-xs text-muted-foreground">Hide progress from others</p>
              </div>
            </div>
            <Switch
              checked={profile.preferences.statsPrivate}
              onCheckedChange={(checked) => updatePreferences({ statsPrivate: checked })}
            />
          </div>

          {/* Data Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your habits, journal entries, goals, and settings. This action cannot be undone.
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

          <p className="text-xs text-muted-foreground text-center">
            Your data is stored locally on this device only.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
