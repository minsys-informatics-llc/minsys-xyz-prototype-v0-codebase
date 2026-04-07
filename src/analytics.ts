// GA4 analytics helpers — single source of truth for all event tracking.
// All calls are no-ops when gtag is not available (e.g. local dev without .env.local).

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function currentPage(): string {
  if (typeof window === 'undefined') return 'landing';
  return window.location.pathname === '/talent' ? 'talent' : 'landing';
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, { page: currentPage(), ...params });
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function initAnalytics(): void {
  window.dataLayer = window.dataLayer || [];

  // Track sections as they scroll into view (50% threshold).
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = (entry.target as HTMLElement).id;
          if (sectionId) {
            trackEvent('section_view', { section_id: sectionId });
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });
}
