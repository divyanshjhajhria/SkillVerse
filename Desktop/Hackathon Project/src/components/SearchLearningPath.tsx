import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const learningPaths: Record<string, string[]> = {
  'front end development': ['html', 'css', 'javascript', 'react', 'typescript'],
  'frontend development': ['html', 'css', 'javascript', 'react', 'typescript'],
  'front-end': ['html', 'css', 'javascript', 'react', 'typescript'],
  'back end development': ['javascript', 'node', 'express', 'database'],
  'backend development': ['javascript', 'node', 'express', 'database'],
  'back-end': ['javascript', 'node', 'express', 'database'],
  'full stack development': ['html', 'css', 'javascript', 'react', 'typescript', 'node', 'express', 'database'],
  'fullstack development': ['html', 'css', 'javascript', 'react', 'typescript', 'node', 'express', 'database'],
  'full-stack': ['html', 'css', 'javascript', 'react', 'typescript', 'node', 'express', 'database'],
  'web development': ['html', 'css', 'javascript', 'react'],
  'python': ['python', 'python-advanced'],
  'python development': ['python', 'python-advanced'],
  'html': ['html'],
  'css': ['css'],
  'javascript': ['javascript'],
  'react': ['react'],
  'typescript': ['typescript'],
  'node': ['node'],
  'responsive design': ['html', 'css', 'responsive'],
};

const pathDescriptions: Record<string, string> = {
  'front end development': 'Master HTML, CSS, JavaScript, React & TypeScript',
  'frontend development': 'Master HTML, CSS, JavaScript, React & TypeScript',
  'front-end': 'Master HTML, CSS, JavaScript, React & TypeScript',
  'back end development': 'Learn server-side JavaScript, Node.js, Express & Databases',
  'backend development': 'Learn server-side JavaScript, Node.js, Express & Databases',
  'back-end': 'Learn server-side JavaScript, Node.js, Express & Databases',
  'full stack development': 'Complete web development from frontend to backend',
  'fullstack development': 'Complete web development from frontend to backend',
  'full-stack': 'Complete web development from frontend to backend',
  'web development': 'Build modern websites with HTML, CSS, JavaScript & React',
  'python': 'Learn Python programming from basics to advanced',
  'python development': 'Learn Python programming from basics to advanced',
  'html': 'Start with HTML fundamentals',
  'css': 'Master CSS styling',
  'javascript': 'Learn JavaScript programming',
  'react': 'Build apps with React',
  'typescript': 'Type-safe JavaScript with TypeScript',
  'node': 'Server-side JavaScript with Node.js',
  'responsive design': 'Create mobile-friendly websites',
};

interface SearchLearningPathProps {
  onSubmit?: (skillIds: string[]) => void;
}

export const SearchLearningPath = ({ onSubmit }: SearchLearningPathProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredSuggestions = Object.keys(learningPaths).filter((path) =>
        path.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (pathKey?: string) => {
    const key = pathKey || searchQuery.toLowerCase();
    const coursePath = learningPaths[key];
    
    if (coursePath && coursePath.length > 0) {
      if (onSubmit) {
        // If onSubmit callback provided, use it (for welcome screen)
        onSubmit(coursePath);
      } else {
        // Otherwise navigate to the first course
        navigate(`/learn?skill=${coursePath[0]}`);
      }
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="What do you want to learn? (e.g., front end development)"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 pr-4 h-14 text-lg glass-panel border-2 border-primary/20 focus:border-primary/40"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 glass-panel border-primary/20 animate-fade-in">
          <CardContent className="p-2">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(suggestion)}
                className="w-full text-left p-4 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground capitalize">
                        {suggestion}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pathDescriptions[suggestion]}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
