import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'th' | 'ru' | 'zh';

  if (slug) {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
    if (!page || page.status !== 'PUBLISHED') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(page);
  }

  const pages = await prisma.page.findMany({
    where: { status: 'PUBLISHED' },
    include: { translations: { where: { locale } } },
    orderBy: [{ showInNav: 'desc' }, { navOrder: 'asc' }],
  });
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const page = await prisma.page.create({
    data: {
      slug: body.slug,
      status: body.status || 'DRAFT',
      showInNav: body.showInNav ?? false,
      navOrder: body.navOrder ?? 0,
      translations: { create: body.translations || [] },
    },
    include: { translations: true },
  });

  return NextResponse.json(page, { status: 201 });
}
