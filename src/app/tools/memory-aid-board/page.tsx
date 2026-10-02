import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import MemoryAidBoard from "@/components/memory-aid/MemoryAidBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Memory Aid / Reminder Board - My Support Buddy",
  description:
    "Visual daily prompts for memory or executive-function difficulties - a checklist of recurring reminders grouped by time of day that resets automatically each morning.",
};

export default function MemoryAidBoardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="memory-aid-board" title="Memory Aid / Reminder Board">
        <p>
        Visual daily prompts for memory or executive-function difficulties -
        a checklist of recurring reminders grouped by time of day that
        resets automatically each morning.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Add a reminder with a picture, a short label and a time of day.",
          "Tick each one off as you do it through the day.",
          "The checklist resets automatically the next day - or tap \"Reset for today\" any time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <MemoryAidBoard />
    </div>
  );
}
