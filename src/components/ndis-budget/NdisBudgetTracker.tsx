"use client";

import { categoryById, categoryLabel, formatCurrency } from "@/lib/ndis-budget-data";
import { useNdisExpenses, useNdisPlan } from "@/lib/ndis-budget-storage";
import { formatDateOnly } from "@/lib/budget-calc";
import { downloadCsv } from "@/lib/csv-export";
import PrintButton from "@/components/PrintButton";
import NdisPlanSetup from "./NdisPlanSetup";
import NdisDashboard from "./NdisDashboard";
import NdisExpenseForm from "./NdisExpenseForm";

export default function NdisBudgetTracker() {
  const { plan, setDates, setAllocation, clearPlan } = useNdisPlan();
  const { expenses, addExpense, removeExpense, clearAll } = useNdisExpenses();

  function handleExportCsv() {
    downloadCsv(
      "ndis-plan-spending",
      ["Date", "What it was for", "Paid to", "Support category", "Budget", "Amount"],
      sorted.map((e) => [
        e.date,
        e.description,
        e.provider,
        categoryLabel(e.categoryId),
        categoryById(e.categoryId)?.group ?? "",
        e.amount,
      ])
    );
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
  const usedCategoryIds = new Set(expenses.map((e) => e.categoryId));

  return (
    <div className="flex flex-col gap-6">
      <NdisPlanSetup
        plan={plan}
        usedCategoryIds={usedCategoryIds}
        onSetDates={setDates}
        onSetAllocation={setAllocation}
      />
      <NdisDashboard plan={plan} expenses={expenses} />
      <NdisExpenseForm onSave={addExpense} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Spending log</h2>
          <div className="no-print flex flex-wrap items-center gap-2">
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
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            No spending saved yet. Use the form above to add the first one.
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
                    {formatDateOnly(e.date)}
                    {e.provider && ` · ${e.provider}`}
                  </p>
                  <p className="text-sm text-muted">{categoryLabel(e.categoryId)}</p>
                </div>
                <span className="shrink-0 font-display text-lg font-bold">
                  {formatCurrency(e.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${e.description}"?`)) removeExpense(e.id);
                  }}
                  aria-label={`Delete ${e.description}`}
                  className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
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
                "Clear the plan dates and amounts? Your spending log is kept. Use this when your NDIS plan renews. Spending from before the new plan dates won't be counted against the new plan."
              )
            ) {
              clearPlan();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold text-muted hover:text-foreground"
        >
          Start a new plan period
        </button>
      </div>
    </div>
  );
}
