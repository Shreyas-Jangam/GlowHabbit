export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  habitIds: string[];
  weeklyTarget: number; // hours per week
  deadline?: string;
  createdAt: string;
  isActive: boolean;
}

export interface DeepWorkSession {
  id: string;
  projectId: string;
  duration: number; // in minutes
  completedAt: string;
  notes?: string;
  date: string;
}

export interface ProjectStats {
  totalHours: number;
  weeklyHours: number;
  consistencyStreak: number;
  weeklyExecutionScore: number;
  progress: number;
}

export interface DeepWorkStats {
  totalHours: number;
  focusStreak: number;
  bestTimeOfDay: string;
  weeklyTrend: 'up' | 'down' | 'stable';
  sessionsThisWeek: number;
}

export const PROJECT_COLORS = [
  'hsl(220 80% 55%)',
  'hsl(160 84% 39%)',
  'hsl(270 60% 60%)',
  'hsl(38 92% 50%)',
  'hsl(340 75% 55%)',
  'hsl(180 70% 45%)',
];

export const PROJECT_ICONS = [
  'Rocket',
  'Code',
  'Briefcase',
  'PenTool',
  'Lightbulb',
  'Target',
  'Layers',
  'Cpu',
];

export const DEEP_WORK_DURATIONS = [
  { value: 25, label: '25 min', description: 'Pomodoro' },
  { value: 50, label: '50 min', description: 'Focus Block' },
  { value: 90, label: '90 min', description: 'Deep Session' },
];
