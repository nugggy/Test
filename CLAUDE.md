@AGENTS.md

<!-- BEGIN:project-plan -->
# My Support Buddy — free disability support tools: project plan

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
- **No accounts, by design (decided 02/10/2026).** The owner runs this
  privately as one person in NSW, not as a company, and will not take on the
  legal risk of holding anyone's health or disability information. So there
  is no sign-in, no user accounts and no participant profiles, and every
  tool keeps its data on the user's own device only (localStorage, or the
  Android app's WebView storage). **Do not add accounts, cloud sync or any
  server-side storage of tool data.** The account system that used to exist
  was removed in 0.38.2; `supabase/migrations/0006_remove_accounts.sql`
  drops its tables (written, not yet applied to the live project).
- Supabase is still used only for non-sensitive shared features: tool
  suggestions, anonymous favourite counts and the visit counter. The
  provider directory was removed in 0.40.0 (`0007_remove_provider_listings.sql`
  drops its table; written, not yet applied).
- `/privacy` and `/terms` are published (0.38.1, updated 0.38.2): private
  operator in NSW, NSW governing law, contact gwclissold@gmail.com. Keep them
  accurate whenever a feature changes what data leaves the device.
- `/disclaimer` — "not medical advice" disclaimer, plus emergency/crisis
  contacts (000, Lifeline 13 11 14, Kids Helpline 1800 55 1800, 13YARN
  13 92 76). Linked from the footer and homepage, and shown as a compact banner
  (`src/components/MedicalDisclaimerBanner.tsx`) on tool pages — **add
  this banner to every new tool page going forward**, not just
  Communication Board.

**Not yet built:** every other tool beyond the Communication Board. The
`behaviour_logs` and `social_stories` tables exist but have no UI yet.

## Android app (added 02/10/2026)

Product name is "My Support Buddy" (renamed from "Toolkit" on 02/10/2026).
Internal identifiers deliberately keep the old word and must not change:
package ID `cc.dunns.tools`, the `ToolkitAndroid/<version>` user-agent token,
localStorage keys, the service-worker cache name and `package.json` `name`.

`android/` is a Capacitor shell that loads the live site in a WebView; there is
no separate mobile codebase and no static export (the site is server-rendered).
APK version lives in `android/app/build.gradle`, independent of `package.json`.
Releases are GitHub Releases on nugggy/Test tagged `android-v<version>` with the
APK attached; `src/components/AppUpdateChecker.tsx` offers the download inside
the app. Printing inside the app goes through `printPage()` from
`src/lib/native-app.ts` (use it, not `window.print()`, in any new tool). Build
and release steps: `docs/android-release.md`. The signing keystore is gitignored
and must never change between releases.

## Known gaps / next steps

- Tests: Vitest is set up (`npm test`) but only covers the update-channel
  logic so far. Add component/tool tests before the tool count grows much
  further.
- `/privacy` needs a Terms of Use companion page, real contact details, and
  legal review before going live.
- `public/manifest.json` icon is a single SVG — needs PNG sizes and a maskable
  variant before PWA install prompts look right. (The Android launcher icon is
  done: see `mobile/assets/` and `docs/android-release.md`.)
- npm has a major version available (was 10.9.7 → 12.0.2 as of this
  writing) — ask the user before upgrading globally.

## Full tool roadmap

**Phase 1 (flagship, build first):**
1. Visual Communication Board — ✅ live, no account
2. Visual Schedule Builder — ✅ live, no account
3. Social Story Creator — live, on-device only
4. Behaviour Tracking Tool — live, on-device only
5. Emotion Tracker — live, on-device only

**Phase 2 (expand into a full toolkit library), grouped by theme:**
- Communication: Choice Board Creator — ✅ live (`first-then-board`, merged
  with First-Then Board), First-Then Board — ✅ live (same tool, mode
  switcher), Conversation Helper, Pain Communication Board, Communication
  Passport Builder
- Emotional regulation: Calm Down Toolkit, Anxiety Scale, Coping Strategy
  Generator, Sensory Regulation Toolkit, Safe Space Planner
- Autism support: Transition Timer — ✅ live (`visual-timer`), Routine
  Builder, Change Preparation Tool, Interest-Based Activity Finder, Social
  Scenario Practice
- Allied health: Therapy Activity Generator, Goal Tracker, SMART Goal
  Builder, Session Planner, Progress Note Assistant, Home Program Builder,
  Resource Recommendation Engine, Fine Motor / Sensory / Social Skills
  Activity Finders
- Support worker: Shift Handover Tool, Daily Living Skill Tracker,
  Community Access Planner, Incident Reflection Tool, Risk Awareness
  Checklist
- Independent living: Visual Shopping List, Meal Planning Tool, Medication
  Reminder System — ✅ live (`medication-reminder`), Budgeting Tool, Travel
  Training Planner, Packing Checklist Creator, Task Sequencing Tool
- Learning/life skills: Reading/Numeracy Practice, Daily Independence
  Skill Builder, Time Management Assistant, Job Readiness Toolkit,
  Workplace Communication Helper
