import type { Metadata } from "next";
import Link from "next/link";
import WhatNext from "@/components/what-next/WhatNext";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "What Should I Do Next? — Toolkit",
  description:
    "Pick how you're feeling and get suggested strategies to help — plus a place to save your own strategies that have been recommended just for you.",
};

export default function WhatNextPage() {
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
        What Should I Do Next?
      </h1>
      <FavouriteToggleButton slug="what-next" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Pick the mood that matches how you&apos;re feeling right now, and see
        some things that might help — plus your own strategies, saved here so
        they&apos;re ready whenever you need them.
      </p>
      <HowToUse
        steps={[
          "Tap the mood that best matches how you're feeling right now.",
          "See a list of things that can help.",
          "Add your own strategies too — especially ones a support person has recommended just for you — so they're saved here for next time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <WhatNext />
    </div>
  );
}
