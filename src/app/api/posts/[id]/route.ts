import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: { translations: true },
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      slug: body.slug,
      status: body.status,
      featuredImage: body.featuredImage,
      publishedAt: body.status === 'PUBLISHED' && !body.publishedAt ? new Date() : body.publishedAt ? new Date(body.publishedAt) : undefined,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  // Upsert translations
  if (body.translations) {
    for (const tr of body.translations) {
      await prisma.postTranslation.upsert({
        where: { postId_locale: { postId: parseInt(id), locale: tr.locale } },
        update: { title: tr.title, content: tr.content, excerpt: tr.excerpt || '', isAutoTranslated: tr.isAutoTranslated || false },
        create: { postId: parseInt(id), locale: tr.locale, title: tr.title, content: tr.content, excerpt: tr.excerpt || '', isAutoTranslated: tr.isAutoTranslated || false },
      });
    }
  }

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
