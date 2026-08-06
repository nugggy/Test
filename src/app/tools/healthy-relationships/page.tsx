import type { Metadata } from "next";
import Link from "next/link";
import HealthyRelationships from "@/components/healthy-relationships/HealthyRelationships";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Healthy Relationships - Toolkit",
  description:
    "Plain-language education on healthy relationships, consent, warning signs, communication and staying safe - plus a private, personal space to write down what matters to you.",
};

export default function HealthyRelationshipsPage() {
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
      <PrintHeader title="Healthy Relationships" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Healthy Relationships
      </h1>
      <FavouriteToggleButton slug="healthy-relationships" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Everyone has the right to relationships that are safe, respectful,
        and their own choice. This tool covers what makes a relationship
        healthy, consent, warning signs, communication, and where to get
        help - in plain language, written for adults.
      </p>
      <HowToUse
        steps={[
          "Read through each section - tap to expand it.",
          "There's no wrong way to use this: read it all, or just what's useful right now.",
          "Use the personal sections at the bottom to write down what matters to you, privately on this device.",
          "If anything here feels close to your own situation, the 'Where to get help' section has people you can talk to.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <HealthyRelationships />
    </div>
  );
}
