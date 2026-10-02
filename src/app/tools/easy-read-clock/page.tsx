import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import EasyReadClock from "@/components/easy-read-clock/EasyReadClock";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Easy-Read Clock - My Support Buddy",
  description:
    "A big, clear digital or analog clock with numbers, hand styles and a speak-the-time button - choose any timezone, and customise the colours, size and format to suit you.",
};

export default function EasyReadClockPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="easy-read-clock" title="Easy-Read Clock">
        <p>
        A big, clear clock that can also say the time in words, like &quot;Quarter past 3&quot;, and show whether it&apos;s morning, afternoon, evening or night. Digital or analog, any timezone, with your own colours and size.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Choose digital or analog, and pick a timezone if you want somewhere other than your own.",
          "The clock can show the time in words, like 'Quarter past 3', and whether it's morning, afternoon, evening or night.",
          "Tap 'Tap to hear the time' to have the time read aloud.",
          "Customise the text size, colours, 24-hour time, seconds and date.",
          "Tap 'Full screen' for a big wall-clock display. The screen stays on, where your device allows it.",
          "Your choices are remembered next time you open this page.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EasyReadClock />
    </div>
  );
}
