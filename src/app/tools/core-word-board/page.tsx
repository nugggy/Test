import type { Metadata } from "next";
import CoreWordBoard from "@/components/core-word-board/CoreWordBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Core Word Board - My Support Buddy",
  description:
    "A fixed, colour-coded core-vocabulary AAC board of high-frequency words, arranged by part of speech. Tap to speak, or build a short sentence.",
};

export default function CoreWordBoardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">Core Word Board</h1>
      <FavouriteToggleButton slug="core-word-board" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A fixed, colour-coded core-vocabulary AAC board of high-frequency
        words, arranged by part of speech. Tap to speak, or build a short
        sentence.
      </p>
      <HowToUse
        steps={[
          "Tap any word to hear it spoken aloud and add it to the message strip at the top.",
          "Keep tapping words to build a short sentence, then tap Speak to hear the whole thing.",
          "Words stay in the same colour-coded position every time - pronouns, verbs, descriptors, social words, questions and yes/no - so the layout becomes familiar with practice.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <CoreWordBoard />
    </div>
  );
}
