export type BuddyMood = "happy" | "wave" | "cheer" | "think" | "sleepy";

interface BuddyProps {
  mood?: BuddyMood;
  /** Sizing classes, e.g. "h-32 w-32". */
  className?: string;
}

/**
 * Buddy, the My Support Buddy mascot: the brand mark's smiling face with a
 * body, arms and an antenna, in a few moods. Blinks, bobs and waves using
 * CSS only (see the .buddy-* rules in globals.css), and all of that motion
 * stops under prefers-reduced-motion or the site's own "Reduce motion"
 * setting. Always decorative: callers carry any meaning in text.
 */
export default function Buddy({ mood = "happy", className = "h-32 w-32" }: BuddyProps) {
  const armsUp = mood === "cheer";
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 200"
      className={`deco shrink-0 overflow-visible ${className}`}
    >
      <ellipse cx="100" cy="182" rx="46" ry="6" fill="var(--foreground)" opacity="0.08" />
      <g className="buddy-bob">
        {/* antenna */}
        <path d="M100 38 V20" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" />
        <circle className="buddy-glow" cx="100" cy="16" r="9" fill="var(--accent)" />

        {/* arms (behind the body) */}
        <g stroke="var(--brand)" strokeWidth="13" strokeLinecap="round" fill="none">
          {armsUp ? (
            <path className="buddy-wave-left" d="M48 104 L22 66" />
          ) : (
            <path d="M48 106 L26 132" />
          )}
          {mood === "wave" || armsUp ? (
            <path className="buddy-wave" d="M152 104 L180 64" />
          ) : mood === "think" ? (
            <path d="M152 108 Q170 132 132 128" />
          ) : (
            <path d="M152 106 L174 132" />
          )}
        </g>

        {/* feet and body */}
        <rect x="66" y="150" width="24" height="22" rx="10" fill="var(--brand)" />
        <rect x="110" y="150" width="24" height="22" rx="10" fill="var(--brand)" />
        <rect x="40" y="38" width="120" height="122" rx="36" fill="var(--brand)" />
        <circle cx="100" cy="94" r="42" fill="#ffffff" />

        {/* cheeks */}
        <circle cx="74" cy="104" r="6.5" fill="#f7a1a0" opacity="0.75" />
        <circle cx="126" cy="104" r="6.5" fill="#f7a1a0" opacity="0.75" />

        {/* eyes */}
        {mood === "sleepy" ? (
          <g stroke="#c23b37" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M79 88 Q86 94 93 88" />
            <path d="M107 88 Q114 94 121 88" />
          </g>
        ) : (
          <g className="buddy-blink" fill="#1c1917">
            <circle cx={mood === "think" ? 89 : 86} cy={mood === "think" ? 84 : 88} r="6" />
            <circle cx={mood === "think" ? 117 : 114} cy={mood === "think" ? 84 : 88} r="6" />
            <circle cx={mood === "think" ? 91 : 88} cy={mood === "think" ? 82 : 86} r="2" fill="#ffffff" />
            <circle cx={mood === "think" ? 119 : 116} cy={mood === "think" ? 82 : 86} r="2" fill="#ffffff" />
          </g>
        )}

        {/* mouth */}
        {mood === "cheer" ? (
          <path d="M84 104 Q100 128 116 104 Z" fill="#c23b37" />
        ) : mood === "think" ? (
          <path d="M90 112 Q100 108 112 111" stroke="#c23b37" strokeWidth="5" strokeLinecap="round" fill="none" />
        ) : mood === "sleepy" ? (
          <circle cx="100" cy="112" r="4.5" fill="#c23b37" />
        ) : (
          <path d="M84 106 Q100 122 116 106" stroke="#c23b37" strokeWidth="6" strokeLinecap="round" fill="none" />
        )}
      </g>

      {mood === "think" && (
        <text x="160" y="40" className="buddy-float font-display" fontSize="34" fontWeight="700" fill="var(--accent)">
          ?
        </text>
      )}
      {mood === "sleepy" && (
        <text x="150" y="44" className="buddy-float font-display" fontSize="26" fontWeight="700" fill="var(--muted)">
          z z
        </text>
      )}
    </svg>
  );
}
