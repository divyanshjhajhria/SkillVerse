import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Skill, buildSkillsFromStorage } from "@/utils/skillGraph";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { CheckCircle2, Lock, Unlock, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  
  useEffect(() => {
    setSkills(buildSkillsFromStorage());
  }, []);
  
  const getStatusIcon = (skill: Skill) => {
    if (skill.completed) return <CheckCircle2 className="w-5 h-5 text-primary" />;
    if (skill.unlocked) return <Unlock className="w-5 h-5 text-secondary" />;
    return <Lock className="w-5 h-5 text-muted-foreground" />;
  };
  
  const getStatusBadge = (skill: Skill) => {
    if (skill.completed) {
      return <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>;
    }
    if (skill.unlocked) {
      return <Badge className="bg-secondary/20 text-secondary border-secondary/30">Available</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Locked</Badge>;
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">All Skills</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Master these technologies to advance through the Skillverse
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {skills.map((skill, index) => (
            <Card
              key={skill.id}
              className="glass-panel border-border/40 hover:border-primary/40 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(skill)}
                    <CardTitle className="text-xl">{skill.name}</CardTitle>
                  </div>
                  {getStatusBadge(skill)}
                </div>
                <CardDescription className="text-foreground/70">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {skill.unlocks && skill.unlocks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-secondary uppercase tracking-wider">
                        Unlocks:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skill.unlocks.map((unlock) => (
                          <Badge
                            key={unlock}
                            variant="outline"
                            className="text-xs border-secondary/30 text-secondary"
                          >
                            {unlock}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skill.unlocked && (
                    <Link to={`/learn?skill=${skill.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
