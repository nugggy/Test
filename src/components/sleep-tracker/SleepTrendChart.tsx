"use client";

import type { SleepEntry } from "@/lib/sleep-tracker-storage";
import { QUALITY_LEVELS, computeHoursSlept, formatSleepDate } from "@/lib/sleep-tracker-data";

interface SleepTrendChartProps {
  entries: SleepEntry[];
}

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 52;
const BAR_WIDTH = 36;
const BAR_GAP = 16;
const MAX_ENTRIES = 14;
const MAX_HOURS_SCALE = 12;

export default function SleepTrendChart({ entries }: SleepTrendChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log a night&apos;s sleep above to see the trend.
      </p>
    );
  }

  const chronological = [...entries].sort((a, b) => a.date.localeCompare(b.date));
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
          aria-label={`Bar chart of hours slept for the ${recent.length} most recent nights, with how each night felt shown underneath. Every night is also listed in the Log below.`}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {[0, 4, 8, 12].map((hours) => {
            const y = PLOT_HEIGHT - (hours / MAX_HOURS_SCALE) * (PLOT_HEIGHT - 8);
            return (
              <line
                key={hours}
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
            const hours = computeHoursSlept(entry.bedTime, entry.wakeTime);
            const barHeight = Math.min(hours / MAX_HOURS_SCALE, 1) * (PLOT_HEIGHT - 8);
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
                  {hours}h
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PLOT_HEIGHT + 18}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize="11"
                >
                  {formatSleepDate(entry.date, { short: true })}
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PLOT_HEIGHT + 40}
                  textAnchor="middle"
                  fontSize="16"
                >
                  {QUALITY_LEVELS.find((l) => l.value === entry.quality)?.emoji ?? ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {entries.length > MAX_ENTRIES && (
        <p className="mt-2 text-sm text-muted">
          Showing the most recent {MAX_ENTRIES} of {entries.length} nights.
        </p>
      )}
    </div>
  );
}
