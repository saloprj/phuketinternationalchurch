import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Live Stream — Phuket International Church',
    description:
      'Watch Phuket International Church live. Sunday services at 10:30 AM (ICT).',
  };
}

function extractYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      // already an embed URL
      if (u.pathname.startsWith('/embed/')) return url;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let liveStreamUrl: string | null = null;
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'liveStreamUrl' },
    });
    liveStreamUrl = setting?.value || null;
  } catch {
    // DB not available
  }

  const embedUrl = liveStreamUrl ? extractYouTubeEmbedUrl(liveStreamUrl) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
        <h1 className="text-4xl font-bold text-text-main mb-3">
          Live Stream
        </h1>
        <p className="text-gray-600 text-lg">
          Joining us online from around the world — welcome!
        </p>
      </div>

      {embedUrl ? (
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-video mb-8">
          <iframe
            src={embedUrl}
            title="Phuket International Church Live Stream"
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl aspect-video flex flex-col items-center justify-center text-white mb-8">
          <svg
            className="w-20 h-20 text-gray-600 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <p className="text-xl font-semibold mb-2">
            No live stream at the moment
          </p>
          <p className="text-gray-400 text-center max-w-sm">
            Check back on <strong className="text-white">Sunday at 10:30 AM</strong>{' '}
            (ICT — Bangkok Time) for our weekly live service.
          </p>
        </div>
      )}

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Next Service</p>
          <p className="font-bold text-text-main">Sunday</p>
          <p className="text-primary font-semibold text-sm">10:30 AM ICT</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Language</p>
          <p className="font-bold text-text-main">English</p>
          <p className="text-gray-500 text-sm">+Thai &amp; Russian</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Duration</p>
          <p className="font-bold text-text-main">~60 minutes</p>
          <p className="text-gray-500 text-sm">Including worship &amp; message</p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Want to watch past sermons?{' '}
        <a href={`/${locale}/sermons`} className="text-primary hover:underline font-medium">
          Browse our sermon archive →
        </a>
      </p>
    </div>
  );
}
