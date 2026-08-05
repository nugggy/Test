"use client";

import { useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import type { Recipe } from "@/lib/recipe-storage";
import EditableListSection from "@/components/EditableListSection";

interface RecipeEditorProps {
  recipe: Recipe;
  onSave: (updates: { name?: string; emoji?: string; ingredients?: string[]; instructions?: string }) => void;
  onDone: () => void;
}

const INGREDIENT_SUGGESTIONS = [
  "2 cups rice",
  "500g mince",
  "1 onion, diced",
  "2 cloves garlic",
  "1 tin tomatoes",
  "1 cup milk",
  "2 eggs",
  "Salt and pepper",
];

export default function RecipeEditor({ recipe, onSave, onDone }: RecipeEditorProps) {
  const [name, setName] = useState(recipe.name);
  const [emoji, setEmoji] = useState(recipe.emoji);
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleNameBlur() {
    onSave({ name: name.trim() || "Untitled recipe" });
  }

  function handleEmojiChange(choice: string) {
    setEmoji(choice);
    onSave({ emoji: choice });
    setPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex items-center justify-between">
        <button
          type="button"
          onClick={onDone}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
        >
          ← Back to recipes
        </button>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
              aria-label="Change picture"
              className="touch-target grid place-items-center rounded-xl border-2 border-border bg-background text-4xl"
            >
              {emoji}
            </button>
          </div>
          <div className="flex-1">
            <label htmlFor="recipe-name" className="block font-semibold mb-1">
              Recipe name
            </label>
            <input
              id="recipe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              maxLength={80}
              placeholder="e.g. Spaghetti bolognese"
              className="font-display w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg font-bold touch-target"
            />
          </div>
        </div>

        {pickerOpen && (
          <div className="mt-3 grid grid-cols-8 gap-1.5 border-t-2 border-border pt-3">
            {EMOJI_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => handleEmojiChange(choice)}
                aria-label={`Use picture ${choice}`}
                className={`grid aspect-square place-items-center rounded-lg border-2 text-xl ${
                  emoji === choice
                    ? "border-brand bg-brand/10"
                    : "border-border bg-background"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>

      <EditableListSection
        title="Ingredients"
        description="Add each ingredient with however much you need"
        placeholder="e.g. 500g mince"
        items={recipe.ingredients}
        suggestions={INGREDIENT_SUGGESTIONS}
        onChange={(items) => onSave({ ingredients: items })}
      />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">
          Instructions (optional)
        </h2>
        <p className="mb-3 text-sm text-muted">Steps to cook this meal</p>
        <textarea
          value={recipe.instructions}
          onChange={(e) => onSave({ instructions: e.target.value })}
          rows={5}
          maxLength={2000}
          placeholder="e.g. 1. Brown the mince. 2. Add the onion and garlic..."
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
        />
      </div>
    </div>
  );
}
