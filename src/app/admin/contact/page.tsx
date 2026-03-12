'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  locale: string;
  createdAt: string;
};

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    const res = await fetch('/api/admin/contact');
    const data = await res.json() as ContactSubmission[];
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const markRead = async (id: number) => {
    await fetch(`/api/admin/contact/${id}/read`, { method: 'POST' });
    fetchSubmissions();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>Contact Inbox</h1>
        <p className="text-gray-500 mt-1">
          {submissions.filter((s) => !s.isRead).length} unread message(s)
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Subject</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">No messages yet.</td>
                </tr>
              )}
              {submissions.map((sub) => (
                <>
                  <tr
                    key={sub.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      !sub.isRead ? 'font-semibold' : ''
                    }`}
                    onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                  >
                    <td className="px-6 py-4 text-gray-800">{sub.name}</td>
                    <td className="px-6 py-4 text-gray-500">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-600">{sub.subject}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {format(new Date(sub.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          sub.isRead
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {sub.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {!sub.isRead && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(sub.id); }}
                          className="text-sm font-medium hover:underline"
                          style={{ color: '#437086' }}
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                  {expanded === sub.id && (
                    <tr key={`${sub.id}-expand`}>
                      <td colSpan={6} className="px-6 pb-4 bg-gray-50">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                          {sub.message}
                        </div>
                        <a
                          href={`mailto:${sub.email}?subject=Re: ${sub.subject}`}
                          className="inline-block mt-3 text-sm font-medium hover:underline"
                          style={{ color: '#437086' }}
                        >
                          Reply via email
                        </a>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
