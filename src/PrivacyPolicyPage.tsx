import { useEffect } from 'react';
import { LegalLayout } from './LegalLayout';

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — Minsys';
  }, []);

  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 9, 2026">
      <p className="text-white/75 mb-4 leading-relaxed">
        Minsys Informatics LLC operates the website at <a href="https://minsys.xyz" className="text-solarAmber hover:underline">https://minsys.xyz</a>. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit our website.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">1. Information We Collect</h2>
      <p className="text-white/75 mb-4 leading-relaxed">We collect information in the following ways:</p>
      <ul className="text-white/75 pl-6 mb-4 list-disc space-y-1">
        <li><strong>Information you provide:</strong> When you contact us via email (contact@minsys.xyz), we collect your name and email address, and any information you include in your message.</li>
        <li><strong>Partner Modal data:</strong> When you submit the Partner contact form (Capital Partners or M&A Origination), we collect your Name, Email, Company Name, and Mandate description. This information is used by our M&A Deal Desk to evaluate potential capital partnerships and acquisition opportunities.</li>
        <li><strong>Talent Modal data:</strong> When you apply through our Talent page, we collect your Name, Email, LinkedIn URL, Portfolio URL, and responses to role-specific questions. This information is used for recruitment and team-building across our operating pillars.</li>
        <li><strong>Usage data:</strong> We automatically collect certain information when you visit our website, including IP address, browser type, operating system, referring URLs, pages visited, and time spent on pages.</li>
        <li><strong>Cookies and analytics:</strong> We use Google Analytics 4 (GA4) to understand how visitors interact with our website. GA4 uses cookies to collect anonymized usage data. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank" className="text-solarAmber hover:underline">Google Analytics Opt-out Browser Add-on</a>.</li>
      </ul>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">2. How We Use Your Information</h2>
      <p className="text-white/75 mb-4 leading-relaxed">We use the information we collect to:</p>
      <ul className="text-white/75 pl-6 mb-4 list-disc space-y-1">
        <li>Respond to your inquiries and partnership requests</li>
        <li>Evaluate acquisition opportunities as part of "Unlocking Main Street's Hidden Value by Spinning-Off Digital & AI Ventures"</li>
        <li>Facilitate recruitment across our four operating pillars</li>
        <li>Improve our website content and user experience</li>
        <li>Analyze website traffic and usage patterns</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">3. Information Sharing</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        We do not sell, trade, or rent your personal information to third parties. We do <strong>not</strong> sell your personal data to third-party advertisers. Data is used exclusively for Minsys operational purposes.
      </p>
      <p className="text-white/75 mb-4 leading-relaxed">We may share information with:</p>
      <ul className="text-white/75 pl-6 mb-4 list-disc space-y-1">
        <li><strong>Service providers:</strong> Third-party vendors (such as Google Analytics) who assist us in operating our website, subject to confidentiality agreements.</li>
        <li><strong>Legal requirements:</strong> When required by law, court order, or governmental authority.</li>
      </ul>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">4. Cookies</h2>
      <p className="text-white/75 mb-4 leading-relaxed">Our website uses the following types of cookies:</p>
      <ul className="text-white/75 pl-6 mb-4 list-disc space-y-1">
        <li><strong>Analytics cookies:</strong> Google Analytics 4 cookies to measure website performance and visitor behavior. These are anonymized and do not identify individuals.</li>
      </ul>
      <p className="text-white/75 mb-4 leading-relaxed">You may disable cookies in your browser settings. Note that disabling cookies may affect website functionality.</p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">5. Data Retention</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        We retain personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. Analytics data is retained in accordance with Google Analytics default retention settings.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">6. Your Rights</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, correct, or delete your information. To exercise these rights, contact us at <a href="mailto:contact@minsys.xyz" className="text-solarAmber hover:underline">contact@minsys.xyz</a>.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">7. Third-Party Links</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Our website may contain links to third-party websites (LinkedIn, GitHub, etc.). We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">8. Children's Privacy</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Our website is not directed at individuals under the age of 18. We do not knowingly collect personal information from minors.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">9. Changes to This Policy</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "Last updated" date.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">10. Contact</h2>
      <p className="text-white/75 mb-4 leading-relaxed">If you have questions about this Privacy Policy, please contact us:</p>
      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Minsys Informatics LLC</strong><br />
        Email: <a href="mailto:contact@minsys.xyz" className="text-solarAmber hover:underline">contact@minsys.xyz</a><br />
        Website: <a href="https://minsys.xyz" className="text-solarAmber hover:underline">https://minsys.xyz</a>
      </p>
    </LegalLayout>
  );
}
