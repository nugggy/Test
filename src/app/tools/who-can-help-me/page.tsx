import type { Metadata } from "next";
import WhoCanHelpMe from "@/components/who-can-help-me/WhoCanHelpMe";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Who Can Help Me? - My Support Buddy",
  description:
    "Find the right support service for how you're feeling right now - crisis lines, mental health support, family violence support, and NDIS complaints and advocacy.",
};

export default function WhoCanHelpMePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Who Can Help Me?
      </h1>
      <FavouriteToggleButton slug="who-can-help-me" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A directory of Australian support services - crisis lines, mental
        health support, family violence support, disability abuse and
        neglect reporting, and NDIS complaints and advocacy. Tap how
        you&apos;re feeling to narrow the list.
      </p>
      <HowToUse
        steps={[
          "If you or someone else is in immediate danger, call 000 now.",
          "Otherwise, tap the option that best describes how you're feeling, or supporting someone else.",
          "Tap a phone number to call it straight away.",
          "There's no wrong door - if you're not sure who to call, Lifeline (13 11 14) can point you in the right direction.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <WhoCanHelpMe />
    </div>
  );
}
