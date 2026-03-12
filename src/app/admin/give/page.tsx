'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Donation = {
  id: number;
  donorName: string | null;
  donorEmail: string | null;
  amount: number;
  currency: string;
  method: string;
  status: string;
  isRecurring: boolean;
  createdAt: string;
};

const methodColors: Record<string, string> = {
  STRIPE_CARD: 'bg-purple-100 text-purple-700',
  PROMPTPAY_QR: 'bg-blue-100 text-blue-700',
};

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

export default function AdminGivePage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (methodFilter) params.set('method', methodFilter);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/donations?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Donation[]) => {
        setDonations(data);
        setLoading(false);
      });
  }, [methodFilter, statusFilter]);

  const formatAmount = (amount: number) => {
    const thb = amount / 100;
    return `THB ${thb.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>Donations</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
        >
          <option value="">All Methods</option>
          <option value="STRIPE_CARD">Stripe Card</option>
          <option value="PROMPTPAY_QR">PromptPay QR</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Donor</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Method</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No donations found.</td>
                </tr>
              )}
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{d.donorName ?? 'Anonymous'}</div>
                    {d.donorEmail && (
                      <div className="text-xs text-gray-400">{d.donorEmail}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatAmount(d.amount)}
                    {d.isRecurring && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                        Recurring
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${methodColors[d.method] ?? 'bg-gray-100 text-gray-600'}`}>
                      {d.method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {format(new Date(d.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
