"use client";

import { useMemo, useState } from "react";
import { DAYS } from "@/lib/weekly-schedule-storage";
import { useMealPlan } from "@/lib/meal-plan-storage";
import { useRecipes } from "@/lib/recipe-storage";
import { useShoppingListState } from "@/lib/shopping-list-storage";

interface ShoppingLine {
  key: string;
  text: string;
  count: number;
}

export default function ShoppingListTab() {
  const { recipes } = useRecipes();
  const { mealPlan } = useMealPlan();
  const {
    isChecked,
    toggleChecked,
    clearChecked,
    extraItems,
    addExtraItem,
    toggleExtraItem,
    removeExtraItem,
  } = useShoppingListState();
  const [extraLabel, setExtraLabel] = useState("");

  const lines = useMemo<ShoppingLine[]>(() => {
    const counts = new Map<string, ShoppingLine>();
    for (const day of DAYS) {
      const assignment = mealPlan[day.key];
      if (!assignment) continue;
      const recipe = recipes.find((r) => r.id === assignment.recipeId);
      if (!recipe) continue;
      for (const ingredient of recipe.ingredients) {
        const text = ingredient.trim();
        if (!text) continue;
        const key = text.toLowerCase();
        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { key, text, count: 1 });
        }
      }
    }
    return [...counts.values()].sort((a, b) => a.text.localeCompare(b.text));
  }, [mealPlan, recipes]);

  function handleAddExtra(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = extraLabel.trim();
    if (!trimmed) return;
    addExtraItem(trimmed);
    setExtraLabel("");
  }

  function handleUncheckAll() {
    clearChecked();
    for (const item of extraItems) {
      if (item.checked) toggleExtraItem(item.id);
    }
  }

  const hasAnything = lines.length > 0 || extraItems.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Built from the meals you&apos;ve planned this week.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUncheckAll}
            className="rounded-xl border-2 border-border bg-surface px-3 py-2 text-sm font-semibold"
          >
            Uncheck all
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border-2 border-brand bg-brand px-3 py-2 text-sm font-semibold text-brand-ink"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {!hasAnything ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No items yet — plan some meals for the week, or add your own item
          below.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lines.map((line) => (
            <li
              key={line.key}
              className="rounded-xl border-2 border-border bg-surface p-1"
            >
              <label className="touch-target flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  checked={isChecked(line.key)}
                  onChange={() => toggleChecked(line.key)}
                  className="h-6 w-6 shrink-0"
                />
                <span
                  className={`flex-1 ${
                    isChecked(line.key) ? "line-through text-muted" : ""
                  }`}
                >
                  {line.text}
                  {line.count > 1 ? ` × ${line.count}` : ""}
                </span>
              </label>
            </li>
          ))}
          {extraItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-1 rounded-xl border-2 border-border bg-surface p-1"
            >
              <label className="touch-target flex flex-1 cursor-pointer items-center gap-3 rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleExtraItem(item.id)}
                  className="h-6 w-6 shrink-0"
                />
                <span
                  className={`flex-1 ${
                    item.checked ? "line-through text-muted" : ""
                  }`}
                >
                  {item.label}
                </span>
              </label>
              <button
                type="button"
                onClick={() => removeExtraItem(item.id)}
                aria-label={`Remove ${item.label}`}
                className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-background"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddExtra} className="no-print flex gap-2">
        <label htmlFor="extra-item" className="sr-only">
          Add another item
        </label>
        <input
          id="extra-item"
          type="text"
          value={extraLabel}
          onChange={(e) => setExtraLabel(e.target.value)}
          maxLength={80}
          placeholder="Add another item (e.g. toothpaste)"
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Add
        </button>
      </form>
    </div>
  );
}
