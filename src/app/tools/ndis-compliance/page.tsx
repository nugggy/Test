import type { Metadata } from "next";
import Link from "next/link";
import NdisCompliance from "@/components/ndis-compliance/NdisCompliance";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";

export const metadata: Metadata = {
  title: "NDIS Compliance & Provider Obligations - Toolkit",
  description:
    "A plain-language guide to what registered NDIS providers are required to do - the Code of Conduct, service agreements, cancellations, worker screening, incident management, restrictive practices and complaints - with a self-check and how to raise a concern.",
};

export default function NdisCompliancePage() {
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
      <PrintHeader title="NDIS Compliance & Provider Obligations" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        NDIS Compliance & Provider Obligations
      </h1>
      <FavouriteToggleButton slug="ndis-compliance" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Understand what your NDIS provider is actually required to do -
        the Code of Conduct, service agreements, cancellations, worker
        screening, incidents and restrictive practices, and complaints -
        with a self-check and clear next steps if something doesn&apos;t
        look right.
      </p>
      <HowToUse
        steps={[
          "Read through each section to learn what providers are required to do.",
          "Use the checklist to check your own provider against common obligations.",
          "Save questions you want to ask your provider directly.",
          "Keep a private, dated note of anything that concerns you.",
          "If something's not right, follow the steps to raise it or contact the NDIS Commission.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <NdisCompliance />
    </div>
  );
}
