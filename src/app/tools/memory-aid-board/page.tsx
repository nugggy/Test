import type { Metadata } from "next";
import MemoryAidBoard from "@/components/memory-aid/MemoryAidBoard";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Memory Aid / Reminder Board - Toolkit",
  description:
    "Visual daily prompts for memory or executive-function difficulties - a checklist of recurring reminders grouped by time of day that resets automatically each morning.",
};

export default function MemoryAidBoardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Memory Aid / Reminder Board
      </h1>
      <FavouriteToggleButton slug="memory-aid-board" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Visual daily prompts for memory or executive-function difficulties -
        a checklist of recurring reminders grouped by time of day that
        resets automatically each morning.
      </p>
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
