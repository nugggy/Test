interface AnalogClockFaceProps {
  hour: number;
  minute: number;
  second: number;
  showSeconds: boolean;
  color: string;
  scale: number;
}

export default function AnalogClockFace({
  hour,
  minute,
  second,
  showSeconds,
  color,
  scale,
}: AnalogClockFaceProps) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;
  const size = 220 * Math.min(scale, 1.6);

  return (
    <svg
      role="img"
      aria-label={`Analog clock showing ${hour}:${String(minute).padStart(2, "0")}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
    >
      <circle cx={100} cy={100} r={94} fill="none" stroke={color} strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30;
        const isMajor = i % 3 === 0;
        const r1 = isMajor ? 78 : 84;
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
            strokeWidth={isMajor ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1={100}
        y1={100}
        x2={100}
        y2={45}
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      <line
        x1={100}
        y1={100}
        x2={100}
        y2={25}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      {showSeconds && (
        <line
          x1={100}
          y1={112}
          x2={100}
          y2={18}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 100 100)`}
        />
      )}
      <circle cx={100} cy={100} r={6} fill={color} />
    </svg>
  );
}
