"use client";

import { useState } from "react";
import { formatRecordDateTime, useGlucoseLog } from "@/lib/diabetes-tracker-storage";
import {
  classifyReading,
  READING_BAND_LABELS,
  useDiabetesManagementPlan,
} from "@/lib/diabetes-management-plan-storage";
import { useTimezone } from "@/lib/timezone-context";
import { downloadCsv } from "@/lib/csv-export";
import GlucoseEntryForm from "./GlucoseEntryForm";
import GlucoseTrendChart from "./GlucoseTrendChart";
import GlucoseLogList from "./GlucoseLogList";
import DiabetesManagementPlan from "./DiabetesManagementPlan";
import PrintButton from "@/components/PrintButton";
import Tabs from "@/components/Tabs";

type Tab = "log" | "plan";

const TABS = [
  { id: "log" as const, label: "Log & Trend", icon: "📊" },
  { id: "plan" as const, label: "Management Plan", icon: "🩺" },
];

export default function DiabetesTracker() {
  const [tab, setTab] = useState<Tab>("log");
  const { entries, addEntry, removeEntry, clearAll } = useGlucoseLog();
  // One shared copy of the plan, so the chart and log use the range the
  // person entered on the Management Plan tab straight away.
  const planState = useDiabetesManagementPlan();
  const { plan } = planState;
  const { timezone } = useTimezone();

  function handleExportCsv() {
    downloadCsv(
      "bgl-insulin-log",
      [
        "Date/time",
        "BGL (mmol/L)",
        "Compared with the plan's range",
        "Reading context",
        "Insulin type",
        "Insulin dose (units)",
        "Notes",
      ],
      [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).map((e) => {
        const band = classifyReading(e.bglMmol, plan);
        return [
        formatRecordDateTime(e.occurredAt, timezone),
        e.bglMmol,
        band ? READING_BAND_LABELS[band] : "",
        e.context,
        e.insulinType,
        e.insulinDose,
        e.notes,
        ];
      })
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Diabetes tracker sections" />

      {tab === "log" ? (
        <>
          <GlucoseEntryForm onSave={addEntry} />

          <div className="rounded-2xl border-2 border-border bg-surface p-4">
            <h2 className="font-display mb-3 text-lg font-bold">BGL over time</h2>
            <GlucoseTrendChart entries={entries} plan={plan} />
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
                    className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
            <GlucoseLogList entries={entries} onRemove={removeEntry} plan={plan} />
          </div>
        </>
      ) : (
        <DiabetesManagementPlan {...planState} />
      )}
    </div>
  );
}
