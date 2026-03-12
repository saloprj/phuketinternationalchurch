import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { subject?: string; body?: string };
  const { subject, body: html } = body;

  if (!subject || !html) {
    return NextResponse.json({ error: 'subject and body are required' }, { status: 400 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  let sent = 0;
  for (const subscriber of subscribers) {
    try {
      await sendEmail({ to: subscriber.email, subject, html });
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${subscriber.email}:`, err);
    }
  }

  return NextResponse.json({ success: true, sent });
}
