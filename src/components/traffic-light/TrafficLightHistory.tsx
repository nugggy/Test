"use client";

import { TRAFFIC_LIGHT_STATES } from "@/lib/traffic-light-data";
import type { TrafficLightEntry } from "@/lib/traffic-light-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface TrafficLightHistoryProps {
  entries: TrafficLightEntry[];
  onRemove: (id: string) => void;
}

export default function TrafficLightHistory({
  entries,
  onRemove,
}: TrafficLightHistoryProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No check-ins yet - choose a colour above to log your first one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => {
        const state = TRAFFIC_LIGHT_STATES.find((s) => s.id === entry.state);
        return (
          <li
            key={entry.id}
            className="flex items-start gap-3 rounded-xl border-2 border-border bg-background p-3"
          >
            <span aria-hidden="true" className="shrink-0 text-2xl">
              {state?.emoji ?? "🟢"}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{state?.label ?? "Unknown"}</p>
              {entry.note && (
                <p className="mt-0.5 text-sm text-muted">{entry.note}</p>
              )}
              <p className="mt-0.5 text-xs text-muted">
                {formatDateTime(entry.timestamp, timezone)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label={`Delete this ${state?.label ?? ""} check-in`}
              className="no-print touch-target grid shrink-0 place-items-center rounded-xl border-2 border-border bg-surface"
            >
              <span aria-hidden="true">🗑️</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
