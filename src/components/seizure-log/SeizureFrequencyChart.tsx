"use client";

import type { SeizureLogEntry } from "@/lib/seizure-log-storage";

interface SeizureFrequencyChartProps {
  entries: SeizureLogEntry[];
}

const MONTHS_SHOWN = 12;
const PLOT_HEIGHT = 120;
const LABEL_SPACE = 24;
const BAR_WIDTH = 24;
const BAR_GAP = 12;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function SeizureFrequencyChart({ entries }: SeizureFrequencyChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log an entry above to see seizures per month.
      </p>
    );
  }

  const now = new Date();
  const months: { key: string; label: string; count: number }[] = [];
  for (let i = MONTHS_SHOWN - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${MONTH_LABELS[d.getMonth()]}${d.getMonth() === 0 ? ` '${String(d.getFullYear()).slice(2)}` : ""}`,
      count: 0,
    });
  }
  const byKey = new Map(months.map((m) => [m.key, m]));
  for (const entry of entries) {
    const d = new Date(entry.occurredAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = byKey.get(key);
    if (bucket) bucket.count += 1;
  }

  const max = Math.max(...months.map((m) => m.count), 1);
  const width = months.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const height = PLOT_HEIGHT + LABEL_SPACE;

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label={`Bar chart of seizure count per month for the last ${MONTHS_SHOWN} months`}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
      >
        {months.map((m, i) => {
          const barHeight = m.count === 0 ? 0 : Math.max((m.count / max) * (PLOT_HEIGHT - 8), 6);
          const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
          const y = PLOT_HEIGHT - barHeight;
          return (
            <g key={m.key}>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={4}
                fill="var(--brand)"
                className="stroke-black/10"
                strokeWidth={m.count > 0 ? 2 : 0}
              />
              {m.count > 0 && (
                <text
                  x={x + BAR_WIDTH / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="11"
                  fontWeight="700"
                >
                  {m.count}
                </text>
              )}
              <text
                x={x + BAR_WIDTH / 2}
                y={PLOT_HEIGHT + 16}
                textAnchor="middle"
                className="fill-muted"
                fontSize="10"
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
