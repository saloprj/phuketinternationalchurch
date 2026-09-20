import { NextIntlClientProvider } from 'next-intl';
import Script from 'next/script';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
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

// No `alternates` here on purpose. A layout does not know which page is
// rendering, so a canonical declared at this level is inherited by every child
// page — which told Google that /visit, /groups, /give and the rest were all
// duplicates of the locale home page. Each page declares its own via
// `localeAlternates` in @/lib/alternates.

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
        {/* DialogBrain LiveChat. The widget key is public by design; it is
            restricted to this site by the widget's allowed_domains list. */}
        <Script id="dialogbrain-livechat" strategy="afterInteractive">
          {`window.DialogBrainLiveChat = { widgetKey: "960a050c-fc0a-4810-9606-775a53e8ee2f" };`}
        </Script>
        <Script
          src="https://dialogbrain.com/livechat/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
