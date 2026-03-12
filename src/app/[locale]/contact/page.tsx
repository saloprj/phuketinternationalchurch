import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Contact — Phuket International Church',
    description:
      'Get in touch with Phuket International Church. We would love to hear from you.',
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          We&apos;d love to hear from you. Send us a message and we&apos;ll get
          back to you within a few days.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <ContactForm locale={locale} />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-text-main mb-4">Find Us</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Address</p>
                  <address className="not-italic text-gray-600 mt-0.5">
                    Land &amp; Houses Park Chalong Clubhouse
                    <br />
                    Chalong 80/19, Phuket 83130
                    <br />
                    Thailand
                  </address>
                  <a
                    href="https://maps.app.goo.gl/HDDiRhLv7J2R18kw9?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-1 inline-block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Phone / WhatsApp</p>
                  <a
                    href="tel:+66634546790"
                    className="text-primary hover:underline mt-0.5 block"
                  >
                    +66 63 454 6790
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <div>
                  <p className="font-medium">Facebook</p>
                  <a
                    href="https://www.facebook.com/phuketinternationalchurch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-0.5 block"
                  >
                    facebook.com/phuketinternationalchurch
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service times quick ref */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
            <h2 className="font-bold text-text-main mb-3">Service Times</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>Sunday (English)</span>
                <span className="font-semibold text-primary">10:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Thursday (Russian)</span>
                <span className="font-semibold text-primary">6:30 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
