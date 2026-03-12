'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type PrayerRequest = {
  id: number;
  name: string;
  email: string | null;
  request: string;
  isAnswered: boolean;
  isPublic: boolean;
  locale: string;
  createdAt: string;
};

export default function AdminPrayerPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/prayer');
    const data = await res.json() as PrayerRequest[];
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const markAnswered = async (id: number) => {
    await fetch(`/api/admin/prayer/${id}/answered`, { method: 'POST' });
    fetchRequests();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>Prayer Requests</h1>
        <p className="text-gray-500 mt-1">{requests.filter((r) => !r.isAnswered).length} unanswered</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-3">
          {requests.length === 0 && (
            <p className="text-center text-gray-400 py-10">No prayer requests yet.</p>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                className="flex items-start justify-between p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === req.id ? null : req.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-800">{req.name}</span>
                    {req.isAnswered ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                        Answered
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">
                        Unanswered
                      </span>
                    )}
                    {req.isPublic && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{req.request}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(req.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
                    expanded === req.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expanded === req.id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">{req.request}</p>
                  {req.email && (
                    <p className="text-xs text-gray-400 mt-2">
                      Email: <a href={`mailto:${req.email}`} className="underline">{req.email}</a>
                    </p>
                  )}
                  {!req.isAnswered && (
                    <button
                      onClick={() => markAnswered(req.id)}
                      className="mt-4 px-4 py-2 text-sm text-white rounded-lg"
                      style={{ backgroundColor: '#437086' }}
                    >
                      Mark as Answered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
