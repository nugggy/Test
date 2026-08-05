-- =============================================================================
-- Toolkit accounts schema — v1
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)
--
-- Design summary:
--   - profiles: one row per auth.users, created automatically on sign-up.
--   - organisations: an NDIS provider / clinic / school account.
--   - organisation_members: staff belonging to an organisation, with a role.
--   - participants: the person receiving support. Either owned directly by
--     an individual/family account, OR managed by an organisation on behalf
--     of a participant who does not log in themselves.
--   - behaviour_logs: worked example of a "sensitive tool" table — every
--     future sensitive tool (social stories, session notes, etc.) should
--     follow this same participant_id + RLS pattern.
--
-- Security posture: Row Level Security is enabled on every table and access
-- is DENIED BY DEFAULT — each table only allows what's explicitly granted
-- below. Nothing in the app code needs (or should ever use) the Supabase
-- service_role key; every query runs as the signed-in user and is enforced
-- by these policies, not by application logic.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  account_type text not null check (account_type in ('individual', 'organisation')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can always read/update their own profile.
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Fellow members of the same organisation(s) can see each other's basic
-- profile (needed for a staff directory) — nothing beyond name/type.
create policy "profiles: read org co-members" on public.profiles
  for select using (
    id in (
      select om.profile_id
      from public.organisation_members om
      where om.organisation_id in (
        select organisation_id from public.organisation_members
        where profile_id = auth.uid()
      )
    )
  );

-- Automatically create a profile row when someone signs up. account_type and
-- full_name are supplied as auth sign-up metadata by the app.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New user'),
    coalesce(new.raw_user_meta_data ->> 'account_type', 'individual')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- organisations
-- ---------------------------------------------------------------------------
create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abn text,
  owner_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now()
);

alter table public.organisations enable row level security;

create policy "organisations: read if member" on public.organisations
  for select using (
    id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid()
    )
  );

create policy "organisations: update if owner/admin" on public.organisations
  for update using (
    id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- organisation_members
-- ---------------------------------------------------------------------------
create table if not exists public.organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  unique (organisation_id, profile_id)
);

alter table public.organisation_members enable row level security;

create policy "org_members: read fellow members" on public.organisation_members
  for select using (
    organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid()
    )
  );

create policy "org_members: owner/admin can add" on public.organisation_members
  for insert with check (
    organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "org_members: owner/admin can remove" on public.organisation_members
  for delete using (
    organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Atomically create an organisation and add its creator as owner. Marked
-- SECURITY DEFINER only to make the two inserts atomic — it still requires
-- an authenticated caller and always uses auth.uid() as the owner, so a
-- user can only ever create an organisation owned by themselves.
create or replace function public.create_organisation(org_name text, org_abn text default null)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.organisations (name, abn, owner_id)
  values (org_name, org_abn, auth.uid())
  returning id into new_org_id;

  insert into public.organisation_members (organisation_id, profile_id, role)
  values (new_org_id, auth.uid(), 'owner');

  return new_org_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- participants
-- Either individually owned (owner_profile_id) or organisation-managed
-- (organisation_id). linked_profile_id is for a future enhancement where a
-- participant/guardian gets their own login connected to an existing
-- org-managed record.
-- ---------------------------------------------------------------------------
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations (id) on delete cascade,
  owner_profile_id uuid references public.profiles (id) on delete cascade,
  linked_profile_id uuid references public.profiles (id) on delete set null,
  display_name text not null,
  date_of_birth date,
  notes text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint participants_owned_by_someone check (
    organisation_id is not null or owner_profile_id is not null
  )
);

alter table public.participants enable row level security;

create policy "participants: read if authorised" on public.participants
  for select using (
    owner_profile_id = auth.uid()
    or linked_profile_id = auth.uid()
    or organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid()
    )
  );

create policy "participants: individual can create own" on public.participants
  for insert with check (
    owner_profile_id = auth.uid() and organisation_id is null
  );

create policy "participants: org staff can create" on public.participants
  for insert with check (
    organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid()
    )
  );

create policy "participants: update if authorised" on public.participants
  for update using (
    owner_profile_id = auth.uid()
    or organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid()
    )
  );

create policy "participants: owner/admin can delete" on public.participants
  for delete using (
    owner_profile_id = auth.uid()
    or organisation_id in (
      select organisation_id from public.organisation_members
      where profile_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- behaviour_logs — worked example of a sensitive, participant-linked table.
-- Access rides entirely on participants' own RLS via the subquery below, so
-- there is exactly one place (participants) that defines "who can see this
-- participant" — every sensitive tool's table should follow this shape.
-- ---------------------------------------------------------------------------
create table if not exists public.behaviour_logs (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants (id) on delete cascade,
  antecedent text,
  behaviour text,
  consequence text,
  severity smallint check (severity between 1 and 5),
  occurred_at timestamptz not null default now(),
  recorded_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.behaviour_logs enable row level security;

create policy "behaviour_logs: read if participant authorised" on public.behaviour_logs
  for select using (
    participant_id in (select id from public.participants)
  );

create policy "behaviour_logs: insert if participant authorised" on public.behaviour_logs
  for insert with check (
    participant_id in (select id from public.participants) and recorded_by = auth.uid()
  );

create policy "behaviour_logs: update own entries" on public.behaviour_logs
  for update using (recorded_by = auth.uid());

create policy "behaviour_logs: delete own entries" on public.behaviour_logs
  for delete using (recorded_by = auth.uid());

-- ---------------------------------------------------------------------------
-- social_stories — worked example of a tool a family or clinician builds up
-- and reuses over time for one participant.
-- ---------------------------------------------------------------------------
create table if not exists public.social_stories (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants (id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  created_by uuid not null references public.profiles (id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.social_stories enable row level security;

create policy "social_stories: read if participant authorised" on public.social_stories
  for select using (
    participant_id in (select id from public.participants)
  );

create policy "social_stories: insert if participant authorised" on public.social_stories
  for insert with check (
    participant_id in (select id from public.participants) and created_by = auth.uid()
  );

create policy "social_stories: update if participant authorised" on public.social_stories
  for update using (
    participant_id in (select id from public.participants)
  );

create policy "social_stories: delete if participant authorised" on public.social_stories
  for delete using (
    participant_id in (select id from public.participants)
  );
