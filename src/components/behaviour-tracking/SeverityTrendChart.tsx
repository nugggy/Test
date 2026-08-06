"use client";

import { SEVERITY_LEVELS } from "@/lib/behaviour-tracking-data";
import type { BehaviourLogEntry } from "@/lib/behaviour-tracking-storage";
import { formatShortDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface SeverityTrendChartProps {
  entries: BehaviourLogEntry[];
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 36;
const BAR_WIDTH = 28;
const BAR_GAP = 16;
const MAX_ENTRIES = 20;

export default function SeverityTrendChart({ entries }: SeverityTrendChartProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log an entry above to see the severity trend.
      </p>
    );
  }

  const chronological = [...entries].sort((a, b) =>
    a.occurredAt.localeCompare(b.occurredAt)
  );
  const recent = chronological.slice(-MAX_ENTRIES);
  const width = recent.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;

  return (
    <div>
      {/* This chart is a visual summary - every entry is also listed in
          full, in text, in the Log below, which is the accessible source
          of truth for screen reader users. */}
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={`Bar chart of severity (1 to 5) for the ${recent.length} most recently logged entries`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {[1, 2, 3, 4, 5].map((level) => {
            const y = PLOT_HEIGHT - (level / 5) * (PLOT_HEIGHT - 8);
            return (
              <line
                key={level}
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
            const barHeight = (entry.severity / 5) * (PLOT_HEIGHT - 8);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = PLOT_HEIGHT - barHeight;
            const level = SEVERITY_LEVELS.find((l) => l.value === entry.severity);
            return (
              <g key={entry.id}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill={`var(--${level?.colorVar ?? "sev-3"})`}
                  className="stroke-black/10"
                  strokeWidth={2}
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="13"
                  fontWeight="700"
                >
                  {entry.severity}
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PLOT_HEIGHT + 18}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize="10"
                >
                  {formatShortDate(entry.occurredAt, timezone)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {entries.length > MAX_ENTRIES && (
        <p className="mt-2 text-sm text-muted">
          Showing the most recent {MAX_ENTRIES} of {entries.length} entries.
        </p>
      )}
    </div>
  );
}
