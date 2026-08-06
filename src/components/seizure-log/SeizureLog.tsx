"use client";

import { useSeizureLog } from "@/lib/seizure-log-storage";
import { downloadCsv } from "@/lib/csv-export";
import SeizureLogForm from "./SeizureLogForm";
import SeizureLogList from "./SeizureLogList";
import PrintButton from "@/components/PrintButton";

export default function SeizureLog() {
  const { entries, addEntry, removeEntry, clearAll } = useSeizureLog();

  function handleExportCsv() {
    downloadCsv(
      "seizure-log",
      [
        "Date/time",
        "Seizure type",
        "Duration (seconds)",
        "Possible trigger",
        "What happened",
        "Recovery",
        "Actions taken",
        "Notes",
      ],
      entries.map((e) => [
        new Date(e.occurredAt).toLocaleString("en-AU"),
        e.seizureType,
        e.durationSeconds,
        e.trigger,
        e.whatHappened,
        e.recovery,
        e.actionsTaken.join("; "),
        e.notes,
      ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SeizureLogForm onSave={addEntry} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Log</h2>
          {entries.length > 0 && (
            <div className="no-print flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
              <PrintButton label="Print" />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all logged entries? This can't be undone.")) {
                    clearAll();
                  }
                }}
                className="text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <SeizureLogList entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