- Family/carer: Behaviour Observation Tool, Positive Behaviour Diary,
  Family Support Planner, Goal Achievement Celebrator
- Safety & records: **Emergency/"About Me" Info Card** — printable/phone-
  ready card with medical conditions, allergies, communication needs and
  emergency contacts, to hand to first responders or new support staff;
  no account needed. **Appointment Prep Tool** — a checklist/question list
  to bring to a specialist appointment plus a "what's changed since last
  visit" summary; complements the Seizure Log and BGL Tracker dashboards.
- Money: **NDIS Plan Budget Tracker** — like the existing Budget Tracker
  but scoped to NDIS support categories (Core/Capacity Building/Capital),
  so participants can see spend vs. plan allocation per category.
- Reading/access: ~~Text Simplifier~~ — ✅ already live as
  **Easy Read Converter** (`easy-read-converter`), which does this today.
  **Read-Aloud Tool** — paste/upload any text and have it read aloud at an
  adjustable speed; cheap to ship since `useSpeech` (the site-wide TTS
  hook) already exists, and helps low-vision/dyslexic/low-literacy users
  on any page, not just one tool.

**More ideas, grouped by who they'd help most** (added 2026-08-14, not yet
built):
- Sensory & regulation: **Sensory Break Planner** — customisable checklist
  of calming activities/environments to pick from when overstimulated.
  **Noise/Light Sensitivity Guide** — a simple prep sheet for new
  environments (venues, appointments) flagging likely sensory triggers.
  **Quiet/Stim-Friendly Activity Finder**.
- Communication & social: Social Story Creator (already Phase 1, above).
  **Conversation Starter Cards** — for people who find small talk hard,
  especially useful in group/day programs. **Core Word Board** — a more
  clinically standard core-vocabulary board than the existing pictorial
  Communication Board, for higher-frequency AAC use.
- Physical/mobility & daily living: **Accessible Venue Checklist** —
  questions to ask/check before visiting somewhere new (step-free access,
  accessible toilets, quiet spaces). **Energy/Spoon Tracker** — for
  chronic illness/fatigue conditions, logging energy expenditure across a
  day to plan pacing. **Adaptive Equipment Finder** — a simple
  directory/quiz pointing to equipment categories (not a shop, just
  guidance).
- Mental health & cognitive: Anxiety/Mood Scale (already Phase 2, above,
  as "Anxiety Scale") — extend with a simple trend log when built.
  ~~Decision-Making Helper~~ — ✅ already live (`decision-helper`). **Memory
  Aid / Reminder Board** — visual daily prompts for people with memory or
  executive-function difficulties.
- Education & employment: **Job Interview Practice Tool** — common
  questions plus a script-builder for answers. **Workplace Adjustment
  Request Builder** — helps someone draft a plain-language request for
  reasonable adjustments.
- Family/carer-facing: **New Diagnosis Info Pack Builder** — curated
  starting-point resources based on a condition. **Respite/Support Roster
  Planner** — a simple shared calendar for coordinating multiple carers/
  support workers.

Rule: no tool ever needs an account. Tools that track information over
time (logs, goals, stories) store it on the device, and offer print or
export (PDF/CSV) so people can keep or share their own copy.

## Architecture & conventions

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Supabase
(Postgres + Auth), deployed as a PWA. No other backend.

**Design system** (`src/app/globals.css`): CSS custom properties, not a
Tailwind config file (Tailwind v4 style, `@theme inline`). Palette is
"warm coral and sunshine" (coral `#c23b37`, yellow `#f5b324`, cream `#fdf6ee`;
changed 02/10/2026 from teal/amber). Every text/background pairing must stay
WCAG AA; the coral was chosen at 5.3:1 on white so it works for both link text
and white-on-coral buttons. Visual style is "bento with personality" (0.39.0): neutral
stone base, Lexend headings, hairline borders, bold colour blocks
(`bg-brand`, `bg-accent`, `bg-ink-block`) and category stickers via
`categoryStyle()` in `src/lib/category-style.ts`. Every tool page starts with
`<ToolHero slug title>` - use it for new tools. Keep the 88px touch target
but draw small controls smaller inside it (see `FavouriteToggleButton`).
Category colours follow the real AAC/PODD convention of one consistent hue
per category for fast visual recognition — keep this pattern for any new
tool with categorised content. Fonts are self-hosted via `@fontsource`
packages (`atkinson-hyperlegible` for body, `lexend` for headings; `baloo-2`
is installed but no longer imported) — **do not**
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
src/lib/<tool>-storage.ts         localStorage hooks (all tool data lives here)
supabase/migrations/              append-only numbered SQL migrations
```

**Data layer rule:** every tool uses `localStorage` only (see
`src/lib/communication-board-storage.ts` for the pattern: hydration-safe
hooks with a `hydrated` guard to avoid SSR/client mismatches). Tool data
never goes to Supabase or any other server.

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

