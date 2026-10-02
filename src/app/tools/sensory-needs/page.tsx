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
          "Read through each sense to see examples of seeking vs avoiding patterns.",
          "Tap a suggestion, or add your own, under 'What helps' and 'What overwhelms' for each sense.",
          "Everything saves automatically as you go.",
          "Print your sensory profile to keep handy or share with someone supporting you.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SensoryNeeds />
    </div>
  );
}
