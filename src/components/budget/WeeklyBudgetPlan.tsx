"use client";

import { useEffect, useId, useState } from "react";
import { formatCurrency } from "@/lib/budget-data";
import { useWeeklyPlan } from "@/lib/budget-storage";
import {
  PAY_PERIODS,
  checkAfford,
  parseDollars,
  sumDollars,
} from "@/lib/budget-calc";

export default function WeeklyBudgetPlan() {
  const {
    plan,
    setWeeklyAmount,
    setPeriod,
    addItem,
    togglePaid,
    resetPaid,
    removeItem,
    clearItems,
    hydrated,
  } = useWeeklyPlan();
  const [amountInput, setAmountInput] = useState("");
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const amountId = useId();
  const labelId = useId();
  const costId = useId();
  const priceId = useId();
  const priceLabelId = useId();

  useEffect(() => {
    // Syncing local editable state from storage once hydration completes is
    // a legitimate synchronization-with-the-DOM effect, same pattern as the
    // storage hooks themselves. Only re-runs on hydration, not on every
    // keystroke - afterwards amountInput is the source of truth for typing.
    if (hydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmountInput(plan.weeklyAmount ? String(plan.weeklyAmount) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const periodInfo = PAY_PERIODS.find((p) => p.id === plan.period) ?? PAY_PERIODS[0];

  function handleAmountChange(value: string) {
    setAmountInput(value);
    setWeeklyAmount(parseDollars(value) ?? 0);
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const parsedCost = parseDollars(cost);
    if (!label.trim() || parsedCost === null || parsedCost <= 0) return;
    addItem({ label: label.trim(), cost: parsedCost });
    setLabel("");
    setCost("");
  }

  const totalPlanned = sumDollars(plan.items.map((item) => item.cost));
  const totalPaid = sumDollars(plan.items.filter((i) => i.paid).map((i) => i.cost));
  const remaining = sumDollars([plan.weeklyAmount, -totalPlanned]);
  const paidCount = plan.items.filter((i) => i.paid).length;
  const plannedPct =
    plan.weeklyAmount > 0 ? Math.min(100, (totalPlanned / plan.weeklyAmount) * 100) : 0;

  const price = parseDollars(priceInput);
  const afford = price !== null && price > 0 ? checkAfford(remaining, price) : null;

  function handleAddCheckedItem() {
    if (price === null || price <= 0) return;
    addItem({ label: priceLabel.trim() || "Something I want to buy", cost: price });
    setPriceInput("");
    setPriceLabel("");
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display mb-1 text-lg font-bold">My spending plan</h2>
      <p className="mb-4 text-sm text-muted">
        Put in how much money you have to spend {periodInfo.each}. Then add
        the things it needs to pay for, and see what is left.
      </p>

      <fieldset className="no-print mb-4">
        <legend className="mb-1 font-semibold">How often do you get your money?</legend>
        <div className="flex flex-wrap gap-2">
          {PAY_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={plan.period === p.id}
              className={`touch-target flex-1 rounded-xl border-2 px-3 font-semibold ${
                plan.period === p.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              {plan.period === p.id && <span aria-hidden="true">✓ </span>}
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">
          Centrelink and DSP payments usually come every fortnight.
        </p>
      </fieldset>

      <div className="mb-4">
        <label htmlFor={amountId} className="mb-1 block font-semibold">
          Money to spend {periodInfo.each} ($)
        </label>
        <input
          id={amountId}
          type="text"
          inputMode="decimal"
          value={amountInput}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="0.00"
          className="touch-target w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3"
        />
      </div>

      {plan.items.length > 0 && (
        <>
          <p className="mb-2 text-sm text-muted">
            Tick each one when you have paid for it.
          </p>
          <ul className="mb-4 flex flex-col gap-2">
            {plan.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-xl border-2 border-border bg-background p-1"
              >
                <label className="touch-target flex flex-1 cursor-pointer items-center gap-3 rounded-lg px-2">
                  <input
                    type="checkbox"
                    checked={item.paid}
                    onChange={() => togglePaid(item.id)}
                    className="h-6 w-6 shrink-0 accent-brand"
                  />
                  <span className={`flex-1 font-semibold ${item.paid ? "text-muted line-through" : ""}`}>
                    {item.label}
                    {item.paid && <span className="sr-only"> (paid)</span>}
                  </span>
                  <span className="font-display font-bold">{formatCurrency(item.cost)}</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.label} from plan`}
                  className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleAddItem} className="no-print flex flex-wrap items-end gap-2">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor={labelId} className="mb-1 block text-sm font-semibold">
            What is it for?
          </label>
          <input
            id={labelId}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={80}
            placeholder="e.g. Rent, bus fares, phone"
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </div>
        <div className="w-32">
          <label htmlFor={costId} className="mb-1 block text-sm font-semibold">
            Cost ($)
          </label>
          <input
            id={costId}
            type="text"
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
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
        <div className="no-print mt-3 flex flex-wrap gap-2">
          {paidCount > 0 && (
            <button
              type="button"
              onClick={resetPaid}
              className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
            >
              Untick all for next {plan.period}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all planned items? This can't be undone.")) {
                clearItems();
              }
            }}
            className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted"
          >
            Clear planned items
          </button>
        </div>
      )}

      <div className="mt-4 border-t-2 border-border pt-4">
        {plan.weeklyAmount > 0 && (
          <div
            className="mb-2 h-5 overflow-hidden rounded-full border-2 border-border bg-background"
            role="img"
            aria-label={`${Math.round(plannedPct)}% of your money is planned`}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${plannedPct}%`,
                backgroundColor: remaining < 0 ? "var(--sev-5)" : "var(--brand)",
              }}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-muted">
            Planned: {formatCurrency(totalPlanned)} of {formatCurrency(plan.weeklyAmount)}
            {paidCount > 0 && ` · Paid so far: ${formatCurrency(totalPaid)}`}
          </span>
          <span className="font-display text-lg font-bold" aria-live="polite">
            {remaining < 0 ? (
              <>
                <span aria-hidden="true">⚠️ </span>Over by {formatCurrency(Math.abs(remaining))}
              </>
            ) : (
              <>
                <span aria-hidden="true">✅ </span>
                {formatCurrency(remaining)} left
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-border bg-surface-2 p-4">
        <h3 className="font-display mb-1 text-base font-bold">Can I afford this?</h3>
        <p className="mb-3 text-sm text-muted">
          Type the price of something you want. This checks it against the
          money left in your plan.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[10rem] flex-1">
            <label htmlFor={priceLabelId} className="mb-1 block text-sm font-semibold">
              What is it? (optional)
            </label>
            <input
              id={priceLabelId}
              type="text"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              maxLength={80}
              placeholder="e.g. New shoes"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
            />
          </div>
          <div className="w-32">
            <label htmlFor={priceId} className="mb-1 block text-sm font-semibold">
              Price ($)
            </label>
            <input
              id={priceId}
              type="text"
              inputMode="decimal"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="0.00"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
            />
          </div>
        </div>
        <div aria-live="polite" className="mt-3">
          {afford && plan.weeklyAmount <= 0 && (
            <p className="rounded-xl border-2 border-border bg-background p-3 text-sm font-semibold">
              Put in how much money you have to spend first (above).
            </p>
          )}
          {afford && plan.weeklyAmount > 0 && (
            <div className="rounded-xl border-2 border-border bg-background p-3">
              <p className="font-display text-xl font-bold">
                {afford.canAfford ? (
                  <>
                    <span aria-hidden="true">✅ </span>Yes, it fits in your plan
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">❌ </span>No, not this {plan.period}
                  </>
                )}
              </p>
              <p className="mt-1 text-sm">
                {afford.canAfford
                  ? `You would have ${formatCurrency(afford.leftAfter)} left.`
                  : `You would need ${formatCurrency(afford.shortBy)} more.`}
              </p>
              {afford.canAfford && (
                <button
                  type="button"
                  onClick={handleAddCheckedItem}
                  className="no-print touch-target mt-2 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                >
                  Add it to my plan
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
