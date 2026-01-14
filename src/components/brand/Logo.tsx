import logoIcon from '@/assets/logo-icon.png';
import logoFull from '@/assets/logo-full.png';

export { logoIcon, logoFull };

// Logo component for consistent usage across the app
export function LogoIcon({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <img 
      src={logoIcon} 
      alt="GlowHabit" 
      className={className}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}

export function LogoFull({ className = '', height = 40 }: { className?: string; height?: number }) {
  return (
    <img 
      src={logoFull} 
      alt="GlowHabit" 
      className={className}
      height={height}
      style={{ objectFit: 'contain', height }}
    />
  );
}
