"use client";

import { NDIS_CATEGORIES, formatCurrency } from "@/lib/ndis-budget-data";
import { useNdisExpenses, useNdisPlan } from "@/lib/ndis-budget-storage";
import { downloadCsv } from "@/lib/csv-export";
import PrintButton from "@/components/PrintButton";
import NdisPlanSetup from "./NdisPlanSetup";
import NdisDashboard from "./NdisDashboard";
import NdisExpenseForm from "./NdisExpenseForm";

function categoryLabel(categoryId: string): string {
  return NDIS_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export default function NdisBudgetTracker() {
  const { plan, setDates, setAllocation, clearPlan } = useNdisPlan();
  const { expenses, addExpense, removeExpense, clearAll } = useNdisExpenses();

  function handleExportCsv() {
    downloadCsv(
      "ndis-plan-spending",
      ["Date", "Description", "Category", "Amount"],
      expenses.map((e) => [e.date, e.description, categoryLabel(e.categoryId), e.amount])
    );
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6">
      <NdisPlanSetup plan={plan} onSetDates={setDates} onSetAllocation={setAllocation} />
      <NdisDashboard plan={plan} expenses={expenses} />
      <NdisExpenseForm onSave={addExpense} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Spending log</h2>
          <div className="no-print flex items-center gap-3">
            {expenses.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
            )}
            <PrintButton label="Print" />
            {expenses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all logged spending? This can't be undone.")) {
                    clearAll();
                  }
                }}
                className="text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            No spending logged yet - use the form above to log the first one.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold">{e.description}</p>
                  <p className="text-sm text-muted">
                    {categoryLabel(e.categoryId)} · {e.date}
                  </p>
                </div>
                <span className="shrink-0 font-display text-lg font-bold">
                  {formatCurrency(e.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => removeExpense(e.id)}
                  aria-label={`Delete ${e.description}`}
                  className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Clear the plan dates and allocated amounts? Logged spending is kept - use this when your NDIS plan renews."
              )
            ) {
              clearPlan();
            }
          }}
          className="text-sm font-semibold text-muted hover:text-foreground"
        >
          Start a new plan period
        </button>
      </div>
    </div>
  );
}
