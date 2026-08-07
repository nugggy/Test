import type { Metadata } from "next";
import Link from "next/link";
import SensoryNeeds from "@/components/sensory-needs/SensoryNeeds";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Sensory Needs - Toolkit",
  description:
    "Understand sensory seeking and avoiding across sound, light, touch, taste/smell, movement and body awareness, and build a personal sensory profile of what helps and what overwhelms.",
};

export default function SensoryNeedsPage() {
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
      <PrintHeader title="Sensory Needs" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Sensory Needs
      </h1>
      <FavouriteToggleButton slug="sensory-needs" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Understand sensory seeking and avoiding across sound, light,
        touch, taste/smell, movement and body awareness - and build a
        personal profile of what helps and what overwhelms.
      </p>
      <HowToUse
        steps={[
          "Read through each sense to see examples of seeking vs avoiding patterns.",
          "Tap a suggestion, or add your own, under 'What helps' and 'What overwhelms' for each sense.",
          "Everything saves automatically as you go.",
          "Print your sensory profile to keep handy or share with someone supporting you.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <SensoryNeeds />
    </div>
  );
}
