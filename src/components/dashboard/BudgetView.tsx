import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Receipt, TrendingUp, TrendingDown, Flame, CheckCircle2, Circle, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '@/hooks/useBudget';
import { format, subDays, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function BudgetView() {
  const { entries, toggleBudgetStatus, getEntryForDate, stats } = useBudget();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = getEntryForDate(today);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const getStatusColor = (entry: typeof todayEntry) => {
    if (!entry) return 'bg-muted';
    if (entry.stayedWithinBudget && entry.trackedExpenses) return 'bg-success';
    if (entry.stayedWithinBudget || entry.trackedExpenses) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Budget Awareness</h1>
          <p className="text-muted-foreground mt-1">Track your financial discipline</p>
        </div>
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border"
          whileHover={{ scale: 1.02 }}
        >
          <Flame className="w-5 h-5 text-accent" />
          <span className="font-bold text-lg">{stats.consistencyStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </motion.div>
      </div>

      {/* Today's Budget Check */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Today's Budget Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => toggleBudgetStatus(today, 'stayedWithinBudget')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                todayEntry?.stayedWithinBudget 
                  ? "bg-success/10 border-success text-success" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              {todayEntry?.stayedWithinBudget ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Circle className="w-8 h-8" />
              )}
              <div className="text-left">
                <p className="font-semibold">Stayed Within Budget</p>
                <p className="text-sm opacity-70">Spent responsibly today</p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => toggleBudgetStatus(today, 'trackedExpenses')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                todayEntry?.trackedExpenses 
                  ? "bg-success/10 border-success text-success" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              {todayEntry?.trackedExpenses ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Circle className="w-8 h-8" />
              )}
              <div className="text-left">
                <p className="font-semibold">Tracked Expenses</p>
                <p className="text-sm opacity-70">Logged all spending</p>
              </div>
            </motion.button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-success">{stats.daysUnderBudget}</div>
            <p className="text-sm text-muted-foreground mt-1">Days Under Budget</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-destructive">{stats.daysOverBudget}</div>
            <p className="text-sm text-muted-foreground mt-1">Days Over Budget</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{stats.monthlyScore}%</div>
            <p className="text-sm text-muted-foreground mt-1">Monthly Score</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-foreground">{stats.totalTrackedDays}</div>
            <p className="text-sm text-muted-foreground mt-1">Days Tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Last 7 Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            {last7Days.map((date) => {
              const entry = getEntryForDate(date);
              const dayDate = new Date(date);
              return (
                <motion.div 
                  key={date}
                  className="flex flex-col items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    getStatusColor(entry)
                  )}>
                    {entry?.stayedWithinBudget && entry?.trackedExpenses ? (
                      <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(dayDate, 'EEE')}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Monthly Financial Discipline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress this month</span>
            <span className="font-semibold text-primary">{stats.monthlyScore}%</span>
          </div>
          <Progress value={stats.monthlyScore} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">On track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Overspent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-card to-secondary/30">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.consistencyStreak >= 7 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-success/10"
              >
                <TrendingUp className="w-5 h-5 text-success" />
                <p className="text-sm">Great discipline! {stats.consistencyStreak} days of consistent tracking.</p>
              </motion.div>
            )}
            {stats.daysOverBudget > stats.daysUnderBudget && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-warning/10"
              >
                <TrendingDown className="w-5 h-5 text-warning" />
                <p className="text-sm">Consider reviewing your spending patterns this month.</p>
              </motion.div>
            )}
            {stats.monthlyScore >= 80 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/10"
              >
                <Wallet className="w-5 h-5 text-primary" />
                <p className="text-sm">Excellent financial awareness this month!</p>
              </motion.div>
            )}
            {stats.totalTrackedDays === 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Start tracking today to build financial awareness.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
