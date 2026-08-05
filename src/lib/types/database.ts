export type AccountType = "individual" | "organisation";
export type OrgRole = "owner" | "admin" | "staff";

export interface Profile {
  id: string;
  full_name: string;
  account_type: AccountType;
  created_at: string;
}

export interface Organisation {
  id: string;
  name: string;
  abn: string | null;
  owner_id: string;
  created_at: string;
}

export interface OrganisationMember {
  id: string;
  organisation_id: string;
  profile_id: string;
  role: OrgRole;
  created_at: string;
}

export interface Participant {
  id: string;
  organisation_id: string | null;
  owner_profile_id: string | null;
  linked_profile_id: string | null;
  display_name: string;
  date_of_birth: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}

export interface BehaviourLog {
  id: string;
  participant_id: string;
  antecedent: string | null;
  behaviour: string | null;
  consequence: string | null;
  severity: number | null;
  occurred_at: string;
  recorded_by: string;
  created_at: string;
}

export interface SocialStory {
  id: string;
  participant_id: string;
  title: string;
  content: unknown;
  created_by: string;
  updated_at: string;
  created_at: string;
}
