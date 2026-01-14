import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  timezone: string;
  joinedDate: string;
  avatarUrl?: string;
  subtitle: string;
  preferences: {
    appearance: 'light' | 'dark' | 'calm';
    reminderEnabled: boolean;
    statsPrivate: boolean;
  };
}

const STORAGE_KEY = 'glowhabit-profile';

const CALM_SUBTITLES = [
  "growing steadily",
  "taking mindful steps",
  "embracing the journey",
  "finding balance",
  "one day at a time",
  "nurturing growth",
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getDefaultProfile(): UserProfile {
  return {
    id: generateId(),
    name: '',
    email: '',
    username: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    joinedDate: new Date().toISOString(),
    subtitle: CALM_SUBTITLES[Math.floor(Math.random() * CALM_SUBTITLES.length)],
    preferences: {
      appearance: 'light',
      reminderEnabled: true,
      statsPrivate: false,
    },
  };
}

function getStoredProfile(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return { ...getDefaultProfile(), ...JSON.parse(stored) };
  }
  return getDefaultProfile();
}

// Apply theme to document
function applyTheme(theme: 'light' | 'dark' | 'calm') {
  document.documentElement.classList.remove('dark', 'calm');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'calm') {
    document.documentElement.classList.add('calm');
  }
  localStorage.setItem('theme', theme);
}

// Initialize theme on page load (before React hydrates)
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'calm' | null;
  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

// Run immediately
if (typeof window !== 'undefined') {
  initializeTheme();
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedProfile = getStoredProfile();
    setProfile(storedProfile);
    setIsLoaded(true);
    
    // Apply theme from profile on load
    applyTheme(storedProfile.preferences.appearance);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isLoaded]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserProfile['preferences']>) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  }, []);

  const changeSubtitle = useCallback(() => {
    const newSubtitle = CALM_SUBTITLES[Math.floor(Math.random() * CALM_SUBTITLES.length)];
    setProfile(prev => ({ ...prev, subtitle: newSubtitle }));
  }, []);

  return {
    profile,
    isLoaded,
    updateProfile,
    updatePreferences,
    changeSubtitle,
    applyTheme,
    CALM_SUBTITLES,
  };
}
