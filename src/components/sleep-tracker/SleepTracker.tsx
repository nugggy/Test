"use client";

import { useSleepLog } from "@/lib/sleep-tracker-storage";
import { QUALITY_LEVELS, computeHoursSlept } from "@/lib/sleep-tracker-data";
import { downloadCsv } from "@/lib/csv-export";
import SleepEntryForm from "./SleepEntryForm";
import SleepTrendChart from "./SleepTrendChart";
import SleepLogList from "./SleepLogList";
import PrintButton from "@/components/PrintButton";

export default function SleepTracker() {
  const { entries, addEntry, removeEntry, clearAll } = useSleepLog();

  function handleExportCsv() {
    downloadCsv(
      "sleep-log",
      ["Date", "Bedtime", "Wake time", "Hours slept", "Quality", "Notes"],
      entries.map((e) => [
        e.date,
        e.bedTime,
        e.wakeTime,
        computeHoursSlept(e.bedTime, e.wakeTime),
        QUALITY_LEVELS.find((l) => l.value === e.quality)?.label ?? e.quality,
        e.notes,
      ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SleepEntryForm onSave={addEntry} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Hours slept over time</h2>
        <SleepTrendChart entries={entries} />
      </div>

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
        <SleepLogList entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
