-- 0006: remove the account system entirely (decided 02/10/2026).
--
-- My Support Buddy no longer has accounts, sign-in or participant profiles.
-- Every tool stores its data on the user's own device only, so the site
-- never holds anyone's health or disability information.
--
-- WARNING: running this PERMANENTLY DELETES every profile, organisation,
-- organisation membership, participant profile, behaviour log and social
-- story in the database. Export anything you need first. Drops cascade, so
-- the row-level-security policies from 0001 go with their tables.
--
-- It does not touch tool_suggestions, tool_favourites, the visit counter or
-- provider_listings (0002-0005), which the site still uses.
--
-- Also do by hand in the Supabase dashboard: Authentication > Providers >
-- Email > turn off "Allow new users to sign up", and delete any existing
-- users under Authentication > Users.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.create_organisation(text, text) cascade;

drop table if exists public.social_stories cascade;
drop table if exists public.behaviour_logs cascade;
drop table if exists public.participants cascade;
drop table if exists public.organisation_members cascade;
drop table if exists public.organisations cascade;
drop table if exists public.profiles cascade;
