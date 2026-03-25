import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import LiteYouTubeEmbed from '@/components/ui/LiteYouTubeEmbed';
import { breadcrumbSchema } from '@/lib/schema-org';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';

type Locale = 'en' | 'th' | 'ru' | 'zh';

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const sermon = await prisma.sermon.findUnique({
      where: { slug },
      include: { translations: { where: { locale: locale as Locale } } },
    });
    if (!sermon) return { title: 'Sermon Not Found' };
    const tr = sermon.translations[0];
    const title = tr?.title || slug;
    const image = sermon.thumbnailUrl || '/assets/church/hero.jpg';
    return {
      title: `${title} — Phuket International Church`,
      description: tr?.description || undefined,
      alternates: {
        canonical: `${SITE_URL}/${locale}/sermons/${slug}`,
        languages: {
          en: `${SITE_URL}/en/sermons/${slug}`,
          th: `${SITE_URL}/th/sermons/${slug}`,
          ru: `${SITE_URL}/ru/sermons/${slug}`,
          zh: `${SITE_URL}/zh/sermons/${slug}`,
          'x-default': `${SITE_URL}/en/sermons/${slug}`,
        },
      },
      openGraph: {
        title,
        description: tr?.description || undefined,
        type: 'article',
        images: [{ url: image, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: tr?.description || undefined,
        images: [image],
      },
    };
  } catch {
    return { title: 'Sermon — Phuket International Church' };
  }
}

export default async function SermonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let sermon: any = null;
  try {
    sermon = await prisma.sermon.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: { translations: { where: { locale: locale as Locale } } },
    });
  } catch {
    // DB not available
  }

  if (!sermon) notFound();

  const tr = sermon.translations[0];
  const title = tr?.title || sermon.slug;
  const youtubeId = sermon.videoUrl ? extractYouTubeId(sermon.videoUrl) : null;
  const sermonUrl = `${SITE_URL}/${locale}/sermons/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: title,
    description: tr?.description || '',
    creator: {
      '@type': 'Person',
      name: sermon.speakerName || 'Phuket International Church',
    },
    datePublished: sermon.preachedAt
      ? new Date(sermon.preachedAt).toISOString()
      : undefined,
    contentUrl: sermon.audioUrl || sermon.videoUrl || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Phuket International Church',
      url: 'https://phuketinternationalchurch.com',
    },
  };

  const crumbsLd = breadcrumbSchema([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: 'Sermons', url: `${SITE_URL}/${locale}/sermons` },
    { name: title, url: sermonUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href={`/${locale}/sermons`} className="hover:text-primary">
            Sermons
          </Link>
          <span className="mx-2">›</span>
          <span className="text-text-main">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          {sermon.series && (
            <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
              {sermon.series}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {sermon.speakerName && (
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                {sermon.speakerName}
              </span>
            )}
            {sermon.preachedAt && (
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {format(new Date(sermon.preachedAt), 'MMMM d, yyyy')}
              </span>
            )}
          </div>
        </header>

        {/* Video Embed */}
        {youtubeId && (
          <div className="mb-8">
            <LiteYouTubeEmbed videoId={youtubeId} title={title} />
          </div>
        )}

        {/* Non-YouTube video fallback */}
        {sermon.videoUrl && !youtubeId && (
          <div className="mb-8">
            <video
              controls
              className="w-full rounded-xl"
              src={sermon.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Audio Player */}
        {sermon.audioUrl && (
          <div className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-sm font-semibold text-text-main mb-3">
              Listen to this sermon
            </h2>
            <audio
              controls
              className="w-full"
              src={sermon.audioUrl}
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Description */}
        {tr?.description && (
          <div className="prose prose-lg max-w-none mb-8">
            <p>{tr.description}</p>
          </div>
        )}

        {/* Sermon Notes Download */}
        {sermon.notesUrl && (
          <div className="mb-8 flex items-center gap-4 bg-green-50 rounded-xl p-5 border border-green-200">
            <svg
              className="w-8 h-8 text-green-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-text-main">Sermon Notes</p>
              <p className="text-sm text-gray-600">
                Download the notes to follow along or study later
              </p>
            </div>
            <a
              href={sermon.notesUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Download
            </a>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link
            href={`/${locale}/sermons`}
            className="text-primary hover:underline font-medium text-sm"
          >
            ← Back to all sermons
          </Link>
        </div>
      </div>
    </>
  );
}
