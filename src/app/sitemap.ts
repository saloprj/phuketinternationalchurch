import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// The sitemap reads the database, so it must not stay frozen at the value it had
// when the image was built — otherwise a post or page published in the admin panel
// never reaches search engines until the next deploy. The database is not reachable
// during the Docker build either, so a cached copy is not just stale, it is empty of
// every dynamic entry. Crawlers fetch this a handful of times a day; build it per
// request and keep it correct.
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';
const LOCALES = ['en', 'th', 'ru', 'zh'];

// Routes rendered by <GenericPage>: they 404 until a Page row with that slug is
// PUBLISHED, so they are listed from the database rather than hardcoded.
const CMS_PAGE_SLUGS = [
  'baptism',
  'care',
  'kids',
  'mission',
  'next-steps',
  'outreach',
  'parents',
  'resources',
  'salvation',
  'students',
];

function localizedUrls(path: string, lastModified?: Date) {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: lastModified || new Date(),
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '',
    '/about',
    '/visit',
    '/sermons',
    '/events',
    '/blog',
    '/give',
    '/contact',
    '/prayer',
    '/live',
    '/alpha-course',
    '/groups',
    '/serving',
    '/privacy-policy',
    '/cookie-policy',
    '/about/what-we-believe',
    '/bylaws',
  ];

  const staticEntries = staticPaths.flatMap((p) => localizedUrls(p));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const [posts, events, sermons, cmsPages] = await Promise.all([
      prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      prisma.event.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      prisma.sermon.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      prisma.page.findMany({
        where: { status: 'PUBLISHED', slug: { in: CMS_PAGE_SLUGS } },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const postEntries = posts.flatMap((p) => localizedUrls(`/blog/${p.slug}`, p.updatedAt));
    const eventEntries = events.flatMap((e) => localizedUrls(`/events/${e.slug}`, e.updatedAt));
    const sermonEntries = sermons.flatMap((s) => localizedUrls(`/sermons/${s.slug}`, s.updatedAt));

    const cmsPageEntries = cmsPages.flatMap((p) => localizedUrls(`/${p.slug}`, p.updatedAt));

    dynamicEntries = [...postEntries, ...eventEntries, ...sermonEntries, ...cmsPageEntries];
  } catch {
    // DB not available during build
  }

  return [...staticEntries, ...dynamicEntries];
}
