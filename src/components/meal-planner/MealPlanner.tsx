"use client";

import { useState } from "react";
import RecipesTab from "@/components/meal-planner/RecipesTab";
import WeekTab from "@/components/meal-planner/WeekTab";
import ShoppingListTab from "@/components/meal-planner/ShoppingListTab";

type Tab = "recipes" | "week" | "shopping";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "recipes", label: "Recipes", icon: "📖" },
  { id: "week", label: "This week", icon: "📅" },
  { id: "shopping", label: "Shopping list", icon: "🛒" },
];

export default function MealPlanner() {
  const [tab, setTab] = useState<Tab>("recipes");

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Meal planner sections"
        className="no-print flex gap-2 overflow-x-auto pb-1"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="touch-target shrink-0 rounded-xl border-2 px-4 font-semibold"
            style={{
              borderColor: tab === t.id ? "var(--brand)" : "var(--border)",
              background: tab === t.id ? "var(--brand)" : "var(--surface)",
              color: tab === t.id ? "var(--brand-ink)" : "var(--foreground)",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "recipes" && <RecipesTab />}
        {tab === "week" && <WeekTab />}
        {tab === "shopping" && <ShoppingListTab />}
      </div>
    </div>
  );
}
