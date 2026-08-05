"use client";

import { useBehaviourLog } from "@/lib/behaviour-tracking-storage";
import BehaviourLogForm from "@/components/behaviour-tracking/BehaviourLogForm";
import BehaviourLogList from "@/components/behaviour-tracking/BehaviourLogList";
import SeverityTrendChart from "@/components/behaviour-tracking/SeverityTrendChart";
import BehaviourFrequencyChart from "@/components/behaviour-tracking/BehaviourFrequencyChart";

export default function BehaviourTracking() {
  const { entries, addEntry, removeEntry, clearAll } = useBehaviourLog();

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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Log</h2>
          {entries.length > 0 && (
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
              className="no-print text-sm font-semibold text-muted hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>
        <BehaviourLogList entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
