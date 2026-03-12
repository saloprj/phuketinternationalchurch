import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

type Locale = 'en' | 'th' | 'ru' | 'zh';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Events — Phuket International Church',
    description:
      'Upcoming events at Phuket International Church. Join us for worship, community, and special gatherings.',
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        startAt: { gte: new Date() },
      },
      include: {
        translations: { where: { locale: locale as Locale } },
      },
      orderBy: { startAt: 'asc' },
    });
  } catch {
    // DB not available
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">
          Upcoming Events
        </h1>
        <p className="text-gray-600 text-lg">
          Join us for these special gatherings and community events.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <p className="text-xl text-gray-500 mb-2">No upcoming events</p>
          <p className="text-sm text-gray-400">
            Check back soon — we regularly host community gatherings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const tr = event.translations[0];
            const title = tr?.title || event.slug;
            const startDate = new Date(event.startAt);

            return (
              <Link
                key={event.id}
                href={`/${locale}/events/${event.slug}`}
              >
                <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 flex flex-col sm:flex-row gap-5">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-20 h-20 bg-primary rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                      {format(startDate, 'MMM')}
                    </span>
                    <span className="text-3xl font-bold leading-none">
                      {format(startDate, 'd')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-xl text-text-main mb-1 truncate">
                      {title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {format(startDate, 'EEEE, MMMM d · h:mm a')}
                        {event.endAt &&
                          ` – ${format(new Date(event.endAt), 'h:mm a')}`}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
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
                          {event.location}
                        </span>
                      )}
                    </div>
                    {tr?.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {tr.description}
                      </p>
                    )}
                  </div>

                  {/* RSVP badge */}
                  {event.rsvpEnabled && (
                    <div className="flex-shrink-0 self-start">
                      <span className="inline-block bg-accent/20 text-text-main text-xs font-semibold px-3 py-1 rounded-full">
                        RSVP Available
                      </span>
                    </div>
                  )}
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
