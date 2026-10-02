import type { Metadata } from "next";
import MealPlanner from "@/components/meal-planner/MealPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Meal Planner & Shopping List - Toolkit",
  description:
    "Build recipes, plan meals for the week, and get an automatic shopping list you can check off as you go.",
};

export default function MealPlannerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Meal Planner &amp; Shopping List
      </h1>
      <FavouriteToggleButton slug="meal-planner" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Build recipes with their ingredients, choose a meal for each day of
        the week, and get an automatic shopping list you can print or check
        off as you shop.
      </p>
      <HowToUse
        steps={[
          "In the Recipes tab, tap 'New recipe' and add its ingredients (and instructions, if you want).",
          "In the This week tab, tap ➕ on a day and choose a recipe - it'll also show up in your Weekly Schedule.",
          "Open the Shopping list tab to see everything you need, worked out automatically from your planned meals.",
          "Tick items off as you shop, add any extra items, and print the list if you'd like a paper copy.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MealPlanner />
    </div>
  );
}
