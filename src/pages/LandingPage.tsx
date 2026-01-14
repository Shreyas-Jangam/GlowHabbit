import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnalyticsSection } from '@/components/landing/AnalyticsSection';
import { NotificationsSection } from '@/components/landing/NotificationsSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { DesignSection } from '@/components/landing/DesignSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNavbar } from '@/components/landing/LandingNavbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNavbar />
      
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <AnalyticsSection />
        <NotificationsSection />
        <PrivacySection />
        <DesignSection />
        <AudienceSection />
        <FinalCTASection />
      </main>
      
      <LandingFooter />
    </div>
  );
}
