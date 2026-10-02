import type { Metadata } from "next";
import GoalTracker from "@/components/goals/GoalTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Goal Tracker - My Support Buddy",
  description:
    "Set goals, break them into steps, and tick them off as you go - with an optional target date and notes for each one.",
};

export default function GoalTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Goal Tracker" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Goal Tracker
      </h1>
      <FavouriteToggleButton slug="goal-tracker" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Set a goal, break it into steps, and tick them off as you go. Add as
        many goals as you like, each with its own steps, target date and
        notes.
      </p>
      <HowToUse
        steps={[
          "Type a goal and tap 'Add goal'.",
          "Add steps to break the goal down into smaller pieces.",
          "Tick off each step as you complete it.",
          "Add an optional target date and notes.",
          "Print your goals, or come back any time - everything saves automatically.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <GoalTracker />
    </div>
  );
}
