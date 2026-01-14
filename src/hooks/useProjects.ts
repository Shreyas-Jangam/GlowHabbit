import { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, DeepWorkSession, ProjectStats, DeepWorkStats, PROJECT_COLORS } from '@/types/project';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval, subDays } from 'date-fns';

const PROJECTS_KEY = 'glowhabit-projects';
const SESSIONS_KEY = 'glowhabit-deepwork-sessions';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<DeepWorkSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedSessions) setSessions(JSON.parse(storedSessions));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  }, [projects, sessions, isLoaded]);

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'isActive'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ));
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setSessions(prev => prev.filter(s => s.projectId !== projectId));
  }, []);

  const addSession = useCallback((session: Omit<DeepWorkSession, 'id' | 'completedAt' | 'date'>) => {
    const now = new Date();
    const newSession: DeepWorkSession = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: now.toISOString(),
      date: format(now, 'yyyy-MM-dd'),
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, []);

  const getProjectStats = useCallback((projectId: string): ProjectStats => {
    const projectSessions = sessions.filter(s => s.projectId === projectId);
    const project = projects.find(p => p.id === projectId);
    
    const totalMinutes = projectSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMinutes / 60;

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const weekSessions = projectSessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });
    
    const weeklyMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const weeklyHours = weeklyMinutes / 60;
    
    const weeklyTarget = project?.weeklyTarget || 10;
    const weeklyExecutionScore = Math.min(100, Math.round((weeklyHours / weeklyTarget) * 100));

    // Calculate streak
    let consistencyStreak = 0;
    const sortedDates = [...new Set(projectSessions.map(s => s.date))].sort().reverse();
    const today = format(now, 'yyyy-MM-dd');
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = format(subDays(now, i), 'yyyy-MM-dd');
      if (sortedDates.includes(expectedDate)) {
        consistencyStreak++;
      } else {
        break;
      }
    }

    const progress = project?.deadline 
      ? Math.min(100, Math.round((weeklyHours / weeklyTarget) * 100))
      : weeklyExecutionScore;

    return {
      totalHours,
      weeklyHours,
      consistencyStreak,
      weeklyExecutionScore,
      progress,
    };
  }, [sessions, projects]);

  const deepWorkStats = useMemo((): DeepWorkStats => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMinutes / 60;

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const weekSessions = sessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });

    // Best time of day
    const hourCounts: Record<number, number> = {};
    sessions.forEach(s => {
      const hour = parseISO(s.completedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + s.duration;
    });
    
    let bestHour = 9;
    let maxMinutes = 0;
    Object.entries(hourCounts).forEach(([hour, minutes]) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes;
        bestHour = parseInt(hour);
      }
    });

    const bestTimeOfDay = bestHour < 12 ? 'Morning' : bestHour < 17 ? 'Afternoon' : 'Evening';

    // Weekly trend
    const lastWeekStart = subDays(weekStart, 7);
    const lastWeekEnd = subDays(weekEnd, 7);
    const lastWeekSessions = sessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isWithinInterval(sessionDate, { start: lastWeekStart, end: lastWeekEnd });
    });
    
    const thisWeekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const lastWeekMinutes = lastWeekSessions.reduce((sum, s) => sum + s.duration, 0);
    
    const weeklyTrend = thisWeekMinutes > lastWeekMinutes * 1.1 ? 'up' 
      : thisWeekMinutes < lastWeekMinutes * 0.9 ? 'down' : 'stable';

    // Focus streak
    let focusStreak = 0;
    const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    
    for (let i = 0; i < 30; i++) {
      const expectedDate = format(subDays(now, i), 'yyyy-MM-dd');
      if (sortedDates.includes(expectedDate)) {
        focusStreak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalHours,
      focusStreak,
      bestTimeOfDay,
      weeklyTrend,
      sessionsThisWeek: weekSessions.length,
    };
  }, [sessions]);

  return {
    projects,
    sessions,
    isLoaded,
    addProject,
    updateProject,
    removeProject,
    addSession,
    getProjectStats,
    deepWorkStats,
  };
}
