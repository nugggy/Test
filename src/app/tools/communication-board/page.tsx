import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import CommunicationBoard from "@/components/communication-board/CommunicationBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Visual Communication Board - My Support Buddy",
  description:
    "Tap pictures to speak wants, needs and feelings out loud. Free and works offline.",
};

export default function CommunicationBoardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <ToolHero slug="communication-board" title="Visual Communication Board">
        <p>
        Tap a picture to hear it spoken out loud. Build a short message by
        tapping a few pictures in a row, then press Speak.
        </p>
      </ToolHero>
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
