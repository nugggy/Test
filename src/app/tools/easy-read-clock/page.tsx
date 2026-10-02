import type { Metadata } from "next";
import EasyReadClock from "@/components/easy-read-clock/EasyReadClock";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Easy-Read Clock - My Support Buddy",
  description:
    "A big, clear digital or analog clock with numbers, hand styles and a speak-the-time button - choose any timezone, and customise the colours, size and format to suit you.",
};

export default function EasyReadClockPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
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
          "For the analog clock, choose numbers, hand style, tick marks and a face colour.",
          "Customise the text size and colours to suit you.",
          "Turn 24-hour time, seconds, or the date on or off.",
          "Tap 'Tap to hear the time' to have the time read aloud.",
          "Tap 'Full screen' for a clear wall-clock display.",
          "Your choices are remembered next time you open this page.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EasyReadClock />
    </div>
  );
}
