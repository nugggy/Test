import type { Metadata } from "next";
import Link from "next/link";
import BudgetTracker from "@/components/budget/BudgetTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Budget Tracker - Toolkit",
  description:
    "Log income and expenses and see where the money goes, category by category.",
};

export default function BudgetTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Budget Tracker
      </h1>
      <FavouriteToggleButton slug="budget-tracker" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Log income and expenses and see where the money goes, category by
        category.
      </p>
      <HowToUse
        steps={[
          "Enter how much money you have to spend this week, then add planned items to see what's left.",
          "Use the form below to log real income or expenses, with a category and date.",
          "Check the Spending by category chart to see where the money is going.",
          "See, or delete, every transaction in the list at the bottom.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <BudgetTracker />
    </div>
  );
}
