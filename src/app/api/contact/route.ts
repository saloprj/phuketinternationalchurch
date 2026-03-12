import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/nodemailer';
import { contactFormLimiter } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  consent: z.literal(true),
  locale: z.enum(['en', 'th', 'ru', 'zh']).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const limit = contactFormLimiter.check(ip);

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

  await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      locale: data.locale || 'en',
    },
  });

  try {
    await sendContactNotification(data);
  } catch (e) {
    console.error('Email send failed:', e);
    // Don't fail the request if email fails
  }

  return NextResponse.json({ success: true });
}
