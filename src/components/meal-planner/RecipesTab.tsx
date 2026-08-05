"use client";

import { useState } from "react";
import { EMOJI_CHOICES } from "@/lib/emoji-choices";
import { useRecipes } from "@/lib/recipe-storage";
import RecipeList from "@/components/meal-planner/RecipeList";
import RecipeEditor from "@/components/meal-planner/RecipeEditor";

type View = { mode: "list" } | { mode: "edit"; recipeId: string };

export default function RecipesTab() {
  const { recipes, createRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [view, setView] = useState<View>({ mode: "list" });

  const activeRecipe =
    view.mode === "edit" ? recipes.find((r) => r.id === view.recipeId) : undefined;

  function handleNewRecipe() {
    const id = createRecipe({ name: "New recipe", emoji: EMOJI_CHOICES[0] });
    setView({ mode: "edit", recipeId: id });
  }

  if (view.mode === "edit" && activeRecipe) {
    return (
      <RecipeEditor
        recipe={activeRecipe}
        onSave={(updates) => updateRecipe(activeRecipe.id, updates)}
        onDone={() => setView({ mode: "list" })}
      />
    );
  }

  return (
    <RecipeList
      recipes={recipes}
      onNew={handleNewRecipe}
      onEdit={(id) => setView({ mode: "edit", recipeId: id })}
      onDelete={deleteRecipe}
    />
  );
}
