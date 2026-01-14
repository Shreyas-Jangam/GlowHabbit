import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Briefcase,
  Brain,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Activity,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useLifeBalance } from '@/hooks/useLifeBalance';
import { LIFE_AREAS, LifeArea } from '@/types/routine';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const AREA_ICONS: Record<LifeArea, React.ElementType> = {
  health: Heart,
  career: Briefcase,
  mind: Brain,
  relationships: Users,
};

export function LifeBalanceView() {
  const { habits } = useHabits();
  const { goals } = useGoals();
  const { lifeBalanceData, LIFE_AREAS: areas } = useLifeBalance(habits, goals);

  const radarData = useMemo(() => {
    return areas.map((area) => {
      const score = lifeBalanceData.areaScores.find((s) => s.area === area.id);
      return {
        area: area.label,
        score: score?.score || 0,
        fullMark: 100,
      };
    });
  }, [areas, lifeBalanceData]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Life Balance
        </h1>
        <p className="text-muted-foreground">
          See where your energy goes and find balance
        </p>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="relative w-24 h-24 mx-auto mb-4"
            >
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  strokeWidth="8"
                  stroke="hsl(var(--muted))"
                  fill="none"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="42"
                  strokeWidth="8"
                  stroke="hsl(var(--primary))"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: lifeBalanceData.overallScore / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeDasharray="264"
                  strokeDashoffset="0"
                  style={{
                    strokeDasharray: 264,
                    strokeDashoffset: 264 - (264 * lifeBalanceData.overallScore) / 100,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(lifeBalanceData.overallScore)}`}>
                  {lifeBalanceData.overallScore}
                </span>
              </div>
            </motion.div>
            <div className="text-sm font-medium text-foreground">Overall Balance</div>
            <div className="text-xs text-muted-foreground">Out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className={`text-2xl font-bold ${getScoreColor(lifeBalanceData.stabilityScore)}`}>
              {lifeBalanceData.stabilityScore}%
            </div>
            <div className="text-xs text-muted-foreground">Stability Score</div>
            <p className="text-xs text-muted-foreground mt-1">
              How balanced your areas are
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">
              {habits.length}
            </div>
            <div className="text-xs text-muted-foreground">Active Habits</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {areas.length} life areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Balance Wheel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Life Areas Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {areas.map((area, index) => {
          const Icon = AREA_ICONS[area.id];
          const areaScore = lifeBalanceData.areaScores.find((s) => s.area === area.id);
          
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${area.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: area.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{area.label}</h3>
                        <div className="flex items-center gap-1">
                          {areaScore && getTrendIcon(areaScore.trend)}
                          <span className={`text-lg font-bold ${getScoreColor(areaScore?.score || 0)}`}>
                            {areaScore?.score || 0}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{area.description}</p>
                      
                      <Progress 
                        value={areaScore?.score || 0} 
                        className="h-2 mb-3"
                      />

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            {areaScore?.habitCount || 0} habits
                          </span>
                          <span className="text-muted-foreground">
                            {areaScore?.completionRate || 0}% completion
                          </span>
                        </div>
                        <Badge
                          variant={
                            areaScore?.trend === 'up'
                              ? 'default'
                              : areaScore?.trend === 'down'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {areaScore?.trend === 'up' && '↑ Improving'}
                          {areaScore?.trend === 'down' && '↓ Declining'}
                          {areaScore?.trend === 'stable' && '→ Stable'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      {lifeBalanceData.insights.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lifeBalanceData.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{insight}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">How to Improve Balance</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Focus on your lowest-scoring area first
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Add at least one habit per life area
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Set goals that span multiple areas for better integration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Review your balance weekly and adjust habits accordingly
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
