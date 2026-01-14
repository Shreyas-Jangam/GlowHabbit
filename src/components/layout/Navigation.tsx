import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BarChart3, Target, Settings, BookOpen, Sunrise, Scale, Wallet, Rocket, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserMenu } from './UserMenu';
import { LogoIcon } from '@/components/brand/Logo';

export type Tab = 'dashboard' | 'routines' | 'journal' | 'analytics' | 'lifebalance' | 'goals' | 'budget' | 'projects' | 'profile' | 'settings';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routines', label: 'Routines', icon: Sunrise },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'lifebalance', label: 'Life Balance', icon: Scale },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'projects', label: 'Projects', icon: Rocket },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Bottom bar tabs for mobile - main 5 tabs
const mobileBottomTabs = tabs.slice(0, 5);

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileTabChange = (tab: Tab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile/tablet */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen h-[100dvh] w-64 flex-col bg-card border-r border-border p-4 z-50 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 flex-shrink-0">
          <LogoIcon size={40} className="flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent truncate">GlowHabit</h1>
            <p className="text-xs text-muted-foreground truncate">Build better habits</p>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 touch-target-sm",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* User Menu */}
        <div className="pt-4 border-t border-border flex-shrink-0">
          <UserMenu />
        </div>
      </nav>

      {/* Tablet Navigation - Compact sidebar */}
      <nav className="hidden md:flex lg:hidden fixed left-0 top-0 h-screen h-[100dvh] w-16 flex-col items-center bg-card border-r border-border py-4 z-50">
        {/* Logo */}
        <LogoIcon size={36} className="mb-6 flex-shrink-0" />

        {/* Nav Items */}
        <div className="flex-1 space-y-2 overflow-y-auto w-full px-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
              title={tab.label}
              className={cn(
                "w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 touch-target-sm",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <tab.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 pb-safe">
        <div className="flex items-center justify-around px-1 py-1.5 max-w-md mx-auto">
          {mobileBottomTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-0 flex-1 touch-target-sm",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <tab.icon className={cn(
                "w-5 h-5 transition-transform flex-shrink-0",
                activeTab === tab.id && "scale-110"
              )} />
              <span className="text-[10px] font-medium truncate max-w-full leading-tight">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Header with Hamburger Menu */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border z-40 px-3 py-2.5 pt-safe">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <LogoIcon size={28} className="flex-shrink-0" />
            <h1 className="text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent truncate">GlowHabit</h1>
          </div>

          {/* Hamburger Menu for accessing all tabs */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9 touch-target-sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 max-w-[85vw]">
              <div className="flex flex-col h-full h-[100dvh]">
                {/* Sheet Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border flex-shrink-0">
                  <LogoIcon size={36} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-foreground truncate">Menu</h2>
                    <p className="text-xs text-muted-foreground truncate">Navigate your journey</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleMobileTabChange(tab.id)}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 touch-target-sm",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary active:bg-secondary"
                      )}
                    >
                      <tab.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* User Menu */}
                <div className="px-4 py-4 border-t border-border flex-shrink-0">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
