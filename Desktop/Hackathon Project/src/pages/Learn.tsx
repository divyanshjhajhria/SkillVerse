import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { CodeEditor } from "@/components/CodeEditor";
import { QuizChallenge } from "@/components/QuizChallenge";
import { CheatSheet } from "@/components/CheatSheet";
import { PlanetDebugger } from "@/components/games/PlanetDebugger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Gamepad2, BookOpen, Trophy, Zap, Book } from "lucide-react";
import { 
  getAllChallenges, 
  getChallengesForSkill, 
  getChallengeStats,
  CodeChallenge as CodeChallengeType,
  QuizChallenge as QuizChallengeType,
  GameChallenge as GameChallengeType,
  cheatSheets
} from "@/utils/challengeSystem";
import { buildSkillsFromStorage } from "@/utils/skillGraph";

const Learn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillId = searchParams.get('skill');
  const [challenges, setChallenges] = useState<(CodeChallengeType | QuizChallengeType | GameChallengeType)[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CodeChallengeType | QuizChallengeType | GameChallengeType | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [stats, setStats] = useState(getChallengeStats());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadChallenges();
  }, [skillId]);

  const loadChallenges = () => {
    const allChallenges = skillId ? getChallengesForSkill(skillId) : getAllChallenges();
    setChallenges(allChallenges);
    setStats(getChallengeStats());
  };

  const handleChallengeComplete = () => {
    loadChallenges();
    setSelectedChallenge(null);
  };

  const handleSkipChallenge = () => {
    if (skillId) {
      // Find next unlocked skill
      const skills = buildSkillsFromStorage();
      const currentIndex = skills.findIndex(s => s.id === skillId);
      
      // Look for next unlocked skill
      let nextSkill = null;
      for (let i = currentIndex + 1; i < skills.length; i++) {
        if (skills[i].unlocked && !skills[i].completed) {
          nextSkill = skills[i];
          break;
        }
      }
      
      if (nextSkill) {
        navigate(`/learn?skill=${nextSkill.id}`);
      } else {
        // No more skills, go back to main menu
        navigate('/');
      }
    } else {
      setSelectedChallenge(null);
    }
  };

  const filterChallenges = (type: string) => {
    if (type === "all") return challenges;
    return challenges.filter(c => c.type === type);
  };

  const getSkillName = (skillId: string) => {
    const skills = buildSkillsFromStorage();
    return skills.find(s => s.id === skillId)?.name || skillId;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-primary';
      case 'intermediate': return 'text-secondary';
      case 'advanced': return 'text-accent';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'quiz': return <BookOpen className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      default: return null;
    }
  };

  if (showCheatSheet && skillId && cheatSheets[skillId]) {
    return (
      <div className="min-h-screen bg-background relative overflow-y-auto">
        <div className="fixed inset-0 bg-nebula-gradient -z-10" />
        <ShootingStars />
        <CosmicLogo />
        <Navigation />

        <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
          <Button 
            onClick={() => setShowCheatSheet(false)} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Challenges
          </Button>
          <CheatSheet data={cheatSheets[skillId]} />
        </div>
      </div>
    );
  }

  if (selectedChallenge) {
    return (
      <div className="min-h-screen bg-background relative overflow-y-auto">
        <div className="fixed inset-0 bg-nebula-gradient -z-10" />
        <ShootingStars />
        <CosmicLogo />
        <Navigation />

        <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
          <button
            onClick={() => setSelectedChallenge(null)}
            className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Challenges
          </button>

          {selectedChallenge.type === 'code' && (
            <CodeEditor 
              challenge={selectedChallenge as CodeChallengeType} 
              onComplete={handleChallengeComplete}
            />
          )}
          {selectedChallenge.type === 'quiz' && (
            <QuizChallenge 
              challenge={selectedChallenge as QuizChallengeType} 
              onComplete={handleChallengeComplete}
              onSkip={handleSkipChallenge}
            />
          )}
          {selectedChallenge.type === 'game' && (
            <PlanetDebugger 
              challenge={selectedChallenge as GameChallengeType} 
              onComplete={handleChallengeComplete}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      <CosmicLogo />
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Learn & Practice</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            {skillId ? `Master ${getSkillName(skillId)} with hands-on challenges` : 'Interactive challenges, quizzes, and games'}
          </p>
          {skillId && cheatSheets[skillId] && (
            <Button 
              onClick={() => setShowCheatSheet(true)} 
              variant="outline"
              className="mt-2"
            >
              <Book className="mr-2 h-4 w-4" />
              View {getSkillName(skillId)} Cheat Sheet
            </Button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="glass-panel border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                </div>
                <Trophy className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-secondary">{stats.completionRate}%</p>
                </div>
                <Zap className="w-8 h-8 text-secondary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">XP Earned</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalXPEarned}</p>
                </div>
                <Trophy className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <TabsList className="glass-panel border-border/40 mb-8">
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
            <TabsTrigger value="game">Games</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterChallenges(activeTab).map((challenge, index) => (
                <Card
                  key={challenge.id}
                  className="glass-panel border-border/40 hover:border-primary/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(challenge.type)}
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      {challenge.completed && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                    <CardDescription className="text-foreground/70">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {getSkillName(challenge.skillId)}
                      </span>
                      <span className="font-semibold text-primary">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Learn;
