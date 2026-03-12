import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendNewsletterConfirmation } from '@/lib/nodemailer';
import crypto from 'crypto';

const schema = z.object({
  email: z.string().email(),
  locale: z.enum(['en', 'th', 'ru', 'zh']).optional().default('en'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    // Handle both JSON and form submissions
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = { email: formData.get('email'), locale: formData.get('locale') || 'en' };
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { email, locale } = result.data;
  const token = crypto.randomUUID();
  const tokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { confirmToken: token, confirmTokenExp: tokenExp, locale },
    create: {
      email,
      locale,
      isActive: false,
      confirmToken: token,
      confirmTokenExp: tokenExp,
    },
  });

  try {
    await sendNewsletterConfirmation(email, token, locale);
  } catch (e) {
    console.error('Failed to send confirmation email:', e);
  }

  // If form submission, redirect to a thank-you page
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/${locale}/newsletter-pending` },
    });
  }

  return NextResponse.json({ success: true });
}
