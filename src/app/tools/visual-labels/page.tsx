import type { Metadata } from "next";
import Link from "next/link";
import VisualLabelsMaker from "@/components/visual-labels/VisualLabelsMaker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Visual Labels Maker - Toolkit",
  description:
    "Create simple picture-and-word labels to print, cut out, and stick up around the house - doors, drawers, routines and reminders.",
};

export default function VisualLabelsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="Visual Labels" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Visual Labels Maker
      </h1>
      <FavouriteToggleButton slug="visual-labels" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Create simple picture-and-word labels for around the house - doors,
        drawers, the bathroom, reminders like &quot;turn off the lights&quot;
        - then print and cut them out to stick up wherever they&apos;re
        needed.
      </p>
      <HowToUse
        steps={[
          "Type a word or phrase, or tap a suggestion.",
          "Pick a picture to go with it.",
          "Tap 'Add label' - repeat for as many labels as you need.",
          "Print the page, then cut out each label along its border.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <VisualLabelsMaker />
    </div>
  );
}
