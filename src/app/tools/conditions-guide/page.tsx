import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import ConditionsGuide from "@/components/conditions/ConditionsGuide";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "Understanding Conditions - My Support Buddy",
  description:
    "Plain-language information on 20 common disabilities and conditions - autism, ADHD, intellectual disability, cerebral palsy, Down syndrome and more - with links to reputable Australian organisations for each.",
};

export default function ConditionsGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="Understanding Conditions" />
      <ToolHero slug="conditions-guide" title="Understanding Conditions">
        <p>
        Plain-language information on 20 common disabilities and
        conditions, with links to reputable Australian organisations to
        learn more about each one.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Search or tap a condition to select it.",
          "Read the plain-language summary and a few things worth knowing.",
          "Follow the links to learn more from a reputable organisation for that condition.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <p className="no-print mb-6 rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
        This is general information to build understanding, not a
        diagnosis, medical advice, or an exhaustive description of any
        condition - every person&apos;s experience is different.
        Organisation links were checked when this page was written, but
        websites change - if a link doesn&apos;t work, search the
        organisation&apos;s name directly.
      </p>
      <AddToHomeScreen />
      <ConditionsGuide />
    </div>
  );
}
