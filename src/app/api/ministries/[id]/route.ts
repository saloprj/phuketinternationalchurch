import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const ministry = await prisma.ministry.findUnique({ where: { id } });
  if (!ministry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(ministry);
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
    description: string;
    icon: string;
    leaderName: string;
    leaderEmail: string;
    order: number;
  }>;

  const ministry = await prisma.ministry.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.leaderName !== undefined && { leaderName: body.leaderName }),
      ...(body.leaderEmail !== undefined && { leaderEmail: body.leaderEmail }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });

  return NextResponse.json(ministry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  await prisma.ministry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
