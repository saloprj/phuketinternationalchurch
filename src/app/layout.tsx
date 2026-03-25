import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://phuketinternationalchurch.com'),
  title: {
    default: 'Phuket International Church',
    template: '%s | Phuket International Church',
  },
  description:
    'An international, multicultural church in Phuket, Thailand. Welcoming people from every nation.',
  keywords: [
    'church phuket',
    'international church phuket',
    'english church phuket',
    'christian church phuket',
    'phuket international church',
    'expat church phuket',
    'chalong church',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Phuket International Church',
    title: 'Phuket International Church',
    description:
      'An international, multicultural church in Phuket, Thailand. Welcoming people from every nation.',
    images: [
      {
        url: '/assets/church/hero.jpg',
        width: 2048,
        height: 946,
        alt: 'Phuket International Church congregation worshipping together',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phuket International Church',
    description:
      'An international, multicultural church in Phuket, Thailand. Welcoming people from every nation.',
    images: ['/assets/church/hero.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
