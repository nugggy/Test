import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import WhatNext from "@/components/what-next/WhatNext";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "What Should I Do Next? - My Support Buddy",
  description:
    "Pick how you're feeling and get suggested strategies to help - plus a place to save your own strategies that have been recommended just for you.",
};

export default function WhatNextPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="what-next" title="What Should I Do Next?">
        <p>
        Pick the mood that matches how you&apos;re feeling right now, and see
        some things that might help - plus your own strategies, saved here so
        they&apos;re ready whenever you need them.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap the mood that best matches how you're feeling right now.",
          "See a list of things that can help. Tap 'Read these out loud' to hear them.",
          "Add your own strategies, especially ones a support person has recommended for you. Once you have some, they show first.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <WhatNext />
    </div>
  );
}
