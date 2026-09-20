import { routing } from '@/i18n/routing';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com';

/**
 * Canonical + hreflang for one page.
 *
 * These cannot live in `[locale]/layout.tsx`: a layout does not know which
 * page is rendering, so a canonical set there is inherited by every child and
 * tells Google that /visit, /groups and the rest are duplicates of the locale
 * home page. Each page passes its own path instead.
 */
export function localeAlternates(locale: string, path = '') {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
      ),
      'x-default': `${BASE_URL}/en${path}`,
    },
  };
}
