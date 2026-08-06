# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [0.26.0] - 2026-08-07
### Added
- **NDIS Compliance & Provider Obligations** (`/tools/ndis-compliance`) - a plain-language guide to what registered NDIS providers are required to do: the NDIS Code of Conduct, service agreements, cancellations/pricing, worker screening checks, incident management and reportable incidents, regulated restrictive practices, and complaints handling. Includes a self-check checklist, a "questions for my provider" list, a private notes list, and clear steps (with the NDIS Commission's 1800 035 544) for raising a concern. Complements the existing Know Your Rights tool - that one covers the participant's own rights, this one covers what the provider is obligated to do.

## [0.25.0] - 2026-08-07
### Changed
- Replaced every em dash in the app's user-facing copy with a plain hyphen, sitewide (~400 occurrences across 165 files). Source-code comments in `globals.css` were left as-is since they're never rendered.

### Added
- **Cookie/local storage notice** (`CookieConsentBanner.tsx`): a one-time, honest notice (not a granular consent form - there are no ads or tracking cookies to opt in/out of) explaining that tool data lives in local storage on-device and that signing in sets a strictly-necessary session cookie. Links to Privacy Policy and the new Terms of Use.
- **Terms of Use** (`/terms`): free-to-use, not professional advice, local-storage data responsibility, acceptable use, provider-listing disclaimer, no warranty, limitation of liability - flagged as a draft needing legal review, same as the existing Privacy Policy. Linked from the footer and the privacy page.

### Fixed
- **Read Page Aloud not working on mobile**: long text passed to `speechSynthesis` could be silently cut off or never start on mobile browsers (a known iOS Safari/mobile WebKit bug - the utterance can be garbage-collected mid-speech, and very long single utterances can just stop). `useSpeech` now chunks text into sentence-sized utterances queued in sequence and keeps a live reference to them, which is why the Communication Board's short tap-to-speak phrases were unaffected but whole-page reading wasn't working.
- **Header layout on mobile**: the Read Aloud and Accessibility Settings buttons could overflow and overlap the "Toolkit" wordmark on narrow screens, especially with the "Larger touch targets" accessibility setting on. The header row now wraps onto a second line instead of overlapping, with tighter spacing/padding on small screens.

## [0.24.0] - 2026-08-07
### Added
- **Money Counter** (`/tools/money-counter`) — a new tool for learning to recognise Australian coins and notes and practising counting. Tap coins/notes to build a pile and watch the total add up; remove items individually; pile persists locally. Coins and notes are self-drawn SVGs (`MoneyPieceIcon.tsx`) rather than sourced/downloaded currency images — reproducing real Australian currency artwork is legally restricted (Crimes (Currency) Act 1981) and downloading image files from arbitrary online sources isn't something this project does. The illustrations still match real proportions and colours (silver/gold coins, the 50c piece's 12 sides, the $2 coin being physically smaller than the $1 despite being worth more, notes getting longer for every step up in value) so recognition still works, and those details are called out in the tool's copy as a teaching point.
- **Active Support**: each of the five elements now has an editable "What this looks like for this person" list, so a personalised note of what to notice for that specific person can be recorded (e.g. under "Every moment has potential": what a moment of disengagement looks like for them, and what meaningful engagement looks like for them).
- **Dundaloo attribution**: the site footer (every page) and homepage hero now link to dundaloo.org.au; the 4 provider-directory tools (Find a Support Coordinator/Plan Manager/Support Provider/Allied Health Specialist) now also carry the Allied Health services callout, bringing it to all 38 tools.

### Changed
- Homepage tool directory's list view now shows 3 columns on desktop-width screens (was capped at 2), matching grid view's breakpoints — 1 column on mobile, 2 on tablet, 3 on desktop, in both view modes.

