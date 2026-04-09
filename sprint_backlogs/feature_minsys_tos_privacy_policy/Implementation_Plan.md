# Implementation Plan: Privacy Policy & Terms of Service SPA Pages

## Context

Minsys website has footer links to `/privacy-policy` and `/terms-of-service` that currently load standalone static HTML files from `/public/`. This causes full-page reloads, breaking the SPA experience. The PRD requires converting these to native React components with updated legal content reflecting Minsys's Group structure, data practices, and IP protections.

---

## Files Overview

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/LegalLayout.tsx` | Shared wrapper: header, prose container, footer |
| Create | `src/PrivacyPolicyPage.tsx` | Privacy Policy content component |
| Create | `src/TermsOfServicePage.tsx` | Terms of Service content component |
| Modify | `src/Router.tsx` | Add `'privacy-policy'` and `'terms-of-service'` routes |
| Modify | `src/main.tsx` | Wire new page components into Router |
| Modify | `src/analytics.ts` | Update `currentPage()` for new routes |
| Modify | `vercel.json` | Add SPA rewrites for new routes |
| Delete | `public/privacy-policy.html` | Replaced by React component |
| Delete | `public/terms-of-service.html` | Replaced by React component |

**No changes to `src/App.tsx`** -- footer links already use `<a href="/privacy-policy">` which the router's click interceptor handles automatically once `getRoute()` recognizes the routes.

---

## Step 1: Create Feature Branch & Worktree

```bash
git worktree add /workspace/.worktrees/feature-tos-privacy-policy -b feature/tos-privacy-policy
```

All subsequent work happens in the worktree.

---

## Step 2: Extend Router (`src/Router.tsx`)

1. Update `getRoute()` return type to `'talent' | 'home' | 'privacy-policy' | 'terms-of-service'`
2. Add pathname checks:
   - `/privacy-policy` or `/privacy-policy/` -> `'privacy-policy'`
   - `/terms-of-service` or `/terms-of-service/` -> `'terms-of-service'`
3. Expand `Props` interface with `privacyPolicy` and `termsOfService` fields (both `React.ReactNode`)
4. Replace ternary render with route map lookup:
   ```tsx
   const routeMap = { home, talent, 'privacy-policy': privacyPolicy, 'terms-of-service': termsOfService };
   return <>{routeMap[getRoute(path)]}</>;
   ```

---

## Step 3: Create `src/LegalLayout.tsx`

Shared layout wrapping both legal pages. Reuses brand elements from the existing codebase.

**Structure:**
- `min-h-screen bg-[#121210] font-sans text-white/75`
- **Header**: Logo mark (same as App.tsx footer logo) + "Back to Home" link. `border-b border-white/[0.08] px-8 py-4`
- **Main**: `<main className="max-w-[64ch] mx-auto px-6 py-16">`
  - `<h1>` (title prop) -- `text-4xl font-bold text-white mb-2`
  - Meta line -- "Minsys Holdings, LLC | Last updated: {lastUpdated prop}" -- `text-white/40 text-sm mb-12`
  - `{children}`
- **Footer**: Duplicate of App.tsx footer structure (lines 602-621) with Privacy Policy / ToS links + copyright

**Props**: `{ title: string; lastUpdated: string; children: React.ReactNode }`

**Prose styling classes** (applied directly in page components):
- `<h2>`: `text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3`
- `<p>`: `text-white/75 mb-4 leading-relaxed`
- `<ul>`: `text-white/75 pl-6 mb-4 list-disc space-y-1`
- `<a>`: `text-solarAmber hover:underline`

---

## Step 4: Create `src/PrivacyPolicyPage.tsx`

Renders inside `<LegalLayout title="Privacy Policy" lastUpdated="April 9, 2026">`.

Sets `document.title = 'Privacy Policy — Minsys'` on mount via `useEffect`.

**Content sections** (migrated from static HTML + PRD enhancements):

1. **Intro** -- Expand entity scope: "Minsys Holdings, LLC, together with its operating pillars -- The Nexus, The Venture Studio, The MVP Factory, and M&A Deal Desk (collectively, 'we', 'us', or 'our')..."

2. **1. Information We Collect** -- Keep existing 3 bullets, add 2 new:
   - *Partner Modal*: "Name, Email, Company Name, and Mandate description collected via the Partner contact form. Used by the M&A Deal Desk to evaluate capital partnerships and acquisition opportunities."
   - *Talent Modal*: "Name, Email, LinkedIn URL, Portfolio URL, and role-specific responses collected via the Talent page. Used for recruitment across our operating pillars."

3. **2. How We Use Your Information** -- Add bullets:
   - "Evaluate acquisition opportunities as part of 'Unlocking Main Street's Hidden Value by Spinning-Off Digital & AI Ventures'"
   - "Facilitate recruitment across our four operating pillars"

4. **3. Information Sharing** -- Add explicit: "We do not sell your personal data to third-party advertisers. Data is used exclusively for Minsys operational purposes."

5. **Sections 4-10** -- Migrate as-is from existing HTML (Cookies, Data Retention, Your Rights, Third-Party Links, Children's Privacy, Changes, Contact)

---

## Step 5: Create `src/TermsOfServicePage.tsx`

Renders inside `<LegalLayout title="Terms of Service" lastUpdated="April 9, 2026">`.

Sets `document.title = 'Terms of Service — Minsys'` on mount.

**Content sections** (migrated + PRD enhancements):

1. **Intro paragraph** -- Keep existing.

2. **1. About Minsys** (NEW section, inserted first):
   > "Minsys Holdings, LLC is a **Private Operating Group** centered on Venture Building funded by Micro Private Equity. We are not a public investment fund, mutual fund, or a publicly traded entity."

3. **2. Informational Purposes Only** -- Keep existing content.

4. **3. No Investment Solicitation** -- Enhance with:
   > "Minsys Holdings, LLC conducts private capital partnerships and investment activities. These discussions are strictly private and limited to **qualified, sophisticated parties** in accordance with applicable institutional lending and private placement laws."

5. **4. Proprietary Frameworks** (NEW section):
   > "The 'Venture-Led Micro-PE' Model and 'Augmentation over Automation' Vision described herein are proprietary frameworks of the Minsys Group and are provided for informational purposes only."

6. **5. Intellectual Property** -- Keep existing + add:
   > "Our Capabilities -- including Software Engineering, Competitive Intelligence, AI & Data, and Growth & Change Management -- are core IP that the Minsys Group leverages to conduct 'Unlocking Main Street's Hidden Value by Spinning-Off Digital & AI Ventures'."

7. **Remaining sections (6-12)** -- Renumber and migrate: Accuracy, Third-Party Links, Limitation of Liability, Privacy (cross-link), Governing Law, Changes, Contact.

---

## Step 6: Update `src/main.tsx`

Import and wire new components:
```tsx
import { PrivacyPolicyPage } from './PrivacyPolicyPage.tsx';
import { TermsOfServicePage } from './TermsOfServicePage.tsx';

<Router
  home={<App />}
  talent={<TalentPage />}
  privacyPolicy={<PrivacyPolicyPage />}
  termsOfService={<TermsOfServicePage />}
/>
```

---

## Step 7: Update `src/analytics.ts`

Update `currentPage()` (line 11-14) to recognize new routes:
```ts
function currentPage(): string {
  if (typeof window === 'undefined') return 'landing';
  const p = window.location.pathname;
  if (p === '/talent') return 'talent';
  if (p === '/privacy-policy') return 'privacy-policy';
  if (p === '/terms-of-service') return 'terms-of-service';
  return 'landing';
}
```

---

## Step 8: Update `vercel.json`

Add SPA rewrites to the `rewrites` array:
```json
{ "source": "/privacy-policy", "destination": "/index.html" },
{ "source": "/privacy-policy/", "destination": "/index.html" },
{ "source": "/terms-of-service", "destination": "/index.html" },
{ "source": "/terms-of-service/", "destination": "/index.html" }
```

---

## Step 9: Delete Static HTML Files

Remove `public/privacy-policy.html` and `public/terms-of-service.html` after verifying the React components work correctly.

---

## Verification

1. **Dev server** (`npm run dev`):
   - Footer links navigate without full page reload
   - URL updates to `/privacy-policy` and `/terms-of-service`
   - "Back to Home" returns to landing page via SPA nav
   - Browser back/forward works
   - Direct URL entry renders correct page
   - Scroll resets to top on navigation

2. **Analytics** (DevTools Network tab):
   - `page_view` event fires on navigation to legal pages
   - `nav_click` fires from footer links
   - `currentPage()` returns correct route name

3. **Responsive**: Test at 375px, 768px, 1280px+ -- `max-w-[64ch]` container stays readable

4. **Content**: All PRD-required additions present (Group structure, Partner/Talent data collection, operating company disclaimer, proprietary frameworks, IP)

5. **Vercel preview**: Push branch, verify direct navigation to `/privacy-policy` doesn't 404

---

## Implementation Order

1. Create worktree & branch
2. `src/LegalLayout.tsx` (no deps)
3. `src/PrivacyPolicyPage.tsx` + `src/TermsOfServicePage.tsx` (depend on LegalLayout)
4. `src/Router.tsx` (pure logic, parallel with 2-3)
5. `src/main.tsx` (depends on 3 + 4)
6. `src/analytics.ts` + `vercel.json` (independent, anytime)
7. Delete static HTML files (last, after verification)
