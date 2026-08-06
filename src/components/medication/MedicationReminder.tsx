"use client";

import { useState } from "react";
import { useMedications, useMedicationLog, todayKey } from "@/lib/medication-storage";
import { downloadCsv } from "@/lib/csv-export";
import MedicationCard from "./MedicationCard";
import PrintButton from "@/components/PrintButton";

export default function MedicationReminder() {
  const { medications, addMedication, updateMedication, removeMedication } = useMedications();
  const { entries, markTaken, markNotTaken, isTaken } = useMedicationLog();
  const [newMedication, setNewMedication] = useState("");
  const today = todayKey();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addMedication(newMedication);
    setNewMedication("");
  }

  function handleExportCsv() {
    downloadCsv(
      "medication-log",
      ["Date", "Time", "Medication", "Dose", "Taken at"],
      entries.map((entry) => {
        const med = medications.find((m) => m.id === entry.medicationId);
        return [
          entry.date,
          entry.time,
          med?.name ?? "(deleted medication)",
          med?.dose ?? "",
          new Date(entry.takenAt).toLocaleString("en-AU"),
        ];
      })
    );
  }

  const todaysDoses = medications.flatMap((med) =>
    med.times.map((time) => ({ med, time }))
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
        This is a checklist and tracker, not a guaranteed alarm - it can only
        remind you while this page is open. For time-critical medication,
        also set a reminder in your phone&apos;s own alarm or reminder app.
      </div>

      {todaysDoses.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display mb-3 text-lg font-bold">Today&apos;s checklist</h2>
          <div className="flex flex-col gap-2">
            {todaysDoses.map(({ med, time }) => {
              const taken = isTaken(med.id, time, today);
              return (
                <label
                  key={`${med.id}-${time}`}
                  className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3"
                >
                  <input
                    type="checkbox"
                    checked={taken}
                    onChange={() =>
                      taken ? markNotTaken(med.id, time, today) : markTaken(med.id, time, today)
                    }
                    className="h-6 w-6 shrink-0 accent-brand"
                  />
                  <span className={`flex-1 text-sm ${taken ? "text-muted line-through" : ""}`}>
                    <strong>{time}</strong> - {med.name}
                    {med.dose ? ` (${med.dose})` : ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">My medications</h2>
          {entries.length > 0 && (
            <div className="no-print flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
              <PrintButton label="Print schedule" />
            </div>
          )}
        </div>

        {medications.length > 0 && (
          <div className="mb-3 flex flex-col gap-3">
            {medications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onChange={(patch) => updateMedication(med.id, patch)}
                onRemove={() => removeMedication(med.id)}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleAdd} className="no-print flex gap-2">
          <label htmlFor="new-medication" className="sr-only">
            Add a medication
          </label>
          <input
            id="new-medication"
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="e.g. Vitamin D"
            maxLength={120}
            className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
          <button
            type="submit"
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            Add medication
          </button>
        </form>
      </div>
    </div>
  );
}
