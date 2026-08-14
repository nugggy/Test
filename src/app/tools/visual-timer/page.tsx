import type { Metadata } from "next";
import Link from "next/link";
import VisualTimer from "@/components/visual-timer/VisualTimer";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Visual Timer - Toolkit",
  description:
    "A big, simple countdown timer with a shrinking pie-chart or bar display - great for transitions, sensory breaks, and turn-taking. Customise the colour, style, sound and vibration.",
};

export default function VisualTimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">Visual Timer</h1>
      <FavouriteToggleButton slug="visual-timer" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A big, simple countdown that shows time passing - not just numbers. Good
        for transitions between activities, sensory breaks, turn-taking, and
        anywhere a countdown makes waiting easier to understand.
      </p>
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
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <VisualTimer />
    </div>
  );
}
