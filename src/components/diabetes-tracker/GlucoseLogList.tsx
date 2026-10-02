"use client";

import type { GlucoseEntry } from "@/lib/diabetes-tracker-storage";
import {
  classifyReading,
  READING_BAND_COLOURS,
  READING_BAND_LABELS,
  type DiabetesManagementPlan,
} from "@/lib/diabetes-management-plan-storage";
import { formatDateTime } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface GlucoseLogListProps {
  entries: GlucoseEntry[];
  onRemove: (id: string) => void;
  plan: DiabetesManagementPlan;
}

export default function GlucoseLogList({ entries, onRemove, plan }: GlucoseLogListProps) {
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
      {sorted.map((entry) => {
        const band = classifyReading(entry.bglMmol, plan);
        return (
        <li
          key={entry.id}
          className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
          style={band ? { borderLeftWidth: 8, borderLeftColor: READING_BAND_COLOURS[band] } : undefined}
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold">{entry.bglMmol} mmol/L</span>
              {entry.context && (
                <span className="ml-2 text-sm text-muted">{entry.context}</span>
              )}
              {band && <p className="text-sm font-semibold">{READING_BAND_LABELS[band]}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Delete this reading? This can't be undone.")) onRemove(entry.id);
              }}
              aria-label={`Delete the ${entry.bglMmol} mmol/L reading from ${formatDateTime(entry.occurredAt, timezone)}`}
              className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
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
        );
      })}
    </ul>
  );
}
