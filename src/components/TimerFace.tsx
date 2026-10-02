export type TimerFaceStyle = "pie" | "bar";

interface TimerFaceProps {
  remainingSeconds: number;
  totalSeconds: number;
  style: TimerFaceStyle;
  color: string;
  size: number;
  /** Smaller digits/bar height, for use inline in a list row rather than
   * as the main display of a whole tool. */
  compact?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

/** A pie wedge representing the fraction of time remaining, shrinking
 * clockwise from the top - the classic "Time Timer" visual. */
function wedgePath(cx: number, cy: number, r: number, fraction: number) {
  if (fraction >= 0.999) return null; // caller draws a full circle instead
  if (fraction <= 0.001) return null; // nothing left to draw
  const endAngle = fraction * 360;
  const start = polarToCartesian(cx, cy, r, 0);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** A shrinking pie ("Time Timer" style) or bar showing time remaining, with
 * the digits overlaid. Shared by the Visual Timer and the Visual Schedule
 * Builder's per-step countdown - deliberately generic (no timer-specific
 * storage or settings coupling), just remaining/total seconds in, an SVG or
 * bar out. */
export default function TimerFace({
  remainingSeconds,
  totalSeconds,
  style,
  color,
  size,
  compact = false,
}: TimerFaceProps) {
  const fraction = totalSeconds > 0 ? Math.min(1, Math.max(0, remainingSeconds / totalSeconds)) : 0;
  const label = `${formatClock(remainingSeconds)} remaining`;
  const digitsClass = compact
    ? "text-lg font-extrabold sm:text-xl"
    : "text-4xl font-extrabold sm:text-5xl";

  if (style === "bar") {
    const barHeight = compact ? Math.max(size * 0.22, 24) : Math.max(size * 0.28, 48);
    return (
      <div className="flex w-full flex-col items-center gap-2" style={{ maxWidth: size }}>
        <div
          role="img"
          aria-label={label}
          className="w-full overflow-hidden rounded-2xl border-2"
          style={{ height: barHeight, borderColor: color, background: "var(--background)" }}
        >
          <div
            className="h-full transition-[width] duration-500 ease-linear"
            style={{ width: `${fraction * 100}%`, backgroundColor: color }}
          />
        </div>
        <span className={`font-display tabular-nums ${digitsClass}`}>
          {formatClock(remainingSeconds)}
        </span>
      </div>
    );
  }

  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const path = wedgePath(cx, cy, r, fraction);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        role="img"
        aria-label={label}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <circle cx={cx} cy={cy} r={r} fill="var(--background)" stroke={color} strokeWidth={4} />
        {fraction >= 0.999 ? (
          <circle cx={cx} cy={cy} r={r} fill={color} />
        ) : (
          path && <path d={path} fill={color} />
        )}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={4} />
      </svg>
      <span
        className={`font-display tabular-nums pointer-events-none absolute inset-0 flex items-center justify-center ${digitsClass}`}
        style={{
          // The wedge always covers the centre point once any time is left
          // (the pie is drawn from the centre outward), so the digits sit
          // on the fill colour whenever the timer isn't fully elapsed.
          // Ink is picked per colour, so light presets (like sunshine yellow)
          // get dark digits instead of unreadable white ones.
          color: remainingSeconds > 0 ? inkFor(color) : "var(--foreground)",
          textShadow:
            remainingSeconds > 0 && inkFor(color) === "#ffffff" ? "0 1px 3px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {formatClock(remainingSeconds)}
      </span>
    </div>
  );
}

/** White or near-black, whichever contrasts more with a #rrggbb colour. */
function inkFor(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  const onWhite = 1.05 / (lum + 0.05);
  const onDark = (lum + 0.05) / 0.0599; // #1c1917
  return onDark > onWhite ? "#1c1917" : "#ffffff";
}
