"use client";

import type { BehaviourLogEntry } from "@/lib/behaviour-tracking-storage";

interface BehaviourFrequencyChartProps {
  entries: BehaviourLogEntry[];
}

const MAX_BARS = 8;

export default function BehaviourFrequencyChart({
  entries,
}: BehaviourFrequencyChartProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log an entry above to see which behaviours come up most.
      </p>
    );
  }

  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.behaviour.trim() || "(not specified)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_BARS);
  const max = sorted[0]?.[1] ?? 1;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map(([behaviour, count]) => (
        <div key={behaviour} className="flex items-center gap-3">
          <span
            className="w-24 shrink-0 truncate text-sm font-semibold sm:w-36"
            title={behaviour}
          >
            {behaviour}
          </span>
          <div
            className="h-6 flex-1 overflow-hidden rounded-full bg-background"
            role="img"
            aria-label={`${behaviour}: ${count} ${count === 1 ? "entry" : "entries"}`}
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.max((count / max) * 100, 6)}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-sm font-bold text-muted">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
