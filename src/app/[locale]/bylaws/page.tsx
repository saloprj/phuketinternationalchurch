{/* Content is English-only. To translate, extract text to messages/{locale}.json and use generateMetadata */}
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Church Bylaws — Phuket International Church',
  description:
    'Constitution and bylaws of Phuket International Church, adopted November 16, 2025. Recommended by the Assembly of God Fellowship Thailand.',
};

export default async function BylawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const articles = [
    { number: 'I', title: 'Name', summary: 'The official name of this assembly: Phuket International Church.' },
    { number: 'II', title: 'Prerogatives and Purposes', summary: 'The right to govern, acquire property, worship, fellowship, propagate the gospel, and cooperate with the Assembly of God Fellowship Thailand.' },
    { number: 'III', title: 'Affiliation', summary: 'Voluntary cooperative fellowship with the General Council of the Assembly of God Fellowship Thailand, with headquarters in Bangkok.' },
    { number: 'IV', title: 'Tenets of Faith', summary: '16 fundamental truths including the Scriptures, the Trinity, salvation, baptism, the Holy Spirit, divine healing, and the second coming of Christ.' },
    { number: 'V', title: 'Ordinances', summary: 'Baptism in water by immersion and Holy Communion.' },
    { number: 'VI', title: 'Membership', summary: 'Eligibility requirements, membership procedures, junior/associate/honorary members, and discipline.' },
    { number: 'VII', title: 'Government', summary: 'Leadership board structure: Chairman, Lead Pastor, Secretary, Treasurer, and up to six deacons.' },
    { number: 'VIII', title: 'Elections, Vacancies, and Removals', summary: 'How officers are elected, terms of service, vacancy procedures, and removal process.' },
    { number: 'IX', title: 'Meetings', summary: 'Worship services, annual and special business meetings, quorum, parliamentary order, and voting.' },
    { number: 'X', title: 'Departments', summary: 'Christian education, youth ministries, and other departments under board supervision.' },
    { number: 'XI', title: 'Finance', summary: 'Handling of offerings, pastoral remuneration, reimbursement, and severance.' },
    { number: 'XII', title: 'Property', summary: 'Title, purchases, sales, discontinuation of services, disaffiliation, and dissolution.' },
    { number: 'XIII', title: 'Arbitration of Disputes', summary: 'Binding arbitration process for disputes between members or between members and the church.' },
    { number: 'XIV', title: 'Amendments', summary: 'How the bylaws may be amended by majority vote at business meetings.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-main mb-4">Church Bylaws</h1>
      <p className="text-gray-500 mb-2">
        International Churches Constitution and Bylaws
      </p>
      <p className="text-gray-500 mb-8">
        Adopted November 16, 2025 — Recommended by the Assembly of God Fellowship Thailand
      </p>

      {/* Download button */}
      <a
        href="/documents/bylaws.pdf"
        download
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Full Bylaws (PDF)
      </a>

      <div className="prose prose-lg max-w-none">
        <h2>Table of Contents</h2>
        <p>
          The bylaws cover 14 articles governing the life and order of Phuket International
          Church. Our{' '}
          <Link href={`/${locale}/about/what-we-believe`} className="text-primary hover:underline">
            Statement of Faith
          </Link>{' '}
          (Article IV) is also available as a dedicated page.
        </p>

        <div className="not-prose">
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.number}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded shrink-0">
                    {article.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-main">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr />

        <p className="text-sm text-gray-500">
          These bylaws were signed by William Yacko, Armando Cruz Bendy, and Daniel Skitch on
          November 16, 2025. For questions about the bylaws, please{' '}
          <Link href={`/${locale}/contact`} className="text-primary hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>

      <div className="mt-8">
        <Link href={`/${locale}`} className="text-primary hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
