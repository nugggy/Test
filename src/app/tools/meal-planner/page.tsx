import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import MealPlanner from "@/components/meal-planner/MealPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Meal Planner & Shopping List - My Support Buddy",
  description:
    "Build recipes, plan meals for the week, and get an automatic shopping list you can check off as you go.",
};

export default function MealPlannerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <ToolHero slug="meal-planner" title={<>Meal Planner &amp; Shopping List</>}>
        <p>
        Build recipes with their ingredients, choose a meal for each day of
        the week, and get an automatic shopping list you can print or check
        off as you shop.
        </p>
      </ToolHero>
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
