import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import SavingsPlan from "@/components/savings-plan/SavingsPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Savings Plan - My Support Buddy",
  description:
    "Set one or more savings goals with a target amount, log every contribution, and watch a progress bar build up towards each goal.",
};

export default function SavingsPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Savings Plan" />
      <ToolHero slug="savings-plan" title="Savings Plan">
        <p>
        Set a savings goal, add money as you put it aside, and see how much
        is left to go. It can work out how much to save each week or
        fortnight to reach your goal by a date.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Add a savings goal with a name and goal amount.",
          "Add a date if you want it by a certain time, to see how much to put aside each week, fortnight or month.",
          "Or type how much you can put aside, to see about how long it will take.",
          "Each time you save money, type the amount and tap 'I saved this'. If you take money out, tap 'I took this out'.",
          "Download a CSV or print your plan any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <SavingsPlan />
    </div>
  );
}
