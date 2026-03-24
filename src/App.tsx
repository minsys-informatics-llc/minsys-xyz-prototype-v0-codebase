/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { initAnalytics } from './analytics';
import { projects } from './data/projects';

import { Hero } from './Hero';

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeOrgTab, setActiveOrgTab] = useState<number>(1);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start', 
      loop: true,
      duration: 35, // Adjusted for smoother transition (approx 600-700ms)
    }, 
    [
      Autoplay({ 
        delay: 3000, 
        stopOnInteraction: false,
        stopOnMouseEnter: true 
      })
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    initAnalytics();
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // JS-based email obfuscation
    const user = 'contact';
    const domain = 'minsys.xyz';
    window.location.href = `mailto:${user}@${domain}`;
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
          <a className="hover:text-solarAmber transition-colors" href="#vaas">Venture-as-a-Service</a>
          <a className="hover:text-solarAmber transition-colors" href="#organization">Organization</a>
          <a className="hover:text-solarAmber transition-colors" href="#portfolio">Portfolio</a>
        </nav>
        <a 
          className="bg-solarAmber text-darkGraphite px-6 py-2 rounded-md font-bold text-sm hover:brightness-110 transition-all cursor-pointer" 
          href="#getintouch"
        >
          Contact
        </a>
      </header>

      <main>
        <Hero />

        {/* Proposition Section */}
        <section id="proposition" className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-6 -translate-y-12">
          {/* Why Now Card */}
          <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-solarAmber tracking-widest uppercase mb-2">Why Now?</h3>
              <p className="text-mutedText leading-relaxed text-mutedText">
                When the market demands <span className="text-solarAmber font-medium">next-gen digital or AI capabilities</span>, a standard 'project' is no longer enough to maintain your competitive edge. You require a <span className="text-solarAmber font-medium">sustainable, economically viable entity</span> that can grow with the opportunity.
              </p>
            </div>
          </div>
          {/* Our Proposition Card */}
          <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-5.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-solarAmber tracking-widest uppercase mb-2">Our Proposition</h3>
              <p className="text-mutedText leading-relaxed text-mutedText">
                Minsys offers a unique, re-founded model that moves <span className="text-solarAmber font-medium">beyond delivering products or services</span>; we bootstrap a dedicated business venture purpose-built to materialize your specific business goals, <span className="text-solarAmber font-medium">engineered with a viable business model</span> from the start.
              </p>
            </div>
          </div>
        </section>

        {/* Offering Section */}
        <section id="vaas" className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Sidebar */}
            <div className="lg:col-span-4">
              <h3 className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Our Offering</h3>
              <h2 className="display-serif text-4xl mb-12">Venture-as-a-Service</h2>
              <nav className="space-y-6">
                <div 
                  onClick={() => setActiveTab(1)}
                  className={activeTab === 1 
                    ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                    : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                >
                  <span>Custom Spinoffs</span>
                  {activeTab === 1 && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  )}
                </div>
                <div 
                  onClick={() => setActiveTab(2)}
                  className={activeTab === 2 
                    ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                    : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                >
                  <span>Velocity &amp; TTM</span>
                  {activeTab === 2 && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  )}
                </div>
                <div 
                  onClick={() => setActiveTab(3)}
                  className={activeTab === 3 
                    ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                    : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                >
                  <span>Operational Excellence</span>
                  {activeTab === 3 && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  )}
                </div>
              </nav>
            </div>
            {/* Right Content */}
            <div className="lg:col-span-8 bg-white p-12 rounded-2xl shadow-soft border border-gray-50">
              <div className="w-16 h-16 bg-solarAmber/10 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"></path></svg>
              </div>
              
              {activeTab === 1 && (
                <>
                  <h3 className="display-serif text-3xl mb-6">Engineered for Venture Success</h3>
                  <p className="text-mutedText leading-relaxed mb-10 text-lg">
                    We scale a high-yield business asset. For you, this means the acquisition of a net-new revenue stream. We integrate the "P" (Profitable) of our LAP model into every spinoff, ensuring your new venture is a value-generating asset rather than a cost center.
                  </p>
                </>
              )}
              
              {activeTab === 2 && (
                <>
                  <h3 className="display-serif text-3xl mb-6">Your Fast-Track to Market</h3>
                  <p className="text-mutedText leading-relaxed mb-10 text-lg">
                    We eliminate the friction of traditional setup and hiring. By activating our pre-nurtured Lean Augmented Ecosystem and our Venture-as-a-Service Platform, we achieve a drastically compressed Time-To-Market (TTM). Minsys allows you to bypass months of development lag, reaching market validation while the window of opportunity is widest.
                  </p>
                </>
              )}
              
              {activeTab === 3 && (
                <>
                  <h3 className="display-serif text-3xl mb-6">A Lean & AI-Powered Foundation</h3>
                  <p className="text-mutedText leading-relaxed mb-10 text-lg">
                    Your venture inherits the "L" (Lean) and "A" (AI-Powered) from the Minsys LAP operating model. By augmenting People, Teams and Value-Streams with agentic workflows, we ensure your spinoff is engineered to be scalable, and structured for profitability.
                  </p>
                </>
              )}

              <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-4 text-xs font-bold tracking-widest text-mutedText uppercase">
                <svg className="w-5 h-5 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Technical Visual: LAP Profitability Engine Enabled
              </div>
            </div>
          </div>
          {/* Ecosystem Box */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-soft border border-gray-50 flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0 w-20 h-20 bg-solarAmber rounded-2xl flex items-center justify-center shadow-lg shadow-solarAmber/20">
              <svg className="w-10 h-10 text-darkGraphite" fill="currentColor" viewBox="0 0 24 24"><path d="M13.13 22.19l-1.63-3.83c1.57-.64 3.05-1.56 4.37-2.71l2.83 2.83c-1.74 1.74-3.76 3.12-5.57 3.71M7.5 18.47l2.83-2.83c1.32 1.15 2.8 2.07 4.37 2.71l-1.63 3.83c-1.81-.59-3.83-1.97-5.57-3.71M2.19 13.13l3.83-1.63c.64 1.57 1.56 3.05 2.71 4.37l-2.83 2.83c-1.74-1.74-3.12-3.76-3.71-5.57M18.47 7.5l2.83-2.83c1.15 1.32 2.07 2.8 2.71 4.37l-3.83 1.63c-.64-1.57-1.56-3.05-2.71-4.37M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Minsys Augmented Lean Ecosystem</h4>
              <p className="text-mutedText leading-relaxed">
                Minsys orchestrates an Augmented Lean Ecosystem—a pre-nurtured network of elite technology vendors, talent providers, and private capital stakeholders ready to activate at a moment's notice. For minimal overhead. Maximal viability. AI-native execution.
              </p>
            </div>
          </div>
        </section>

        {/* Organization Section */}
        <section id="organization" className="bg-gray-50 py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Pillar Introduction */}
              <div className="w-full bg-white p-10 rounded-2xl shadow-soft border border-gray-100 flex flex-col md:flex-row items-start gap-8 text-left">
                <div className="shrink-0 w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.84L16.16 11H7.84L12 7.84zM7 18v-5h10v5H7z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-2">Organization Structure</h4>
                  <h5 className="font-bold text-xl mb-3">Minsys Core Organization</h5>
                  <p className="text-mutedText leading-relaxed text-sm">
                    Minsys operates through a refined, three-pillar organization designed to <span className="text-solarAmber font-medium">minimize costs</span> and <span className="text-solarAmber font-medium">maximize high-value output</span>. This structure ensures that every venture is built on a <span className="text-solarAmber font-medium">foundation of operational excellence</span>, allowing for <span className="text-solarAmber font-medium">rapid movement from concept to market-ready asset</span>.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left Sidebar */}
              <div className="lg:col-span-4">
                <h3 className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Minsys Core Organization</h3>
                <h2 className="display-serif text-4xl mb-12">Three Pillar Organization</h2>
                <nav className="space-y-6">
                  <div 
                    onClick={() => setActiveOrgTab(1)}
                    className={activeOrgTab === 1 
                      ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                      : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                  >
                    <span>The Nexus</span>
                    {activeOrgTab === 1 && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    )}
                  </div>
                  <div 
                    onClick={() => setActiveOrgTab(2)}
                    className={activeOrgTab === 2 
                      ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                      : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                  >
                    <span>The Venture Studio</span>
                    {activeOrgTab === 2 && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    )}
                  </div>
                  <div 
                    onClick={() => setActiveOrgTab(3)}
                    className={activeOrgTab === 3 
                      ? "flex items-center justify-between p-4 bg-white shadow-sm border border-gray-100 rounded-lg text-solarAmber font-bold cursor-pointer" 
                      : "flex items-center justify-between p-4 text-gray-400 font-medium cursor-pointer hover:text-darkGraphite hover:bg-gray-50 hover:rounded-lg transition-colors"}
                  >
                    <span>The MVP Factory</span>
                    {activeOrgTab === 3 && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    )}
                  </div>
                </nav>
              </div>
              {/* Right Content */}
              <div className="lg:col-span-8 bg-white p-12 rounded-2xl shadow-soft border border-gray-50">
                <div className="w-16 h-16 bg-solarAmber/10 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"></path></svg>
                </div>
                
                {activeOrgTab === 1 && (
                  <>
                    <h3 className="display-serif text-3xl mb-6">The Nexus</h3>
                    <h4 className="display-serif text-2xl text-darkGraphite/70 mb-4">The Central Hub and Parent Company of the Minsys Organization</h4>
                    <p className="text-mutedText leading-relaxed mb-10 text-lg">The Nexus serves as the custodian of Minsys IP. It orchestrates the phased growth of the organization and governs the flow of assets across the entire ecosystem.</p>
                    <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-4 text-xs font-bold tracking-widest text-mutedText uppercase">
                      <svg className="w-5 h-5 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      Technical Visual: The Nexus
                    </div>
                  </>
                )}
                
                {activeOrgTab === 2 && (
                  <>
                    <h3 className="display-serif text-3xl mb-6">The Venture Studio</h3>
                    <h4 className="display-serif text-2xl text-darkGraphite/70 mb-4">The Company that Manages the Minsys' Ventures Portfolio</h4>
                    <p className="text-mutedText leading-relaxed mb-10 text-lg">The Studio is responsible for the systematic bootstrapping and nurturing of each venture. It manages the lifecycle of our portfolio from ideation through to independent market maturity.</p>
                    <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-4 text-xs font-bold tracking-widest text-mutedText uppercase">
                      <svg className="w-5 h-5 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      Technical Visual: The Venture Studio
                    </div>
                  </>
                )}
                
                {activeOrgTab === 3 && (
                  <>
                    <h3 className="display-serif text-3xl mb-6">The MVP Factory</h3>
                    <h4 className="display-serif text-2xl text-darkGraphite/70 mb-4">The Company that Operationalizes the Minsys Digital &amp; AI Factory</h4>
                    <p className="text-mutedText leading-relaxed mb-10 text-lg">The Factory operationalizes our AI-native production line. It produces and releases Minimum Viable Products on demand, ensuring rapid market validation for every venture spinoff.</p>
                    <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-4 text-xs font-bold tracking-widest text-mutedText uppercase">
                      <svg className="w-5 h-5 text-solarAmber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      Technical Visual: The MVP Factory
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="max-w-7xl mx-auto px-4 py-24">
          <div className="mb-12">
            <div className="max-w-xl">
              <h3 className="text-[10px] font-bold text-solarAmber tracking-widest uppercase mb-4">Portfolio</h3>
              <h2 className="display-serif text-5xl leading-tight">We build for the market.<br/>We build for ourselves.</h2>
            </div>
          </div>
          {/* Minsys Ventures Explainer */}
          <div className="mb-6 bg-white p-8 rounded-2xl shadow-soft border border-gray-50 flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0 w-12 h-12 bg-solarAmber/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
            </div>
            <div>
              <h5 className="font-bold text-xl mb-3">Minsys Ventures</h5>
              <p className="text-mutedText leading-relaxed">
                At Minsys, we don't just bootstrap ventures for our customers; we actively orchestrate an <span className="text-solarAmber font-medium">internal portfolio of Corporate Spinoffs</span>. These are <span className="text-solarAmber font-medium">Minsys-owned entities</span>, engineered from our proprietary IP to capture emerging opportunities in the <span className="text-solarAmber font-medium">AI-native economy</span>.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4 mb-12">
            <button onClick={scrollPrev} aria-label="Previous project" className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-solarAmber hover:text-solarAmber transition-all">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
            <button onClick={scrollNext} aria-label="Next project" className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-solarAmber hover:text-solarAmber transition-all">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-8">
              {projects.map((project) => (
                <div key={project.id} className="flex-[0_0_100%] md:flex-[0_0_50%] pl-8 min-w-0">
                  <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                    <img alt={project.altText} loading="lazy" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src={project.imageUrl}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-darkGraphite/90 via-darkGraphite/20 to-transparent p-12 flex flex-col justify-end">
                      <div className="relative z-10">
                        {/* Glassmorphism Overlay for text block only */}
                        <div 
                          className="absolute inset-0 backdrop-blur-md -m-6 p-6 rounded-2xl -z-10 pointer-events-none"
                          style={{ backgroundColor: 'rgba(24, 22, 16, 0.1)' }}
                        ></div>
                        <p className="text-[10px] text-solarAmber font-bold tracking-[0.2em] mb-4 uppercase">{project.category}</p>
                        <div className="text-white/60 text-[10px] mb-6 leading-relaxed max-w-sm uppercase font-bold tracking-widest">
                          {project.description}
                        </div>
                        <h3 className="display-serif text-3xl text-white">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="getintouch" className="bg-darkGraphite text-white py-32 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="display-serif text-4xl md:text-6xl mb-16 leading-tight">
              Let's materialize <span className="text-solarAmber italic">Your</span> Vision as a <span className="text-solarAmber">Venture</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              {/* Inquiry Card */}
              <div className="bg-white/5 backdrop-blur-md p-12 rounded-3xl border border-solarAmber/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-solarAmber/10 rounded-xl flex items-center justify-center mb-8">
                  <svg aria-hidden="true" className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M13.13 22.19l-1.63-3.83c1.57-.64 3.05-1.56 4.37-2.71l2.83 2.83c-1.74 1.74-3.76 3.12-5.57 3.71M7.5 18.47l2.83-2.83c1.32 1.15 2.8 2.07 4.37 2.71l-1.63 3.83c-1.81-.59-3.83-1.97-5.57-3.71M2.19 13.13l3.83-1.63c.64 1.57 1.56 3.05 2.71 4.37l-2.83 2.83c-1.74-1.74-3.12-3.76-3.71-5.57M18.47 7.5l2.83-2.83c1.15 1.32 2.07 2.8 2.71 4.37l-3.83 1.63c-.64-1.57-1.56-3.05-2.71-4.37M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Inquire Minsys</h3>
                <p className="text-white/60 mb-8 leading-relaxed">Share your vision for a digital or AI-powered venture.</p>
                <a 
                  className="w-full bg-solarAmber text-darkGraphite py-4 rounded-xl font-bold hover:brightness-110 transition-all cursor-pointer inline-block text-center"
                  onClick={handleContactClick}
                >
                  Start Inquiry
                </a>
              </div>
              {/* Contact Card */}
              <div className="bg-white/5 backdrop-blur-md p-12 rounded-3xl flex flex-col items-center text-center border border-white/5">
                <div className="w-12 h-12 bg-solarAmber/10 rounded-xl flex items-center justify-center mb-8">
                  <svg aria-hidden="true" className="w-6 h-6 text-solarAmber" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Contact Minsys</h3>
                <p className="text-white/60 mb-8 leading-relaxed">Connect with our founding team for partnership or ecosystem opportunities.</p>
                <a 
                  className="w-full border border-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/5 transition-all cursor-pointer inline-block text-center"
                  onClick={handleContactClick}
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#121210] text-white/40 py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-1 justify-start">
            <div className="w-6 h-6 bg-solarAmber/20 rounded flex items-center justify-center">
              <span className="text-solarAmber font-bold text-[8px]">M</span>
            </div>
            <span className="text-white/80 font-bold text-sm">Minsys</span>
          </div>
          {/* Center: Copyright Info */}
          <div className="text-center text-sm md:text-base leading-relaxed text-white/80 flex-1">
            Minsys | Augmentation over Automation<br/>
            © 2026 <span className="italic">Minsys Holdings, LLC.</span> All rights reserved.
          </div>
          {/* Right: Links */}
          <div className="flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase flex-1 justify-end">
            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
