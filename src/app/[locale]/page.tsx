import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import HeroSlideshow from '@/components/HeroSlideshow';
import LiteYouTubeEmbed from '@/components/ui/LiteYouTubeEmbed';

type Locale = 'en' | 'th' | 'ru' | 'zh';

// Replace with the actual YouTube URL or ID for the Life at PIC video.
// If left as the placeholder string, the video embed is not rendered.
const LIFE_AT_PIC_YOUTUBE_ID = 'TBD-REPLACE-ME';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: 'Phuket International Church — ' + t('heroTitle'),
    description: t('heroSubtitle'),
  };
}

async function getHomeData(locale: Locale) {
  const [posts, events, sermons, youtubeSetting, leadPastor] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: { translations: { where: { locale } } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.event.findMany({
      where: { status: 'PUBLISHED', startAt: { gte: new Date() } },
      include: { translations: { where: { locale } } },
      orderBy: { startAt: 'asc' },
      take: 3,
    }),
    prisma.sermon.findMany({
      where: { status: 'PUBLISHED' },
      include: { translations: { where: { locale } } },
      orderBy: { preachedAt: 'desc' },
      take: 3,
    }),
    prisma.siteSetting.findUnique({ where: { key: 'youtubeUrl' } }),
    prisma.staffMember.findFirst({ where: { role: 'Lead Pastor' } }),
  ]);
  return {
    posts,
    events,
    sermons,
    youtubeUrl: youtubeSetting?.value || '',
    leadPastor,
  };
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match?.[1] || (url.length === 11 ? url : null);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  let data = {
    posts: [] as any[],
    events: [] as any[],
    sermons: [] as any[],
    youtubeUrl: '',
    leadPastor: null as null | {
      name: string;
      role: string;
      bio: string;
      photoUrl: string | null;
    },
  };
  try {
    data = await getHomeData(locale as Locale);
  } catch {
    // DB not available during build
  }

  const youtubeVideoId = extractYouTubeId(data.youtubeUrl);

  return (
    <>
      {/* ─── Hero Slideshow ─────────────────────────────── */}
      <HeroSlideshow>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="w-12 h-1 bg-accent mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight mb-6 drop-shadow-lg">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mb-10 drop-shadow">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/visit`}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg"
            >
              {t('heroCtaVisit')}
            </Link>
            <Link
              href={`/${locale}/sermons`}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              {t('heroCtaSermons')}
            </Link>
          </div>
        </div>
      </HeroSlideshow>

      {/* ─── Stats Strip ────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: t('statsNations'), label: t('statsNationsLabel') },
              { value: t('statsYears'), label: t('statsYearsLabel') },
              { value: t('statsSunday'), label: t('statsSundayLabel') },
              { value: t('statsWelcome'), label: t('statsWelcomeLabel') },
            ].map((stat) => (
              <div key={stat.label} className="py-2">
                <div className="text-2xl sm:text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lead Pastor ────────────────────────────────── */}
      {data.leadPastor?.photoUrl && (
        <section className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Image
                  src={data.leadPastor.photoUrl}
                  alt={data.leadPastor.name}
                  width={240}
                  height={240}
                  className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover shadow-md"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  {data.leadPastor.role}
                </span>
                <h2 className="text-3xl font-bold text-text-main mb-3">
                  {data.leadPastor.name}
                </h2>
                {data.leadPastor.bio && (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                    {data.leadPastor.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Service Times ─────────────────────────────── */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold mb-8">{t('serviceTimesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              {
                day: 'Sunday',
                time: '10:30 AM – 11:30 AM',
                note: 'English Service',
                icon: (
                  <svg className="w-6 h-6 mx-auto text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                ),
              },
              {
                day: 'Thursday',
                time: '6:30 PM',
                note: 'Russian Service',
                icon: (
                  <svg className="w-6 h-6 mx-auto text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                ),
              },
              {
                day: 'Wednesday',
                time: '8:30 PM',
                note: 'Team Night',
                icon: (
                  <svg className="w-6 h-6 mx-auto text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                ),
              },
              {
                day: 'Tuesday',
                time: '6:00 PM',
                note: 'Youth',
                icon: (
                  <svg className="w-6 h-6 mx-auto text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
            ].map((service) => (
              <div key={service.day} className="bg-white/10 border-t-2 border-accent rounded-xl p-5">
                <div className="mb-3">{service.icon}</div>
                <div className="font-bold text-lg">{service.day}</div>
                <div className="text-accent font-semibold">{service.time}</div>
                <div className="text-sm text-gray-200 mt-1">{service.note}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-200 text-sm flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Land &amp; Houses Chalong Clubhouse, Phuket
            </p>
          </div>
        </div>
      </section>

      {/* ─── New Here ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="border-l-4 border-accent pl-8">
              <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-4">
                New to PIC?
              </span>
              <h2 className="text-3xl font-bold text-text-main mb-4">{t('newHereTitle')}</h2>
              <p className="text-gray-600 text-lg mb-6">{t('newHereText')}</p>
              <Link
                href={`/${locale}/visit`}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                {t('newHereCta')} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Image
                src="/assets/church/congregation.jpg"
                alt="Congregation at worship"
                width={480}
                height={640}
                className="w-full h-56 sm:h-72 rounded-xl object-cover shadow-md"
              />
              <Image
                src="/images/church/baptism-crowd.jpg"
                alt="PIC community gathered"
                width={480}
                height={640}
                className="w-full h-56 sm:h-72 rounded-xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission / Values ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-main mb-3">{t('missionTitle')}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t('missionSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('value1Title'),
                text: t('value1Text'),
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
              },
              {
                title: t('value2Title'),
                text: t('value2Text'),
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
              },
              {
                title: t('value3Title'),
                text: t('value3Text'),
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
              },
            ].map((value) => (
              <div
                key={value.title}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Photo Gallery ──────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-main mb-2">Life at PIC</h2>
            <p className="text-gray-500">{t('gallerySubtitle')}</p>
          </div>
          {LIFE_AT_PIC_YOUTUBE_ID !== 'TBD-REPLACE-ME' && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
              <LiteYouTubeEmbed
                videoId={LIFE_AT_PIC_YOUTUBE_ID}
                title="Life at PIC"
              />
            </div>
          )}
          {/* Bento grid */}
          <div className="grid grid-cols-12 gap-3">
            {/* Large featured photo */}
            <div className="col-span-12 md:col-span-7 row-span-2 relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[400px] group">
              <Image
                src="/assets/church/worship2.jpg"
                alt="Worship at Phuket International Church"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            {/* Top right */}
            <div className="col-span-6 md:col-span-5 relative rounded-2xl overflow-hidden aspect-video group">
              <Image
                src="/assets/church/instruments.jpg"
                alt="Worship band"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            {/* Middle right */}
            <div className="col-span-6 md:col-span-5 relative rounded-2xl overflow-hidden aspect-video group">
              <Image
                src="/assets/church/worship1.jpg"
                alt="Sunday service"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            {/* Bottom row — 3 equal squares */}
            <div className="col-span-4 relative rounded-2xl overflow-hidden aspect-square group">
              <Image
                src="/assets/church/crowd.jpg"
                alt="Church community"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="col-span-4 relative rounded-2xl overflow-hidden aspect-square group">
              <Image
                src="/assets/church/fellowship.jpg"
                alt="Fellowship"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="col-span-4 relative rounded-2xl overflow-hidden aspect-square group">
              <Image
                src="/assets/church/singer.jpg"
                alt="Worship singer"
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/visit`}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Plan Your Visit →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Watch a Sermon ─────────────────────────────── */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-12 h-1 bg-accent mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">{t('watchTitle')}</h2>
              <p className="text-gray-300 text-lg mb-8">{t('watchSubtitle')}</p>
              <Link
                href={`/${locale}/sermons`}
                className="inline-block border-2 border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-gray-900 transition-colors"
              >
                {t('watchCta')} →
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              {youtubeVideoId ? (
                <LiteYouTubeEmbed videoId={youtubeVideoId} title="Latest Sermon" />
              ) : (
                <div className="aspect-video bg-white/5 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10">
                  <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  <p className="text-white/50 text-sm">Add your YouTube URL in Admin → Settings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Upcoming Events ───────────────────────────── */}
      {data.events.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-text-main">{t('upcomingEvents')}</h2>
              <Link href={`/${locale}/events`} className="text-primary hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.events.map((event: any) => {
                const tr = event.translations[0];
                return (
                  <Link key={event.id} href={`/${locale}/events/${event.slug}`}>
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 h-full">
                      <div className="text-xs font-semibold tracking-wide uppercase text-accent mb-2">
                        {format(new Date(event.startAt), 'EEE, MMM d · h:mm a')}
                      </div>
                      <h3 className="font-bold text-lg text-text-main mb-2">
                        {tr?.title || event.slug}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {event.location}
                        </p>
                      )}
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest Sermons ────────────────────────────── */}
      {data.sermons.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-text-main">{t('latestSermons')}</h2>
              <Link href={`/${locale}/sermons`} className="text-primary hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.sermons.map((sermon: any) => {
                const tr = sermon.translations[0];
                return (
                  <Link key={sermon.id} href={`/${locale}/sermons/${sermon.slug}`}>
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                      {sermon.thumbnailUrl ? (
                        <Image
                          src={sermon.thumbnailUrl}
                          alt={tr?.title || ''}
                          width={400}
                          height={225}
                          className="w-full object-cover aspect-video"
                        />
                      ) : (
                        <div className="bg-primary/10 aspect-video flex items-center justify-center">
                          <svg className="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-1">
                          {sermon.speakerName} · {sermon.preachedAt ? format(new Date(sermon.preachedAt), 'MMM d, yyyy') : ''}
                        </p>
                        <h3 className="font-bold text-text-main">{tr?.title || sermon.slug}</h3>
                        {sermon.series && (
                          <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {sermon.series}
                          </span>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Blog Posts ────────────────────────────────── */}
      {data.posts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-text-main">{t('latestBlog')}</h2>
              <Link href={`/${locale}/blog`} className="text-primary hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.posts.map((post: any) => {
                const tr = post.translations[0];
                return (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 h-full">
                      {post.publishedAt && (
                        <p className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-2">
                          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </p>
                      )}
                      <h3 className="font-bold text-text-main mb-2">{tr?.title || post.slug}</h3>
                      {tr?.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3">{tr.excerpt}</p>
                      )}
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Alpha CTA ─────────────────────────────────── */}
      <section className="bg-gray-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-1 bg-accent mx-auto mb-6" />
          <p className="text-white text-xl font-semibold mb-6">{t('alphaCta')}</p>
          <Link
            href={`/${locale}/alpha-course`}
            className="inline-block bg-accent text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg"
          >
            {t('alphaButton')}
          </Link>
        </div>
      </section>

      {/* ─── Newsletter ────────────────────────────────── */}
      <section className="bg-primary py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{t('newsletterTitle')}</h2>
          <p className="text-gray-200 mb-8">{t('newsletterText')}</p>
          <form
            action="/api/newsletter/subscribe"
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input type="hidden" name="locale" value={locale} />
            <input
              type="email"
              name="email"
              required
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 px-4 py-3 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent text-text-main px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              {t('newsletterButton')}
            </button>
          </form>
        </div>
      </section>

      {/* ─── Map Strip ─────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-main mb-2 text-center">{t('mapTitle')}</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Land &amp; Houses Chalong Clubhouse, Phuket, Thailand
          </p>
          <div className="rounded-2xl overflow-hidden shadow-md aspect-video max-w-3xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.6!2d98.3391316!3d7.8409824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f960bbd0f7d%3A0x13c402492602b4d2!2sPhuket%20International%20Church!5e0!3m2!1sen!2sth!4v1741878000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Phuket International Church location"
            />
          </div>
          <div className="text-center mt-5">
            <a
              href="https://maps.app.goo.gl/FwfTGati6eUDsFKLA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-primary text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
