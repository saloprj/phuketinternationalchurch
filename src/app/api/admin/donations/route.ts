import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');
  const status = searchParams.get('status');

  const where: Record<string, string> = {};
  if (method) where.method = method;
  if (status) where.status = status;

  const donations = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(donations);
}
