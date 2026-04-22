'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const th = useTranslations('header');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/groups`, label: t('groups') },
    { href: `/${locale}/serving`, label: t('serving') },
    { href: `/${locale}/sermons`, label: t('sermons') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/give`, label: t('give') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Phuket International Church"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-2 text-sm font-medium text-text-main hover:text-primary transition-colors rounded-md hover:bg-gray-50 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Service time chip */}
            <span className="hidden xl:inline-flex text-xs text-gray-500 font-medium border border-gray-200 rounded-full px-3 py-1 whitespace-nowrap">
              ☀️ {th('serviceTime')}
            </span>

            <LocaleSwitcher currentLocale={locale} />

            <Link
              href={`/${locale}/visit`}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              {th('planVisit')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-text-main hover:text-primary hover:bg-gray-50 rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-gray-100 flex items-center gap-3">
              <LocaleSwitcher currentLocale={locale} />
              <Link
                href={`/${locale}/visit`}
                className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {th('planVisit')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
