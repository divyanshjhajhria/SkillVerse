import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CosmicLogo } from '@/components/CosmicLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Flame, Star } from 'lucide-react';
import { getLeaderboard, getCurrentUserRank, type LeaderboardEntry } from '@/utils/leaderboardSystem';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
    setCurrentUser(getCurrentUserRank());
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <Star className="w-5 h-5 text-muted-foreground" />;
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank <= 3) return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col items-center mb-8">
          <CosmicLogo />
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Galactic Leaderboard
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Compete with cosmic coders across the universe. Rise through the ranks and claim your place among the stars.
          </p>
        </div>

        {currentUser && (
          <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRankIcon(currentUser.rank || 0)}
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{currentUser.username}</p>
                  <p className="text-sm text-muted-foreground">Level {currentUser.level}</p>
                </div>
                <div className="text-right">
                  <Badge variant={getRankBadgeVariant(currentUser.rank || 0)} className="text-lg px-4 py-2">
                    #{currentUser.rank}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{currentUser.xp} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Top Cosmic Coders</CardTitle>
            <CardDescription>The brightest stars in the Skillverse galaxy</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      entry.id === 'current_user'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-12">
                        {getRankIcon(entry.rank || 0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold truncate">{entry.username}</p>
                          {entry.id === 'current_user' && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Level {entry.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {entry.streak} day streak
                          </span>
                          <span>{entry.skillsCompleted} skills</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <Badge variant={getRankBadgeVariant(entry.rank || 0)} className="mb-1">
                          #{entry.rank}
                        </Badge>
                        <p className="text-lg font-bold text-primary">{entry.xp} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
