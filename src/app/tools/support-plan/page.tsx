import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SupportPlan from "@/components/support-plan/SupportPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Support Plan - My Support Buddy",
  description:
    "A person-centred support plan: about me, my goals, my supports, health & safety info, communication tips and emergency contacts.",
};

export default function SupportPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
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
          "Start with 'About me' - a few sentences about who you are.",
          "Work through the other sections - tap a suggestion chip, or type/say your own using the microphone.",
          "Everything saves automatically as you go.",
          "Print it to share with a new support worker, service or school.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SupportPlan />
    </div>
  );
}
