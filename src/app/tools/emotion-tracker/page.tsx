import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import EmotionTracker from "@/components/emotion-tracker/EmotionTracker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Emotion Tracker - My Support Buddy",
  description:
    "Daily emotion check-ins to build self-awareness and spot patterns over time.",
};

export default function EmotionTrackerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="emotion-tracker" title="Emotion Tracker">
        <p>
        Check in with how you&apos;re feeling. Logging emotions regularly can
        help build self-awareness and spot patterns over time.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap the emotion that matches how you're feeling right now.",
          "Choose how strongly you feel it, and add a note if you want to.",
          "Tap 'Save check-in' to log it.",
          "Scroll down to Patterns to see which feelings came up most in the last week or month, and a day-by-day view.",
          "History lists every check-in. You can print it or download it as a CSV to share with someone who supports you.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EmotionTracker />
    </div>
  );
}
