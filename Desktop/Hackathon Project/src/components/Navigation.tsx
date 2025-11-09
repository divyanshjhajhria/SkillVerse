import { Link, useLocation } from "react-router-dom";
import { Sparkles, Trophy, Settings, Map, Gamepad2, Award, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: Map, label: "My Galaxy" },
    { path: "/skills", icon: Sparkles, label: "Skills" },
    { path: "/learn", icon: Gamepad2, label: "Learn" },
    { path: "/progress", icon: Trophy, label: "Progress" },
    { path: "/leaderboard", icon: Award, label: "Leaderboard" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];
  
  return (
    <nav className="fixed top-8 right-8 z-50 glass-panel rounded-2xl p-2 animate-fade-in">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`relative transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
