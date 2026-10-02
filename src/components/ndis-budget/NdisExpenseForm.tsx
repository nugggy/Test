"use client";

import { useId, useState } from "react";
import { NDIS_CATEGORIES } from "@/lib/ndis-budget-data";
import type { NdisExpense } from "@/lib/ndis-budget-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface NdisExpenseFormProps {
  onSave: (data: Omit<NdisExpense, "id">) => void;
}

export default function NdisExpenseForm({ onSave }: NdisExpenseFormProps) {
  const { timezone } = useTimezone();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(NDIS_CATEGORIES[0].id);
  const [date, setDate] = useState(() => getTodayDateString(timezone));
  const formId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    onSave({
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      categoryId,
      date,
    });
    setDescription("");
    setAmount("");
    setDate(getTodayDateString(timezone));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log spending</h2>

      <div>
        <label htmlFor={`${formId}-desc`} className="mb-1 block font-semibold">
          Description
        </label>
        <input
          id={`${formId}-desc`}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={100}
          placeholder="e.g. Support worker shift"
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${formId}-amount`} className="mb-1 block font-semibold">
            Amount ($)
          </label>
          <input
            id={`${formId}-amount`}
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
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
          Category
        </label>
        <select
          id={`${formId}-category`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
        >
          {NDIS_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save spending
      </button>
    </form>
  );
}
