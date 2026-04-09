# Product Requirements Document (PRD): Minsys Partner Contact Form

**Version:** 1.0
**Owner:** Laurent (Business Owner)
**Stakeholders:** Product Owner, Dev Team

---

## 1. Executive Summary & Goals

The two CTA cards in the main landing page's `{/* CTA Section */}` — "Capital Partners" and "M&A Origination Partners" — currently fire a `mailto:contact@minsys.xyz` link. This is a dead-drop UX: no structured data capture, no GA4 prospect signal, no confirmation to the sender.

The goal of this feature is to replace that mailto behaviour with a professional, lightweight contact form that:
- Captures structured lead data (name, email, company, message)
- Delivers submissions via Web3Forms to `partners@minsys.xyz`
- Fires the `generate_prospect` GA4 Key Event on every form submission
- Matches the design language of the talent page forms

---

## 2. Target Audience & Personas

### 2.1 Capital Partners
Institutional lenders, family offices, HNWIs, and commercial banking relationships exploring co-lending or co-investment on Minsys's Main Street acquisition pipeline.

### 2.2 M&A Origination Partners
Business brokers, accountants, lawyers, or operators who have identified a cash-flow positive Main Street business ripe for Digital & AI transformation and want to refer or co-originate a deal.

---

## 3. Functional Requirements

### 3.1 Trigger
Both CTA buttons — "Contact Deal Desk" and "Partner with Us" — open the same shared modal. The modal is context-aware: it receives a `partnerType` prop (`'capital' | 'origination'`) that controls its headline, description copy, placeholder text, and Web3Forms email subject.

### 3.2 Form Fields

| # | Field | Type | Required | Notes |
|---|-------|------|----------|-------|
| 1 | Full Name | `text` | ✅ | Placeholder: `"Jane Smith"` |
| 2 | Email Address | `email` | ✅ | Placeholder: `"jane@firm.com"` — key follow-up field |
| 3 | Company / Organization | `text` | ✅ | Placeholder: `"Smith Capital Partners"` |
| 4 | Brief Message | `textarea` | ✗ optional | Context-aware placeholder (see §3.3); ~200 word soft limit |

### 3.3 Context-Aware Copy

**Capital Partner variant**

- Modal title: `"Partner with Minsys — Capital"`
- Sub-heading: `"We're securing commercial lending for our next Main Street acquisition. Tell us about your mandate."`
- Message placeholder: `"e.g. We manage a SME lending portfolio and are exploring co-investment in AI-led acquisitions. Happy to jump on a call."`
- Web3Forms subject: `[Minsys Partners] Capital Inquiry — {name}`

**M&A Origination variant**

- Modal title: `"Partner with Minsys — Deal Origination"`
- Sub-heading: `"You've identified a Main Street business ripe for transformation. Share the opportunity and we'll be in touch."`
- Message placeholder: `"e.g. I'm aware of a profitable HVAC business with $2M EBITDA in the Southwest. The owner is open to a structured exit and transition."`
- Web3Forms subject: `[Minsys Partners] Deal Origination — {name}`

### 3.4 Form States

| State | Behaviour |
|-------|-----------|
| `idle` | Form visible, submit button active |
| `sending` | Submit button shows spinner/disabled, inputs locked |
| `success` | Form replaced by checkmark + "We'll be in touch" message |
| `error` | Error banner shown; fallback: `"email us at partners@minsys.xyz"`; retry button |

### 3.5 Fallback email
All mailto references in the CTA section updated to `mailto:partners@minsys.xyz` (was `mailto:contact@minsys.xyz`).

---

## 4. Web3Forms Integration

Reuses the existing access key and endpoint from `src/data/talent.ts`:

```ts
W3F_ACCESS_KEY = '262745d1-43ba-4b6b-bf8a-63f8d2d8d607'
W3F_ENDPOINT   = 'https://api.web3forms.com/submit'
```

New payload builder to add to `src/data/talent.ts`:

```ts
export type PartnerType = 'capital' | 'origination';

export interface PartnerApplication {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function buildPartnerPayload(
  type: PartnerType,
  app: PartnerApplication
): Web3FormsPayload {
  const label = type === 'capital' ? 'Capital Inquiry' : 'Deal Origination';
  return {
    access_key: W3F_ACCESS_KEY,
    subject: `[Minsys Partners] ${label} — ${app.name}`,
    from_name: app.name,
    replyto: app.email,        // Web3Forms reply-to field
    message:
      `PARTNER TYPE:\n${label}\n\n` +
      `NAME:\n${app.name}\n\n` +
      `EMAIL:\n${app.email}\n\n` +
      `COMPANY:\n${app.company}\n\n` +
      `MESSAGE:\n${app.message || 'Not provided'}`,
  };
}
```

