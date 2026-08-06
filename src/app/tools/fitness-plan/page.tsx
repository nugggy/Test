import type { Metadata } from "next";
import Link from "next/link";
import FitnessPlan from "@/components/fitness-plan/FitnessPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Exercise & Fitness Plan — Toolkit",
  description:
    "Set fitness goals with steps to break them down, log each exercise session, and see your progress on a chart over time.",
};

export default function FitnessPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="Exercise & Fitness Plan" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Exercise &amp; Fitness Plan
      </h1>
      <FavouriteToggleButton slug="fitness-plan" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Set fitness goals and break them into steps, then log each session
        to see your progress build up on a chart over time.
      </p>
      <HowToUse
        steps={[
          "Add a fitness goal and break it into steps.",
          "Tick off steps as you complete them.",
          "Log each exercise session — activity, duration, and how it went.",
          "Watch your progress build up on the chart.",
          "Talk to your doctor or an exercise physiologist before starting a new exercise program, especially if you have an existing health condition.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <FitnessPlan />
    </div>
  );
}
