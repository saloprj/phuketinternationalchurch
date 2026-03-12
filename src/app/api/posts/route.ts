import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'th' | 'ru' | 'zh';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: { translations: { where: { locale } } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ]);

  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const post = await prisma.post.create({
    data: {
      slug: body.slug,
      status: body.status || 'DRAFT',
      featuredImage: body.featuredImage,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      translations: { create: body.translations || [] },
    },
    include: { translations: true },
  });

  return NextResponse.json(post, { status: 201 });
}
