/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from './analytics';
import {
  roles,
  pillars,
  type Role,
  type RoleId,
  type PillarId,
  W3F_ENDPOINT,
  buildRolePayload,
  buildGeneralPayload,
  countWords,
  clampToWordLimit,
} from './data/talent';

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

function injectJobPostingJsonLd() {
  const existing = document.querySelectorAll('script[data-talent-jsonld="true"]');
  existing.forEach((el) => el.remove());

  roles.forEach((role) => {
    const data = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: role.title,
      description: role.description,
      datePosted: new Date().toISOString().slice(0, 10),
      employmentType: role.employmentType.toUpperCase().includes('REMOTE')
        ? 'FULL_TIME'
        : 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Minsys',
        sameAs: 'https://minsys.xyz',
        logo: 'https://minsys.xyz/assets/logo.png',
      },
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'Worldwide',
      },
      directApply: true,
      url: `https://minsys.xyz/talent#card-${role.id}`,
      industry: role.pillar,
      skills: role.skills.join(', '),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-talent-jsonld', 'true');
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  });
}

interface RoleFormState {
  name: string;
  linkedin: string;
  portfolio: string;
  q1: string;
  q2: string;
}

const EMPTY_FORM: RoleFormState = { name: '', linkedin: '', portfolio: '', q1: '', q2: '' };

