import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import HolidayPlanner from "@/components/holiday-planner/HolidayPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Holiday Planner - My Support Buddy",
  description:
    "Plan a trip step by step: destination and dates, accommodation and transport, a day-by-day itinerary, packing and documents checklists, budget, and emergency contacts.",
};

export default function HolidayPlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Holiday Planner" />
      <ToolHero slug="holiday-planner" title="Holiday Planner">
        <p>
        Everything for a trip in one place: dates, bookings, a day-by-day
        plan, what to pack, what documents to bring, a budget, and emergency
        contacts. Print it out or take it with you.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Fill in the destination and dates. You will see how many sleeps until the trip.",
          "Add accommodation, transport bookings, and a rough day-by-day plan.",
          "Tick off the packing and documents checklists as you go.",
          "Add budget lines with a $ amount (e.g. Food - $200) to see the total, and add emergency contacts.",
          "Print the whole plan to take with you - everything saves automatically as you go.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <HolidayPlanner />
    </div>
  );
}
