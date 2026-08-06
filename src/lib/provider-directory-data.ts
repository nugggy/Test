export type ProviderCategory =
  | "support-coordinator"
  | "plan-manager"
  | "support-provider"
  | "allied-health";

export interface ProviderCategoryInfo {
  category: ProviderCategory;
  slug: string;
  singular: string;
  title: string;
  description: string;
}

export const PROVIDER_CATEGORIES: Record<ProviderCategory, ProviderCategoryInfo> = {
  "support-coordinator": {
    category: "support-coordinator",
    slug: "find-support-coordinator",
    singular: "Support Coordinator",
    title: "Find a Support Coordinator Near Me",
    description:
      "Search for NDIS Support Coordinators by state and service area, or list your own service.",
  },
  "plan-manager": {
    category: "plan-manager",
    slug: "find-plan-manager",
    singular: "Plan Manager",
    title: "Find a Plan Manager Near Me",
    description:
      "Search for NDIS Plan Managers by state and service area, or list your own service.",
  },
  "support-provider": {
    category: "support-provider",
    slug: "find-support-provider",
    singular: "Support Provider",
    title: "Find a Support Provider Near Me",
    description:
      "Search for NDIS support providers by state and service area, or list your own service.",
  },
  "allied-health": {
    category: "allied-health",
    slug: "find-allied-health",
    singular: "Allied Health Specialist",
    title: "Find an Allied Health Specialist Near Me",
    description:
      "Search for allied health specialists by state, service area and specialty, or list your own practice.",
  },
};

export const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const;

export const ALLIED_HEALTH_SPECIALTIES = [
  "Occupational Therapy",
  "Speech Pathology",
  "Physiotherapy",
  "Psychology",
  "Behaviour Support",
  "Dietetics",
  "Podiatry",
  "Exercise Physiology",
  "Social Work",
  "Other",
];

export interface ProviderListing {
  id: string;
  category: ProviderCategory;
  businessName: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  state: string;
  serviceArea: string;
  specialties: string[];
  description: string | null;
}
