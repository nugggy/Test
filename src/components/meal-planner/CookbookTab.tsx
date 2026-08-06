"use client";

import { useEffect, useState } from "react";
import { useRecipes } from "@/lib/recipe-storage";
import PrintButton from "@/components/PrintButton";

type Layout = "page-per-recipe" | "compact";

export default function CookbookTab() {
  const { recipes } = useRecipes();
  const [title, setTitle] = useState("My Cookbook");
  const [subtitle, setSubtitle] = useState("");
  const [layout, setLayout] = useState<Layout>("page-per-recipe");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    // Default to "every recipe included" the first time recipes load, so
    // there's something to preview straight away - after that, leave the
    // user's own selection alone even if the recipe list changes.
    if (!initialised && recipes.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(new Set(recipes.map((r) => r.id)));
      setInitialised(true);
    }
  }, [recipes, initialised]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const included = recipes.filter((r) => selected.has(r.id));
  const generatedOn = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Customise your cookbook</h2>

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Cookbook title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Subtitle (optional)</span>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              maxLength={140}
              placeholder="e.g. Recipes I love to cook"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>

        <fieldset className="mb-3">
          <legend className="mb-1 text-sm font-semibold">Layout</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "page-per-recipe", label: "One recipe per page" },
                { id: "compact", label: "Compact (flows together)" },
              ] as { id: Layout; label: string }[]
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLayout(option.id)}
                aria-pressed={layout === option.id}
                className={`touch-target rounded-xl border-2 px-4 text-sm font-semibold ${
                  layout === option.id
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold">
            Recipes to include ({included.length} of {recipes.length})
          </legend>
          {recipes.length === 0 ? (
            <p className="text-sm text-muted">
              Add recipes in the Recipes tab first, then come back here to build your cookbook.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {recipes.map((recipe) => (
                <label
                  key={recipe.id}
                  className="flex items-center gap-3 rounded-lg border-2 border-border bg-background px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(recipe.id)}
                    onChange={() => toggle(recipe.id)}
                    className="h-6 w-6 shrink-0 accent-brand"
                  />
                  <span aria-hidden="true">{recipe.emoji}</span>
                  <span className="text-sm">{recipe.name || "Untitled recipe"}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <PrintButton
          label="Print / Download PDF cookbook"
          disabled={included.length === 0}
          className="mt-4"
        />
      </div>

      {included.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-6">
          <div
            className="print-avoid-break mb-6 flex flex-col items-center gap-2 border-b-2 border-border pb-6 text-center"
            style={layout === "page-per-recipe" ? { breakAfter: "page" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dundaloo-logo.svg" alt="" className="mb-2 h-10 w-auto print:h-8" />
            <h2 className="font-display text-3xl font-bold">{title || "My Cookbook"}</h2>
            {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
            <p className="hidden text-xs text-muted print:block">Generated {generatedOn}</p>
          </div>

          <div className="flex flex-col gap-8">
            {included.map((recipe, i) => (
              <article
                key={recipe.id}
                className="print-avoid-break"
                style={
                  layout === "page-per-recipe" && i < included.length - 1
                    ? { breakAfter: "page" }
                    : undefined
                }
              >
                <h3 className="font-display flex items-center gap-2 text-xl font-bold">
                  <span aria-hidden="true">{recipe.emoji}</span> {recipe.name || "Untitled recipe"}
                </h3>
                {recipe.ingredients.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold">Ingredients</h4>
                    <ul className="ml-5 list-disc text-sm">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.instructions && (
                  <div className="mt-3">
                    <h4 className="font-semibold">Instructions</h4>
                    <p className="whitespace-pre-wrap text-sm">{recipe.instructions}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
