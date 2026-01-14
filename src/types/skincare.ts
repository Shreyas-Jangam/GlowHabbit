export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';

export interface SkinCareStep {
  id: string;
  name: string;
  icon: string;
  productName?: string;
  timeEstimate?: number; // in minutes
  isOptional: boolean;
  isAlternateDay?: boolean; // For treatments like retinol
  order: number;
  isCompleted: boolean;
  notes?: string;
}

export interface SkinCareRoutine {
  id: string;
  type: 'morning' | 'night';
  steps: SkinCareStep[];
  skinType?: SkinType;
  isActive: boolean;
  createdAt: string;
}

export interface SkinCareCompletion {
  date: string;
  routineId: string;
  type: 'morning' | 'night';
  completedAt: string;
  completedSteps: string[];
  skippedSteps: string[];
}

export interface SkinCareStats {
  morningConsistency: number;
  nightConsistency: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  mostUsedProducts: { name: string; count: number }[];
}

export const MORNING_SKINCARE_TEMPLATE: Omit<SkinCareStep, 'id' | 'isCompleted'>[] = [
  { name: 'Cleanser', icon: 'Droplets', isOptional: false, timeEstimate: 2, order: 0 },
  { name: 'Toner', icon: 'Sparkles', isOptional: true, timeEstimate: 1, order: 1 },
  { name: 'Serum (Vitamin C / Hydrating)', icon: 'FlaskConical', isOptional: false, timeEstimate: 1, order: 2 },
  { name: 'Moisturizer', icon: 'Cloud', isOptional: false, timeEstimate: 1, order: 3 },
  { name: 'Sunscreen (SPF)', icon: 'Sun', isOptional: false, timeEstimate: 1, order: 4 },
];

export const NIGHT_SKINCARE_TEMPLATE: Omit<SkinCareStep, 'id' | 'isCompleted'>[] = [
  { name: 'Makeup Removal / Oil Cleanse', icon: 'Eraser', isOptional: false, timeEstimate: 3, order: 0 },
  { name: 'Cleanser', icon: 'Droplets', isOptional: false, timeEstimate: 2, order: 1 },
  { name: 'Toner', icon: 'Sparkles', isOptional: false, timeEstimate: 1, order: 2 },
  { name: 'Treatment (Retinol / Actives)', icon: 'Zap', isOptional: false, isAlternateDay: true, timeEstimate: 1, order: 3 },
  { name: 'Moisturizer / Night Cream', icon: 'Moon', isOptional: false, timeEstimate: 1, order: 4 },
  { name: 'Lip Care / Eye Cream', icon: 'Heart', isOptional: true, timeEstimate: 1, order: 5 },
];

export const SKIN_TYPE_CONFIG: Record<SkinType, { label: string; description: string; tips: string[] }> = {
  oily: {
    label: 'Oily',
    description: 'Excess sebum production',
    tips: ['Use gel-based cleansers', 'Look for oil-free moisturizers', 'Dont skip moisturizer'],
  },
  dry: {
    label: 'Dry',
    description: 'Lacks moisture and natural oils',
    tips: ['Use cream cleansers', 'Apply rich moisturizers', 'Include hydrating serums'],
  },
  combination: {
    label: 'Combination',
    description: 'Oily T-zone, dry cheeks',
    tips: ['Use gentle cleansers', 'Target different areas', 'Balance hydration'],
  },
  sensitive: {
    label: 'Sensitive',
    description: 'Easily irritated',
    tips: ['Patch test new products', 'Use fragrance-free products', 'Avoid harsh ingredients'],
  },
  normal: {
    label: 'Normal',
    description: 'Balanced skin',
    tips: ['Maintain your routine', 'Focus on prevention', 'Stay hydrated'],
  },
};
