'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Subscriber = {
  id: number;
  email: string;
  locale: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((r) => r.json())
      .then((data: Subscriber[]) => {
        setSubscribers(data);
        setLoading(false);
      });
  }, []);

  const activeCount = subscribers.filter((s) => s.isActive).length;

  const handleBroadcast = async () => {
    if (!subject || !body) return;
    setSending(true);
    setSendResult(null);
    const res = await fetch('/api/newsletter/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });
    setSending(false);
    if (res.ok) {
      const data = await res.json() as { sent: number };
      setSendResult(`Broadcast sent to ${data.sent} subscribers.`);
      setSubject('');
      setBody('');
    } else {
      setSendResult('Broadcast failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>Newsletter</h1>
          <p className="text-gray-500 mt-1">{activeCount} active subscriber(s)</p>
        </div>
        <button
          onClick={() => setShowBroadcast(true)}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#f8b841', color: '#303232' }}
        >
          Broadcast
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locale</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No subscribers yet.</td>
                </tr>
              )}
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-500 uppercase">{sub.locale}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        sub.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sub.isActive ? 'Active' : 'Unconfirmed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {format(new Date(sub.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: '#303232' }}>
                Send Broadcast ({activeCount} recipients)
              </h2>
              <button onClick={() => setShowBroadcast(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {sendResult && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                  {sendResult}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body (HTML or plain text)</label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086] resize-none font-mono"
                  placeholder="<p>Hello subscribers…</p>"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowBroadcast(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                disabled={sending || !subject || !body}
                className="px-4 py-2 text-sm rounded-lg disabled:opacity-60 font-medium"
                style={{ backgroundColor: '#f8b841', color: '#303232' }}
              >
                {sending ? 'Sending…' : 'Send Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
