import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import DeletePostButton from '@/components/admin/DeletePostButton';

async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      translations: {
        where: { locale: 'en' },
        select: { title: true },
      },
    },
  });
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-red-100 text-red-600',
};

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#437086' }}
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Title (EN)</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Published</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  No posts yet. Create your first post.
                </td>
              </tr>
            )}
            {posts.map((post) => {
              const enTitle = post.translations[0]?.title ?? '(Untitled)';
              return (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{enTitle}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[post.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {post.publishedAt ? format(post.publishedAt, 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#437086' }}
                      >
                        Edit
                      </Link>
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
