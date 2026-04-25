import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { waLink } from '@/lib/phone';
import { GroupHero, GroupThumbs } from '@/components/groups/GroupGallery';

export const metadata: Metadata = {
  title: 'Home Fellowship Groups — Phuket International Church',
  description:
    'Join one of our home groups and be part of a loving community. Meeting times, locations, and leaders across Phuket.',
};

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  type HomeGroupRow = {
    id: number;
    name: string;
    leaderName: string;
    leaderPhone: string;
    meetingDay: string;
    meetingTime: string;
    location: string;
    gpsUrl: string;
    photos: string[];
    description: string;
  };

  let intro: { title: string; content: string } | null = null;
  let groups: HomeGroupRow[] = [];

  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'groups' },
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
    groups = await prisma.homeGroup.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    // DB unavailable
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 rounded-2xl overflow-hidden relative aspect-[16/6]">
        <Image
          src="/images/church/baptism-crowd.jpg"
          alt="PIC community gathered together"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {intro?.title || 'Home Fellowship'}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Join one of our home groups and be part of a loving community.
          </p>
        </div>
      </div>

      {intro?.content && (
        <div
          className="prose prose-lg max-w-none prose-headings:text-[#303232] prose-a:text-[#2ea3f2] mb-12"
          dangerouslySetInnerHTML={{ __html: intro.content }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            {g.photos.length > 0 ? (
              <GroupHero photos={g.photos} name={g.name} />
            ) : (
              <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-primary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-xl font-bold text-[#303232] mb-2">{g.name}</h2>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div>
                  <span className="text-gray-400">Leader: </span>
                  <span className="font-medium text-gray-700">{g.leaderName}</span>
                </div>
                {(g.meetingDay || g.meetingTime) && (
                  <div>
                    <span className="text-gray-400">When: </span>
                    <span>
                      {g.meetingDay} {g.meetingTime}
                    </span>
                  </div>
                )}
                {g.location && (
                  <div>
                    <span className="text-gray-400">Where: </span>
                    <span>{g.location}</span>
                  </div>
                )}
                {g.leaderPhone && (
                  <div>
                    <span className="text-gray-400">Phone: </span>
                    <span>{g.leaderPhone}</span>
                  </div>
                )}
              </div>
              {g.description && (
                <p className="text-sm text-gray-600 mb-4">{g.description}</p>
              )}
              <GroupThumbs photos={g.photos} name={g.name} />
              <div className="mt-auto flex flex-wrap gap-2">
                {g.gpsUrl && (
                  <a
                    href={g.gpsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Maps
                  </a>
                )}
                {waLink(g.leaderPhone) && (
                  <a
                    href={waLink(g.leaderPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-primary text-primary px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          Home group information is being updated — please check back soon.
        </p>
      )}

      <div className="mt-16 text-center">
        <a
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Interested? Talk to us
        </a>
      </div>
    </div>
  );
}
