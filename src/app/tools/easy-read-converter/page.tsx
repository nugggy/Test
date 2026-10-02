import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import EasyReadConverter from "@/components/easy-read/EasyReadConverter";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Easy Read Converter - My Support Buddy",
  description:
    "Paste in text and get a simplified, Easy Read version - short sentences, plain words, and a picture for key ideas. Works fully offline.",
};

export default function EasyReadConverterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Easy Read Converter" />
      <ToolHero slug="easy-read-converter" title="Easy Read Converter">
        <p>
        Paste in a letter, form or any other text, and get a simplified
        version - short sentences, plain everyday words, and a picture next
        to key ideas. Runs entirely on your device.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Paste or type the text you want simplified.",
          "Tap 'Convert to Easy Read'.",
          "Read the short, simple version below - print it if you like.",
          "For a more thorough rewrite, copy the ready-made AI prompt and paste it into Claude, ChatGPT or Copilot.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <EasyReadConverter />
    </div>
  );
}
