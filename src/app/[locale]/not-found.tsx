import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-8xl font-bold text-primary/20 mb-4">404</p>
      <h1 className="text-3xl font-bold text-text-main mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you were looking for. It may have
        been moved or no longer exists.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/en/contact"
          className="border border-gray-200 text-text-main px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
