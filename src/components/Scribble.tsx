import type { ReactNode } from "react";

interface ScribbleProps {
  children: ReactNode;
  /** Stroke colour; defaults to the sunshine accent. */
  color?: string;
}

/**
 * Wraps a word or two in a hand-drawn marker underline that draws itself
 * in once (instantly under reduced motion). Decorative only: the text is
 * read normally.
 */
export default function Scribble({ children, color = "var(--accent)" }: ScribbleProps) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="deco absolute -bottom-1.5 left-0 z-0 h-3 w-full"
      >
        <path
          className="scribble-draw"
          d="M3 10 C 45 3, 110 2, 197 8"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    </span>
  );
}
