import type { Metadata } from "next";
import DailyLifeAssistant from "@/components/daily-life/DailyLifeAssistant";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Daily Life Assistant - My Support Buddy",
  description:
    "Create your own step-by-step instructions for everyday tasks - fully customisable, tick off each step, and reset for next time.",
};

export default function DailyLifeAssistantPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <PrintHeader title="Daily Life Assistant" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Daily Life Assistant
      </h1>
      <FavouriteToggleButton slug="daily-life-assistant" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Pick a task you want to remember how to do, break it into your own
        steps, then tick each one off as you go. Fully customisable -
        there&apos;s no built-in content, it&apos;s entirely written by you.
      </p>
      <HowToUse
        steps={[
          "Add a task, e.g. 'How to do laundry' - or tap a suggestion.",
          "Add each step in order.",
          "Next time you do the task, tick off each step as you complete it.",
          "Tap 'Reset for next time' once you're done, ready to use again.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <DailyLifeAssistant />
    </div>
  );
}
