"use client";

import { useId, useState } from "react";
import { NDIS_CATEGORIES, NDIS_GROUPS, categoryById } from "@/lib/ndis-budget-data";
import type { NdisExpense } from "@/lib/ndis-budget-storage";
import { parseDollars } from "@/lib/budget-calc";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface NdisExpenseFormProps {
  onSave: (data: Omit<NdisExpense, "id">) => void;
}

const SELECTABLE = NDIS_CATEGORIES.filter((c) => !c.legacy);

export default function NdisExpenseForm({ onSave }: NdisExpenseFormProps) {
  const { timezone } = useTimezone();
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(SELECTABLE[0].id);
  const [date, setDate] = useState(() => getTodayDateString(timezone));
  const [message, setMessage] = useState("");
  const formId = useId();

  const hint = categoryById(categoryId)?.hint;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseDollars(amount);
    if (!description.trim() || parsedAmount === null || parsedAmount <= 0) {
      setMessage("Please fill in what it was for and the amount.");
      return;
    }
    onSave({
      description: description.trim(),
      provider: provider.trim(),
      amount: parsedAmount,
      categoryId,
      date,
    });
    setMessage(`Saved: ${description.trim()}.`);
    setDescription("");
    setAmount("");
    setDate(getTodayDateString(timezone));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Add spending</h2>

      <div>
        <label htmlFor={`${formId}-desc`} className="mb-1 block font-semibold">
          What was it for?
        </label>
        <input
          id={`${formId}-desc`}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={100}
          placeholder="e.g. Support worker shift, OT session"
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-provider`} className="mb-1 block font-semibold">
          Who was paid? (optional)
        </label>
        <input
          id={`${formId}-provider`}
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          maxLength={100}
          placeholder="e.g. provider or shop name"
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-amount`} className="mb-1 block font-semibold">
            Amount ($)
          </label>
          <input
            id={`${formId}-amount`}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-date`} className="mb-1 block font-semibold">
            Date
          </label>
          <input
            id={`${formId}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-category`} className="mb-1 block font-semibold">
          Support category
        </label>
        <select
          id={`${formId}-category`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-describedby={hint ? `${formId}-hint` : undefined}
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        >
          {NDIS_GROUPS.map((group) => (
            <optgroup key={group.id} label={group.id}>
              {SELECTABLE.filter((c) => c.group === group.id).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.number ? `${c.number} ` : ""}
                  {c.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {hint && (
          <p id={`${formId}-hint`} className="mt-1 text-xs text-muted">
            {hint}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save spending
      </button>
      <p aria-live="polite" className="text-sm font-semibold">
        {message}
      </p>
    </form>
  );
}
