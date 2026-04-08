/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ─────────────────────────────────────────────────────────────
// Web3Forms configuration
// 1. Go to https://web3forms.com
// 2. Enter talent@minsys.xyz → "Create Access Key"
// 3. Replace YOUR_WEB3FORMS_ACCESS_KEY below.
// ─────────────────────────────────────────────────────────────
export const W3F_ACCESS_KEY = '262745d1-43ba-4b6b-bf8a-63f8d2d8d607';
export const W3F_ENDPOINT = 'https://api.web3forms.com/submit';

export type RoleId = 'ma' | 'ai' | 'tcm';

export interface Role {
  id: RoleId;
  title: string;
  pillar: string;
  employmentType: string;
  description: string;
  skills: string[];
  imageUrl: string;
  imageAlt: string;
}

export const roles: Role[] = [
  {
    id: 'ma',
    title: 'M&A Deal Desk Lead',
    pillar: 'M&A Deal Desk',
    employmentType: 'Full-time',
    description:
      'Responsible for identifying "boring," cash-flow positive Main Street businesses at 2x-4x EBITDA. You will build rigorous "Laggard-to-Visionary" transformation theses and secure commercial lending by proving our capability to maintain debt-servicing while deploying upside tech.',
    skills: [
      'Small-cap LBO modeling',
      'Commercial banking relationships',
      'Transformation-focused Due Diligence',
      '"Capability Gap" mapping',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=560&fit=crop&q=80',
    imageAlt: 'Financial analysis and deal-making',
  },
  {
    id: 'ai',
    title: 'Agentic AI Engineer',
    pillar: 'The MVP Factory',
    employmentType: 'Remote / Hybrid',
    description:
      'Build the "Operating System" for transformed legacy assets. You will use frontier model gateways and our proprietary AI Factory to build, train, and deploy agentic AI systems that convert raw legacy data into high-margin applications and autonomous workflows.',
    skills: [
      'Agentic Frameworks (LangChain, etc.)',
      'Frontier & Edge Model Gateways',
      'MLOps & Production Inference',
      'Rapid MVP TTM mindset',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=560&fit=crop&q=80',
    imageAlt: 'AI and machine learning development',
  },
  {
    id: 'tcm',
    title: 'Digital & AI Change Manager',
    pillar: 'Venture Studio',
    employmentType: 'Full-time',
    description:
      'Bridge the culture chasm. You will apply our "WorkshopThinking" frameworks to smoothly transition legacy management teams into an AI-native operational cadence, ensuring that tech upgrades feel like a seamless "upgrade" rather than a disruptive overhaul.',
    skills: [
      'Decoupled Deployment management',
      'Operational rewiring frameworks',
      'Stakeholder alignment (Main St. to Tech)',
      'Agile Change Leadership',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=560&fit=crop&q=80',
    imageAlt: 'Executive workshop and change management session',
  },
];

export type PillarId = 'dealdesk' | 'nexus' | 'studio' | 'factory';

export interface Pillar {
  id: PillarId;
  tag: string;
  title: string;
  description: string;
  exampleRoles: string[];
  imageUrl: string;
  imageAlt: string;
}

export const pillars: Pillar[] = [
  {
    id: 'dealdesk',
    tag: 'M&A Deal Desk',
    title: 'The Acquisition & Lending Engine',
    description:
      'Responsible for identifying prime Main Street targets and building rigorous "Laggard-to-Visionary" transformation theses. The Deal Desk secures institutional and commercial lending by proving our capability to maintain debt-servicing cash flows while deploying upside tech.',
    exampleRoles: [
      'M&A Deal Desk Lead',
      'Commercial Lending Officer',
      'Due Diligence Analyst',
      'Transformation Thesis Architect',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=560&fit=crop&q=80',
    imageAlt: 'Financial analysis and deal structuring',
  },
  {
    id: 'nexus',
    tag: 'The Nexus',
    title: 'The Parent Hub & IP Custodian',
    description:
      "The Nexus holds Minsys's proprietary IP, competitive market intelligence, and pre-nurtured vendor ecosystems. It governs the flow of assets across the group, ensuring we partner or acquire targets where we already have the \"on the shelf\" Digital & AI capabilities to win.",
    exampleRoles: [
      'IP Portfolio Manager',
      'Market Intelligence Analyst',
      'Vendor Ecosystem Lead',
      'Group Asset Coordinator',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=560&fit=crop&q=80',
    imageAlt: 'Network hub and connected systems',
  },
  {
    id: 'studio',
    tag: 'Venture Studio',
    title: 'The Portfolio & Change Management Arm',
    description:
      'The Studio oversees the operational integration of our Digital & AI ventures into the Main Street businesses. It manages change seamlessly, acting as the pivotal bridge between the newly partnered with or acquired legacy operators and the advanced technology being deployed.',
    exampleRoles: [
      'Digital & AI Change Manager',
      'Portfolio Integration Lead',
      'Operational Transformation Consultant',
      'Agile Program Manager',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=560&fit=crop&q=80',
    imageAlt: 'Workshop and change management session',
  },
  {
    id: 'factory',
    tag: 'The MVP Factory',
    title: 'The Rapid AI-Native Production Line',
    description:
      "The Factory operationalizes our technology, building and releasing production-ready tech in weeks, not months. By absorbing the R&D costs at the group level, the Factory ensures the Main Street business doesn't burn vital working capital to achieve its digital & AI transformation.",
    exampleRoles: [
      'Agentic AI Engineer',
      'Full-Stack Product Engineer',
      'MLOps & Inference Engineer',
      'Rapid Prototyping Lead',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=560&fit=crop&q=80',
    imageAlt: 'AI and machine learning production systems',
  },
];

// ─── Payload builders (pure, testable) ──────────────────────────

export interface RoleApplication {
  name: string;
  linkedin: string;
  portfolio: string;
  q1: string;
  q2: string;
}

export interface GeneralApplication {
  name: string;
  linkedin: string;
  portfolio: string;
  pillar: string;
}

export interface Web3FormsPayload {
  access_key: string;
  subject: string;
  from_name: string;
  message: string;
}

export function buildRolePayload(role: Role, app: RoleApplication): Web3FormsPayload {
  return {
    access_key: W3F_ACCESS_KEY,
    subject: `[Minsys Talent] New Application — ${role.title}`,
    from_name: app.name,
    message:
      `ROLE APPLIED FOR:\n${role.title}\n\n` +
      `APPLICANT NAME:\n${app.name}\n\n` +
      `LINKEDIN:\n${app.linkedin}\n\n` +
      `PORTFOLIO:\n${app.portfolio || 'Not provided'}\n\n` +
      `--- Q1: Why Minsys / Value & Strengths ---\n${app.q1}\n\n` +
      `--- Q2: Most Significant Accomplishment ---\n${app.q2}`,
  };
}

export function buildGeneralPayload(app: GeneralApplication): Web3FormsPayload {
  return {
    access_key: W3F_ACCESS_KEY,
    subject: `[Minsys Talent] General Interest — ${app.name}`,
    from_name: app.name,
    message:
      `APPLICANT NAME:\n${app.name}\n\n` +
      `LINKEDIN:\n${app.linkedin}\n\n` +
      `PORTFOLIO:\n${app.portfolio || 'Not provided'}\n\n` +
      `PILLAR INTEREST:\n${app.pillar}`,
  };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
}

export function clampToWordLimit(text: string, max = 500): { text: string; words: number } {
  const arr = text.trim().split(/\s+/).filter((w) => w.length > 0);
  if (arr.length <= max) return { text, words: arr.length };
  const clamped = arr.slice(0, max).join(' ');
  return { text: clamped, words: max };
}
