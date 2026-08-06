export interface WorldTimezoneOption {
  value: string;
  label: string;
}

// A broad-ish list of major IANA zones, grouped roughly by region, for
// tools (like the Easy-Read Clock) where someone might want to show a time
// other than their own — e.g. family overseas. Not exhaustive (there are
// ~400 IANA zones) but covers the most commonly needed ones.
export const WORLD_TIMEZONES: WorldTimezoneOption[] = [
  { value: "Australia/Sydney", label: "Sydney, Melbourne, Canberra, Hobart" },
  { value: "Australia/Brisbane", label: "Brisbane" },
  { value: "Australia/Adelaide", label: "Adelaide" },
  { value: "Australia/Darwin", label: "Darwin" },
  { value: "Australia/Perth", label: "Perth" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Manila", label: "Manila" },
  { value: "Asia/Jakarta", label: "Jakarta" },
  { value: "Asia/Bangkok", label: "Bangkok" },
  { value: "Asia/Kolkata", label: "Mumbai, Delhi, Kolkata" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Dublin", label: "Dublin" },
  { value: "Europe/Paris", label: "Paris, Berlin, Madrid, Rome" },
  { value: "Europe/Athens", label: "Athens, Helsinki" },
  { value: "Europe/Moscow", label: "Moscow" },
  { value: "Africa/Johannesburg", label: "Johannesburg" },
  { value: "Africa/Cairo", label: "Cairo" },
  { value: "America/New_York", label: "New York, Toronto (Eastern)" },
  { value: "America/Chicago", label: "Chicago (Central)" },
  { value: "America/Denver", label: "Denver (Mountain)" },
  { value: "America/Los_Angeles", label: "Los Angeles, Vancouver (Pacific)" },
  { value: "America/Anchorage", label: "Anchorage" },
  { value: "Pacific/Honolulu", label: "Honolulu" },
  { value: "America/Sao_Paulo", label: "São Paulo" },
  { value: "America/Mexico_City", label: "Mexico City" },
  { value: "UTC", label: "UTC" },
];
