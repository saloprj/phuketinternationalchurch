import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  if (subscriber.confirmTokenExp && subscriber.confirmTokenExp < new Date()) {
    return NextResponse.json({ error: 'Token expired. Please subscribe again.' }, { status: 400 });
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      isActive: true,
      confirmToken: null,
      confirmTokenExp: null,
    },
  });

  const locale = subscriber.locale;
  return new Response(null, {
    status: 302,
    headers: { Location: `/${locale}/newsletter-confirmed` },
  });
}
