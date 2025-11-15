"use client";

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
};

export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up",
  className = ""
}: ScrollRevealProps) {
  // Always show content immediately - animations are optional enhancement
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Enhanced version using Intersection Observer directly
export function ScrollRevealAdvanced({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "",
  threshold = 0.1
}: ScrollRevealProps & { threshold?: number }) {
  // Always show content immediately - animations are optional enhancement
  return (
    <div className={className}>
      {children}
    </div>
  );
}

