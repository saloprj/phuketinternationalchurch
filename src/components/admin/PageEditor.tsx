'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';

type Locale = 'en' | 'th' | 'ru' | 'zh';
type ContentStatus = 'DRAFT' | 'PUBLISHED';

type LocaleData = { title: string; content: string; metaDescription: string; isAutoTranslated: boolean };
type TranslationsState = Record<Locale, LocaleData>;

const LOCALES: { key: Locale; label: string; name: string }[] = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'th', label: 'TH', name: 'Thai' },
  { key: 'ru', label: 'RU', name: 'Russian' },
  { key: 'zh', label: 'ZH', name: 'Chinese' },
];

const defaultTranslations: TranslationsState = {
  en: { title: '', content: '', metaDescription: '', isAutoTranslated: false },
  th: { title: '', content: '', metaDescription: '', isAutoTranslated: false },
  ru: { title: '', content: '', metaDescription: '', isAutoTranslated: false },
  zh: { title: '', content: '', metaDescription: '', isAutoTranslated: false },
};

type Props = {
  pageId?: number;
  initialSlug?: string;
  initialStatus?: ContentStatus;
  initialShowInNav?: boolean;
  initialNavOrder?: number;
  initialTranslations?: TranslationsState;
};

export default function PageEditor({
  pageId,
  initialSlug = '',
  initialStatus = 'DRAFT',
  initialShowInNav = false,
  initialNavOrder = 0,
  initialTranslations = defaultTranslations,
}: Props) {
  const router = useRouter();
  const isEdit = !!pageId;

  const [slug, setSlug] = useState(initialSlug);
  const [status, setStatus] = useState<ContentStatus>(initialStatus);
  const [showInNav, setShowInNav] = useState(initialShowInNav);
  const [navOrder, setNavOrder] = useState(initialNavOrder);
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [translating, setTranslating] = useState<Locale | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = translations[activeLocale];

  const updateLocale = (locale: Locale, patch: Partial<LocaleData>) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));
  };

  const retranslate = async (targetLocale: Locale) => {
    if (targetLocale === 'en') return;
    const enData = translations.en;
    if (!enData.title && !enData.content) return;
    setTranslating(targetLocale);
    try {
      const [titleRes, contentRes, metaRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.title, targetLocales: [targetLocale] }),
        }),
        fetch('/api/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.content, targetLocales: [targetLocale] }),
        }),
        fetch('/api/translate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.metaDescription, targetLocales: [targetLocale] }),
        }),
      ]);
      const titleData = await titleRes.json() as Record<string, string>;
      const contentData = await contentRes.json() as Record<string, string>;
      const metaData = await metaRes.json() as Record<string, string>;
      setTranslations((prev) => ({
        ...prev,
        [targetLocale]: {
          title: titleData[targetLocale] ?? prev[targetLocale].title,
          content: contentData[targetLocale] ?? prev[targetLocale].content,
          metaDescription: metaData[targetLocale] ?? prev[targetLocale].metaDescription,
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
        slug, status, showInNav, navOrder,
        translations: Object.entries(translations).map(([locale, data]) => ({ locale, ...data })),
      };
      const res = await fetch(isEdit ? `/api/pages/${pageId}` : '/api/pages', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? 'Save failed');
      }
      router.push('/admin/pages');
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
          {isEdit ? 'Edit Page' : 'New Page'}
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-60" style={{ backgroundColor: '#437086' }}>
            {saving ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
              placeholder="page-url-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nav Order</label>
            <input type="number" value={navOrder} onChange={(e) => setNavOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showInNav} onChange={(e) => setShowInNav(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300" style={{ accentColor: '#437086' }} />
              <span className="text-sm text-gray-700">Show in navigation</span>
            </label>
          </div>
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
                onChange={(e) => updateLocale(activeLocale, { title: e.target.value, isAutoTranslated: false })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
                placeholder="Enter page title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
              <input type="text" value={current.metaDescription}
                onChange={(e) => updateLocale(activeLocale, { metaDescription: e.target.value, isAutoTranslated: false })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
                placeholder="Short description for search engines…" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <RichTextEditor
                value={current.content}
                onChange={(html) => updateLocale(activeLocale, { content: html, isAutoTranslated: false })}
                placeholder="Write page content here…"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
