import React from 'react';
import { trackEvent } from './analytics';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#121210] font-sans text-white/75 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.08] px-8 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-solarAmber/20 rounded flex items-center justify-center">
              <span className="text-solarAmber font-bold text-[8px]">M</span>
            </div>
            <span className="text-white/80 font-bold text-sm">Minsys</span>
          </a>
          <a
            href="/"
            onClick={() => trackEvent('nav_click', { link_text: 'Back to Home', link_url: '/', link_location: 'legal_header' })}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[64ch] mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/40 text-sm mb-12">
          Minsys Holdings, LLC &nbsp;|&nbsp; Last updated: {lastUpdated}
        </p>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#121210] text-white/40 py-12 px-8 border-t border-white/5 mt-auto">
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
            <a
              className="hover:text-white transition-colors"
              href="/privacy-policy"
              onClick={() => trackEvent('nav_click', { link_text: 'Privacy Policy', link_url: '/privacy-policy', link_location: 'footer' })}
            >
              Privacy Policy
            </a>
            <a
              className="hover:text-white transition-colors"
              href="/terms-of-service"
              onClick={() => trackEvent('nav_click', { link_text: 'Terms of Service', link_url: '/terms-of-service', link_location: 'footer' })}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
