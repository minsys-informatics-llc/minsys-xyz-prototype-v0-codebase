/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { initAnalytics, trackEvent } from './analytics';
import { capabilities } from './data/capabilities';
import {
  PartnerApplication,
  PartnerType,
  buildPartnerPayload,
  countWords,
  W3F_ENDPOINT,
} from './data/talent';

import { Hero } from './Hero';

// ─── Partner Contact Modal ────────────────────────────────────────────────────

const PARTNER_COPY: Record<
  PartnerType,
  { title: string; description: string; messagePlaceholder: string }
> = {
  capital: {
    title: 'Partner with Minsys — Capital',
    description:
      "We're securing commercial lending for our next Main Street acquisition. Tell us about your mandate.",
    messagePlaceholder:
      'e.g. We manage a SME lending portfolio and are exploring co-investment in AI-led acquisitions. Happy to jump on a call.',
  },
  origination: {
    title: 'Partner with Minsys — Deal Origination',
    description:
      "You've identified a Main Street business ripe for transformation. Share the opportunity and we'll be in touch.",
    messagePlaceholder:
      "e.g. I'm aware of a profitable HVAC business with $2M EBITDA in the Southwest. The owner is open to a structured exit and transition.",
  },
};

const EMPTY_PARTNER_FORM: PartnerApplication = {
  name: '',
  email: '',
  company: '',
  message: '',
};

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

interface PartnerModalProps {
  type: PartnerType;
  onClose: () => void;
}

