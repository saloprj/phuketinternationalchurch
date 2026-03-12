import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'th', 'ru', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
