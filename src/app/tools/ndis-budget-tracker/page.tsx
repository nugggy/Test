import type { Metadata } from "next";
import NdisBudgetTracker from "@/components/ndis-budget/NdisBudgetTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "NDIS Plan Budget Tracker - Toolkit",
  description:
    "See spend vs. plan allocation for each NDIS support category - Core Supports, Capacity Building and Capital Supports.",
};

export default function NdisBudgetTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        NDIS Plan Budget Tracker
      </h1>
      <FavouriteToggleButton slug="ndis-budget-tracker" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        See spend vs. plan allocation for each NDIS support category - Core
        Supports, Capacity Building and Capital Supports.
      </p>
      <HowToUse
        steps={[
          "Enter your plan's start/end dates and the amount allocated to each category, straight from your NDIS plan document.",
          "Log spending as it happens, with a description, amount, category and date.",
          "Check the dashboard to see spend vs. allocation per category, and whether you're on track for the plan period.",
          "Download a CSV or print the spending log to take to a planning meeting.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <NdisBudgetTracker />
    </div>
  );
}
