import type { Metadata } from "next";
import NdisMeetingPrep from "@/components/ndis-meeting-prep/NdisMeetingPrep";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "NDIS Meeting Preparation - Toolkit",
  description:
    "Get ready for an NDIS planning or review meeting: meeting and plan details, documents to bring, what's working, what isn't, changes since your last plan, how your disability affects daily life, support needs, future goals, and questions for your planner.",
};

export default function NdisMeetingPrepPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="NDIS Meeting Preparation" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        NDIS Meeting Preparation
      </h1>
      <FavouriteToggleButton slug="ndis-meeting-prep" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Get ready for a planning or plan review meeting - meeting and plan
        details, documents to bring, what&apos;s working, what isn&apos;t,
        changes since your last plan, how your disability affects daily
        life, support needs, future goals, and questions for your planner,
        all in one printable page.
      </p>
      <HowToUse
        steps={[
          "Add the meeting details - date, type, format, who's coming, and your current plan dates.",
          "Tick off the documents you need to bring.",
          "Work through each section - tap a suggestion chip, or type/say your own.",
          "Everything saves automatically as you go.",
          "Print it to take to your meeting, or share it with your support coordinator beforehand.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <NdisMeetingPrep />
    </div>
  );
}
