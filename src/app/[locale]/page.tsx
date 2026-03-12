import { getTranslations } from 'next-intl/server';
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
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: 'Phuket International Church — ' + t('heroTitle'),
    description: t('heroSubtitle'),
  };
}

async function getHomeData(locale: Locale) {
  const [posts, events, sermons] = await Promise.all([
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
  ]);
  return { posts, events, sermons };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tn = await getTranslations({ locale, namespace: 'nav' });

  let data = { posts: [] as any[], events: [] as any[], sermons: [] as any[] };
  try {
    data = await getHomeData(locale as Locale);
  } catch {
    // DB not available during build
  }

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero.jpeg"
            alt="Phuket International Church congregation worshipping together"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 max-w-2xl mb-10">
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
              className="bg-white/10 backdrop-blur text-white border border-white/30 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              {t('heroCtaSermons')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Service Times ─────────────────────────────── */}
      <section className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold mb-8">{t('serviceTimesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { day: 'Sunday', time: '10:30 AM – 11:30 AM', note: 'English Service', icon: '🙏' },
              { day: 'Thursday', time: '6:30 PM', note: 'Russian Service', icon: '🎵' },
              { day: 'Wednesday', time: '8:30 PM', note: 'Team Night', icon: '🌙' },
              { day: 'Tuesday', time: '6:00 PM', note: 'Youth', icon: '⚡' },
            ].map((service) => (
              <div key={service.day} className="bg-white/10 rounded-xl p-5">
                <div className="text-3xl mb-2">{service.icon}</div>
                <div className="font-bold text-lg">{service.day}</div>
                <div className="text-accent font-semibold">{service.time}</div>
                <div className="text-sm text-gray-200 mt-1">{service.note}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-200 text-sm">
              📍 Land & Houses Chalong Clubhouse, Phuket
            </p>
          </div>
        </div>
      </section>

      {/* ─── New Here ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-text-main mb-4">{t('newHereTitle')}</h2>
              <p className="text-gray-600 text-lg mb-6">{t('newHereText')}</p>
              <Link
                href={`/${locale}/visit`}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                {t('newHereCta')} →
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/assets/entrance.jpg"
                alt="Church entrance"
                width={300}
                height={220}
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Upcoming Events ───────────────────────────── */}
      {data.events.length > 0 && (
        <section className="py-16">
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
                      <div className="text-accent font-bold text-sm mb-2">
                        {format(new Date(event.startAt), 'EEE, MMM d · h:mm a')}
                      </div>
                      <h3 className="font-bold text-lg text-text-main mb-2">
                        {tr?.title || event.slug}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-gray-500">📍 {event.location}</p>
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
                          <span className="text-4xl">🎙️</span>
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-xs text-gray-500 mb-1">
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
        <section className="py-16">
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
                        <p className="text-xs text-gray-500 mb-2">
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
      <section className="bg-accent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-main text-xl font-semibold mb-4">{t('alphaCta')}</p>
          <Link
            href={`/${locale}/alpha-course`}
            className="inline-block bg-text-main text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
          <h2 className="text-2xl font-bold text-text-main mb-6 text-center">{t('mapTitle')}</h2>
          <div className="rounded-2xl overflow-hidden shadow-md aspect-video max-w-3xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.869167!2d98.35660!3d7.84670!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPhuket+International+Church!5e0!3m2!1sen!2sth!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Phuket International Church location"
            />
          </div>
          <div className="text-center mt-4">
            <a
              href="https://maps.app.goo.gl/HDDiRhLv7J2R18kw9?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
