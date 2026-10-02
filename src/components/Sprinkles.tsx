import type { CSSProperties, ReactNode } from "react";

type Shape = "star" | "squiggle" | "ring" | "triangle" | "plus" | "dot";

interface Sprinkle {
  shape: Shape;
  /** Any CSS colour, usually a var(--solid-*) or var(--accent) token. */
  color: string;
  top: string;
  left: string;
  /** Size in px. */
  size: number;
  rotate?: number;
  /** Seconds, staggers the gentle float so pieces don't move in step. */
  delay?: number;
}

const PATHS: Record<Shape, ReactNode> = {
  star: <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.8l7.1-.7z" fill="currentColor" />,
  squiggle: (
    <path
      d="M2 14c3-6 6-6 8 0s5 6 8 0 4-6 4-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  ),
  ring: <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3.5" />,
  triangle: <path d="M12 3l9.5 17h-19z" fill="currentColor" strokeLinejoin="round" />,
  plus: <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />,
  dot: <circle cx="12" cy="12" r="7" fill="currentColor" />,
};

/** Ready-made layouts so pages don't hand-place confetti. */
export const SPRINKLE_SETS = {
  hero: [
    { shape: "star", color: "var(--accent)", top: "8%", left: "88%", size: 26, rotate: 12 },
    { shape: "squiggle", color: "var(--solid-communication)", top: "30%", left: "93%", size: 30, rotate: -20, delay: 0.8 },
    { shape: "ring", color: "var(--solid-wellbeing)", top: "4%", left: "60%", size: 18, delay: 1.6 },
    { shape: "triangle", color: "var(--solid-living)", top: "88%", left: "52%", size: 16, rotate: 18, delay: 0.4 },
    { shape: "plus", color: "var(--solid-emotional)", top: "62%", left: "4%", size: 16, delay: 1.2 },
    { shape: "dot", color: "var(--solid-preparation)", top: "92%", left: "8%", size: 10, delay: 2 },
  ],
  tool: [
    { shape: "star", color: "var(--accent)", top: "14%", left: "80%", size: 22, rotate: 14 },
    { shape: "squiggle", color: "currentColor", top: "70%", left: "90%", size: 28, rotate: -14, delay: 0.9 },
    { shape: "ring", color: "currentColor", top: "10%", left: "62%", size: 14, delay: 1.7 },
    { shape: "plus", color: "currentColor", top: "78%", left: "70%", size: 12, delay: 0.5 },
    { shape: "dot", color: "var(--accent)", top: "48%", left: "96%", size: 9, delay: 1.3 },
  ],
} satisfies Record<string, Sprinkle[]>;

interface SprinklesProps {
  items: Sprinkle[];
  /** Colour used where an item says "currentColor" (e.g. a category's solid colour). */
  className?: string;
}

/**
 * Decorative confetti: small shapes that float very gently. Hidden from
 * screen readers, in print and in high-contrast mode (the .deco class), and
 * still under reduced motion.
 */
export default function Sprinkles({ items, className = "" }: SprinklesProps) {
  return (
    <span aria-hidden="true" className={`deco no-print pointer-events-none absolute inset-0 ${className}`}>
      {items.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          className="sprinkle absolute overflow-visible"
          style={
            {
              top: s.top,
              left: s.left,
              color: s.color,
              "--r": `${s.rotate ?? 0}deg`,
              animationDelay: `${s.delay ?? 0}s`,
            } as CSSProperties
          }
        >
          {PATHS[s.shape]}
        </svg>
      ))}
    </span>
  );
}
