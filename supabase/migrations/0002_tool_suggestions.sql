-- =============================================================================
-- Tool suggestions — v1
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)
--
-- A public feedback box: anyone (no account needed) can suggest a new tool,
-- optionally leaving an email if they want to hear back when/if it ships.
-- There is no in-app admin UI for this yet — read submissions via the
-- Supabase dashboard's table editor, or a service-role query. Notifying
-- someone that their suggestion shipped is a manual step (no automated
-- email sending is wired up in this app) unless/until that's built.
-- =============================================================================

create table if not exists public.tool_suggestions (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 2000),
  contact_email text check (contact_email is null or char_length(contact_email) <= 254),
  status text not null default 'new' check (status in ('new', 'planned', 'built', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.tool_suggestions enable row level security;

-- Anyone can submit a suggestion, including anonymous visitors — this is a
-- public feedback box, not tied to an account. No column can be read back
-- by the submitter or anyone else through the API: there is deliberately no
-- select policy, so submitted email addresses stay private from other
-- visitors and can only be read via the Supabase dashboard / service role.
create policy "tool_suggestions: anyone can submit" on public.tool_suggestions
  for insert to anon, authenticated
  with check (true);
