import type { Metadata } from "next";
import CommunicationBoard from "@/components/communication-board/CommunicationBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Visual Communication Board - My Support Buddy",
  description:
    "Tap pictures to speak wants, needs and feelings out loud. Free and works offline.",
};

export default function CommunicationBoardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Visual Communication Board
      </h1>
      <FavouriteToggleButton slug="communication-board" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Tap a picture to hear it spoken out loud. Build a short message by
        tapping a few pictures in a row, then press Speak.
      </p>
      <HowToUse
        steps={[
          "Tap a category tab (like Food or Drinks) to see the pictures in that group.",
          "Tap a picture to hear it spoken out loud and add it to your message.",
          "Tap more pictures to build up a longer message.",
          "Press Speak to hear your whole message read aloud, or Clear to start again.",
          "Tap the star on a picture to save it to Favourites.",
          "Tap 'Add picture' to create your own - choose a word, a picture, and a category.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <CommunicationBoard />
    </div>
  );
}
