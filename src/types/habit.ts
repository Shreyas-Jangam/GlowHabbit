export type HabitCategory = 'health' | 'career' | 'mind' | 'relationships' | 'custom';

export type LifeArea = 'health' | 'career' | 'mind' | 'relationships';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  color: string;
  completedDates: string[]; // ISO date strings
  createdAt: string;
  order: number;
  lifeArea?: LifeArea;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  isCompleted: boolean;
  createdAt: string;
  lifeArea?: LifeArea;
}

export interface DailyProgress {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; color: string; bgClass: string }> = {
  health: { label: 'Health', color: 'category-health', bgClass: 'bg-category-health' },
  career: { label: 'Career', color: 'category-career', bgClass: 'bg-category-career' },
  mind: { label: 'Mind', color: 'category-mind', bgClass: 'bg-category-mind' },
  relationships: { label: 'Relationships', color: 'category-relationships', bgClass: 'bg-category-relationships' },
  custom: { label: 'Custom', color: 'primary', bgClass: 'bg-primary' },
};

export const DEFAULT_HABITS: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>[] = [
  // Health
  { name: 'Drink water daily', icon: 'Droplets', category: 'health', color: 'category-health', lifeArea: 'health' },
  { name: 'Daily movement / walk', icon: 'Footprints', category: 'health', color: 'category-health', lifeArea: 'health' },
  { name: 'Sleep routine', icon: 'Moon', category: 'health', color: 'category-health', lifeArea: 'health' },
  { name: 'Eat mindfully', icon: 'UtensilsCrossed', category: 'health', color: 'category-health', lifeArea: 'health' },
  { name: 'Stretch / light exercise', icon: 'Activity', category: 'health', color: 'category-health', lifeArea: 'health' },

  // Career
  { name: 'Learn a new skill daily', icon: 'Brain', category: 'career', color: 'category-career', lifeArea: 'career' },
  { name: 'Work focus session', icon: 'Target', category: 'career', color: 'category-career', lifeArea: 'career' },
  { name: 'Daily planning', icon: 'ClipboardList', category: 'career', color: 'category-career', lifeArea: 'career' },
  { name: 'Portfolio / resume progress', icon: 'Briefcase', category: 'career', color: 'category-career', lifeArea: 'career' },
  { name: 'Networking / career growth', icon: 'Users', category: 'career', color: 'category-career', lifeArea: 'career' },

  // Mind
  { name: 'Meditation / mindfulness', icon: 'Sparkles', category: 'mind', color: 'category-mind', lifeArea: 'mind' },
  { name: 'Journal reflection', icon: 'PenTool', category: 'mind', color: 'category-mind', lifeArea: 'mind' },
  { name: 'Screen detox time', icon: 'Smartphone', category: 'mind', color: 'category-mind', lifeArea: 'mind' },
  { name: 'Gratitude practice', icon: 'Heart', category: 'mind', color: 'category-mind', lifeArea: 'mind' },
  { name: 'Reading / learning time', icon: 'BookOpen', category: 'mind', color: 'category-mind', lifeArea: 'mind' },

  // Relationships
  { name: 'Check-in with a loved one', icon: 'Phone', category: 'relationships', color: 'category-relationships', lifeArea: 'relationships' },
  { name: 'Quality time', icon: 'Clock', category: 'relationships', color: 'category-relationships', lifeArea: 'relationships' },
  { name: 'Express gratitude to someone', icon: 'MessageCircle', category: 'relationships', color: 'category-relationships', lifeArea: 'relationships' },
  { name: 'Listen deeply', icon: 'Ear', category: 'relationships', color: 'category-relationships', lifeArea: 'relationships' },
  { name: 'Strengthen connections', icon: 'Users', category: 'relationships', color: 'category-relationships', lifeArea: 'relationships' },
];
