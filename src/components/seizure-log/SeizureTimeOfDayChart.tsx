"use client";

import type { SeizureLogEntry } from "@/lib/seizure-log-storage";

interface SeizureTimeOfDayChartProps {
  entries: SeizureLogEntry[];
}

// Grouped into 3-hour bands - 24 individual hour bars are too thin to read
// on a phone, and a specialist mainly wants the broad pattern (e.g.
// "mostly on waking" or "mostly overnight").
const BANDS = [
  { label: "12am", from: 0, to: 3 },
  { label: "3am", from: 3, to: 6 },
  { label: "6am", from: 6, to: 9 },
  { label: "9am", from: 9, to: 12 },
  { label: "12pm", from: 12, to: 15 },
  { label: "3pm", from: 15, to: 18 },
  { label: "6pm", from: 18, to: 21 },
  { label: "9pm", from: 21, to: 24 },
];

const PLOT_HEIGHT = 120;
const LABEL_SPACE = 24;
const BAR_WIDTH = 30;
const BAR_GAP = 12;

export default function SeizureTimeOfDayChart({ entries }: SeizureTimeOfDayChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log an entry above to see the time-of-day pattern.
      </p>
    );
  }

  const counts = BANDS.map((band) => {
    const count = entries.filter((e) => {
      const hour = new Date(e.occurredAt).getHours();
      return hour >= band.from && hour < band.to;
    }).length;
    return { ...band, count };
  });

  const max = Math.max(...counts.map((c) => c.count), 1);
  const width = counts.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Bar chart of seizures grouped by time of day, in 3-hour bands"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
      >
        {counts.map((band, i) => {
          const barHeight = band.count === 0 ? 0 : Math.max((band.count / max) * (PLOT_HEIGHT - 8), 6);
          const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
          const y = PLOT_HEIGHT - barHeight;
          return (
            <g key={band.label}>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={4}
                fill="var(--accent)"
                className="stroke-black/10"
                strokeWidth={band.count > 0 ? 2 : 0}
              />
              {band.count > 0 && (
                <text
                  x={x + BAR_WIDTH / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="11"
                  fontWeight="700"
                >
                  {band.count}
                </text>
              )}
              <text
                x={x + BAR_WIDTH / 2}
                y={PLOT_HEIGHT + 16}
                textAnchor="middle"
                className="fill-muted"
                fontSize="10"
              >
                {band.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
