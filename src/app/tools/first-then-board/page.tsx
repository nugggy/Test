import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import FirstThenBoard from "@/components/first-then-board/FirstThenBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "First-Then Board & Choice Board - My Support Buddy",
  description:
    "A First-Then board for what's happening now and next, and a Choice Board for offering options - lightweight AAC tools with tap-to-speak pictures, for everyday use.",
};

export default function FirstThenBoardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <ToolHero slug="first-then-board" title={<>First-Then Board &amp; Choice Board</>}>
        <p>
        Two lightweight AAC boards in one tool. First-Then shows what&apos;s
        happening now and what comes next, to make transitions easier to
        predict. Choice Board offers a small set of pictures to pick from -
        tap one to select it and hear it spoken aloud.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Switch between First-Then and Choice board at the top.",
          "First-Then: tap each slot to choose a picture, then tick 'First is done' once it's finished. The board says what comes next.",
          "Tap 'Move on' to slide Then into First and choose the next activity.",
          "Choice board: tap 'Edit choices' to add or remove up to 6 pictures, then 'Finish editing' to offer the board.",
          "Tap a picture to choose it and hear it spoken. 'Clear the choice' lets someone choose again.",
          "Tap 'Add your own picture' in the picker to add anything not already there.",
          "Everything is saved on this device, so the board is ready next time you open it.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <FirstThenBoard />
    </div>
  );
}
