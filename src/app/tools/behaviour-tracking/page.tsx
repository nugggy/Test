import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import BehaviourTracking from "@/components/behaviour-tracking/BehaviourTracking";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Behaviour Tracking Tool - My Support Buddy",
  description:
    "Quick ABC (antecedent-behaviour-consequence) data collection with trend charts.",
};

export default function BehaviourTrackingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <ToolHero slug="behaviour-tracking" title="Behaviour Tracking Tool">
        <p>
        Log antecedent-behaviour-consequence (ABC) data quickly, then spot
        severity and frequency patterns in the charts below.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Private to you:</strong> entries are saved on this device only.
        Nothing is sent to us.
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
