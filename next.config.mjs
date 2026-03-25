import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // 301 redirects for old WordPress URLs indexed by Google
  async redirects() {
    return [
      { source: '/home', destination: '/en', permanent: true },
      { source: '/home/', destination: '/en', permanent: true },
      { source: '/about', destination: '/en/about', permanent: true },
      { source: '/about/', destination: '/en/about', permanent: true },
      { source: '/contact', destination: '/en/contact', permanent: true },
      { source: '/contact/', destination: '/en/contact', permanent: true },
      { source: '/pray', destination: '/en/prayer', permanent: true },
      { source: '/pray/', destination: '/en/prayer', permanent: true },
      { source: '/baptism', destination: '/en/visit', permanent: true },
      { source: '/baptism/', destination: '/en/visit', permanent: true },
      { source: '/mission', destination: '/en/about', permanent: true },
      { source: '/mission/', destination: '/en/about', permanent: true },
      { source: '/next-steps', destination: '/en/visit', permanent: true },
      { source: '/next-steps/', destination: '/en/visit', permanent: true },
      { source: '/english-church-phuket-all-nations', destination: '/en', permanent: true },
      { source: '/english-church-phuket-all-nations/', destination: '/en', permanent: true },
      // Old blog post URLs → blog listing (posts not yet in new DB)
      { source: '/2023/:slug', destination: '/en/blog', permanent: true },
      { source: '/2023/:slug/', destination: '/en/blog', permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phuketinternationalchurch.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default withNextIntl(nextConfig);
