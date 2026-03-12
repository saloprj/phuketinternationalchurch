import Link from 'next/link';

export default async function NewsletterPendingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📧</div>
        <h1 className="text-3xl font-bold text-[#303232] mb-4">Please check your email</h1>
        <p className="text-gray-600 text-lg mb-8">
          We've sent a confirmation link to your email address. Please click it to complete your subscription to updates from Phuket International Church.
        </p>
        <Link href={`/${locale}`} className="text-[#437086] hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
