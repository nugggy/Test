"use client";

import { useBudgetTransactions } from "@/lib/budget-storage";
import PrintButton from "@/components/PrintButton";
import { downloadCsv } from "@/lib/csv-export";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetSummary from "@/components/budget/BudgetSummary";
import WeeklyBudgetPlan from "@/components/budget/WeeklyBudgetPlan";
import BudgetCategoryChart from "@/components/budget/BudgetCategoryChart";
import BudgetTransactionList from "@/components/budget/BudgetTransactionList";

export default function BudgetTracker() {
  const { transactions, addTransaction, removeTransaction, clearAll } =
    useBudgetTransactions();

  function handleExportCsv() {
    downloadCsv(
      "budget-transactions",
      ["Date", "Type", "Description", "Category", "Amount"],
      transactions.map((t) => [
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
      <BudgetSummary transactions={transactions} />
      <WeeklyBudgetPlan />
      <BudgetForm onSave={addTransaction} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          Spending by category
        </h2>
        <BudgetCategoryChart transactions={transactions} />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Transactions</h2>
          {transactions.length > 0 && (
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
                  if (
                    window.confirm(
                      "Clear all transactions? This can't be undone."
                    )
                  ) {
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
        <BudgetTransactionList transactions={transactions} onRemove={removeTransaction} />
      </div>
    </div>
  );
}
