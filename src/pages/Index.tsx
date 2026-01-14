import { useState, useEffect } from 'react';
import { Navigation, Tab } from '@/components/layout/Navigation';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { RoutinesView } from '@/components/dashboard/RoutinesView';
import { JournalView } from '@/components/dashboard/JournalView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { LifeBalanceView } from '@/components/dashboard/LifeBalanceView';
import { GoalsView } from '@/components/dashboard/GoalsView';
import { BudgetView } from '@/components/dashboard/BudgetView';
import { ProjectsView } from '@/components/dashboard/ProjectsView';
import { ProfileView } from '@/components/dashboard/ProfileView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Initialize theme - default to dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigateToJournal={() => setActiveTab('journal')} />;
      case 'routines':
        return <RoutinesView />;
      case 'journal':
        return <JournalView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'lifebalance':
        return <LifeBalanceView />;
      case 'goals':
        return <GoalsView />;
      case 'budget':
        return <BudgetView />;
      case 'projects':
        return <ProjectsView />;
      case 'profile':
        return (
          <ProfileView 
            onNavigateToGoals={() => setActiveTab('goals')} 
            onOpenNotificationSettings={() => setActiveTab('settings')}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigateToJournal={() => setActiveTab('journal')} />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background overflow-x-hidden w-full max-w-[100vw]">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content - Responsive margins for different nav layouts */}
      <main className="
        pt-[60px] pb-[72px]
        md:pt-0 md:pb-6 md:ml-16
        lg:ml-64 lg:pb-8
        min-h-screen min-h-[100dvh]
        w-full
      ">
        <div className="w-full max-w-6xl mx-auto py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
