"use client";

import { useSleepLog } from "@/lib/sleep-tracker-storage";
import {
  QUALITY_LEVELS,
  computeHoursSlept,
  formatSleepDate,
  summariseRecentNights,
} from "@/lib/sleep-tracker-data";
import type { SleepEntry } from "@/lib/sleep-tracker-storage";
import { downloadCsv } from "@/lib/csv-export";
import SleepEntryForm from "./SleepEntryForm";
import SleepTrendChart from "./SleepTrendChart";
import SleepLogList from "./SleepLogList";
import PrintButton from "@/components/PrintButton";

export default function SleepTracker() {
  const { entries, addEntry, updateEntry, removeEntry, clearAll } = useSleepLog();
  const summary = summariseRecentNights(entries, 7);

  function handleSave(data: Omit<SleepEntry, "id">): string | null {
    const label = formatSleepDate(data.date);
    const existing = entries.find((e) => e.date === data.date);
    if (existing) {
      if (
        !window.confirm(
          `You already have an entry for ${label}. Replace it with this one?`
        )
      ) {
        return null;
      }
      updateEntry(existing.id, data);
      return `Updated the entry for ${label}.`;
    }
    addEntry(data);
    return `Saved: ${label}, about ${computeHoursSlept(data.bedTime, data.wakeTime)} hours.`;
  }

  function toNumericDate(date: string) {
    const [y, m, d] = date.split("-");
    return y && m && d ? `${d}/${m}/${y}` : date;
  }

  function handleExportCsv() {
    downloadCsv(
      "sleep-log",
      ["Date woke up", "Went to sleep", "Woke up", "Hours slept", "Quality", "Times woken in the night", "Notes"],
      [...entries]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((e) => [
          toNumericDate(e.date),
          e.bedTime,
          e.wakeTime,
          computeHoursSlept(e.bedTime, e.wakeTime),
          QUALITY_LEVELS.find((l) => l.value === e.quality)?.label ?? e.quality,
          typeof e.wakeUps === "number" ? e.wakeUps : "",
          e.notes,
        ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SleepEntryForm onSave={handleSave} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Hours slept over time</h2>
        {summary && (
          <dl className="mb-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border-2 border-border bg-background p-3">
              <dt className="text-sm text-muted">
                Average sleep, last {summary.nights} {summary.nights === 1 ? "night" : "nights"} logged
              </dt>
              <dd className="text-xl font-bold">{summary.averageHours} hours</dd>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-3">
              <dt className="text-sm text-muted">Usual quality</dt>
              <dd className="text-xl font-bold">
                <span aria-hidden="true">
                  {QUALITY_LEVELS.find((l) => l.value === summary.averageQuality)?.emoji}{" "}
                </span>
                {QUALITY_LEVELS.find((l) => l.value === summary.averageQuality)?.label}
              </dd>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-3">
              <dt className="text-sm text-muted">Average times woken</dt>
              <dd className="text-xl font-bold">
                {summary.averageWakeUps === null ? "Not recorded" : summary.averageWakeUps}
              </dd>
            </div>
          </dl>
        )}
        <SleepTrendChart entries={entries} />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Log</h2>
          {entries.length > 0 && (
            <div className="no-print flex flex-wrap items-center gap-3">
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
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <SleepLogList
          entries={entries}
          onRemove={(id) => {
            if (window.confirm("Delete this entry?")) removeEntry(id);
          }}
        />
      </div>
    </div>
  );
}
