import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'];
const ALLOWED_DOC_TYPES = ['application/pdf'];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const mimeType = file.type;
  let folder = 'misc';
  let maxSize = MAX_IMAGE_SIZE;

  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    folder = 'images';
    maxSize = MAX_IMAGE_SIZE;
  } else if (ALLOWED_AUDIO_TYPES.includes(mimeType)) {
    folder = 'audio';
    maxSize = MAX_AUDIO_SIZE;
  } else if (ALLOWED_DOC_TYPES.includes(mimeType)) {
    folder = 'documents';
    maxSize = MAX_IMAGE_SIZE;
  } else {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
