import type { Metadata } from "next";
import WeeklySchedule from "@/components/weekly-schedule/WeeklySchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Weekly Schedule - Toolkit",
  description:
    "Plan the whole week at a glance with picture activities for each day. Free and printable.",
};

export default function WeeklySchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Weekly Schedule
      </h1>
      <FavouriteToggleButton slug="weekly-schedule" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Plan the whole week at a glance. Add pictures to each day, tick them
        off as they&apos;re done, or print the week out.
      </p>
      <HowToUse
        steps={[
          "Tap the ➕ on any day to add an activity.",
          "Choose a picture from the library, or add your own.",
          "Tap an activity to tick it off once it's done.",
          "Print the week, or use 'Reset all ticks' / 'Clear week' to start again.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <WeeklySchedule />
    </div>
  );
}
