import type { Metadata } from "next";
import SupportPlan from "@/components/support-plan/SupportPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Support Plan - Toolkit",
  description:
    "A person-centred support plan: about me, my goals, my supports, health & safety info, communication tips and emergency contacts.",
};

export default function SupportPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Support Plan
      </h1>
      <FavouriteToggleButton slug="support-plan" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        A one-page, person-centred plan to introduce yourself to a new
        support worker, service, or school - goals, supports, health and
        safety info, communication tips, and emergency contacts, all in one
        printable place.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        <strong>Preview mode:</strong> this plan is saved on this device only
        - no account needed yet. A future version will let you save it
        against a participant&apos;s profile.
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
