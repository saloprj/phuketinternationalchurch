import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Sermons — Phuket International Church',
    description:
      'Listen to messages from Phuket International Church. Browse our sermon archive by series, speaker, or date.',
  };
}

const PAGE_SIZE = 10;

type Locale = 'en' | 'th' | 'ru' | 'zh';

export default async function SermonsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  let sermons: any[] = [];
  let total = 0;

  try {
    const dbLocale = locale as Locale;
    [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          translations: { where: { locale: dbLocale } },
        },
        orderBy: { preachedAt: 'desc' },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.sermon.count({ where: { status: 'PUBLISHED' } }),
    ]);
  } catch {
    // DB not available
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">Sermons</h1>
        <p className="text-gray-600 text-lg">
          Messages from Phuket International Church
        </p>
      </div>

      {sermons.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-2">No sermons available yet.</p>
          <p className="text-sm">Check back soon — we add new messages weekly.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {sermons.map((sermon) => {
              const tr = sermon.translations[0];
              const title = tr?.title || sermon.slug;
              return (
                <Link
                  key={sermon.id}
                  href={`/${locale}/sermons/${sermon.slug}`}
                >
                  <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 h-full flex flex-col">
                    {sermon.thumbnailUrl ? (
                      <Image
                        src={sermon.thumbnailUrl}
                        alt={title}
                        width={400}
                        height={225}
                        className="w-full object-cover aspect-video"
                      />
                    ) : (
                      <div className="bg-primary/10 aspect-video flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-primary/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">
                          {sermon.speakerName && (
                            <span className="font-medium">
                              {sermon.speakerName}
                            </span>
                          )}
                          {sermon.speakerName && sermon.preachedAt && (
                            <span> · </span>
                          )}
                          {sermon.preachedAt &&
                            format(new Date(sermon.preachedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <h2 className="font-bold text-text-main mb-2 flex-1">
                        {title}
                      </h2>
                      {tr?.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {tr.description}
                        </p>
                      )}
                      {sermon.series && (
                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">
                          {sermon.series}
                        </span>
                      )}
                      <div className="flex gap-2 mt-3">
                        {sermon.videoUrl && (
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                            Video
                          </span>
                        )}
                        {sermon.audioUrl && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            Audio
                          </span>
                        )}
                        {sermon.notesUrl && (
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            Notes
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2"
              aria-label="Sermon pagination"
            >
              {page > 1 && (
                <Link
                  href={`/${locale}/sermons?page=${page - 1}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-gray-500 px-3">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/${locale}/sermons?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
