export interface Skill {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  unlocked: boolean;
  x: number;
  y: number;
  requires?: string[];
  unlocks?: string[];
}

export const initialSkills: Omit<Skill, "completed" | "unlocked">[] = [
  // Gemini Constellation - Frontend Skills
  // Positioned to form the actual Gemini constellation pattern (the Twins)
  
  // Pollux (Right Twin) - Main HTML branch
  {
    id: "html",
    name: "HTML",
    description: "Learn the foundation of web development. Master semantic HTML, forms, tables, and document structure.",
    x: 35,
    y: 70,
    requires: [],
    unlocks: ["CSS", "JavaScript", "Git"],
  },
  
  // CSS Branch (Left side of Pollux)
  {
    id: "css",
    name: "CSS",
    description: "Style your web pages with CSS. Learn selectors, layouts, animations, and responsive design.",
    x: 25,
    y: 55,
    requires: ["html"],
    unlocks: ["Sass", "Tailwind"],
  },
  {
    id: "sass",
    name: "Sass",
    description: "Advanced CSS with variables, nesting, and mixins for scalable stylesheets.",
    x: 20,
    y: 40,
    requires: ["css"],
    unlocks: [],
  },
  {
    id: "tailwind",
    name: "Tailwind",
    description: "Utility-first CSS framework for rapid UI development.",
    x: 18,
    y: 25,
    requires: ["css"],
    unlocks: [],
  },
  
  // Castor (Left Twin) - JavaScript branch
  {
    id: "javascript",
    name: "JavaScript",
    description: "Add interactivity to your websites. Learn variables, functions, DOM manipulation, and modern ES6+ features.",
    x: 45,
    y: 60,
    requires: ["html"],
    unlocks: ["TypeScript", "React", "Node.js"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "JavaScript with static typing for safer, more maintainable code.",
    x: 42,
    y: 45,
    requires: ["javascript"],
    unlocks: [],
  },
  {
    id: "react",
    name: "React",
    description: "Build dynamic user interfaces with React components, hooks, and state management.",
    x: 48,
    y: 30,
    requires: ["javascript"],
    unlocks: ["Next.js"],
  },
  {
    id: "next.js",
    name: "Next.js",
    description: "Full-stack React framework with SSR, routing, and API routes.",
    x: 50,
    y: 15,
    requires: ["react"],
    unlocks: [],
  },
  
  // Backend Constellation
  {
    id: "node.js",
    name: "Node.js",
    description: "Server-side JavaScript runtime for building scalable backend applications.",
    x: 65,
    y: 50,
    requires: ["javascript"],
    unlocks: ["Express", "MongoDB"],
  },
  {
    id: "express",
    name: "Express",
    description: "Fast, minimalist web framework for Node.js APIs and servers.",
    x: 70,
    y: 35,
    requires: ["node.js"],
    unlocks: [],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "NoSQL database for flexible, scalable data storage.",
    x: 75,
    y: 45,
    requires: ["node.js"],
    unlocks: [],
  },
  
  // Python Constellation
  {
    id: "python",
    name: "Python",
    description: "Master Python programming for backend development, data science, and automation.",
    x: 75,
    y: 65,
    requires: ["javascript"],
    unlocks: ["Django", "FastAPI"],
  },
  {
    id: "django",
    name: "Django",
    description: "High-level Python web framework for rapid development.",
    x: 80,
    y: 55,
    requires: ["python"],
    unlocks: [],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    description: "Modern, fast Python web framework for building APIs.",
    x: 85,
    y: 65,
    requires: ["python"],
    unlocks: [],
  },
  
  // DevOps Constellation
  {
    id: "git",
    name: "Git",
    description: "Version control essentials. Learn commits, branches, merging, and collaboration with GitHub.",
    x: 35,
    y: 75,
    requires: ["html"],
    unlocks: ["Docker"],
  },
  {
    id: "docker",
    name: "Docker",
    description: "Containerize applications for consistent deployment across environments.",
    x: 40,
    y: 85,
    requires: ["git"],
    unlocks: [],
  },
];

export const checkUnlocked = (skill: Omit<Skill, "completed" | "unlocked">, completedSkills: Set<string>): boolean => {
  if (!skill.requires || skill.requires.length === 0) {
    return true;
  }
  return skill.requires.every((reqId) => completedSkills.has(reqId));
};

export const buildSkillsFromStorage = (): Skill[] => {
  const completed = new Set<string>(
    JSON.parse(localStorage.getItem("skillverse_completed") || "[]")
  );

  return initialSkills.map((skill) => ({
    ...skill,
    completed: completed.has(skill.id),
    unlocked: checkUnlocked(skill, completed),
  }));
};

export const saveProgress = (completedSkills: Set<string>) => {
  localStorage.setItem("skillverse_completed", JSON.stringify([...completedSkills]));
};
