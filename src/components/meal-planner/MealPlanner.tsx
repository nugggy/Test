"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import RecipesTab from "@/components/meal-planner/RecipesTab";
import WeekTab from "@/components/meal-planner/WeekTab";
import ShoppingListTab from "@/components/meal-planner/ShoppingListTab";
import CookbookTab from "@/components/meal-planner/CookbookTab";

type Tab = "recipes" | "week" | "shopping" | "cookbook";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "recipes", label: "Recipes", icon: "📖" },
  { id: "week", label: "This week", icon: "📅" },
  { id: "shopping", label: "Shopping list", icon: "🛒" },
  { id: "cookbook", label: "My Cookbook", icon: "📚" },
];

export default function MealPlanner() {
  const [tab, setTab] = useState<Tab>("recipes");

  return (
    <div className="flex flex-col gap-4">
      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Meal planner sections" />

      <div role="tabpanel">
        {tab === "recipes" && <RecipesTab />}
        {tab === "week" && <WeekTab />}
        {tab === "shopping" && <ShoppingListTab />}
        {tab === "cookbook" && <CookbookTab />}
      </div>
    </div>
  );
}
