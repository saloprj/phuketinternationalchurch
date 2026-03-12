import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const member = await prisma.staffMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  const body = await req.json() as {
    name?: string;
    role?: string;
    bio?: string;
    photoUrl?: string;
    email?: string;
    order?: number;
  };

  const member = await prisma.staffMember.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl || null }),
      ...(body.email !== undefined && { email: body.email || null }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id, 10);
  await prisma.staffMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
