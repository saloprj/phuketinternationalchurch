import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminPagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const pages = await prisma.page.findMany({
    include: { translations: { where: { locale: 'en' } } },
    orderBy: [{ showInNav: 'desc' }, { navOrder: 'asc' }, { slug: 'asc' }],
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <Link href="/admin/pages/new" className="bg-[#437086] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#355a6d] transition-colors">
          + New Page
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Title (EN)</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">In Nav</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">/{page.slug}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{page.translations[0]?.title || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{page.showInNav ? '✓' : '—'}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pages/${page.id}/edit`} className="text-[#437086] hover:underline font-medium mr-3">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
