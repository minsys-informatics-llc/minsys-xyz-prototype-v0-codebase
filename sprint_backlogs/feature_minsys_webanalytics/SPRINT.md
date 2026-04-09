# Sprint: Minsys Web Analytics — GA4 Instrumentation & Reporting

**Branch:** `feature/ga4-instrumentation`
**Worktree:** `/workspace/.worktrees/feature-ga4-instrumentation`
**Plan (source of truth):** `./planning/Plan — GA4 Instrumentation & Reporting.md`
**Enabler brief:** `./planning/Enabler - Integrate GA4 events.md`
**PR:** [#6 — feat: GA4 instrumentation — full event tracking across landing & talent pages](https://github.com/minsys-informatics-llc/minsys-xyz-prototype-v0-codebase/pull/6)
**Product Owner:** Laurent (Minsys)
**Developer:** Claude (acting on behalf of Laurent)
**Merged:** 2026-04-08

---

## 1. Sprint Goal

Ship **full GA4 event instrumentation** across the Minsys website — landing page and talent page — so that Laurent can measure user engagement, content consumption, and talent pipeline interest with precision. The analytics pipeline must flow end-to-end from browser interaction to GA4 DebugView and Realtime reports, with no PII transmitted, and the GA Measurement ID externalised as a Vercel environment variable.

---

## 2. Sprint Objectives

1. Move `G-0Y2RRCTB7J` out of hardcoded `index.html` and into a Vite build-time env var `VITE_GA_MEASUREMENT_ID`.
2. Rewrite `src/analytics.ts` with typed `trackEvent()` and `trackPageView()` helpers; route all existing `section_view` through the new helper.
3. Wire `trackPageView()` into `src/Router.tsx` so SPA navigations between `/` and `/talent` generate a `page_view` event.
4. Instrument the full landing page (`src/App.tsx`): `nav_click` on all header/footer links, `tab_select` + `generate_lead` on model and organization tabs, `carousel_scroll` on capabilities arrows, `cta_click` + `generate_lead` on all CTAs.
5. Instrument the full talent page (`src/TalentPage.tsx`): `nav_click` on all links, `cta_click` + `generate_lead` on hero and header CTAs, `role_interest` + `generate_lead` on accordion opens, `tab_select` + `generate_lead` on pillar tabs, and the full form lifecycle (`form_start`, `form_submit`, `form_error`, `generate_prospect`) for both `role_apply` and `general_apply`.
6. Fix all infrastructure blockers discovered during UAT (Vercel env var, CSP `connect-src`).
7. Validate all 12 events in GA4 DebugView before merging to `main`.

---

## 3. Out of Scope

- Consent Mode v2 / cookie banner — Laurent confirmed leave-as-is (ENABLER-7 dropped at planning).
- PII transmission to GA4 — explicitly prohibited; no name, email, LinkedIn URL, or free-text sent.
- Looker Studio dashboard build (ENABLER-6) — planned as follow-up sprint.
- GA4 admin setup (custom dimensions, Key Events, internal traffic filter) — deferred post-merge per §11.5–11.6 of the plan; code is ready but admin steps require production events to have fired.

---

## 4. Definition of Done

- `npm run build` and `npm run lint` (tsc --noEmit) both pass clean.
- `VITE_GA_MEASUREMENT_ID=G-0Y2RRCTB7J` set in Vercel for both Production and Preview environments.
- Built `index.html` contains `G-0Y2RRCTB7J` (not the literal `%VITE_GA_MEASUREMENT_ID%` placeholder).
- All 12 events in the taxonomy (§3 of Plan) visible in GA4 DebugView with correct parameter values and no `(not set)`.
- `generate_lead` fires only on `cta_click`, `role_interest`, `tab_select` — not on `nav_click`.
- `generate_prospect` fires only on successful form submission.
- SPA navigation between `/` and `/talent` produces a second `page_view` event.
- No CSP violations in the browser console.
- Sprint markdown saved with implementation notes and UAT sign-off.

---

## 5. Event Taxonomy

| # | Event name | Trigger | Key Event? |
|---|---|---|---|
| 1 | `page_view` | GA4 automatic + SPA route change | — |
| 2 | `section_view` | IntersectionObserver (50% threshold) on `<section id="...">` | — |
| 3 | `nav_click` | Any header / footer link | — |
| 4 | `tab_select` | Tab switch (model / organization / talent pillar) | — |
| 5 | `carousel_scroll` | Capabilities carousel prev/next arrows | — |
| 6 | `cta_click` | Primary CTA buttons across both pages | — |
| 7 | `role_interest` | "Apply for Role" accordion opened on Talent page | — |
| 8 | `form_start` | First focus on any form field | — |
| 9 | `form_submit` | Web3Forms POST success | — |
| 10 | `form_error` | Web3Forms POST failure | — |
| 11 | `generate_lead` | Fired alongside `cta_click`, `role_interest`, `tab_select` | ✅ |
| 12 | `generate_prospect` | Fired alongside successful `form_submit` | ✅ |

---

## 6. User Stories

> Derived from ENABLER-1 through ENABLER-5 in the plan. Each story follows the INVEST model.

---

### ENABLER-1 — Analytics foundation: env var, helpers, SPA page_view

**As** the site owner,
**I want** the GA Measurement ID externalised to a Vercel env var and a single typed `trackEvent()` helper,
**so that** the ID is not hardcoded in source, all tracking goes through one place, and SPA navigations are captured.

**Acceptance Criteria**
- [ ] `VITE_GA_MEASUREMENT_ID` replaces the hardcoded ID in `index.html`.
- [ ] `src/analytics.ts` exports `trackEvent(name, params)`, `trackPageView(path)`, `initAnalytics()`.
- [ ] `trackEvent` is a no-op when `window.gtag` is unavailable (local dev without `.env.local`).
- [ ] `trackEvent` automatically injects a `page` param (`landing` | `talent`) based on `window.location.pathname`.
- [ ] `src/Router.tsx` calls `trackPageView()` on every `pushState` and `popstate` so SPA navigations produce a `page_view` event.
- [ ] Existing `section_view` behaviour is preserved, routed through the new `trackEvent()`.
- [ ] `.env.example` documents `VITE_GA_MEASUREMENT_ID`.

---

### ENABLER-2 — Landing page instrumentation (`src/App.tsx`)

**As** the site owner,
**I want** every interactive element on the landing page tracked,
**so that** I can measure which sections, tabs, and CTAs attract user attention.

**Acceptance Criteria**
- [ ] All header nav links fire `nav_click` with `link_text`, `link_url`, `link_location=header`.
- [ ] All footer nav links fire `nav_click` with `link_location=footer`.
- [ ] The 3 model tabs fire `tab_select` (tab_group=model) + `generate_lead` on click.
- [ ] The 4 organization tabs fire `tab_select` (tab_group=organization) + `generate_lead` on click.
- [ ] Capabilities carousel arrows fire `carousel_scroll` with `direction=prev|next`.
- [ ] All CTA buttons ("Partner with Us" header, "Contact Deal Desk", "Partner with Us" body, "Express your Interest") fire `cta_click` + `generate_lead` with a stable `cta_id`.

---

### ENABLER-3 — Talent page instrumentation (`src/TalentPage.tsx`)

**As** the site owner,
**I want** to know which roles generate the most interest and which CTA on the talent page performs best,
**so that** I can prioritise hiring outreach.

**Acceptance Criteria**
- [ ] All header nav links fire `nav_click`.
- [ ] Header "Join Minsys" CTA fires `cta_click` + `generate_lead` (`cta_id=header_join`).
- [ ] Hero "Open Positions" button fires `cta_click` + `generate_lead` (`cta_id=hero_open_positions`).
- [ ] Hero "General Application" button fires `cta_click` + `generate_lead` (`cta_id=hero_general_application`).
- [ ] Each "Apply for Role" accordion open fires `role_interest` + `generate_lead` with `role_id` and `role_title`.
- [ ] The 4 pillar tabs fire `tab_select` (tab_group=talent_pillar) + `generate_lead`.
- [ ] All footer links fire `nav_click`.

---

### ENABLER-4 — Form lifecycle events (both forms)

**As** the site owner,
**I want** to track the full funnel from form open to submission outcome,
**so that** I can compute the Lead → Prospect conversion rate and detect abandonment.

**Acceptance Criteria**
- [ ] First focus on any field in `role_apply` or `general_apply` fires `form_start` with `form_id` (and `role_id` for role forms).
- [ ] Successful Web3Forms submission fires `form_submit` + `generate_prospect` with `form_id` (and `role_id` / `pillar` as appropriate).
- [ ] Failed submission fires `form_error` with `form_id` and `error_type`.
- [ ] No PII (name, email, LinkedIn URL, free text) in any event parameter.

---

### ENABLER-5 — Infrastructure: env var & CSP

**As** the developer,
**I want** the Vercel build environment and CSP policy correctly configured,
**so that** GA4 events are actually transmitted to Google's servers in production and preview.

**Acceptance Criteria**
- [ ] `VITE_GA_MEASUREMENT_ID=G-0Y2RRCTB7J` set in Vercel → Production and Preview environments.
- [ ] Vercel build substitutes the real ID; built `index.html` contains `G-0Y2RRCTB7J` (not the placeholder).
- [ ] `vercel.json` CSP `connect-src` includes `https://www.googletagmanager.com` (GA4 collection endpoint).
- [ ] No `Refused to connect` CSP violation in the browser console.
- [ ] All 12 events visible in GA4 DebugView on the preview deployment.

---

## 7. Implementation Log

> Records what was built, decisions made, and how each story was verified.

---

### ENABLER-1 — Analytics foundation — ✅ DONE

**Commits:** `d1cb4c0`
**Files:** `index.html`, `src/analytics.ts`, `src/Router.tsx`, `.env.example`

- `index.html` GA snippet updated to `%VITE_GA_MEASUREMENT_ID%` (Vite build-time token). The async `<script src="…gtag/js?id=…">` and the inline `gtag('config', …)` both use the token so Vite substitutes both at build time.
- `src/analytics.ts` rewritten: exported `trackEvent(name, params)` calls `window.gtag('event', name, { page: currentPage(), ...params })`. Guard `typeof window.gtag !== 'function'` makes it a no-op in local dev without the env var set. `trackPageView(path)` calls `window.gtag('event', 'page_view', { page_path, page_title, page_location })`. `initAnalytics()` retained with IntersectionObserver for `section_view`, now routed through `trackEvent()`.
- `src/Router.tsx` extended: `trackPageView(window.location.pathname)` called inside the `pushState` wrapper and the `popstate` listener, so navigating between `/` and `/talent` generates the expected second `page_view` event.
- `.env.example` documents `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` so future developers know the required env var.
- **Verification:** built HTML on preview deployment showed correct `G-0Y2RRCTB7J` substitution (confirmed by fetching live HTML via Vercel MCP); `trackPageView` confirmed by GA4 DebugView during UAT.

---

### ENABLER-2 — Landing page instrumentation — ✅ DONE

**Commits:** `d1cb4c0`
**Files:** `src/App.tsx` (+43 lines net, 121 total changes including ENABLER-3/4)

- `nav_click` added to all 4 header nav anchors and both footer anchors via inline `onClick` handlers.
- `tab_select` + `generate_lead` fired inside the `onClick` of the Model tab `.map()` (3 tabs: `platform_acquisition`, `venture_bootstrapping`, `multiple_expansion`) and the Organization tab `.map()` (4 tabs: `ma_deal_desk`, `the_nexus`, `venture_studio`, `mvp_factory`).
- `carousel_scroll` fired in the existing `scrollCarousel(direction)` function — single change covers both prev and next buttons.
- `handleContactClick(e, cta_id)` handler fires `cta_click` + `generate_lead` before delegating to `mailto:`. All 3 body CTAs and the header "Partner with Us" use this pattern.
- **Verification:** GA4 DebugView showed all landing page events during UAT (nav_click, tab_select, cta_click, generate_lead, carousel_scroll).

---

### ENABLER-3 — Talent page instrumentation — ✅ DONE

**Commits:** `d1cb4c0`
**Files:** `src/TalentPage.tsx` (+50 lines net)

- Header nav links: `nav_click` added to all 4 anchors (`Model`, `Organization`, `Capabilities`, `/#getintouch`) via inline `onClick`.
- Header "Join Minsys" CTA: `cta_click` + `generate_lead` (`cta_id=header_join`).
- Hero CTAs: `cta_click` + `generate_lead` on "Open Positions" (`cta_id=hero_open_positions`) and "General Application" (`cta_id=hero_general_application`).
- Role accordion toggle: `role_interest` + `generate_lead` fires on open (not on close) — guarded by `!openRole` check.
- Pillar tab clicks: `tab_select` (tab_group=`talent_pillar`) + `generate_lead` on each of the 4 pillar tabs.
- Footer nav links: `nav_click` with `link_location=footer`.
- **Verification:** GA4 DebugView confirmed role_interest and tab_select events with correct role_id and tab_id parameters during UAT.

---

### ENABLER-4 — Form lifecycle events — ✅ DONE

**Commits:** `d1cb4c0`
**Files:** `src/TalentPage.tsx`

- `form_start`: fired on `onFocus` of the first field in both `role_apply` and `general_apply` forms, gated by a `hasStarted` ref to prevent re-firing.
- `form_submit` + `generate_prospect`: fired in the `.then()` success branch of the Web3Forms `fetch` call, after `data.success === true` is confirmed. Role forms include `role_id`; general form includes `pillar`.
- `form_error`: fired in the `.catch()` and in the `data.success === false` branch with `error_type`.
- Zero PII: confirmed — only `form_id`, `role_id`, and `pillar` are sent; no name, email, LinkedIn, or free text.
- **Verification:** form_submit and generate_prospect confirmed visible in GA4 DebugView during UAT.

---

### ENABLER-5 — Infrastructure: env var & CSP — ✅ DONE (with UAT findings)

**Commits:** `3a8e863` (rebuild trigger), `a6f07d9` (CSP fix)
**Files:** `vercel.json`, Vercel Project Settings (external)

**Issue 1 — Missing `VITE_GA_MEASUREMENT_ID` env var in Vercel**
- **Root cause:** The env var was never added to Vercel Project Settings. Vite's `%VITE_GA_MEASUREMENT_ID%` token in `index.html` is only substituted at build time — the built preview HTML still contained the literal placeholder string, meaning `gtag.js` was loaded with an invalid ID and `gtag('config', ...)` configured a non-existent property.
- **Discovered via:** Fetching the live preview HTML via Vercel MCP — confirmed `%VITE_GA_MEASUREMENT_ID%` was still present in the built output.
- **Fix:** Laurent added `VITE_GA_MEASUREMENT_ID=G-0Y2RRCTB7J` in Vercel Dashboard → Project Settings → Environment Variables for both Production and Preview. An empty commit was pushed to `feature/ga4-instrumentation` to trigger a fresh Vercel build. The rebuilt HTML confirmed correct substitution.

**Issue 2 — CSP blocking GA4 event collection**
- **Root cause:** `vercel.json` `connect-src` whitelisted `https://www.google-analytics.com` and `https://region1.google-analytics.com` (legacy GA3 endpoints) but omitted `https://www.googletagmanager.com`, which is the actual endpoint GA4 uses for event collection (`/g/collect`). The browser silently blocked all outbound `collect` POST requests with a CSP violation.
- **Discovered via:** Manual `window.gtag('event', 'test')` call in DevTools Console + Network tab showed zero `collect` requests; Console showed no CSP violation message but the request was dropped before it could be made because `window.gtag` was still the dataLayer stub (not yet replaced by a blocked script).
- **Fix:** Added `https://www.googletagmanager.com` to `connect-src` in `vercel.json`. Committed as `fix(csp): add www.googletagmanager.com to connect-src for GA4 event collection`.

**Issue 3 — uBlock Origin interference (testing artifact only)**
- **Root cause:** During UAT, Laurent's browser had the uBlock Origin extension active. uBlock intercepts requests to `googletagmanager.com` and injects a no-op stub replacement — meaning `window.gtag` appeared as a valid function but never actually sent requests.
- **Impact:** Production users without ad blockers are unaffected. This was a local testing artifact.
- **Resolution:** Disabled uBlock Origin for the preview domain during UAT validation.
- **Verification post-fix:** GA4 DebugView showed all 12 events flowing in real time with correct parameters. Confirmed also flowing in Production post-merge.

---

## 8. Files Touched

| Status | File | Purpose |
|---|---|---|
| **modified** | `index.html` | Replaced hardcoded `G-0Y2RRCTB7J` with `%VITE_GA_MEASUREMENT_ID%` Vite token in both gtag script src and inline config |
| **modified** | `src/analytics.ts` | Full rewrite: typed `trackEvent()` + `trackPageView()` helpers; `initAnalytics()` with section_view observer |
| **modified** | `src/Router.tsx` | Added `trackPageView()` on pushState + popstate for SPA navigation tracking |
| **modified** | `src/App.tsx` | Wired `nav_click`, `tab_select`, `generate_lead`, `cta_click`, `carousel_scroll` on ~10 elements |
| **modified** | `src/TalentPage.tsx` | Wired `nav_click`, `cta_click`, `role_interest`, `tab_select`, `form_start`, `form_submit`, `form_error`, `generate_lead`, `generate_prospect` on ~15 elements + both form lifecycles |
| **modified** | `vercel.json` | CSP `connect-src` += `https://www.googletagmanager.com` |
| **new** | `.env.example` | Documents `VITE_GA_MEASUREMENT_ID` for local dev setup |
| **new** | `sprint_backlogs/feature_minsys_webanalytics/SPRINT.md` | This document |

**External change (Vercel Dashboard):**
- `VITE_GA_MEASUREMENT_ID=G-0Y2RRCTB7J` added to Vercel Project Settings → Environment Variables (Production + Preview)

---

## 9. UAT Sign-Off

**Date:** 2026-04-08
**Tester:** Laurent (Minsys)
**Preview deployment:** `minsys-e4rswiil4-minsys-cloud.vercel.app`
**Result:** ✅ **PASS**

**Confirmed:**
- [x] Built `index.html` contains `G-0Y2RRCTB7J` (no `%VITE_GA_MEASUREMENT_ID%` placeholder)
- [x] GA4 DebugView shows `Debug Device` with live event stream
- [x] All 12 events firing with correct parameters (no `(not set)` values)
- [x] `generate_lead` fires on tab_select, cta_click, role_interest — not on nav_click
- [x] `generate_prospect` fires only on successful form submission
- [x] SPA navigation `/` → `/talent` produces a second `page_view`
- [x] No CSP violations in browser console
- [x] Events confirmed flowing in Production (`minsys.xyz`) post-merge

**Ready for merge to `main`.**

---

## 10. Post-Sprint Hotfix — Web3Forms Access Key (PR #7)

**Date:** 2026-04-08
**Branch:** `fix/web3forms-access-key` → merged to `main`
**PR:** [minsys-informatics-llc/minsys-xyz-prototype-v0-codebase#7](https://github.com/minsys-informatics-llc/minsys-xyz-prototype-v0-codebase/pull/7)

### Problem
After the GA4 sprint merged, all talent form submissions (Role Applications + General Interest) returned:
> "Invalid form_id/access_key format. Must be a valid UUID — please retry or email talent@minsys.xyz"

### Root Cause
`src/data/talent.ts:12` still held the placeholder `'YOUR_WEB3FORMS_ACCESS_KEY'` — no Web3Forms account had been created yet at the time the Talent Acquisition Engine was shipped.

### Fix
Laurent created a Web3Forms account at web3forms.com, named the form **"Minsys Forms"** for domain `minsys.xyz`, and received access key `262745d1-43ba-4b6b-bf8a-63f8d2d8d607`.

File changed:
```
src/data/talent.ts
  W3F_ACCESS_KEY: 'YOUR_WEB3FORMS_ACCESS_KEY'  →  '262745d1-43ba-4b6b-bf8a-63f8d2d8d607'
```

### Notes
- One access key covers **all forms on the domain** (Role Applications for ma/ai/tcm + General Interest). Submissions are differentiated by the `subject` field in the POST payload — no additional Web3Forms entries needed.
- Future forms (e.g. Partnership form on the main landing page) can reuse the same key; the `subject` field distinguishes them in the Web3Forms inbox.

---

## 11. Follow-ups (Out of Sprint)

### GA4 Admin Setup (pending — requires production events to have fired ≥24h)
Refer to Plan §11 for the click-by-click checklist:
- **§11.5** Register 17 event-scoped custom dimensions in GA4 Admin → Custom Definitions (cta_id, tab_group, form_id, role_id, pillar, link_location, page, section_id, lead_source, destination, direction, error_type, and more).
- **§11.6** Mark `generate_lead` and `generate_prospect` as Key Events in GA4 Admin → Events.
- **§11.1** Turn OFF "Form interactions" in Enhanced Measurement (GA4 Admin → Data Streams) to avoid duplicate form events.
- **§11.4** Create internal traffic filter for Laurent's IP and for preview domains (`minsys-xyz-git-.*\.vercel\.app`).
- **§11.2** Set data retention to 14 months.

### Reporting (ENABLER-6 — future sprint)
- Build Looker Studio "Minsys Engagement Overview" dashboard per Plan §7.1 (Executive / Content Interest / Talent Funnel / Navigation / Acquisition tabs).
- Build GA4 Explorations: Talent Funnel, Path Exploration, CTA Performance free-form (per Plan §11.9).
- Build Audience segments: Leads, Prospects, Talent-curious, Partner-curious (per Plan §11.8).

### Day-1 / Week-1 Post-Launch Monitoring
- **Day 1:** DebugView sanity check — confirm all 12 events arriving with no `(not set)` parameters.
- **Day 2:** Realtime report shows all 12 event names.
- **Day 3:** Custom dimensions show real values in Explorations (after 24h processing).
- **Day 7:** First weekly review — lead/prospect volumes plausible? Any event over-firing (double-bound handler)?
- **Day 14:** Tune — drop always-empty dimensions; add any parameter Laurent requests.
