import type { Metadata } from "next";
import Link from "next/link";
import ProviderDirectoryPage from "@/components/provider-directory/ProviderDirectoryPage";
import { PROVIDER_CATEGORIES } from "@/lib/provider-directory-data";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

const categoryInfo = PROVIDER_CATEGORIES["plan-manager"];

export const metadata: Metadata = {
  title: `${categoryInfo.title} - Toolkit`,
  description: categoryInfo.description,
};

export default function FindPlanManagerPage() {
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
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">{categoryInfo.title}</h1>
      <FavouriteToggleButton slug={categoryInfo.slug} />
      <p className="no-print mb-6 max-w-2xl text-muted">{categoryInfo.description}</p>
      <HowToUse
        steps={[
          "Search by state and suburb/region to see approved listings.",
          "Tap a phone number, email or website to get in touch directly.",
          "Are you a Plan Manager? Scroll down to list your own service - it'll appear here once reviewed.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <ProviderDirectoryPage categoryInfo={categoryInfo} />
    </div>
  );
}
