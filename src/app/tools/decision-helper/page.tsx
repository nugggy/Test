import type { Metadata } from "next";
import DecisionHelper from "@/components/decision-helper/DecisionHelper";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Decision Helper - Toolkit",
  description:
    "Work through a decision step by step: list your options, weigh up what's for and against each one, note who to talk to, and record your choice.",
};

export default function DecisionHelperPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Decision Helper" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Decision Helper
      </h1>
      <FavouriteToggleButton slug="decision-helper" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A step-by-step way to think through a decision at your own pace - list
        your options, weigh up what&apos;s for and against each one, note who
        to talk to, and write down your final choice. Print it to share with
        family or a support person.
      </p>
      <HowToUse
        steps={[
          "Write the decision as a question, e.g. 'Should I move into a new share house?'",
          "Add as many options as you're considering - there's no limit.",
          "For each option, list what's for it, what's against it, and what would likely happen next if you picked it.",
          "Note anyone you want to talk to, and any questions to get answered first.",
          "When you're ready - not before - tap the option you've chosen and write down why.",
          "Save it to your decision log to keep a record, then start a new decision whenever you need to.",
          "Print the page, or download your whole log as a CSV file, any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <DecisionHelper />
    </div>
  );
}
