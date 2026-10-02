import type { Metadata } from "next";
import HolidayPlanner from "@/components/holiday-planner/HolidayPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Holiday Planner - My Support Buddy",
  description:
    "Plan a trip step by step: destination and dates, accommodation and transport, a day-by-day itinerary, packing and documents checklists, budget, and emergency contacts.",
};

export default function HolidayPlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Holiday Planner" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Holiday Planner
      </h1>
      <FavouriteToggleButton slug="holiday-planner" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Everything for a trip in one place: dates, bookings, a day-by-day
        plan, what to pack, what documents to bring, a budget, and emergency
        contacts. Print it out or take it with you.
      </p>
      <HowToUse
        steps={[
          "Fill in the destination and dates.",
          "Add accommodation, transport bookings, and a rough day-by-day plan.",
          "Tick off the packing and documents checklists as you go.",
          "Add a budget estimate and emergency contacts.",
          "Print the whole plan to take with you - everything saves automatically as you go.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <HolidayPlanner />
    </div>
  );
}
