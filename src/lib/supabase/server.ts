import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for use on the server (Server Components, Server Actions,
 * Route Handlers). Reads/writes the auth session via cookies so RLS
 * policies see the correct authenticated user.
 */
export async function createClient() {
  const cookieStore = await cookies();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null };
        },
      },
    } as unknown as SupabaseClient;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from a Server Component, which can't set
            // cookies. Safe to ignore here because middleware refreshes the
            // session on every request anyway.
          }
        },
      },
    }
  );
}
