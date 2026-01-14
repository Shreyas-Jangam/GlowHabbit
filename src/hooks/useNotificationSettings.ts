import { useState, useEffect, useCallback } from 'react';
import { 
  NotificationSettings, 
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationCategory 
} from '@/types/notification';

const STORAGE_KEY = 'glowhabit-notification-settings';

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_NOTIFICATION_SETTINGS;
      }
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Function to manually recheck permission status
  const recheckPermission = useCallback(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);
      return currentPermission;
    }
    return 'default' as NotificationPermission;
  }, []);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleCategory = useCallback((category: NotificationCategory, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: enabled,
      },
    }));
  }, []);

  const toggleGlobal = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }));
  }, []);

  const setQuietHours = useCallback((start: string, end: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      quietHoursEnabled: enabled,
      quietHoursStart: start,
      quietHoursEnd: end,
    }));
  }, []);

  const isInQuietHours = useCallback((): boolean => {
    if (!settings.quietHoursEnabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    }
    
    return currentTime >= startTime && currentTime < endTime;
  }, [settings.quietHoursEnabled, settings.quietHoursStart, settings.quietHoursEnd]);

  const canNotify = useCallback((category: NotificationCategory): boolean => {
    if (!settings.enabled) return false;
    if (!settings.categories[category]) return false;
    if (isInQuietHours()) return false;
    if (permissionStatus !== 'granted') return false;
    return true;
  }, [settings, isInQuietHours, permissionStatus]);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_NOTIFICATION_SETTINGS);
  }, []);

  return {
    settings,
    permissionStatus,
    requestPermission,
    recheckPermission,
    updateSettings,
    toggleCategory,
    toggleGlobal,
    setQuietHours,
    isInQuietHours,
    canNotify,
    resetToDefaults,
  };
}
