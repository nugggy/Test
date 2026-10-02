# My Support Buddy — free disability support tools

Free tools for people with disability, families, support workers,
educators, therapists and NDIS providers. Accounts are only required for
tools that store sensitive or longitudinal data on someone's behalf
(behaviour tracking, social stories); everything else works entirely on your
own device.

## Requirements

- Node.js 22.x (check with `node --version`)
- A [Supabase](https://supabase.com) project (free tier is fine) — only
  needed for the accounts system; the rest of the app runs without it.

## Setup

```bash
npm install
cp .env.example .env.local
# then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# from your Supabase project's Settings → API page
```

Apply the database schema (creates all tables + Row Level Security
policies):

```bash
# using the Supabase CLI, from the project root
supabase link --project-ref your-project-ref
supabase db push
```

Or paste the contents of `supabase/migrations/0001_accounts_and_participants.sql`
into the Supabase SQL editor and run it once.

In your Supabase project's Auth settings, enable Email auth and set your
Site URL / Redirect URLs to match where you're running the app (e.g.
`http://localhost:3000` for local dev).

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/app/                    routes (App Router)
src/app/(auth)/             sign-up, sign-in, and their server actions
src/app/account/            account dashboard, org setup, participant management
src/app/tools/<slug>/       one folder per tool
src/components/             shared UI
src/lib/supabase/           browser/server/middleware Supabase clients
src/lib/validation.ts       zod schemas — all account forms are validated server-side
supabase/migrations/        SQL schema + Row Level Security policies
```

## Security notes

- Every table has Row Level Security enabled; access is denied by default
  and only explicitly granted policies allow reads/writes. See
  `supabase/migrations/0001_accounts_and_participants.sql` for the full
  policy set and reasoning.
- The app never uses the Supabase `service_role` key — only the public
  anon key, which relies entirely on RLS for enforcement.
- All form input is re-validated server-side with `zod` regardless of
  client-side checks.
- `.env.local` (and any other `.env*` file except `.env.example`) is
  gitignored — never commit real Supabase keys.

## Adding a new sensitive tool

Follow the `behaviour_logs` / `social_stories` pattern in the migration:
one table with a `participant_id` foreign key, RLS policies that check
`participant_id in (select id from public.participants)` (which
automatically inherits the same visibility rules as `participants`), and a
`recorded_by`/`created_by` column set to the authenticated user.

## Before going live

- Have `/privacy` reviewed by a privacy lawyer — it's a working draft, not
  legal advice, and this product handles health/disability information and
  data about people other than the account holder.
- Add a Terms of Use page.
- Fill in the retention periods and contact details left as placeholders in
  the privacy policy.
