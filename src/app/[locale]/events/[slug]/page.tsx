import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/schema-org';
import EventRsvpForm from './EventRsvpForm';

type Locale = 'en' | 'th' | 'ru' | 'zh';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { translations: { where: { locale: locale as Locale } } },
    });
    if (!event) return { title: 'Event Not Found' };
    const tr = event.translations[0];
    return {
      title: `${tr?.title || slug} — Phuket International Church`,
      description: tr?.description || undefined,
    };
  } catch {
    return { title: 'Event — Phuket International Church' };
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let event: any = null;
  try {
    event = await prisma.event.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: { translations: { where: { locale: locale as Locale } } },
    });
  } catch {
    // DB not available
  }

  if (!event) notFound();

  const tr = event.translations[0];
  const title = tr?.title || event.slug;
  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : undefined;

  const jsonLd = eventSchema({
    name: title,
    description: tr?.description || '',
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString(),
    location: event.location || 'Phuket International Church',
    url: `https://phuketinternationalchurch.com/${locale}/events/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href={`/${locale}/events`} className="hover:text-primary">
            Events
          </Link>
          <span className="mx-2">›</span>
          <span className="text-text-main">{title}</span>
        </nav>

        {/* Featured image */}
        {event.featuredImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video relative">
            <Image
              src={event.featuredImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-6">
            {title}
          </h1>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <div>
                <p className="font-semibold text-text-main">
                  {format(startDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-gray-600 text-sm">
                  {format(startDate, 'h:mm a')}
                  {endDate && ` – ${format(endDate, 'h:mm a')}`}
                </p>
              </div>
            </div>

            {event.location && (
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
                  <p className="font-semibold text-text-main">
                    {event.location}
                  </p>
                  <a
                    href="https://maps.app.goo.gl/HDDiRhLv7J2R18kw9?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Get directions →
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Description */}
        {tr?.description && (
          <div
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: tr.description }}
          />
        )}

        {/* RSVP Form */}
        {event.rsvpEnabled && (
          <section className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-text-main mb-2">
              RSVP for this Event
            </h2>
            <p className="text-gray-600 mb-6">
              Let us know you&apos;re coming so we can prepare for you.
            </p>
            <EventRsvpForm eventId={event.id} locale={locale} />
          </section>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link
            href={`/${locale}/events`}
            className="text-primary hover:underline font-medium text-sm"
          >
            ← Back to all events
          </Link>
        </div>
      </div>
    </>
  );
}
