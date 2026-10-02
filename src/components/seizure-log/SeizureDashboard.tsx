"use client";

import type { ReactNode } from "react";
import type { SeizureLogEntry } from "@/lib/seizure-log-storage";
import { PROLONGED_SEIZURE_SECONDS } from "@/lib/seizure-log-data";
import SeizureDurationChart from "./SeizureDurationChart";
import SeizureFrequencyChart from "./SeizureFrequencyChart";
import SeizureTimeOfDayChart from "./SeizureTimeOfDayChart";
import CategoryBreakdownChart from "@/components/CategoryBreakdownChart";
import PrintButton from "@/components/PrintButton";

interface SeizureDashboardProps {
  entries: SeizureLogEntry[];
  onExportCsv: () => void;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
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
    .map(([label, count]) => ({ label, count }));
}

export default function SeizureDashboard({ entries, onExportCsv }: SeizureDashboardProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Dashboard</h2>
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          Log a seizure on the Log entry tab to start building the dashboard.
        </p>
      </div>
    );
  }

  const now = new Date();
  const last30Days = entries.filter(
    (e) => now.getTime() - new Date(e.occurredAt).getTime() <= 30 * 24 * 60 * 60 * 1000
  ).length;
  const withDuration = entries.filter((e) => e.durationSeconds > 0);
  const averageDuration = withDuration.length
    ? Math.round(withDuration.reduce((sum, e) => sum + e.durationSeconds, 0) / withDuration.length)
    : 0;
  const longest = withDuration.reduce(
    (max, e) => (e.durationSeconds > max ? e.durationSeconds : max),
    0
  );

  const typeData = topCounts(
    entries.map((e) => e.seizureType || "Not specified"),
    8
  ).map((d) => ({ ...d, color: "var(--brand)" }));

  const triggerData = topCounts(entries.map((e) => e.trigger), 6).map((d) => ({
    ...d,
    color: "var(--accent)",
  }));

  const severityCounts = new Map<string, number>();
  for (const e of entries) {
    const key = e.severity || "Not recorded";
    severityCounts.set(key, (severityCounts.get(key) ?? 0) + 1);
  }
  const severityColors: Record<string, string> = {
    Mild: "var(--sev-1)",
    Moderate: "var(--sev-3)",
    Severe: "var(--sev-5)",
    "Not recorded": "var(--border)",
  };
  const severityData = ["Mild", "Moderate", "Severe", "Not recorded"]
    .filter((key) => severityCounts.has(key))
    .map((label) => ({ label, count: severityCounts.get(label)!, color: severityColors[label] }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Dashboard</h2>
        <div className="no-print flex items-center gap-3">
          <button
            type="button"
            onClick={onExportCsv}
            className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
          >
            ⬇️ Download CSV
          </button>
          <PrintButton label="Print / Download PDF" />
        </div>
      </div>
      <p className="no-print -mt-4 max-w-2xl text-sm text-muted">
        A summary of what&apos;s been logged, useful to bring to a neurologist or GP
        appointment. Every chart is a visual guide only - the full written log is the
        accurate record.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Seizures logged" value={String(entries.length)} />
        <StatTile label="Last 30 days" value={String(last30Days)} />
        <StatTile
          label="Average duration"
          value={withDuration.length ? formatDuration(averageDuration) : "—"}
        />
        <StatTile
          label="Longest duration"
          value={withDuration.length ? formatDuration(longest) : "—"}
          alert={longest >= PROLONGED_SEIZURE_SECONDS}
        />
      </div>

      <DashboardCard title="Duration over time">
        <SeizureDurationChart entries={entries} />
      </DashboardCard>

      <DashboardCard title="Seizures per month">
        <SeizureFrequencyChart entries={entries} />
      </DashboardCard>

      <DashboardCard title="Time of day pattern">
        <SeizureTimeOfDayChart entries={entries} />
      </DashboardCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <DashboardCard title="By seizure type">
          <CategoryBreakdownChart data={typeData} emptyMessage="No seizure types logged yet." />
        </DashboardCard>
        <DashboardCard title="By severity">
          <CategoryBreakdownChart data={severityData} emptyMessage="No severity logged yet." />
        </DashboardCard>
      </div>

      <DashboardCard title="By possible trigger">
        <CategoryBreakdownChart
          data={triggerData}
          emptyMessage="No possible triggers logged yet."
        />
      </DashboardCard>
    </div>
  );
}

function DashboardCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <h3 className="font-display mb-3 text-base font-bold">{title}</h3>
      {children}
    </div>
  );
}

function StatTile({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className="print-avoid-break rounded-2xl border-2 p-4"
      style={{
        borderColor: alert ? "var(--sev-5)" : "var(--border)",
        background: "var(--surface)",
      }}
    >
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p
        className="font-display mt-1 text-2xl font-bold"
        style={{ color: alert ? "var(--sev-5)" : "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  );
}
