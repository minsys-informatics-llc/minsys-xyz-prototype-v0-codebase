# Sprint: Minsys Talent Acquisition Engine

**Branch:** `feature/talent-acquisition-engine`
**Worktree:** `/home/node/worktrees/talent-acquisition-engine`
**PRD:** `./planning/Feature - Minsys Talent Acquisition Engine.md`
**Mockup (source of truth):** `./planning/talent-page-mockup.html`
**Product Owner:** Claude (acting on behalf of Laurent)
**Developer:** Claude

---

## 1. Sprint Goal

Ship the **Minsys Talent Acquisition Engine** — a dedicated `/talent` page plus a homepage entry point — that lets elite candidates either apply to one of three open positions (M&A Deal Desk Lead, Agentic AI Engineer, Digital & AI Change Manager) or submit a General Application aligned to one of the four Minsys pillars. Submissions must reach `talent@minsys.xyz` with **zero backend** via Web3Forms, and the page must be discoverable by AI crawlers (`llms.txt`, `JobPosting` JSON-LD, `<noscript>` JD blocks).

## 2. Sprint Objectives

1. Add a routable `/talent` page to the existing Vite + React SPA without introducing heavy router dependencies.
2. Faithfully port the visual mockup into idiomatic React + Tailwind components, reusing the existing `solarAmber` / `darkGraphite` / `lightGray` design tokens.
3. Wire all four forms (3 role-specific + 1 general) to Web3Forms via native `fetch`, with inline success state.
4. Add a 3rd "Join Minsys" card to the homepage CTA section linking to `/talent`.
5. Make the new content AI- and SEO-discoverable: update `llms.txt` / `llms-full.txt`, embed `JobPosting` JSON-LD, ship `<noscript>` JDs, add `/talent` to `sitemap.xml`.
6. Update CSP (`vercel.json`) to allow `api.web3forms.com` in `connect-src`, and add an SPA rewrite so `/talent` resolves to `index.html` on Vercel.
7. Add lightweight tests covering data integrity, form payload assembly, and routing.

## 3. Out of Scope

- Real Web3Forms access key (the constant remains a placeholder; Laurent will provision).
- Replacing the JD placeholders with real job descriptions.
- A full client-side router library (react-router) — we use a minimal pathname-based switch.
- Backend, ATS integration, candidate database.

## 4. Definition of Done

- `npm run build` and `npm run lint` (tsc --noEmit) both pass clean.
- Visiting `/` shows the new "Join Minsys" CTA card; clicking it lands on `/talent`.
- `/talent` renders hero, 3 open-position cards (each with working accordion form), pillar tabs, and general form — visually matching the mockup.
- All four forms POST to `https://api.web3forms.com/submit` and toggle to the "Application received" state on success.
- `JobPosting` JSON-LD validates as well-formed JSON for each of the 3 roles.
- `llms.txt` mentions the three open roles with one-line summaries.
- Tests in `tests/talent/` pass.
- Sprint markdown updated with implementation notes per user story.

---

## 5. User Stories (INVEST + Acceptance Criteria)

> Each story is **I**ndependent, **N**egotiable, **V**aluable, **E**stimable, **S**mall, **T**estable.

---

### US-1 — Homepage "Join Minsys" entry point

**As** a visitor browsing the Minsys homepage,
**I want** to see a clear "Join Minsys" call-to-action alongside the existing partner CTAs,
**so that** I can discover that Minsys is hiring and navigate to the talent page.

**Acceptance Criteria**
- [ ] The `#getintouch` section on `/` displays a 3rd card titled **"Join Minsys"** in the existing CTA grid (responsive: 3-col desktop, stacked mobile).
- [ ] Card body reads: *"We are seeking elite M&A specialists, Agentic AI Engineer, and Change Managers to help us rewire Main Street."*
- [ ] Card CTA button is labelled **"Express your Interest"** and links to `/talent`.
- [ ] Card uses the existing `solarAmber` / `darkGraphite` palette and matches the visual weight of the existing two cards.
- [ ] Lighthouse a11y check: button has accessible name, link is keyboard-reachable.

---

### US-2 — `/talent` route resolves and renders

**As** a candidate following a link to `minsys.xyz/talent`,
**I want** the talent page to load directly (deep link, refresh, share),
**so that** I never see a 404 and can share the URL.

**Acceptance Criteria**
- [ ] Navigating to `/talent` in the browser renders the Talent page (not the homepage).
- [ ] Browser back/forward buttons work between `/` and `/talent`.
- [ ] On Vercel, a hard refresh of `/talent` returns `index.html` (SPA rewrite in `vercel.json`).
- [ ] Document `<title>` updates to **"Minsys | Talent — Join the Venture Engine"** when on `/talent`.
- [ ] No new heavy router dependency added (≤ 0 KB to bundle from third-party routers).

