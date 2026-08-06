import type { MoneyPieceDef } from "@/lib/money-data";

interface MoneyPieceIconProps {
  piece: MoneyPieceDef;
  /** Width in px. Height follows automatically (1:1 for coins, ~1:2 for notes). */
  width?: number;
}

function polygonPoints(sides: number, radius: number, cx: number, cy: number): string {
  const points: string[] = [];
  // Rotate so a flat edge sits at the top, which is how the real 50c piece
  // is usually drawn/oriented.
  const rotation = -Math.PI / 2 + Math.PI / sides;
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(" ");
}

/**
 * A simple, self-drawn illustration of an Australian coin or banknote -
 * not a reproduction of the real design (which is legally restricted and
 * not something to source from arbitrary places online). Coins and notes
 * are coloured and sized to loosely match the real thing (silver/gold
 * coins, note colours, the 50c piece's twelve sides, notes getting longer
 * as their value increases) so the shape and colour alone support
 * recognition, with the denomination printed clearly either way.
 */
export default function MoneyPieceIcon({ piece, width }: MoneyPieceIconProps) {
  if (piece.kind === "coin") {
    const size = width ?? piece.size;
    const isPolygon = piece.sides === 12;
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden="true"
        className="drop-shadow-sm"
      >
        {isPolygon ? (
          <polygon
            points={polygonPoints(12, 46, 50, 50)}
            fill={piece.color}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2"
          />
        ) : (
          <circle cx="50" cy="50" r="46" fill={piece.color} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        )}
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
        <text
          x="50"
          y="59"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="rgba(0,0,0,0.78)"
        >
          {piece.shortLabel}
        </text>
      </svg>
    );
  }

  // Notes: a rounded rectangle, wider for higher denominations (matching
  // the real 7mm-per-step length increase), with the value large and a
  // lighter watermark-style circle for visual interest.
  const noteWidth = width ?? piece.size;
  const noteHeight = noteWidth * 0.46;
  return (
    <svg
      viewBox={`0 0 ${piece.size} ${piece.size * 0.46}`}
      width={noteWidth}
      height={noteHeight}
      aria-hidden="true"
      className="drop-shadow-sm"
    >
      <rect
        x="1"
        y="1"
        width={piece.size - 2}
        height={piece.size * 0.46 - 2}
        rx="8"
        fill={piece.color}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
      />
      <circle
        cx={piece.size * 0.78}
        cy={piece.size * 0.23}
        r={piece.size * 0.15}
        fill="rgba(255,255,255,0.25)"
      />
      <text
        x={piece.size * 0.08}
        y={piece.size * 0.32}
        fontSize={piece.size * 0.22}
        fontWeight="700"
        fill="rgba(255,255,255,0.95)"
      >
        {piece.shortLabel}
      </text>
    </svg>
  );
}
