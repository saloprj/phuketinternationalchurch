import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const staff = await prisma.staffMember.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as {
    name: string;
    role: string;
    bio?: string;
    photoUrl?: string;
    email?: string;
    order?: number;
  };

  if (!body.name || !body.role) {
    return NextResponse.json({ error: 'name and role are required' }, { status: 400 });
  }

  const member = await prisma.staffMember.create({
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio ?? '',
      photoUrl: body.photoUrl || null,
      email: body.email || null,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
