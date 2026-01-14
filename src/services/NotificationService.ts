import { 
  NotificationCategory, 
  NotificationPayload, 
  NotificationSettings,
  NOTIFICATION_MESSAGES,
  STREAK_MILESTONES 
} from '@/types/notification';

// Check if we're in a Capacitor environment
const isCapacitor = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined';
};

// Notification Service class
class NotificationService {
  private static instance: NotificationService;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();
  private deepWorkActive: boolean = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize the notification service
  async initialize(): Promise<boolean> {
    if (isCapacitor()) {
      return this.initializeCapacitor();
    }
    return this.initializeWeb();
  }

  private async initializeWeb(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Web notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  private async initializeCapacitor(): Promise<boolean> {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Failed to initialize Capacitor notifications:', error);
      return false;
    }
  }

  // Send immediate notification
  async sendNotification(payload: NotificationPayload, settings: NotificationSettings): Promise<void> {
    // Check if notifications are enabled for this category
    if (!settings.enabled || !settings.categories[payload.category]) {
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours(settings)) {
      console.log('Notification suppressed: quiet hours');
      return;
    }

    // Check deep work suppression
    if (settings.suppressDuringDeepWork && this.deepWorkActive) {
      console.log('Notification suppressed: deep work active');
      return;
    }

    if (isCapacitor()) {
      await this.sendCapacitorNotification(payload);
    } else {
      this.sendWebNotification(payload);
    }
  }

  private sendWebNotification(payload: NotificationPayload): void {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.id,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      this.handleNotificationAction(payload);
    };
  }

  private async sendCapacitorNotification(payload: NotificationPayload): Promise<void> {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000),
            title: payload.title,
            body: payload.body,
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            smallIcon: 'ic_stat_icon',
            largeIcon: 'ic_launcher',
            extra: payload.data,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to send Capacitor notification:', error);
    }
  }

  private handleNotificationAction(payload: NotificationPayload): void {
    // Handle notification click actions
    switch (payload.actionType) {
      case 'start-routine':
        window.location.hash = '#routines';
        break;
      case 'open-habit':
        window.location.hash = '#dashboard';
        break;
      case 'open-journal':
        window.location.hash = '#journal';
        break;
      default:
        break;
    }
  }

  // Schedule a notification for a specific time
  scheduleNotification(
    payload: NotificationPayload, 
    scheduledTime: Date,
    settings: NotificationSettings
  ): string {
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      console.warn('Cannot schedule notification in the past');
      return '';
    }

    const timeoutId = setTimeout(() => {
      this.sendNotification(payload, settings);
      this.scheduledNotifications.delete(payload.id);
    }, delay);

    this.scheduledNotifications.set(payload.id, timeoutId);
    return payload.id;
  }

  // Cancel a scheduled notification
  cancelNotification(notificationId: string): void {
    const timeoutId = this.scheduledNotifications.get(notificationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(notificationId);
    }
  }

  // Cancel all scheduled notifications
  cancelAllNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  // Set deep work mode
  setDeepWorkActive(active: boolean): void {
    this.deepWorkActive = active;
  }

  // Check if in quiet hours
  private isInQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHoursEnabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    }
    
    return currentTime >= startTime && currentTime < endTime;
  }

  // Schedule daily reminders based on settings
  scheduleDailyReminders(settings: NotificationSettings): void {
    this.cancelAllNotifications();

    if (!settings.enabled) return;

    const today = new Date();

    // Morning routine
    if (settings.categories.routines) {
      const morningTime = this.parseTime(settings.morningRoutineTime, today);
      if (morningTime > today) {
        this.scheduleNotification(
          {
            id: 'morning-routine',
            title: NOTIFICATION_MESSAGES.routines.morning.title,
            body: NOTIFICATION_MESSAGES.routines.morning.body,
            category: 'routines',
            actionType: 'start-routine',
          },
          morningTime,
          settings
        );
      }
    }

    // Night routine
    if (settings.categories.routines) {
      const nightTime = this.parseTime(settings.nightRoutineTime, today);
      if (nightTime > today) {
        this.scheduleNotification(
          {
            id: 'night-routine',
            title: NOTIFICATION_MESSAGES.routines.night.title,
            body: NOTIFICATION_MESSAGES.routines.night.body,
            category: 'routines',
            actionType: 'start-routine',
          },
          nightTime,
          settings
        );
      }
    }

    // Journal reminder
    if (settings.categories.journal) {
      const journalTime = this.parseTime(settings.journalReminderTime, today);
      if (journalTime > today) {
        this.scheduleNotification(
          {
            id: 'journal-reminder',
            title: NOTIFICATION_MESSAGES.journal.reminder.title,
            body: NOTIFICATION_MESSAGES.journal.reminder.body,
            category: 'journal',
            actionType: 'open-journal',
          },
          journalTime,
          settings
        );
      }
    }

    // Budget check
    if (settings.categories.budget) {
      const budgetTime = this.parseTime(settings.budgetCheckTime, today);
      if (budgetTime > today) {
        this.scheduleNotification(
          {
            id: 'budget-check',
            title: NOTIFICATION_MESSAGES.budget.daily.title,
            body: NOTIFICATION_MESSAGES.budget.daily.body,
            category: 'budget',
          },
          budgetTime,
          settings
        );
      }
    }
  }

  private parseTime(timeString: string, baseDate: Date): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Send streak milestone notification
  sendStreakNotification(
    days: number, 
    habitName: string, 
    settings: NotificationSettings
  ): void {
    if (!settings.categories.streaks) return;
    
    if (STREAK_MILESTONES.includes(days)) {
      const message = NOTIFICATION_MESSAGES.streaks.milestone(days, habitName);
      this.sendNotification(
        {
          id: `streak-${habitName}-${days}`,
          title: message.title,
          body: message.body,
          category: 'streaks',
        },
        settings
      );
    }
  }

  // Schedule habit reminder with snooze support
  scheduleHabitReminder(
    habitId: string,
    habitName: string,
    reminderTime: Date,
    settings: NotificationSettings,
    snoozeMinutes?: number
  ): void {
    if (!settings.categories.habits) return;

    const actualTime = snoozeMinutes 
      ? new Date(Date.now() + snoozeMinutes * 60 * 1000)
      : reminderTime;

    const message = NOTIFICATION_MESSAGES.habits.reminder(habitName);
    
    this.scheduleNotification(
      {
        id: `habit-${habitId}`,
        title: message.title,
        body: message.body,
        category: 'habits',
        actionType: 'open-habit',
        data: { habitId, snoozeOptions: [10, 30, 60] },
      },
      actualTime,
      settings
    );
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