---

### US-3 — Talent page hero & sticky header

**As** a candidate landing on `/talent`,
**I want** an emotionally resonant hero stating Minsys's "Human Ingenuity is our North Star" thesis with two clear next-step CTAs,
**so that** I immediately understand the value proposition and where to go next.

**Acceptance Criteria**
- [ ] Sticky header reuses the same dark `bg-darkGraphite` style as the homepage, with nav links to `/#model`, `/#organization`, `/#capabilities`, and a highlighted "Join Minsys" CTA pointing to `#open-positions`.
- [ ] Hero has dark background, backdrop-blur center card, and the headline *"Ultimately, Human Ingenuity **is our North Star**"* with the italic span in `solarAmber`.
- [ ] Subheader copy explicitly mentions *"augmented and elevated, never automated away"*.
- [ ] Two centered CTAs: **"Open Positions"** (amber) → `#open-positions`, **"General Application"** (outline) → `#general-application`.

---

### US-4 — Open Positions: 3 role cards

**As** a candidate scanning the open positions,
**I want** to see each of the 3 strategic roles as a distinct card with its summary, key skills, and an "Apply for Role" button,
**so that** I can identify the role that fits me.

**Acceptance Criteria**
- [ ] 3 cards rendered in this order: M&A Deal Desk Lead, Agentic AI Engineer, Digital & AI Change Manager.
- [ ] Each card uses the 2/3 text + 1/3 image desktop layout from the mockup.
- [ ] Each card shows: pillar tag (amber pill), title, description paragraph, 4 italic skill bullets, and an amber "Apply for Role" button.
- [ ] Card data (title, pillar, description, skills, image) is sourced from a typed `roles` array in `src/data/talent.ts` — no duplication across the JSX.
- [ ] On hover, card border transitions to `solarAmber/30` (matching mockup).

---

### US-5 — Inline accordion application form

**As** a candidate ready to apply,
**I want** to click "Apply for Role" and have the application form expand inline beneath the card,
**so that** I never lose context of which role I'm applying to.

**Acceptance Criteria**
- [ ] Clicking "Apply for Role" expands the inline form via a smooth grid-row transition (matches mockup CSS).
- [ ] Opening one form auto-closes any other currently open form (single-open invariant).
- [ ] Button label toggles **"Apply for Role" ↔ "Close Form"**, and the chevron icon rotates 90°.
- [ ] Form contains: Full Name, LinkedIn (required), Portfolio (optional), Q1 textarea, Q2 textarea.
- [ ] A "JD Placeholder" dashed-border block sits above the form fields.
- [ ] Both textareas track word count (`X / 500 words`), turn amber at ≥450 words, and hard-cap at 500 words.

---

### US-6 — Web3Forms submission + success state

**As** a candidate who has filled out the application,
**I want** to submit and see immediate confirmation,
**so that** I trust my application was received.

**Acceptance Criteria**
- [ ] Submit button POSTs JSON to `https://api.web3forms.com/submit` with: `access_key`, `subject`, `from_name`, `message` (the formatted body including role title, name, LinkedIn, portfolio, Q1, Q2).
- [ ] Submit button shows **"Sending…"** and is disabled while the request is in flight.
- [ ] On success (`data.success === true`), the form is replaced inline by a success block: amber check icon + *"Application received."* + reassurance copy.
- [ ] On failure, an alert with the error is shown and the button is re-enabled.
- [ ] The Web3Forms access key is sourced from a single constant `W3F_ACCESS_KEY` (placeholder, documented).
- [ ] Vercel CSP `connect-src` includes `https://api.web3forms.com` so the request is not blocked in production.

---

### US-7 — General Application: Pillar Tabs Explorer + form

**As** a high-agency candidate who doesn't fit a specific role,
**I want** to browse the four Minsys pillars and submit a general application tagged to one of them,
**so that** I can be indexed for future opportunities.

**Acceptance Criteria**
- [ ] 4 tabs render in order: M&A Deal Desk, The Nexus, Venture Studio, The MVP Factory.
- [ ] Active tab has `solarAmber` underline; clicking another tab fades in its panel.
- [ ] Each panel shows: amber pill, pillar title, descriptive paragraph, "Example Roles" header + 4 italic role bullets, and a thematic image (1/3 column on desktop).
- [ ] Pillar data is sourced from a typed `pillars` array in `src/data/talent.ts`.
- [ ] General form fields: Full Name, LinkedIn (required), Portfolio (optional), Pillar select (required, 4 options).
- [ ] Submission posts to Web3Forms with subject `[Minsys Talent] General Interest — {name}` and toggles to the success state on success.

