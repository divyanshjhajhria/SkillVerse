import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { getProgress, getAchievementInfo, getXPForNextLevel } from "@/utils/progressSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Zap, TrendingUp } from "lucide-react";

const Progress = () => {
  const [progress, setProgress] = useState(getProgress());
  
  useEffect(() => {
    setProgress(getProgress());
  }, []);
  
  const xpForNextLevel = getXPForNextLevel(progress.xp);
  const currentLevelXP = progress.xp % 500;
  const progressPercent = (currentLevelXP / 500) * 100;
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Your Progress</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your journey through the cosmos
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="glass-panel border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Level
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold cosmic-glow">{progress.level}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {xpForNextLevel} XP to next level
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-secondary">
                <Flame className="w-5 h-5" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Streak
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">{progress.streak}</div>
              <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="w-5 h-5" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Total XP
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{progress.xp}</div>
              <p className="text-xs text-muted-foreground mt-1">Experience points</p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-foreground">
                <Trophy className="w-5 h-5" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Skills
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{progress.totalSkillsCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Level Progress */}
        <Card className="glass-panel border-border/40 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Level {progress.level} Progress
            </CardTitle>
            <CardDescription>
              {currentLevelXP} / 500 XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar value={progressPercent} className="h-3" />
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card className="glass-panel border-border/40 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription>
              {progress.achievements.length > 0
                ? `You've earned ${progress.achievements.length} achievements`
                : "Complete skills to unlock achievements"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progress.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progress.achievements.map((achievementId) => {
                  const achievement = getAchievementInfo(achievementId);
                  return (
                    <div
                      key={achievementId}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/20"
                    >
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Complete your first skill to unlock achievements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
