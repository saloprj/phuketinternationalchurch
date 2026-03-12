import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: { translations: true },
  });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const event = await prisma.event.update({
    where: { id: parseInt(id) },
    data: {
      slug: body.slug,
      status: body.status,
      startAt: new Date(body.startAt),
      endAt: body.endAt ? new Date(body.endAt) : null,
      location: body.location ?? '',
      featuredImage: body.featuredImage ?? null,
      isRecurring: body.isRecurring ?? false,
      rsvpEnabled: body.rsvpEnabled ?? false,
    },
  });

  if (body.translations) {
    for (const tr of body.translations) {
      await prisma.eventTranslation.upsert({
        where: { eventId_locale: { eventId: parseInt(id), locale: tr.locale } },
        update: { title: tr.title, description: tr.description ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
        create: { eventId: parseInt(id), locale: tr.locale, title: tr.title, description: tr.description ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
      });
    }
  }

  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.event.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
