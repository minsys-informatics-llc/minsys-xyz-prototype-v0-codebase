import { useEffect } from 'react';
import { LegalLayout } from './LegalLayout';

export function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service — Minsys';
  }, []);

  return (
    <LegalLayout title="Terms of Service" lastUpdated="April 9, 2026">
      <p className="text-white/75 mb-4 leading-relaxed">
        Please read these Terms of Service ("Terms") carefully before using the website at <a href="https://minsys.xyz" className="text-solarAmber hover:underline">https://minsys.xyz</a> operated by Minsys Holdings, LLC ("Minsys", "we", "us", or "our"). By accessing or using our website, you agree to be bound by these Terms.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">1. About Minsys</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Minsys Holdings, LLC is a <strong>Private Operating Group</strong> centered on Venture Building funded by Micro Private Equity. We are not a public investment fund, mutual fund, or a publicly traded entity.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">2. Informational Purposes Only</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        The content on this website is provided for <strong>informational purposes only</strong> and does not constitute investment advice, financial advice, legal advice, or any other professional advice. Nothing on this website should be interpreted as an offer to sell, or a solicitation of an offer to buy, any securities or investment product.
      </p>
      <p className="text-white/75 mb-4 leading-relaxed">
        Minsys is a private operating company. Information about our business model, strategy, and activities is presented for general awareness. Past performance of any acquisition or transformation strategy described does not guarantee future results.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">3. No Investment Solicitation</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Minsys Holdings, LLC conducts private capital partnerships and investment activities. These discussions are strictly private and limited to <strong>qualified, sophisticated parties</strong> in accordance with applicable institutional lending and private placement laws. Any capital partnership discussions are conducted privately and only with qualified, sophisticated parties in accordance with applicable laws. No information on this website constitutes a public offering or solicitation of investment.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">4. Proprietary Frameworks</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        The "Venture-Led Micro-PE" Model and "Augmentation over Automation" Vision described herein are proprietary frameworks of the Minsys Group and are provided for informational purposes only.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">5. Intellectual Property</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        All content on this website — including but not limited to text, graphics, logos, images, the Minsys brand identity, "Venture-Led Micro-PE" methodology, "Augmentation over Automation" philosophy, and the Four Pillars organizational framework — is the intellectual property of Minsys Holdings, LLC and is protected by applicable copyright, trademark, and intellectual property laws.
      </p>
      <p className="text-white/75 mb-4 leading-relaxed">
        Our Capabilities — including Software Engineering, Competitive Intelligence, AI & Data, and Growth & Change Management — are core intellectual property that the Minsys Group leverages to conduct "Unlocking Main Street's Hidden Value by Spinning-Off Digital & AI Ventures".
      </p>
      <p className="text-white/75 mb-4 leading-relaxed">
        You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written permission from Minsys Holdings, LLC.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">6. Accuracy of Information</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        While we strive to keep the information on our website accurate and up to date, we make no warranties or representations about the completeness, accuracy, or timeliness of any content. We reserve the right to change or update information at any time without notice.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">7. Third-Party Links</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Our website may contain links to third-party websites (LinkedIn, GitHub, and others). These links are provided for convenience only. Minsys has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">8. Limitation of Liability</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        To the maximum extent permitted by applicable law, Minsys Holdings, LLC shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of this website or reliance on any content contained herein.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">9. Privacy</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        Your use of this website is also governed by our <a href="/privacy-policy" className="text-solarAmber hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">10. Governing Law</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        These Terms are governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or your use of this website shall be resolved in the appropriate courts of competent jurisdiction.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">11. Changes to These Terms</h2>
      <p className="text-white/75 mb-4 leading-relaxed">
        We reserve the right to modify these Terms at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of the website after changes constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">12. Contact</h2>
      <p className="text-white/75 mb-4 leading-relaxed">If you have questions about these Terms, please contact us:</p>
      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Minsys Holdings, LLC</strong><br />
        Email: <a href="mailto:contact@minsys.xyz" className="text-solarAmber hover:underline">contact@minsys.xyz</a><br />
        Website: <a href="https://minsys.xyz" className="text-solarAmber hover:underline">https://minsys.xyz</a>
      </p>
    </LegalLayout>
  );
}
