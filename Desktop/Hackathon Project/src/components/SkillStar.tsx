import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  completed: boolean;
  unlocked: boolean;
  x: number;
  y: number;
}

interface SkillStarProps {
  skill: Skill;
  onClick: () => void;
}

export const SkillStar = ({ skill, onClick }: SkillStarProps) => {
  const [ripple, setRipple] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (skill.completed) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [skill.completed]);

  const getGlowClass = () => {
    if (skill.completed) return "skill-glow-completed";
    if (skill.unlocked) return "skill-glow-unlocked";
    return "skill-glow-locked";
  };

  return (
    <div
      className={`absolute transition-all duration-500 ${
        skill.unlocked ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
      } ${hover && skill.unlocked ? "scale-150" : "scale-100"}`}
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={() => skill.unlocked && onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Completion ripple effect */}
      {ripple && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-60" 
          style={{ 
            width: "40px", 
            height: "40px", 
            margin: "-15px",
            backgroundColor: "hsl(var(--glow-completed))" 
          }} 
        />
      )}
      
      {/* Pulsing glow aura */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          skill.completed || skill.unlocked ? "animate-pulse" : ""
        }`}
        style={{
          width: hover ? "50px" : "40px",
          height: hover ? "50px" : "40px",
          margin: hover ? "-20px" : "-15px",
          backgroundColor: skill.completed
            ? "hsl(var(--glow-completed))"
            : skill.unlocked
            ? "hsl(var(--glow-unlocked))"
            : "hsl(var(--glow-locked))",
          opacity: skill.completed ? 0.9 : skill.unlocked ? 0.7 : 0.3,
        }}
      />
      
      {/* Core star */}
      <div
        className={`relative rounded-full transition-all duration-500 ${getGlowClass()}`}
        style={{
          width: hover ? "10px" : "8px",
          height: hover ? "10px" : "8px",
          backgroundColor: skill.completed
            ? "hsl(var(--glow-completed))"
            : skill.unlocked
            ? "hsl(var(--glow-unlocked))"
            : "hsl(var(--glow-locked))",
          boxShadow: skill.completed
            ? "0 0 25px hsl(var(--glow-completed)), inset 0 0 12px rgba(255,255,255,0.6)"
            : skill.unlocked
            ? "0 0 20px hsl(var(--glow-unlocked)), inset 0 0 8px rgba(255,255,255,0.4)"
            : "0 0 8px hsl(var(--glow-locked))",
        }}
      />

      {/* Hover tooltip */}
      {skill.unlocked && hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 glass-panel rounded-xl text-sm whitespace-nowrap animate-fade-in">
          <div className="font-bold text-foreground cosmic-glow">{skill.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {skill.completed ? "✨ Mastered" : "Click to explore"}
          </div>
        </div>
      )}
    </div>
  );
};
