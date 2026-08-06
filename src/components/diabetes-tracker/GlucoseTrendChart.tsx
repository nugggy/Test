"use client";

import type { GlucoseEntry } from "@/lib/diabetes-tracker-storage";
import { BGL_LOW_MMOL, BGL_HIGH_MMOL } from "@/lib/diabetes-tracker-data";

interface GlucoseTrendChartProps {
  entries: GlucoseEntry[];
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 36;
const BAR_WIDTH = 28;
const BAR_GAP = 16;
const MAX_ENTRIES = 14;
const MAX_SCALE = 20; // mmol/L - generous headroom above the general high band

function barColour(bgl: number) {
  if (bgl < BGL_LOW_MMOL) return "var(--sev-5)"; // low - treat as urgent to notice
  if (bgl > BGL_HIGH_MMOL) return "var(--sev-4)"; // high
  return "var(--sev-1)"; // within the general reference band
}

export default function GlucoseTrendChart({ entries }: GlucoseTrendChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log a reading above to see the trend.
      </p>
    );
  }

  const chronological = [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const recent = chronological.slice(-MAX_ENTRIES);
  const width = recent.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;

  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        Colours are a general guide only ({"<"}{BGL_LOW_MMOL} mmol/L or {">"}{BGL_HIGH_MMOL} mmol/L
        highlighted) - everyone&apos;s own target range is set by their diabetes care team.
      </p>
      {/* This chart is a visual summary - every entry is also listed in
          full, in text, in the Log below, which is the accessible source
          of truth for screen reader users. */}
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={`Bar chart of the ${recent.length} most recent blood glucose readings, in mmol/L`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {[0, 5, 10, 15, 20].map((level) => {
            const y = PLOT_HEIGHT - (level / MAX_SCALE) * (PLOT_HEIGHT - 8);
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
            const barHeight = Math.min(entry.bglMmol / MAX_SCALE, 1) * (PLOT_HEIGHT - 8);
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
                  fill={barColour(entry.bglMmol)}
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
                  {entry.bglMmol}
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
      {entries.length > MAX_ENTRIES && (
        <p className="mt-2 text-sm text-muted">
          Showing the most recent {MAX_ENTRIES} of {entries.length} readings.
        </p>
      )}
    </div>
  );
}
