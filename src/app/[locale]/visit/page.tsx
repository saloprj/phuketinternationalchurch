import type { Metadata } from 'next';
import Link from 'next/link';
import { faqSchema } from '@/lib/schema-org';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Plan Your Visit — Phuket International Church',
    description:
      'Everything you need to know before your first visit: service times, location, parking, kids program, and what to expect.',
  };
}

const faqs = [
  {
    question: 'Do I need to dress up?',
    answer: 'No, dress is casual and relaxed.',
  },
  {
    question: 'Is there parking?',
    answer:
      "Yes, free parking is available. Sign in at the entrance — write your name and 'clubhouse'.",
  },
  {
    question: 'Is there childcare?',
    answer:
      'Yes, our Kids program runs simultaneously with the adult service for children aged 0–12.',
  },
  {
    question: 'How long is the service?',
    answer: 'Sunday services run about 60 minutes.',
  },
  {
    question: 'Do I need to be a Christian to attend?',
    answer: 'Not at all! Everyone is welcome regardless of background.',
  },
];

export default async function VisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const jsonLd = faqSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">
            Plan Your Visit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to meet you. Here&apos;s everything you need to know
            before you come.
          </p>
        </div>

        {/* Service Times */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-main mb-6">
            Service Times
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                day: 'Sunday',
                time: '10:30 AM – 11:30 AM',
                note: 'English Service',
                detail: 'Main weekly gathering with worship and teaching',
              },
              {
                day: 'Thursday',
                time: '6:30 PM',
                note: 'Russian Service',
                detail: 'Russian-language worship and message',
              },
              {
                day: 'Wednesday',
                time: '8:30 PM',
                note: 'Team Night',
                detail: 'Prayer and community for the church family',
              },
              {
                day: 'Tuesday',
                time: '6:00 PM',
                note: 'Youth',
                detail: 'For teens and young adults',
              },
            ].map((s) => (
              <div
                key={s.day}
                className="bg-primary text-white rounded-xl p-5 flex flex-col gap-1"
              >
                <div className="font-bold text-lg">{s.day}</div>
                <div className="text-accent font-semibold text-sm">
                  {s.time}
                </div>
                <div className="text-white font-medium text-sm">{s.note}</div>
                <div className="text-gray-200 text-xs mt-1">{s.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Directions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-main mb-6">
            Location &amp; Directions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                <h3 className="font-bold text-text-main mb-3">Address</h3>
                <address className="not-italic text-gray-700 space-y-1">
                  <p>Land &amp; Houses Park Chalong</p>
                  <p>Clubhouse (Chalong 80/19)</p>
                  <p>Chalong, Phuket 83130</p>
                  <p>Thailand</p>
                </address>
                <a
                  href="https://maps.app.goo.gl/HDDiRhLv7J2R18kw9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-primary hover:underline font-medium text-sm"
                >
                  Open in Google Maps →
                </a>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-text-main mb-3">Parking</h3>
                <p className="text-gray-700 text-sm">
                  Free parking is available at the Land &amp; Houses Park
                  Chalong clubhouse. When entering, sign in at the security
                  gate — write your name and &ldquo;clubhouse&rdquo; as your
                  destination.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.869167!2d98.35660!3d7.84670!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPhuket+International+Church!5e0!3m2!1sen!2sth!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Phuket International Church location"
              />
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-main mb-6">
            What to Expect
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                ),
                title: 'Worship',
                text: 'We sing contemporary worship songs in English. The atmosphere is warm and welcoming — come as you are.',
              },
              {
                icon: (
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                ),
                title: 'Teaching',
                text: 'Our messages are Bible-based, practical, and delivered in English. Topics range from everyday life to deep theological exploration.',
              },
              {
                icon: (
                  <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                ),
                title: 'Community',
                text: 'After the service we hang around for coffee and conversation. It is a great way to meet people from 30+ nations.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-text-main mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kids Program */}
        <section className="mb-16 bg-accent/10 rounded-2xl p-8 border border-accent/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-accent"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a5 5 0 100 10A5 5 0 0012 2zm-7 18a7 7 0 0114 0H5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-main mb-2">
                Kids Program
              </h2>
              <p className="text-gray-700">
                We love kids! Our <strong>PIC Kids</strong> program runs every
                Sunday simultaneously with the adult service, for children aged{' '}
                <strong>0–12 years</strong>. Children enjoy age-appropriate
                worship, Bible stories, and activities in a safe, supervised
                environment. Drop-off is available from 10:20 AM.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-main mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="bg-white rounded-xl shadow-sm border border-gray-100 group"
              >
                <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold text-text-main list-none">
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-primary transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* RSVP CTA */}
        <section className="bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Visit?</h2>
          <p className="text-gray-200 mb-6 max-w-xl mx-auto">
            Let us know you&apos;re coming and we&apos;ll make sure someone is
            there to welcome you personally.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-accent text-text-main px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            Send us a message →
          </Link>
        </section>
      </div>
    </>
  );
}
