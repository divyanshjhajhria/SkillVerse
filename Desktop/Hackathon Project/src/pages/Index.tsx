import { useState, useEffect } from "react";
import { ThreeGalaxyCanvas } from "@/components/galaxy/ThreeGalaxyCanvas";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { CosmicLogo } from "@/components/CosmicLogo";
import { Navigation } from "@/components/Navigation";
import { ConstellationLines } from "@/components/ConstellationLines";
import { ShootingStars } from "@/components/ShootingStars";
import { SearchLearningPath } from "@/components/SearchLearningPath";
import { toast } from "sonner";
import { Skill, buildSkillsFromStorage, initialSkills } from "@/utils/skillGraph";
import { completeSkill, unmasterSkill } from "@/utils/progressSystem";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { AILearningGuide } from "@/components/AILearningGuide";

const Index = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [filteredSkillIds, setFilteredSkillIds] = useState<string[] | null>(null);

  // Load skills from localStorage on mount
  useEffect(() => {
    const loadedSkills = buildSkillsFromStorage();
    setSkills(loadedSkills);
    
    // Check if user has seen welcome screen before
    const hasSeenWelcome = localStorage.getItem('skillverse_seen_welcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }

    // Listen for skills updates from other components
    const handleSkillsUpdate = () => {
      setSkills(buildSkillsFromStorage());
    };

    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate);
  }, []);

  const handleSearchSubmit = (skillIds: string[]) => {
    setFilteredSkillIds(skillIds);
    setShowWelcome(false);
    localStorage.setItem('skillverse_seen_welcome', 'true');
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    setFilteredSkillIds(null);
    localStorage.setItem('skillverse_seen_welcome', 'true');
  };

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle skill completion
  const handleComplete = (skillId: string) => {
    // Update progress system (XP, streak, etc.) - this also marks skill as completed
    const newProgress = completeSkill(skillId);
    
    // Reload all skills with updated completion status
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    // Close the panel and return to galaxy view
    setSelectedSkill(null);
    
    toast.success(`Skill completed! +100 XP 🎉`, {
      description: `Level ${newProgress.level} • ${newProgress.streak} day streak 🔥`,
    });
  };

  // Handle skill skip
  const handleSkip = (skillId: string) => {
    handleComplete(skillId);
    toast.info("Skill marked as known", {
      description: "Moving on to the next challenge!",
    });
  };

  // Handle skill unmaster
  const handleUnmaster = (skillId: string) => {
    unmasterSkill(skillId);
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    setSelectedSkill(null);
  };

  // Complete all skills at once (developer feature)
  const handleCompleteAll = () => {
    let completedCount = 0;
    initialSkills.forEach((skill) => {
      const currentSkill = skills.find(s => s.id === skill.id);
      if (currentSkill && !currentSkill.completed) {
        completeSkill(skill.id);
        completedCount++;
      }
    });
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    
    toast.success(`Completed all ${completedCount} remaining skills! 🌟`, {
      description: "All courses are now marked as completed.",
    });
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSkill) {
        setSelectedSkill(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSkill]);

  const displayedSkills = filteredSkillIds 
    ? skills.filter(s => filteredSkillIds.includes(s.id))
    : skills;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* React Three Fiber Galaxy Background */}
      <ThreeGalaxyCanvas mousePosition={mousePosition} />
      
      {/* Shooting Stars Effect */}
      <ShootingStars />

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-3xl w-full px-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold cosmic-glow">
                Welcome to Skillverse
              </h1>
              <p className="text-2xl text-muted-foreground">
                Your journey through the cosmos of knowledge begins here
              </p>
            </div>
            
            <div className="space-y-4">
              <SearchLearningPath onSubmit={handleSearchSubmit} />
              <div className="text-center">
                <button
                  onClick={handleSkipWelcome}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Skip and explore all skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cosmic Logo */}
      <CosmicLogo />
      
      {/* Navigation */}
      <Navigation />

      {/* Left Side - Stats Dashboard */}
      <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
        <div className="glass-panel rounded-2xl p-5 w-72 border border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Mastered</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-2xl text-primary cosmic-glow">
                  {skills.filter((s) => s.completed).length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Unlocked</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-bold text-xl text-secondary">
                  {skills.filter((s) => s.unlocked).length}
                </span>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-primary via-accent to-transparent opacity-30" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Skills</span>
              <span className="font-bold text-lg text-foreground">{skills.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - AI Learning Guide */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <AILearningGuide />
      </div>


      {/* Skill Stars/Nodes with Constellation Lines */}
      <div className="relative w-full h-screen">
        <ConstellationLines skills={displayedSkills} />
        {displayedSkills.map((skill) => (
          <SkillStar
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>

      {/* Course Detail Panel */}
      <SkillPanel
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onUnmaster={handleUnmaster}
      />
    </div>
  );
};

export default Index;
