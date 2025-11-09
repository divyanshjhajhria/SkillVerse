export const CosmicLogo = () => {
  return (
    <div className="fixed top-8 left-8 z-50 animate-fade-in">
      <h1 className="text-4xl font-bold text-foreground tracking-wider">
        <span className="cosmic-glow">Skill</span>
        <span className="text-primary cosmic-glow">Verse</span>
      </h1>
      <div className="h-0.5 w-32 bg-gradient-to-r from-primary via-accent to-transparent mt-2 animate-pulse" />
    </div>
  );
};
