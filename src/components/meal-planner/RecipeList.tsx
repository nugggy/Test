"use client";

import type { Recipe } from "@/lib/recipe-storage";

interface RecipeListProps {
  recipes: Recipe[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecipeList({
  recipes,
  onNew,
  onEdit,
  onDelete,
}: RecipeListProps) {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onNew}
        className="touch-target flex items-center justify-center gap-2 self-stretch rounded-2xl border-2 border-dashed border-brand bg-brand/5 font-semibold text-brand sm:self-start sm:px-8"
      >
        <span aria-hidden="true">➕</span> New recipe
      </button>

      {recipes.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No recipes yet — add one to start planning meals for the week.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex flex-col rounded-2xl border-2 border-border bg-surface p-4"
            >
              <span aria-hidden="true" className="mb-2 text-3xl">
                {recipe.emoji}
              </span>
              <h3 className="font-display text-lg font-bold">{recipe.name}</h3>
              <p className="mb-4 text-sm text-muted">
                {recipe.ingredients.length === 0
                  ? "No ingredients yet"
                  : `${recipe.ingredients.length} ${
                      recipe.ingredients.length === 1 ? "ingredient" : "ingredients"
                    }`}
              </p>
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(recipe.id)}
                  className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(`Delete "${recipe.name}"? This can't be undone.`)
                    ) {
                      onDelete(recipe.id);
                    }
                  }}
                  aria-label={`Delete ${recipe.name}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-border bg-background"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
