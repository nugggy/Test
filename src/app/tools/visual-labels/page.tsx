import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import VisualLabelsMaker from "@/components/visual-labels/VisualLabelsMaker";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Visual Labels Maker - My Support Buddy",
  description:
    "Create simple picture-and-word labels to print, cut out, and stick up around the house - doors, drawers, routines and reminders.",
};

export default function VisualLabelsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <PrintHeader title="Visual Labels" />
      <ToolHero slug="visual-labels" title="Visual Labels Maker">
        <p>
        Create simple picture-and-word labels for around the house - doors,
        drawers, the bathroom, reminders like &quot;turn off the lights&quot;
        - then print and cut them out to stick up wherever they&apos;re
        needed.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Type a word or phrase, or tap a suggestion.",
          "Pick a picture to go with it.",
          "Tap 'Add label' - repeat for as many labels as you need.",
          "Print the page, then cut out each label along its border.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <VisualLabelsMaker />
    </div>
  );
}
