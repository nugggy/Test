export { formatCurrency } from "./budget-data";

export type NdisGroup = "Core Supports" | "Capacity Building" | "Capital Supports";

export const NDIS_GROUPS: { id: NdisGroup; note: string }[] = [
  {
    id: "Core Supports",
    note: "Core funding is usually flexible. Money can often be moved between the Core categories.",
  },
  {
    id: "Capacity Building",
    note: "Capacity Building funding is usually fixed to each category. It generally can't be moved to another one.",
  },
  {
    id: "Capital Supports",
    note: "Capital funding is usually for specific approved items, such as equipment or home changes.",
  },
];

export interface NdisCategory {
  id: string;
  /** The support category name as it appears in NDIS plans. */
  label: string;
  group: NdisGroup;
  /** NDIS support category number, e.g. "01". */
  number?: string;
  /** Short plain-language examples, to help people find the right one. */
  hint?: string;
  /**
   * Categories from an earlier version of this tool, when Capacity
   * Building and Capital were one total each. Kept so older saved plans
   * and spending still show up; only displayed when they hold data, and
   * never offered for new spending.
   */
  legacy?: boolean;
}

// The 15 NDIS support categories. Ids for the original Core categories
// are unchanged so older saved data keeps matching.
export const NDIS_CATEGORIES: NdisCategory[] = [
  {
    id: "core-daily-life",
    number: "01",
    label: "Assistance with Daily Life",
    group: "Core Supports",
    hint: "e.g. support workers for everyday tasks, help at home",
  },
  { id: "core-transport", number: "02", label: "Transport", group: "Core Supports" },
  {
    id: "core-consumables",
    number: "03",
    label: "Consumables",
    group: "Core Supports",
    hint: "e.g. continence products, low-cost equipment",
  },
  {
    id: "core-social",
    number: "04",
    label: "Assistance with Social, Economic and Community Participation",
    group: "Core Supports",
    hint: "e.g. support to go out and join in activities",
  },
  {
    id: "capital-assistive-technology",
    number: "05",
    label: "Assistive Technology",
    group: "Capital Supports",
    hint: "e.g. wheelchairs, communication devices",
  },
  {
    id: "capital-home-modifications",
    number: "06",
    label: "Home Modifications and Specialist Disability Accommodation",
    group: "Capital Supports",
  },
  {
    id: "cb-support-coordination",
    number: "07",
    label: "Support Coordination",
    group: "Capacity Building",
  },
  {
    id: "cb-living-arrangements",
    number: "08",
    label: "Improved Living Arrangements",
    group: "Capacity Building",
  },
  {
    id: "cb-social-community",
    number: "09",
    label: "Increased Social and Community Participation",
    group: "Capacity Building",
  },
  {
    id: "cb-employment",
    number: "10",
    label: "Finding and Keeping a Job",
    group: "Capacity Building",
  },
  {
    id: "cb-relationships",
    number: "11",
    label: "Improved Relationships",
    group: "Capacity Building",
  },
  {
    id: "cb-health-wellbeing",
    number: "12",
    label: "Improved Health and Wellbeing",
    group: "Capacity Building",
  },
  { id: "cb-learning", number: "13", label: "Improved Learning", group: "Capacity Building" },
  {
    id: "cb-life-choices",
    number: "14",
    label: "Improved Life Choices",
    group: "Capacity Building",
    hint: "e.g. plan management",
  },
  {
    id: "cb-daily-living",
    number: "15",
    label: "Improved Daily Living",
    group: "Capacity Building",
    hint: "e.g. therapy such as OT, speech or physio",
  },
  {
    id: "capacity-building",
    label: "Capacity Building (one total from an earlier version)",
    group: "Capacity Building",
    legacy: true,
  },
  {
    id: "capital",
    label: "Capital Supports (one total from an earlier version)",
    group: "Capital Supports",
    legacy: true,
  },
];

export function categoryById(id: string): NdisCategory | undefined {
  return NDIS_CATEGORIES.find((c) => c.id === id);
}

export function categoryLabel(id: string): string {
  const c = categoryById(id);
  if (!c) return id;
  return c.number ? `${c.number} ${c.label}` : c.label;
}
