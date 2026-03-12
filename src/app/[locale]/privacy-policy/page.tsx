import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#303232] mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-500">Last updated: January 1, 2025</p>
        <h2>Who We Are</h2>
        <p>Phuket International Church ("we", "us") is located at Land & Houses Park, Chalong 80/19, Chalong, Phuket, Thailand. We can be contacted at <a href="tel:+66634546790">063-454-6790</a>.</p>
        <h2>Data We Collect</h2>
        <p>We collect personal data only when you voluntarily submit it through our website forms:</p>
        <ul>
          <li><strong>Contact form:</strong> name, email, message (stored for correspondence)</li>
          <li><strong>Prayer requests:</strong> name, email (optional), prayer request text — treated as sensitive religious data under PDPA</li>
          <li><strong>Newsletter:</strong> email address, confirmed via double opt-in</li>
          <li><strong>RSVP forms:</strong> name and email for event attendance</li>
          <li><strong>Donations:</strong> amount, payment method, and optionally name and email</li>
        </ul>
        <h2>Legal Basis (Thailand PDPA)</h2>
        <p>We process personal data based on your explicit consent, which you provide via checkboxes on our forms. Religious affiliation and prayer requests constitute sensitive personal data under Thailand's Personal Data Protection Act (PDPA) and are processed with heightened care.</p>
        <h2>Data Retention</h2>
        <p>Contact submissions and prayer requests are retained for a maximum of 2 years and then deleted. Newsletter subscriptions are retained until you unsubscribe. Donation records are retained as required for financial compliance.</p>
        <h2>Analytics</h2>
        <p>Our website uses self-hosted Umami analytics, which is cookie-free and does not store any personal data. No consent is required for analytics.</p>
        <h2>Your Rights</h2>
        <p>Under Thailand's PDPA, you have the right to access, correct, delete, or restrict processing of your personal data. Contact us at <a href="mailto:admin@phuketinternationalchurch.com">admin@phuketinternationalchurch.com</a> to exercise these rights.</p>
        <h2>Data Sharing</h2>
        <p>We do not sell your personal data. We use the following third-party processors:</p>
        <ul>
          <li>Stripe (payment processing) — see <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Stripe's privacy policy</a></li>
          <li>Google (translation API) — only content text is sent, not personal data</li>
        </ul>
      </div>
      <div className="mt-8">
        <Link href={`/${locale}`} className="text-[#437086] hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
