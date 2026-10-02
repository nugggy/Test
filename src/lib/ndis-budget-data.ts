export { formatCurrency } from "./budget-data";

export interface NdisCategory {
  id: string;
  label: string;
  group: "Core Supports" | "Capacity Building" | "Capital Supports";
}

// Core Supports split into its 4 real NDIS line items (funding here is
// usually flexible - it can generally be moved between these four).
// Capacity Building and Capital Supports stay as single categories, since
// their funding is typically fixed to its stated purpose and can't be
// moved between line items or across from Core.
export const NDIS_CATEGORIES: NdisCategory[] = [
  { id: "core-daily-life", label: "Assistance with Daily Life", group: "Core Supports" },
  { id: "core-consumables", label: "Consumables", group: "Core Supports" },
  { id: "core-transport", label: "Transport", group: "Core Supports" },
  {
    id: "core-social",
    label: "Social & Community Participation",
    group: "Core Supports",
  },
  { id: "capacity-building", label: "Capacity Building", group: "Capacity Building" },
  { id: "capital", label: "Capital Supports", group: "Capital Supports" },
];
