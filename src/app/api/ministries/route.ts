import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const ministries = await prisma.ministry.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(ministries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    name: string;
    description?: string;
    icon?: string;
    leaderName?: string;
    leaderEmail?: string;
    order?: number;
  };

  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const ministry = await prisma.ministry.create({
    data: {
      name: body.name,
      description: body.description ?? '',
      icon: body.icon ?? '',
      leaderName: body.leaderName ?? '',
      leaderEmail: body.leaderEmail ?? '',
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(ministry, { status: 201 });
}
