import type { Metadata } from "next";
import SleepTracker from "@/components/sleep-tracker/SleepTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Sleep Tracker - My Support Buddy",
  description:
    "Log bedtime, wake time and sleep quality each night, see hours slept over time on a chart, and export your log as a CSV.",
};

export default function SleepTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Sleep Tracker" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Sleep Tracker
      </h1>
      <FavouriteToggleButton slug="sleep-tracker" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Log your bedtime, wake time and how you slept each night - see your
        hours slept over time on a chart, and spot patterns.
      </p>
      <HowToUse
        steps={[
          "Log your bedtime and wake time each morning.",
          "Rate how your sleep was.",
          "Watch the chart build up a picture of your sleep over time.",
          "Download your log as a CSV, or print it, any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SleepTracker />
    </div>
  );
}
