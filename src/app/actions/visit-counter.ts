"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Increments the site-wide visit counter by exactly 1 and returns the new
 * total, for display on the homepage. Returns null (rather than throwing)
 * if Supabase isn't configured/reachable, so the homepage can just hide the
 * counter instead of showing broken UI.
 */
export async function incrementAndGetVisitCount(): Promise<number | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("increment_visit_counter");
    if (error || typeof data !== "number") return null;
    return data;
  } catch {
    return null;
  }
}
