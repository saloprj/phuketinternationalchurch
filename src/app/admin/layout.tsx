import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin — Phuket International Church',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Login page renders without sidebar
  if (!session) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  const userRole = (session.user as { role?: string })?.role ?? '';

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar userRole={userRole} />
          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
