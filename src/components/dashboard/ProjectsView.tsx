import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Plus, Clock, Target, Flame, TrendingUp, Play, 
  MoreVertical, Trash2, Edit, CheckCircle2, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/useProjects';
import { Project, PROJECT_COLORS, PROJECT_ICONS, DEEP_WORK_DURATIONS } from '@/types/project';
import { Icon } from '@/components/ui/HabitIcon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function ProjectsView() {
  const { projects, sessions, addProject, updateProject, removeProject, addSession, getProjectStats, deepWorkStats } = useProjects();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isDeepWorkActive, setIsDeepWorkActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(50);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0],
    icon: PROJECT_ICONS[0],
    weeklyTarget: 10,
  });

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    addProject({
      ...newProject,
      habitIds: [],
    });
    setNewProject({
      name: '',
      description: '',
      color: PROJECT_COLORS[0],
      icon: PROJECT_ICONS[0],
      weeklyTarget: 10,
    });
    setIsAddingProject(false);
  };

  const startDeepWork = () => {
    if (!selectedProject) return;
    setTimeRemaining(selectedDuration * 60);
    setIsDeepWorkActive(true);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeSession = () => {
    if (selectedProject) {
      addSession({
        projectId: selectedProject,
        duration: selectedDuration,
        notes: sessionNotes,
      });
    }
    setIsDeepWorkActive(false);
    setSelectedProject(null);
    setSessionNotes('');
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeProjects = projects.filter(p => p.isActive);

  return (
    <div className="space-y-6">
      {/* Deep Work Mode Active */}
      <AnimatePresence>
        {isDeepWorkActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
          >
            <div className="text-center space-y-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-8xl font-bold text-primary">
                  {formatTime(timeRemaining)}
                </div>
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">Deep Work Session</p>
                <p className="text-lg font-medium">
                  {projects.find(p => p.id === selectedProject)?.name}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                {timeRemaining === 0 ? (
                  <>
                    <Textarea
                      placeholder="Session notes (optional)"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      className="w-80"
                    />
                    <Button onClick={completeSession} className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Session
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeepWorkActive(false)}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Projects & Deep Work</h1>
          <p className="text-muted-foreground mt-1">Execute meaningful work with focus</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg">{deepWorkStats.focusStreak}</span>
            <span className="text-sm text-muted-foreground">focus streak</span>
          </motion.div>
        </div>
      </div>

      {/* Deep Work Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{deepWorkStats.totalHours.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Hours</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-foreground">{deepWorkStats.sessionsThisWeek}</div>
            <p className="text-sm text-muted-foreground mt-1">Sessions This Week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-xl font-bold text-foreground">{deepWorkStats.bestTimeOfDay}</div>
            <p className="text-sm text-muted-foreground mt-1">Best Focus Time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className={cn(
                "w-6 h-6",
                deepWorkStats.weeklyTrend === 'up' ? 'text-success' : 
                deepWorkStats.weeklyTrend === 'down' ? 'text-destructive rotate-180' : 'text-muted-foreground'
              )} />
              <span className="text-lg font-bold capitalize">{deepWorkStats.weeklyTrend}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Weekly Trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Start Deep Work */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Start Deep Work Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Project</label>
              <div className="grid grid-cols-2 gap-2">
                {activeProjects.slice(0, 4).map(project => (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
                      selectedProject === project.id 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <Icon name={project.icon} className="w-4 h-4" style={{ color: project.color }} />
                    </div>
                    <span className="text-sm font-medium truncate">{project.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <div className="flex gap-2">
                {DEEP_WORK_DURATIONS.map(({ value, label, description }) => (
                  <motion.button
                    key={value}
                    onClick={() => setSelectedDuration(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex-1 p-3 rounded-xl border-2 transition-all text-center",
                      selectedDuration === value 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-bold">{label}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={startDeepWork} 
            disabled={!selectedProject}
            className="w-full gap-2 h-12"
          >
            <Play className="w-5 h-5" />
            Start {selectedDuration} min Focus Session
          </Button>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Projects</h2>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="e.g., Startup MVP"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="What are you building?"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekly Target (hours)</label>
                <Input
                  type="number"
                  value={newProject.weeklyTarget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, weeklyTarget: parseInt(e.target.value) || 10 }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {PROJECT_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewProject(prev => ({ ...prev, color }))}
                      className={cn(
                        "w-8 h-8 rounded-full transition-transform",
                        newProject.color === color && "ring-2 ring-offset-2 ring-primary scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {PROJECT_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewProject(prev => ({ ...prev, icon }))}
                      className={cn(
                        "w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all",
                        newProject.icon === icon 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icon name={icon} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to start tracking deep work
            </p>
            <Button onClick={() => setIsAddingProject(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.map(project => {
            const stats = getProjectStats(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${project.color}20` }}
                        >
                          <Icon name={project.icon} className="w-5 h-5" style={{ color: project.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => removeProject(project.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold">{stats.weeklyHours.toFixed(1)}h</div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{stats.consistencyStreak}</div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{stats.totalHours.toFixed(1)}h</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weekly Target</span>
                        <span className="font-medium">{stats.weeklyHours.toFixed(1)} / {project.weeklyTarget}h</span>
                      </div>
                      <Progress value={stats.weeklyExecutionScore} className="h-2" />
                    </div>

                    <Button 
                      onClick={() => {
                        setSelectedProject(project.id);
                        startDeepWork();
                      }}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Insights */}
      {sessions.length > 0 && (
        <Card className="bg-gradient-to-br from-card to-secondary/30">
          <CardHeader>
            <CardTitle>Deep Work Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/10"
              >
                <Clock className="w-5 h-5 text-primary" />
                <p className="text-sm">Your deepest focus happens in the {deepWorkStats.bestTimeOfDay.toLowerCase()}</p>
              </motion.div>
              
              {deepWorkStats.focusStreak >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-success/10"
                >
                  <Flame className="w-5 h-5 text-success" />
                  <p className="text-sm">Great momentum! {deepWorkStats.focusStreak} days of focused work.</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
