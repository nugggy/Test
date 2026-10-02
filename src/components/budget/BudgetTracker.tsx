"use client";

import { useState } from "react";
import { useBudgetTransactions } from "@/lib/budget-storage";
import PrintButton from "@/components/PrintButton";
import { downloadCsv } from "@/lib/csv-export";
import { DATE_RANGES, filterByRange, type DateRange } from "@/lib/budget-calc";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetSummary from "@/components/budget/BudgetSummary";
import WeeklyBudgetPlan from "@/components/budget/WeeklyBudgetPlan";
import BudgetCategoryChart from "@/components/budget/BudgetCategoryChart";
import BudgetTransactionList from "@/components/budget/BudgetTransactionList";

export default function BudgetTracker() {
  const { transactions, addTransaction, removeTransaction, clearAll } =
    useBudgetTransactions();
  const { timezone } = useTimezone();
  const [range, setRange] = useState<DateRange>("all");

  const today = getTodayDateString(timezone);
  const shown = filterByRange(transactions, range, today);
  const rangeLabel = DATE_RANGES.find((r) => r.id === range)?.label ?? "";

  function handleExportCsv() {
    downloadCsv(
      "budget-transactions",
      ["Date", "Type", "Description", "Category", "Amount"],
      shown.map((t) => [
        t.date,
        t.type === "income" ? "Income" : "Expense",
        t.description,
        t.category,
        t.amount,
      ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <WeeklyBudgetPlan />
      <BudgetForm onSave={addTransaction} />

      <fieldset className="no-print">
        <legend className="mb-1 font-semibold">Show money in and out for</legend>
        <div className="flex flex-wrap gap-2">
          {DATE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={`touch-target flex-1 rounded-xl border-2 px-3 text-sm font-semibold ${
                range === r.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-surface"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <BudgetSummary transactions={shown} rangeLabel={rangeLabel} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          Spending by category ({rangeLabel.toLowerCase()})
        </h2>
        <BudgetCategoryChart transactions={shown} />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">
            Money in and out ({rangeLabel.toLowerCase()})
          </h2>
          {transactions.length > 0 && (
            <div className="no-print flex flex-wrap items-center gap-2">
              {shown.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
                >
                  ⬇️ Download CSV
                </button>
              )}
              <PrintButton label="Print" />
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Clear ALL transactions, not just the ones shown? This can't be undone."
                    )
                  ) {
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
        <BudgetTransactionList
          transactions={shown}
          hasAny={transactions.length > 0}
          onRemove={removeTransaction}
        />
      </div>
    </div>
  );
}
