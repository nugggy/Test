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
        Practise with real-sized Australian coins and notes. Count your
        money, practise making an amount, or check if you have enough to pay
        and how much change you should get.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap any coin or note to add one to your pile. The total shows at the top.",
          "Choose 'Make an amount' to practise making a price, then tap Check. Tap 'Show me how' for help.",
          "Choose 'Can I pay for it?' and type a price to see if your pile is enough, and what change to expect.",
          "Tap the ➖ next to an item in your pile to take one away, or 'Clear pile' to start again.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MoneyCounter />
    </div>
  );
}
