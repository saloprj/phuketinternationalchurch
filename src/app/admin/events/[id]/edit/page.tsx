import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EventEditor from '@/components/admin/EventEditor';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) notFound();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { translations: true },
  });
  if (!event) notFound();

  const defaultLocale = { title: '', description: '', isAutoTranslated: false };
  const translationsMap = Object.fromEntries(
    event.translations.map((t) => [t.locale, { title: t.title, description: t.description, isAutoTranslated: t.isAutoTranslated }])
  );

  return (
    <EventEditor
      eventId={event.id}
      initialSlug={event.slug}
      initialStatus={event.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'}
      initialStartAt={event.startAt.toISOString().slice(0, 16)}
      initialEndAt={event.endAt?.toISOString().slice(0, 16) ?? ''}
      initialLocation={event.location}
      initialFeaturedImage={event.featuredImage ?? ''}
      initialIsRecurring={event.isRecurring}
      initialRsvpEnabled={event.rsvpEnabled}
      initialTranslations={{
        en: translationsMap['en'] ?? defaultLocale,
        th: translationsMap['th'] ?? defaultLocale,
        ru: translationsMap['ru'] ?? defaultLocale,
        zh: translationsMap['zh'] ?? defaultLocale,
      }}
    />
  );
}
