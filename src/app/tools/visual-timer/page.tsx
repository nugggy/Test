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
          "Pick a length, or set a custom number of minutes and seconds.",
          "Tap Start - the pie (or bar) shrinks as time passes.",
          "Pause and Reset at any time.",
          "Choose pie or bar style, a colour, and whether to play a sound or vibrate when time's up.",
          "Tap 'Full screen' for a clear display anyone in the room can see.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <VisualTimer />
    </div>
  );
}
