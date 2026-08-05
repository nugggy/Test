import type { Metadata } from "next";
import Link from "next/link";
import SocialStoryApp from "@/components/social-story/SocialStoryApp";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";

export const metadata: Metadata = {
  title: "Social Story Creator — Toolkit",
  description:
    "Create a simple, illustrated story to prepare for a new place or event.",
};

export default function SocialStoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Social Story Creator
      </h1>
      <p className="no-print mb-3 max-w-2xl text-muted">
        Build a simple, illustrated story to prepare for a new place, event
        or routine. Add a picture and a sentence for each page, then read it
        aloud or print it.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> stories are saved on this device only
        — no account needed yet. A future version will let you save stories
        against a participant&apos;s profile.
      </p>
      <MedicalDisclaimerBanner />
      <SocialStoryApp />
    </div>
  );
}
