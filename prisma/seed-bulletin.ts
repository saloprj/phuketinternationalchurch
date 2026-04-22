import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function gpsFor(location: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(`${location}, Phuket, Thailand`)}`;
}

function firstWednesdayOfMonth(year: number, month: number): Date {
  const d = new Date(Date.UTC(year, month - 1, 1, 11, 30, 0));
  const dow = d.getUTCDay();
  const offset = (3 - dow + 7) % 7;
  d.setUTCDate(1 + offset);
  return d;
}

async function seedStaff() {
  const staff = [
    {
      name: 'Pastor Bill Yacko',
      role: 'Senior Pastor',
      bio: 'Senior Pastor of Phuket International Church.',
      photoUrl: '/images/pastor-bill.jpg',
      email: 'byacko@gmail.com',
      order: 1,
    },
    {
      name: 'Pastor Bonnie',
      role: 'Pastor — Ladies Ministry & Chalong English Group',
      bio: '',
      photoUrl: null,
      email: null,
      order: 2,
    },
    {
      name: 'Pastor Dan Skitch',
      role: 'Youth Pastor',
      bio: '',
      photoUrl: null,
      email: null,
      order: 3,
    },
    {
      name: 'Pastor Benz',
      role: 'Pastor — Rawai Home Group',
      bio: '',
      photoUrl: null,
      email: null,
      order: 4,
    },
  ];

  for (const s of staff) {
    await prisma.staffMember.upsert({
      where: { name: s.name },
      update: {
        role: s.role,
        bio: s.bio,
        photoUrl: s.photoUrl,
        email: s.email,
        order: s.order,
      },
      create: s,
    });
  }
  console.log(`✓ Staff: ${staff.length} members upserted`);
}

async function seedHomeGroups() {
  const groups = [
    {
      name: 'Youth Ministry',
      leaderName: 'Pastor Dan Skitch',
      leaderPhone: '+66 62 305 0286',
      meetingDay: 'Tuesday',
      meetingTime: '6:00 PM',
      location: 'Skitches home, Land & Houses',
      order: 1,
    },
    {
      name: "Men's Group",
      leaderName: 'Pastor Bill Yacko',
      leaderPhone: '+66 63 454 6790',
      meetingDay: 'Thursday',
      meetingTime: '10:00 AM',
      location: "Pastor Bill's home",
      order: 2,
    },
    {
      name: 'Chalong English Group',
      leaderName: 'Pastor Bonnie',
      leaderPhone: '+66 63 454 6927',
      meetingDay: 'Tuesday',
      meetingTime: '6:00 PM',
      location: 'Land & House Chalong',
      order: 3,
    },
    {
      name: 'Rawai Home Group',
      leaderName: 'Pastor Benz',
      leaderPhone: '+66 83 640 4483',
      meetingDay: 'Thursday',
      meetingTime: '5:30 PM',
      location: "Rafael & Aurea's Home, Rawai",
      order: 4,
    },
    {
      name: 'Warriors for Christ',
      leaderName: 'Josh',
      leaderPhone: '+1 717 881 1054',
      meetingDay: 'Tuesday',
      meetingTime: '10:00 AM',
      location: 'Soi Taed',
      order: 5,
    },
    {
      name: 'Thai Group',
      leaderName: 'Mr. Jalil & Ms. Fah',
      leaderPhone: '+66 97 027 9612',
      meetingDay: 'Thursday',
      meetingTime: '6:00 PM',
      location: 'Chalong',
      order: 6,
    },
    {
      name: 'Chinese Group',
      leaderName: 'Ms. Malee',
      leaderPhone: '+66 62 201 6824',
      meetingDay: 'Wednesday',
      meetingTime: '6:00 PM',
      location: "Ms. Malee's house",
      order: 7,
    },
    {
      name: 'Russian Group',
      leaderName: 'Denys',
      leaderPhone: '+66 93 584 9584',
      meetingDay: 'Thursday',
      meetingTime: '6:00 PM',
      location: 'Nai Harn',
      order: 8,
    },
  ];

  for (const g of groups) {
    const data = {
      ...g,
      gpsUrl: gpsFor(g.location),
      photos: [],
      description: '',
      isActive: true,
    };
    await prisma.homeGroup.upsert({
      where: { name: g.name },
      update: {
        leaderName: data.leaderName,
        leaderPhone: data.leaderPhone,
        meetingDay: data.meetingDay,
        meetingTime: data.meetingTime,
        location: data.location,
        gpsUrl: data.gpsUrl,
        order: data.order,
        isActive: data.isActive,
      },
      create: data,
    });
  }
  console.log(`✓ Home Groups: ${groups.length} upserted`);
}

async function seedMinistries() {
  const ministries = [
    {
      name: 'Guest Service Team',
      description: 'Usher, greeter, coffee setup, and chair setup for Sunday services.',
      icon: 'HandHeart',
      order: 1,
    },
    {
      name: 'Media / Sound / Projector',
      description: 'Run sound, slides, and recording for Sunday services.',
      icon: 'Radio',
      order: 2,
    },
    {
      name: 'Small Group Leader',
      description: 'Lead a home fellowship group during the week.',
      icon: 'Users',
      order: 3,
    },
    {
      name: "Children's Ministry",
      description: 'Teach and care for children during the Sunday service.',
      icon: 'Baby',
      order: 4,
    },
    {
      name: 'Music Ministry',
      description: 'Sing or play an instrument on the worship team.',
      icon: 'Music',
      order: 5,
    },
    {
      name: 'Youth Ministry',
      description: 'Mentor and walk alongside youth on Tuesday evenings.',
      icon: 'Sparkles',
      order: 6,
    },
  ];

  for (const m of ministries) {
    await prisma.ministry.upsert({
      where: { name: m.name },
      update: {
        description: m.description,
        icon: m.icon,
        order: m.order,
      },
      create: { ...m, leaderName: '', leaderEmail: '' },
    });
  }
  console.log(`✓ Ministries: ${ministries.length} upserted`);
}

async function upsertEvent(opts: {
  slug: string;
  startAt: Date;
  endAt?: Date;
  location: string;
  title: string;
  description: string;
}) {
  const existing = await prisma.event.findUnique({
    where: { slug: opts.slug },
    include: { translations: true },
  });
  if (existing) {
    await prisma.event.update({
      where: { id: existing.id },
      data: {
        status: 'PUBLISHED',
        startAt: opts.startAt,
        endAt: opts.endAt,
        location: opts.location,
        isRecurring: false,
      },
    });
    const enTr = existing.translations.find((t) => t.locale === 'en');
    if (enTr) {
      await prisma.eventTranslation.update({
        where: { id: enTr.id },
        data: { title: opts.title, description: opts.description },
      });
    } else {
      await prisma.eventTranslation.create({
        data: {
          eventId: existing.id,
          locale: 'en',
          title: opts.title,
          description: opts.description,
        },
      });
    }
  } else {
    await prisma.event.create({
      data: {
        slug: opts.slug,
        status: 'PUBLISHED',
        startAt: opts.startAt,
        endAt: opts.endAt,
        location: opts.location,
        isRecurring: false,
        translations: {
          create: [
            {
              locale: 'en',
              title: opts.title,
              description: opts.description,
            },
          ],
        },
      },
    });
  }
}

async function seedEvents() {
  await upsertEvent({
    slug: 'easter-egg-hunt-2026',
    startAt: new Date('2026-04-05T03:30:00.000Z'),
    location: 'Land & Houses Chalong Clubhouse',
    title: 'Easter Egg Hunt',
    description:
      'Ages 0–12 — all children welcome! The entire church will hide eggs.',
  });

  await upsertEvent({
    slug: 'potluck-2026-04-19',
    startAt: new Date('2026-04-19T04:30:00.000Z'),
    location: 'Land & Houses Chalong Clubhouse',
    title: 'Potluck',
    description:
      'Please bring food to share. You are invited to join us for a meal after church.',
  });

  let ladiesCount = 0;
  for (let m = 5; m <= 12; m++) {
    const d = firstWednesdayOfMonth(2026, m);
    const slug = `ladies-fellowship-2026-${String(m).padStart(2, '0')}`;
    await upsertEvent({
      slug,
      startAt: d,
      location: "Pastor Bonnie's house",
      title: 'Ladies Fellowship',
      description:
        "6:30 PM at Pastor Bonnie's house. The meeting is on the first Wednesday of each month.",
    });
    ladiesCount++;
  }

  console.log(`✓ Events: 2 one-offs + ${ladiesCount} Ladies Fellowship rows upserted`);
}

async function main() {
  console.log('Seeding bulletin content...');
  await seedStaff();
  await seedHomeGroups();
  await seedMinistries();
  await seedEvents();
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
