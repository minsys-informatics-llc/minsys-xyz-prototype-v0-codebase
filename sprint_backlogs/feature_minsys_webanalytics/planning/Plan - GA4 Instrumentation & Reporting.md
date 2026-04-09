# Plan — GA4 Instrumentation & Reporting for Minsys

**Author:** Web analytics advisor
**Owner:** Laurent (Minsys)
**Scope:** `minsys-xyz-prototype-v0-codebase` — Landing page (`src/App.tsx`) + Talent page (`src/TalentPage.tsx`)
**Status:** Approved — all open questions resolved (see §8)

## Decisions (locked by Laurent, 2026-04-07)

1. Move GA ID to `VITE_GA_MEASUREMENT_ID` — ✅ approved.
2. Consent — **leave as-is**, no Consent Mode v2, no banner. (ENABLER-7 dropped.)
3. **No PII** to GA4 — confirmed. No name / email / LinkedIn / free-text.
4. `generate_lead` fires only on `cta_click`, `role_interest`, `tab_select` — **not** on `nav_click`.
5. Reporting — build **both** GA4 Explorations and a Looker Studio dashboard.
6. GA MCP — not connected yet. Deliverable includes the click-by-click GA4 admin checklist in §11. Laurent will connect the MCP at implementation time.
7. Privacy / Terms pages — nav tracking only, no in-page events — confirmed.

---

## 1. Context & current state

- GA4 property `G-0Y2RRCTB7J` is loaded via gtag in `index.html:63-69` — hardcoded, no env var.
- `src/analytics.ts` initializes `window.dataLayer` and fires **one** custom event — `section_view` — via IntersectionObserver (50% threshold) for any `<section id="...">`.
- **No** click, tab, CTA, or form events are tracked today.
- Forms (`TalentPage.tsx` role application + general application) POST to Web3Forms with zero GA signal on submit.
- No consent banner, no Consent Mode, no custom dimensions configured in the GA4 property.

**Business definitions (Laurent):**
- **Lead** = any user engaging with a clickable element.
- **Prospect** = lead who submits a form (Partner / Apply).
- Minsys does not sell — "conversions" are *points of interest*.

---

## 2. Guiding principles

1. **Few event names, rich parameters** — keeps GA4 reports legible, enables slicing in Explorations.
2. **Semantic, not literal** — `cta_click` with a `cta_id` param beats 12 custom event names.
3. **Single source of truth** — all tracking goes through one `trackEvent()` helper in `src/analytics.ts`.
4. **No PII to GA4** — never send name, email, LinkedIn URL, free-text answers.
5. **Separate code from config** — Measurement ID in `VITE_GA_MEASUREMENT_ID`.
6. **Key Events (conversions) stay small** — only `generate_lead` and `generate_prospect`.

---

## 3. Event taxonomy

| # | Event name | Trigger | Parameters | Key Event? |
|---|---|---|---|---|
| 1 | `page_view` | GA4 automatic | `page_location`, `page_title`, `page_path` | — |
| 2 | `section_view` | existing IntersectionObserver | `section_id`, `page` | — |
| 3 | `nav_click` | any header/footer link | `link_text`, `link_url`, `link_location` (`header`\|`footer`), `page` | — |
| 4 | `tab_select` | tab switch (model / organization / talent pillar) | `tab_group`, `tab_id`, `page` | — |
| 5 | `carousel_scroll` | capabilities carousel arrows | `direction` (`prev`\|`next`) | — |
| 6 | `cta_click` | primary CTA buttons (see §4.3) | `cta_id`, `cta_text`, `destination`, `page` | — |
| 7 | `role_interest` | "Apply for Role" expanded on Talent page | `role_id`, `role_title` | — |
| 8 | `form_start` | first focus on any form field | `form_id`, `role_id?` | — |
| 9 | `form_submit` | Web3Forms POST success | `form_id`, `role_id?`, `pillar?` | — |
| 10 | `form_error` | Web3Forms POST failure | `form_id`, `error_type` | — |
| 11 | `generate_lead` | fired **only** alongside `cta_click`, `role_interest`, `tab_select` (NOT `nav_click`) | `lead_source` | ✅ |
| 12 | `generate_prospect` | fired alongside successful `form_submit` | `form_id` | ✅ |