---

### US-8 — AI/SEO indexing for the new roles

**As** an AI recruiter (ClaudeBot, GPTBot) or a search engine,
**I want** structured, machine-readable summaries of each open role,
**so that** I can recommend Minsys roles to relevant candidates.

**Acceptance Criteria**
- [ ] `public/llms.txt` gains a `## Open Positions (Talent Engine)` section with one-line summaries of the 3 roles.
- [ ] `public/llms-full.txt` gains an expanded section with the full description and skill bullets per role.
- [ ] One `JobPosting` JSON-LD `<script type="application/ld+json">` is injected per role on the `/talent` page (3 total), including `title`, `description`, `hiringOrganization`, `datePosted`, `employmentType`, `jobLocationType`.
- [ ] A `<noscript>` block on `/talent` includes the semantic HTML version of all 3 JDs (title, description, skills) so non-JS crawlers see them.
- [ ] `public/sitemap.xml` includes `<url><loc>https://minsys.xyz/talent</loc>…</url>`.

---

### US-9 — Tests & quality gates

**As** the developer maintaining this feature,
**I want** automated checks for the data, payload, and routing logic,
**so that** regressions are caught before merge.

**Acceptance Criteria**
- [ ] `npm run lint` (tsc --noEmit) passes.
- [ ] `npm run build` produces a successful Vite production build.
- [ ] A test script under `tests/talent/` validates: (a) `roles` array has exactly 3 entries with all required fields, (b) `pillars` array has exactly 4 entries, (c) `buildRolePayload` produces a payload with the expected `subject`, `from_name`, and `message` shape, (d) the path-based router resolves `/talent` → Talent page and `/` → Home.
- [ ] Test runner is invocable via `npx tsx tests/talent/run.ts` (no new heavyweight dev dependency).

---

## 6. Implementation Log

> Filled in during the developer phase. Each story records: files touched, key decisions, and how acceptance was verified.

### US-1 — Homepage "Join Minsys" entry point — ✅ DONE
- **Files:** `src/App.tsx`
- Added a 3rd CTA card inside `#getintouch`. Switched the grid from `md:grid-cols-2` to `md:grid-cols-2 lg:grid-cols-3` and widened the container from `max-w-4xl` to `max-w-6xl` so 3 columns breathe on desktop and gracefully reflow to 2-then-1 on tablet/mobile.
- New card: people icon, title "Join Minsys", body matching PRD wording, and an `<a href="/talent">` "Express your Interest" button that the Router intercepts client-side.
- Also added a "Join Minsys" link to the homepage header nav for parity with the talent-page header.
- **Verification:** visual scan + `npm run build` ok; the link is plain `<a>` so it is keyboard-reachable, has an accessible name, and works without JS.

### US-2 — `/talent` route resolves and renders — ✅ DONE
- **Files:** `src/Router.tsx` (new), `src/main.tsx`, `vercel.json`
- Implemented a tiny custom `Router` component (~70 LOC, zero deps) that reads `window.location.pathname`, intercepts same-origin `<a>` clicks, calls `history.pushState`, and listens to `popstate`. Hash-only links and external/mailto links fall through to native browser behavior.
- `getRoute('/talent')` and `getRoute('/talent/')` resolve to `'talent'`, everything else to `'home'` — exported so it is unit-testable.
- `vercel.json` gains a `rewrites` block mapping `/talent` and `/talent/` to `/index.html` so a hard refresh / deep link / shared URL never 404s on Vercel.
- `TalentPage` sets `document.title = 'Minsys | Talent — Join the Venture Engine'` on mount and restores it on unmount.
- **Verification:** test `US-2: getRoute resolves /talent → talent and everything else → home` covers the resolver. Manually traced the click handler against the AC.

### US-3 — Talent page hero & sticky header — ✅ DONE
- **Files:** `src/TalentPage.tsx`
- Sticky header reuses the exact `bg-darkGraphite` styling from `App.tsx` with a logo link back to `/`, the same nav items pointing at `/#model`, `/#organization`, `/#capabilities`, plus a highlighted "Join Minsys" CTA pointing to `#open-positions`.
- Hero is a full-width `bg-darkGraphite` section with backdrop-blur center card, the headline `Ultimately, Human Ingenuity is our North Star` (italic span in `solarAmber`), and the "augmented and elevated, never automated away" subheader.
- Two centered CTAs (`Open Positions` amber, `General Application` outline) anchor to the corresponding sections.
- **Verification:** visual diff against `planning/talent-page-mockup.html` lines 260–319.

