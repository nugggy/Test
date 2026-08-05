"use client";

import { useEffect, useId, useState } from "react";
import { formatCurrency } from "@/lib/budget-data";
import { useWeeklyPlan } from "@/lib/budget-storage";

export default function WeeklyBudgetPlan() {
  const { plan, setWeeklyAmount, addItem, removeItem, clearItems, hydrated } =
    useWeeklyPlan();
  const [amountInput, setAmountInput] = useState("");
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const amountId = useId();
  const labelId = useId();
  const costId = useId();

  useEffect(() => {
    // Syncing local editable state from storage once hydration completes is
    // a legitimate synchronization-with-the-DOM effect, same pattern as the
    // storage hooks themselves. Only re-runs on hydration, not on every
    // keystroke — afterwards amountInput is the source of truth for typing.
    if (hydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmountInput(plan.weeklyAmount ? String(plan.weeklyAmount) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function handleAmountChange(value: string) {
    setAmountInput(value);
    const parsed = parseFloat(value);
    setWeeklyAmount(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const parsedCost = parseFloat(cost);
    if (!label.trim() || !Number.isFinite(parsedCost) || parsedCost <= 0) return;
    addItem({ label: label.trim(), cost: Math.round(parsedCost * 100) / 100 });
    setLabel("");
    setCost("");
  }

  const totalPlanned = plan.items.reduce((sum, item) => sum + item.cost, 0);
  const remaining = plan.weeklyAmount - totalPlanned;

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display mb-1 text-lg font-bold">Weekly spending plan</h2>
      <p className="mb-4 text-sm text-muted">
        Set how much you have to spend each week, then plan out what it goes
        on before you spend it.
      </p>

      <div className="mb-4">
        <label htmlFor={amountId} className="block font-semibold mb-1">
          Money to spend this week ($)
        </label>
        <input
          id={amountId}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amountInput}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="0.00"
          className="w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      {plan.items.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {plan.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3"
            >
              <span className="flex-1 font-semibold">{item.label}</span>
              <span className="font-display font-bold">
                {formatCurrency(item.cost)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.label} from plan`}
                className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddItem} className="no-print flex flex-wrap items-end gap-2">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor={labelId} className="block text-sm font-semibold mb-1">
            What&apos;s it for?
          </label>
          <input
            id={labelId}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={80}
            placeholder="e.g. Bus fares"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
        <div className="w-28">
          <label htmlFor={costId} className="block text-sm font-semibold mb-1">
            Cost ($)
          </label>
          <input
            id={costId}
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
        <button
          type="submit"
          className="touch-target rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink"
        >
          Add to plan
        </button>
      </form>

      {plan.items.length > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all planned items? This can't be undone.")) {
              clearItems();
            }
          }}
          className="no-print mt-3 text-sm font-semibold text-muted hover:text-foreground"
        >
          Clear planned items
        </button>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-border pt-4">
        <span className="text-sm text-muted">
          Planned: {formatCurrency(totalPlanned)} of {formatCurrency(plan.weeklyAmount)}
        </span>
        <span
          className="font-display text-lg font-bold"
          style={{ color: remaining < 0 ? "var(--cat-pain)" : "var(--brand)" }}
        >
          {remaining < 0 ? "Over by " : ""}
          {formatCurrency(Math.abs(remaining))}
          {remaining >= 0 ? " left" : ""}
        </span>
      </div>
    </div>
  );
}
