import type { Metadata } from "next";
import Link from "next/link";
import SavingsPlan from "@/components/savings-plan/SavingsPlan";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Savings Plan — Toolkit",
  description:
    "Set one or more savings goals with a target amount, log every contribution, and watch a progress bar build up towards each goal.",
};

export default function SavingsPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="Savings Plan" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Savings Plan
      </h1>
      <FavouriteToggleButton slug="savings-plan" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Set a savings goal — a target amount, an optional date — then log
        every bit you put aside and watch the progress bar build up.
      </p>
      <HowToUse
        steps={[
          "Add a savings goal with a name and target amount.",
          "Every time you put money aside, log it as a contribution.",
          "Watch the progress bar fill up towards your target.",
          "Add as many goals as you like — a holiday, equipment, an emergency fund.",
          "Export a CSV or print your plan any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <SavingsPlan />
    </div>
  );
}
