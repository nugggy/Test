import type { HandStyle, NumberStyle } from "@/lib/easy-read-clock-storage";

interface AnalogClockFaceProps {
  hour: number;
  minute: number;
  second: number;
  showSeconds: boolean;
  color: string;
  scale: number;
  numberStyle: NumberStyle;
  showMinuteTicks: boolean;
  faceColor: string;
  secondHandColor: string;
  handStyle: HandStyle;
}

const ROMAN_NUMERALS = [
  "XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI",
];

/** `hourTip`/`minuteTip` are the distance in SVG units from the centre
 * (100,100) to the tip of each hand; `tail` lets a hand poke out the back
 * of the centre point for a "modern" counterweighted look. */
const HAND_LENGTHS: Record<
  HandStyle,
  { hourTip: number; minuteTip: number; hourWidth: number; minuteWidth: number; tail: number }
> = {
  classic: { hourTip: 55, minuteTip: 75, hourWidth: 7, minuteWidth: 5, tail: 0 },
  modern: { hourTip: 52, minuteTip: 78, hourWidth: 10, minuteWidth: 7, tail: 16 },
  minimal: { hourTip: 55, minuteTip: 76, hourWidth: 4, minuteWidth: 3, tail: 0 },
};

export default function AnalogClockFace({
  hour,
  minute,
  second,
  showSeconds,
  color,
  scale,
  numberStyle,
  showMinuteTicks,
  faceColor,
  secondHandColor,
  handStyle,
}: AnalogClockFaceProps) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;
  const size = 220 * Math.min(scale, 1.6);
  const hands = HAND_LENGTHS[handStyle];

  return (
    <svg
      role="img"
      aria-label={`Analog clock showing ${hour}:${String(minute).padStart(2, "0")}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
    >
      <circle
        cx={100}
        cy={100}
        r={94}
        fill={faceColor === "transparent" ? "none" : faceColor}
        stroke={color}
        strokeWidth={4}
      />
      {Array.from({ length: 60 }, (_, i) => {
        const isHour = i % 5 === 0;
        if (!isHour && !showMinuteTicks) return null;
        const angle = i * 6;
        const r1 = isHour ? 78 : 84;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + r1 * Math.sin(rad);
        const y1 = 100 - r1 * Math.cos(rad);
        const x2 = 100 + 90 * Math.sin(rad);
        const y2 = 100 - 90 * Math.cos(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={isHour ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}
      {numberStyle !== "none" &&
        Array.from({ length: 12 }, (_, i) => {
          const position = i === 0 ? 12 : i;
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          const r = 63;
          const x = 100 + r * Math.sin(rad);
          const y = 100 - r * Math.cos(rad);
          const label = numberStyle === "roman" ? ROMAN_NUMERALS[i] : String(position);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize={numberStyle === "roman" ? 15 : 18}
              fontWeight={700}
              className="font-display select-none"
            >
              {label}
            </text>
          );
        })}
      <line
        x1={100}
        y1={100 + hands.tail}
        x2={100}
        y2={100 - hands.hourTip}
        stroke={color}
        strokeWidth={hands.hourWidth}
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      <line
        x1={100}
        y1={100 + hands.tail}
        x2={100}
        y2={100 - hands.minuteTip}
        stroke={color}
        strokeWidth={hands.minuteWidth}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      {showSeconds && (
        <line
          x1={100}
          y1={112}
          x2={100}
          y2={18}
          stroke={secondHandColor}
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 100 100)`}
        />
      )}
      <circle cx={100} cy={100} r={handStyle === "minimal" ? 4 : 6} fill={color} />
    </svg>
  );
}
