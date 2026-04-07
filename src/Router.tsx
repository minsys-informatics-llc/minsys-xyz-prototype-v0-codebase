/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Minimal pathname-based router. No third-party dependency.
 * Intercepts same-origin <a> clicks and pushes history state so
 * SPA navigation feels instant; back/forward and deep links work too.
 */

import React, { useEffect, useState } from 'react';
import { trackPageView } from './analytics';

export function getRoute(pathname: string): 'talent' | 'home' {
  if (pathname === '/talent' || pathname === '/talent/') return 'talent';
  return 'home';
}

interface Props {
  home: React.ReactNode;
  talent: React.ReactNode;
}

export function Router({ home, talent }: Props) {
  const [path, setPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      trackPageView(window.location.pathname);
    };
    window.addEventListener('popstate', onPop);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Only intercept same-origin, non-hash, non-target=_blank links
      if (anchor.target && anchor.target !== '_self') return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const targetRoute = getRoute(url.pathname);
      const currentRoute = getRoute(window.location.pathname);

      // Hash-only links within current route fall through to native behavior
      if (url.pathname === window.location.pathname) return;

      // Only intercept routes we own
      if (targetRoute === currentRoute && url.hash) return;

      e.preventDefault();
      window.history.pushState({}, '', url.pathname + url.hash);
      setPath(url.pathname);
      trackPageView(url.pathname);
      if (url.hash) {
        // Defer scroll until route renders
        setTimeout(() => {
          const el = document.getElementById(url.hash.slice(1));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      } else {
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return <>{getRoute(path) === 'talent' ? talent : home}</>;
}
