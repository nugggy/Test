import type { Metadata } from "next";
import Link from "next/link";
import TrafficLightCheckin from "@/components/traffic-light/TrafficLightCheckin";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Traffic Light Check-In — Toolkit",
  description:
    "A quick tap-in: green, amber or red, with a suggested strategy for each.",
};

export default function TrafficLightCheckinPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Traffic Light Check-In
      </h1>
      <p className="no-print mb-6 max-w-2xl text-muted">
        A quick, visual way to check in on how you&apos;re feeling — tap a
        colour, get a suggestion, and see the pattern over time.
      </p>
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
      <AlliedHealthCallout />
      <TrafficLightCheckin />
    </div>
  );
}
