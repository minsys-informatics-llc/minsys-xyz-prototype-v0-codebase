import { useEffect } from 'react';
import { LegalLayout } from './LegalLayout';

export function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service — Minsys';
  }, []);

  return (
    <LegalLayout title="Terms of Service" lastUpdated="April 9, 2026">
      <p className="text-white/75 mb-4 leading-relaxed">
        Welcome to minsys.xyz (the "Site"). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and the Minsys Group. By accessing or using this Site, you agree to comply with and be bound by these Terms.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">1. Corporate Structure & Operator Disclosure</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        This Site is a digital portal for the Minsys Group.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Operating Entity:</strong> This Site is operated, managed, and maintained by Minsys Informatics LLC, a Wyoming limited liability company (the "Operator").
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Parent Entity:</strong> Minsys Holdings LLC, a New Mexico limited liability company (the "Parent"), is the sole or majority owner of the Operator.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Legal Separation:</strong> User acknowledges that the Operator and Parent are separate and distinct legal entities. The Operator acts as the daily service provider and Site manager under a licensing agreement with the Parent.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">2. Intellectual Property Ownership & Licensing</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        All intellectual property displayed on or accessible through this Site—including but not limited to AI models, software factory frameworks, "MVP Factory" methodologies, proprietary algorithms, source code, brand names, and logos—is the exclusive property of Minsys Holdings LLC.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>No Transfer of Ownership:</strong> Your use of the Site does not grant you any ownership rights or title to the Parent's intellectual property.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Operational License:</strong> The Operator (Minsys Informatics LLC) utilizes the Parent's IP under a limited, non-exclusive license for the purpose of running the Site and delivering services.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">3. Nature of Information & Financial Disclaimer</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        Minsys is a Venture Building Micro-PE Group. The content on this Site is provided for informational and marketing purposes only.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>No Professional Advice:</strong> Nothing on this Site constitutes financial, investment, legal, or tax advice. Minsys is not a registered investment advisor.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Projections:</strong> References to "asymmetric returns," "multiples," or "tech-enabled arbitrage" are based on internal proprietary theses and historical models. Past performance is not indicative of future results.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">4. Limitation of Liability</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        To the maximum extent permitted by law:
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Operator Liability:</strong> Minsys Informatics LLC shall be the sole entity liable for any operational claims related to the Site's use.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Parent Shield:</strong> Minsys Holdings LLC shall not be liable for any direct, indirect, incidental, or consequential damages arising from the Operator's management of the Site. Under no circumstances shall the Parent's assets (including its IP) be subject to claims arising from the Operator's daily website functions.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">5. Prohibited Use</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        You agree not to attempt to reverse engineer, decompile, or "scrape" any AI-native technologies or software benchmarks presented on the Site. Any unauthorized use of the Parent's IP will be prosecuted to the fullest extent of the law.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">6. Governing Law & Jurisdiction</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        These Terms and your use of the Site are governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law principles.
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        <strong>Exclusive Jurisdiction:</strong> Any legal action or proceeding related to this Site shall be brought exclusively in the state or federal courts located in Sheridan County, Wyoming (or the county of the Operator's Registered Agent).
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">7. Indemnification</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        You agree to indemnify and hold harmless Minsys Informatics LLC and Minsys Holdings LLC from any and all claims, damages, or expenses (including attorney fees) resulting from your breach of these Terms or your unauthorized use of the Minsys Group's proprietary technology.
      </p>

      <h2 className="text-solarAmber uppercase tracking-widest text-sm font-bold mt-10 mb-3">8. Contact Information</h2>

      <p className="text-white/75 mb-4 leading-relaxed">
        For legal inquiries regarding the Minsys Group or requests for technology licensing, please contact:
      </p>

      <p className="text-white/75 mb-4 leading-relaxed">
        Email: <a href="mailto:contact@minsys.xyz" className="text-solarAmber hover:underline">contact@minsys.xyz</a>
      </p>
    </LegalLayout>
  );
}
