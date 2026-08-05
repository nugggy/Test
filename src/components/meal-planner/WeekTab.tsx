"use client";

import { useState } from "react";
import Link from "next/link";
import { DAYS, useWeeklySchedule, type DayKey } from "@/lib/weekly-schedule-storage";
import { useMealPlan } from "@/lib/meal-plan-storage";
import { useRecipes, type Recipe } from "@/lib/recipe-storage";
import RecipePickerDialog from "@/components/meal-planner/RecipePickerDialog";

export default function WeekTab() {
  const { recipes } = useRecipes();
  const { mealPlan, setDayMeal, clearDayMeal } = useMealPlan();
  const { addItem: addScheduleItem, removeItem: removeScheduleItem } =
    useWeeklySchedule();
  const [pickerDay, setPickerDay] = useState<DayKey | null>(null);

  function handleSelectRecipe(day: DayKey, recipe: Recipe) {
    const existing = mealPlan[day];
    if (existing) {
      removeScheduleItem(day, existing.scheduleItemId);
    }
    const scheduleItemId = addScheduleItem(day, {
      label: `Dinner: ${recipe.name}`,
      icon: recipe.emoji,
    });
    setDayMeal(day, { recipeId: recipe.id, scheduleItemId });
    setPickerDay(null);
  }

  function handleRemoveMeal(day: DayKey) {
    const existing = mealPlan[day];
    if (existing) removeScheduleItem(day, existing.scheduleItemId);
    clearDayMeal(day);
  }

  const pickerDayLabel = pickerDay
    ? DAYS.find((d) => d.key === pickerDay)?.label ?? ""
    : "";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Choose one meal per day — it&apos;ll also show up in your{" "}
        <Link
          href="/tools/weekly-schedule"
          className="font-semibold text-brand hover:underline"
        >
          Weekly Schedule
        </Link>
        .
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {DAYS.map((day) => {
          const assignment = mealPlan[day.key];
          const recipe = assignment
            ? recipes.find((r) => r.id === assignment.recipeId)
            : undefined;
          return (
            <div
              key={day.key}
              className="flex flex-col rounded-2xl border-2 border-border bg-surface p-3"
            >
              <h2 className="font-display mb-2 font-bold">{day.label}</h2>
              {recipe ? (
                <>
                  <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-background p-3 text-center">
                    <span aria-hidden="true" className="text-3xl">
                      {recipe.emoji}
                    </span>
                    <span className="text-sm font-semibold">{recipe.name}</span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPickerDay(day.key)}
                      className="flex-1 rounded-lg border-2 border-border bg-background px-2 py-1.5 text-xs font-semibold"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMeal(day.key)}
                      aria-label={`Remove meal from ${day.label}`}
                      className="rounded-lg border-2 border-border bg-background px-2 py-1.5 text-xs font-semibold"
                    >
                      <span aria-hidden="true">✕</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickerDay(day.key)}
                  className="touch-target flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-background text-center hover:border-brand"
                >
                  <span aria-hidden="true" className="text-2xl">
                    ➕
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    Choose meal
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <RecipePickerDialog
        open={pickerDay !== null}
        dayLabel={pickerDayLabel}
        recipes={recipes}
        onClose={() => setPickerDay(null)}
        onSelect={(recipe) => {
          if (pickerDay) handleSelectRecipe(pickerDay, recipe);
        }}
      />
    </div>
  );
}
