'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/assets/church/hero.jpg', alt: 'Phuket International Church congregation' },
  { src: '/assets/church/worship2.jpg', alt: 'Worship at PIC' },
  { src: '/assets/church/congregation.jpg', alt: 'Sunday service congregation' },
  { src: '/assets/church/crowd.jpg', alt: 'Church community gathering' },
  { src: '/assets/church/fellowship.jpg', alt: 'Fellowship at PIC' },
  { src: '/assets/church/instruments.jpg', alt: 'Worship band' },
];

interface HeroSlideshowProps {
  children: React.ReactNode;
}

export default function HeroSlideshow({ children }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[42vh] flex items-center overflow-hidden">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-20 w-full">{children}</div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
