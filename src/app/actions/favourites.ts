"use server";

import { createClient } from "@/lib/supabase/server";
import { recordFavouriteSchema } from "@/lib/validation";

export interface TopFavouritedTool {
  toolSlug: string;
  favouriteCount: number;
}

/**
 * Records that some anonymous browser favourited a tool, for the homepage's
 * "most favourited" section. Best-effort: failures (including Supabase not
 * being configured) are swallowed by the caller - favouriting a tool always
 * works locally regardless of whether this succeeds.
 */
export async function recordFavourite(toolSlug: string, deviceId: string): Promise<void> {
  const parsed = recordFavouriteSchema.safeParse({ toolSlug, deviceId });
  if (!parsed.success) return;

  const supabase = await createClient();
  // Ignore unique-violation errors (already favourited from this device)
  // and any other error - this is a best-effort public counter, not
  // critical data, so it must never block or throw for the caller.
  await supabase
    .from("tool_favourites")
    .insert({ tool_slug: parsed.data.toolSlug, device_id: parsed.data.deviceId })
    .then(
      () => {},
      () => {}
    );
}

/**
 * Top favourited tools for the homepage, read from the public aggregate
 * view (see supabase/migrations/0003_tool_favourites.sql). Returns an empty
 * list rather than throwing if Supabase isn't configured/reachable, so the
 * homepage can just hide the section.
 */
export async function getTopFavouritedTools(limit: number): Promise<TopFavouritedTool[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tool_favourite_counts")
      .select("tool_slug, favourite_count")
      .order("favourite_count", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row: { tool_slug: string; favourite_count: number }) => ({
      toolSlug: row.tool_slug,
      favouriteCount: row.favourite_count,
    }));
  } catch {
    return [];
  }
}
