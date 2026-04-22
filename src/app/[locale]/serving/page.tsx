import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Serving & Ministries — Phuket International Church',
  description:
    'Explore the ways you can serve at PIC — guest service, media, small groups, kids, music, and youth.',
};

const ICON_PATHS: Record<string, string> = {
  HandHeart:
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  Radio:
    'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z',
  Users:
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  Baby:
    'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  Music:
    'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  Sparkles:
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L23 12l-5.714 2.143L15 21l-2.286-6.857L7 12l5.714-2.143L15 3z',
};

function IconSvg({ icon }: { icon: string }) {
  const d = ICON_PATHS[icon] ?? ICON_PATHS.HandHeart;
  return (
    <svg
      className="w-8 h-8 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
    </svg>
  );
}

export default async function ServingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  type MinistryRow = {
    id: number;
    name: string;
    description: string;
    icon: string;
    leaderName: string;
    leaderEmail: string;
  };

  let intro: { title: string; content: string } | null = null;
  let ministries: MinistryRow[] = [];

  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'serving' },
      include: {
        translations: {
          where: { locale: locale as 'en' | 'th' | 'ru' | 'zh' },
        },
      },
    });
    if (page && page.status === 'PUBLISHED') {
      const tr = page.translations[0];
      if (tr) intro = { title: tr.title, content: tr.content };
    }
  } catch {
    // DB unavailable
  }

  try {
    ministries = await prisma.ministry.findMany({ orderBy: { order: 'asc' } });
  } catch {
    // DB unavailable
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#303232] mb-4">
        {intro?.title || 'Serving at PIC'}
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Everyone has a gift. Here are the teams you can join to serve God, our
        church, and Phuket.
      </p>

      {intro?.content && (
        <div
          className="prose prose-lg max-w-none prose-headings:text-[#303232] prose-a:text-[#2ea3f2] mb-12"
          dangerouslySetInnerHTML={{ __html: intro.content }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ministries.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <IconSvg icon={m.icon} />
            </div>
            <h2 className="text-xl font-bold text-[#303232] mb-2">{m.name}</h2>
            {m.description && (
              <p className="text-sm text-gray-600 mb-4 flex-1">{m.description}</p>
            )}
            {(m.leaderName || m.leaderEmail) && (
              <div className="text-xs text-gray-500 mb-3">
                {m.leaderName && <div>Lead: {m.leaderName}</div>}
                {m.leaderEmail && (
                  <a
                    href={`mailto:${m.leaderEmail}`}
                    className="text-primary hover:underline"
                  >
                    {m.leaderEmail}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {ministries.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          Ministry information is being updated — please check back soon.
        </p>
      )}

      <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold text-[#303232] mb-3">
          Ready to serve?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Fill out the contact form and tell us which area you&apos;re interested
          in — one of our pastors will reach out.
        </p>
        <a
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Get Involved
        </a>
      </div>
    </div>
  );
}
