import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Cookie Policy' };

export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#303232] mb-8">Cookie Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-500">Last updated: January 1, 2025</p>
        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device by your browser. They are widely used to make websites work more efficiently.</p>
        <h2>Cookies We Use</h2>
        <h3>Strictly Necessary (Always Active)</h3>
        <p>These cookies are required for the website to function and cannot be turned off:</p>
        <ul>
          <li><strong>next-auth.session-token</strong> — Keeps you logged in to the admin panel (admin users only). Expires when you close your browser or after 24 hours.</li>
        </ul>
        <h3>Analytics (Cookie-Free)</h3>
        <p>We use self-hosted <strong>Umami analytics</strong>, which is completely cookie-free. It does not set any cookies, does not store personal data, and does not track you across websites. No consent is required.</p>
        <h3>Marketing Cookies</h3>
        <p>We do not use marketing or advertising cookies.</p>
        <h2>Third-Party Cookies</h2>
        <p>Embedded YouTube videos may set cookies when you click play. These are Google/YouTube's cookies governed by Google's privacy policy. Our LiteYouTube embed only loads YouTube content when you actively click play.</p>
        <h2>Managing Cookies</h2>
        <p>You can control cookies through your browser settings. Disabling the session cookie will not affect public visitors (it is only relevant for admin panel users).</p>
        <h2>PDPA Compliance</h2>
        <p>As a Thailand-based organization, we comply with Thailand's Personal Data Protection Act (PDPA). Our minimal cookie usage is designed to protect your privacy.</p>
      </div>
      <div className="mt-8">
        <Link href={`/${locale}`} className="text-[#437086] hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
