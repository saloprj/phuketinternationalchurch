'use client';

import { useEffect, useState } from 'react';

type Ministry = {
  id: number;
  name: string;
  description: string;
  icon: string;
  leaderName: string;
  leaderEmail: string;
  order: number;
};

type FormState = Omit<Ministry, 'id'>;

const emptyForm: FormState = {
  name: '',
  description: '',
  icon: '',
  leaderName: '',
  leaderEmail: '',
  order: 0,
};

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMinistries = async () => {
    const res = await fetch('/api/ministries');
    const data = (await res.json()) as Ministry[];
    setMinistries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (m: Ministry) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      description: m.description,
      icon: m.icon,
      leaderName: m.leaderName,
      leaderEmail: m.leaderEmail,
      order: m.order,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const url = editingId ? `/api/ministries/${editingId}` : '/api/ministries';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? 'Save failed');
      return;
    }
    setShowModal(false);
    fetchMinistries();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ministry?')) return;
    await fetch(`/api/ministries/${id}`, { method: 'DELETE' });
    fetchMinistries();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          Ministries
        </h1>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#437086' }}
        >
          + New Ministry
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Icon</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Leader</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ministries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    No ministries.
                  </td>
                </tr>
              )}
              {ministries.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{m.icon}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div>{m.leaderName}</div>
                    <div className="text-xs text-gray-400">{m.leaderEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(m)}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#437086' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: '#303232' }}>
                {editingId ? 'Edit Ministry' : 'New Ministry'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              {(
                [
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'icon', label: 'Icon (lucide name, e.g. Music, Baby)', type: 'text' },
                  { key: 'leaderName', label: 'Leader Name', type: 'text' },
                  { key: 'leaderEmail', label: 'Leader Email', type: 'email' },
                  { key: 'order', label: 'Display Order', type: 'number' },
                ] as const
              ).map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={String(form[key])}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [key]:
                          type === 'number'
                            ? parseInt(e.target.value, 10) || 0
                            : e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086] resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-60"
                style={{ backgroundColor: '#437086' }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
