"use client";

import { useState } from "react";
import type { ProviderCategoryInfo } from "@/lib/provider-directory-data";
import ProviderSearch from "./ProviderSearch";
import ProviderSubmissionForm from "./ProviderSubmissionForm";

interface ProviderDirectoryPageProps {
  categoryInfo: ProviderCategoryInfo;
}

export default function ProviderDirectoryPage({ categoryInfo }: ProviderDirectoryPageProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="no-print rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
        Listings are submitted directly by providers and are not verified,
        vetted or endorsed by this Toolkit. Always confirm registration,
        qualifications and NDIS registration status yourself - for example
        via the{" "}
        <a
          href="https://www.ndiscommission.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          NDIS Quality and Safeguards Commission
        </a>
        .
      </p>

      <ProviderSearch categoryInfo={categoryInfo} />

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="touch-target w-full rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          {showForm
            ? "Hide the listing form"
            : `Are you a ${categoryInfo.singular.toLowerCase()}? List your service`}
        </button>
        {showForm && (
          <div className="mt-4">
            <ProviderSubmissionForm categoryInfo={categoryInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
