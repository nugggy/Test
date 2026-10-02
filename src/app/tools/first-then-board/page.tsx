import type { Metadata } from "next";
import FirstThenBoard from "@/components/first-then-board/FirstThenBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "First-Then Board & Choice Board - Toolkit",
  description:
    "A First-Then board for what's happening now and next, and a Choice Board for offering options - lightweight AAC tools with tap-to-speak pictures, for everyday use.",
};

export default function FirstThenBoardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        First-Then Board &amp; Choice Board
      </h1>
      <FavouriteToggleButton slug="first-then-board" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Two lightweight AAC boards in one tool. First-Then shows what&apos;s
        happening now and what comes next, to make transitions easier to
        predict. Choice Board offers a small set of pictures to pick from -
        tap one to select it and hear it spoken aloud.
      </p>
      <HowToUse
        steps={[
          "Switch between First-Then and Choice board at the top.",
          "First-Then: tap each slot to choose a picture, then tick 'First is done' once it's finished.",
          "Choice board: add up to 6 pictures, then tap one to select and speak it.",
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
