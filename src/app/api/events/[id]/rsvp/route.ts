import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  locale: z.enum(['en', 'th', 'ru', 'zh']).optional().default('en'),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  if (!event.rsvpEnabled) return NextResponse.json({ error: 'RSVP not enabled for this event' }, { status: 400 });

  const result = schema.safeParse(await req.json());
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const rsvp = await prisma.eventRsvp.create({
    data: {
      eventId: parseInt(id),
      name: result.data.name,
      email: result.data.email,
      locale: result.data.locale,
    },
  });

  return NextResponse.json({ success: true, rsvpId: rsvp.id }, { status: 201 });
}
