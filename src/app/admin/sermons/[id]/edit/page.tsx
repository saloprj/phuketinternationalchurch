import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SermonEditor from '@/components/admin/SermonEditor';

export default async function EditSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermonId = parseInt(id, 10);
  if (isNaN(sermonId)) notFound();

  const sermon = await prisma.sermon.findUnique({
    where: { id: sermonId },
    include: { translations: true },
  });
  if (!sermon) notFound();

  const defaultLocale = { title: '', description: '', isAutoTranslated: false };
  const translationsMap = Object.fromEntries(
    sermon.translations.map((t) => [t.locale, { title: t.title, description: t.description, isAutoTranslated: t.isAutoTranslated }])
  );

  return (
    <SermonEditor
      sermonId={sermon.id}
      initialSlug={sermon.slug}
      initialStatus={sermon.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'}
      initialSpeakerName={sermon.speakerName}
      initialSeries={sermon.series}
      initialPreachedAt={sermon.preachedAt ? sermon.preachedAt.toISOString().slice(0, 10) : ''}
      initialVideoUrl={sermon.videoUrl ?? ''}
      initialAudioUrl={sermon.audioUrl ?? ''}
      initialNotesUrl={sermon.notesUrl ?? ''}
      initialThumbnailUrl={sermon.thumbnailUrl ?? ''}
      initialTranslations={{
        en: translationsMap['en'] ?? defaultLocale,
        th: translationsMap['th'] ?? defaultLocale,
        ru: translationsMap['ru'] ?? defaultLocale,
        zh: translationsMap['zh'] ?? defaultLocale,
      }}
    />
  );
}
