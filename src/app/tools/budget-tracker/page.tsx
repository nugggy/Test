import type { Metadata } from "next";
import Link from "next/link";
import BudgetTracker from "@/components/budget/BudgetTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Budget Tracker — Toolkit",
  description:
    "Log income and expenses and see where the money goes, category by category.",
};

export default function BudgetTrackerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Budget Tracker
      </h1>
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
      <BudgetTracker />
    </div>
  );
}
