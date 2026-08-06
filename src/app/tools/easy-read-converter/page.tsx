import type { Metadata } from "next";
import Link from "next/link";
import EasyReadConverter from "@/components/easy-read/EasyReadConverter";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Easy Read Converter — Toolkit",
  description:
    "Paste in text and get a simplified, Easy Read version — short sentences, plain words, and a picture for key ideas. Works fully offline.",
};

export default function EasyReadConverterPage() {
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
      <PrintHeader title="Easy Read Converter" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        Easy Read Converter
      </h1>
      <FavouriteToggleButton slug="easy-read-converter" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Paste in a letter, form or any other text, and get a simplified
        version — short sentences, plain everyday words, and a picture next
        to key ideas. Runs entirely on your device.
      </p>
      <HowToUse
        steps={[
          "Paste or type the text you want simplified.",
          "Tap 'Convert to Easy Read'.",
          "Read the short, simple version below — print it if you like.",
          "For a more thorough rewrite, copy the ready-made AI prompt and paste it into Claude, ChatGPT or Copilot.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <EasyReadConverter />
    </div>
  );
}
