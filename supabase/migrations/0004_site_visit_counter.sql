-- =============================================================================
-- Site visit counter — v1
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)
--
-- A single running total shown on the homepage ("Opened N times so far").
-- Incremented once per homepage request, server-side (see
-- src/app/actions/visit-counter.ts) — no cookies, no client-side tracking,
-- no per-person data collected at all, just a plain running total.
--
-- Security posture: anon/authenticated get EXECUTE on the increment
-- function only, never direct table access — the function is the only way
-- to change the count, and it can only ever add exactly 1.
-- =============================================================================

create table if not exists public.site_visit_counter (
  id smallint primary key default 1,
  count bigint not null default 0,
  constraint site_visit_counter_single_row check (id = 1)
);

insert into public.site_visit_counter (id, count)
values (1, 0)
on conflict (id) do nothing;

alter table public.site_visit_counter enable row level security;
-- Deliberately no select/insert/update policies — the table is only ever
-- touched via the SECURITY DEFINER function below.

create or replace function public.increment_visit_counter()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.site_visit_counter set count = count + 1 where id = 1
    returning count into new_count;
  return new_count;
end;
$$;

grant execute on function public.increment_visit_counter() to anon, authenticated;
