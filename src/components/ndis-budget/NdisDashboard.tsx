"use client";

import { NDIS_GROUPS, formatCurrency } from "@/lib/ndis-budget-data";
import { getPlanElapsedFraction, type NdisExpense, type NdisPlan } from "@/lib/ndis-budget-storage";
import {
  activeRows,
  categoryRows,
  groupTotals,
  perWeek,
  splitByPlanDates,
  totalsOf,
  weeksLeftInPlan,
  type CategoryRow,
} from "@/lib/ndis-budget-calc";
import { formatDateOnly } from "@/lib/budget-calc";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface NdisDashboardProps {
  plan: NdisPlan;
  expenses: NdisExpense[];
}

// A category is flagged as spending faster than the plan period once its
// spent-vs-elapsed gap passes this margin - loose enough that normal
// week-to-week variation in a support schedule doesn't trigger false alarms.
const PACE_WARNING_MARGIN = 0.15;

type Pace = "none" | "over" | "fast" | "slow" | "ok" | "nodates";

function paceOf(allocated: number, fraction: number, elapsed: number | null): Pace {
  if (allocated <= 0) return "none";
  if (fraction > 1) return "over";
  if (elapsed === null) return "nodates";
  if (fraction - elapsed > PACE_WARNING_MARGIN) return "fast";
  if (elapsed - fraction > PACE_WARNING_MARGIN) return "slow";
  return "ok";
}

// Colour is only used on the bar. The words and symbol carry the meaning,
// so it still works without colour (and the text keeps full contrast).
const PACE_INFO: Record<Pace, { icon: string; text: string; bar: string }> = {
  none: { icon: "➖", text: "No amount put in for this yet", bar: "var(--sev-5)" },
  over: { icon: "❗", text: "More spent than the amount in the plan", bar: "var(--sev-5)" },
  fast: { icon: "⚠️", text: "Spending faster than the plan time so far", bar: "var(--sev-3)" },
  slow: { icon: "🐢", text: "Spending slower than the plan time so far", bar: "var(--sev-1)" },
  ok: { icon: "✅", text: "On track with the plan time", bar: "var(--sev-1)" },
  nodates: { icon: "📅", text: "Add plan dates to see if you are on track", bar: "var(--sev-1)" },
};

export default function NdisDashboard({ plan, expenses }: NdisDashboardProps) {
  const { timezone } = useTimezone();
  const today = getTodayDateString(timezone);
  const elapsed = getPlanElapsedFraction(plan, today);

  const { inPlan, outside } = splitByPlanDates(plan, expenses);
  const rows = categoryRows(plan, inPlan);
  const shown = activeRows(rows);
  const total = totalsOf(rows);
  const weeksLeft = weeksLeftInPlan(plan, today);
  const weekly = perWeek(total.left, weeksLeft);
  const totalPace = PACE_INFO[paceOf(total.allocated, total.fraction, elapsed)];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-lg font-bold">Plan dashboard</h2>

      <div className="rounded-xl border-2 border-border bg-background p-4">
        <p className="text-sm font-semibold text-muted">Left to spend in the whole plan</p>
        <p className="font-display text-3xl font-bold">
          {total.left < 0 ? `Over by ${formatCurrency(-total.left)}` : formatCurrency(total.left)}
        </p>
        <p className="mb-2 text-sm text-muted">
          {formatCurrency(total.spent)} spent of {formatCurrency(total.allocated)}
        </p>
        <ProgressBar fraction={total.fraction} color={totalPace.bar} />
        <ul className="mt-2 flex flex-col gap-1 text-sm">
          {elapsed !== null && (
            <li>
              <span aria-hidden="true">🕒 </span>
              {Math.round(elapsed * 100)}% of the plan time has passed (ends{" "}
              {formatDateOnly(plan.endDate)}
              {weeksLeft !== null ? `, about ${weeksLeft} ${weeksLeft === 1 ? "week" : "weeks"} left` : ", plan has ended"}).
            </li>
          )}
          {weekly !== null && (
            <li>
              <span aria-hidden="true">📆 </span>
              Spread evenly, that is about {formatCurrency(weekly)} a week until the plan ends.
            </li>
          )}
          {total.allocated > 0 && (
            <li>
              <span aria-hidden="true">{totalPace.icon} </span>
              {totalPace.text}
            </li>
          )}
        </ul>
      </div>

      {outside.length > 0 && (
        <p className="rounded-xl border-2 border-dashed border-border bg-background p-3 text-sm">
          <span aria-hidden="true">ℹ️ </span>
          {outside.length} spending {outside.length === 1 ? "entry is" : "entries are"} outside
          your plan dates, so {outside.length === 1 ? "it is" : "they are"} not counted here.
          {outside.length === 1 ? " It is" : " They are"} still in the spending log below.
        </p>
      )}

      {shown.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
          Put in the amounts from your NDIS plan above to see how much is left in each category.
        </p>
      ) : (
        NDIS_GROUPS.map((group) => {
          const groupRows = shown.filter((r) => r.category.group === group.id);
          if (groupRows.length === 0) return null;
          const g = groupTotals(rows, group.id);
          return (
            <section key={group.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-1 border-b-2 border-border pb-1">
                <h3 className="font-display text-base font-bold">{group.id}</h3>
                <span className="text-sm font-semibold">
                  {g.left < 0 ? `Over by ${formatCurrency(-g.left)}` : `${formatCurrency(g.left)} left`}{" "}
                  <span className="font-normal text-muted">of {formatCurrency(g.allocated)}</span>
                </span>
              </div>
              <p className="text-xs text-muted">{group.note}</p>
              {groupRows.map((row) => (
                <CategoryCard key={row.category.id} row={row} elapsed={elapsed} />
              ))}
            </section>
          );
        })
      )}
      {shown.length > 0 && (
        <p className="text-xs text-muted">
          Categories with no money put in and no spending are hidden.
        </p>
      )}
    </div>
  );
}

function CategoryCard({ row, elapsed }: { row: CategoryRow; elapsed: number | null }) {
  const pace = PACE_INFO[paceOf(row.allocated, row.fraction, elapsed)];
  return (
    <div className="rounded-xl border-2 border-border bg-background p-3">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
        <span className="text-sm font-semibold">
          {row.category.number && <span className="text-muted">{row.category.number} </span>}
          {row.category.label}
        </span>
        <span className="font-display font-bold">
          {row.left < 0 ? `Over by ${formatCurrency(-row.left)}` : `${formatCurrency(row.left)} left`}
        </span>
      </div>
      <p className="mb-1 text-xs text-muted">
        {formatCurrency(row.spent)} spent of {formatCurrency(row.allocated)}
      </p>
      <ProgressBar fraction={row.fraction} color={pace.bar} />
      <p className="mt-1 text-xs font-semibold">
        <span aria-hidden="true">{pace.icon} </span>
        {pace.text}
      </p>
    </div>
  );
}

function ProgressBar({ fraction, color }: { fraction: number; color: string }) {
  const width = Math.min(100, Math.max(fraction > 0 ? 3 : 0, fraction * 100));
  return (
    <div
      className="h-4 overflow-hidden rounded-full border-2 border-border bg-surface"
      role="img"
      aria-label={`${Math.round(fraction * 100)}% spent`}
    >
      <div
        className="h-full rounded-full transition-[width] motion-reduce:transition-none"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
