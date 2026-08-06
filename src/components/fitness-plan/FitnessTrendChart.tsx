"use client";

import type { FitnessLogEntry } from "@/lib/fitness-log-storage";

interface FitnessTrendChartProps {
  entries: FitnessLogEntry[];
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 36;
const BAR_WIDTH = 28;
const BAR_GAP = 16;
const MAX_ENTRIES = 14;
const MAX_MINUTES_SCALE = 120;

export default function FitnessTrendChart({ entries }: FitnessTrendChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log a session above to see your progress.
      </p>
    );
  }

  const chronological = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const recent = chronological.slice(-MAX_ENTRIES);
  const width = recent.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;
  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);

  return (
    <div>
      <p className="mb-2 text-sm text-muted">
        {entries.length} session{entries.length === 1 ? "" : "s"} logged, {totalMinutes} minutes
        total.
      </p>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={`Bar chart of minutes exercised for the ${recent.length} most recent sessions`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {[0, 30, 60, 90, 120].map((minutes) => {
            const y = PLOT_HEIGHT - (minutes / MAX_MINUTES_SCALE) * (PLOT_HEIGHT - 8);
            return (
              <line
                key={minutes}
                x1={0}
                x2={width}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
              />
            );
          })}
          {recent.map((entry, i) => {
            const barHeight =
              Math.min(entry.durationMinutes / MAX_MINUTES_SCALE, 1) * (PLOT_HEIGHT - 8);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = PLOT_HEIGHT - barHeight;
            return (
              <g key={entry.id}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill="var(--brand)"
                  className="stroke-black/10"
                  strokeWidth={2}
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="12"
                  fontWeight="700"
                >
                  {entry.durationMinutes}m
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PLOT_HEIGHT + 18}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize="10"
                >
                  {entry.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {entries.length > MAX_ENTRIES && (
        <p className="mt-2 text-sm text-muted">
          Showing the most recent {MAX_ENTRIES} of {entries.length} sessions.
        </p>
      )}
    </div>
  );
}
