import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { prayerLimiter } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  request: z.string().min(10).max(5000),
  isPublic: z.boolean().optional().default(false),
  consent: z.literal(true),
  locale: z.enum(['en', 'th', 'ru', 'zh']).optional().default('en'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const limit = prayerLimiter.check(ip);

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = result.data;

  await prisma.prayerRequest.create({
    data: {
      name: data.name,
      email: data.email || null,
      request: data.request,
      isPublic: data.isPublic,
      locale: data.locale,
    },
  });

  return NextResponse.json({ success: true });
}
