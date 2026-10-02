import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import GoalTracker from "@/components/goals/GoalTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Goal Tracker - My Support Buddy",
  description:
    "Set goals, break them into steps, and tick them off as you go - with an optional target date and notes for each one.",
};

export default function GoalTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Goal Tracker" />
      <ToolHero slug="goal-tracker" title="Goal Tracker">
        <p>
        Set a goal, break it into steps, and tick them off as you go. Add as
        many goals as you like, each with its own steps, target date and
        notes.
        </p>
      </ToolHero>
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
