import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'th' | 'ru' | 'zh';
  const series = searchParams.get('series');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));

  const where = {
    status: 'PUBLISHED' as const,
    ...(series ? { series } : {}),
  };

  const [sermons, total] = await Promise.all([
    prisma.sermon.findMany({
      where,
      include: { translations: { where: { locale } } },
      orderBy: { preachedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.sermon.count({ where }),
  ]);

  return NextResponse.json({ sermons, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const sermon = await prisma.sermon.create({
    data: {
      slug: body.slug,
      status: body.status || 'DRAFT',
      series: body.series || '',
      speakerName: body.speakerName || '',
      preachedAt: body.preachedAt ? new Date(body.preachedAt) : null,
      videoUrl: body.videoUrl,
      audioUrl: body.audioUrl,
      notesUrl: body.notesUrl,
      thumbnailUrl: body.thumbnailUrl,
      translations: { create: body.translations || [] },
    },
    include: { translations: true },
  });

  return NextResponse.json(sermon, { status: 201 });
}
