import type { Metadata } from "next";
import { Suspense } from "react";
import FindAProvider from "@/components/provider-directory/FindAProvider";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import BackToToolsLink from "@/components/BackToToolsLink";

export const metadata: Metadata = {
  title: "Find a Provider - Toolkit",
  description:
    "Search for a Support Coordinator, Plan Manager, Support Provider, or Allied Health Specialist by state and service area, or list your own service.",
};

export default function FindAProviderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <BackToToolsLink />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">Find a Provider</h1>
      <FavouriteToggleButton slug="find-a-provider" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Search for a Support Coordinator, Plan Manager, Support Provider,
        or Allied Health Specialist by state and service area, or list
        your own service.
      </p>
      <HowToUse
        steps={[
          "Choose the type of provider you're looking for.",
          "Search by state and suburb/region (and specialty, for Allied Health) to see approved listings.",
          "Tap a phone number, email or website to get in touch directly.",
          "Run a provider yourself? Switch to your category and scroll down to list your service - it'll appear here once reviewed.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <FindAProvider />
      </Suspense>
    </div>
  );
}
