-- =============================================================================
-- Tool favourites — v1
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)
--
-- Lets the homepage show which tools have been favourited the most, without
-- requiring an account. Each anonymous browser gets a random device id
-- (generated client-side, stored in its own localStorage — see
-- src/lib/device-id.ts), used only to stop the same browser inflating a
-- tool's count by favouriting it over and over. It is not linked to any
-- personal information and nothing else is collected alongside it.
--
-- Security note: because these rows come from anonymous, unauthenticated
-- clients, there is no way to verify a caller actually "owns" a given
-- device id the way real auth would allow — so, deliberately, there is no
-- update/delete policy at all. Unfavouriting only removes a tool from that
-- device's own local list (see src/lib/favourites-storage.ts); it does not
-- retract the vote from the shared count. Treat "favourite_count" as "has
-- been loved by N people at some point", not "is currently favourited by".
-- =============================================================================

create table if not exists public.tool_favourites (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null check (char_length(tool_slug) between 1 and 80),
  device_id uuid not null,
  created_at timestamptz not null default now(),
  unique (tool_slug, device_id)
);

alter table public.tool_favourites enable row level security;

-- Anyone can record a favourite. No select/update/delete policy exists for
-- anon/authenticated, so raw rows (and device ids) are never readable via
-- the API — only the aggregated view below is.
create policy "tool_favourites: anyone can insert" on public.tool_favourites
  for insert to anon, authenticated
  with check (true);

-- Public aggregate: counts only, no device ids. Views run with the
-- privileges of their owner, so this can read the RLS-protected table above
-- and still be safely exposed for anyone to select from.
create or replace view public.tool_favourite_counts as
  select tool_slug, count(*)::int as favourite_count
  from public.tool_favourites
  group by tool_slug;

grant select on public.tool_favourite_counts to anon, authenticated;
