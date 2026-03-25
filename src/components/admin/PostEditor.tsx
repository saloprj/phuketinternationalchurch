'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TranslationTabs, { TranslationsState } from './TranslationTabs';

const defaultTranslations: TranslationsState = {
  en: { title: '', excerpt: '', content: '', isAutoTranslated: false },
  th: { title: '', excerpt: '', content: '', isAutoTranslated: false },
  ru: { title: '', excerpt: '', content: '', isAutoTranslated: false },
  zh: { title: '', excerpt: '', content: '', isAutoTranslated: false },
};

type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

type PostEditorProps = {
  postId?: number;
  initialSlug?: string;
  initialStatus?: ContentStatus;
  initialFeaturedImage?: string;
  initialScheduledAt?: string;
  initialTranslations?: TranslationsState;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PostEditor({
  postId,
  initialSlug = '',
  initialStatus = 'DRAFT',
  initialFeaturedImage = '',
  initialScheduledAt = '',
  initialTranslations = defaultTranslations,
}: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!postId;

  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [status, setStatus] = useState<ContentStatus>(initialStatus);
  const [featuredImage, setFeaturedImage] = useState(initialFeaturedImage);
  const [scheduledAt, setScheduledAt] = useState(initialScheduledAt);
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnTitleChange = (title: string) => {
    setTranslations((prev) => ({
      ...prev,
      en: { ...prev.en, title },
    }));
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    const payload = {
      slug,
      status,
      featuredImage: featuredImage || null,
      scheduledAt: status === 'SCHEDULED' ? scheduledAt : null,
      translations: Object.entries(translations).map(([locale, data]) => ({
        locale,
        ...data,
      })),
    };

    try {
      const res = await fetch(isEdit ? `/api/posts/${postId}` : '/api/posts', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? 'Save failed');
      }

      router.push('/admin/posts');
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
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
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
            {saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Meta fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
              placeholder="post-url-slug"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
          <input
            type="url"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            placeholder="https://…"
          />
        </div>

        {status === 'SCHEDULED' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date &amp; Time</label>
            <input
              type="datetime-local"
              value={scheduledAt ? scheduledAt.slice(0, 16) : ''}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            />
          </div>
        )}

        <hr className="border-gray-100" />

        {/* Translations */}
        <TranslationTabs
          value={translations}
          onChange={(next) => {
            // Auto-generate slug from EN title if not touched
            if (!slugTouched && next.en.title !== translations.en.title) {
              setSlug(slugify(next.en.title));
            }
            setTranslations(next);
          }}
        />
      </div>
    </div>
  );
}
