# Product Requirements Document (PRD): Minsys Talent Acquisition Engine

**Version:** 1.0

**Owner:** Laurent (Business Owner)

**Stakeholders:** Product Owner, Scrum Master, Dev Team

---

## 1. Executive Summary & Goals

The goal of this feature is to communicate Minsys’s urgent hiring needs for specialized roles that drive the "Laggard-to-Visionary" transformation. We are moving away from a traditional "Careers" approach to a "Venture Engine" recruitment model that attracts elite operators capable of executing Leveraged Buyouts (LBOs) and rapid Digital & AI-native product development.

---

## 2. Target Audience & Personas

The recruitment strategy is designed to reach elite talent through two distinct pathways: **Strategic Open Positions** for immediate high-impact needs, and **General Pillar Applications** for high-agency individuals who align with Minsys’s core structures but may not fit a specific active role.

### 2.1 Strategic Open Positions

We are currently targeting three immediate elite profiles:

- **The M&A Deal Desk Lead:** Financial Engineers and M&A specialists capable of identifying prime Main Street targets and building "Laggard-to-Visionary" transformation theses.
- **The Agentic AI Engineer:** Frontier AI developers tasked with building the "Operating System" for transformed legacy assets within The MVP Factory, focused on rapid MVP TTM and autonomous workflows.
- **Digital & AI Change Manager:** Agile change leaders capable of bridging the culture chasm, ensuring seamless transition of legacy management teams into an AI-native operational cadence via Venture Studio.

### 2.2 General Pillar Applications

For candidates whose expertise spans multiple disciplines or who bring unique, unlisted "Human Ingenuity," Minsys offers a general intake point. These applicants categorize themselves into one of the four foundational pillars (Deal Desk, Nexus, Studio, Factory), ensuring they are indexed within the parent group for future venture-led opportunities.

---

## 3. Functional Requirements

### 3.1 Homepage: The "Join Minsys" Entry Point

Do NOT modifiy this - it is just for your information

- **Location:** The {/*CTA Section*/} of App.tsx

- **Requirement:** Transform the current 2-column grid ("Capital Partners" and "M&A Origination Partners") into a 3-column layout or a 2+1 responsive grid.

- **Content:**

  - **Title:** Join Minsys.

  - **Body:** We are seeking elite M&A specialists,Agentic AI Engineer, and Change Managers to help us rewire Main Street.

  - **CTA:** Button labeled "Express your Interest" linking to the dedicated `/talent` page.

- **Visual Alignment:** Use the existing Solar Amber (#FD5E53) and Dark Graphite (#1A1A17) palette.

### 3.2 Dedicated Page: The Talent/Join Page

- **URL Path:** `/talent`.
- 

- **Layout Structure & Visuals:** Built on a single-page flow featuring a dark theme header/footer and a clean, responsive layout utilizing Solar Amber (`#FD5E53`), Dark Graphite (`#1A1A17`), and Light Gray (`#F7F7F7`) backgrounds. Content organized into distinct, expansive cards with soft shadow effects.
- **Header:** Sticky navigation bar containing navigation links to Model, Organization, Capabilities, and a highlighted CTA "Join Minsys" pointing to the Open Positions section.

- **Hero Section:**
  - **Visuals:** Dark background with backdrop blur elements, creating a focused center card.
  - **Messaging:** Emphasizes that "Human Ingenuity is our North Star" and that talent's brilliance is "augmented and elevated, never automated away."
  - **CTAs:** Two primary buttons centered within the hero block—"Open Positions" and "General Application" linking downwards to their respective sections.

- **Open Positions Section:**
  - Displays specific hiring gaps as responsive horizontal cards (2/3 text, 1/3 image layout on desktop).
  - Listed Roles: M&A Deal Desk Lead, Agentic AI Engineer, Digital & AI Change Manager.
  - Action: "Apply for Role" amber button which triggers an inline accordion form dropdown beneath the card.

- **Application Form UX (Inline & General):**
  - **Inline Form:** Contains a "JD Placeholder" for the full job description. Collects Full Name, LinkedIn, Professional Portfolio, and features two long-form questions focused on value/strengths and significant accomplishments with word count tracking.
  - **State Management:** Immediate inline feedback toggling to "Application received" state upon submission.
  - **Integration:** Powered natively by Web3Forms `fetch` API directly addressing `talent@minsys.xyz` without needing SDKs or backend servers.

- **General Application Section (`#general-application`):**
  - Designed for candidates who don't fit the exact open profiles but want to connect with a specific pillar.
  - **Pillar Tabs Explorer:** A 4-tab component allowing the user to browse Minsys's core structures: 
    1. **M&A Deal Desk** (The Acquisition & Lending Engine)
    2. **The Nexus** (The Parent Hub & IP Custodian)
    3. **Venture Studio** (The Portfolio & Change Management Arm)
    4. **The MVP Factory** (The Rapid AI-Native Production Line)
  - **Tab UI:** Each active tab reveals a custom card layout mirroring the open positions (orange tag, title, description, 4 example roles, and 1/3 thematic image).
  - **General Form:** Simplified form capturing Name, LinkedIn, Portfolio, and a mandatory Dropdown Selection to indicate which of the 4 Pillars interests the candidate most.

### 3.3 AI-Native Indexing & SEO (Compliance)

- **`llms.txt` & `llms-full.txt` Update:** Add structured summaries of these roles to the `/public` indexing files to ensure AI-based recruiters (ClaudeBot, GPTBot) can recommend candidates.

- **Schema.org:** Implement `JobPosting` JSON-LD structured data for each role to appear in Google Jobs.

- **`<noscript>` Block:** Include the semantic HTML version of the JDs for non-JavaScript crawlers.

---

## 4. Technical Requirements (Architecture)

- **Frontend:** React components styled with Tailwind CSS.

- **Routing:** Add the new route to `App.tsx`.

- **Performance:** Maintain the existing high-performance standard (Vite build).

---

## 5. Success Metrics

- **Conversion Rate:** Percentage of visitors who move from the Homepage "Join" card to the Talent page.

- **Candidate Quality:** Number of applications received with backgrounds in PE, AI Orchestration, or Agile Change Management.

- **AI Discovery:** Verification that GPT-4/Claude can describe Minsys's hiring needs after crawling `llms.txt`.
