import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Sparkles,
  BarChart3,
  Lightbulb,
  Link2
} from 'lucide-react';
import { MoodAnalytics } from '@/types/journal';
import { EMOTION_CONFIG, getSentimentEmoji, EmotionTag } from '@/utils/sentimentAnalysis';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';

interface MoodInsightsProps {
  analytics: MoodAnalytics;
  habitCorrelation: {
    highCompletionAvgMood: number;
    lowCompletionAvgMood: number;
    insights: string[];
    dataPoints: number;
  } | null;
}

export function MoodInsights({ analytics, habitCorrelation }: MoodInsightsProps) {
  const chartData = useMemo(() => {
    return analytics.moodByDay.map(day => ({
      date: format(parseISO(day.date), 'MMM d'),
      score: day.score,
      label: day.label,
    }));
  }, [analytics.moodByDay]);

  const wellbeingFeedback = useMemo(() => {
    const feedback: string[] = [];
    
    if (analytics.emotionalStability >= 80) {
      feedback.push("You've maintained emotional consistency lately");
    } else if (analytics.emotionalStability < 50) {
      feedback.push("Your emotional state has been fluctuating — that's normal");
    }
    
    if (analytics.positiveRatio >= 70) {
      feedback.push("Most of your recent days have been positive");
    }
    
    const calmDays = analytics.dominantEmotions.find(e => e.emotion === 'calm');
    const gratefulDays = analytics.dominantEmotions.find(e => e.emotion === 'grateful');
    
    if (calmDays && calmDays.count >= 3) {
      feedback.push("You've had several calm days in a row");
    }
    
    if (gratefulDays && gratefulDays.count >= 2) {
      feedback.push("Gratitude journaling appears to improve mood");
    }
    
    const stressedDays = analytics.dominantEmotions.find(e => e.emotion === 'stressed');
    if (stressedDays && stressedDays.count >= 3) {
      feedback.push("Stress signals detected recently — consider lighter goals");
    }
    
    return feedback.slice(0, 2);
  }, [analytics]);

  const getScoreColor = (score: number) => {
    if (score >= 25) return 'text-success';
    if (score >= 0) return 'text-primary';
    if (score >= -25) return 'text-warning';
    return 'text-destructive';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.date}</p>
          <p className={`text-lg font-bold ${getScoreColor(data.score)}`}>
            {getSentimentEmoji(data.label)} {data.score > 0 ? '+' : ''}{data.score}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Mood Insights</h2>
          <p className="text-sm text-muted-foreground">Emotional patterns from your journal</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            {analytics.averageScore >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-warning" />
            )}
            <span className="text-xs text-muted-foreground">Avg Score</span>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
            {analytics.averageScore > 0 ? '+' : ''}{analytics.averageScore}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl p-4 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-xs text-muted-foreground">Positive Days</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.positiveRatio}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Stability</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.emotionalStability}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-4 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Entries</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.moodByDay.length}</p>
        </motion.div>
      </div>

      {/* Mood Timeline Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-5 border border-border/50"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Mood Timeline</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[-100, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#moodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Dominant Emotions */}
      {analytics.dominantEmotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl p-5 border border-border/50"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Emotion Frequency</h3>
          <div className="space-y-3">
            {analytics.dominantEmotions.map((item, index) => {
              const config = EMOTION_CONFIG[item.emotion];
              const maxCount = analytics.dominantEmotions[0].count;
              const width = (item.count / maxCount) * 100;
              
              return (
                <motion.div
                  key={item.emotion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{config.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      <span className="text-xs text-muted-foreground">{item.count} times</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Habit-Mood Correlation */}
      {habitCorrelation && habitCorrelation.dataPoints >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-5 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Habit ↔ Mood Correlation</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">High Completion Days</p>
              <p className={`text-xl font-bold ${getScoreColor(habitCorrelation.highCompletionAvgMood)}`}>
                {habitCorrelation.highCompletionAvgMood > 0 ? '+' : ''}{habitCorrelation.highCompletionAvgMood}
              </p>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Low Completion Days</p>
              <p className={`text-xl font-bold ${getScoreColor(habitCorrelation.lowCompletionAvgMood)}`}>
                {habitCorrelation.lowCompletionAvgMood > 0 ? '+' : ''}{habitCorrelation.lowCompletionAvgMood}
              </p>
            </div>
          </div>

          {habitCorrelation.insights.length > 0 && (
            <div className="space-y-2">
              {habitCorrelation.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Wellbeing Feedback */}
      {wellbeingFeedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Wellbeing Notes</h3>
          </div>
          <div className="space-y-2">
            {wellbeingFeedback.map((feedback, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                • {feedback}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}