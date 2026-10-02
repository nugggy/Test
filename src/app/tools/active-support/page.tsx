import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import ActiveSupport from "@/components/active-support/ActiveSupport";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Active Support for Support Workers - My Support Buddy",
  description:
    "A plain-language breakdown of the five core elements of Active Support - every moment has potential, little and often, graded assistance, maximising choice and control, and positive relationships - with a self-reflection checklist.",
};

export default function ActiveSupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Active Support for Support Workers" />
      <ToolHero slug="active-support" title="Active Support for Support Workers">
        <p>
        A quick-reference guide to Active Support: five core ideas for
        helping the people you support be genuinely engaged in everyday
        life, plus a self-reflection checklist for your own practice.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Read through each of the five elements - tap to expand it.",
          "Look at the 'In practice' examples for practical ways to apply each one.",
          "Use the self-reflection checklist at the end of a shift.",
          "Note down small opportunities that suit the specific person you support.",
          "Print this page to keep as a quick-reference guide.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <ActiveSupport />
    </div>
  );
}
