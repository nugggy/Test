import type { Metadata } from "next";
import SocialStoryApp from "@/components/social-story/SocialStoryApp";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Social Story Creator - Toolkit",
  description:
    "Create a simple, illustrated story to prepare for a new place or event.",
};

export default function SocialStoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Social Story Creator
      </h1>
      <FavouriteToggleButton slug="social-story" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        Build a simple, illustrated story to prepare for a new place, event
        or routine. Add a picture and a sentence for each page, then read it
        aloud or print it.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> stories are saved on this device only
        - no account needed yet. A future version will let you save stories
        against a participant&apos;s profile.
      </p>
      <HowToUse
        steps={[
          "Tap 'New story' and give it a title.",
          "Tap 'Add page' - choose a picture and write (or say, using the microphone) what happens on that page.",
          "Add as many pages as you need, and use the arrows to reorder them.",
          "Tap 'Read story' to go through it page by page, with read-aloud.",
          "Print the story to use offline, or share it with someone.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SocialStoryApp />
    </div>
  );
}
