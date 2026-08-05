"use client";

import { useEffect, useId } from "react";
import type { Recipe } from "@/lib/recipe-storage";

interface RecipePickerDialogProps {
  open: boolean;
  dayLabel: string;
  recipes: Recipe[];
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipePickerDialog({
  open,
  dayLabel,
  recipes,
  onClose,
  onSelect,
}: RecipePickerDialogProps) {
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-border bg-surface p-6 shadow-xl"
      >
        <h2 id={headingId} className="font-display text-xl font-bold mb-4">
          Choose a meal for {dayLabel}
        </h2>

        {recipes.length === 0 ? (
          <p className="mb-4 rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            You haven&apos;t added any recipes yet. Go to the Recipes tab to
            create one first.
          </p>
        ) : (
          <ul className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <button
                  type="button"
                  onClick={() => onSelect(recipe)}
                  className="touch-target flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-background p-3 text-center hover:border-brand"
                >
                  <span aria-hidden="true" className="text-2xl">
                    {recipe.emoji}
                  </span>
                  <span className="text-sm font-semibold leading-tight">
                    {recipe.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onClose}
          className="touch-target w-full rounded-xl border-2 border-border bg-background font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
