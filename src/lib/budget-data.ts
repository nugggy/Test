export const EXPENSE_CATEGORIES = [
  "Groceries",
  "Transport",
  "Bills & utilities",
  "Household",
  "Support services",
  "Health",
  "Entertainment",
  "Clothing",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Wages",
  "Centrelink / pension",
  "NDIS funding",
  "Other",
];

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export function formatCurrency(amount: number): string {
  return CURRENCY_FORMATTER.format(amount);
}
