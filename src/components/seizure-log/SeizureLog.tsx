"use client";

import { useState } from "react";
import { formatElapsed, formatRecordDateTime, useSeizureLog } from "@/lib/seizure-log-storage";
import { useTimezone } from "@/lib/timezone-context";
import { downloadCsv } from "@/lib/csv-export";
import SeizureLogForm, { type SeizureFormPrefill } from "./SeizureLogForm";
import SeizureTimer, { type TimerResult } from "./SeizureTimer";
import SeizureLogList from "./SeizureLogList";
import SeizureDashboard from "./SeizureDashboard";
import PrintButton from "@/components/PrintButton";
import Tabs from "@/components/Tabs";

type Tab = "log" | "dashboard";

type Period = "30" | "90" | "365" | "all";

const PERIODS: { id: Period; label: string }[] = [
  { id: "30", label: "Last 30 days" },
  { id: "90", label: "Last 3 months" },
  { id: "365", label: "Last 12 months" },
  { id: "all", label: "All time" },
];

/** Earliest timestamp included in a period (worked out when it is chosen). */
function cutoffFor(period: Period): number {
  return period === "all" ? 0 : Date.now() - Number(period) * 24 * 60 * 60 * 1000;
}

const TABS = [
  { id: "log" as const, label: "Log entry", icon: "📝" },
  { id: "dashboard" as const, label: "Dashboard", icon: "📊" },
];

export default function SeizureLog() {
  const [tab, setTab] = useState<Tab>("log");
  const { entries, addEntry, removeEntry, clearAll } = useSeizureLog();
  const { timezone } = useTimezone();
  const [prefill, setPrefill] = useState<SeizureFormPrefill | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [period, setPeriodState] = useState<Period>("all");
  const [periodCutoffMs, setPeriodCutoffMs] = useState(0);

  function setPeriod(next: Period) {
    setPeriodState(next);
    setPeriodCutoffMs(cutoffFor(next));
  }

  const periodEntries =
    period === "all"
      ? entries
      : entries.filter((e) => new Date(e.occurredAt).getTime() >= periodCutoffMs);
  const periodLabel = PERIODS.find((p) => p.id === period)?.label ?? "All time";

  function handleTimerStopped(result: TimerResult) {
    const actions: string[] = [];
    let medicationDetail = "";
    const noteParts: string[] = [];
    for (const event of result.events) {
      if (!actions.includes(event.label)) actions.push(event.label);
      if (event.label === "Rescue medication given") {
        medicationDetail = `Given ${formatElapsed(event.offsetSeconds)} after the start`;
      }
      noteParts.push(`${event.label} at ${formatElapsed(event.offsetSeconds)}`);
    }
    setPrefill({
      occurredAt: result.startedAt,
      durationSeconds: result.durationSeconds,
      actionsTaken: actions,
      medicationDetail,
      notes: noteParts.length ? `Timer notes: ${noteParts.join("; ")}.` : "",
    });
    setFormKey((k) => k + 1);
    window.setTimeout(() => {
      document.getElementById("seizure-form-heading")?.focus();
    }, 50);
  }

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
      [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).map((e) => [
        formatRecordDateTime(e.occurredAt, timezone),
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
          <SeizureTimer onStopped={handleTimerStopped} />

          <SeizureLogForm
            key={formKey}
            prefill={prefill}
            onSave={(data) => {
              addEntry(data);
              setPrefill(null);
            }}
          />

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
            <SeizureLogList entries={entries} onRemove={removeEntry} />
          </div>
        </>
      ) : (
        <>
          <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
            <p id="seizure-period-label" className="mb-2 font-semibold">
              Show seizures from
            </p>
            <div role="group" aria-labelledby="seizure-period-label" className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  aria-pressed={period === p.id}
                  className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                    period === p.id
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <p className="hidden text-sm font-semibold print:block">Period: {periodLabel}</p>
          <SeizureDashboard
            entries={periodEntries}
            allEntriesCount={entries.length}
            periodLabel={periodLabel}
            onExportCsv={handleExportCsv}
          />
          {periodEntries.length > 0 && (
            <div className="rounded-2xl border-2 border-border bg-surface p-4">
              <h2 className="font-display mb-3 text-lg font-bold">
                Full log, {periodLabel.toLowerCase()}
              </h2>
              <SeizureLogList entries={periodEntries} onRemove={removeEntry} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
