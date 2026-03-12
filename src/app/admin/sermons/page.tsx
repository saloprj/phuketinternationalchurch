import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

async function getSermons() {
  return prisma.sermon.findMany({
    orderBy: { preachedAt: 'desc' },
    include: {
      translations: { where: { locale: 'en' }, select: { title: true } },
    },
  });
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-red-100 text-red-600',
};

export default async function AdminSermonsPage() {
  const sermons = await getSermons();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          Sermons
        </h1>
        <Link
          href="/admin/sermons/new"
          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#437086' }}
        >
          + New Sermon
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Title (EN)</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Speaker</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sermons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  No sermons yet.
                </td>
              </tr>
            )}
            {sermons.map((sermon) => {
              const title = sermon.translations[0]?.title ?? '(Untitled)';
              return (
                <tr key={sermon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{title}</td>
                  <td className="px-6 py-4 text-gray-500">{sermon.speakerName || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {sermon.preachedAt ? format(sermon.preachedAt, 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[sermon.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sermon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/sermons/${sermon.id}/edit`}
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#437086' }}
                    >
                      Edit
                    </Link>
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
