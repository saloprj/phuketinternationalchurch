const TARGET_LOCALES = ['th', 'ru', 'zh'] as const;

export async function translateText(
  text: string,
  targetLocale: (typeof TARGET_LOCALES)[number]
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY not set — skipping translation');
    return text;
  }

  const langMap = { th: 'th', ru: 'ru', zh: 'zh-CN' };
  const target = langMap[targetLocale];

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target,
      format: 'html',
    }),
  });

  if (!res.ok) {
    throw new Error(`Translation failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data.translations[0].translatedText as string;
}

export async function translateToAllLocales(
  text: string
): Promise<Record<(typeof TARGET_LOCALES)[number], string>> {
  const results = await Promise.allSettled(
    TARGET_LOCALES.map((locale) => translateText(text, locale))
  );

  return {
    th: results[0].status === 'fulfilled' ? results[0].value : text,
    ru: results[1].status === 'fulfilled' ? results[1].value : text,
    zh: results[2].status === 'fulfilled' ? results[2].value : text,
  };
}
