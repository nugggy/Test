import type { Metadata } from "next";
import EmotionTracker from "@/components/emotion-tracker/EmotionTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Emotion Tracker - Toolkit",
  description:
    "Daily emotion check-ins to build self-awareness and spot patterns over time.",
};

export default function EmotionTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
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
      <AddToHomeScreen />
      <EmotionTracker />
    </div>
  );
}
