/**
 * WordPress → Prisma migration script
 *
 * Run: docker compose -f docker-compose.dev.yml exec app npx ts-node scripts/migrate-wp.ts
 */

import { PrismaClient, ContentStatus, Locale } from '@prisma/client';
import { load } from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();
const WP_BASE = 'https://phuketinternationalchurch.com';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'migrated');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function stripDiviShortcodes(html: string): string {
  // Remove all Divi [et_pb_*] shortcodes
  let clean = html.replace(/\[et_pb_[^\]]*\]/g, '');
  clean = clean.replace(/\[\/et_pb_[^\]]*\]/g, '');
  // Decode HTML entities
  clean = clean
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return clean.trim();
}

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'PIC-Migration/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'PIC-Migration/1.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location!;
        file.close();
        downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function autoTranslate(text: string, targetLocale: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey || !text.trim()) return text;

  const langMap: Record<string, string> = { th: 'th', ru: 'ru', zh: 'zh-CN' };
  const target = langMap[targetLocale];
  if (!target) return text;

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'html' }),
    });
    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText || text;
  } catch (e) {
    console.warn(`Translation failed for ${targetLocale}:`, e);
    return text;
  }
}

// ─── Migration Steps ───────────────────────────────────────────────────────────

async function migrateBlogPosts() {
  console.log('\n📝 Migrating blog posts...');

  let posts: any[] = [];
  try {
    posts = await fetchJson(`${WP_BASE}/wp-json/wp/v2/posts?per_page=100&status=publish`);
  } catch (e) {
    console.error('Failed to fetch posts:', e);
    return;
  }

  for (const wpPost of posts) {
    const slug = wpPost.slug || slugify(wpPost.title.rendered);
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      console.log(`  ↩ Skipping existing post: ${slug}`);
      continue;
    }

    const enContent = stripDiviShortcodes(wpPost.content.rendered);
    const enTitle = wpPost.title.rendered.replace(/<[^>]+>/g, '');
    const enExcerpt = stripDiviShortcodes(wpPost.excerpt.rendered).replace(/<[^>]+>/g, '').slice(0, 300);

    const [thContent, ruContent, zhContent] = await Promise.all([
      autoTranslate(enContent, 'th'),
      autoTranslate(enContent, 'ru'),
      autoTranslate(enContent, 'zh'),
    ]);
    const [thTitle, ruTitle, zhTitle] = await Promise.all([
      autoTranslate(enTitle, 'th'),
      autoTranslate(enTitle, 'ru'),
      autoTranslate(enTitle, 'zh'),
    ]);

    await prisma.post.create({
      data: {
        slug,
        status: 'PUBLISHED',
        publishedAt: new Date(wpPost.date),
        translations: {
          create: [
            { locale: 'en', title: enTitle, content: enContent, excerpt: enExcerpt, isAutoTranslated: false },
            { locale: 'th', title: thTitle, content: thContent, excerpt: '', isAutoTranslated: true },
            { locale: 'ru', title: ruTitle, content: ruContent, excerpt: '', isAutoTranslated: true },
            { locale: 'zh', title: zhTitle, content: zhContent, excerpt: '', isAutoTranslated: true },
          ],
        },
      },
    });

    console.log(`  ✓ Post: ${enTitle}`);
  }
}

async function migratePages() {
  console.log('\n📄 Migrating pages...');

  const PAGE_IDS = [32, 49, 313, 268, 257, 254, 211, 52, 379, 183, 192, 409, 215, 220, 240, 247, 250, 244, 232, 329, 303, 60, 588, 198, 206, 401, 274, 415, 534, 366, 371, 374];

  for (const pageId of PAGE_IDS) {
    let wpPage: any;
    try {
      wpPage = await fetchJson(`${WP_BASE}/wp-json/wp/v2/pages/${pageId}`);
    } catch (e) {
      console.warn(`  ✗ Failed to fetch page ${pageId}`);
      continue;
    }

    const slug = wpPage.slug || slugify(wpPage.title.rendered);
    const existingPage = await prisma.page.findUnique({ where: { slug } });
    if (existingPage) {
      console.log(`  ↩ Skipping existing page: ${slug}`);
      continue;
    }

    const enContent = stripDiviShortcodes(wpPage.content.rendered);
    const enTitle = wpPage.title.rendered.replace(/<[^>]+>/g, '');

    const [thContent, ruContent, zhContent] = await Promise.all([
      autoTranslate(enContent, 'th'),
      autoTranslate(enContent, 'ru'),
      autoTranslate(enContent, 'zh'),
    ]);
    const [thTitle, ruTitle, zhTitle] = await Promise.all([
      autoTranslate(enTitle, 'th'),
      autoTranslate(enTitle, 'ru'),
      autoTranslate(enTitle, 'zh'),
    ]);

    const navPages = ['about', 'visit', 'sermons', 'events', 'blog', 'contact'];

    await prisma.page.create({
      data: {
        slug,
        status: 'PUBLISHED',
        showInNav: navPages.includes(slug),
        translations: {
          create: [
            { locale: 'en', title: enTitle, content: enContent, metaDescription: '', isAutoTranslated: false },
            { locale: 'th', title: thTitle, content: thContent, metaDescription: '', isAutoTranslated: true },
            { locale: 'ru', title: ruTitle, content: ruContent, metaDescription: '', isAutoTranslated: true },
            { locale: 'zh', title: zhTitle, content: zhContent, metaDescription: '', isAutoTranslated: true },
          ],
        },
      },
    });

    console.log(`  ✓ Page: ${enTitle} (${slug})`);
  }
}

