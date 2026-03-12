/**
 * Batch translate all content that has isAutoTranslated=false in non-EN locales
 *
 * Run: docker compose -f docker-compose.dev.yml exec app npx ts-node scripts/translate-all.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_LOCALES = ['th', 'ru', 'zh'] as const;

async function translateText(text: string, targetLocale: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey || !text.trim()) return text;

  const langMap: Record<string, string> = { th: 'th', ru: 'ru', zh: 'zh-CN' };
  const target = langMap[targetLocale];

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target, format: 'html' }),
  });

  if (!res.ok) throw new Error(`Translation API error: ${res.statusText}`);
  const data = await res.json();
  return data.data.translations[0].translatedText;
}

async function translatePosts() {
  console.log('Translating posts...');
  const enTranslations = await prisma.postTranslation.findMany({
    where: { locale: 'en' },
    include: { post: { include: { translations: true } } },
  });

  for (const enTr of enTranslations) {
    for (const locale of TARGET_LOCALES) {
      const existing = enTr.post.translations.find((t) => t.locale === locale);
      if (existing) continue; // Already has translation

      const [title, content, excerpt] = await Promise.all([
        translateText(enTr.title, locale),
        translateText(enTr.content, locale),
        translateText(enTr.excerpt, locale),
      ]);

      await prisma.postTranslation.create({
        data: { postId: enTr.postId, locale, title, content, excerpt, isAutoTranslated: true },
      });
      console.log(`  ✓ Post ${enTr.postId} → ${locale}`);
    }
  }
}

async function translateSermons() {
  console.log('Translating sermons...');
  const enTranslations = await prisma.sermonTranslation.findMany({
    where: { locale: 'en' },
    include: { sermon: { include: { translations: true } } },
  });

  for (const enTr of enTranslations) {
    for (const locale of TARGET_LOCALES) {
      const existing = enTr.sermon.translations.find((t) => t.locale === locale);
      if (existing) continue;

      const [title, description] = await Promise.all([
        translateText(enTr.title, locale),
        translateText(enTr.description, locale),
      ]);

      await prisma.sermonTranslation.create({
        data: { sermonId: enTr.sermonId, locale, title, description, isAutoTranslated: true },
      });
      console.log(`  ✓ Sermon ${enTr.sermonId} → ${locale}`);
    }
  }
}

async function main() {
  console.log('Starting bulk translation...');
  await translatePosts();
  await translateSermons();
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
