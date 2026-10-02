import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import RegulationPlan from "@/components/regulation-plan/RegulationPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Emotional Regulation Plan - My Support Buddy",
  description:
    "Build a personal calm-down, grounding and crisis plan, step by step: warning signs, calming strategies, grounding techniques, people to go to, and when to get urgent help.",
};

export default function EmotionalRegulationPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Emotional Regulation Plan" />
      <ToolHero slug="emotional-regulation-plan" title="Emotional Regulation Plan">
        <p>
        A step-by-step personal calm-down, grounding and crisis plan - warning
        signs, what helps, grounding techniques, what to avoid, and who to go
        to - built up over time and printable to share with support people.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Private to you:</strong> this plan is saved on this device only.
        Nothing is sent to us.
      </p>
      <HowToUse
        steps={[
          "Work through the plan one step at a time using the step buttons or Back/Next.",
          "Tap a suggestion chip on each step, or type/say your own using the microphone.",
          "Warning signs → what helps → grounding techniques → what makes it worse → support people → urgent help.",
          "Everything saves automatically as you go - there's no need to press save.",
          "On the last step, print your plan or download it as a PDF to keep a copy or share it with support people.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <RegulationPlan />
    </div>
  );
}
