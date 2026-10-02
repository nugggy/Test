import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import DecisionHelper from "@/components/decision-helper/DecisionHelper";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Decision Helper - My Support Buddy",
  description:
    "Work through a decision step by step: list your options, weigh up what's for and against each one, note who to talk to, and record your choice.",
};

export default function DecisionHelperPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Decision Helper" />
      <ToolHero slug="decision-helper" title="Decision Helper">
        <p>
        A step-by-step way to think through a decision at your own pace - list
        your options, weigh up what&apos;s for and against each one, note who
        to talk to, and write down your final choice. Print it to share with
        family or a support person.
        </p>
      </ToolHero>
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
