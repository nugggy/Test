import type { Metadata } from "next";
import Link from "next/link";
import VisualSchedule from "@/components/visual-schedule/VisualSchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";

export const metadata: Metadata = {
  title: "Visual Schedule Builder — Toolkit",
  description:
    "Build a picture timeline of the day so routines feel predictable. Free, no sign-up, printable.",
};

export default function VisualSchedulePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Visual Schedule Builder
      </h1>
      <p className="no-print mb-6 max-w-2xl text-muted">
        Tap pictures to build today&apos;s schedule in order. Tick off each
        activity as it&apos;s done, reorder with the arrows, or print it out
        to use offline.
      </p>
      <MedicalDisclaimerBanner />
      <VisualSchedule />
    </div>
  );
}
