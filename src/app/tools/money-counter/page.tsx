import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Money Counter - My Support Buddy",
  description:
    "Learn to recognise Australian coins and notes and practise counting money - tap coins and notes to build a pile and watch the total add up.",
};

export default function MoneyCounterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Money Counter" />
      <ToolHero slug="money-counter" title="Money Counter">
        <p>
        Practise recognising Australian coins and notes, and counting them
        up. Tap a coin or note to add it to your pile and watch the total
        build.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap any coin or note to add one to your pile.",
          "Watch the total at the top add up as you go.",
          "Tap the ➖ next to an item in your pile to remove one.",
          "Use 'Clear pile' to start again from zero.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MoneyCounter />
    </div>
  );
}
