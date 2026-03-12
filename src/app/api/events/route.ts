import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'th' | 'ru' | 'zh';
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date();

  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED', startAt: { gte: from } },
    include: { translations: { where: { locale } } },
    orderBy: { startAt: 'asc' },
    take: 20,
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      slug: body.slug,
      status: body.status || 'DRAFT',
      startAt: new Date(body.startAt),
      endAt: body.endAt ? new Date(body.endAt) : null,
      location: body.location || '',
      featuredImage: body.featuredImage,
      isRecurring: body.isRecurring || false,
      rsvpEnabled: body.rsvpEnabled || false,
      translations: { create: body.translations || [] },
    },
    include: { translations: true },
  });

  return NextResponse.json(event, { status: 201 });
}
