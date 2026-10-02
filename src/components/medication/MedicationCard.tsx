"use client";

import { useState } from "react";
import type { Medication } from "@/lib/medication-storage";

interface MedicationCardProps {
  medication: Medication;
  onChange: (patch: Partial<Omit<Medication, "id">>) => void;
  onRemove: () => void;
}

export default function MedicationCard({
  medication,
  onChange,
  onRemove,
}: MedicationCardProps) {
  const [newTime, setNewTime] = useState("08:00");

  function addTime() {
    if (!/^\d{2}:\d{2}$/.test(newTime) || medication.times.includes(newTime)) return;
    onChange({ times: [...medication.times, newTime].sort() });
  }

  function removeTime(time: string) {
    onChange({ times: medication.times.filter((t) => t !== time) });
  }

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-2 flex items-start gap-2">
        <input
          type="text"
          value={medication.name}
          onChange={(e) => onChange({ name: e.target.value })}
          maxLength={120}
          placeholder="Medication name"
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-base font-bold"
          aria-label="Medication name"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove "${medication.name || "medication"}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <label className="mb-2 block text-sm">
        <span className="mb-1 block font-semibold text-muted">Dose</span>
        <input
          type="text"
          value={medication.dose}
          onChange={(e) => onChange({ dose: e.target.value })}
          maxLength={80}
          placeholder="As written on the label, e.g. 1 tablet"
          className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
        />
      </label>

      <label className="touch-target mb-2 flex items-center gap-3 rounded-lg border-2 border-border bg-background px-3">
        <input
          type="checkbox"
          checked={medication.asNeeded}
          onChange={(e) => onChange({ asNeeded: e.target.checked })}
          className="h-6 w-6 shrink-0 accent-brand"
        />
        <span className="text-sm">Taken only as needed (no set times)</span>
      </label>

      {!medication.asNeeded && (
        <div className="mb-2">
          <span className="mb-1 block text-sm font-semibold text-muted">Times each day (24-hour)</span>
          {medication.times.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {medication.times.map((time) => (
                <span
                  key={time}
                  className="flex items-center gap-1 rounded-full border-2 border-border bg-background pl-4 text-sm font-semibold"
                >
                  {time}
                  <button
                    type="button"
                    onClick={() => removeTime(time)}
                    aria-label={`Remove ${time}`}
                    className="no-print touch-target rounded-full"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mb-2 text-sm text-muted">
              No times yet. Add a time so this shows in the checklist.
            </p>
          )}
          <div className="no-print flex gap-2">
            <label className="sr-only" htmlFor={`time-${medication.id}`}>
              Time to add
            </label>
            <input
              id={`time-${medication.id}`}
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="touch-target rounded-lg border-2 border-border bg-background px-3"
            />
            <button
              type="button"
              onClick={addTime}
              className="touch-target rounded-lg border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink"
            >
              Add time
            </button>
          </div>
        </div>
      )}

      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-muted">Notes</span>
        <textarea
          value={medication.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          maxLength={300}
          placeholder="e.g. Take with food"
          className="touch-target w-full rounded-lg border-2 border-border bg-background px-3 py-2"
        />
      </label>
    </div>
  );
}
