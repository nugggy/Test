"use server";

import { createClient } from "@/lib/supabase/server";
import { toolSuggestionSchema } from "@/lib/validation";

export interface SuggestionActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function submitToolSuggestion(
  _prevState: SuggestionActionState,
  formData: FormData
): Promise<SuggestionActionState> {
  const parsed = toolSuggestionSchema.safeParse({
    message: formData.get("message"),
    contactEmail: formData.get("contactEmail") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  // Anonymous submissions are allowed by RLS (see
  // supabase/migrations/0002_tool_suggestions.sql) - no sign-in required.
  const { error } = await supabase.from("tool_suggestions").insert({
    message: parsed.data.message,
    contact_email: parsed.data.contactEmail || null,
  });

  if (error) {
    // Generic message only - never surface raw database errors to the
    // client, and never log request data (which could include the
    // submitter's email).
    return { error: "Something went wrong sending your suggestion. Please try again." };
  }

  return { success: true };
}
