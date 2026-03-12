import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';
const LOCALES = ['en', 'th', 'ru', 'zh'];

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
    '/baptism',
    '/salvation',
    '/resources',
    '/groups',
    '/serving',
    '/outreach',
    '/mission',
    '/next-steps',
    '/privacy-policy',
    '/cookie-policy',
  ];

  const staticEntries = staticPaths.flatMap((p) => localizedUrls(p));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const [posts, events, sermons] = await Promise.all([
      prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      prisma.event.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      prisma.sermon.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    ]);

    const postEntries = posts.flatMap((p) => localizedUrls(`/blog/${p.slug}`, p.updatedAt));
    const eventEntries = events.flatMap((e) => localizedUrls(`/events/${e.slug}`, e.updatedAt));
    const sermonEntries = sermons.flatMap((s) => localizedUrls(`/sermons/${s.slug}`, s.updatedAt));

    dynamicEntries = [...postEntries, ...eventEntries, ...sermonEntries];
  } catch {
    // DB not available during build
  }

  return [...staticEntries, ...dynamicEntries];
}
