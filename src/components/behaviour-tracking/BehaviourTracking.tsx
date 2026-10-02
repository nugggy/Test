"use client";

import {
  formatRecordDateTime,
  partOfDay,
  useBehaviourLog,
} from "@/lib/behaviour-tracking-storage";
import { getHourInTimezone } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import CategoryBreakdownChart from "@/components/CategoryBreakdownChart";
import PrintButton from "@/components/PrintButton";
import { downloadCsv } from "@/lib/csv-export";
import BehaviourLogForm from "@/components/behaviour-tracking/BehaviourLogForm";
import BehaviourLogList from "@/components/behaviour-tracking/BehaviourLogList";
import SeverityTrendChart from "@/components/behaviour-tracking/SeverityTrendChart";
import BehaviourFrequencyChart from "@/components/behaviour-tracking/BehaviourFrequencyChart";

export default function BehaviourTracking() {
  const { entries, addEntry, removeEntry, clearAll } = useBehaviourLog();
  const { timezone } = useTimezone();

  function handleExportCsv() {
    downloadCsv(
      "behaviour-log",
      [
        "Date/time",
        "Antecedent (before)",
        "Behaviour",
        "Consequence (after)",
        "Severity (1-5)",
        "Duration (minutes)",
        "Where",
        "Notes",
        "Recorded by",
      ],
      [...entries]
        .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
        .map((e) => [
          formatRecordDateTime(e.occurredAt, timezone),
          e.antecedent,
          e.behaviour,
          e.consequence,
          e.severity,
          e.durationMinutes || "",
          e.setting,
          e.notes,
          e.recordedBy,
        ])
    );
  }

  function topCounts(values: string[], limit: number) {
    const counts = new Map<string, number>();
    for (const value of values) {
      const key = value.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([label, count]) => ({ label, count, color: "var(--accent)" }));
  }

  const antecedentData = topCounts(entries.map((e) => e.antecedent), 6);
  const timeOfDayOrder = [
    "Morning (6am to 12pm)",
    "Afternoon (12pm to 5pm)",
    "Evening (5pm to 9pm)",
    "Night (9pm to 6am)",
  ];
  const timeCounts = new Map<string, number>();
  for (const e of entries) {
    const hour = getHourInTimezone(e.occurredAt, timezone);
    if (Number.isNaN(hour)) continue;
    const key = partOfDay(hour);
    timeCounts.set(key, (timeCounts.get(key) ?? 0) + 1);
  }
  const timeOfDayData = timeOfDayOrder
    .filter((label) => timeCounts.has(label))
    .map((label) => ({ label, count: timeCounts.get(label) ?? 0, color: "var(--brand)" }));

  return (
    <div className="flex flex-col gap-6">
      <BehaviourLogForm onSave={addEntry} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display mb-3 text-lg font-bold">
            Severity over time
          </h2>
          <SeverityTrendChart entries={entries} />
        </div>
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <h2 className="font-display mb-3 text-lg font-bold">
            Most common behaviours
          </h2>
          <BehaviourFrequencyChart entries={entries} />
        </div>
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
            <h2 className="font-display mb-3 text-lg font-bold">Most common triggers (before)</h2>
            <CategoryBreakdownChart
              data={antecedentData}
              emptyMessage="No antecedents logged yet."
            />
          </div>
          <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
            <h2 className="font-display mb-3 text-lg font-bold">Time of day</h2>
            <CategoryBreakdownChart data={timeOfDayData} emptyMessage="No entries yet." />
          </div>
        </div>
      )}

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
                  if (
                    window.confirm(
                      "Clear all logged entries? This can't be undone."
                    )
                  ) {
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
        <BehaviourLogList entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
