import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Lightbulb, Play } from "lucide-react";
import { toast } from "sonner";
import { CodeChallenge, completeChallenge } from "@/utils/challengeSystem";
import { completeSkill } from "@/utils/progressSystem";

interface CodeEditorProps {
  challenge: CodeChallenge;
  onComplete: () => void;
}

export const CodeEditor = ({ challenge, onComplete }: CodeEditorProps) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const runCode = () => {
    // Simple validation - check if code contains key elements
    const codeNormalized = code.toLowerCase().replace(/\s/g, '');
    const solutionNormalized = challenge.solution.toLowerCase().replace(/\s/g, '');
    
    // Check if major elements are present (not exact match, but close enough)
    const isCorrect = challenge.testCases.every(test => {
      if (test.input === 'structure') {
        return test.expected.split(',').every(tag => codeNormalized.includes(tag));
      }
      if (test.input === 'elements') {
        return test.expected.split(',').every(el => codeNormalized.includes(el));
      }
      if (test.input === 'display') {
        return codeNormalized.includes('flex');
      }
      if (test.input === 'centering') {
        return codeNormalized.includes('center');
      }
      return true;
    });

    if (isCorrect || codeNormalized.includes(solutionNormalized)) {
      completeChallenge(challenge.id);
      const progress = completeSkill(challenge.skillId);
      toast.success("Challenge Completed! 🎉", {
        description: `+${challenge.xpReward} XP earned! Level ${progress.level}`
      });
      onComplete();
    } else {
      toast.error("Not quite right", {
        description: "Try again or use a hint!"
      });
    }
  };

  const showNextHint = () => {
    if (currentHint < challenge.hints.length) {
      setShowHints(true);
      toast.info(challenge.hints[currentHint], {
        description: `Hint ${currentHint + 1} of ${challenge.hints.length}`
      });
      setCurrentHint(prev => prev + 1);
    }
  };

  return (
    <Card className="glass-panel border-border/40">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {challenge.completed && <CheckCircle2 className="w-5 h-5 text-primary" />}
              {challenge.title}
            </CardTitle>
            <CardDescription className="mt-2">{challenge.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Reward</div>
            <div className="text-lg font-bold text-primary">+{challenge.xpReward} XP</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[300px] bg-background/50 border-primary/20 focus:border-primary/40"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={runCode} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button>
          <Button variant="outline" onClick={showNextHint} disabled={currentHint >= challenge.hints.length}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({currentHint}/{challenge.hints.length})
          </Button>
        </div>

        {showHints && currentHint > 0 && (
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-sm text-foreground/80">
              💡 {challenge.hints[currentHint - 1]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
