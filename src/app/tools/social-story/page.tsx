import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SocialStoryApp from "@/components/social-story/SocialStoryApp";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Social Story Creator - My Support Buddy",
  description:
    "Create a simple, illustrated story to prepare for a new place or event.",
};

export default function SocialStoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <ToolHero slug="social-story" title="Social Story Creator">
        <p>
        Build a simple, illustrated story to prepare for a new place, event
        or routine. Add a picture and a sentence for each page, then read it
        aloud or print it.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Private to you:</strong> stories are saved on this device only.
        Nothing is sent to us.
      </p>
      <HowToUse
        steps={[
          "Tap 'New blank story', or start from an example like 'Going to the doctor' and change it to fit.",
          "Tap 'Add page'. Choose a picture and write (or say, using the microphone) what happens on that page.",
          "Write as 'I', with short sentences. Open 'Tips for writing a good story' for help.",
          "Use 'Earlier' and 'Later' to reorder pages.",
          "Tap 'Read story' to go through it page by page. Turn on 'Read each page aloud' to hear every page as you go.",
          "Tap 'Print whole story' to print every page, ready to make into a little book.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SocialStoryApp />
    </div>
  );
}
