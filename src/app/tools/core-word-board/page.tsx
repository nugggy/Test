import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import CoreWordBoard from "@/components/core-word-board/CoreWordBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Core Word Board - My Support Buddy",
  description:
    "A fixed, colour-coded core-vocabulary AAC board of high-frequency words, arranged by part of speech. Tap to speak, or build a short sentence.",
};

export default function CoreWordBoardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="core-word-board" title="Core Word Board">
        <p>
        A fixed, colour-coded core-vocabulary AAC board of high-frequency
        words, arranged by part of speech. Tap to speak, or build a short
        sentence.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap any word to hear it spoken aloud and add it to the message strip at the top.",
          "Keep tapping words to build a short sentence, then tap Speak to hear the whole thing.",
          "Tapped the wrong word? Tap Undo to take off just the last word. Clear starts again.",
          "Words stay in the same colour-coded position every time - pronouns, verbs, descriptors, social words, questions and yes/no - so the layout becomes familiar with practice.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <CoreWordBoard />
    </div>
  );
}
