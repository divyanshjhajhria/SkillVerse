/**
 * Leaderboard System
 * Manages global and skill-specific leaderboards
 */

import { UserProgress } from './progressSystem';

export interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  skillsCompleted: number;
  lastActive: string;
  rank?: number;
}

const LEADERBOARD_KEY = 'skillverse_leaderboard';
const USERNAME_KEY = 'skillverse_username';

/**
 * Get or set username
 */
export const getUsername = (): string => {
  const stored = localStorage.getItem(USERNAME_KEY);
  if (stored) return stored;
  
  const randomName = `Cosmic_${Math.random().toString(36).substring(2, 8)}`;
  localStorage.setItem(USERNAME_KEY, randomName);
  return randomName;
};

export const setUsername = (username: string): void => {
  localStorage.setItem(USERNAME_KEY, username);
};

/**
 * Update current user's leaderboard entry
 */
export const updateLeaderboard = (progress: UserProgress): void => {
  const leaderboard = getLeaderboard();
  const username = getUsername();
  const userId = 'current_user';
  
  const entry: LeaderboardEntry = {
    id: userId,
    username,
    xp: progress.xp,
    level: progress.level,
    streak: progress.streak,
    skillsCompleted: progress.totalSkillsCompleted,
    lastActive: new Date().toISOString(),
  };
  
  const existingIndex = leaderboard.findIndex(e => e.id === userId);
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = entry;
  } else {
    leaderboard.push(entry);
  }
  
  // Add some demo users for testing
  if (leaderboard.length === 1) {
    leaderboard.push(
      {
        id: 'demo1',
        username: 'StarCoder_Elite',
        xp: 2500,
        level: 6,
        streak: 15,
        skillsCompleted: 12,
        lastActive: new Date().toISOString(),
      },
      {
        id: 'demo2',
        username: 'Galaxy_Master',
        xp: 1800,
        level: 4,
        streak: 8,
        skillsCompleted: 9,
        lastActive: new Date().toISOString(),
      },
      {
        id: 'demo3',
        username: 'Nebula_Dev',
        xp: 1500,
        level: 4,
        streak: 5,
        skillsCompleted: 7,
        lastActive: new Date().toISOString(),
      },
      {
        id: 'demo4',
        username: 'Cosmic_Wizard',
        xp: 1200,
        level: 3,
        streak: 10,
        skillsCompleted: 6,
        lastActive: new Date().toISOString(),
      }
    );
  }
  
  // Sort by XP descending and assign ranks
  leaderboard.sort((a, b) => b.xp - a.xp);
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
};

/**
 * Get full leaderboard
 */
export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get top N entries
 */
export const getTopEntries = (limit: number = 10): LeaderboardEntry[] => {
  return getLeaderboard().slice(0, limit);
};

/**
 * Get current user's rank
 */
export const getCurrentUserRank = (): LeaderboardEntry | null => {
  const leaderboard = getLeaderboard();
  return leaderboard.find(e => e.id === 'current_user') || null;
};
