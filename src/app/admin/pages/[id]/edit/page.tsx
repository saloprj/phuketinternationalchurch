import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PageEditor from '@/components/admin/PageEditor';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  if (isNaN(pageId)) notFound();

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { translations: true },
  });
  if (!page) notFound();

  const defaultLocale = { title: '', content: '', metaDescription: '', isAutoTranslated: false };
  const translationsMap = Object.fromEntries(
    page.translations.map((t) => [t.locale, { title: t.title, content: t.content, metaDescription: t.metaDescription, isAutoTranslated: t.isAutoTranslated }])
  );

  return (
    <PageEditor
      pageId={page.id}
      initialSlug={page.slug}
      initialStatus={page.status as 'DRAFT' | 'PUBLISHED'}
      initialShowInNav={page.showInNav}
      initialNavOrder={page.navOrder}
      initialTranslations={{
        en: translationsMap['en'] ?? defaultLocale,
        th: translationsMap['th'] ?? defaultLocale,
        ru: translationsMap['ru'] ?? defaultLocale,
        zh: translationsMap['zh'] ?? defaultLocale,
      }}
    />
  );
}
