import Link from 'next/link';

export default async function NewsletterConfirmedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[#303232] mb-4">You're subscribed!</h1>
        <p className="text-gray-600 text-lg mb-8">
          You'll now receive weekly updates, sermon notes, and event reminders from Phuket International Church. Welcome to the community!
        </p>
        <Link href={`/${locale}`} className="bg-[#437086] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#355a6d] transition-colors inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
