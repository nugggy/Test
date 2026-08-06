"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createOrganisationSchema,
  createParticipantSchema,
} from "@/lib/validation";

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createOrganisation(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createOrganisationSchema.safeParse({
    name: formData.get("name"),
    abn: formData.get("abn") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in again." };
  }

  // create_organisation is a SECURITY DEFINER Postgres function (see
  // supabase/migrations) that atomically creates the org and adds the
  // caller as owner - it always uses the authenticated user, never a value
  // from the request body, so this can't be used to create an org on
  // someone else's behalf.
  const { error } = await supabase.rpc("create_organisation", {
    org_name: parsed.data.name,
    org_abn: parsed.data.abn || null,
  });

  if (error) {
    console.error("create_organisation failed");
    return { error: "Couldn't create the organisation. Please try again." };
  }

  revalidatePath("/account");
  redirect("/account");
}

export async function createParticipant(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createParticipantSchema.safeParse({
    displayName: formData.get("displayName"),
    dateOfBirth: formData.get("dateOfBirth") ?? "",
    notes: formData.get("notes") ?? "",
    organisationId: formData.get("organisationId") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in again." };
  }

  const { displayName, dateOfBirth, notes, organisationId } = parsed.data;

  // Row Level Security (see supabase/migrations) independently enforces
  // that this insert can only succeed if the caller owns this record
  // individually, or is a member of the target organisation - this check
  // here is just for a clearer error message, not the actual security
  // boundary.
  const { error } = await supabase.from("participants").insert({
    display_name: displayName,
    date_of_birth: dateOfBirth || null,
    notes: notes || null,
    organisation_id: organisationId || null,
    owner_profile_id: organisationId ? null : user.id,
    created_by: user.id,
  });

  if (error) {
    console.error("create participant failed");
    return { error: "Couldn't save that profile. Please try again." };
  }

  revalidatePath("/account");
  redirect("/account");
}
