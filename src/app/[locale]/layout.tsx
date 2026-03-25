import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBanner from '@/components/ui/AnnouncementBanner';
import { prisma } from '@/lib/prisma';
import { churchSchema } from '@/lib/schema-org';
import { routing } from '@/i18n/routing';

const locales = routing.locales;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        th: `${baseUrl}/th`,
        ru: `${baseUrl}/ru`,
        zh: `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as 'en' | 'th' | 'ru' | 'zh')) {
    notFound();
  }

  const messages = await getMessages();

  // Fetch announcement banner from DB
  let announcementBanner = '';
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'announcementBanner' },
    });
    announcementBanner = setting?.value || '';
  } catch {
    // DB may not be available during build
  }

  const schema = churchSchema();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          {announcementBanner && <AnnouncementBanner message={announcementBanner} />}
          <Header locale={locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
