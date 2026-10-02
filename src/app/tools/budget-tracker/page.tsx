import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import BudgetTracker from "@/components/budget/BudgetTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Budget Tracker - My Support Buddy",
  description:
    "Log income and expenses and see where the money goes, category by category.",
};

export default function BudgetTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="budget-tracker" title="Budget Tracker">
        <p>
        Log income and expenses and see where the money goes, category by
        category.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Enter how much money you have to spend this week, then add planned items to see what's left.",
          "Use the form below to log real income or expenses, with a category and date.",
          "Check the Spending by category chart to see where the money is going.",
          "See, or delete, every transaction in the list at the bottom.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <BudgetTracker />
    </div>
  );
}
