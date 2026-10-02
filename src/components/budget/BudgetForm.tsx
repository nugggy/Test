"use client";

import { useId, useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/budget-data";
import type { BudgetTransaction, TransactionType } from "@/lib/budget-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface BudgetFormProps {
  onSave: (data: Omit<BudgetTransaction, "id">) => void;
}

export default function BudgetForm({ onSave }: BudgetFormProps) {
  const { timezone } = useTimezone();
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(() => getTodayDateString(timezone));
  const formId = useId();

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory(nextType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    onSave({
      type,
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      category,
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
      <h2 className="font-display text-lg font-bold">Add money in or out</h2>

      <div role="group" aria-label="Transaction type" className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          aria-pressed={type === "expense"}
          className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
            type === "expense"
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-background"
          }`}
        >
          <span aria-hidden="true">➖ </span>Money out
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          aria-pressed={type === "income"}
          className={`touch-target flex-1 rounded-xl border-2 font-semibold ${
            type === "income"
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-background"
          }`}
        >
          <span aria-hidden="true">➕ </span>Money in
        </button>
      </div>

      <div>
        <label htmlFor={`${formId}-desc`} className="block font-semibold mb-1">
          Description
        </label>
        <input
          id={`${formId}-desc`}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={100}
          placeholder="e.g. Weekly groceries"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${formId}-amount`} className="block font-semibold mb-1">
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
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-date`} className="block font-semibold mb-1">
            Date
          </label>
          <input
            id={`${formId}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-category`} className="block font-semibold mb-1">
          Category
        </label>
        <select
          id={`${formId}-category`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save
      </button>
    </form>
  );
}
