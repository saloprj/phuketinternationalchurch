import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const user = session.user as { role: string; email?: string };
  if (user.role !== 'SUPER_ADMIN') {
    return <div className="p-6 text-red-600">Access denied. Super Admin only.</div>;
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <UsersClient
      users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))}
      currentEmail={user.email || ''}
    />
  );
}
