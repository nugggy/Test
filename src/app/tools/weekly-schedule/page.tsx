import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import WeeklySchedule from "@/components/weekly-schedule/WeeklySchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Weekly Schedule - My Support Buddy",
  description:
    "Plan the whole week at a glance with picture activities for each day. Free and printable.",
};

export default function WeeklySchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <ToolHero slug="weekly-schedule" title="Weekly Schedule">
        <p>
        Plan the whole week at a glance. Add pictures to each day, tick them
        off as they&apos;re done, or print the week out.
        </p>
      </ToolHero>
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
