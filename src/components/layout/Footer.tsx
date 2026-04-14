import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`}>
              <Image
                src="/assets/logo-white.png"
                alt="Phuket International Church"
                width={160}
                height={40}
                className="h-10 w-auto mb-4 brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Make disciples who love God and love their neighbors.
            </p>
            <p className="text-xs text-gray-500 mt-2">{t('affiliation')}</p>

            {/* Social links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/phuketinternationalchurch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: `/${locale}/about`, label: tn('about') },
                { href: `/${locale}/visit`, label: tn('visit') },
                { href: `/${locale}/sermons`, label: tn('sermons') },
                { href: `/${locale}/events`, label: tn('events') },
                { href: `/${locale}/give`, label: tn('give') },
                { href: `/${locale}/prayer`, label: tn('prayer') },
                { href: `/${locale}/about/what-we-believe`, label: t('whatWeBelieve') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm text-gray-400 space-y-2">
              <p>Land & Houses Park, Chalong 80/19</p>
              <p>Chalong, Phuket, Thailand</p>
              <p>
                <a href="tel:+66634546790" className="hover:text-white transition-colors">
                  063-454-6790
                </a>
              </p>
              <p>
                <a
                  href={`/${locale}/contact`}
                  className="hover:text-white transition-colors"
                >
                  Send us a message →
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {year} Phuket International Church. {t('rights')}.
          </p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy-policy`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/cookie-policy`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {t('cookies')}
            </Link>
            <Link href={`/${locale}/bylaws`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {t('bylaws')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
