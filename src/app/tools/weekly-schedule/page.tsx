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
          "Tap 'Add' on any day to add an activity, from the pictures or your own.",
          "Today is highlighted. Tap 'Go to today' to jump straight to it.",
          "Tap an activity to tick it off once it's done.",
          "Tap 'Change order or copy days' to move activities, remove them, or copy one day to other days (for example Monday to every weekday).",
          "Ticks clear by themselves each Monday, so the same week is ready to use again.",
          "Print the week to put on the fridge or wall.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <WeeklySchedule />
    </div>
  );
}
