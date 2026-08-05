# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [0.4.0] - 2026-08-05
### Added
- **Tool 2 — Visual Schedule Builder** (`src/app/tools/visual-schedule/`): tap-to-add activities from a 26-item icon library or add your own, reorder with up/down controls, tick off as done, reset ticks or clear the day, print-friendly. Account-free, `localStorage` only.
- **Tool 3 — Emotion Tracker** (`src/app/tools/emotion-tracker/`): tap an emotion (8 colour-coded options, new `--emo-*` tokens in `globals.css`), optional intensity and note, logs to a reverse-chronological history with delete/clear. Account-free, `localStorage` only.
- Speech-to-text dictation for custom picture/activity labels: a mic button (Web Speech API `SpeechRecognition`) now sits next to the label field in both the Communication Board's "Add your own picture" dialog and the new Visual Schedule's "Add your own activity" dialog. Feature-detected — hidden on browsers without support (currently Firefox), typing still works everywhere. New `useSpeechToText` hook in `src/lib/use-speech.ts`, ambient types in `src/lib/speech-recognition.d.ts`.
- Shared `src/lib/emoji-choices.ts` — the picture palette used by both custom-item dialogs, extracted so the two tools can't silently drift apart.

### Fixed
- The dev server 404'd on every route, including localhost — `proxy.ts` runs on nearly all paths and crashed when Supabase env vars weren't set. `src/lib/supabase/middleware.ts` and `src/lib/supabase/server.ts` now treat missing config as "signed out" instead of throwing, so account-free tools work with zero Supabase setup.
- `next.config.ts`: added `allowedDevOrigins` so LAN devices can load HMR/dev assets in development.

## [0.3.0] - 2026-08-05
### Added
- `/disclaimer` — clear "not medical advice" disclaimer: what the tools are/aren't for, who to seek professional advice from, and emergency/crisis contacts (000, Lifeline 13 11 14, Kids Helpline 1800 55 1800, 13YARN 13 92 76).
- Compact disclaimer banner (`MedicalDisclaimerBanner`) shown on tool pages, starting with the Communication Board — add this to every new tool page going forward.
- Disclaimer linked from the homepage intro, the site footer, and the sign-up consent checkbox alongside the Privacy Policy.
- `/disclaimer` and `/privacy` added to the offline app-shell cache (cache bumped to `toolkit-shell-v2`).

## [0.2.0] - 2026-08-05
### Added
- **Accounts system**, needed only by tools that hold sensitive or longitudinal data (behaviour tracking, social stories). Every other tool, including the Communication Board, stays account-free.
  - Supabase Auth (email + password) via `@supabase/ssr`, cookie-based sessions, session refresh in middleware/proxy.
  - Two account types: **Individual/family** and **Organisation** (NDIS provider, clinic, school).
  - Organisation accounts can invite staff (owner/admin/staff roles) and create **participant profiles** on behalf of people who don't need or want their own login.
  - **Row Level Security on every table** — an organisation can never see another organisation's participants or staff; an individual account can only ever see their own. Enforced in Postgres, not just in app code.
  - Worked-example sensitive-data tables (`behaviour_logs`, `social_stories`) showing the pattern every future sensitive tool should follow.
  - All account/participant forms validated server-side with `zod`, independent of any client-side validation.
  - `/privacy` — a tailored privacy policy draft (Australian Privacy Principles, NDIS context, consent for participant profiles) flagged for legal review before publishing, since it covers health/disability data and data about people other than the account holder.
- Self-hosted fonts via `@fontsource` (previously `next/font/google`, which needs a live network path to Google Fonts) — also improves true offline reliability for the PWA.
- Renamed `middleware.ts` → `proxy.ts` per Next.js 16's current convention.

### Security
- No `service_role` key anywhere in app code — every query runs as the signed-in user, authorised only by RLS.
- Passwords validated only by length (10+ chars) rather than composition rules, and never logged.
- Organisation creation uses a `SECURITY DEFINER` Postgres function scoped to `auth.uid()`, so it can't be used to create an org on someone else's behalf.

## [0.1.0] - 2026-08-05
### Added
- Initial project scaffold (Next.js 16, TypeScript, Tailwind CSS, App Router).
- Global accessibility system: adjustable text size, high contrast mode, dyslexia-friendly font toggle — persisted to `localStorage`, no account required.
- Homepage with tool directory (Phase 1 flagship tools listed, Communication Board live, others marked "Coming soon").
- Tool 1: **Visual Communication Board**
  - Large touch-friendly buttons (min 88px targets)
  - Text-to-speech via the Web Speech API
  - Fitzgerald-key-inspired colour-coded categories (Food, Drinks, Emotions, Pain, Toileting, Activities, Requests)
  - Favourites
  - Full-screen mode
  - Add custom board items (label + emoji), stored locally per device — no login, no server
  - Basic offline support (app shell caching via service worker)

