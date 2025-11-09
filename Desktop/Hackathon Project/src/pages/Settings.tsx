import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Palette, Sparkles, Trash2, Download, User, RotateCcw } from "lucide-react";
import { getUsername, setUsername } from "@/utils/leaderboardSystem";

const Settings = () => {
  const [galaxyDensity, setGalaxyDensity] = useState(50);
  const [showShootingStars, setShowShootingStars] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [username, setUsernameState] = useState(getUsername());
  
  const handleUsernameChange = () => {
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    setUsername(username);
    toast.success("Username updated successfully");
  };
  
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.removeItem("skillverse_completed");
      localStorage.removeItem("skillverse_progress");
      localStorage.removeItem("skillverse_leaderboard");
      toast.success("Progress reset successfully");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleDeveloperReset = () => {
    if (confirm("This will reset everything including the welcome screen. Continue?")) {
      localStorage.clear();
      toast.success("App reset to initial state");
      setTimeout(() => window.location.href = "/", 1000);
    }
  };
  
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
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Settings</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your Skillverse experience
          </p>
        </div>
        
        {/* Profile Settings */}
        <Card className="glass-panel border-border/40 mb-6 animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Customize your leaderboard identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="flex gap-2">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsernameState(e.target.value)}
                  placeholder="Enter your username"
                  className="flex-1"
                  maxLength={20}
                />
                <Button onClick={handleUsernameChange} variant="secondary">
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This name will appear on the leaderboard
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Visual Settings */}
        <Card className="glass-panel border-border/40 mb-6 animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Visual Settings</CardTitle>
            </div>
            <CardDescription>Customize the appearance of your galaxy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="galaxy-density" className="text-sm font-medium">
                Galaxy Density: {galaxyDensity}%
              </Label>
              <Slider
                id="galaxy-density"
                value={[galaxyDensity]}
                onValueChange={(value) => setGalaxyDensity(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Adjust the number of stars in the background
              </p>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-border/30">
              <div className="space-y-1">
                <Label htmlFor="shooting-stars" className="text-sm font-medium">
                  Shooting Stars
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable animated shooting stars
                </p>
              </div>
              <Switch
                id="shooting-stars"
                checked={showShootingStars}
                onCheckedChange={setShowShootingStars}
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-border/30">
              <div className="space-y-1">
                <Label htmlFor="animations" className="text-sm font-medium">
                  Animations
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable smooth transitions and effects
                </p>
              </div>
              <Switch
                id="animations"
                checked={enableAnimations}
                onCheckedChange={setEnableAnimations}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card className="glass-panel border-border/40 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Backup or reset your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Progress Data
            </Button>
            
            <Button
              onClick={handleResetProgress}
              variant="outline"
              className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>

            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-3">
                Developer Options
              </p>
              <Button
                onClick={handleDeveloperReset}
                variant="outline"
                className="w-full justify-start border-accent/30 text-accent hover:bg-accent/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Full App Reset (Including Welcome Screen)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
