import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import TrafficLightCheckin from "@/components/traffic-light/TrafficLightCheckin";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Traffic Light Check-In - My Support Buddy",
  description:
    "A quick tap-in: green, amber or red, with a suggested strategy for each.",
};

export default function TrafficLightCheckinPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="traffic-light-checkin" title="Traffic Light Check-In">
        <p>
        A quick, visual way to check in on how you&apos;re feeling - tap a
        colour, get a suggestion, and see the pattern over time.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap green, amber or red for how you're doing right now.",
          "Read the suggested strategy, and anything you've written for what that colour looks like for you.",
          "Add a note if you want to, then tap 'Save check-in'.",
          "Fill in 'What each zone looks like for you' further down, so it's ready next time.",
          "Scroll down to History to see your past check-ins.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <TrafficLightCheckin />
    </div>
  );
}
