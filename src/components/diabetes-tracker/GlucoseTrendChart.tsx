"use client";

import type { GlucoseEntry } from "@/lib/diabetes-tracker-storage";
import {
  classifyReading,
  planTargetRange,
  READING_BAND_COLOURS,
  READING_BAND_LABELS,
  type DiabetesManagementPlan,
} from "@/lib/diabetes-management-plan-storage";
import { formatShortDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface GlucoseTrendChartProps {
  entries: GlucoseEntry[];
  plan: DiabetesManagementPlan;
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 36;
const BAR_WIDTH = 28;
const BAR_GAP = 16;
const MAX_ENTRIES = 14;
const MIN_SCALE = 20; // mmol/L - grows if a reading is higher

export default function GlucoseTrendChart({ entries, plan }: GlucoseTrendChartProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log a reading above to see the trend.
      </p>
    );
  }

  const range = planTargetRange(plan);
  const chronological = [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const recent = chronological.slice(-MAX_ENTRIES);
  const maxScale = Math.max(MIN_SCALE, ...recent.map((e) => Math.ceil(e.bglMmol / 5) * 5));
  const width = recent.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;
  const yFor = (level: number) => PLOT_HEIGHT - (level / maxScale) * (PLOT_HEIGHT - 8);
  const gridLevels = Array.from({ length: maxScale / 5 + 1 }, (_, i) => i * 5);

  return (
    <div>
      {range ? (
        <p className="mb-2 text-xs text-muted">
          Coloured against the target range from your plan ({range.low} to {range.high} mmol/L),
          shown as dashed lines. Green: within range. Orange: below. Yellow: above. Red: past an
          emergency number from your plan. Each reading&apos;s band is also written in the log
          below.
        </p>
      ) : (
        <p className="mb-2 text-xs text-muted">
          To colour readings against your own target range, enter it from your doctor or
          diabetes educator&apos;s plan on the Management Plan tab. This tool doesn&apos;t use a
          range of its own.
        </p>
      )}
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
          {gridLevels.map((level) => (
            <line
              key={level}
              x1={0}
              x2={width}
              y1={yFor(level)}
              y2={yFor(level)}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}
          {range &&
            [range.low, range.high].map((level) => (
              <line
                key={`range-${level}`}
                x1={0}
                x2={width}
                y1={yFor(level)}
                y2={yFor(level)}
                stroke="var(--foreground)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            ))}
          {recent.map((entry, i) => {
            const barHeight = Math.min(entry.bglMmol / maxScale, 1) * (PLOT_HEIGHT - 8);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = PLOT_HEIGHT - barHeight;
            const band = classifyReading(entry.bglMmol, plan);
            return (
              <g key={entry.id}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill={band ? READING_BAND_COLOURS[band] : "var(--brand)"}
                  className="stroke-black/10"
                  strokeWidth={2}
                >
                  <title>
                    {`${entry.bglMmol} mmol/L${band ? `, ${READING_BAND_LABELS[band].toLowerCase()}` : ""}`}
                  </title>
                </rect>
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
                  {formatShortDate(entry.occurredAt, timezone)}
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
