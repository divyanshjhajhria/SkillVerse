import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Zap, 
  Trophy, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Unlock, 
  Target,
  TrendingUp,
  Flame,
  Star,
  Calendar
} from "lucide-react";
import { buildSkillsFromStorage, initialSkills } from "@/utils/skillGraph";
import { completeSkill, getProgress, unmasterSkill } from "@/utils/progressSystem";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(buildSkillsFromStorage());
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setSkills(buildSkillsFromStorage());
    setProgress(getProgress());
  };

  // Complete all skills at once
  const handleCompleteAll = () => {
    let completedCount = 0;
    initialSkills.forEach((skill) => {
      const currentSkill = skills.find(s => s.id === skill.id);
      if (currentSkill && !currentSkill.completed) {
        completeSkill(skill.id);
        completedCount++;
      }
    });
    
    // Force immediate state update
    setSkills(buildSkillsFromStorage());
    setProgress(getProgress());
    
    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    
    toast.success(`Completed all ${completedCount} remaining skills! 🌟`, {
      description: "All courses are now marked as completed.",
    });
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.removeItem("skillverse_completed");
      localStorage.removeItem("skillverse_progress");
      localStorage.removeItem("skillverse_leaderboard");
      toast.success("Progress reset successfully");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Export data
  const handleExportData = () => {
    const data = {
      completed: localStorage.getItem("skillverse_completed"),
      progress: localStorage.getItem("skillverse_progress"),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillverse-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const completedSkills = skills.filter(s => s.completed);
  const unlockedSkills = skills.filter(s => s.unlocked && !s.completed);
  const completionPercentage = Math.round((completedSkills.length / skills.length) * 100);

  // Recent activity - last 5 completed skills
  const recentActivity = completedSkills.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your learning journey at a glance
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="glass-panel border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Level</p>
                  <p className="text-4xl font-bold text-primary cosmic-glow">{progress.level}</p>
                </div>
                <Trophy className="w-12 h-12 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/40 hover:border-secondary/40 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Total XP</p>
                  <p className="text-4xl font-bold text-secondary">{progress.xp}</p>
                </div>
                <Star className="w-12 h-12 text-secondary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/40 hover:border-accent/40 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Streak</p>
                  <p className="text-4xl font-bold text-accent">{progress.streak} days</p>
                </div>
                <Flame className="w-12 h-12 text-accent/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Completion</p>
                  <p className="text-4xl font-bold text-primary">{completionPercentage}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="glass-panel border-border/40 animate-fade-in lg:col-span-2" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your learning progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleCompleteAll}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-6 shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                  disabled={completedSkills.length === skills.length}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Complete All Skills ({skills.length - completedSkills.length} left)
                </Button>

                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full border-secondary/30 text-secondary hover:bg-secondary/10 py-6"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Progress Data
                </Button>

                <Button
                  onClick={handleResetProgress}
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 py-6"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset All Progress
                </Button>

                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 py-6"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Galaxy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills Overview */}
          <Card className="glass-panel border-border/40 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Skills Overview
              </CardTitle>
              <CardDescription>Your progress breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Mastered</span>
                  </div>
                  <span className="font-bold text-2xl text-primary">{completedSkills.length}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <span className="font-bold text-2xl text-secondary">{unlockedSkills.length}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-foreground" />
                    <span className="text-sm text-muted-foreground">Total</span>
                  </div>
                  <span className="font-bold text-2xl text-foreground">{skills.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-panel border-border/40 animate-fade-in lg:col-span-3" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest completed skills</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">{skill.name}</p>
                          <p className="text-sm text-muted-foreground">{skill.description.slice(0, 60)}...</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed skills yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start learning to see your progress here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
