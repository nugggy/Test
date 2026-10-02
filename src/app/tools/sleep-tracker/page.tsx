import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SleepTracker from "@/components/sleep-tracker/SleepTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Sleep Tracker - My Support Buddy",
  description:
    "Log bedtime, wake time and sleep quality each night, see hours slept over time on a chart, and export your log as a CSV.",
};

export default function SleepTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Sleep Tracker" />
      <ToolHero slug="sleep-tracker" title="Sleep Tracker">
        <p>
        Log your bedtime, wake time and how you slept each night - see your
        hours slept over time on a chart, and spot patterns.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Each morning, put in when you went to sleep and when you woke up.",
          "Tap how your sleep was. If you like, add how many times you woke up in the night.",
          "If you already logged that date, you'll be asked whether to replace it, so you don't end up with doubles.",
          "The chart and averages build up a picture of your sleep over time.",
          "Download your log as a CSV, or print it, to share with someone who supports you.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SleepTracker />
    </div>
  );
}
