import type { Metadata } from "next";
import Link from "next/link";
import EmotionTracker from "@/components/emotion-tracker/EmotionTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Emotion Tracker — Toolkit",
  description:
    "Daily emotion check-ins to build self-awareness and spot patterns over time.",
};

export default function EmotionTrackerPage() {
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
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Emotion Tracker
      </h1>
      <FavouriteToggleButton slug="emotion-tracker" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Check in with how you&apos;re feeling. Logging emotions regularly can
        help build self-awareness and spot patterns over time.
      </p>
      <HowToUse
        steps={[
          "Tap the emotion that matches how you're feeling right now.",
          "Choose how strongly you feel it, and add a note if you want to.",
          "Tap 'Save check-in' to log it.",
          "Scroll down to History to see how you've been feeling over time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <EmotionTracker />
    </div>
  );
}
