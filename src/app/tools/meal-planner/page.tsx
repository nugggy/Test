import type { Metadata } from "next";
import Link from "next/link";
import MealPlanner from "@/components/meal-planner/MealPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";

export const metadata: Metadata = {
  title: "Meal Planner & Shopping List — Toolkit",
  description:
    "Build recipes, plan meals for the week, and get an automatic shopping list you can check off as you go.",
};

export default function MealPlannerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Meal Planner &amp; Shopping List
      </h1>
      <p className="no-print mb-6 max-w-2xl text-muted">
        Build recipes with their ingredients, choose a meal for each day of
        the week, and get an automatic shopping list you can print or check
        off as you shop.
      </p>
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <MealPlanner />
    </div>
  );
}
