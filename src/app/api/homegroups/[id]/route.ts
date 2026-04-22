import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const group = await prisma.homeGroup.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(group);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  const body = (await req.json()) as Partial<{
    name: string;
    leaderName: string;
    leaderPhone: string;
    meetingDay: string;
    meetingTime: string;
    location: string;
    gpsUrl: string;
    photos: string[];
    description: string;
    order: number;
    isActive: boolean;
  }>;

  const group = await prisma.homeGroup.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.leaderName !== undefined && { leaderName: body.leaderName }),
      ...(body.leaderPhone !== undefined && { leaderPhone: body.leaderPhone }),
      ...(body.meetingDay !== undefined && { meetingDay: body.meetingDay }),
      ...(body.meetingTime !== undefined && { meetingTime: body.meetingTime }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.gpsUrl !== undefined && { gpsUrl: body.gpsUrl }),
      ...(body.photos !== undefined && { photos: body.photos }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.order !== undefined && { order: body.order }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  });

  return NextResponse.json(group);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  await prisma.homeGroup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
