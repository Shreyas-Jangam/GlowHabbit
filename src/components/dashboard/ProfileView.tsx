import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import { ProgressAnalyticsCard } from '@/components/profile/ProgressAnalyticsCard';
import { EmotionalTrackingCard } from '@/components/profile/EmotionalTrackingCard';
import { AchievementsCard } from '@/components/profile/AchievementsCard';
import { ThemeCard } from '@/components/profile/ThemeCard';
import { ReminderCard } from '@/components/profile/ReminderCard';
import { PrivacyCard } from '@/components/profile/PrivacyCard';
import { MotivationalQuote } from '@/components/profile/MotivationalQuote';
import { useProfile } from '@/hooks/useProfile';

interface ProfileViewProps {
  onNavigateToGoals: () => void;
  onOpenNotificationSettings?: () => void;
}

export function ProfileView({ onNavigateToGoals, onOpenNotificationSettings }: ProfileViewProps) {
  const { profile, updateProfile, changeSubtitle } = useProfile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-4 pb-8"
    >
      {/* Header with Identity */}
      <ProfileHeader
        name={profile.name}
        subtitle={profile.subtitle}
        avatarUrl={profile.avatarUrl}
        onChangeSubtitle={changeSubtitle}
      />

      {/* Motivational Quote - Top for daily inspiration */}
      <MotivationalQuote />

      {/* User Identity */}
      <UserInfoCard profile={profile} onUpdate={updateProfile} />

      {/* Progress Analytics */}
      <ProgressAnalyticsCard />

      {/* Emotional Wellness Tracking */}
      <EmotionalTrackingCard />

      {/* Achievements & Badges */}
      <AchievementsCard />

      {/* Personalization Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
          Personalization
        </h2>
        
        {/* Theme Selection */}
        <ThemeCard />

        {/* Reminder Customization */}
        <ReminderCard onOpenNotificationSettings={onOpenNotificationSettings} />
      </div>

      {/* Privacy & Data Controls */}
      <PrivacyCard />
    </motion.div>
  );
}
