import type { Metadata } from "next";
import Link from "next/link";
import RegulationPlan from "@/components/regulation-plan/RegulationPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Emotional Regulation Plan — Toolkit",
  description:
    "Build a personal calm-down, grounding and crisis plan, step by step: warning signs, calming strategies, grounding techniques, people to go to, and when to get urgent help.",
};

export default function EmotionalRegulationPlanPage() {
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
      <PrintHeader title="Emotional Regulation Plan" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Emotional Regulation Plan
      </h1>
      <FavouriteToggleButton slug="emotional-regulation-plan" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        A step-by-step personal calm-down, grounding and crisis plan — warning
        signs, what helps, grounding techniques, what to avoid, and who to go
        to — built up over time and printable to share with support people.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> this plan is saved on this device only
        — no account needed yet. A future version will let you save it
        against a participant&apos;s profile.
      </p>
      <HowToUse
        steps={[
          "Work through the plan one step at a time using the step buttons or Back/Next.",
          "Tap a suggestion chip on each step, or type/say your own using the microphone.",
          "Warning signs → what helps → grounding techniques → what makes it worse → support people → urgent help.",
          "Everything saves automatically as you go — there's no need to press save.",
          "On the last step, print your plan or download it as a PDF to keep a copy or share it with support people.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <RegulationPlan />
    </div>
  );
}