**Naming conventions**
- Event names: `snake_case`, verbs or noun_verb.
- Param values: stable identifiers (`model_tab_platform_acq`), not translated labels.
- `page` param values: `landing` \| `talent` \| `privacy` \| `terms`.

---

## 4. Instrumentation map (by element)

### 4.1 Landing page — `src/App.tsx`

| Element | File:line | Event | Params |
|---|---|---|---|
| Header link "Model" | `App.tsx:42` | `nav_click` | `link_text=Model`, `link_url=#model`, `link_location=header`, `page=landing` |
| Header link "Organization" | `App.tsx:43` | `nav_click` | … |
| Header link "Capabilities" | `App.tsx:44` | `nav_click` | … |
| Header link "Join Minsys" | `App.tsx:45` | `nav_click` | `link_url=/talent` |
| Header CTA "Partner with Us" | `App.tsx:46` | `cta_click` + `generate_lead` | `cta_id=header_partner`, `destination=#getintouch` |
| Model tabs (×3) | `App.tsx:96-113` | `tab_select` + `generate_lead` | `tab_group=model`, `tab_id=<id>` |
| Organization tabs (×4) | `App.tsx:173-191` | `tab_select` + `generate_lead` | `tab_group=organization`, `tab_id=<id>` |
| Capabilities carousel prev/next | `App.tsx:240-254` | `carousel_scroll` | `direction=prev\|next` |
| CTA "Contact Deal Desk" | `App.tsx:300-305` | `cta_click` + `generate_lead` | `cta_id=contact_deal_desk`, `destination=mailto` |
| CTA "Partner with Us" (body) | `App.tsx:313-318` | `cta_click` + `generate_lead` | `cta_id=partner_body` |
| CTA "Join Minsys" (body) | `App.tsx:326-331` | `cta_click` + `generate_lead` | `cta_id=join_minsys_body`, `destination=/talent` |
| Footer link "Privacy" | `App.tsx:352` | `nav_click` | `link_location=footer` |
| Footer link "Terms" | `App.tsx:354` | `nav_click` | `link_location=footer` |

### 4.2 Talent page — `src/TalentPage.tsx`

