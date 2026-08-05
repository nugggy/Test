@AGENTS.md

<!-- BEGIN:project-plan -->
# Toolkit — free disability support tools: project plan

This file is the persistent project brief and plan for Claude Code (or any
other agent) working in this repo. Read this before making changes. Keep it
updated as the project evolves — treat it as living documentation, not a
one-time note.

## Mission

Build a free, mobile-first web platform offering a large collection of
completely free tools for people with disability, families, support
workers, educators, therapists and NDIS providers (Australia). The goal is
to become the "Canva of Disability Supports": practical tools, instantly
usable, no registration/subscription/technical knowledge required unless a
tool genuinely needs to persist sensitive data over time.

**Every tool must:** work well on phone/tablet/iPad, be touch-friendly,
accessible (screen readers, large text, high contrast), simple enough for
people with cognitive impairments, require little/no training, be
printable where appropriate, be customisable where practical, and be free
forever. Success is measured by barriers removed, not revenue.

Full original brief (target users, all 52 planned tools) is worth
preserving — see "Full tool roadmap" below.

## Current status (v0.2.0)

**Live:**
- Project scaffold: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Accessibility system: text size / high contrast / dyslexia-friendly font
  toggle, persisted client-side, no account needed
  (`src/lib/accessibility-context.tsx`)
- Homepage tool directory (`src/app/page.tsx`, data in `src/lib/tools.ts`)
- **Tool 1 — Visual Communication Board** (`src/app/tools/communication-board/`):
  colour-coded categories, tap-to-speak (Web Speech API), message-strip
  sentence building, favourites, add-your-own picture, full-screen mode,
  offline app-shell caching (`public/sw.js`)
- **Accounts system** (only used by tools that hold sensitive/longitudinal
  data — most tools stay account-free):
  - Supabase Auth via `@supabase/ssr`, cookie-based sessions
  - Two account types: individual/family, and organisation (NDIS
    provider/clinic/school) with staff roles (owner/admin/staff)
  - Organisations can create **participant profiles** for people who don't
    have/need their own login
  - Row Level Security on every table — see
    `supabase/migrations/0001_accounts_and_participants.sql` for the full
    policy set; this is the security boundary, not application code
  - Worked-example sensitive tables: `behaviour_logs`, `social_stories`
  - `/privacy` — draft privacy policy, flagged for legal review before
    publishing (health/disability data, data about non-account-holders)
- `/disclaimer` — "not medical advice" disclaimer, plus emergency/crisis
  contacts (000, Lifeline 13 11 14, Kids Helpline 1800 55 1800, 13YARN
  13 92 76). Linked from the footer, homepage, and sign-up consent
  checkbox, and shown as a compact banner
  (`src/components/MedicalDisclaimerBanner.tsx`) on tool pages — **add
  this banner to every new tool page going forward**, not just
  Communication Board.

**Not yet built:** every other tool beyond the Communication Board. The
`behaviour_logs` and `social_stories` tables exist but have no UI yet.

## Known gaps / next steps

- No automated tests yet (no Jest/Playwright set up). Add before the tool
  count grows much further.
- `/privacy` needs a Terms of Use companion page, real contact details, and
  legal review before going live.
- `public/manifest.json` icon is a placeholder SVG — needs real app icons
  (multiple sizes, maskable variant) before PWA install prompts look right.
- Sensitive tools (Behaviour Tracking, Social Story Creator) have a DB
  schema but no pages/UI yet — build these next, following the
  `participant_id`-scoped RLS pattern already in the migration.
- npm has a major version available (was 10.9.7 → 12.0.2 as of this
  writing) — ask the user before upgrading globally.
- This repo was developed in a sandboxed environment with no network path
  to Supabase, so the accounts system is code-complete and passes
  `tsc`/`eslint`/`next build`, but has **not been run against a live
  Supabase project**. Treat first integration as the first real test.

## Full tool roadmap

**Phase 1 (flagship, build first):**
1. Visual Communication Board — ✅ live, no account
2. Visual Schedule Builder — no account
3. Social Story Creator — needs account (persists per participant)
4. Behaviour Tracking Tool — needs account (persists per participant)
5. Emotion Tracker — no account (unless tied to a participant profile later)

**Phase 2 (expand into a full toolkit library), grouped by theme:**
- Communication: Choice Board Creator, First-Then Board, Conversation
  Helper, Pain Communication Board, Communication Passport Builder
- Emotional regulation: Calm Down Toolkit, Anxiety Scale, Coping Strategy
  Generator, Sensory Regulation Toolkit, Safe Space Planner
