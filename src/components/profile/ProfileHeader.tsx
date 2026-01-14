import { motion } from 'framer-motion';
import { RefreshCw, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  onChangeSubtitle: () => void;
}

export function ProfileHeader({ name, subtitle, avatarUrl, onChangeSubtitle }: ProfileHeaderProps) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center text-center py-8"
    >
      {/* Avatar with soft glow */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-calm-lavender/50 blur-xl scale-110" />
        <Avatar className="relative h-28 w-28 ring-4 ring-background shadow-lg">
          <AvatarImage src={avatarUrl} alt={name || 'User'} />
          <AvatarFallback className="bg-calm-mist text-calm-mist-foreground text-2xl font-medium">
            {initials || <User className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-foreground mb-2"
      >
        {name || 'Welcome'}
      </motion.h1>

      {/* Calm subtitle with refresh */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <span className="text-muted-foreground italic text-sm">"{subtitle}"</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onChangeSubtitle}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
