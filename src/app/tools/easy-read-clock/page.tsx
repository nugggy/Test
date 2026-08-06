import type { Metadata } from "next";
import Link from "next/link";
import EasyReadClock from "@/components/easy-read-clock/EasyReadClock";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Easy-Read Clock - Toolkit",
  description:
    "A big, clear digital or analog clock - choose any timezone, and customise the colours, size and format to suit you.",
};

export default function EasyReadClockPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Easy-Read Clock
      </h1>
      <FavouriteToggleButton slug="easy-read-clock" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        A big, clear clock - digital or analog, any timezone, and fully
        customisable colours and size. Great for a wall display, a tablet
        propped up, or checking the time somewhere else in the world.
      </p>
      <HowToUse
        steps={[
          "Choose digital or analog, and pick a timezone if you want somewhere other than your own.",
          "Customise the text size and colours to suit you.",
          "Turn 24-hour time, seconds, or the date on or off.",
          "Tap 'Full screen' for a clear wall-clock display.",
          "Your choices are remembered next time you open this page.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <EasyReadClock />
    </div>
  );
}
