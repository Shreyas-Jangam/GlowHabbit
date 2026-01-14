// Notification Types and Settings

export type NotificationCategory = 
  | 'habits'
  | 'routines'
  | 'skincare'
  | 'deepwork'
  | 'journal'
  | 'budget'
  | 'discipline'
  | 'streaks'
  | 'insights';

export interface NotificationSettings {
  // Global settings
  enabled: boolean;
  frequency: 'minimal' | 'normal';
  
  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string;
  
  // Category toggles
  categories: Record<NotificationCategory, boolean>;
  
  // Specific timing
  morningRoutineTime: string;
  nightRoutineTime: string;
  journalReminderTime: string;
  budgetCheckTime: string;
  
  // Smart suppression
  suppressWhenCompleted: boolean;
  reduceOnHighConsistency: boolean;
  suppressDuringDeepWork: boolean;
}

export interface ScheduledNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  scheduledTime: Date;
  habitId?: string;
  routineType?: 'morning' | 'night';
  snoozeCount?: number;
}

export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  actionType?: 'start-routine' | 'open-habit' | 'open-journal' | 'snooze';
  data?: Record<string, any>;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  frequency: 'normal',
  
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  
  categories: {
    habits: true,
    routines: true,
    skincare: true,
    deepwork: true,
    journal: true,
    budget: true,
    discipline: true,
    streaks: true,
    insights: true,
  },
  
  morningRoutineTime: '06:00',
  nightRoutineTime: '21:00',
  journalReminderTime: '20:00',
  budgetCheckTime: '19:00',
  
  suppressWhenCompleted: true,
  reduceOnHighConsistency: true,
  suppressDuringDeepWork: true,
};

// Notification message templates
export const NOTIFICATION_MESSAGES = {
  habits: {
    reminder: (habitName: string) => ({
      title: 'Habit Reminder',
      body: `Time for: ${habitName}`,
    }),
    incomplete: (habitName: string) => ({
      title: 'Gentle Reminder',
      body: `You haven't completed "${habitName}" yet today`,
    }),
  },
  routines: {
    morning: {
      title: 'Good Morning ☀️',
      body: 'Ready to start your morning routine?',
    },
    night: {
      title: 'Wind Down Time 🌙',
      body: 'Time for your night routine',
    },
  },
  skincare: {
    morning: {
      title: 'Morning Glow ✨',
      body: 'Time for your morning skincare',
    },
    night: {
      title: 'Night Care ✨',
      body: 'Night skincare time',
    },
  },
  deepwork: {
    start: (duration: number) => ({
      title: 'Deep Work Session',
      body: `${duration} minutes of focused work starts now`,
    }),
    complete: {
      title: 'Session Complete 🎯',
      body: 'Great focus session! Take a break.',
    },
  },
  discipline: {
    reminder: {
      title: 'Stay Strong 💪',
      body: 'Your streak matters. You\'ve got this.',
    },
    checkin: {
      title: 'Evening Check-in',
      body: 'How did you do today? Your progress matters.',
    },
  },
  budget: {
    daily: {
      title: 'Budget Check',
      body: 'Did you stay within budget today?',
    },
    monthly: (saved: number) => ({
      title: 'Monthly Summary 💰',
      body: `You saved ₹${saved} this month!`,
    }),
  },
  journal: {
    reminder: {
      title: 'Reflection Time 📝',
      body: 'Take 5 minutes to reflect on your day',
    },
    weekly: {
      title: 'Weekly Reflection',
      body: 'How was your week? Time for a quick review.',
    },
  },
  streaks: {
    milestone: (days: number, habitName: string) => ({
      title: `🔥 ${days}-Day Streak!`,
      body: `Amazing consistency with ${habitName}!`,
    }),
    broken: (habitName: string) => ({
      title: 'Keep Going',
      body: `Your ${habitName} streak ended. Start fresh today!`,
    }),
  },
  insights: {
    weekly: (improvement: string) => ({
      title: 'Weekly Insights 📊',
      body: improvement,
    }),
    monthly: {
      title: 'Monthly Life Balance',
      body: 'Your monthly report is ready',
    },
  },
};

// Streak milestones
export const STREAK_MILESTONES = [7, 14, 21, 30, 60, 90, 100, 180, 365];
