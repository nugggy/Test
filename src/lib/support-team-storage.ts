import { createContactDirectoryStorage } from "@/lib/contact-directory-storage";

export const SUPPORT_TEAM_CATEGORIES = [
  "Plan Manager",
  "Support Coordinator",
  "Therapists",
  "Medical Specialists",
  "Emergency Contacts",
  "Other",
];

export const useSupportTeamDirectory = createContactDirectoryStorage("dt:support-team:v1");