async function downloadAssets() {
  console.log('\n🖼️ Downloading assets...');

  const assets = [
    { url: `${WP_BASE}/wp-content/uploads/2019/11/phuket-international-church-logo-text.png`, name: 'logo.png' },
    { url: `${WP_BASE}/wp-content/uploads/2019/11/phuket-international-church-text-40.png`, name: 'logo-text-40.png' },
    { url: `${WP_BASE}/wp-content/uploads/2019/11/Phuket-International-Church-Head-Image-1.jpeg`, name: 'hero.jpeg' },
    { url: `${WP_BASE}/wp-content/uploads/2019/11/Phuket-International-Church-Head-Image.jpeg`, name: 'hero2.jpeg' },
    { url: `${WP_BASE}/wp-content/uploads/2019/11/Phuket-International-Church-Map.jpg`, name: 'map.jpg' },
    { url: `${WP_BASE}/wp-content/uploads/2023/06/entrance-2.jpg`, name: 'entrance.jpg' },
  ];

  const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
  fs.mkdirSync(publicAssetsDir, { recursive: true });

  for (const asset of assets) {
    const destPath = path.join(publicAssetsDir, asset.name);
    if (fs.existsSync(destPath)) {
      console.log(`  ↩ Asset already exists: ${asset.name}`);
      continue;
    }
    try {
      await downloadFile(asset.url, destPath);
      console.log(`  ✓ Downloaded: ${asset.name}`);
    } catch (e) {
      console.warn(`  ✗ Failed to download ${asset.name}:`, e);
    }
  }

  // Download church interior photos
  for (let i = 1; i <= 24; i++) {
    const num = String(i).padStart(2, '0');
    const url = `${WP_BASE}/wp-content/uploads/2023/05/church-${num}.jpg`;
    const destPath = path.join(publicAssetsDir, `church-${num}.jpg`);
    if (fs.existsSync(destPath)) continue;
    try {
      await downloadFile(url, destPath);
      console.log(`  ✓ church-${num}.jpg`);
    } catch {
      // Some may not exist
    }
  }

  // Download staff portraits
  for (let i = 1; i <= 12; i++) {
    const url = `${WP_BASE}/wp-content/uploads/2026/03/new-portrait-${i}.jpg`;
    const destPath = path.join(publicAssetsDir, `portrait-${i}.jpg`);
    if (fs.existsSync(destPath)) continue;
    try {
      await downloadFile(url, destPath);
      console.log(`  ✓ portrait-${i}.jpg`);
    } catch {
      // Best effort
    }
  }
}

async function seedSettings() {
  console.log('\n⚙️ Seeding site settings...');

  const settings = [
    { key: 'phone', value: '063-454-6790' },
    { key: 'address', value: 'Land & Houses Park, Chalong 80/19, Chalong, Phuket, Thailand' },
    { key: 'serviceSunday', value: 'Sunday 10:30 AM – 11:30 AM, Land & Houses Chalong Clubhouse' },
    { key: 'serviceRussian', value: 'Thursday 18:30' },
    { key: 'serviceTeamNight', value: 'Wednesday 8:30 PM' },
    { key: 'serviceYouth', value: 'Tuesday 6:00 PM' },
    { key: 'mapsUrl', value: 'https://maps.app.goo.gl/HDDiRhLv7J2R18kw9?g_st=ic' },
    { key: 'parkingNote', value: 'Parking available; sign in at entrance (write name + "clubhouse")' },
    { key: 'mission', value: 'Make disciples who love God and love their neighbors' },
    { key: 'missionVerse', value: 'Matthew 22:37-40, 28:19-20' },
    { key: 'affiliation', value: 'Go Love Global' },
    { key: 'liveStreamUrl', value: '' },
    { key: 'announcementBanner', value: '' },
    { key: 'facebookUrl', value: 'https://www.facebook.com/phuketinternationalchurch' },
    { key: 'latitude', value: '7.8467' },
    { key: 'longitude', value: '98.3566' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
    console.log(`  ✓ ${s.key}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting WordPress migration...');
  console.log(`WP source: ${WP_BASE}`);

  await downloadAssets();
  await migrateBlogPosts();
  await migratePages();
  await seedSettings();

  console.log('\n✅ Migration complete!');
  console.log('📝 Next steps:');
  console.log('  1. Go to /admin/staff to assign names to the 12 downloaded portrait photos');
  console.log('  2. Review auto-translated content in /admin/posts and /admin/pages');
  console.log('  3. Add YouTube sermon links in /admin/sermons');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
