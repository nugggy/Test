import type { Metadata } from "next";
import Link from "next/link";
import Weather from "@/components/weather/Weather";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Weather - Toolkit",
  description:
    "A simple, customisable weather display - search any location, see today's conditions and a short forecast, and customise the colours and text size.",
};

export default function WeatherPage() {
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
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">Weather</h1>
      <FavouriteToggleButton slug="weather" />
      <p className="no-print mb-3 max-w-2xl text-muted">
        A simple, easy-to-read weather display - search any suburb or town,
        see today&apos;s conditions and a short forecast, and customise the
        colours and text size to suit you.
      </p>
      <p className="no-print mb-6 max-w-2xl rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        Weather data comes from{" "}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          Open-Meteo
        </a>{" "}
        - a general forecast for everyday planning, not a substitute for
        official warnings. For severe weather warnings, check the{" "}
        <a
          href="http://www.bom.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          Bureau of Meteorology
        </a>
        . This tool needs an internet connection to work.
      </p>
      <HowToUse
        steps={[
          "Search for a suburb or town, or tap 'Use my location'.",
          "See today's weather and a short forecast.",
          "Customise the colours, text size, and which details show.",
          "Your location and style choices are remembered next time.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <Weather />
    </div>
  );
}
