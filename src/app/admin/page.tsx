import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getDashboardStats() {
  const [
    publishedPosts,
    upcomingEvents,
    publishedSermons,
    unreadContacts,
    unansweredPrayers,
    activeSubscribers,
  ] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.event.count({
      where: {
        status: 'PUBLISHED',
        startAt: { gte: new Date() },
      },
    }),
    prisma.sermon.count({ where: { status: 'PUBLISHED' } }),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.prayerRequest.count({ where: { isAnswered: false } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  return {
    publishedPosts,
    upcomingEvents,
    publishedSermons,
    unreadContacts,
    unansweredPrayers,
    activeSubscribers,
  };
}

type StatCardProps = {
  title: string;
  value: number;
  href: string;
  description?: string;
  color?: string;
};

function StatCard({ title, value, href, description, color = '#437086' }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition hover:shadow-md hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color }}>
            {value}
          </p>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <span
          aria-hidden="true"
          className="text-xl text-gray-300 transition group-hover:text-primary group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Welcome to the Phuket International Church admin panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Published Posts"
          href="/admin/posts"
          value={stats.publishedPosts}
          description="Live blog posts"
        />
        <StatCard
          title="Upcoming Events"
          href="/admin/events"
          value={stats.upcomingEvents}
          description="Scheduled from today"
        />
        <StatCard
          title="Published Sermons"
          href="/admin/sermons"
          value={stats.publishedSermons}
          description="Available sermons"
        />
        <StatCard
          title="Unread Messages"
          href="/admin/contact"
          value={stats.unreadContacts}
          description="Contact inbox"
          color={stats.unreadContacts > 0 ? '#d97706' : '#437086'}
        />
        <StatCard
          title="Unanswered Prayers"
          href="/admin/prayer"
          value={stats.unansweredPrayers}
          description="Prayer requests"
          color={stats.unansweredPrayers > 0 ? '#d97706' : '#437086'}
        />
        <StatCard
          title="Newsletter Subscribers"
          href="/admin/newsletter"
          value={stats.activeSubscribers}
          description="Active subscribers"
          color="#f8b841"
        />
      </div>
    </div>
  );
}
