import { X, Sparkles, RotateCcw, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { unmasterSkill } from "@/utils/progressSystem";

interface Skill {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  unlocked: boolean;
  unlocks?: string[];
}

interface SkillPanelProps {
  skill: Skill | null;
  onClose: () => void;
  onComplete: (skillId: string) => void;
  onSkip: (skillId: string) => void;
  onUnmaster?: (skillId: string) => void;
}

export const SkillPanel = ({ skill, onClose, onComplete, onSkip, onUnmaster }: SkillPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (skill) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [skill]);

  const handleUnmaster = () => {
    if (skill && onUnmaster) {
      unmasterSkill(skill.id);
      onUnmaster(skill.id);
      toast({
        title: "Skill Unmastered",
        description: `${skill.name} has been reset. You can now practice it again!`,
      });
      onClose();
    }
  };

  if (!skill) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 z-40 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Glassmorphism Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[480px] glass-panel z-50 transition-all duration-500 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-3 cosmic-glow">
                {skill.name}
              </h2>
              <div className="flex items-center gap-2">
                {skill.completed ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/20 text-secondary border border-secondary/30">
                    Ready to Learn
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-8">
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                About This Skill
              </h3>
              <p className="text-foreground/90 leading-relaxed text-base">
                {skill.description}
              </p>
            </div>

            {skill.unlocks && skill.unlocks.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
                  This Unlocks
                </h3>
                <div className="space-y-2">
                  {skill.unlocks.map((unlock, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/10 to-transparent rounded-xl border border-secondary/20"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="text-sm text-foreground font-medium">{unlock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-8 border-t border-border/30 space-y-3">
          {!skill.completed ? (
              <>
                <Button
                  onClick={() => navigate(`/learn?skill=${skill.id}`)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-6 text-base shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Button
                  onClick={() => onSkip(skill.id)}
                  variant="outline"
                  className="w-full border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary/50 py-4 text-sm"
                >
                  Skip (I already know this)
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-6">
                  <div className="text-4xl mb-3 animate-bounce">🎉</div>
                  <p className="text-lg font-semibold text-primary cosmic-glow">
                    Mastered!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've completed this skill
                  </p>
                </div>
                <Button
                  onClick={handleUnmaster}
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 py-4"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Unmaster & Practice Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
