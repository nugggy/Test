-- =============================================================================
-- Provider directory — v1
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)
--
-- Backs four public "find X near me" tools: Support Coordinator, Plan
-- Manager, Support Provider, Allied Health Specialist. Providers submit
-- their own listing (no account needed); it starts as 'pending' and is only
-- publicly visible once manually switched to 'approved'.
--
-- There is no in-app moderation UI yet — approving/rejecting a listing is a
-- manual step via the Supabase dashboard's table editor (update `status`),
-- same as tool_suggestions. Build a moderation UI before this gets any
-- real submission volume.
--
-- Security posture: anon/authenticated can INSERT a new row (always
-- 'pending' — they cannot set their own row to 'approved') and can SELECT
-- only rows already 'approved'. There is no update/delete policy at all, so
-- a listing can never be edited or removed except via the dashboard /
-- service role — including by whoever submitted it.
-- =============================================================================

create table if not exists public.provider_listings (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'support-coordinator', 'plan-manager', 'support-provider', 'allied-health'
  )),
  business_name text not null check (char_length(business_name) between 1 and 160),
  contact_name text check (contact_name is null or char_length(contact_name) <= 160),
  phone text check (phone is null or char_length(phone) <= 40),
  email text check (email is null or char_length(email) <= 254),
  website text check (website is null or char_length(website) <= 300),
  state text not null check (state in ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')),
  service_area text not null check (char_length(service_area) between 1 and 200),
  specialties text[] not null default '{}',
  description text check (description is null or char_length(description) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.provider_listings enable row level security;

create policy "provider_listings: anyone can submit as pending" on public.provider_listings
  for insert to anon, authenticated
  with check (status = 'pending');

create policy "provider_listings: anyone can read approved listings" on public.provider_listings
  for select to anon, authenticated
  using (status = 'approved');

create index if not exists provider_listings_category_status_idx
  on public.provider_listings (category, status);
