'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

export type LocaleData = {
  title: string;
  excerpt: string;
  content: string;
  isAutoTranslated: boolean;
};

export type TranslationsState = {
  en: LocaleData;
  th: LocaleData;
  ru: LocaleData;
  zh: LocaleData;
};

type Locale = 'en' | 'th' | 'ru' | 'zh';

const LOCALES: { key: Locale; label: string; name: string }[] = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'th', label: 'TH', name: 'Thai' },
  { key: 'ru', label: 'RU', name: 'Russian' },
  { key: 'zh', label: 'ZH', name: 'Chinese' },
];

type TranslationTabsProps = {
  value: TranslationsState;
  onChange: (translations: TranslationsState) => void;
};

export default function TranslationTabs({ value, onChange }: TranslationTabsProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [translating, setTranslating] = useState<Locale | null>(null);

  const updateLocale = (locale: Locale, patch: Partial<LocaleData>) => {
    onChange({
      ...value,
      [locale]: {
        ...value[locale],
        ...patch,
        isAutoTranslated: locale !== 'en' ? value[locale].isAutoTranslated : false,
      },
    });
  };

  const retranslate = async (targetLocale: Locale) => {
    if (targetLocale === 'en') return;
    const enData = value.en;
    if (!enData.content && !enData.title) return;

    setTranslating(targetLocale);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: enData.content,
          targetLocales: [targetLocale],
        }),
      });

      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json() as Record<string, string>;

      // Also translate title and excerpt separately
      const [titleRes, excerptRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.title, targetLocales: [targetLocale] }),
        }),
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: enData.excerpt, targetLocales: [targetLocale] }),
        }),
      ]);

      const titleData = await titleRes.json() as Record<string, string>;
      const excerptData = await excerptRes.json() as Record<string, string>;

      onChange({
        ...value,
        [targetLocale]: {
          title: titleData[targetLocale] ?? value[targetLocale].title,
          excerpt: excerptData[targetLocale] ?? value[targetLocale].excerpt,
          content: data[targetLocale] ?? value[targetLocale].content,
          isAutoTranslated: true,
        },
      });
    } catch {
      alert('Translation failed. Please try again.');
    } finally {
      setTranslating(null);
    }
  };

  const current = value[activeLocale];

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 mb-4">
        {LOCALES.map((loc) => (
          <button
            key={loc.key}
            type="button"
            onClick={() => setActiveLocale(loc.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeLocale === loc.key
                ? 'border-[#437086] text-[#437086]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {/* Status badge + Re-translate */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${
              activeLocale === 'en'
                ? 'bg-blue-100 text-blue-700'
                : current.isAutoTranslated
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {activeLocale === 'en'
              ? 'Source language'
              : current.isAutoTranslated
              ? 'Auto-translated'
              : 'Manually edited'}
          </span>

          {activeLocale !== 'en' && (
            <button
              type="button"
              onClick={() => retranslate(activeLocale)}
              disabled={translating === activeLocale}
              className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {translating === activeLocale ? 'Translating…' : 'Re-translate from EN'}
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title ({LOCALES.find((l) => l.key === activeLocale)?.name})
          </label>
          <input
            type="text"
            value={current.title}
            onChange={(e) =>
              updateLocale(activeLocale, { title: e.target.value, isAutoTranslated: false })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086]"
            placeholder="Enter title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            rows={3}
            value={current.excerpt}
            onChange={(e) =>
              updateLocale(activeLocale, { excerpt: e.target.value, isAutoTranslated: false })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#437086] resize-none"
            placeholder="Short description"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <RichTextEditor
            value={current.content}
            onChange={(html) =>
              updateLocale(activeLocale, { content: html, isAutoTranslated: false })
            }
            placeholder="Write content here…"
          />
        </div>
      </div>
    </div>
  );
}