interface RoleCardProps {
  role: Role;
  isOpen: boolean;
  onToggle: (id: RoleId) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, isOpen, onToggle }) => {
  const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState<string>('');
  const formStartFired = useRef(false);

  const handleFormFocus = () => {
    if (formStartFired.current) return;
    formStartFired.current = true;
    trackEvent('form_start', { form_id: 'role_apply', role_id: role.id });
  };

  const update = (k: keyof RoleFormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const updateQuestion = (k: 'q1' | 'q2', v: string) => {
    const { text } = clampToWordLimit(v, 500);
    setForm((f) => ({ ...f, [k]: text }));
  };

  const q1Words = countWords(form.q1);
  const q2Words = countWords(form.q2);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const payload = buildRolePayload(role, form);
      const res = await fetch(W3F_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Web3Forms rejected the submission.');
      setState('success');
      trackEvent('form_submit', { form_id: 'role_apply', role_id: role.id });
      trackEvent('generate_prospect', { form_id: 'role_apply' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setState('error');
      trackEvent('form_error', { form_id: 'role_apply', error_type: message });
    }
  };

  return (
    <div
      id={`card-${role.id}`}
      className="group bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-soft hover:border-solarAmber/30 transition-all"
    >
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="flex flex-col justify-between md:w-2/3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-solarAmber/10 text-solarAmber text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {role.pillar}
              </span>
              <span className="text-gray-400 text-xs">• {role.employmentType}</span>
            </div>
            <h3 className="display-serif text-3xl mb-6">{role.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">{role.description}</p>
            <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-500 italic">
              {role.skills.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => {
                if (!isOpen) {
                  trackEvent('role_interest', { role_id: role.id, role_title: role.title });
                  trackEvent('generate_lead', { lead_source: 'role_interest' });
                }
                onToggle(role.id);
              }}
              className={
                'inline-flex items-center gap-2 font-bold text-sm px-7 py-2.5 rounded-md border-2 transition-all cursor-pointer ' +
                (isOpen
                  ? 'bg-transparent text-darkGraphite border-darkGraphite hover:bg-darkGraphite hover:text-white'
                  : 'bg-solarAmber text-darkGraphite border-transparent hover:brightness-110')
              }
              aria-expanded={isOpen}
              aria-controls={`form-${role.id}`}
            >
              {isOpen ? 'Close Form' : 'Apply for Role'}
              <svg
                className={'w-4 h-4 transition-transform ' + (isOpen ? 'rotate-90' : '')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/3 items-center">
          <img
            src={role.imageUrl}
            alt={role.imageAlt}
            loading="lazy"
            decoding="async"
            width={600}
            height={208}
            className="w-full h-52 object-cover rounded-xl"
          />
        </div>
      </div>

      <div
        id={`form-${role.id}`}
        className="grid transition-all duration-[400ms] ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '2rem' : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 pt-8">
            <div className="inline-flex items-center gap-2 bg-[#FFF7F7] border border-solarAmber/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-solarAmber mb-5">
              Applying for: {role.title}
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6 bg-gray-50/50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Full Job Description
              </p>
              <p className="text-gray-400 text-sm italic leading-relaxed">
                The detailed job description for this role will be published here once finalized by
                the Hiring Manager. In the meantime, the summary above covers the core scope and
                required competencies.
              </p>
            </div>

            {state === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <svg
                  className="w-10 h-10 text-solarAmber"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="display-serif text-2xl">Application received.</h4>
                <p className="text-gray-500 text-sm max-w-sm">
                  We will review your profile and be in touch if there is a fit. Thank you for your
                  interest in Minsys.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} onFocus={handleFormFocus} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={(e) => update('linkedin', e.target.value)}
                      className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Professional Portfolio / Online Presence
                  </label>
                  <input
                    type="url"
                    placeholder="Online portfolio, website, blog, Github…"
                    value={form.portfolio}
                    onChange={(e) => update('portfolio', e.target.value)}
                    className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-4 my-6">
                  <span className="flex-1 h-px bg-gray-200" />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400">
                    Tell us about you
                  </span>
                  <span className="flex-1 h-px bg-gray-200" />
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Question 1
                  </span>
                  <p className="text-[15px] text-darkGraphite font-medium mb-3 leading-snug">
                    Why do you want to work at Minsys? Please describe the value you could bring to
                    the team and the type of role that best suits your strengths.
                  </p>
                  <textarea
                    rows={5}
                    required
                    value={form.q1}
                    onChange={(e) => updateQuestion('q1', e.target.value)}
                    placeholder="Your answer…"
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm bg-[#fafafa] focus:bg-white focus:border-solarAmber outline-none transition-colors leading-relaxed resize-y min-h-[130px]"
                  />
                  <p
                    className={
                      'text-[11px] text-right mt-1 transition-colors ' +
                      (q1Words >= 450 ? 'text-solarAmber' : 'text-gray-400')
                    }
                  >
                    {q1Words} / 500 words
                  </p>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                    Question 2
                  </span>
                  <p className="text-[15px] text-darkGraphite font-medium mb-3 leading-snug">
                    Describe your most significant accomplishment. We are especially interested in
                    the <em>how</em> — the steps you took, and what you learned along the way.
                  </p>
                  <textarea
                    rows={5}
                    required
                    value={form.q2}
                    onChange={(e) => updateQuestion('q2', e.target.value)}
                    placeholder="Your answer…"
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm bg-[#fafafa] focus:bg-white focus:border-solarAmber outline-none transition-colors leading-relaxed resize-y min-h-[130px]"
                  />
                  <p
                    className={
                      'text-[11px] text-right mt-1 transition-colors ' +
                      (q2Words >= 450 ? 'text-solarAmber' : 'text-gray-400')
                    }
                  >
                    {q2Words} / 500 words
                  </p>
                </div>

                {state === 'error' && (
                  <p className="text-sm text-solarAmber" role="alert">
                    {error} — please retry or email talent@minsys.xyz
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="w-full bg-darkGraphite text-white py-5 rounded-xl font-bold hover:bg-black transition-all cursor-pointer disabled:opacity-60"
                  >
                    {state === 'sending' ? 'Sending…' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function GeneralApplicationSection() {
  const [activePillar, setActivePillar] = useState<PillarId>('dealdesk');
  const [form, setForm] = useState({ name: '', linkedin: '', portfolio: '', pillar: '' });
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState('');
  const formStartFired = useRef(false);

  const handleFormFocus = () => {
    if (formStartFired.current) return;
    formStartFired.current = true;
    trackEvent('form_start', { form_id: 'general_apply' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const payload = buildGeneralPayload(form);
      const res = await fetch(W3F_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Web3Forms rejected the submission.');
      setState('success');
      trackEvent('form_submit', { form_id: 'general_apply', pillar: form.pillar });
      trackEvent('generate_prospect', { form_id: 'general_apply' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setState('error');
      trackEvent('form_error', { form_id: 'general_apply', error_type: message });
    }
  };

  return (
    <section id="general-application" className="bg-lightGray">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="display-serif text-4xl mb-4">General Application</h2>
          <p className="text-gray-500">
            Don't see a role that fits? Minsys is built on four pillars — Deal Desk, The MVP
            Factory, Venture Studio, and The Nexus — and we're always looking for exceptional people
            who can operate across them. Share your profile and tell us which pillar resonates with
            you.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex gap-0 border-b-2 border-gray-200 mb-8 overflow-x-auto">
            {pillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setActivePillar(p.id); trackEvent('tab_select', { tab_group: 'talent_pillar', tab_id: p.id }); trackEvent('generate_lead', { lead_source: 'talent_pillar_tab' }); }}
                className={
                  'px-6 py-3 text-xs font-bold tracking-wider uppercase whitespace-nowrap border-b-[3px] -mb-[2px] transition-colors cursor-pointer ' +
                  (activePillar === p.id
                    ? 'text-darkGraphite border-solarAmber'
                    : 'text-gray-400 border-transparent hover:text-darkGraphite')
                }
              >
                {p.tag}
              </button>
            ))}
          </div>

          {pillars.map((p) => (
            <div key={p.id} className={activePillar === p.id ? 'block' : 'hidden'}>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-soft">
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="flex flex-col gap-6 md:w-2/3">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-solarAmber/10 text-solarAmber text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="display-serif text-3xl mb-2">{p.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6 text-lg">{p.description}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Example Roles
                      </p>
                      <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-500 italic">
                        {p.exampleRoles.map((r) => (
                          <li key={r}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/3 items-center">
                    <img
                      src={p.imageUrl}
                      alt={p.imageAlt}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={208}
                      className="w-full h-52 object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-soft">
          {state === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <svg
                className="w-10 h-10 text-solarAmber"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="display-serif text-2xl">Application received.</h4>
              <p className="text-gray-500 text-sm max-w-sm">
                We have received your profile. We will be in touch if there is a match.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} onFocus={handleFormFocus} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Professional Portfolio / Online Presence
                </label>
                <input
                  type="url"
                  placeholder="Online portfolio, website, blog, Github…"
                  value={form.portfolio}
                  onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                  className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Which Pillar Interests You?
                </label>
                <select
                  required
                  value={form.pillar}
                  onChange={(e) => setForm({ ...form, pillar: e.target.value })}
                  className="w-full border-b border-gray-200 py-3 focus:border-solarAmber outline-none transition-colors bg-transparent"
                >
                  <option value="" disabled hidden>
                    Choose…
                  </option>
                  <option>M&A Deal Desk</option>
                  <option>The MVP Factory</option>
                  <option>Venture Studio</option>
                  <option>The Nexus</option>
                </select>
              </div>
              {state === 'error' && (
                <p className="text-sm text-solarAmber" role="alert">
                  {error} — please retry or email talent@minsys.xyz
                </p>
              )}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full bg-darkGraphite text-white py-5 rounded-xl font-bold hover:bg-black transition-all cursor-pointer disabled:opacity-60"
                >
                  {state === 'sending' ? 'Sending…' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function TalentPage() {
  const [openRole, setOpenRole] = useState<RoleId | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Minsys | Talent — Join the Venture Engine';
    injectJobPostingJsonLd();
    return () => {
      document.title = prevTitle;
      document
        .querySelectorAll('script[data-talent-jsonld="true"]')
        .forEach((el) => el.remove());
    };
  }, []);

  const toggleRole = (id: RoleId) => setOpenRole((cur) => (cur === id ? null : id));

  return (
    <div className="bg-white font-sans text-darkGraphite antialiased">
      <header className="bg-darkGraphite border-b border-white/10 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-solarAmber rounded-sm flex items-center justify-center">
            <span className="text-darkGraphite font-bold text-xs">M</span>
          </div>
          <span className="text-white font-bold tracking-tight text-xl">Minsys</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <a className="hover:text-solarAmber transition-colors" href="/#model" onClick={() => trackEvent('nav_click', { link_text: 'Model', link_url: '/#model', link_location: 'header' })}>
            Model
          </a>
          <a className="hover:text-solarAmber transition-colors" href="/#organization" onClick={() => trackEvent('nav_click', { link_text: 'Organization', link_url: '/#organization', link_location: 'header' })}>
            Organization
          </a>
          <a className="hover:text-solarAmber transition-colors" href="/#capabilities" onClick={() => trackEvent('nav_click', { link_text: 'Capabilities', link_url: '/#capabilities', link_location: 'header' })}>
            Capabilities
          </a>
        </nav>
        <a
          className="bg-solarAmber text-darkGraphite px-6 py-2 rounded-md font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
          href="#open-positions"
          onClick={() => { trackEvent('cta_click', { cta_id: 'header_join', cta_text: 'Join Minsys', destination: '#open-positions' }); trackEvent('generate_lead', { lead_source: 'header_join' }); }}
        >
          Join Minsys
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-darkGraphite text-white pt-24 pb-32 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div
              className="absolute inset-0 backdrop-blur-md -m-10 p-10 rounded-2xl pointer-events-none"
              style={{ backgroundColor: 'rgba(162, 162, 154, 0.1)', zIndex: -1 }}
            />
            <h4 className="text-solarAmber font-bold tracking-[0.3em] uppercase text-xs mb-6">
              Join Minsys — Augmentation over Automation
            </h4>
            <h1 className="display-serif text-4xl md:text-5xl font-black mb-8 leading-tight">
              Ultimately, Human Ingenuity <br className="hidden md:block" />{' '}
              <span className="italic text-solarAmber">is our North Star</span>
            </h1>
            <h2 className="text-[#F8F9FA] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light">
              <span className="font-bold">As a Talent</span>, you seek an environment where your
              professional brilliance is augmented and elevated, never automated away. Partner with
              us to build the future of Main Street.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <a
                href="#open-positions"
                className="bg-solarAmber text-darkGraphite px-10 py-4 text-base font-bold rounded-lg hover:scale-105 transition-transform text-center w-full sm:w-auto"
                onClick={() => { trackEvent('cta_click', { cta_id: 'hero_open_positions', cta_text: 'Open Positions', destination: '#open-positions' }); trackEvent('generate_lead', { lead_source: 'hero_open_positions' }); }}
              >
                Open Positions
              </a>
              <a
                href="#general-application"
                className="border border-white/20 text-white px-10 py-4 text-base font-bold rounded-lg hover:bg-white/5 transition-colors text-center w-full sm:w-auto"
                onClick={() => { trackEvent('cta_click', { cta_id: 'hero_general_application', cta_text: 'General Application', destination: '#general-application' }); trackEvent('generate_lead', { lead_source: 'hero_general_application' }); }}
              >
                General Application
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-solarAmber/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-solarAmber/50 to-transparent" />
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-16">
            <h2 className="display-serif text-4xl mb-4">Open Positions</h2>
            <p className="text-gray-500 max-w-6xl">
              We are scaling. Partner with us. We seek high-agency Talent to make an impact
              unlocking Main Street's hidden Value by spinning-off Digital & AI Ventures.
            </p>
          </div>
          <div className="space-y-8">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isOpen={openRole === role.id}
                onToggle={toggleRole}
              />
            ))}
          </div>
        </section>

        <GeneralApplicationSection />

        {/* Semantic JD block for non-JS crawlers */}
        <noscript>
          <section aria-label="Open Positions (text)">
            <h2>Open Positions at Minsys</h2>
            {roles.map((role) => (
              <article key={role.id}>
                <h3>{role.title}</h3>
                <p>
                  <strong>Pillar:</strong> {role.pillar} — <strong>Type:</strong>{' '}
                  {role.employmentType}
                </p>
                <p>{role.description}</p>
                <ul>
                  {role.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p>
                  Apply: <a href="mailto:talent@minsys.xyz">talent@minsys.xyz</a>
                </p>
              </article>
            ))}
          </section>
        </noscript>
      </main>

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
            Augmentation over Automation<br />© 2026{' '}
            <span className="italic">Minsys Holdings, LLC.</span> All rights reserved.
          </div>
          <div className="flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase flex-1 justify-end">
            <a className="hover:text-white transition-colors" href="/privacy-policy" onClick={() => trackEvent('nav_click', { link_text: 'Privacy Policy', link_url: '/privacy-policy', link_location: 'footer' })}>
              Privacy Policy
            </a>
            <a className="hover:text-white transition-colors" href="/terms-of-service" onClick={() => trackEvent('nav_click', { link_text: 'Terms of Service', link_url: '/terms-of-service', link_location: 'footer' })}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
