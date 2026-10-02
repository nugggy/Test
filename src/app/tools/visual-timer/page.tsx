import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import VisualTimer from "@/components/visual-timer/VisualTimer";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Visual Timer - My Support Buddy",
  description:
    "A big, simple countdown timer with a shrinking pie-chart or bar display - great for transitions, sensory breaks, and turn-taking. Customise the colour, style, sound and vibration.",
};

export default function VisualTimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <ToolHero slug="visual-timer" title="Visual Timer">
        <p>
        A big, simple countdown that shows time passing - not just numbers. Good
        for transitions between activities, sensory breaks, turn-taking, and
        anywhere a countdown makes waiting easier to understand.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Pick a length, or type in minutes and seconds.",
          "Optional: type what happens when time is up, like 'Lunch'. It shows as 'Next' and is read out at the end.",
          "Choose a warning, like 1 minute before the end. You get a soft chime and a 'Nearly finished' sign.",
          "Tap Start. The pie (or bar) shrinks as time passes. Pause or Reset at any time.",
          "Tap 'Full screen' for a big display anyone in the room can see. The screen stays on while the timer runs, where your device allows it.",
          "Choose pie or bar, a colour, and whether to use sound or vibration.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <VisualTimer />
    </div>
  );
}
