# Sprint: Minsys Partner Contact Form

**Branch:** `feature/partner-contact-form`
**Worktree:** `/workspace/.worktrees/partner-contact-form`
**PRD:** `./planning/Plan - Partner Contact Form.md`
**Product Owner:** Laurent (Business Owner)
**Developer:** Claude

---

## 1. Sprint Goal

Replace the dead-drop `mailto:contact@minsys.xyz` on the two partner CTA buttons ("Contact Deal Desk" and "Partner with Us") with a professional, context-aware contact form modal that captures structured lead data, delivers submissions via Web3Forms to `partners@minsys.xyz`, and fires GA4 prospect-level events. Additionally, refactor the CTA section to be partner-exclusive by removing the "Join Minsys" card (now routed to the dedicated `/talent` page) and enhance the Capabilities section with full-width backdrop-blur overlays and improved typography.

---

## 2. Sprint Objectives

1. **Modal form UI** — Build a shared `PartnerModal` component that adapts its title, description, and message placeholder based on partner type (`capital` | `origination`).
2. **Form fields & validation** — Collect Name, Email, Company (all required) and optional Brief Message (~200-word soft limit).
3. **Web3Forms integration** — POST submissions to Web3Forms with context-aware subject lines and `replyto` header so Laurent can reply directly from his inbox.
4. **GA4 instrumentation** — Wire `cta_click`, `generate_lead`, `form_start`, `form_submit`, `generate_prospect`, and `form_error` events for full conversion funnel tracking.
5. **CTA section refactor** — Remove the "Join Minsys" card (moves to `/talent` page); widen the two remaining partner cards to fill available space.
6. **Visual enhancements** — Update section heading underlines, refine Capabilities card overlay styling (full-width backdrop-blur, sentence-case description, larger font), update AI Factory image.

---

## 3. Out of Scope

