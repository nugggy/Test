"use client";

import { useState } from "react";
import { useSeizureLog } from "@/lib/seizure-log-storage";
import { downloadCsv } from "@/lib/csv-export";
import SeizureLogForm from "./SeizureLogForm";
import SeizureLogList from "./SeizureLogList";
import SeizureDashboard from "./SeizureDashboard";
import PrintButton from "@/components/PrintButton";
import Tabs from "@/components/Tabs";

type Tab = "log" | "dashboard";

const TABS = [
  { id: "log" as const, label: "Log entry", icon: "📝" },
  { id: "dashboard" as const, label: "Dashboard", icon: "📊" },
];

export default function SeizureLog() {
  const [tab, setTab] = useState<Tab>("log");
  const { entries, addEntry, removeEntry, clearAll } = useSeizureLog();

  function handleExportCsv() {
    downloadCsv(
      "seizure-log",
      [
        "Date/time",
        "Seizure type",
        "Duration (seconds)",
        "Severity",
        "Awareness",
        "Warning signs (aura)",
        "Location",
        "Possible trigger",
        "Trigger reason",
        "What happened",
        "Recovery",
        "Recovery time (minutes)",
        "Actions taken",
        "Medication given",
        "Notes",
      ],
      entries.map((e) => [
        new Date(e.occurredAt).toLocaleString("en-AU"),
        e.seizureType,
        e.durationSeconds,
        e.severity,
        e.consciousness,
        e.warningSigns,
        e.location,
        e.trigger,
        e.triggerReason,
        e.whatHappened,
        e.recovery,
        e.recoveryMinutes,
        e.actionsTaken.join("; "),
        e.medicationDetail,
        e.notes,
      ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Seizure log sections" />

      {tab === "log" ? (
        <>
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
        </>
      ) : (
        <SeizureDashboard entries={entries} onExportCsv={handleExportCsv} />
      )}
    </div>
  );
}