- Autism support: Transition Timer, Routine Builder, Change Preparation
  Tool, Interest-Based Activity Finder, Social Scenario Practice
- Allied health: Therapy Activity Generator, Goal Tracker, SMART Goal
  Builder, Session Planner, Progress Note Assistant, Home Program Builder,
  Resource Recommendation Engine, Fine Motor / Sensory / Social Skills
  Activity Finders
- Support worker: Shift Handover Tool, Daily Living Skill Tracker,
  Community Access Planner, Incident Reflection Tool, Risk Awareness
  Checklist
- Independent living: Visual Shopping List, Meal Planning Tool, Medication
  Reminder System, Budgeting Tool, Travel Training Planner, Packing
  Checklist Creator, Task Sequencing Tool
- Learning/life skills: Reading/Numeracy Practice, Daily Independence
  Skill Builder, Time Management Assistant, Job Readiness Toolkit,
  Workplace Communication Helper
- Family/carer: Behaviour Observation Tool, Positive Behaviour Diary,
  Family Support Planner, Goal Achievement Celebrator

As a rule of thumb: a tool needs an account only if it stores information
tied to a specific person over multiple sessions (progress, logs, stories,
goals). Anything that's a single-session utility (a calculator, a
checklist you print, a generator you use once) should stay account-free.

## Architecture & conventions

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Supabase
(Postgres + Auth), deployed as a PWA. No other backend.

**Design system** (`src/app/globals.css`): CSS custom properties, not a
Tailwind config file (Tailwind v4 style, `@theme inline`). Palette is a
calm teal/amber, not the generic "cream + terracotta" AI-design default.
Category colours follow the real AAC/PODD convention of one consistent hue
per category for fast visual recognition — keep this pattern for any new
tool with categorised content. Fonts are self-hosted via `@fontsource`
packages (`atkinson-hyperlegible`, `baloo-2`, `lexend`) — **do not**
reintroduce `next/font/google`; it requires a live network path to Google
Fonts that isn't guaranteed in every environment this gets built in, and
self-hosting is strictly better for offline PWA use anyway.

**Accessibility baseline for every new tool:**
- `touch-target` utility class (min 88×88px) on every interactive element
- Respect `data-text-size` / `data-contrast` / `data-font` html attributes
  (set globally by `AccessibilityProvider` — don't build a second settings
  system per tool)
- Visible focus states (already global via `:focus-visible`)
- `aria-live` regions for dynamic content that should be announced
- Works with `prefers-reduced-motion`

**Folder conventions:**
```
src/app/tools/<slug>/page.tsx     one route per tool
src/components/<tool>/            tool-specific components
src/lib/<tool>-data.ts            static/seed data for a tool
src/lib/<tool>-storage.ts         localStorage hooks, for account-free tools
src/app/account/actions.ts        server actions needing auth
supabase/migrations/              append-only numbered SQL migrations
```

**Data layer rule:** account-free tools use `localStorage` only (see
`src/lib/communication-board-storage.ts` for the pattern: hydration-safe
hooks with a `hydrated` guard to avoid SSR/client mismatches). Sensitive or
multi-session tools use Supabase tables scoped by `participant_id`, with
RLS policies of the shape `participant_id in (select id from
public.participants)` — this automatically inherits `participants`' own
access rules, so there's exactly one place that defines "who can see this
participant."

## User's standing preferences (apply to all future work here)

- Never use `eval()`.
- Always use parameterized queries — never build SQL via string
  concatenation of user input. Supabase's query builder and RPC calls are
  parameterized by default; keep it that way.
- Never output secrets to logs (passwords, tokens, session objects, full
  error objects that might carry request data). Log generic messages only.
- Keep `.gitignore` current — `.env*` (except `.env.example`) and Supabase
  CLI local artifacts must never be committed.
- Add defensive safeguards against injection/XSS/auth-bypass by default;
  don't wait to be asked.
- Bump the version (`package.json`) and add a `CHANGELOG.md` entry with
  every meaningful update — see existing entries for the expected format.
- Before updating Node.js, npm, or other tooling versions, ask the user
  first rather than doing it silently.

## Commands

```bash
npm run dev          # local dev server
npm run build         # production build (also type-checks)
npx tsc --noEmit       # type-check only
npx eslint .           # lint
```

Run all three (`tsc`, `eslint`, `build`) before considering any change
done — this repo has been kept at zero errors/warnings across all three
and should stay that way.
<!-- END:project-plan -->