## [0.23.0] - 2026-08-07
### Added
- New `useScrollIntoViewOnce` hook (`src/lib/use-scroll-into-view-once.ts`): the first time a selection reveals a results section further down the page, that section smoothly scrolls into view instead of relying on the person to notice and scroll manually. Only fires once per visit so it doesn't fight someone already looking at the results, and respects `prefers-reduced-motion`.
- Applied to **Who Can Help Me?** (tapping a feeling tag scrolls to the filtered results) and **What Next?** (picking a mood scrolls to the coping strategies).

## [0.22.0] - 2026-08-07
### Added
- **Site-wide navigation**: the header is now sticky (`position: sticky`) so the way back to the homepage is always reachable without scrolling back to the top of a long tool page. The "← All tools" link on all 38 tool pages is now a larger, bordered touch-target button instead of small underlined text.
- Homepage tool directory now defaults to **list view** instead of grid (still remembered per visitor once they pick one).
- **Active Support**: added a "Why it matters" paragraph, a prominent free-training callout linking to La Trobe University / Greystanes Disability Services' free, self-paced Active Support course (`everymomenthaspotential.com.au` — 8 modules, video + interactive, no registration), and a new "Common pitfalls" section.
- **NDIS Meeting Preparation**: captures significantly more detail — meeting type and format, current plan start/end dates, who's attending, a "Documents to bring" checklist, "Changes since my last plan", and "How this affects my daily life" (functional-impact examples, which is what funding decisions are actually based on).

### Deployment
- New, separate Vercel project (`dundaloo-tools`) and GitHub repo for this app, deployed at `tools.dunns.cc` for testing/feedback — deliberately decoupled from the main `dunns.cc` site/project. Runs without Supabase configured; every Supabase-backed feature already degrades gracefully when unconfigured, confirmed by a clean build.

