import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import VisualSchedule from "@/components/visual-schedule/VisualSchedule";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Visual Schedule Builder - My Support Buddy",
  description:
    "Build a picture timeline of the day so routines feel predictable - drag to reorder, set a countdown timer per step, tick off as you go. Free and printable.",
};

export default function VisualSchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <ToolHero slug="visual-schedule" title="Visual Schedule Builder">
        <p>
        Build a picture schedule for the day. A big &quot;Now&quot; and &quot;Next&quot; card shows what to do and what comes after, so the day feels predictable.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap a picture under 'Add an activity' to put it in today's schedule. Can't find it? Tap 'Add your own'.",
          "The big 'Now' card shows what to do now, and 'Next' shows what comes after. Tap 'Done' to move on.",
          "You can also tap any activity in the list to tick it off or untick it.",
          "Tap 'Change order or timers' to move steps earlier or later, set a timer for a step, or remove one.",
          "Ticks clear by themselves each new day, so the same schedule is ready again tomorrow.",
          "Tap 'Say it out loud' to hear what's now and next, or print the schedule to use on paper.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <VisualSchedule />
    </div>
  );
}
