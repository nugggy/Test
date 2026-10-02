import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import Weather from "@/components/weather/Weather";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";

export const metadata: Metadata = {
  title: "Weather - My Support Buddy",
  description:
    "A simple, customisable weather display - search any location, see today's conditions and a short forecast, and customise the colours and text size.",
};

export default function WeatherPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <ToolHero slug="weather" title="Weather">
        <p>
        A simple, easy-to-read weather display - search any suburb or town,
        see today&apos;s conditions and a short forecast, and customise the
        colours and text size to suit you.
        </p>
      </ToolHero>
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
      <AddToHomeScreen />
      <Weather />
    </div>
  );
}
