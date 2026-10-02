import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import VisualSchedule from "@/components/visual-schedule/VisualSchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Visual Schedule Builder - My Support Buddy",
  description:
    "Build a picture timeline of the day so routines feel predictable - drag to reorder, set a countdown timer per step, tick off as you go. Free and printable.",
};

export default function VisualSchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <ToolHero slug="visual-schedule" title="Visual Schedule Builder">
        <p>
        Tap pictures to build today&apos;s schedule in order. Tick off each
        activity as it&apos;s done, drag to reorder, set a countdown for any
        step, or print it out to use offline.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap a picture in the activity list to add it to today's schedule.",
          "Can't find what you need? Tap 'Add your own' to create it, and say or type the name.",
          "Tap an activity in your schedule to tick it off once it's done.",
          "Drag the ⠿ handle to reorder with a mouse, or use the ▲▼ arrows on any device.",
          "Pick a number of minutes under a step, then tap 'Start timer' for a countdown with a sound when time's up.",
          "Print today's schedule, or use 'Reset ticks' / 'Clear all' to start fresh.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <VisualSchedule />
    </div>
  );
}