function PartnerModal({ type, onClose }: PartnerModalProps) {
  const copy = PARTNER_COPY[type];
  const form_id = type === 'capital' ? 'partner_capital' : 'partner_origination';

  const [form, setForm] = useState<PartnerApplication>(EMPTY_PARTNER_FORM);
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState('');
  const formStartFired = useRef(false);

  const messageWords = countWords(form.message);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleFieldChange = (
    field: keyof PartnerApplication,
    value: string,
  ) => {
    if (!formStartFired.current) {
      trackEvent('form_start', { form_id });
      formStartFired.current = true;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRetry = () => {
    setState('idle');
    setError('');
    formStartFired.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const payload = buildPartnerPayload(type, form);
      const res = await fetch(W3F_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission rejected.');
      setState('success');
      trackEvent('form_submit', { form_id });
      trackEvent('generate_prospect', { form_id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setState('error');
      trackEvent('form_error', { form_id, error_type: message });
    }
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-10 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-darkGraphite hover:bg-gray-100 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success state */}
        {state === 'success' ? (
          <div className="flex flex-col items-center text-center py-8 gap-6">
            <div className="w-16 h-16 bg-solarAmber/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-darkGraphite mb-2">Message received.</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Thank you for reaching out. We'll review your message and get back to you at <span className="font-medium text-darkGraphite">{form.email}</span> shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-solarAmber text-darkGraphite px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-3">Get in Touch</p>
              <h3 className="text-2xl font-bold text-darkGraphite mb-2">{copy.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{copy.description}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-1">
                  Full Name <span className="text-gray-400 normal-case font-normal tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  disabled={state === 'sending'}
                  className="w-full border-b border-gray-200 py-3 text-sm focus:border-solarAmber outline-none bg-transparent transition-colors disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-1">
                  Email Address <span className="text-gray-400 normal-case font-normal tracking-normal">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@firm.com"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  disabled={state === 'sending'}
                  className="w-full border-b border-gray-200 py-3 text-sm focus:border-solarAmber outline-none bg-transparent transition-colors disabled:opacity-50"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-1">
                  Company / Organization <span className="text-gray-400 normal-case font-normal tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Smith Capital Partners"
                  value={form.company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  disabled={state === 'sending'}
                  className="w-full border-b border-gray-200 py-3 text-sm focus:border-solarAmber outline-none bg-transparent transition-colors disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-solarAmber tracking-widest uppercase">
                    Brief Message <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <span className={`text-[10px] font-medium tabular-nums ${messageWords >= 180 ? 'text-solarAmber' : 'text-gray-400'}`}>
                    {messageWords} / 200 words
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder={copy.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  disabled={state === 'sending'}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm bg-[#fafafa] focus:bg-white focus:border-solarAmber outline-none resize-none transition-colors disabled:opacity-50"
                  style={{ minHeight: 110 }}
                />
              </div>

              {/* Error banner */}
              {state === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <p className="font-medium mb-1">Something went wrong.</p>
                  <p className="text-red-600/80 mb-3">{error}</p>
                  <p className="text-red-600/80">
                    You can also reach us at{' '}
                    <a href="mailto:partners@minsys.xyz" className="underline font-medium">partners@minsys.xyz</a>
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-3 text-xs font-bold text-red-700 underline cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={state === 'sending'}
                className="w-full bg-solarAmber text-darkGraphite py-4 rounded-xl font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state === 'sending' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeOrgTab, setActiveOrgTab] = useState<number>(1);
  const [partnerModal, setPartnerModal] = useState<PartnerType | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  const scrollCarousel = (direction: number) => {
    trackEvent('carousel_scroll', { direction: direction < 0 ? 'prev' : 'next' });
    carouselRef.current?.scrollBy({ left: direction * 400, behavior: 'smooth' });
  };

  const openPartnerModal = (type: PartnerType, cta_id: string, cta_text: string) => {
    trackEvent('cta_click', { cta_id, cta_text, destination: 'modal' });
    trackEvent('generate_lead', { lead_source: cta_id });
    setPartnerModal(type);
  };

  return (
    <div className="bg-white font-sans text-darkGraphite antialiased">
      {/* Navigation */}
      <header className="bg-darkGraphite border-b border-white/10 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-solarAmber rounded-sm flex items-center justify-center">
            <span className="text-darkGraphite font-bold text-xs">M</span>
          </div>
          <span className="text-white font-bold tracking-tight text-xl">Minsys</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <a className="hover:text-solarAmber transition-colors" href="#model" onClick={() => trackEvent('nav_click', { link_text: 'Model', link_url: '#model', link_location: 'header' })}>Model</a>
          <a className="hover:text-solarAmber transition-colors" href="#organization" onClick={() => trackEvent('nav_click', { link_text: 'Organization', link_url: '#organization', link_location: 'header' })}>Organization</a>
          <a className="hover:text-solarAmber transition-colors" href="#capabilities" onClick={() => trackEvent('nav_click', { link_text: 'Capabilities', link_url: '#capabilities', link_location: 'header' })}>Capabilities</a>
          <a className="hover:text-solarAmber transition-colors" href="/talent" onClick={() => trackEvent('nav_click', { link_text: 'Join Minsys', link_url: '/talent', link_location: 'header' })}>Join Minsys</a>
        </nav>
        <a
          className="bg-solarAmber text-darkGraphite px-6 py-2 rounded-md font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
          href="#getintouch"
          onClick={() => { trackEvent('cta_click', { cta_id: 'header_partner', cta_text: 'Partner with Us', destination: '#getintouch' }); trackEvent('generate_lead', { lead_source: 'header_partner' }); }}
        >
          Partner with Us
        </a>
      </header>

      <main>
        <Hero />

        {/* Proposition Section */}
        <section id="proposition" className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-6 -translate-y-12">
          <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-solarAmber tracking-widest uppercase mb-2">Why Now?</h2>
              <p className="text-gray-600 leading-relaxed">
                The valuation gap between Main Street and tech-enabled businesses has never been wider. While aging Main Street businesses offer <span className="text-solarAmber font-medium">stable cash flows and captive audiences</span>, they lack the DNA to digitalize and embrace the AI revolution, leaving massive enterprise value on the table.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-5.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-solarAmber tracking-widest uppercase mb-2">What we do</h2>
              <p className="text-gray-600 leading-relaxed">
                Minsys engineers asymmetric returns through a <span className="text-solarAmber font-medium">Venture Building Micro-PE Model</span>. We partner with, or acquire, profitable Main Street businesses at traditional multiples and deploy on-the-shelf Digital &amp; AI capabilities to fundamentally expand their margins, market share, and exit valuations.
              </p>
            </div>
          </div>
        </section>

        {/* Model Section */}
        <section id="model" className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Minsys Model</p>
              <h2 className="display-serif text-3xl mb-12">Venture Building Micro-PE <span className="underline">Model</span></h2>
              <nav className="space-y-6">
                {[
                  { id: 1, label: '1. Platform Acquisition', tab_id: 'platform_acquisition' },
                  { id: 2, label: '2. Venture Bootstrapping', tab_id: 'venture_bootstrapping' },
                  { id: 3, label: '3. Multiple Expansion', tab_id: 'multiple_expansion' },
                ].map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); trackEvent('tab_select', { tab_group: 'model', tab_id: tab.tab_id }); trackEvent('generate_lead', { lead_source: 'model_tab' }); }}
                    className={activeTab === tab.id
                      ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer transition-colors"
                      : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-8 bg-white p-12 rounded-2xl shadow-soft border border-gray-50">
              <div className="w-16 h-16 bg-solarAmber/10 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"></path></svg>
              </div>

              {/* All tab panels rendered in DOM for SEO; visibility toggled via CSS */}
              <div className={activeTab === 1 ? undefined : "hidden"}>
                <h3 className="display-serif text-3xl mb-6">Platform Acquisition</h3>
                <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Launchpad for Corporate Venturing</p>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                  We partner with asset-rich Business Owners through minority stakes or joint ventures, or we acquire profitable Main Street businesses at fair historical multiples. These businesses provide stable cash flow to fund growth and a built-in customer base for scaling net-new Digital &amp; AI-native business models.
                </p>
              </div>

              <div className={activeTab === 2 ? undefined : "hidden"}>
                <h3 className="display-serif text-3xl mb-6">Venture Bootstrapping</h3>
                <p className="display-serif text-2xl text-darkGraphite/70 mb-4">Zero-CAC Venture Rollout</p>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                  Before partnering or acquisition, we identify adjacent optimization or transformation opportunities. Post-close, we deploy proprietary, pre-built Digital &amp; AI capabilities subsidized by the Minsys Group. We transform operations and upsell the existing client base with effectively zero Customer Acquisition Cost (CAC), turning Laggards into Tech-Enabled Visionaries.
                </p>
              </div>

              <div className={activeTab === 3 ? undefined : "hidden"}>
                <h3 className="display-serif text-3xl mb-6">Multiple Expansion</h3>
                <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Tech-Enabled Arbitrage</p>
                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                  By fundamentally changing the unit economics and margins of the core business through Digital &amp; AI augmentation, we elevate Main Street from a traditional provider to a "Tech-Enabled Business" This translates a business stake bought at a legacy low single digit multiple into an asset valued at a premium tech multiple, creating notable equity upside.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Organization Section */}
        <section id="organization" className="bg-gray-50 py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-full bg-white p-10 rounded-2xl shadow-soft border border-gray-100 flex flex-col md:flex-row items-start gap-8 text-left">
                <div className="shrink-0 w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.84L16.16 11H7.84L12 7.84zM7 18v-5h10v5H7z"></path></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-2">Operating Model</p>
                  <h2 className="font-bold text-xl mb-3">Minsys Group Organization</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Our operating model is derisked by a highly specialized <span className="text-solarAmber font-medium">four-pillar organization</span>. Minsys handles the entire lifecycle in-house—from securing commercial lending based on solid M&amp;A theses, to deploying subsidized, rapid Digital & AI innovation into legacy operations without disrupting their cash-flowing core.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <p className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Minsys Organization</p>
                <h3 className="display-serif text-4xl mb-12">The Four Pillars <span className="underline">Organization</span></h3>
                <nav className="space-y-6">
                  {[
                    { id: 1, label: 'M&A Deal Desk', tab_id: 'ma_deal_desk' },
                    { id: 2, label: 'The Nexus', tab_id: 'the_nexus' },
                    { id: 3, label: 'The Venture Studio', tab_id: 'venture_studio' },
                    { id: 4, label: 'The MVP Factory', tab_id: 'mvp_factory' },
                  ].map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => { setActiveOrgTab(tab.id); trackEvent('tab_select', { tab_group: 'organization', tab_id: tab.tab_id }); trackEvent('generate_lead', { lead_source: 'organization_tab' }); }}
                      className={activeOrgTab === tab.id
                        ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer transition-colors"
                        : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                    >
                      <span>{tab.label}</span>
                      {activeOrgTab === tab.id && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="lg:col-span-8 bg-white p-12 rounded-2xl shadow-soft border border-gray-50">
                <div className="w-16 h-16 bg-solarAmber/10 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"></path></svg>
                </div>

                {/* All org tab panels rendered in DOM for SEO; visibility toggled via CSS */}
                <div className={activeOrgTab === 1 ? undefined : "hidden"}>
                  <h4 className="display-serif text-3xl mb-6">M&amp;A Deal Desk</h4>
                  <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Acquisition &amp; Lending Engine</p>
                  <p className="text-gray-600 leading-relaxed mb-10 text-lg">Responsible for identifying prime Main Street targets and building rigorous "Laggard-to-Visionary" transformation theses. The Deal Desk secures institutional and commercial lending by proving our capability to maintain debt-servicing cash flows while deploying upside tech.</p>
                </div>

                <div className={activeOrgTab === 2 ? undefined : "hidden"}>
                  <h4 className="display-serif text-3xl mb-6">The Nexus</h4>
                  <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Parent Hub &amp; IP Custodian</p>
                  <p className="text-gray-600 leading-relaxed mb-10 text-lg">The Nexus holds Minsys's proprietary IP, competitive market intelligence, and pre-nurtured vendor ecosystems. It governs the strategic flow of assets across the group, ensuring we partner or acquire targets where we already have the "on the shelf" Digital &amp; AI capabilities to win.</p>
                </div>

                <div className={activeOrgTab === 3 ? undefined : "hidden"}>
                  <h4 className="display-serif text-3xl mb-6">The Venture Studio</h4>
                  <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Portfolio &amp; Change Management Arm</p>
                  <p className="text-gray-600 leading-relaxed mb-10 text-lg">The Studio oversees the operational integration of our Digital &amp; AI ventures into the Main Street businesses. It manages change seamlessly, acting as the pivotal bridge between the newly partnered with or acquired legacy operators and the advanced technology being deployed.</p>
                </div>

                <div className={activeOrgTab === 4 ? undefined : "hidden"}>
                  <h4 className="display-serif text-3xl mb-6">The MVP Factory</h4>
                  <p className="display-serif text-2xl text-darkGraphite/70 mb-4">The Rapid AI-Native Production Line</p>
                  <p className="text-gray-600 leading-relaxed mb-10 text-lg">The Factory operationalizes our technology, building and releasing production-ready tech in weeks, not months. By absorbing the R&amp;D costs at the group level, the Factory ensures the Main Street business doesn't burn vital working capital to achieve its digital &amp; AI transformation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className="max-w-7xl mx-auto px-4 py-24">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Minsys Capabilities</p>
              <h3 className="display-serif text-3xl md:text-4xl mb-4">Off-the-Shelf Digital &amp; AI <span className="underline">Capabilities.</span></h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                We deploy our proprietary, battle-tested AI and Digital capabilities directly into Main Street businesses, ensuring rapid margin expansion and immediate market dominance.
              </p>
            </div>

            <div className="flex gap-4 shrink-0">
              <button
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous capability"
                className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-solarAmber hover:text-solarAmber transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                aria-label="Next capability"
                className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-solarAmber hover:text-solarAmber transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="flex overflow-x-auto gap-8 pb-8 no-scrollbar snap-x">
            {capabilities.map((cap, idx) => (
              <div key={cap.id} className="flex-none w-full md:w-[45%] lg:w-[35%] snap-start">
                <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                  <img
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    src={cap.imageUrl}
                    alt={cap.altText}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    decoding={idx === 0 ? 'sync' : 'async'}
                    width={700}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkGraphite/90 via-darkGraphite/30 to-transparent p-10 flex flex-col justify-end">
                    <div className="relative z-10 backdrop-blur-md bg-darkGraphite/40 rounded-2xl p-6 w-[calc(100%+5rem)] -mx-10">
                      <p className="text-[10px] text-solarAmber font-bold tracking-[0.2em] mb-4 uppercase">{cap.category}</p>
                      <div className="text-white/60 text-xs mb-4 leading-relaxed max-w-sm font-bold">
                        {cap.description}
                      </div>
                      <h3 className="display-serif text-3xl text-white">{cap.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section id="getintouch" className="bg-darkGraphite text-white py-32 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h2 className="display-serif text-4xl md:text-6xl mb-16 leading-tight">
              Explore Asymmetric Returns<br /> in the <span className="text-solarAmber italic">Digital &amp; AI Economy</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              {/* Card 1: Capital Partners */}
              <div className="bg-white/5 backdrop-blur-md p-12 rounded-3xl border border-solarAmber/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-solarAmber/10 rounded-xl flex items-center justify-center mb-8">
                  <svg aria-hidden="true" className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M13.13 22.19l-1.63-3.83c1.57-.64 3.05-1.56 4.37-2.71l2.83 2.83c-1.74 1.74-3.76 3.12-5.57 3.71M7.5 18.47l2.83-2.83c1.32 1.15 2.8 2.07 4.37 2.71l-1.63 3.83c-1.81-.59-3.83-1.97-5.57-3.71M2.19 13.13l3.83-1.63c.64 1.57 1.56 3.05 2.71 4.37l-2.83 2.83c-1.74-1.74-3.12-3.76-3.71-5.57M18.47 7.5l2.83-2.83c1.15 1.32 2.07 2.8 2.71 4.37l-3.83 1.63c-.64-1.57-1.56-3.05-2.71-4.37M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Capital Partners</h3>
                <p className="text-white/60 mb-8 leading-relaxed">Connect with our M&amp;A Deal Desk regarding commercial lending for our next cash-flowing acquisition.</p>
                <button
                  onClick={() => openPartnerModal('capital', 'contact_deal_desk', 'Contact Deal Desk')}
                  className="w-full bg-solarAmber text-darkGraphite py-4 rounded-xl font-bold hover:brightness-110 transition-all cursor-pointer"
                >
                  Contact Deal Desk
                </button>
              </div>

              {/* Card 2: M&A Origination Partners */}
              <div className="bg-white/5 backdrop-blur-md p-12 rounded-3xl flex flex-col items-center text-center border border-white/5">
                <div className="w-12 h-12 bg-solarAmber/10 rounded-xl flex items-center justify-center mb-8">
                  <svg aria-hidden="true" className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">M&amp;A Origination Partners</h3>
                <p className="text-white/60 mb-8 leading-relaxed">You identified a Main Street opportunity ripe for Digital &amp; AI transformation and margin expansion? Let's get in touch.</p>
                <button
                  onClick={() => openPartnerModal('origination', 'partner_body', 'Partner with Us')}
                  className="w-full border border-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/5 transition-all cursor-pointer"
                >
                  Partner with Us
                </button>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#121210] text-white/40 py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 flex-1 justify-start">
            <div className="w-6 h-6 bg-solarAmber/20 rounded flex items-center justify-center">
              <span className="text-solarAmber font-bold text-[8px]">M</span>
            </div>
            <span className="text-white/80 font-bold text-sm">Minsys</span>
          </div>
          <div className="text-center text-sm md:text-base leading-relaxed text-white/80 flex-1">
            Minsys | Venture Building Micro-PE Group<br />
            Augmentation over Automation<br />
            © 2026 <span className="italic">Minsys Holdings, LLC.</span> All rights reserved.
          </div>
          <div className="flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase flex-1 justify-end">
            <a className="hover:text-white transition-colors" href="/privacy-policy" onClick={() => trackEvent('nav_click', { link_text: 'Privacy Policy', link_url: '/privacy-policy', link_location: 'footer' })}>Privacy Policy</a>
            <a className="hover:text-white transition-colors" href="/terms-of-service" onClick={() => trackEvent('nav_click', { link_text: 'Terms of Service', link_url: '/terms-of-service', link_location: 'footer' })}>Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Partner Contact Modal */}
      {partnerModal && (
        <PartnerModal
          type={partnerModal}
          onClose={() => setPartnerModal(null)}
        />
      )}
    </div>
  );
}
