"use client";

import { SUPPORT_TEAM_CATEGORIES, useSupportTeamDirectory } from "@/lib/support-team-storage";
import ContactDirectory from "@/components/contacts/ContactDirectory";

export default function SupportTeamDirectory() {
  const directory = useSupportTeamDirectory();

  return (
    <ContactDirectory
      directory={directory}
      categories={SUPPORT_TEAM_CATEGORIES}
      clearLabel="Clear the whole support team directory"
    />
  );
}
