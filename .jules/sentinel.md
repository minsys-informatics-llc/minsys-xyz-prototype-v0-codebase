## 2025-05-22 - [CSP Implementation for Vercel/Vite]
**Vulnerability:** Missing Content Security Policy (CSP) and other security headers.
**Learning:** For a Vercel-hosted site using Vite, security headers must be configured in `vercel.json` for production and `vite.config.ts` for development. Development CSP needs to be more relaxed to support HMR (web sockets) and inline styles used by Tailwind.
**Prevention:** Always implement a baseline CSP that whitelists required external origins (Google Analytics, Fonts, Unsplash) and uses SHA-256 hashes for inline scripts to avoid `'unsafe-inline'`.
