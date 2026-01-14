export type DisciplineCategory = 'discipline' | 'finance';

export interface BudgetEntry {
  id: string;
  date: string;
  stayedWithinBudget: boolean;
  trackedExpenses: boolean;
  amount?: number;
  notes?: string;
}

export interface BudgetStats {
  consistencyStreak: number;
  daysUnderBudget: number;
  daysOverBudget: number;
  monthlyScore: number;
  totalTrackedDays: number;
}

export const DISCIPLINE_HABITS = [
  { name: '5:30 AM Wake Up', icon: 'Sunrise', category: 'discipline' as const, color: 'category-discipline', lifeArea: 'health' as const },
  { name: 'Stop Smoking', icon: 'Ban', category: 'discipline' as const, color: 'category-discipline', lifeArea: 'health' as const },
  { name: 'No Porn', icon: 'Shield', category: 'discipline' as const, color: 'category-discipline', lifeArea: 'mind' as const },
  { name: 'No Alcohol', icon: 'Wine', category: 'discipline' as const, color: 'category-discipline', lifeArea: 'health' as const },
  { name: 'Stayed Within Budget', icon: 'Wallet', category: 'finance' as const, color: 'category-finance', lifeArea: 'career' as const },
  { name: 'Tracked Expenses', icon: 'Receipt', category: 'finance' as const, color: 'category-finance', lifeArea: 'career' as const },
];
