import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const groups = await prisma.homeGroup.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    name: string;
    leaderName: string;
    leaderPhone?: string;
    meetingDay?: string;
    meetingTime?: string;
    location?: string;
    gpsUrl?: string;
    photos?: string[];
    description?: string;
    order?: number;
    isActive?: boolean;
  };

  if (!body.name || !body.leaderName) {
    return NextResponse.json(
      { error: 'name and leaderName are required' },
      { status: 400 }
    );
  }

  const group = await prisma.homeGroup.create({
    data: {
      name: body.name,
      leaderName: body.leaderName,
      leaderPhone: body.leaderPhone ?? '',
      meetingDay: body.meetingDay ?? '',
      meetingTime: body.meetingTime ?? '',
      location: body.location ?? '',
      gpsUrl: body.gpsUrl ?? '',
      photos: body.photos ?? [],
      description: body.description ?? '',
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(group, { status: 201 });
}
