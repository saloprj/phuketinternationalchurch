import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';

type Props = {
  params: { id: string };
};

async function getPost(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { translations: true },
  });
}

export default async function EditPostPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const post = await getPost(id);
  if (!post) notFound();

  const translationsMap = Object.fromEntries(
    post.translations.map((t) => [
      t.locale,
      {
        title: t.title,
        excerpt: t.excerpt,
        content: t.content,
        isAutoTranslated: t.isAutoTranslated,
      },
    ])
  );

  const defaultLocale = {
    title: '',
    excerpt: '',
    content: '',
    isAutoTranslated: false,
  };

  const initialTranslations = {
    en: translationsMap['en'] ?? defaultLocale,
    th: translationsMap['th'] ?? defaultLocale,
    ru: translationsMap['ru'] ?? defaultLocale,
    zh: translationsMap['zh'] ?? defaultLocale,
  };

  return (
    <PostEditor
      postId={post.id}
      initialSlug={post.slug}
      initialStatus={post.status}
      initialFeaturedImage={post.featuredImage ?? ''}
      initialScheduledAt={post.scheduledAt?.toISOString() ?? ''}
      initialTranslations={initialTranslations}
    />
  );
}
