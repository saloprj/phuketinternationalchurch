import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { breadcrumbSchema } from '@/lib/schema-org';

type Locale = 'en' | 'th' | 'ru' | 'zh';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { translations: { where: { locale: locale as Locale } } },
    });
    if (!post) return { title: 'Post Not Found' };
    const tr = post.translations[0];
    const title = tr?.title || slug;
    const image = post.featuredImage || '/assets/church/hero.jpg';
    const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';
    return {
      title: `${title} — Phuket International Church`,
      description: tr?.excerpt || undefined,
      alternates: {
        canonical: `${SITE_URL}/${locale}/blog/${slug}`,
        languages: {
          en: `${SITE_URL}/en/blog/${slug}`,
          th: `${SITE_URL}/th/blog/${slug}`,
          ru: `${SITE_URL}/ru/blog/${slug}`,
          zh: `${SITE_URL}/zh/blog/${slug}`,
          'x-default': `${SITE_URL}/en/blog/${slug}`,
        },
      },
      openGraph: {
        title,
        description: tr?.excerpt || undefined,
        type: 'article',
        ...(post.publishedAt && { publishedTime: new Date(post.publishedAt).toISOString() }),
        images: [{ url: image, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: tr?.excerpt || undefined,
        images: [image],
      },
    };
  } catch {
    return { title: 'Blog — Phuket International Church' };
  }
}

const SITE_URL = 'https://phuketinternationalchurch.com';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let post: any = null;
  try {
    post = await prisma.post.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: { translations: { where: { locale: locale as Locale } } },
    });
  } catch {
    // DB not available
  }

  if (!post) notFound();

  const tr = post.translations[0];
  const title = tr?.title || post.slug;
  const postUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: tr?.excerpt || '',
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    image: post.featuredImage || undefined,
    url: postUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Phuket International Church',
      url: SITE_URL,
    },
  };

  const shareLinks = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`,
      color: 'bg-gray-900 hover:bg-black',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${postUrl}`)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  const crumbsLd = breadcrumbSchema([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: 'Blog', url: `${SITE_URL}/${locale}/blog` },
    { name: title, url: postUrl },
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href={`/${locale}/blog`} className="hover:text-primary">
            Blog
          </Link>
          <span className="mx-2">›</span>
          <span className="text-text-main line-clamp-1">{title}</span>
        </nav>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video relative">
            <Image
              src={post.featuredImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {post.publishedAt && (
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </time>
            )}
          </div>
          {tr?.excerpt && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              {tr.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        {tr?.content && (
          <div
            className="prose prose-lg max-w-none prose-headings:text-text-main prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: tr.content }}
          />
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm font-semibold text-text-main mb-3">
            Share this post
          </p>
          <div className="flex flex-wrap gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href={`/${locale}/blog`}
            className="text-primary hover:underline font-medium text-sm"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    </>
  );
}
