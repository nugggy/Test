import type { Metadata } from "next";
import BehaviourTracking from "@/components/behaviour-tracking/BehaviourTracking";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Behaviour Tracking Tool - My Support Buddy",
  description:
    "Quick ABC (antecedent-behaviour-consequence) data collection with trend charts.",
};

export default function BehaviourTrackingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Behaviour Tracking Tool
      </h1>
      <FavouriteToggleButton slug="behaviour-tracking" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        Log antecedent-behaviour-consequence (ABC) data quickly, then spot
        severity and frequency patterns in the charts below.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> entries are saved on this device only
        - no account needed yet. A future version will let you track data
        against a participant&apos;s profile.
      </p>
      <HowToUse
        steps={[
          "Fill in what happened before, the behaviour itself, and what happened after - tap a suggestion chip or type/say your own.",
          "Choose a severity from 1 (very mild) to 5 (very severe).",
          "Check the date and time, then tap 'Save entry'.",
          "Look at the Severity over time and Most common behaviours charts to spot patterns.",
          "Scroll down to the Log to review or delete past entries.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <BehaviourTracking />
    </div>
  );
}
