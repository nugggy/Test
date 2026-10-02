"use client";

import { useMemo, useState } from "react";
import { DAYS } from "@/lib/weekly-schedule-storage";
import { useMealPlan } from "@/lib/meal-plan-storage";
import { useRecipes } from "@/lib/recipe-storage";
import { useShoppingListState } from "@/lib/shopping-list-storage";
import { aggregateIngredients } from "@/lib/shopping-list-aggregate";
import { pictureFor } from "@/lib/meal-planner-pictures";
import PrintButton from "@/components/PrintButton";

interface Row {
  key: string;
  text: string;
  checked: boolean;
  onToggle: () => void;
  /** Only extra (hand-added) items can be removed. */
  onRemove?: () => void;
}

function ShoppingRow({ row }: { row: Row }) {
  return (
    <li className="flex items-center gap-1 rounded-xl border-2 border-border bg-surface p-1">
      <label className="touch-target flex flex-1 cursor-pointer items-center gap-3 rounded-lg px-3 py-2">
        <input
          type="checkbox"
          checked={row.checked}
          onChange={row.onToggle}
          className="h-7 w-7 shrink-0 accent-brand"
        />
        <span aria-hidden="true" className="text-3xl">
          {pictureFor(row.text)}
        </span>
        <span className={`flex-1 text-lg ${row.checked ? "text-muted line-through" : ""}`}>
          {row.text}
          {row.checked && <span className="sr-only"> (got it)</span>}
        </span>
      </label>
      {row.onRemove && (
        <button
          type="button"
          onClick={row.onRemove}
          aria-label={`Remove ${row.text}`}
          className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-background"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      )}
    </li>
  );
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

  const lines = useMemo(() => {
    const allIngredients: string[] = [];
    for (const day of DAYS) {
      const assignment = mealPlan[day.key];
      if (!assignment) continue;
      const recipe = recipes.find((r) => r.id === assignment.recipeId);
      if (!recipe) continue;
      allIngredients.push(...recipe.ingredients);
    }
    return aggregateIngredients(allIngredients);
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

  const rows: Row[] = [
    ...lines.map((line) => ({
      key: line.key,
      text: `${line.text}${line.repeatCount ? ` × ${line.repeatCount}` : ""}`,
      checked: isChecked(line.key),
      onToggle: () => toggleChecked(line.key),
    })),
    ...extraItems.map((item) => ({
      key: item.id,
      text: item.label,
      checked: item.checked,
      onToggle: () => toggleExtraItem(item.id),
      onRemove: () => removeExtraItem(item.id),
    })),
  ];
  const toGet = rows.filter((r) => !r.checked);
  const got = rows.filter((r) => r.checked);
  const pct = rows.length > 0 ? Math.round((got.length / rows.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Made from the meals you planned this week. Tick each thing as it
          goes in your trolley.
        </p>
        <div className="flex gap-2">
          {got.length > 0 && (
            <button
              type="button"
              onClick={handleUncheckAll}
              className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
            >
              Untick all
            </button>
          )}
          <PrintButton label="Print" />
        </div>
      </div>

      {rows.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-3">
          <p aria-live="polite" className="mb-2 font-display text-lg font-bold">
            {got.length === rows.length ? (
              <>
                <span aria-hidden="true">🎉 </span>You got everything!
              </>
            ) : (
              `Got ${got.length} of ${rows.length}`
            )}
          </p>
          <div
            className="h-4 overflow-hidden rounded-full border-2 border-border bg-background"
            role="img"
            aria-label={`${pct}% of the list done`}
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          Nothing on the list yet. Plan some meals in This week, or add your
          own item below.
        </p>
      ) : (
        <>
          {toGet.length > 0 && (
            <section>
              <h2 className="font-display mb-2 text-lg font-bold">Still to get</h2>
              <ul className="flex flex-col gap-2">
                {toGet.map((row) => (
                  <ShoppingRow key={row.key} row={row} />
                ))}
              </ul>
            </section>
          )}
          {got.length > 0 && (
            <section>
              <h2 className="font-display mb-2 text-lg font-bold">
                <span aria-hidden="true">🛒 </span>In my trolley
              </h2>
              <ul className="flex flex-col gap-2">
                {got.map((row) => (
                  <ShoppingRow key={row.key} row={row} />
                ))}
              </ul>
            </section>
          )}
        </>
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
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4 py-3"
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
