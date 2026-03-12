import type { Metadata } from 'next';
import PrayerForm from './PrayerForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Prayer Requests — Phuket International Church',
    description:
      'Submit a prayer request to Phuket International Church. Our team prays for every request we receive.',
  };
}

export default async function PrayerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-4">
          Prayer Requests
        </h1>
        <p className="text-xl text-gray-600">
          We believe in the power of prayer. Share your request and our team
          will pray for you personally.
        </p>
      </div>

      <blockquote className="border-l-4 border-accent pl-6 mb-10 italic text-gray-600 text-lg">
        &ldquo;Do not be anxious about anything, but in every situation, by
        prayer and petition, with thanksgiving, present your requests to
        God.&rdquo;
        <cite className="block mt-2 text-sm not-italic text-gray-400">
          — Philippians 4:6
        </cite>
      </blockquote>

      <PrayerForm locale={locale} />

      <div className="mt-10 bg-primary/5 rounded-2xl border border-primary/20 p-6 text-sm text-gray-600">
        <p className="font-semibold text-text-main mb-2">How we handle your request</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Private requests are only seen by our pastoral team.</li>
          <li>Public requests may be shared anonymously in our prayer list.</li>
          <li>We pray for every request we receive.</li>
        </ul>
      </div>
    </div>
  );
}
