'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LiteYouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

function extractVideoId(urlOrId: string): string {
  // Handle full YouTube URLs
  const match = urlOrId.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match?.[1] || urlOrId;
}

export default function LiteYouTubeEmbed({ videoId: rawId, title, className = '' }: LiteYouTubeEmbedProps) {
  const [activated, setActivated] = useState(false);
  const videoId = extractVideoId(rawId);
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (activated) {
    return (
      <div className={`relative aspect-video bg-black ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setActivated(true)}
      className={`relative aspect-video w-full group cursor-pointer ${className}`}
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
