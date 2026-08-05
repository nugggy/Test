import type { Metadata } from "next";
import Link from "next/link";
import RegulationPlan from "@/components/regulation-plan/RegulationPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";

export const metadata: Metadata = {
  title: "Emotional Regulation Plan — Toolkit",
  description:
    "Build a personal plan: warning signs, calming strategies, people to go to, and when to get urgent help.",
};

export default function EmotionalRegulationPlanPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Emotional Regulation Plan
      </h1>
      <p className="no-print mb-3 max-w-2xl text-muted">
        A personal plan for noticing the warning signs early, what helps,
        what to avoid, and who to go to — built up over time and printable
        to share with support people.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> this plan is saved on this device only
        — no account needed yet. A future version will let you save it
        against a participant&apos;s profile.
      </p>
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <RegulationPlan />
    </div>
  );
}
