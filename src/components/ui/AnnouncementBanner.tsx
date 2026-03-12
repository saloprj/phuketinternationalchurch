'use client';

import { useState } from 'react';

interface AnnouncementBannerProps {
  message: string;
}

export default function AnnouncementBanner({ message }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !message) return null;

  return (
    <div className="bg-accent text-text-main px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex-1 text-center text-sm font-medium" dangerouslySetInnerHTML={{ __html: message }} />
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-text-main hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
