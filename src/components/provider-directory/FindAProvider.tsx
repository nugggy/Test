"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROVIDER_CATEGORIES, type ProviderCategory } from "@/lib/provider-directory-data";
import Tabs, { type TabDef } from "@/components/Tabs";
import ProviderDirectoryPage from "./ProviderDirectoryPage";

const CATEGORY_TABS: TabDef<ProviderCategory>[] = [
  { id: "support-coordinator", label: "Support Coordinator" },
  { id: "plan-manager", label: "Plan Manager" },
  { id: "support-provider", label: "Support Provider" },
  { id: "allied-health", label: "Allied Health" },
];

function isProviderCategory(value: string | null): value is ProviderCategory {
  return value !== null && value in PROVIDER_CATEGORIES;
}

export default function FindAProvider() {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("category");
  const [category, setCategory] = useState<ProviderCategory>(
    isProviderCategory(fromUrl) ? fromUrl : "support-coordinator"
  );

  return (
    <div className="flex flex-col gap-4">
      <Tabs tabs={CATEGORY_TABS} active={category} onChange={setCategory} label="Provider type" />
      <ProviderDirectoryPage key={category} categoryInfo={PROVIDER_CATEGORIES[category]} />
    </div>
  );
}
