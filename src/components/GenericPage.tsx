import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface GenericPageProps {
  slug: string;
  locale: string;
}

export default async function GenericPage({ slug, locale }: GenericPageProps) {
  let page: any = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { locale: locale as 'en' | 'th' | 'ru' | 'zh' },
        },
      },
    });
  } catch {}

  if (!page || page.status !== 'PUBLISHED') {
    notFound();
  }

  const tr = page.translations[0];
  if (!tr) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#303232] mb-8">{tr.title}</h1>
      <div
        className="prose prose-lg max-w-none prose-headings:text-[#303232] prose-a:text-[#2ea3f2]"
        dangerouslySetInnerHTML={{ __html: tr.content }}
      />
    </div>
  );
}
