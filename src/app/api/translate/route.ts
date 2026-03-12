import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { translateText } from '@/lib/translate';
import { translateLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const limit = translateLimiter.check(ip);
  if (!limit.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { text, targetLocales } = await req.json();

  if (!text || !targetLocales?.length) {
    return NextResponse.json({ error: 'text and targetLocales are required' }, { status: 400 });
  }

  const results: Record<string, string> = {};
  await Promise.all(
    targetLocales.map(async (locale: 'th' | 'ru' | 'zh') => {
      results[locale] = await translateText(text, locale);
    })
  );

  return NextResponse.json(results);
}
