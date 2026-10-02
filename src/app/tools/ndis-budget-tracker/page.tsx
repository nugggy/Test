import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import NdisBudgetTracker from "@/components/ndis-budget/NdisBudgetTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "NDIS Plan Budget Tracker - My Support Buddy",
  description:
    "See spend vs. plan allocation for each NDIS support category - Core Supports, Capacity Building and Capital Supports.",
};

export default function NdisBudgetTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="ndis-budget-tracker" title="NDIS Plan Budget Tracker">
        <p>
        See how much is left in each NDIS support category, for Core
        Supports, Capacity Building and Capital Supports, and whether
        spending is on track for your plan dates.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Copy your plan's start and end dates, and the amount in each support category, from your NDIS plan. Only fill in the ones your plan has.",
          "Add spending as it happens: what it was for, who was paid, the amount, category and date.",
          "Check the dashboard to see how much is left in each category and budget, and whether you are on track for the plan dates.",
          "Download a CSV or print the spending log to take to a plan review or to your support coordinator.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <NdisBudgetTracker />
    </div>
  );
}