| Element | File:line | Event | Params |
|---|---|---|---|
| Header links (Model/Org/Capabilities → /#…) | `TalentPage.tsx:577-584` | `nav_click` | `page=talent`, `link_location=header` |
| Header CTA "Join Minsys" | `TalentPage.tsx:589` | `cta_click` + `generate_lead` | `cta_id=header_join` |
| Hero "Open Positions" | `TalentPage.tsx:616` | `cta_click` + `generate_lead` | `cta_id=hero_open_positions` |
| Hero "General Application" | `TalentPage.tsx:627` | `cta_click` + `generate_lead` | `cta_id=hero_general_application` |
| Role card "Apply for Role" (×3) | `TalentPage.tsx:138` | `role_interest` + `generate_lead` | `role_id`, `role_title` |
| Role form field first focus | `TalentPage.tsx:221-337` | `form_start` | `form_id=role_apply`, `role_id` |
| Role form submit (success) | `TalentPage.tsx` submit handler | `form_submit` + `generate_prospect` | `form_id=role_apply`, `role_id` |
| Role form submit (error) | same | `form_error` | `form_id=role_apply`, `error_type` |
| Pillar tabs (×4) | `TalentPage.tsx:388-403` | `tab_select` + `generate_lead` | `tab_group=talent_pillar`, `tab_id` |
| General form field first focus | `TalentPage.tsx:446-541` | `form_start` | `form_id=general_apply` |
| General form submit (success) | `TalentPage.tsx:540` | `form_submit` + `generate_prospect` | `form_id=general_apply`, `pillar` |
| General form submit (error) | same | `form_error` | `form_id=general_apply` |
| Footer links | `TalentPage.tsx:697-702` | `nav_click` | `link_location=footer` |

### 4.3 What counts as a "CTA"
Buttons that move the user toward a conversion: **Contact Deal Desk, Partner with Us, Join Minsys, Open Positions, General Application, Apply for Role**. Everything else navigational is `nav_click`.

---

## 5. Code changes

### 5.1 Environment
- Add `VITE_GA_MEASUREMENT_ID` to `.env.example` and Vercel env vars.
- Remove hardcoded ID from `index.html:63-69`; inject from Vite at build time OR load gtag dynamically from `src/analytics.ts` using `import.meta.env.VITE_GA_MEASUREMENT_ID`.

### 5.2 Rewrite `src/analytics.ts`
Export:
```ts
export function initAnalytics(): void            // existing + loads gtag
export function trackEvent(name: string, params?: Record<string, unknown>): void
export function trackPageView(path: string): void // called by Router on route change
```
- `trackEvent` pushes to `dataLayer` via `gtag('event', name, params)`.
- Automatically injects `page` param derived from `window.location.pathname`.
- No-op if `VITE_GA_MEASUREMENT_ID` is unset (local dev).
- Keep existing `section_view` IntersectionObserver, but route it through `trackEvent`.

### 5.3 Small helper hooks
- `useNavClick(location: 'header'|'footer')` → returns onClick handler.
- `useCtaClick(cta_id)` → returns onClick handler that fires `cta_click` + `generate_lead`.
- `useFormTracking(form_id)` → returns `{ onFirstFocus, onSubmitSuccess, onSubmitError }`.

### 5.4 Router integration
- `src/Router.tsx` — on pathname change, call `trackPageView()` so SPA navigations aren't missed. (gtag `config` only fires the initial page_view.)

### 5.5 Touchpoints summary
- `index.html` — strip inline gtag OR replace with env-driven snippet.
- `src/analytics.ts` — rewrite (backwards-compatible for `section_view`).
- `src/main.tsx` or `src/App.tsx` — call `initAnalytics()` (already done in App.tsx:18).
- `src/Router.tsx` — SPA page_view on route change.
- `src/App.tsx` — wire handlers on ~10 elements.
- `src/TalentPage.tsx` — wire handlers on ~15 elements + form lifecycle.

---

## 6. GA4 property configuration (admin work)

Step-by-step once code is live:

1. **Data Streams → Web stream** — confirm `G-0Y2RRCTB7J`, enable Enhanced Measurement (page_view, scroll, outbound, site_search off, form_interactions off — we handle forms ourselves to avoid duplicates).
2. **Admin → Data display → Custom dimensions** (event-scoped):
   - `cta_id`, `tab_group`, `tab_id`, `form_id`, `role_id`, `pillar`, `link_location`, `page`, `section_id`, `lead_source`.
3. **Admin → Events → Mark as Key Event**: `generate_lead`, `generate_prospect`.
4. **Data retention** → set to 14 months (max on free tier).
5. **Google signals / ads personalization** → off unless Laurent confirms consent strategy.
6. **Consent Mode v2** defaults (if chosen in §8 Q2).
7. **DebugView** — validate all events with the GA Debug Chrome extension before closing the ticket.

---

## 7. Reporting — custom dashboard

**Recommendation:** Looker Studio (shareable URL, better visuals for a business owner).
Alternative: GA4 Exploration (free reports inside GA).

### 7.1 Dashboard: "Minsys Engagement Overview"

**Pages / tabs:**

1. **Executive summary**
   - Scorecards: Users, Sessions, Leads (`generate_lead`), Prospects (`generate_prospect`), Lead→Prospect rate.
   - Trend line: Leads vs Prospects by day.
2. **Content interest (Landing)**
   - Bar chart: `section_view` by `section_id`.
   - Bar chart: `tab_select` count by `tab_group` + `tab_id` (stacked).
   - Table: `cta_click` by `cta_id` (with click-through).
3. **Talent funnel**
   - Funnel: `section_view(open-positions)` → `role_interest` → `form_start(role_apply)` → `form_submit(role_apply)`.
   - Parallel funnel for `general_apply`.
   - Bar: `role_interest` by `role_id` — **answers "which role are people most interested in?"**
   - Pie: Open Positions vs General Application share of `form_submit`.
4. **Navigation patterns**
   - Table: `nav_click` by `link_text` × `link_location`.
   - Sankey (GA4 Exploration Path): Landing → Talent, Talent → Forms.
5. **Acquisition & device** (standard GA4 reports embedded).

### 7.2 GA4 Explorations to build alongside
- **Funnel Exploration** for the talent funnel above.
- **Path Exploration** starting from `session_start` to see dominant user journeys.
- **Segment overlap**: users who viewed `#model` ∩ users who clicked `partner`.

---

## 8. Open questions (need Laurent's answers before implementation)

1. **Env var** — OK to move GA ID to `VITE_GA_MEASUREMENT_ID`?
2. **Consent** — (a) nothing, (b) Consent Mode v2 defaults EU-safe, (c) full banner?
3. **PII** — confirm NO name/email/LinkedIn/free-text sent to GA4.
4. **Lead definition** — restrict `generate_lead` to CTA + role_interest + tab_select (recommended), or include every `nav_click` (inflates metric)?
5. **Dashboard** — Looker Studio or GA4 Explorations only?
6. **GA MCP** — is a Google Analytics MCP available to connect? If yes I can create Key Events, custom dimensions, and the Looker Studio dashboard directly. If no, deliverable is a click-by-click GA4 admin checklist.
7. **Privacy / Terms pages** — nav tracking only, no in-page events — confirm.

---

## 9. Delivery breakdown (proposed tickets)

1. **ENABLER-1** Move GA ID to env var; rewrite `src/analytics.ts` with `trackEvent`/`trackPageView`; router page_view on SPA nav.
2. **ENABLER-2** Instrument Landing page (`App.tsx`) — nav, tabs, carousel, CTAs.
3. **ENABLER-3** Instrument Talent page (`TalentPage.tsx`) — nav, hero CTAs, role_interest, pillar tabs.
4. **ENABLER-4** Form lifecycle events on both role_apply and general_apply (form_start / form_submit / form_error / generate_prospect).
5. **ENABLER-5** GA4 admin — custom dimensions, Key Events, Enhanced Measurement tuning, DebugView QA.
6. **ENABLER-6** Looker Studio dashboard build.
7. **ENABLER-7** *(dropped — Laurent chose to leave consent as-is)*

---

## 10. Acceptance criteria

- [ ] All events in §3 observable in GA4 DebugView during manual QA.
- [ ] Zero PII in any event parameter (verified via DebugView).
- [ ] `generate_lead` and `generate_prospect` marked as Key Events.
- [ ] SPA navigation between `/` and `/talent` produces a second `page_view`.
- [ ] Looker Studio dashboard answers, in one glance:
  - Which landing-page sections attract attention?
  - Which role generates the most interest?
  - Open Positions vs General Application — which wins?
  - Lead → Prospect conversion rate.
- [ ] No regression to existing `section_view` behavior.
- [ ] `VITE_GA_MEASUREMENT_ID` documented in README and set in Vercel.

---

## 11. GA4 admin click-by-click checklist

Execute in this order **after** code from ENABLER-1..4 is deployed and has fired at least one event in production (otherwise custom dimensions and Key Events can't be registered — GA4 only shows parameters/events it has actually seen). All steps are in the GA4 web UI at https://analytics.google.com — property `G-0Y2RRCTB7J`.

### 11.1 Verify the data stream
1. **Admin** (gear, bottom-left) → **Data Streams** → click the Web stream for minsys.xyz.
2. Confirm Measurement ID = `G-0Y2RRCTB7J`. Mirror it into Vercel env var `VITE_GA_MEASUREMENT_ID`.
3. Click **Enhanced measurement** (gear icon on the right).
   - ✅ Keep ON: Page views, Scrolls, Outbound clicks, Site search, Video engagement, File downloads.
   - ❌ **Turn OFF: Form interactions** — we track forms ourselves; leaving this on creates duplicate events.
   - Save.

### 11.2 Data retention
1. **Admin → Data Settings → Data Retention**.
2. Event data retention → **14 months** (max on free tier).
3. ✅ "Reset user data on new activity" — on.
4. Save.

### 11.3 Google Signals
1. **Admin → Data Settings → Data Collection**.
2. **Leave Google Signals OFF** — consistent with the no-banner decision.

### 11.4 Internal traffic filter (recommended)
1. **Admin → Data Streams → [web stream] → Configure tag settings → Show all → Define internal traffic**.
2. Create rule: `traffic_type = internal` for Laurent's IP(s).
3. **Admin → Data Settings → Data Filters** → set the "Internal Traffic" filter to **Active**.

### 11.5 Register custom dimensions
**Admin → Custom definitions → Custom dimensions → Create custom dimension.** Create ALL of the following (all **event-scoped**):

| Dimension name | Scope | Event parameter |
| -------------- | ----- | --------------- |
| CTA ID         | Event | `cta_id`        |
| CTA text       | Event | `cta_text`      |
| Tab group      | Event | `tab_group`     |
| Tab ID         | Event | `tab_id`        |
| Form ID        | Event | `form_id`       |
| Role ID        | Event | `role_id`       |
| Role title     | Event | `role_title`    |
| Pillar         | Event | `pillar`        |
| Link text      | Event | `link_text`     |
| Link URL       | Event | `link_url`      |
| Link location  | Event | `link_location` |
| Page           | Event | `page`          |
| Section ID     | Event | `section_id`    |
| Lead source    | Event | `lead_source`   |
| Destination    | Event | `destination`   |
| Direction      | Event | `direction`     |
| Error type     | Event | `error_type`    |

⚠️ Custom-dimension values only start appearing in standard reports **~24h after** the first matching event arrives. DebugView shows them immediately.
⚠️ Free tier limit: 50 event-scoped custom dimensions. We use 17.

### 11.6 Mark Key Events (conversions)
1. **Admin → Events** (under "Data display").
2. Wait until `generate_lead` and `generate_prospect` appear in the list (requires ≥1 production hit; can take up to 24h).
3. Toggle **"Mark as key event"** ON for both.
4. Leave monetary value empty — Minsys doesn't monetize.

### 11.7 DebugView QA (during implementation)
1. Install the Chrome extension **Google Analytics Debugger** and enable it on minsys.xyz.
2. GA4 → **Admin → DebugView** (or left nav).
3. For every event in §3, trigger it on the site and confirm it shows up with correct parameter values (no `(not set)`).
4. Fix mismatches before closing ENABLER tickets.

### 11.8 Audiences (optional but useful)
**Admin → Audiences → New audience:**
- **Leads** — users who triggered `generate_lead`.
- **Prospects** — users who triggered `generate_prospect`.
- **Talent-curious** — users who triggered `role_interest` OR viewed `#open-positions`.
- **Partner-curious** — users whose `cta_click` had `cta_id` containing `partner`.

### 11.9 Reporting — GA4 Explorations (build these three)
**Explore → Blank** for each:

1. **Talent funnel (Funnel Exploration)**
   - Steps: `session_start` → `page_view` (page_path = `/talent`) → `role_interest` → `form_start` (form_id = `role_apply`) → `form_submit` (form_id = `role_apply`).
   - Breakdown: Role ID.
   - Duplicate as a second tab with `form_id = general_apply`, broken down by Pillar.

2. **Path Exploration** — start node `session_start`, branch by event name. Reveals dominant journeys Landing ↔ Talent ↔ Forms.

3. **Free-form: CTA performance** — rows = CTA ID, metric = Event count + Total users, filter `event_name = cta_click`.

### 11.10 Reporting — Looker Studio dashboard
1. https://lookerstudio.google.com → **Create → Report**.
2. Data source → **Google Analytics** → Minsys property.
3. Custom dimensions from §11.5 appear automatically.
4. Build pages per §7.1 (Executive / Content interest / Talent funnel / Navigation / Acquisition).
5. Share viewer link with Laurent.

### 11.11 Post-launch monitoring (first 2 weeks)
- **Day 1:** DebugView sanity check.
- **Day 2:** Realtime report shows all 12 event names.
- **Day 3:** Custom dimensions show real values in Explorations.
- **Day 7:** First weekly review — lead/prospect volumes plausible? Any event over-firing (double-bound handler)?
- **Day 14:** Tune — drop any always-empty dimension; add any parameter Laurent requests.