### US-4 — Open Positions: 3 role cards — ✅ DONE
- **Files:** `src/data/talent.ts` (new), `src/TalentPage.tsx`
- Defined a typed `Role` interface and exported a `roles` array with the 3 strategic positions (M&A Deal Desk Lead, Agentic AI Engineer, Digital & AI Change Manager). All copy/skills/images are sourced from `src/data/talent.ts` — JSX maps over the array, no duplication.
- The `RoleCard` component renders the 2/3 + 1/3 desktop layout, pillar pill, title, description, italic skill bullets, and an "Apply for Role" button.
- Hover state (`hover:border-solarAmber/30`) matches the mockup.
- **Verification:** test `US-4: roles array contains exactly the 3 strategic open positions` asserts the exact title list, the 4-skill invariant, and that every role has an https image and alt text.

### US-5 — Inline accordion application form — ✅ DONE
- **Files:** `src/TalentPage.tsx`, `src/data/talent.ts`
- Single-open invariant enforced via a single `openRole` state in the parent `TalentPage`, with `toggleRole` collapsing the previous one.
- Accordion uses inline CSS grid `grid-template-rows: 1fr | 0fr` + opacity transition (port of the mockup's `.role-form-wrapper.open`). Button label flips Apply ↔ Close and the chevron rotates 90°. `aria-expanded` / `aria-controls` set for a11y.
- Form fields: Name, LinkedIn (required), Portfolio (optional), Q1 + Q2 textareas. The "JD Placeholder" dashed-border block sits above the fields, mirroring the mockup.
- Word counter logic lives in `countWords` + `clampToWordLimit` (pure functions in `data/talent.ts`). Counter turns `text-solarAmber` at ≥ 450 words and hard-caps at 500.
- **Verification:** test `US-5: countWords + clampToWordLimit enforce the 500-word cap` covers empty, normal, and over-limit input.

### US-6 — Web3Forms submission + success state — ✅ DONE
- **Files:** `src/data/talent.ts`, `src/TalentPage.tsx`, `vercel.json`
- `buildRolePayload(role, app)` is a pure function that returns `{ access_key, subject, from_name, message }`. The `subject` is `[Minsys Talent] New Application — {role.title}`. The `message` body includes role title, name, LinkedIn, portfolio (`Not provided` fallback), Q1, Q2 — exact format ported from the mockup script.
- `RoleCard.submit` POSTs JSON to `https://api.web3forms.com/submit`, parses `data.success`, transitions a state machine `idle → sending → success | error`. Submit button shows "Sending…" + `disabled` while in flight; on success the form swaps to the centered amber-checkmark "Application received." block.
- Error path renders an inline `[role=alert]` message with the underlying error and a "please retry or email talent@minsys.xyz" hint.
- `W3F_ACCESS_KEY` is a single placeholder constant, documented at the top of `src/data/talent.ts`.
- `vercel.json` CSP `connect-src` was extended with `https://api.web3forms.com` so the production POST is not blocked.
- **Verification:** tests `US-6: buildRolePayload assembles a Web3Forms-shaped object…`, `US-6: defaults missing portfolio to "Not provided"`, `US-6: Web3Forms endpoint constant…` cover payload shape, default-values, and endpoint constant.

### US-7 — General Application: Pillar Tabs Explorer + form — ✅ DONE
- **Files:** `src/data/talent.ts`, `src/TalentPage.tsx`
- Defined a typed `Pillar` interface and a 4-element `pillars` array in canonical order: `dealdesk`, `nexus`, `studio`, `factory`. Each pillar has tag, title, description, 4 example roles, image + alt.
- `GeneralApplicationSection` renders the tab strip with `solarAmber` underline on the active tab and fades in the corresponding panel (panels are kept mounted but hidden via `hidden` class to keep state and SEO content present).
- General form: Name, LinkedIn (required), Portfolio (optional), Pillar `<select>` (required, 4 options matching the mockup). Submission goes through `buildGeneralPayload` and the same `idle/sending/success/error` state machine.
- **Verification:** tests `US-7: pillars array contains exactly the 4 Minsys pillars in canonical order` and `US-7: buildGeneralPayload uses generic subject and includes pillar choice`.

### US-8 — AI/SEO indexing for the new roles — ✅ DONE
- **Files:** `public/llms.txt`, `public/llms-full.txt`, `public/sitemap.xml`, `src/TalentPage.tsx`
- `public/llms.txt` gains a new `## Open Positions (Talent Engine)` section with one-line summaries of each role plus a pointer to `https://minsys.xyz/talent` and `talent@minsys.xyz`.
- `public/llms-full.txt` gains a full `## Open Positions — Minsys Talent Acquisition Engine` block with mandate, required competencies, "why this role exists" rationale, and a General Pillar Applications paragraph.
- `public/sitemap.xml` adds `<url><loc>https://minsys.xyz/talent</loc>…</url>` with `priority=0.9`.
- `JobPosting` JSON-LD: `injectJobPostingJsonLd()` runs in `useEffect` and appends one `<script type="application/ld+json" data-talent-jsonld="true">` per role to `document.head`, with `@context`, `@type=JobPosting`, `title`, `description`, `datePosted`, `hiringOrganization`, `jobLocationType=TELECOMMUTE`, `applicantLocationRequirements`, `directApply`, `url`, `industry`, `skills`. Cleanup on unmount removes them. (Note: `application/ld+json` is *data*, not executable script — CSP `script-src` does not block it.)
- A `<noscript>` block on `/talent` renders the semantic HTML version of all 3 JDs (title, pillar/type, description, skills, mailto) so non-JS crawlers see the content.
- **Verification:** manual inspection of the generated payload structure; sitemap XML well-formed; both llms files updated. Will be re-validated against `https://search.google.com/test/rich-results` once deployed.

### US-9 — Tests & quality gates — ✅ DONE
- **Files:** `tests/talent/run.ts` (new)
- 8 tests using **only** built-in `node:test` + `node:assert` (no new dev deps). Run with `npx tsx tests/talent/run.ts`.
- Tests cover: roles array shape (US-4), pillars array shape (US-7), `buildRolePayload` shape + portfolio default (US-6), `buildGeneralPayload` shape (US-7), `countWords` / `clampToWordLimit` 500-word cap (US-5), `getRoute` resolver (US-2), Web3Forms endpoint constant (US-6).
- **Results:**
  - `npm run lint` → ✅ clean (`tsc --noEmit`, no errors)
  - `npx tsx tests/talent/run.ts` → ✅ **8 pass / 0 fail**
  - `npm run build` → ✅ Vite build succeeds in ~1.1s, 40 modules transformed

---

## 7. Files Touched

| Status | File | Purpose |
|---|---|---|
| **new** | `src/data/talent.ts` | Roles + pillars data, payload builders, word-count helpers, Web3Forms config |
| **new** | `src/TalentPage.tsx` | The full `/talent` page (header, hero, role cards, accordion forms, pillar tabs, general form, JSON-LD injector, `<noscript>` block) |
| **new** | `src/Router.tsx` | Minimal pathname-based router with click interception |
| **new** | `tests/talent/run.ts` | Test suite (node:test) |
| **new** | `sprint_backlogs/feature_talent_aquisition_engine/SPRINT.md` | This document |
| modified | `src/main.tsx` | Mount `<Router>` instead of `<App>` directly |
| modified | `src/App.tsx` | Added "Join Minsys" CTA card + nav link |
| modified | `public/llms.txt` | Open Positions section |
| modified | `public/llms-full.txt` | Expanded Open Positions section |
| modified | `public/sitemap.xml` | `/talent` URL entry |
| modified | `vercel.json` | CSP `connect-src` += `api.web3forms.com`; SPA `rewrites` for `/talent` |

## 7.5 UAT Sign-Off

**Date:** 2026-04-07
**Tester:** Laurent's UAT Team
**Result:** ✅ **PASS**

**Confirmed:**
- [x] 3 CTA cards visible on homepage (Capital Partners, M&A Origination Partners, Join Minsys)
- [x] "Express your Interest" button links to `/talent` via Router
- [x] `/talent` page renders: hero, 3 open-position cards, accordion forms, pillar tabs, general application
- [x] Browser navigation (back/forward) between `/` and `/talent` works
- [x] Form UX (word count, accordion open/close, success state) functions as designed
- [x] Visual design matches the mockup

**Ready for merge to `main`.**

---

## 8. Follow-ups (Out of Sprint)

- Provision the real Web3Forms access key and replace `YOUR_WEB3FORMS_ACCESS_KEY` in `src/data/talent.ts`.
- Replace the dashed "JD Placeholder" blocks with the finalized job descriptions from the Hiring Manager.
- Validate live JSON-LD via Google Rich Results test once deployed.
- Consider analytics events (`talent_apply_open`, `talent_apply_submit`, `talent_general_submit`) for the success metrics in PRD §5.
