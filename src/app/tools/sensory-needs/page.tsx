import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SensoryNeeds from "@/components/sensory-needs/SensoryNeeds";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Sensory Needs - My Support Buddy",
  description:
    "Understand sensory seeking and avoiding across sound, light, touch, taste/smell, movement and body awareness, and build a personal sensory profile of what helps and what overwhelms.",
};

export default function SensoryNeedsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Sensory Needs" />
      <ToolHero slug="sensory-needs" title="Sensory Needs">
        <p>
        Understand sensory seeking and avoiding across sound, light,
        touch, taste/smell, movement and body awareness - and build a
        personal profile of what helps and what overwhelms.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap a sense to open it and see examples of seeking and avoiding.",
          "Tap a suggestion, or add your own, under 'What helps' and 'What overwhelms' for each sense.",
          "Everything you add shows together in 'My sensory profile' at the top. It saves automatically.",
          "Print your profile to keep handy or share with family, support workers or a new place you're going to.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SensoryNeeds />
    </div>
  );
}
