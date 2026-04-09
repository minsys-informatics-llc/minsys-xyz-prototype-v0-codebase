# PRD: Minsys Legal Pages & Group Disclosure Integration


This Product Requirements Document (PRD) outlines the implementation of the Privacy Policy and Terms of Service pages for the Minsys website. While static versions currently exist in the `public/` directory, this project will integrate them as native React components to ensure a seamless Single Page Application (SPA) experience and consistent styling with the "Venture-Led Micro-PE" brand identity.

## 1. Executive Summary

**Objective**: Codify the legal distinction between the **Minsys Group** (an operating entity) and a public investment fund, while clearly defining the scope of Minsys private capital activities based on the Micro Private Equity approach (a.k.a alternative PE with syndication).

## 2. User Stories

- **As the Owner (Laurent)**, I want the website to state that Minsys is a Group of companies that Operates with an hybrid Venture Building Micro-PE model to avoid regulatory confusion with public funds.

- **As a visitor**, I want to click the "Privacy Policy" or "Terms of Service" links in the footer and have the content loaded in separate pages . 

- **As a Capital Partner**, I want to understand that Minsys Holdings, LLC is the parent entity governing the group’s private investment and acquisition activities.
    

## 3. Functional Requirements

1. **SPA Routing**: Update `src/Router.tsx` to handle `/privacy-policy` and `/terms-of-service` natively.
    
2. **Global Footer Sync**: Update the `footer` in `src/App.tsx` to use the SPA router for legal links instead of standard HTML `<a>` tags.
    
3. **Analytics Integration**: Trigger `trackPageView` for each legal route to monitor compliance engagement.
    
4. **Responsive Design**: Content must be optimized for readability across mobile and desktop using the existing Tailwind configuration.
    

## 4. Content Specifications (Wording)

### 4.1. Privacy Policy (Minsys Holdings, LLC)

- **Group Structure**: State that this policy covers **Minsys Holdings, LLC** and its affiliated operating pillars (The Nexus, The Venture Studio, The MVP Factory, and the M&A Deal Desk).
    
- **Data Collection (Partnership Forms)**: Explicitly state that information collected via the "Partner Modal" (Name, Email, Company, Mandate) is used by the **M&A Deal Desk** to evaluate commercial lending and acquisition opportunities.

 - **Data Collection (Talent Forms)**: Explicitly state that information collected via the "Talent Modal" (Name, Email... ) is used by  - Actually I let you please create the logical wording according to your knowledge of Minsys Organization.  
    
- **Operational Usage**: Data is used to facilitate the "Unlocking Main Street's hidden Value by spinning-off Digital & AI Ventures" process and is not sold to third-party advertisers.
    

### 4.2. Terms of Service & Group Disclosure

- **Operating Company Disclaimer**: "Minsys is a **Private Operating Group** centered on Venture Building funded by Micro PE. We are not a public investment fund, mutual fund, or a publicly traded entity".
    
- **Private Investment Clarification**: "Minsys Holdings, LLC conducts private capital partnerships and investment activities. These discussions are strictly private and limited to **qualified, sophisticated parties** in accordance with applicable institutional lending and private placement laws".
    
- **Informational Scope**: "The 'Venture-Led Micro-PE' Model and 'Augmentation over Automation' Vision described herein are proprietary frameworks of the Minsys Group and are provided for informational purposes only".
    
- **Intellectual Property**: Assert ownership over the **Four Pillars** organization. Please make sure to detail that the Capabilities are core IP Minsys Group leverages to conduct the "Unlocking Main Street's hidden Value by spinning-off Digital & AI Ventures" .
    

## 5. Technical Implementation Plan

### 5.1. Update Router (`src/Router.tsx`)

TypeScript

```
export function getRoute(pathname: string): 'talent' | 'privacy' | 'tos' | 'home' {
  if (pathname === '/talent' || pathname === '/talent/') return 'talent';
  if (pathname === '/privacy-policy') return 'privacy';
  if (pathname === '/terms-of-service') return 'tos';
  return 'home';
}
```

### 5.2. Component Architecture

Create `src/LegalLayout.tsx` as a wrapper to maintain consistent "Back to Home" navigation and the `display-serif` typography used in the `Hero` component.

### 5.3. Footer Logic (`src/App.tsx`)

Replace the current static links with intercepted SPA routes to ensure the `Router` component can toggle views without a page refresh.

## 6. Design & Brand Alignment

- **Background**: Deep `#121210` (Dark Graphite) to maintain the premium, "private office" feel.
    
- **Headings**: `solarAmber` for primary headers to draw attention to the Operating Company disclaimers.
    
- **Prose**: Max-width of `64ch` for optimal readability of long-form legal text.