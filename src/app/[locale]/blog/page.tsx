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
    title: 'Blog — Phuket International Church',
    description:
      'Thoughts, reflections, and updates from the Phuket International Church community.',
  };
}

const PAGE_SIZE = 10;

export default async function BlogPage({
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

  let posts: any[] = [];
  let total = 0;

  try {
    const dbLocale = locale as Locale;
    [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          translations: { where: { locale: dbLocale } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
    ]);
  } catch {
    // DB not available
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-text-main mb-3">Blog</h1>
        <p className="text-gray-600 text-lg">
          Thoughts and reflections from our community
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-2">No posts yet.</p>
          <p className="text-sm">Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {posts.map((post) => {
              const tr = post.translations[0];
              const title = tr?.title || post.slug;
              return (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                  <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={title}
                        width={400}
                        height={220}
                        className="w-full object-cover aspect-video"
                      />
                    ) : (
                      <div className="bg-primary/5 aspect-video flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-primary/30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {post.publishedAt && (
                        <p className="text-xs text-gray-400 mb-2">
                          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </p>
                      )}
                      <h2 className="font-bold text-text-main mb-2 line-clamp-2 flex-1">
                        {title}
                      </h2>
                      {tr?.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {tr.excerpt}
                        </p>
                      )}
                      <span className="mt-3 text-primary text-sm font-medium">
                        Read more →
                      </span>
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
              aria-label="Blog pagination"
            >
              {page > 1 && (
                <Link
                  href={`/${locale}/blog?page=${page - 1}`}
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
                  href={`/${locale}/blog?page=${page + 1}`}
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
