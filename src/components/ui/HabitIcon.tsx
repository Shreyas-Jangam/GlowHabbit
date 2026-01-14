import { icons, LucideProps } from 'lucide-react';
import { Circle } from 'lucide-react';

interface HabitIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export function HabitIcon({ name, ...props }: HabitIconProps) {
  const IconComponent = icons[name as keyof typeof icons];
  
  if (!IconComponent) {
    return <Circle {...props} />;
  }
  
  return <IconComponent {...props} />;
}

// Alias for easier import
export const Icon = HabitIcon;
