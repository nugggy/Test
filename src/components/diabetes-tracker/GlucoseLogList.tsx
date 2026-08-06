"use client";

import type { GlucoseEntry } from "@/lib/diabetes-tracker-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface GlucoseLogListProps {
  entries: GlucoseEntry[];
  onRemove: (id: string) => void;
}

export default function GlucoseLogList({ entries, onRemove }: GlucoseLogListProps) {
  const { timezone } = useTimezone();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        No readings yet - use the form above to log the first one.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((entry) => (
        <li
          key={entry.id}
          className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold">{entry.bglMmol} mmol/L</span>
              {entry.context && (
                <span className="ml-2 text-sm text-muted">{entry.context}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label="Delete this entry"
              className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
            >
              <span aria-hidden="true">🗑️</span>
            </button>
          </div>
          {(entry.insulinType || entry.insulinDose) && (
            <p className="text-sm text-muted">
              Insulin: {[entry.insulinType, entry.insulinDose && `${entry.insulinDose} units`]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {entry.notes && <p className="mt-1 text-sm">{entry.notes}</p>}
          <p className="mt-1 text-xs text-muted">
            {formatDateTime(entry.occurredAt, timezone)}
          </p>
        </li>
      ))}
    </ul>
  );
}
