'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Locale = 'en' | 'th' | 'ru' | 'zh';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

type LocaleData = { title: string; description: string; isAutoTranslated: boolean };
type TranslationsState = Record<Locale, LocaleData>;

const LOCALES: { key: Locale; label: string; name: string }[] = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'th', label: 'TH', name: 'Thai' },
  { key: 'ru', label: 'RU', name: 'Russian' },
  { key: 'zh', label: 'ZH', name: 'Chinese' },
];

const defaultTranslations: TranslationsState = {
  en: { title: '', description: '', isAutoTranslated: false },
  th: { title: '', description: '', isAutoTranslated: false },
  ru: { title: '', description: '', isAutoTranslated: false },
  zh: { title: '', description: '', isAutoTranslated: false },
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type Props = {
  eventId?: number;
  initialSlug?: string;
  initialStatus?: ContentStatus;
  initialStartAt?: string;
  initialEndAt?: string;
  initialLocation?: string;
  initialFeaturedImage?: string;
  initialIsRecurring?: boolean;
  initialRsvpEnabled?: boolean;
  initialTranslations?: TranslationsState;
};

export default function EventEditor({
  eventId,
  initialSlug = '',
  initialStatus = 'DRAFT',
  initialStartAt = '',
  initialEndAt = '',
  initialLocation = '',
  initialFeaturedImage = '',
  initialIsRecurring = false,
  initialRsvpEnabled = false,
  initialTranslations = defaultTranslations,
}: Props) {
  const router = useRouter();
  const isEdit = !!eventId;

  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [status, setStatus] = useState<ContentStatus>(initialStatus);
  const [startAt, setStartAt] = useState(initialStartAt);
  const [endAt, setEndAt] = useState(initialEndAt);
  const [location, setLocation] = useState(initialLocation);
  const [featuredImage, setFeaturedImage] = useState(initialFeaturedImage);
  const [isRecurring, setIsRecurring] = useState(initialIsRecurring);
  const [rsvpEnabled, setRsvpEnabled] = useState(initialRsvpEnabled);
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [translating, setTranslating] = useState<Locale | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = translations[activeLocale];

  const updateLocale = (locale: Locale, patch: Partial<LocaleData>) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], ...patch },
    }));
  };

  const retranslate = async (targetLocale: Locale) => {
    if (targetLocale === 'en') return;
    const enData = translations.en;
    if (!enData.title && !enData.description) return;
    setTranslating(targetLocale);
    try {
      const [titleRes, descRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.title, targetLocales: [targetLocale] }),
        }),
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.description, targetLocales: [targetLocale] }),
        }),
      ]);
      const titleData = await titleRes.json() as Record<string, string>;
      const descData = await descRes.json() as Record<string, string>;
      setTranslations((prev) => ({
        ...prev,
        [targetLocale]: {
          title: titleData[targetLocale] ?? prev[targetLocale].title,
          description: descData[targetLocale] ?? prev[targetLocale].description,
          isAutoTranslated: true,
        },
      }));
    } catch {
      alert('Translation failed.');
    } finally {
      setTranslating(null);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        slug, status, startAt, endAt: endAt || null, location,
        featuredImage: featuredImage || null, isRecurring, rsvpEnabled,
        translations: Object.entries(translations).map(([locale, data]) => ({ locale, ...data })),
      };
      const res = await fetch(isEdit ? `/api/events/${eventId}` : '/api/events', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? 'Save failed');
      }
      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#303232' }}>
          {isEdit ? 'Edit Event' : 'New Event'}
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-60" style={{ backgroundColor: '#437086' }}>
            {saving ? 'Saving…' : 'Save Event'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Meta fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]" placeholder="event-url-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date &amp; Time</label>
            <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date &amp; Time (optional)</label>
            <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            placeholder="Land & Houses Chalong Clubhouse" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
          <input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            placeholder="https://…" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-[#437086]" style={{ accentColor: '#437086' }} />
            <span className="text-sm text-gray-700">Recurring event</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={rsvpEnabled} onChange={(e) => setRsvpEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-[#437086]" style={{ accentColor: '#437086' }} />
            <span className="text-sm text-gray-700">Enable RSVP</span>
          </label>
        </div>

        <hr className="border-gray-100" />

        {/* Translation tabs */}
        <div>
          <div className="flex border-b border-gray-200 mb-4">
            {LOCALES.map((loc) => (
              <button key={loc.key} type="button" onClick={() => setActiveLocale(loc.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${activeLocale === loc.key ? 'border-[#437086] text-[#437086]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {loc.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${activeLocale === 'en' ? 'bg-blue-100 text-blue-700' : current.isAutoTranslated ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {activeLocale === 'en' ? 'Source language' : current.isAutoTranslated ? 'Auto-translated' : 'Manually edited'}
              </span>
              {activeLocale !== 'en' && (
                <button type="button" onClick={() => retranslate(activeLocale)} disabled={translating === activeLocale}
                  className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  {translating === activeLocale ? 'Translating…' : 'Re-translate from EN'}
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title ({LOCALES.find((l) => l.key === activeLocale)?.name})
              </label>
              <input type="text" value={current.title}
                onChange={(e) => {
                  updateLocale(activeLocale, { title: e.target.value, isAutoTranslated: false });
                  if (!slugTouched && activeLocale === 'en') setSlug(slugify(e.target.value));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
                placeholder="Enter event title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={5} value={current.description}
                onChange={(e) => updateLocale(activeLocale, { description: e.target.value, isAutoTranslated: false })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086] resize-none"
                placeholder="Event description…" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
