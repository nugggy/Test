"use client";

import type { Medication, MedicationLogEntry } from "@/lib/medication-storage";
import CategoryBreakdownChart from "@/components/CategoryBreakdownChart";
import PrintButton from "@/components/PrintButton";

interface MedicationDashboardProps {
  medications: Medication[];
  entries: MedicationLogEntry[];
  onExportCsv: () => void;
}

const WINDOW_DAYS = 14;

function dateKeyDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MedicationDashboard({
  medications,
  entries,
  onExportCsv,
}: MedicationDashboardProps) {
  if (medications.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Dashboard</h2>
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          Add a medication on the Checklist tab to start building the dashboard.
        </p>
      </div>
    );
  }

  const dosesPerDay = medications.reduce((sum, m) => sum + m.times.length, 0);
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const daysAgo = WINDOW_DAYS - 1 - i;
    const key = dateKeyDaysAgo(daysAgo);
    const takenCount = entries.filter((e) => e.date === key).length;
    // Today's doses whose time hasn't arrived yet aren't "missed" - only
    // count doses up to the current time for today, all of them for past days.
    let expectedCount = dosesPerDay;
    if (daysAgo === 0) {
      const nowHm = new Date().toTimeString().slice(0, 5);
      expectedCount = medications.reduce(
        (sum, m) => sum + m.times.filter((t) => t <= nowHm).length,
        0
      );
    }
    const missedCount = Math.max(0, expectedCount - takenCount);
    return { key, takenCount, expectedCount, missedCount };
  });

  const totalExpected = days.reduce((sum, d) => sum + d.expectedCount, 0);
  const totalTaken = days.reduce((sum, d) => sum + Math.min(d.takenCount, d.expectedCount), 0);
  const totalMissed = days.reduce((sum, d) => sum + d.missedCount, 0);
  const adherencePct = totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : null;

  const maxDoses = Math.max(...days.map((d) => Math.max(d.expectedCount, d.takenCount)), 1);
  const barWidth = 20;
  const barGap = 8;
  const plotHeight = 110;
  const labelSpace = 20;
  const chartWidth = days.length * (barWidth + barGap) + barGap;

  const perMedication = medications
    .map((med) => {
      const expected = med.times.length * WINDOW_DAYS;
      const takenRecent = entries.filter(
        (e) => e.medicationId === med.id && days.some((d) => d.key === e.date)
      ).length;
      const pct = expected > 0 ? Math.round((Math.min(takenRecent, expected) / expected) * 100) : null;
      return {
        label: med.name || "(unnamed)",
        count: pct ?? 0,
        displayValue: pct == null ? "—" : `${pct}%`,
        ariaLabel: `${med.name}: ${pct == null ? "no scheduled times" : `${pct}% taken`}`,
        color:
          pct == null
            ? "var(--border)"
            : pct >= 80
              ? "var(--sev-1)"
              : pct >= 50
                ? "var(--sev-3)"
                : "var(--sev-5)",
      };
    })
    .filter((m) => m.label);

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
        A summary of doses taken over the last {WINDOW_DAYS} days, useful to bring to a
        doctor or pharmacist review. &quot;Missed&quot; means a scheduled dose with no
        tick in the checklist by the end of that day - not a clinical judgement.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label={`Adherence (${WINDOW_DAYS} days)`}
          value={adherencePct == null ? "—" : `${adherencePct}%`}
          alert={adherencePct != null && adherencePct < 50}
        />
        <StatTile label="Doses taken" value={String(totalTaken)} />
        <StatTile
          label="Doses missed"
          value={String(totalMissed)}
          alert={totalMissed > 0}
        />
        <StatTile label="Medications tracked" value={String(medications.length)} />
      </div>

      <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
        <h3 className="font-display mb-3 text-base font-bold">Taken vs missed, last {WINDOW_DAYS} days</h3>
        <p className="mb-2 text-xs text-muted">
          Green: taken · Red: missed. Bar height is the number of doses scheduled that day.
        </p>
        <div className="overflow-x-auto">
          <svg
            role="img"
            aria-label={`Bar chart of doses taken versus missed for the last ${WINDOW_DAYS} days`}
            width={chartWidth}
            height={plotHeight + labelSpace}
            viewBox={`0 0 ${chartWidth} ${plotHeight + labelSpace}`}
            className="block"
          >
            {days.map((day, i) => {
              const x = barGap + i * (barWidth + barGap);
              const takenHeight =
                day.expectedCount === 0
                  ? 0
                  : (Math.min(day.takenCount, day.expectedCount) / maxDoses) * (plotHeight - 8);
              const missedHeight = (day.missedCount / maxDoses) * (plotHeight - 8);
              const takenY = plotHeight - takenHeight;
              const missedY = takenY - missedHeight;
              const date = new Date(day.key);
              return (
                <g key={day.key}>
                  {day.missedCount > 0 && (
                    <rect
                      x={x}
                      y={missedY}
                      width={barWidth}
                      height={missedHeight}
                      rx={3}
                      fill="var(--sev-5)"
                    />
                  )}
                  {takenHeight > 0 && (
                    <rect
                      x={x}
                      y={takenY}
                      width={barWidth}
                      height={takenHeight}
                      rx={3}
                      fill="var(--sev-1)"
                    />
                  )}
                  <text
                    x={x + barWidth / 2}
                    y={plotHeight + 14}
                    textAnchor="middle"
                    className="fill-muted"
                    fontSize="9"
                  >
                    {DAY_LABELS[date.getDay()]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
        <h3 className="font-display mb-3 text-base font-bold">By medication</h3>
        <CategoryBreakdownChart
          data={perMedication}
          emptyMessage="Add a medication to see adherence by medication."
        />
      </div>
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
