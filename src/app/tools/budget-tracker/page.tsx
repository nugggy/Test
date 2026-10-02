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
        Plan your money for each week, fortnight or month, check if you can
        afford something, and see where your money goes.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Choose how often you get your money (every week, fortnight or month) and type how much you have to spend.",
          "Add the things it needs to pay for, like rent or bus fares, and see what is left. Tick each one when it is paid.",
          "Use 'Can I afford this?' to check a price against the money left in your plan.",
          "Add money in and money out as it happens, then choose dates (like Last 14 days) to see totals and spending by category.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <BudgetTracker />
    </div>
  );
}
