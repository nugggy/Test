import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import HealthyRelationships from "@/components/healthy-relationships/HealthyRelationships";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Healthy Relationships - My Support Buddy",
  description:
    "Plain-language education on healthy relationships, consent, warning signs, communication and staying safe - plus a private, personal space to write down what matters to you.",
};

export default function HealthyRelationshipsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Healthy Relationships" />
      <ToolHero slug="healthy-relationships" title="Healthy Relationships">
        <p>
        Everyone has the right to relationships that are safe, respectful,
        and their own choice. This tool covers what makes a relationship
        healthy, consent, warning signs, communication, and where to get
        help - in plain language, written for adults.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Read through each section - tap to expand it.",
          "There's no wrong way to use this: read it all, or just what's useful right now.",
          "Use the personal sections at the bottom to write down what matters to you, privately on this device.",
          "If anything here feels close to your own situation, the 'Where to get help' section has people you can talk to.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <HealthyRelationships />
    </div>
  );
}
