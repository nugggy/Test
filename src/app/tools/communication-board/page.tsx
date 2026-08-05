import type { Metadata } from "next";
import Link from "next/link";
import CommunicationBoard from "@/components/communication-board/CommunicationBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";

export const metadata: Metadata = {
  title: "Visual Communication Board — Toolkit",
  description:
    "Tap pictures to speak wants, needs and feelings out loud. Free, no sign-up, works offline.",
};

export default function CommunicationBoardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Visual Communication Board
      </h1>
      <p className="no-print mb-6 max-w-2xl text-muted">
        Tap a picture to hear it spoken out loud. Build a short message by
        tapping a few pictures in a row, then press Speak.
      </p>
      <MedicalDisclaimerBanner />
      <CommunicationBoard />
    </div>
  );
}
