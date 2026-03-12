import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = await prisma.sermon.findUnique({
    where: { id: parseInt(id) },
    include: { translations: true },
  });
  if (!sermon) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(sermon);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const sermon = await prisma.sermon.update({
    where: { id: parseInt(id) },
    data: {
      slug: body.slug,
      status: body.status,
      speakerName: body.speakerName ?? '',
      series: body.series ?? '',
      preachedAt: body.preachedAt ? new Date(body.preachedAt) : null,
      videoUrl: body.videoUrl ?? null,
      audioUrl: body.audioUrl ?? null,
      notesUrl: body.notesUrl ?? null,
      thumbnailUrl: body.thumbnailUrl ?? null,
    },
  });

  if (body.translations) {
    for (const tr of body.translations) {
      await prisma.sermonTranslation.upsert({
        where: { sermonId_locale: { sermonId: parseInt(id), locale: tr.locale } },
        update: { title: tr.title, description: tr.description ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
        create: { sermonId: parseInt(id), locale: tr.locale, title: tr.title, description: tr.description ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
      });
    }
  }

  return NextResponse.json(sermon);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.sermon.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
