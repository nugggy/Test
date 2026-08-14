"use client";

import type { SeizureLogEntry } from "@/lib/seizure-log-storage";
import { PROLONGED_SEIZURE_SECONDS } from "@/lib/seizure-log-data";

interface SeizureDurationChartProps {
  entries: SeizureLogEntry[];
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 36;
const BAR_WIDTH = 20;
const BAR_GAP = 14;
const MAX_ENTRIES = 20;

function barColour(seconds: number) {
  if (seconds >= PROLONGED_SEIZURE_SECONDS) return "var(--sev-5)"; // 5+ min - prolonged
  if (seconds >= 120) return "var(--sev-3)"; // 2-5 min
  return "var(--sev-1)"; // under 2 min
}

function formatShort(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m${s ? `${s}s` : ""}` : `${s}s`;
}

export default function SeizureDurationChart({ entries }: SeizureDurationChartProps) {
  const withDuration = entries.filter((e) => e.durationSeconds > 0);
  if (withDuration.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log a duration above to see the trend.
      </p>
    );
  }

  const chronological = [...withDuration].sort((a, b) =>
    a.occurredAt.localeCompare(b.occurredAt)
  );
  const recent = chronological.slice(-MAX_ENTRIES);
  const maxDuration = Math.max(...recent.map((e) => e.durationSeconds), PROLONGED_SEIZURE_SECONDS);
  const scale = maxDuration * 1.15;
  const width = recent.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;
  const thresholdY = PLOT_HEIGHT - (PROLONGED_SEIZURE_SECONDS / scale) * (PLOT_HEIGHT - 8);

  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        Green: under 2 min · Amber: 2-5 min · Red: 5 min or more, a medical emergency under most
        epilepsy management plans (call 000 if not already treated).
      </p>
      {/* Every entry is also listed in full, in text, in the Log below,
          which is the accessible source of truth for screen reader users. */}
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={`Bar chart of the ${recent.length} most recent seizure durations`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <line
            x1={0}
            x2={width}
            y1={thresholdY}
            y2={thresholdY}
            stroke="var(--sev-5)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text x={width - 4} y={thresholdY - 4} textAnchor="end" className="fill-muted" fontSize="10">
            5 min
          </text>
          {recent.map((entry, i) => {
            const barHeight = Math.min(entry.durationSeconds / scale, 1) * (PLOT_HEIGHT - 8);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = PLOT_HEIGHT - barHeight;
            const date = new Date(entry.occurredAt);
            return (
              <g key={entry.id}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill={barColour(entry.durationSeconds)}
                  className="stroke-black/10"
                  strokeWidth={2}
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="10"
                  fontWeight="700"
                >
                  {formatShort(entry.durationSeconds)}
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PLOT_HEIGHT + 18}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize="10"
                >
                  {`${date.getDate()}/${date.getMonth() + 1}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {withDuration.length > MAX_ENTRIES && (
        <p className="mt-2 text-sm text-muted">
          Showing the most recent {MAX_ENTRIES} of {withDuration.length} timed seizures.
        </p>
      )}
    </div>
  );
}
