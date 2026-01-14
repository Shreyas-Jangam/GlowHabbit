export type RoutineType = 'morning' | 'night';

export interface RoutineHabit {
  id: string;
  habitId?: string; // Reference to existing habit, if any
  name: string;
  icon: string;
  order: number;
  isCompleted: boolean;
}

export interface Routine {
  id: string;
  name: string;
  type: RoutineType;
  habits: RoutineHabit[];
  isActive: boolean;
  createdAt: string;
}

export interface RoutineCompletion {
  date: string; // ISO date string
  routineId: string;
  completedAt: string;
  duration?: number; // in minutes
  completedHabits: string[]; // habit ids
}

export interface RoutineStats {
  consistencyRate: number;
  averageCompletionTime: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export const MORNING_ROUTINE_TEMPLATES: Omit<RoutineHabit, 'id' | 'isCompleted'>[] = [
  { name: 'Wake up early', icon: 'Sunrise', order: 0 },
  { name: 'Drink water', icon: 'Droplets', order: 1 },
  { name: 'Stretch for 5 minutes', icon: 'Activity', order: 2 },
  { name: 'Exercise', icon: 'Dumbbell', order: 3 },
  { name: 'Journal', icon: 'PenTool', order: 4 },
  { name: 'Plan the day', icon: 'ClipboardList', order: 5 },
];

export const NIGHT_ROUTINE_TEMPLATES: Omit<RoutineHabit, 'id' | 'isCompleted'>[] = [
  { name: 'Reflect on the day', icon: 'Sparkles', order: 0 },
  { name: 'Gratitude journaling', icon: 'Heart', order: 1 },
  { name: 'Stretch', icon: 'Activity', order: 2 },
  { name: 'No phone after 9 PM', icon: 'Smartphone', order: 3 },
  { name: 'Read for 20 minutes', icon: 'BookOpen', order: 4 },
  { name: 'Sleep prep', icon: 'Moon', order: 5 },
];

export type LifeArea = 'health' | 'career' | 'mind' | 'relationships';

export interface LifeAreaConfig {
  id: LifeArea;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const LIFE_AREAS: LifeAreaConfig[] = [
  { id: 'health', label: 'Health', icon: 'Heart', color: 'hsl(160, 84%, 39%)', description: 'Physical wellness and fitness' },
  { id: 'career', label: 'Career', icon: 'Briefcase', color: 'hsl(220, 80%, 55%)', description: 'Work and professional growth' },
  { id: 'mind', label: 'Mind', icon: 'Brain', color: 'hsl(270, 60%, 60%)', description: 'Mental health and learning' },
  { id: 'relationships', label: 'Relationships', icon: 'Users', color: 'hsl(38, 92%, 50%)', description: 'Social connections and family' },
];

export interface LifeAreaScore {
  area: LifeArea;
  score: number; // 0-100
  habitCount: number;
  completionRate: number;
  goalProgress: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LifeBalanceData {
  overallScore: number;
  areaScores: LifeAreaScore[];
  stabilityScore: number;
  insights: string[];
}
