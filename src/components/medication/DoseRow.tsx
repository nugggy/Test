"use client";

import { useState } from "react";
import type { Medication, MedicationLogEntry } from "@/lib/medication-storage";
import { formatTime } from "@/lib/datetime";

const NOT_TAKEN_REASONS = [
  "Refused",
  "Asleep",
  "Unwell or vomiting",
  "Not available",
  "Away from home",
  "Held on advice of doctor",
];

interface DoseRowProps {
  medication: Medication;
  time: string;
  record: MedicationLogEntry | undefined;
  /** The scheduled time has passed (or this is an earlier day). */
  isDue: boolean;
  timezone: string;
  onTaken: () => void;
  onNotTaken: (reason: string) => void;
  onUndo: () => void;
}

export default function DoseRow({
  medication,
  time,
  record,
  isDue,
  timezone,
  onTaken,
  onNotTaken,
  onUndo,
}: DoseRowProps) {
  const [choosingReason, setChoosingReason] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const name = medication.name || "(unnamed medication)";

  let statusText: string;
  let statusIcon: string;
  let borderClass = "border-border";
  if (record?.status === "taken") {
    statusText = `Taken, recorded at ${formatTime(record.takenAt, timezone)}${record.recordedBy ? ` by ${record.recordedBy}` : ""}`;
    statusIcon = "✅";
    borderClass = "border-[var(--sev-1)]";
  } else if (record?.status === "not-taken") {
    statusText = `Not taken${record.reason ? `: ${record.reason}` : ""}${record.recordedBy ? ` (${record.recordedBy})` : ""}`;
    statusIcon = "✖️";
    borderClass = "border-[var(--sev-4)]";
  } else if (isDue) {
    statusText = "Due, nothing recorded yet";
    statusIcon = "⏰";
    borderClass = "border-accent";
  } else {
    statusText = "Later today";
    statusIcon = "🕒";
  }

  function chooseReason(reason: string) {
    onNotTaken(reason);
    setChoosingReason(false);
    setOtherReason("");
  }

  return (
    <li className={`print-avoid-break rounded-xl border-2 ${borderClass} bg-background p-3`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base">
            <strong className="font-display text-lg">{time}</strong>{" "}
            <span className="font-semibold">{name}</span>
            {medication.dose ? <span> ({medication.dose})</span> : null}
          </p>
          {medication.notes && <p className="text-sm text-muted">{medication.notes}</p>}
          <p className="mt-1 text-sm font-semibold">
            <span aria-hidden="true">{statusIcon}</span> {statusText}
          </p>
        </div>
      </div>

      <div className="no-print mt-2 flex flex-wrap gap-2">
        {record ? (
          <button
            type="button"
            onClick={onUndo}
            aria-label={`Undo the record for ${name} at ${time}`}
            className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
          >
            Undo
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onTaken}
              aria-label={`Mark ${name} at ${time} as taken`}
              className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink sm:flex-none"
            >
              <span aria-hidden="true">✓</span> Taken
            </button>
            <button
              type="button"
              onClick={() => setChoosingReason((v) => !v)}
              aria-expanded={choosingReason}
              aria-label={`Mark ${name} at ${time} as not taken`}
              className="touch-target flex-1 rounded-xl border-2 border-border bg-surface px-4 font-semibold sm:flex-none"
            >
              <span aria-hidden="true">✗</span> Not taken
            </button>
          </>
        )}
      </div>

      {choosingReason && !record && (
        <div className="no-print mt-3 rounded-xl border-2 border-border bg-surface p-3">
          <p className="mb-2 text-sm font-semibold">Why was it not taken? (optional)</p>
          <div className="flex flex-wrap gap-1.5">
            {NOT_TAKEN_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => chooseReason(reason)}
                className="touch-target rounded-full border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
              >
                {reason}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <label className="sr-only" htmlFor={`other-${medication.id}-${time}`}>
              Other reason
            </label>
            <input
              id={`other-${medication.id}-${time}`}
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              maxLength={200}
              placeholder="Other reason"
              className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-3"
            />
            <button
              type="button"
              onClick={() => chooseReason(otherReason)}
              className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
