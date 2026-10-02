import type { Metadata } from "next";
import KnowYourRights from "@/components/know-your-rights/KnowYourRights";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Know Your Rights - My Support Buddy",
  description:
    "Plain-language guide to your rights as an NDIS participant and your human rights, supported decision-making, how to make a complaint, and where to get help exercising your rights.",
};

export default function KnowYourRightsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Know Your Rights" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Know Your Rights
      </h1>
      <FavouriteToggleButton slug="know-your-rights" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Understanding your rights, and how to use them. Covers your rights
        as an NDIS participant, your human rights, supported
        decision-making, how to make a complaint, and who can help.
      </p>
      <HowToUse
        steps={[
          "Read through each section - tap to expand it.",
          "Save any questions you want to ask at your next meeting.",
          "Note down any rights you want to look into further.",
          "Keep a list of advocates and support people who can help you.",
          "Print this page to take to a meeting, or keep it for your own reference.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <KnowYourRights />
    </div>
  );
}
