import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id: parseInt(id) },
    include: { translations: true },
  });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const page = await prisma.page.update({
    where: { id: parseInt(id) },
    data: {
      slug: body.slug,
      status: body.status,
      showInNav: body.showInNav ?? false,
      navOrder: body.navOrder ?? 0,
    },
  });

  if (body.translations) {
    for (const tr of body.translations) {
      await prisma.pageTranslation.upsert({
        where: { pageId_locale: { pageId: parseInt(id), locale: tr.locale } },
        update: { title: tr.title, content: tr.content ?? '', metaDescription: tr.metaDescription ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
        create: { pageId: parseInt(id), locale: tr.locale, title: tr.title, content: tr.content ?? '', metaDescription: tr.metaDescription ?? '', isAutoTranslated: tr.isAutoTranslated ?? false },
      });
    }
  }

  return NextResponse.json(page);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.page.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