> Note: `replyto` is a supported Web3Forms field — it sets the Reply-To header so Laurent can hit Reply directly from his inbox.

---

## 5. GA4 Analytics Events

Consistent with the talent form instrumentation:

| Event | When fired | Key params |
|-------|-----------|------------|
| `cta_click` | Button clicked (before modal opens) | `cta_id: 'contact_deal_desk' \| 'partner_body'`, `destination: 'modal'` |
| `generate_lead` | Button clicked | `lead_source: 'contact_deal_desk' \| 'partner_body'` |
| `form_start` | First field interaction (fires once per open) | `form_id: 'partner_capital' \| 'partner_origination'` |
| `form_submit` | Successful Web3Forms response | `form_id` |
| `form_error` | Web3Forms error | `form_id`, `error_type` |
| `generate_prospect` | Successful submission (Key Event) | `form_id` |

---

## 6. Architecture & File Changes

### Files to modify

| File | Change |
|------|--------|
| `src/App.tsx` | Replace `handleContactClick` mailto logic with modal state; add `PartnerModal` component inline; update both CTA buttons |
| `src/data/talent.ts` | Add `PartnerType`, `PartnerApplication` types; add `buildPartnerPayload()` |

### Files NOT to create
- No new component file at this stage — `PartnerModal` lives inline in `App.tsx` per Laurent's instruction. Extraction to `PartnerModal.tsx` is a future refactor.

### Modal state (in App.tsx)
```ts
const [partnerModal, setPartnerModal] = useState<'capital' | 'origination' | null>(null);
```

Passing `null` keeps the modal closed; passing `'capital'` or `'origination'` opens it in the correct context.

---

## 7. Design Specifications

### Modal shell
- Overlay: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4`
- Panel: `bg-white rounded-3xl max-w-lg w-full p-10 relative`
- Close button (×): top-right corner, `absolute top-4 right-4`
- Close on overlay click and on Escape key

### Typography & colours (match talent page forms)
- Modal title: `text-2xl font-bold text-darkGraphite`
- Sub-description: `text-sm text-gray-500 mb-8`
- Labels: `text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-1`
- Inputs: `w-full border-b border-gray-200 py-3 text-sm focus:border-solarAmber outline-none bg-transparent`
- Textarea: `w-full border border-gray-200 rounded-xl p-4 text-sm bg-[#fafafa] focus:bg-white focus:border-solarAmber outline-none resize-none`
- Submit button: `w-full bg-solarAmber text-darkGraphite py-4 rounded-xl font-bold hover:brightness-110 transition-all`

### Word counter on message textarea
- Soft limit: 200 words
- Counter shows `X / 200 words`, turns amber at 180+
- No hard clamp — optional field, just guidance

---

## 8. Acceptance Criteria

- [ ] "Contact Deal Desk" button opens modal in `capital` context
- [ ] "Partner with Us" button opens modal in `origination` context
- [ ] Modal title, description, and message placeholder differ between contexts
- [ ] All 4 fields render; name/email/company are required; message is optional
- [ ] Submit sends POST to Web3Forms; correct subject line per type
- [ ] `replyto` field populated with submitted email
- [ ] Success state renders (no form resubmit)
- [ ] Error state renders with `partners@minsys.xyz` fallback and retry button
- [ ] Pressing Escape or clicking overlay closes modal
- [ ] GA4 events fire: `cta_click`, `generate_lead`, `form_start`, `form_submit`, `generate_prospect` (or `form_error`)
- [ ] No existing CTA card layout/styling broken
- [ ] Lint passes, no TypeScript errors

---

## 9. Out of Scope

- Extraction of `PartnerModal` to its own file (future refactor)
- CRM / HubSpot / Pipedrive integration
- Email notification templating beyond Web3Forms defaults
- reCAPTCHA / spam protection (Web3Forms honeypot is sufficient for now)

---

## 10. Enablers

### ENABLER-1: Data layer — types & payload builder
Add `PartnerType`, `PartnerApplication`, `buildPartnerPayload` to `src/data/talent.ts`.

### ENABLER-2: UI — PartnerModal component (inline in App.tsx)
Build the modal shell, form fields, state machine (`idle → sending → success/error`), overlay/escape close logic.

### ENABLER-3: Wire CTA buttons
Replace `handleContactClick` logic; pass correct `partnerType` to modal; update `mailto:` fallback to `partners@minsys.xyz`.

### ENABLER-4: GA4 instrumentation
All 6 events per §5 wired into form lifecycle.

### ENABLER-5: QA & UAT
Test both contexts, all 3 form states, on preview Vercel deployment. Confirm Web3Forms delivery to `partners@minsys.xyz`. Confirm GA4 DebugView.
