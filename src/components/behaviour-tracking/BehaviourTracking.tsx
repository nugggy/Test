"use client";

import { useBehaviourLog } from "@/lib/behaviour-tracking-storage";
import PrintButton from "@/components/PrintButton";
import { downloadCsv } from "@/lib/csv-export";
import BehaviourLogForm from "@/components/behaviour-tracking/BehaviourLogForm";
import BehaviourLogList from "@/components/behaviour-tracking/BehaviourLogList";
import SeverityTrendChart from "@/components/behaviour-tracking/SeverityTrendChart";
import BehaviourFrequencyChart from "@/components/behaviour-tracking/BehaviourFrequencyChart";

export default function BehaviourTracking() {
  const { entries, addEntry, removeEntry, clearAll } = useBehaviourLog();

  function handleExportCsv() {
    downloadCsv(
      "behaviour-log",
      ["Date", "Antecedent", "Behaviour", "Consequence", "Severity (1-5)"],
      entries.map((e) => [
        new Date(e.occurredAt).toLocaleString("en-AU"),
        e.antecedent,
        e.behaviour,
        e.consequence,
        e.severity,
      ])
    );
  }

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
                className="text-sm font-semibold text-muted hover:text-foreground"
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
