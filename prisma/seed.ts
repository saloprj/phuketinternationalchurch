import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create super admin
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@phuketinternationalchurch.com' },
    update: {},
    create: {
      email: 'admin@phuketinternationalchurch.com',
      name: 'Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✓ Admin user created');

  // Seed site settings
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
    { key: 'affiliation', value: 'Assemblies of God' },
    { key: 'liveStreamUrl', value: '' },
    { key: 'announcementBanner', value: '' },
    { key: 'facebookUrl', value: 'https://www.facebook.com/phuketinternationalchurch' },
    { key: 'youtubeUrl', value: '' },
    { key: 'instagramUrl', value: '' },
    { key: 'latitude', value: '7.8467' },
    { key: 'longitude', value: '98.3566' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✓ Site settings seeded');

  // Create sample published sermon
  const sermon = await prisma.sermon.upsert({
    where: { slug: 'welcome-to-phuket-international-church' },
    update: {},
    create: {
      slug: 'welcome-to-phuket-international-church',
      status: 'PUBLISHED',
      series: 'Getting Started',
      speakerName: 'Pastor Bill Yacko',
      preachedAt: new Date('2024-01-07'),
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Welcome to Phuket International Church',
            description: 'An introduction to our church community and what we believe.',
            isAutoTranslated: false,
          },
          {
            locale: 'th',
            title: 'ยินดีต้อนรับสู่โบสถ์นานาชาติภูเก็ต',
            description: 'บทนำเกี่ยวกับชุมชนคริสตจักรของเราและสิ่งที่เราเชื่อ',
            isAutoTranslated: true,
          },
          {
            locale: 'ru',
            title: 'Добро пожаловать в Международную церковь Пхукета',
            description: 'Введение в нашу церковную общину и наши убеждения.',
            isAutoTranslated: true,
          },
          {
            locale: 'zh',
            title: '欢迎来到普吉国际教会',
            description: '介绍我们的教会社区和我们的信仰。',
            isAutoTranslated: true,
          },
        ],
      },
    },
  });
  console.log('✓ Sample sermon created');

  // Create sample event
  const nextSunday = new Date();
  nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) % 7 || 7);
  nextSunday.setHours(10, 30, 0, 0);

  await prisma.event.upsert({
    where: { slug: 'sunday-worship-service' },
    update: {},
    create: {
      slug: 'sunday-worship-service',
      status: 'PUBLISHED',
      startAt: nextSunday,
      endAt: new Date(nextSunday.getTime() + 60 * 60 * 1000),
      location: 'Land & Houses Chalong Clubhouse',
      isRecurring: true,
      rsvpEnabled: false,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Sunday Worship Service',
            description: 'Join us every Sunday at 10:30 AM for worship, teaching, and community.',
            isAutoTranslated: false,
          },
          {
            locale: 'th',
            title: 'การนมัสการวันอาทิตย์',
            description: 'มาร่วมกับเราทุกวันอาทิตย์เวลา 10:30 น. เพื่อนมัสการ การสอน และชุมชน',
            isAutoTranslated: true,
          },
          {
            locale: 'ru',
            title: 'Воскресное богослужение',
            description: 'Присоединяйтесь к нам каждое воскресенье в 10:30 на богослужение, поучение и общение.',
            isAutoTranslated: true,
          },
          {
            locale: 'zh',
            title: '主日崇拜',
            description: '每个星期日上午10:30加入我们，一起敬拜、学习和团契。',
            isAutoTranslated: true,
          },
        ],
      },
    },
  });
  console.log('✓ Sample event created');

  // Create sample blog post
  await prisma.post.upsert({
    where: { slug: 'a-church-for-all-nations' },
    update: {},
    create: {
      slug: 'a-church-for-all-nations',
      status: 'PUBLISHED',
      publishedAt: new Date('2023-05-21'),
      translations: {
        create: [
          {
            locale: 'en',
            title: 'A Church for All Nations',
            excerpt: 'Phuket International Church exists to welcome people from every nation, tribe, and language.',
            content: '<p>Phuket International Church exists to welcome people from every nation, tribe, and language. We believe that the Church is meant to be a foretaste of heaven — a place where all are welcome at God\'s table.</p><p>Our congregation includes people from Thailand, Russia, China, the UK, the USA, Australia, and dozens of other nations. We worship together in English, with Thai and Russian services also available.</p>',
            isAutoTranslated: false,
          },
          {
            locale: 'th',
            title: 'คริสตจักรสำหรับทุกชาติ',
            excerpt: 'คริสตจักรนานาชาติภูเก็ตมีอยู่เพื่อต้อนรับผู้คนจากทุกชาติ เผ่าพันธุ์ และภาษา',
            content: '<p>คริสตจักรนานาชาติภูเก็ตมีอยู่เพื่อต้อนรับผู้คนจากทุกชาติ เผ่าพันธุ์ และภาษา</p>',
            isAutoTranslated: true,
          },
          {
            locale: 'ru',
            title: 'Церковь для всех народов',
            excerpt: 'Международная церковь Пхукета существует для того, чтобы приветствовать людей из всех наций, племён и языков.',
            content: '<p>Международная церковь Пхукета существует для того, чтобы приветствовать людей из всех наций, племён и языков.</p>',
            isAutoTranslated: true,
          },
          {
            locale: 'zh',
            title: '万国之教会',
            excerpt: '普吉国际教会的使命是欢迎来自各国、各族、各语言的人们。',
            content: '<p>普吉国际教会的使命是欢迎来自各国、各族、各语言的人们。</p>',
            isAutoTranslated: true,
          },
        ],
      },
    },
  });
  console.log('✓ Sample blog post created');

  // Create core pages
  const pages = [
    {
      slug: 'about',
      showInNav: true,
      navOrder: 1,
      title: 'About Us',
      content: '<h2>Who We Are</h2><p>Phuket International Church is an international, multicultural church located in the heart of Phuket, Thailand. We are affiliated with the Assemblies of God and are committed to the mission of making disciples who love God and love their neighbors.</p>',
    },
    {
      slug: 'visit',
      showInNav: true,
      navOrder: 2,
      title: 'Plan Your Visit',
      content: '<h2>We\'d Love to Meet You!</h2><p>We know that visiting a new church can feel daunting. Here\'s everything you need to know to make your first visit comfortable and enjoyable.</p><h3>Service Times</h3><ul><li><strong>Sunday</strong> – 10:30 AM to 11:30 AM (English)</li><li><strong>Thursday</strong> – 18:30 (Russian)</li></ul><h3>Location</h3><p>Land & Houses Park, Chalong 80/19, Chalong, Phuket, Thailand</p><h3>Parking</h3><p>Parking is available at the venue. When you arrive, please sign in at the entrance — write your name and "clubhouse".</p><h3>What to Expect</h3><p>Our services are relaxed and welcoming. Dress is casual. Each service includes contemporary worship music, a Bible-based message, and time for connection.</p><h3>Kids Program</h3><p>We have a wonderful kids program running simultaneously with the adult service for children aged 0–12.</p>',
    },
    {
      slug: 'give',
      showInNav: false,
      navOrder: 0,
      title: 'Give',
      content: '<h2>Support Our Mission</h2><p>Your generosity enables us to serve Phuket and the world. All gifts go directly toward ministry, outreach, and community programs.</p>',
    },
  ];

  for (const pageData of pages) {
    const { title, content, ...rest } = pageData;
    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {},
      create: {
        ...rest,
        status: 'PUBLISHED',
        translations: {
          create: [
            { locale: 'en', title, content, isAutoTranslated: false },
            { locale: 'th', title: title + ' (TH)', content, isAutoTranslated: true },
            { locale: 'ru', title: title + ' (RU)', content, isAutoTranslated: true },
            { locale: 'zh', title: title + ' (ZH)', content, isAutoTranslated: true },
          ],
        },
      },
    });
  }
  console.log('✓ Core pages created');

  console.log('\nSeeding complete!');
  console.log('Admin login: admin@phuketinternationalchurch.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