- CRM or HubSpot integration (Web3Forms inbox is the current destination).
- Email notification templating beyond Web3Forms defaults.
- reCAPTCHA or advanced spam protection (Web3Forms honeypot is sufficient).
- Extraction of `PartnerModal` to a separate file (kept inline in `App.tsx` per Laurent's instruction).

---

## 4. Definition of Done

- `npm run build` passes cleanly with no TypeScript errors.
- Both CTA buttons ("Contact Deal Desk", "Partner with Us") open the correct modal context.
- Modal title, description, and message placeholder differ between `capital` and `origination` contexts.
- Required fields (Name, Email, Company) block submission if empty; message is optional.
- Form submission POSTs to Web3Forms with correct subject line per partner type.
- `replyto` field is populated with the submitted email address.
- Success state displays the submitted email address; form cannot be resubmitted.
- Error state shows fallback `partners@minsys.xyz` email and retry button.
- Escape key and overlay click close the modal.
- GA4 events fire in DebugView in correct sequence: `cta_click` → `generate_lead` → `form_start` → `form_submit` → `generate_prospect` (or `form_error` on failure).
- CTA section has exactly 2 cards (Capital Partners, M&A Origination Partners) side-by-side.
- Section headings have underlined keywords ("Model", "Organization", "Capabilities").
- Capabilities cards display full-width backdrop-blur overlay, sentence-case description, and larger font.
- AI Factory image updated to data centre server infrastructure.

---

## 5. User Stories

### US-1 — Partner Contact Modal (Capital Partner variant)

**As** a lender or capital partner exploring Minsys,
**I want** to fill out a structured contact form without navigating away,
**so that** I can express my interest and Minsys can follow up with me directly.

**Acceptance Criteria**
- [ ] "Contact Deal Desk" button opens a modal with title "Partner with Minsys — Capital"
- [ ] Modal description reads: "We're securing commercial lending for our next Main Street acquisition. Tell us about your mandate."
- [ ] Message field placeholder: "e.g. We manage a SME lending portfolio and are exploring co-investment in AI-led acquisitions. Happy to jump on a call."
- [ ] Form fields: Full Name (required), Email (required), Company (required), Brief Message (optional, ~200 words)
- [ ] Submit POSTs to Web3Forms with subject `[Minsys Partners] Capital Inquiry — {name}`
- [ ] Success state shows submitted email address and confirmation message
- [ ] Error state shows fallback email `partners@minsys.xyz` and retry option

---

### US-2 — Partner Contact Modal (M&A Origination variant)

**As** a deal originator or broker who has identified a Main Street business,
**I want** to describe the opportunity in a simple form,
**so that** Minsys can evaluate and contact me with next steps.

**Acceptance Criteria**
- [ ] "Partner with Us" button opens the same modal in `origination` context
- [ ] Modal title: "Partner with Minsys — Deal Origination"
- [ ] Modal description: "You've identified a Main Street business ripe for transformation. Share the opportunity and we'll be in touch."
- [ ] Message placeholder: "e.g. I'm aware of a profitable HVAC business with $2M EBITDA in the Southwest. The owner is open to a structured exit and transition."
- [ ] Form fields identical to US-1 (Name, Email, Company, Message)
- [ ] Submit POSTs with subject `[Minsys Partners] Deal Origination — {name}`
- [ ] Rest of UX (success, error, retry) identical to US-1

---

### US-3 — GA4 Instrumentation

**As** Laurent (business owner) reviewing analytics,
**I want** to see the full conversion funnel from CTA click through form submission,
**so that** I can measure lead quality and optimize the partner acquisition experience.

**Acceptance Criteria**
- [ ] `cta_click` event fires when button is clicked (before modal opens): `{ cta_id: 'contact_deal_desk' | 'partner_body', cta_text, destination: 'modal' }`
- [ ] `generate_lead` event fires on CTA click: `{ lead_source: 'contact_deal_desk' | 'partner_body' }`
- [ ] `form_start` event fires on first field interaction (once per modal open): `{ form_id: 'partner_capital' | 'partner_origination' }`
- [ ] `form_submit` event fires on successful Web3Forms response: `{ form_id }`
- [ ] `generate_prospect` Key Event fires on successful submission: `{ form_id }`
- [ ] `form_error` event fires on failure: `{ form_id, error_type }`
- [ ] All events visible in GA4 DebugView in real time

---

### US-4 — CTA Section Refactor (Remove Join Minsys card)

**As** a visitor on the homepage,
**I want** the CTA section to focus exclusively on partner engagement,
**so that** the call-to-action is clear and the UI is uncluttered.

**Acceptance Criteria**
- [ ] "Join Minsys" card is removed from the CTA grid
- [ ] Only 2 cards remain: Capital Partners and M&A Origination Partners
- [ ] Cards sit side-by-side using `md:grid-cols-2` (full width, not constrained)
- [ ] "Join Minsys" entry point remains available via the header nav link and `/talent` page
- [ ] All `join_minsys_body` GA4 instrumentation removed from the CTA section

---

### US-5 — Visual Enhancements

**As** a design-conscious user,
**I want** the Capabilities section to have better visual hierarchy and text legibility,
**so that** I can scan content efficiently and enjoy the aesthetic.

**Acceptance Criteria**
- [ ] "Model" underlined in "Venture Building Micro-PE Model" heading
- [ ] "Organization" underlined in "The Four Pillars Organization" heading
- [ ] "Capabilities" underlined in "Off-the-Shelf Digital & AI Capabilities" heading (now `<h3>` for consistency)
- [ ] Capabilities cards: backdrop-blur-md overlay stretches full width (left-to-right)
- [ ] Description text in sentence case (not uppercase)
- [ ] Description text font size increased to `text-xs`
- [ ] AI Factory card image updated to data centre server infrastructure (conveys large-scale compute lifecycle)

---

## 6. Implementation Log

### US-1 & US-2 — Partner Contact Modal (shared, context-aware)

**Files:** `src/App.tsx`, `src/data/talent.ts`

- **Data layer:** Added `PartnerType = 'capital' | 'origination'` union type, `PartnerApplication` interface, and `buildPartnerPayload()` function to `src/data/talent.ts`.
- **Payload builder:** `buildPartnerPayload(type, app)` returns Web3Forms-shaped object with context-aware subject and `replyto` field set to submitted email.
- **Modal component:** Implemented `PartnerModal` as an inline functional component in `src/App.tsx`. Features:
  - `PARTNER_COPY` lookup object maps `capital` / `origination` → title, description, messagePlaceholder
  - Form state machine: `idle → sending → success | error`
  - `formStartFired` ref ensures `form_start` GA4 event fires once per modal open
  - Overlay click + Escape key close the modal
  - Success state displays submitted email; blocks resubmission
  - Error state shows `partners@minsys.xyz` fallback email and retry button
  - Word counter on message: soft limit 200 words, turns amber at 180+
- **CTA button wiring:** Replaced `handleContactClick` mailto logic with `openPartnerModal(type, cta_id, cta_text)` helper that fires GA4 events before opening the modal.
- **Vercel:** Updated `mailto:contact@minsys.xyz` references to `mailto:partners@minsys.xyz` for fallback messaging.

**Verification:** Modal opens with correct context; form submits to Web3Forms; success/error states work as designed.

---

### US-3 — GA4 Instrumentation

**Files:** `src/App.tsx`, `src/data/talent.ts`

- All 6 event types wired into the form lifecycle via `trackEvent()` calls (imported from `src/analytics.ts`).
- `cta_click` and `generate_lead` fire on button click (inside `openPartnerModal` helper).
- `form_start` fires on first field interaction (guarded by `formStartFired` ref to fire exactly once).
- `form_submit` and `generate_prospect` fire on Web3Forms success response.
- `form_error` fires on fetch failure with error message as `error_type` param.
- All events tested in GA4 DebugView during UAT.

**Verification:** DebugView shows all 6 events in correct sequence during happy-path submission.

---

### US-4 — CTA Section Refactor (Remove Join Minsys card)

**Files:** `src/App.tsx`

- **Grid layout:** Updated from `md:grid-cols-2 lg:grid-cols-3` → `md:grid-cols-2` to display exactly 2 cards side-by-side.
- **Removed:** Card 3 (Join Minsys) including its SVG, text, and inline GA4 events (`join_minsys_body` cta_id, destination `/talent`).
- **Preserved:** Header nav link to `/talent` remains as alternate entry point for candidates.

**Verification:** CTA section visually displays 2 partner cards only; Join Minsys still accessible via header nav.

---

### US-5 — Visual Enhancements

**Files:** `src/App.tsx`, `src/data/capabilities.ts`

- **Section heading underlines:** Wrapped keywords in `<span className="underline">` in three heading elements:
  - `Venture Building Micro-PE <span className="underline">Model</span>`
  - `The Four Pillars <span className="underline">Organization</span>`
  - `Off-the-Shelf Digital & AI <span className="underline">Capabilities</span>`
- **Heading type:** Changed Capabilities from `<h2>` to `<h3>` for semantic consistency with other major section heads.
- **Capabilities card overlay:**
  - Changed inner text box from `w-full` to `w-[calc(100%+5rem)] -mx-10` to stretch full width
  - Added `backdrop-blur-md bg-darkGraphite/40 rounded-2xl p-6` for frosted glass effect
- **Description styling:**
  - Removed `uppercase` class (now sentence case)
  - Changed font from `text-[10px]` to `text-xs` for better legibility
- **AI Factory image:** Updated `src/data/capabilities.ts` entry (id: 3) from neural network visualization to data centre server racks URL (https://images.unsplash.com/photo-1573164713988-8665fc963095).

**Verification:** Visual diff confirms underlines, card overlays, font sizes, image update all match design intent.

---

## 7. Files Touched

| Status | File | Purpose |
|---|---|---|
| modified | `src/App.tsx` | Added `PartnerModal` component, `partnerModal` state, `openPartnerModal()` helper; removed Join Minsys card; updated grid layout; added heading underlines; refined Capabilities section |
| modified | `src/data/talent.ts` | Added `PartnerType`, `PartnerApplication` types; added `buildPartnerPayload()` function; updated `Web3FormsPayload` interface with optional `replyto` field |
| modified | `src/data/capabilities.ts` | Updated AI Factory (id: 3) image URL to data centre server infrastructure |

---

## 8. UAT Sign-Off

**Date:** 2026-04-08
**Tester:** Laurent (Business Owner)
**Result:** ✅ **PASS**

**Confirmed:**
- [x] "Contact Deal Desk" button opens modal with Capital context (title, description, placeholder all correct)
- [x] "Partner with Us" button opens modal with Origination context
- [x] Name, Email, Company required; form blocks submission if any are empty
- [x] Message optional; word counter shows and turns amber at 180+ words
- [x] Submit button sends to Web3Forms; success state displays submitted email address
- [x] Error handling shows fallback `partners@minsys.xyz` email and retry button
- [x] **Web3Forms emails received and well-formatted** at partners@minsys.xyz inbox
- [x] **GA4 custom events firing in DebugView** (cta_click → generate_lead → form_start → form_submit → generate_prospect sequence verified)
- [x] Escape key and overlay click close modal
- [x] CTA section displays 2 cards side-by-side (Join Minsys removed)
- [x] Section headings have underlined keywords
- [x] Capabilities cards show full-width backdrop-blur overlay, sentence-case description, larger font
- [x] AI Factory image displays data centre server racks

**Ready for merge to `main`.**

---

## 9. Follow-ups (Out of Sprint)

### ENABLER-1: Custom GA4 Looker Studio Dashboards (Proposed)

Laurent will build 2–3 custom Looker Studio dashboards to consolidate partner engagement analytics:

#### Dashboard 1: **Partner Acquisition Funnel**
- **Purpose:** Track the conversion path from CTA click → lead → prospect
- **Metrics:**
  - CTA Clicks (by partner type: Capital vs. Deal Origination)
  - Form Starts (engagement depth)
  - Form Submissions (total and by type)
  - Conversion Rate: `(Submissions / Clicks) × 100%`
  - Error Rate: `(Form Errors / Form Starts) × 100%`
- **Dimensions:** Partner type, date, day of week
- **Visualization:** Funnel chart (CTA Clicks → Form Starts → Submissions); time-series line chart of daily conversion rate
- **User:** Laurent reviews weekly to spot friction points

#### Dashboard 2: **Partner Profile & Intent**
- **Purpose:** Identify which partner segment (Capital vs. Deal Origination) is more engaged
- **Metrics:**
  - Leads by partner type (pie chart)
  - Message word count (avg, median, distribution) — longer messages = higher intent
  - Time to submit (avg time from form_start to form_submit)
  - Submission frequency (which day/time of week sees most submissions?)
- **Dimensions:** Partner type, time of day, day of week
- **Visualization:** Pie chart (leads by type); box plot (message length by type); heatmap (submissions by day × hour)
- **User:** Laurent identifies which segment is most engaged; refines CTA copy/UX accordingly

#### Dashboard 3: **Prospect Quality & Follow-up**
- **Purpose:** Track submitted prospects and flag high-intent applicants
- **Metrics:**
  - Prospects by month (cumulative)
  - Average time from click to submission (shorter = more immediate intent)
  - Prospects with message (% with non-empty message vs. minimal info)
  - Top phrases in message field (word cloud or frequency analysis — e.g., "EBITDA", "acquisition", "transformation")
- **Dimensions:** Partner type, submitted date, company name (if available), message content
- **Visualization:** Time-series of cumulative prospects; scatter plot (message length vs. submission velocity); word cloud of key intent signals
- **User:** Laurent reviews to prioritize outreach; focuses on high-intent signals (longer messages, specific deal details)

---

### Next Steps

1. **GA4 Custom Dimensions:** Register the 17 event-scoped custom dimensions in GA4 Admin → Custom Definitions (per PRD §11.5): `partner_type`, `form_id`, `error_type`, etc.
2. **GA4 Key Events:** Mark `generate_lead` and `generate_prospect` as Key Events in GA4 Admin → Events.
3. **Internal Traffic Filter:** Create GA4 filter for Laurent's IP and preview domains (`minsys-xyz-git-.*\.vercel\.app`) to avoid polluting production data.
4. **Looker Studio Dashboards:** Build the 3 dashboards (above) once 24h of production data has been collected.
5. **Email Automation (optional):** Set up Web3Forms forwarding rule or IFTTT webhook to auto-create a CRM entry or send a notification to Laurent on new partner submission.