## [0.21.0] - 2026-08-06
### Added
Nine new tools:
- **Holiday Planner** (`/tools/holiday-planner`) — destination and dates, accommodation/transport, a day-by-day itinerary, packing and documents checklists, budget, and emergency contacts. Printable, no account.
- **Diabetes BGL & Insulin Tracker** (`/tools/diabetes-tracker`) — logs blood glucose readings (mmol/L) and insulin type/dose over time, with a colour-coded trend chart (general reference bands only — individual targets are always set by the person's own care team, called out explicitly in the disclaimer), CSV export and print.
- **Healthy Relationships** (`/tools/healthy-relationships`) — plain-language, adult-oriented education covering what makes a relationship healthy, consent, warning signs, communication, staying safe, and where to get help (1800RESPECT, the National Disability Abuse and Neglect Hotline, etc.), plus a private personal reflection section.
- **Know Your Rights** (`/tools/know-your-rights`) — NDIS participant rights, human rights (UN CRPD), supported decision-making, how to make a complaint, and advocacy contacts, plus a personal notes/questions section.
- **Active Support for Support Workers** (`/tools/active-support`) — a plain-language breakdown of the five core elements of Active Support (Every Moment Has Potential, Little and Often, Graded Assistance, Maximising Choice and Control, Positive Relationships), each with practical examples, plus a shift-end self-reflection checklist. Framed as an introductory summary, with a pointer to La Trobe University's accredited training for the full model.
- **Exercise & Fitness Plan** (`/tools/fitness-plan`) — fitness goals with steps (reusing the Goal Tracker's `createGoalListStorage`/`GoalCard`), plus a session log with a minutes-per-session trend chart.
- **Savings Plan** (`/tools/savings-plan`) — one or more savings goals with a target amount, a contribution log, and a progress bar per goal. CSV export and print.
- **Easy-Read Clock** (`/tools/easy-read-clock`) — a big digital or analog clock, any IANA timezone (`src/lib/world-timezones.ts`), fully customisable colours and text size, 12/24-hour and seconds/date toggles, and a full-screen wall-clock mode. Style choices saved per device.
- **Weather** (`/tools/weather`) — search any location (or use device geolocation) for current conditions and a 3/5/7-day forecast, via [Open-Meteo](https://open-meteo.com) (free, no API key, no signup — chosen specifically so this stays true to the project's no-cost, no-account principle). Fully customisable colours and text size. Marked `worksOffline: false`, like the provider-directory tools.

New shared building blocks used across the above: `InfoSection.tsx` (an accessible, printable expand/collapse card built on `<details>`, for the three education-style tools) and a `details > *:not(summary) { display: block !important }` print rule in `globals.css` so those sections always print fully expanded regardless of on-screen state.

## [0.20.0] - 2026-08-06
### Added
- **Dark mode**: a new accessibility toggle (alongside high contrast, easy-read font, etc.) that switches the whole site to a dark purple/navy palette (`data-theme="dark"` in `globals.css`, `theme` setting in `accessibility-context.tsx`). Independent of high contrast — if both are on, high contrast still wins.
- **Shared `PrintButton` component** (`src/components/PrintButton.tsx`), rolled out to all 25 tools that have a print/PDF action. Previously many print buttons used the same plain, low-contrast styling as secondary actions like "Clear" or "Download CSV" and were easy to miss; the new button uses a filled accent colour, bold text and a shadow so it stands out consistently everywhere.
- **Support Plan**: health & safety information is now an "⚠️ Alerts — read first" section at the very top of the plan (both on screen and when printed), instead of being buried lower down — covers allergies, S8 (controlled) medications, seizure triggers, etc. Added S8 medication and trigger suggestion chips.
- **Meal Planner**: 20 starter recipes (everyday meals like spaghetti bolognese, chicken curry, roast chicken, pancakes) are preloaded the first time someone opens the Cookbook, so it isn't a blank page — only seeded once; deleting them all stays deleted.
- **Meal Planner shopping list**: ingredient quantities are now combined across the week's meals instead of just listing duplicates — three meals each needing 500g mince becomes one "1.5kg mince" line (`src/lib/shopping-list-aggregate.ts`), with unit conversion for weight (g/kg) and volume (ml/L/tsp/tbsp/cup) and plain addition for countable items (e.g. "3 cloves garlic" + "2 cloves garlic" → "5 cloves garlic").
- **Who Can Help Me?**: added the Poisons Information Centre (13 11 26) and healthdirect (1800 022 222), under a new "Health or medication question" filter tag.
- **Seizure Observation Log**: entering a possible trigger now reveals a follow-up field asking why they think that was the trigger, saved and shown alongside the trigger in the log.
- Buttons and links now show a hand cursor on hover and a brief press-down effect when clicked, sitewide, so it's clear something is clickable and that a tap registered (respects reduced-motion).

### Fixed
- Lists could get cut mid-item across a page break when printing (most noticeably Support Plan's Emergency contacts) — every `EditableListSection` entry now has `print-avoid-break`.
- Support Plan's "Allergic to..." and "Takes medication at..." suggestion chips previously added that literal placeholder text as a health & safety entry when tapped. Suggestions ending in "..." now prefill and focus the input instead, so the person completes the sentence rather than saving the template text as-is.

## [0.19.0] - 2026-08-06
### Added
- **Provider directory — 4 new tools**: Find a Support Coordinator, Find a Plan Manager, Find a Support Provider, and Find an Allied Health Specialist (with a specialty-area filter/tag: OT, Speech Pathology, Physio, Psychology, Behaviour Support, etc). Search by state and a free-text suburb/region/business match (not a map or true distance search). Providers submit their own listing (name, contact, service area, and specialties for allied health) with no account needed.
- New Supabase table `provider_listings` (`supabase/migrations/0005_provider_listings.sql`): public insert (always starts `pending`), public read of `approved` rows only. **There is no in-app moderation UI yet** — approving a submitted listing is a manual step in the Supabase dashboard (flip `status` to `approved`), the same pattern as the Suggest a Tool box. Build a real moderation UI before this gets meaningful submission volume.
- Every provider-directory page carries an explicit disclaimer that listings are submitted directly by providers and are **not verified, vetted or endorsed** — with a link to the NDIS Quality and Safeguards Commission for checking registration independently. This felt necessary before publishing any real third-party business/contact details.
- These four tools are marked `worksOffline: false` — unlike every other tool, search and submission need a live connection to Supabase.

## [0.18.1] - 2026-08-06
### Fixed
- **Fact-checked every phone number and hours on Who Can Help Me?** against live official sources. Crisis lines (Lifeline, Suicide Call Back Service, Kids Helpline, 13YARN, Beyond Blue, 1800RESPECT, MensLine) and the NDIS Commission/Contact Centre numbers were all already correct. Corrected: QLife's hours (was "3pm–midnight", actually 3pm–9pm), Carer Gateway's hours (now "Mon–Fri, 8am–5pm"), the abuse/neglect hotline's hours (now "Mon–Fri, 9am–7pm"), and the "Disability advocacy support" entry — previously had no phone number, now lists the Disability Gateway's confirmed number (1800 643 787), which runs the Advocacy Finder.

## [0.18.0] - 2026-08-06
### Added
- **Tool 25 — Easy Read Converter** (`src/app/tools/easy-read-converter/`) — the last tool from the original batch request. Paste in text and get a rule-based Easy Read version: long sentences are split at conjunctions/commas, common jargon is swapped for plain words (`src/lib/easy-read-data.ts`, `easy-read-convert.ts`), and each line gets a matching emoji where one applies. Runs entirely on-device — no server calls, no cost. An "Ask an AI to do this better" panel copies a ready-made prompt (with the pasted text) to the clipboard and links out to Claude, ChatGPT and Microsoft Copilot for a genuine rewrite, for anyone who wants a more thorough result than word-swapping can give. Printable.

This closes out every item from the original tool-suggestions batch, on top of everything added along the way this session (favourites, Add to Home Screen, a visit counter, Visual Labels Maker, Seizure Observation Log, and CSV/print export across the board).

## [0.17.0] - 2026-08-06
### Added
- **Tool 24 — Sleep Tracker** (`src/app/tools/sleep-tracker/`): log bedtime, wake time and a sleep-quality rating each night; hours slept is computed automatically (handles overnight wrap). A new `SleepTrendChart.tsx` (hand-rolled SVG bars, modelled on Behaviour Tracking's `SeverityTrendChart.tsx`) shows the last 14 nights. CSV export and print.
- **Homepage visit counter**: "💜 Opened N times by people who needed it — and counting", incremented once per homepage request via a `SECURITY DEFINER` Postgres function (`supabase/migrations/0004_site_visit_counter.sql`) — no cookies, no client-side tracking, nothing personal collected. Hidden gracefully if Supabase isn't configured.

## [0.16.0] - 2026-08-06
### Added
- **Tool 19 — My Support Team Directory** (`src/app/tools/support-team/`) and **Tool 20 — My Friends Directory** (`src/app/tools/friends-directory/`): both built on the Phase-0 `ContactDirectory`/`ContactEntryEditor` components — categorised contact cards (name, organisation, phone, email, notes), printable. Support Team: Plan Manager, Support Coordinator, Therapists, Medical Specialists, Emergency Contacts, Other. Friends: Family, Friends, Community/Neighbours.
- **Tool 21 — Daily Life Assistant** (`src/app/tools/daily-life-assistant/`): create your own tasks (e.g. "How to do laundry") with a step checklist; "Reset for next time" once all steps are done. Fully user-authored, no built-in content. Printable.
- **Tool 22 — Medication Reminder** (`src/app/tools/medication-reminder/`): medication list (name, dose, times) plus a daily tick-off checklist and a CSV/print-exportable log. Scoped honestly as a tracker, not a guaranteed alarm — it can only remind while the page is open, so time-critical medication should also use the phone's own alarm.
- **Tool 23 — Seizure Observation Log** (`src/app/tools/seizure-log/`): seizure type, duration, possible trigger, what happened, recovery, and actions taken (first aid/rescue medication/ambulance/hospital), with CSV export for clinical analysis and print. Marked as needing an account eventually, like Behaviour Tracking.
- A much larger shared emoji set (`src/lib/emoji-choices.ts`, ~40 → ~140 emoji across feelings/people/food/home/places/animals/activities) and a new `EmojiPicker.tsx` (big grid + a "type or paste any emoji" fallback so the full range of any device's emoji keyboard is always available, not just the curated set) — used by the communication board's add-picture dialog, Visual Labels Maker, and Daily Life Assistant's task icons.
- `SuggestField.tsx` extracted as a shared component (text + dictation + suggestion chips), now used by both Behaviour Tracking and the new Seizure Log form instead of being duplicated.

## [0.15.0] - 2026-08-06
### Added
- **Tool 17 — Friendship Goal Planner** (`src/app/tools/friendship-goals/`): goals grouped into Meeting people / Maintaining friendships / Community inclusion, each with suggestion chips and a step checklist. Built on the same `createGoalListStorage` factory and `GoalCard` as Goal Tracker. Printable.
- **Tool 18 — NDIS Meeting Preparation** (`src/app/tools/ndis-meeting-prep/`): meeting date and plan manager/support coordinator names, then What's working well, What isn't working, My support needs, My future goals, and Questions for my planner — same one-page printable plan shape as Support Plan. Printable.

## [0.14.0] - 2026-08-06
### Added
- **Tool 16 — Visual Labels Maker** (`src/app/tools/visual-labels/`): create simple picture-and-word labels — pick a word/phrase (with household suggestions like "Bathroom", "Turn off the lights") and a picture, then print a page of cut-out cards to stick up around the house. Printable.

## [0.13.0] - 2026-08-06
### Added
- **Favourite tools**: a heart toggle on every tool card (homepage grid/list) and on each tool's own page. Favourites are saved per-device (`localStorage`) and also best-effort recorded to a new Supabase table (`supabase/migrations/0003_tool_favourites.sql`, insert-only RLS — there's no way to verify anonymous ownership well enough to allow retracting a vote server-side, so unfavouriting only updates your own local list). The homepage shows a "❤️ Most favourited by our community" section, sourced from a public aggregate view (`tool_favourite_counts`) — hidden gracefully if Supabase isn't configured.
- **Add to Home Screen**: a dismissible prompt on every tool page (`AddToHomeScreen.tsx`) — a real install button via `beforeinstallprompt` on Chrome/Edge/Android, or Share → Add to Home Screen instructions on iOS Safari (which creates an icon that opens that specific tool directly). Hidden once already installed, and on browsers that support neither, rather than guessing at unverified instructions.

### Changed
- Homepage tool cards are now a uniform height (`line-clamp` + reserved space on titles/descriptions/account-status line) so mixed-length content no longer makes the grid look uneven, even with a favourite button now sitting inside each card.

## [0.12.0] - 2026-08-06
### Added
- **Tool 15 — Goal Tracker** (`src/app/tools/goal-tracker/`): freeform goals with an optional target date, notes, and a step checklist (new `ChecklistSection`-backed `GoalCard.tsx`). Printable and CSV-exportable.
- **CSV export, as a standing rule across every tool with a log/history**: Behaviour Tracking's ABC log, Emotion Tracker, Traffic Light Check-in, Budget Tracker's transactions, Decision Helper's decision log, Goal Tracker, and What Should I Do Next's saved strategies all gained a "Download CSV" button next to their existing data, using the shared `downloadCsv()` utility. Print buttons were also added wherever a tool had data worth taking away but no export at all yet (Who Can Help Me, What Should I Do Next, Communication Board, and the four tools above).
- Homepage search is now typo-tolerant (`src/lib/fuzzy-match.ts`, plain edit-distance matching, no new dependency) — small misspellings like "commnication" or "shedule" still find the right tool.
- Homepage now remembers your grid/list view choice across visits (`localStorage`).
- A short note on the homepage explaining why this stays free: it could be monetised, but everyone deserves the right to access support regardless of cost.

### Changed
- **Who Can Help Me?** now always appears first in the tool directory (it's the most safety-relevant tool), and its icon changed from 🤝 to 🛟.

## [0.11.0] - 2026-08-06
### Added
- **Tool 13 — Who Can Help Me?** (`src/app/tools/who-can-help-me/`): a directory of Australian support services — crisis lines, mental health support, family violence support, disability abuse/neglect reporting, and NDIS complaints and advocacy — filterable by how you're feeling or what's going on. Tap-to-call phone links. **Phone numbers and service names should get a manual fact-check pass before this goes live** — they're sourced from well-known, long-stable national services, but haven't been verified against a live source in this session.
- **Tool 14 — What Should I Do Next?** (`src/app/tools/what-next/`): pick a mood (reusing the same 8 moods as Emotion Tracker) to see default coping strategies for that mood, plus your own saved custom strategies per mood (e.g. ones a therapist or support worker has recommended specifically for you).

### Changed
- **Emotional Regulation Plan** restructured into a step-by-step wizard (Warning signs → What helps → Grounding techniques → What makes it worse → Support people → Urgent help → Review & print), with a new "Grounding techniques" section (5-4-3-2-1 senses, box breathing, etc.) — this is the calm-down/grounding/crisis plan tool from the latest batch of requests, built by enhancing this existing tool rather than duplicating it.

## [0.10.0] - 2026-08-06
### Added
- **Foundations for a larger batch of new tools**: `downloadCsv()` (`src/lib/csv-export.ts`, with CSV-formula-injection guarding), a `PrintHeader.tsx` letterhead component and an upgraded `@media print` stylesheet (`@page` margins, forced colour printing, a `.print-avoid-break` utility) for better print-to-PDF output, `ChecklistSection.tsx` (like `EditableListSection` but with toggleable done checkboxes), a shared `Tabs.tsx` component (`MealPlanner.tsx` migrated to it), and a shared contact-directory hook/editor (`contact-directory-storage.ts`, `ContactEntryEditor.tsx`, `ContactDirectory.tsx`) for the upcoming Support Team and Friends & Family directories.
- **Decision Helper**: each option now has a "What would likely happen next" (natural consequences) list alongside for/against; "What I've decided" is now a tap-to-pick list of your actual options (still supports typing something else); decisions can be saved to a persistent **decision log** (question, options considered, pros/cons/consequences, chosen option, reasoning, date), exportable as CSV or via print/PDF.
- **Meal Planner → My Cookbook tab**: compile selected recipes into a customisable, shareable cookbook — set a title/subtitle, choose which recipes to include, pick "one recipe per page" or "compact" layout, then print/download as PDF. Replaces a separate "Cook Book" tool, since it's the same recipe data as the existing Recipes tab.
- **Suggest a tool** (`/suggestions`): a public form (no account needed) to request a new tool, with an optional email for follow-up if it ships. Stored in a new `tool_suggestions` Supabase table (`supabase/migrations/0002_tool_suggestions.sql`) — anonymous insert only, no read access via the API, so submissions are only visible via the Supabase dashboard. There's no automated "it shipped!" email yet — following up is a manual step. Linked from the site footer.
- **"Works offline" badges** on every tool card (home page grid and list views): all current tools are `localStorage`-only with no live network calls, so once a tool's page has been opened while online it keeps working offline (the existing service worker caches it) — `ToolEntry.worksOffline` makes this explicit per tool instead of leaving it unstated.

### Changed
- Homepage list view is now 2 columns on tablet/desktop widths instead of a single stacked column.
- Every page's content column widened by one step (e.g. `max-w-3xl` → `max-w-4xl`, `max-w-6xl` → `max-w-7xl`, header/footer included) so there's noticeably less empty space on either side on laptop/tablet screens, while still capping line length for readability on very large monitors. Narrow single-purpose forms (sign in/up, new participant) were left as-is.
- Fixed the Accessibility settings panel's "Text size" buttons overflowing their container when "Larger touch targets" is also turned on (3 buttons × a larger forced touch-target width no longer fit); the row now wraps instead of clipping.

## [0.9.0] - 2026-08-06
### Added
- **Tool 12 — Decision Helper** (`src/app/tools/decision-helper/`): a supported-decision-making tool — write the decision as a question, add options, list what's for and against each one (new `OptionCard.tsx`, built on the shared `EditableListSection`), note people to talk to and questions to get answered first, then record the final choice and reasoning once ready. Printable. Account-free, `localStorage` only.

## [0.8.1] - 2026-08-05
### Added
- **"How to use this tool"** instructions on every tool page: a collapsible, numbered step-by-step block (new `HowToUse.tsx`, defaults open), tailored to each tool's actual workflow. Placed right after the intro text, before the disclaimer/Allied Health banners.

## [0.8.0] - 2026-08-05
### Added
- **Tool 11 — Support Plan** (`src/app/tools/support-plan/`): a one-page, person-centred plan — About me (free text), My goals, My supports, Health & safety info, How to communicate with me, and Emergency contacts. All list sections reuse the shared `EditableListSection` (dictation, suggestion chips). Printable. Same account-free **preview mode** treatment as the other participant-linked tools.
- **Read this page aloud** (`ReadPageAloudButton.tsx`): a header button, next to Accessibility settings, that reads the current page's main content out loud via the Web Speech API, with a Stop toggle. `useSpeech()` now exposes `speaking` state and a `stop()` function (previously speak-only, fire-and-forget).

### Changed
- "Display settings" header button renamed to "Accessibility settings" — clearer about what it actually controls, especially now that it holds seven different accessibility toggles plus the timezone picker.

## [0.7.0] - 2026-08-05
### Added
- **Tool 10 — Meal Planner & Shopping List** (`src/app/tools/meal-planner/`): three tabs.
  - **Recipes**: build recipes with a name, picture, freeform ingredient list (dictation supported, reuses `EditableListSection`), and optional instructions.
  - **This week**: assign one recipe per day to a 7-day grid. Selecting a meal writes a matching entry into the existing Weekly Schedule tool's storage (`useWeeklySchedule`) so it shows up there too, and removes/replaces that entry if the meal changes — `addItem` in `weekly-schedule-storage.ts` now returns the new item's id so it can be tracked for later removal.
  - **Shopping list**: auto-derived from the week's planned recipes' ingredients. Exact-match lines (e.g. the same recipe planned twice) are shown once with a `× 2` count rather than duplicated; non-matching lines are listed as-is (no risky quantity/unit merging across different recipes). Checkboxes persist independently of the derived list (keyed by ingredient text) so ticking survives regenerating the list; supports adding extra non-recipe items; printable.
  - Account-free, `localStorage` only.
- Dundaloo hero illustration on the homepage (`public/dundaloo-hero.jpg`), below the intro text.

## [0.6.0] - 2026-08-05
### Added
- **Dundaloo branding**: real logo (`public/dundaloo-logo.svg`) in the header, replacing the generic icon+"Toolkit" mark. Site-wide colour tokens (`--background`, `--brand`, `--accent`, plus `manifest.json`/`layout.tsx` theme colours) now use Dundaloo's actual brand palette (purple/pink/navy, extracted from the logo) instead of the placeholder teal/amber — a coloured lavender-tinted background instead of plain white/grey. Category (`--cat-*`), emotion (`--emo-*`) and severity (`--sev-*`) tokens are untouched — those encode function (AAC colour-coding, status), not brand identity.
- **Allied Health callout** (`AlliedHealthCallout.tsx`) on every tool page: mentions Dundaloo's Occupational Therapy, Speech Pathology and Psychology/Counselling services, linking to dundaloo.org.au.
- **Tool 8 — Emotional Regulation Plan** (`src/app/tools/emotional-regulation-plan/`): a personal plan — warning signs, what helps, what makes it worse, support people, and an urgent-help section with crisis contacts. Same account-free **preview mode** treatment as Social Story/Behaviour Tracking. Built on a new reusable `EditableListSection` component (moved to `src/components/` since Traffic Light Check-In uses it too).
- **Tool 9 — Traffic Light Check-In** (`src/app/tools/traffic-light-checkin/`): tap green/amber/red, get a suggested strategy, optionally log a note — plus an editable "what each zone looks like for you" guide (personal behavioural indicators per colour, shown inline when that colour is selected during a check-in). Account-free, reuses the severity status ramp (`--sev-1/3/5`) for colours.
- **Weekly spending plan** in the Budget Tracker: set how much money you have to spend each week, plan items against it with a running "planned vs remaining" total, separate from the actual income/expense log.
- **Homepage tool directory**: grid/list view toggle, a search box (name/description/category), and category filter chips — extracted into a new client component (`ToolDirectory.tsx`) so the hero stays server-rendered. Each tool card/row now shows a category badge.

### Changed
- Homepage headline: "Practical tools for disability support, built to actually get used." → "Everyday tools that help you live more independently, your way." — more personal, independence-focused.
- Removed "no sign-up" language site-wide (hero tagline, meta descriptions, README, manifest) — some tools will require an account in production, so the blanket claim no longer holds. The per-tool "no account needed" copy stays, since those specific claims remain accurate.

## [0.5.0] - 2026-08-05
### Added
- **Tool 4 — Social Story Creator** (`src/app/tools/social-story/`): build multi-page illustrated stories (picture + text per page, dictation supported), reorder pages, then present them full-screen page-by-page with read-aloud and print. Multiple stories, list/edit/present views. **Preview mode**: normally an account-gated tool (persists per participant), running here on `localStorage` only with an in-page banner explaining that — not yet wired to the accounts system.
- **Tool 5 — Behaviour Tracking Tool** (`src/app/tools/behaviour-tracking/`): quick ABC (antecedent-behaviour-consequence) logging with suggestion chips and dictation, a severity scale (1-5, new `--sev-*` status colours in `globals.css`), a timezone-aware "when did this happen" field, and two hand-rolled responsive charts — a severity-over-time bar chart (SVG) and a most-common-behaviours frequency chart (flexbox bars, no chart library added). Same **preview mode** treatment as Social Story Creator.
- **Tool 6 — Weekly Schedule** (`src/app/tools/weekly-schedule/`): a 7-day version of the Visual Schedule Builder — pictures per day via a shared `ActivityPickerDialog`, tick off, print, reset/clear. Account-free.
- **Tool 7 — Budget Tracker** (`src/app/tools/budget-tracker/`): log income/expense transactions with category and date, income/expenses/balance stat tiles, a spending-by-category chart, and a transaction list. Amounts formatted as AUD. Account-free.
- **Project-wide timezone setting**, defaulting to `Australia/Sydney`: new `TimezoneProvider`/`useTimezone` (`src/lib/timezone-context.tsx`) alongside the existing accessibility settings, with a picker for other AU/NZ/UTC zones added to the header's "Display settings" panel. New `src/lib/datetime.ts` formats stored UTC-ISO timestamps for display in the selected zone (storage itself stays UTC — only display changes). Emotion Tracker's history and the new Behaviour Tracking Tool use it for display; the Budget Tracker uses it to default the date field to "today" in the selected zone.
- **Four new accessibility options**, since this whole project is a disability-support tool: reduce motion (explicit override beyond the OS-level `prefers-reduced-motion`), underline links, easy-read spacing (line/letter/word spacing), and larger touch targets (bumps the `--touch-target-min` CSS var site-wide from one place). Added to `accessibility-context.tsx` + `globals.css` + the "Display settings" panel, which now uses a shared `ToggleRow` component instead of six copies of the same switch markup.
- `/support` page + a footer link: explains why donations matter. Ships with a clearly-marked **placeholder** donate button (`DONATION_URL = null` + a `TODO(payment-setup)` comment) — no real payment destination has been set up yet.

### Changed
- Homepage tool cards: the "Will need a free account" note now only shows for `status: "soon"` tools; the four account-gated-but-currently-live tools instead show "Preview: saved on this device only for now", matching their in-page banners.

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

