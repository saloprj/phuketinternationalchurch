'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const locales = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'th', label: 'TH', flag: '🇹🇭' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'zh', label: 'ZH', flag: '🇨🇳' },
];

interface LocaleSwitcherProps {
  currentLocale: string;
}

export default function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: string) {
    // Replace current locale prefix in path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => handleLocaleChange(loc.code)}
          disabled={isPending}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentLocale === loc.code
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100'
          }`}
          aria-label={`Switch to ${loc.label}`}
          aria-current={currentLocale === loc.code ? 'true' : undefined}
        >
          {loc.flag} {loc.label}
        </button>
      ))}
    </div>
  );
}
