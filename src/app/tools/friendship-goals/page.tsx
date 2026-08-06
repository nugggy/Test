import type { Metadata } from "next";
import Link from "next/link";
import FriendshipGoalPlanner from "@/components/goals/FriendshipGoalPlanner";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Friendship Goal Planner - Toolkit",
  description:
    "Set goals for meeting people, maintaining friendships, and getting involved in your community - with steps to break each one down.",
};

export default function FriendshipGoalsPage() {
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
      <PrintHeader title="Friendship Goal Planner" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Friendship Goal Planner
      </h1>
      <FavouriteToggleButton slug="friendship-goals" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Set goals around meeting people, maintaining friendships, and
        community inclusion - break each one into steps and tick them off as
        you go.
      </p>
      <HowToUse
        steps={[
          "Tap a suggestion, or type your own goal, in whichever section fits.",
          "Add steps to break each goal down into smaller pieces.",
          "Tick off each step as you complete it.",
          "Print your goals, or come back any time - everything saves automatically.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <FriendshipGoalPlanner />
    </div>
  );
}
