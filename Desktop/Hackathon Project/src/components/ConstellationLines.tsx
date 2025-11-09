import { useMemo } from "react";
import { Skill } from "@/utils/skillGraph";

interface ConstellationLinesProps {
  skills: Skill[];
}

export const ConstellationLines = ({ skills }: ConstellationLinesProps) => {
  const lines = useMemo(() => {
    const result: Array<{ x1: number; y1: number; x2: number; y2: number; active: boolean }> = [];
    
    skills.forEach((skill) => {
      if (skill.unlocks && skill.unlocks.length > 0) {
        skill.unlocks.forEach((unlockId) => {
          const targetSkill = skills.find((s) => s.id === unlockId.toLowerCase());
          if (targetSkill) {
            result.push({
              x1: skill.x,
              y1: skill.y,
              x2: targetSkill.x,
              y2: targetSkill.y,
              active: skill.completed && targetSkill.unlocked,
            });
          }
        });
      }
    });
    
    return result;
  }, [skills]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lineGradientInactive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {lines.map((line, index) => (
        <line
          key={index}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={line.active ? "url(#lineGradientActive)" : "url(#lineGradientInactive)"}
          strokeWidth={line.active ? "2" : "1"}
          strokeDasharray={line.active ? "none" : "5,5"}
          className={line.active ? "animate-pulse" : ""}
          style={{
            filter: line.active 
              ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" 
              : "none",
          }}
        />
      ))}
    </svg>
  );
};
