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
    "Build a personal calm-down plan step by step: warning signs, calming strategies, grounding, how others can help, people to go to, and when to get urgent help. Open it in one tap or print it to share.",
};

export default function EmotionalRegulationPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Emotional Regulation Plan" />
      <ToolHero slug="emotional-regulation-plan" title="Emotional Regulation Plan">
        <p>
        A personal calm-down plan: your warning signs, what helps, how other
        people can help, what to avoid, and who to go to. Build it step by
        step, then open it in one tap when you need it, or print it to share
        with support people.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Private to you:</strong> this plan is saved on this device only.
        Nothing is sent to us.
      </p>
      <HowToUse
        steps={[
          "Work through the plan one step at a time using the step buttons or Back/Next.",
          "Tap a suggestion on each step, or type or say your own using the microphone.",
          "Warning signs, what helps, grounding, how others can help, what makes it worse, support people, and urgent help.",
          "Everything saves automatically as you go. There's no need to press save.",
          "Once your plan has something in it, it opens straight to the whole plan on one screen, so it's quick to find when you need it.",
          "Print it or save it as a PDF to share with family or support workers. Phone numbers in your plan can be tapped to call.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <RegulationPlan />
    </div>
  );
}
