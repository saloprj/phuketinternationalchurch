import type { Metadata } from 'next';
import GiveClient from './GiveClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Give — Phuket International Church',
    description:
      'Support the ministry of Phuket International Church. Give online via card or PromptPay.',
  };
}

export default async function GivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-main mb-4">Give</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your generosity helps us share the love of Christ across Phuket and
          beyond.
        </p>
      </div>

      {/* Scripture */}
      <blockquote className="border-l-4 border-accent pl-6 mb-10 italic text-gray-600 text-lg">
        &ldquo;Each of you should give what you have decided in your heart to
        give, not reluctantly or under compulsion, for God loves a cheerful
        giver.&rdquo;
        <cite className="block mt-2 text-sm not-italic text-gray-400">
          — 2 Corinthians 9:7
        </cite>
      </blockquote>

      <GiveClient />

      {/* What your giving supports */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-text-main mb-6">
          What Your Giving Supports
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Sunday Services',
              text: 'Worship, teaching, sound, and facilities for our weekly gatherings.',
            },
            {
              title: 'Kids Ministry',
              text: 'Safe, engaging programs for children to grow in faith.',
            },
            {
              title: 'Community Outreach',
              text: 'Serving the local community and supporting missions in Southeast Asia.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-gray-50 rounded-xl p-5 border border-gray-100"
            >
              <h3 className="font-bold text-text-main mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
