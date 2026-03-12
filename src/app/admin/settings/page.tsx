'use client';

import { useEffect, useState } from 'react';

type Settings = Record<string, string>;

const SETTING_FIELDS: { key: string; label: string; type?: string; note?: string }[] = [
  { key: 'serviceSunday', label: 'Sunday Service Times' },
  { key: 'serviceRussian', label: 'Russian Service Times' },
  { key: 'serviceTeamNight', label: 'Team Night Times' },
  { key: 'serviceYouth', label: 'Youth Service Times' },
  { key: 'address', label: 'Church Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'mapsUrl', label: 'Google Maps URL', type: 'url' },
  { key: 'liveStreamUrl', label: 'Live Stream URL', type: 'url' },
  {
    key: 'announcementBanner',
    label: 'Announcement Banner',
    note: 'Leave empty to hide the banner',
  },
  { key: 'facebookUrl', label: 'Facebook URL', type: 'url' },
  { key: 'youtubeUrl', label: 'YouTube URL', type: 'url' },
  { key: 'instagramUrl', label: 'Instagram URL', type: 'url' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Settings) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json() as { error?: string };
      setError(json.error ?? 'Save failed');
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) return <p className="text-gray-400">Loading settings…</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-60"
          style={{ backgroundColor: '#437086' }}
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          Settings saved successfully.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {SETTING_FIELDS.map(({ key, label, type, note }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type ?? 'text'}
              value={settings[key] ?? ''}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            />
            {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
