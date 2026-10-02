import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SupportPlan from "@/components/support-plan/SupportPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Support Plan - My Support Buddy",
  description:
    "A person-centred support plan: about me, my goals, my supports, health & safety info, communication tips and emergency contacts.",
};

export default function SupportPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Support Plan" />
      <ToolHero slug="support-plan" title="Support Plan">
        <p>
        A one-page, person-centred plan to introduce yourself to a new
        support worker, service, or school - goals, supports, health and
        safety info, communication tips, and emergency contacts, all in one
        printable place.
        </p>
      </ToolHero>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Private to you:</strong> this plan is saved on this device only.
        Nothing is sent to us.
      </p>
      <HowToUse
        steps={[
          "Add your name, then any alerts a new worker must know straight away.",
          "Write a few sentences in 'About me', then add what's important to you and how to support you well.",
          "Work through the other sections - tap a suggestion chip, or type or say your own using the microphone.",
          "Everything saves on this device as you go.",
          "Tap 'See one-page plan' to check it, then print it for a new support worker, service or school.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SupportPlan />
    </div>
  );
}
