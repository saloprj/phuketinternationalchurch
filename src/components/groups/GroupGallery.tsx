'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  photos: string[];
  name: string;
};

function Lightbox({
  photos,
  name,
  index,
  onClose,
  onIndexChange,
}: {
  photos: string[];
  name: string;
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const next = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange],
  );
  const prev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, next, prev]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        ×
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-2xl"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-2xl"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[index]}
          alt={`${name} ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}

export function GroupHero({ photos, name }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="relative h-48 w-full bg-gray-100 block group"
        aria-label={`Open ${name} photo`}
      >
        <Image
          src={photos[0]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </button>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          name={name}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

export function GroupThumbs({ photos, name }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbs = photos.slice(1, 4);
  if (thumbs.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {thumbs.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setOpenIndex(i + 1)}
            className="relative aspect-square rounded-lg overflow-hidden block group"
            aria-label={`Open ${name} photo ${i + 2}`}
          >
            <Image
              src={src}
              alt={`${name} ${i + 2}`}
              fill
              sizes="15vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          name={name}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}
