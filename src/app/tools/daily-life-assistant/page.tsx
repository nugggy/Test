import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import DailyLifeAssistant from "@/components/daily-life/DailyLifeAssistant";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Daily Life Assistant - My Support Buddy",
  description:
    "Create your own step-by-step instructions for everyday tasks - fully customisable, tick off each step, and reset for next time.",
};

export default function DailyLifeAssistantPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Daily Life Assistant" />
      <ToolHero slug="daily-life-assistant" title="Daily Life Assistant">
        <p>
        Pick a task you want to remember how to do, break it into small
        steps, then tick each one off as you go. Start from one of the ready
        made tasks, or write your own. You can change every step.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Type a task, e.g. 'How to do laundry', or tap a ready made task. Its steps are filled in for you.",
          "Change, add or remove steps so they match how you do it.",
          "Tap 'Do it one step at a time' to see one big step at a time, with a button to read it out loud.",
          "Tap 'Reset for next time' once you're done, ready to use again.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <DailyLifeAssistant />
    </div>
  );
}
