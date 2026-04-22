'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type HomeGroup = {
  id: number;
  name: string;
  leaderName: string;
  leaderPhone: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  gpsUrl: string;
  photos: string[];
  description: string;
  order: number;
  isActive: boolean;
};

type FormState = Omit<HomeGroup, 'id'>;

const emptyForm: FormState = {
  name: '',
  leaderName: '',
  leaderPhone: '',
  meetingDay: '',
  meetingTime: '',
  location: '',
  gpsUrl: '',
  photos: [],
  description: '',
  order: 0,
  isActive: true,
};

export default function AdminHomeGroupsPage() {
  const [groups, setGroups] = useState<HomeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    const res = await fetch('/api/homegroups');
    const data = (await res.json()) as HomeGroup[];
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (g: HomeGroup) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      leaderName: g.leaderName,
      leaderPhone: g.leaderPhone,
      meetingDay: g.meetingDay,
      meetingTime: g.meetingTime,
      location: g.location,
      gpsUrl: g.gpsUrl,
      photos: g.photos,
      description: g.description,
      order: g.order,
      isActive: g.isActive,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const url = editingId ? `/api/homegroups/${editingId}` : '/api/homegroups';
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
    fetchGroups();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this home group?')) return;
    await fetch(`/api/homegroups/${id}`, { method: 'DELETE' });
    fetchGroups();
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? 'Upload failed');
      return;
    }
    const { url } = (await res.json()) as { url: string };
    setForm((p) => ({ ...p, photos: [...p.photos, url] }));
  };

  const removePhoto = (idx: number) => {
    setForm((p) => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          Home Groups
        </h1>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#437086' }}
        >
          + New Home Group
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
                <th className="text-left px-6 py-3 font-medium text-gray-500">Leader</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">When</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Where</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {groups.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No home groups.
                  </td>
                </tr>
              )}
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{g.name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div>{g.leaderName}</div>
                    <div className="text-xs text-gray-400">{g.leaderPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {g.meetingDay} {g.meetingTime}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{g.location}</td>
                  <td className="px-6 py-4">
                    {g.isActive ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(g)}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#437086' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: '#303232' }}>
                {editingId ? 'Edit Home Group' : 'New Home Group'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { key: 'name', label: 'Group Name', type: 'text' },
                    { key: 'leaderName', label: 'Leader Name', type: 'text' },
                    { key: 'leaderPhone', label: 'Leader Phone / WhatsApp', type: 'text' },
                    { key: 'meetingDay', label: 'Meeting Day', type: 'text' },
                    { key: 'meetingTime', label: 'Meeting Time', type: 'text' },
                    { key: 'order', label: 'Display Order', type: 'number' },
                    { key: 'location', label: 'Location', type: 'text' },
                    { key: 'gpsUrl', label: 'GPS / Maps URL', type: 'url' },
                  ] as const
                ).map(({ key, label, type }) => (
                  <div key={key} className={key === 'location' || key === 'gpsUrl' ? 'col-span-2' : ''}>
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
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.photos.map((p, i) => (
                    <div key={p} className="relative w-20 h-20">
                      <Image
                        src={p}
                        alt="Home group photo"
                        fill
                        sizes="80px"
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = '';
                  }}
                  className="text-sm"
                />
                {uploading && (
                  <span className="ml-2 text-xs text-gray-500">Uploading…</span>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                Show on public /groups page
              </label>
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
