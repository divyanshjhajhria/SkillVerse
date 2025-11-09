/**
 * XP and Streak Tracking System
 * Manages user progress, daily streaks, and experience points
 */

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  totalSkillsCompleted: number;
  achievements: string[];
}

const XP_PER_SKILL = 100;
const XP_PER_LEVEL = 500;
const STORAGE_KEY = 'skillverse_progress';

/**
 * Get user progress from localStorage
 */
export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default progress
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalSkillsCompleted: 0,
    achievements: [],
  };
};

/**
 * Update streak based on last active date
 */
export const updateStreak = (progress: UserProgress): UserProgress => {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(progress.lastActiveDate);
  const todayDate = new Date(today);
  
  const diffTime = todayDate.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day, no change
    return progress;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    return {
      ...progress,
      streak: progress.streak + 1,
      lastActiveDate: today,
    };
  } else {
    // Streak broken
    return {
      ...progress,
      streak: 1,
      lastActiveDate: today,
    };
  }
};

/**
 * Add XP and check for level up
 */
export const addXP = (currentProgress: UserProgress, amount: number): UserProgress => {
  const newXP = currentProgress.xp + amount;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
  
  return {
    ...currentProgress,
    xp: newXP,
    level: newLevel,
  };
};

/**
 * Award XP for completing a skill or challenge
 */
export const completeSkill = (skillId: string, customXP?: number): UserProgress => {
  let progress = getProgress();
  
  // Update streak
  progress = updateStreak(progress);
  
  // Add XP (use custom amount for challenges or default for skills)
  progress = addXP(progress, customXP || XP_PER_SKILL);
  
  // Increment total skills only if no custom XP (means it's a skill completion)
  if (!customXP) {
    progress.totalSkillsCompleted += 1;
  }
  
  // Mark skill as completed
  markSkillCompleted(skillId);
  
  // Check for achievements
  progress = checkAchievements(progress);
  
  // Save to localStorage
  saveProgress(progress);
  
  // Update leaderboard
  const { updateLeaderboard } = require('./leaderboardSystem');
  updateLeaderboard(progress);
  
  return progress;
};

/**
 * Check and award achievements
 */
const checkAchievements = (progress: UserProgress): UserProgress => {
  const achievements = [...progress.achievements];
  
  // First skill
  if (progress.totalSkillsCompleted === 1 && !achievements.includes('first_skill')) {
    achievements.push('first_skill');
  }
  
  // 5 skills
  if (progress.totalSkillsCompleted === 5 && !achievements.includes('five_skills')) {
    achievements.push('five_skills');
  }
  
  // 7-day streak
  if (progress.streak === 7 && !achievements.includes('week_streak')) {
    achievements.push('week_streak');
  }
  
  // Level 5
  if (progress.level >= 5 && !achievements.includes('level_five')) {
    achievements.push('level_five');
  }
  
  return { ...progress, achievements };
};

/**
 * Save progress to localStorage
 */
export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

/**
 * Get XP needed for next level
 */
export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = Math.floor(currentXP / XP_PER_LEVEL) + 1;
  const nextLevelXP = currentLevel * XP_PER_LEVEL;
  return nextLevelXP - currentXP;
};

/**
 * Unmaster a skill - reset individual skill progress but keep XP
 */
export const unmasterSkill = (skillId: string): UserProgress => {
  const progress = getProgress();
  
  // Remove skill from completed list if it exists
  const completedSkills = JSON.parse(localStorage.getItem('skillverse_completed') || '[]');
  const updatedSkills = completedSkills.filter((id: string) => id !== skillId);
  localStorage.setItem('skillverse_completed', JSON.stringify(updatedSkills));
  
  // Save updated progress
  saveProgress(progress);
  
  return progress;
};

/**
 * Get all completed skills
 */
export const getCompletedSkills = (): string[] => {
  return JSON.parse(localStorage.getItem('skillverse_completed') || '[]');
};

/**
 * Mark skill as completed
 */
export const markSkillCompleted = (skillId: string): void => {
  const completedSkills = getCompletedSkills();
  if (!completedSkills.includes(skillId)) {
    completedSkills.push(skillId);
    localStorage.setItem('skillverse_completed', JSON.stringify(completedSkills));
  }
};

/**
 * Get achievement details
 */
export const getAchievementInfo = (achievementId: string) => {
  const achievements: Record<string, { name: string; description: string; icon: string }> = {
    first_skill: {
      name: "First Steps",
      description: "Complete your first skill",
      icon: "⭐",
    },
    five_skills: {
      name: "Quick Learner",
      description: "Complete 5 skills",
      icon: "🚀",
    },
    week_streak: {
      name: "Dedicated",
      description: "Maintain a 7-day streak",
      icon: "🔥",
    },
    level_five: {
      name: "Rising Star",
      description: "Reach level 5",
      icon: "🌟",
    },
  };
  
  return achievements[achievementId] || { name: "Unknown", description: "", icon: "🎖️" };
};
