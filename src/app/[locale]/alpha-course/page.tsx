import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: 'Alpha Course — Phuket International Church',
    description:
      'Alpha is a 6-session course exploring the big questions of life and the Christian faith. Join us at Phuket International Church.',
  };
}

const sessions = [
  {
    num: 1,
    title: 'Is there more to life than this?',
    desc: 'An introduction to the big questions of life and what Christianity is really about.',
  },
  {
    num: 2,
    title: 'Who is Jesus?',
    desc: 'Exploring the historical evidence for Jesus and what he claimed about himself.',
  },
  {
    num: 3,
    title: 'Why did Jesus die?',
    desc: 'Looking at the meaning of the cross and why Christians believe it is central.',
  },
  {
    num: 4,
    title: 'How can I have faith?',
    desc: 'Examining what faith is, and how it relates to reason and evidence.',
  },
  {
    num: 5,
    title: 'Why and how do I pray?',
    desc: 'A practical introduction to prayer — what it is and how to do it.',
  },
  {
    num: 6,
    title: 'How does God guide us?',
    desc: 'Discovering how God speaks through the Bible, other people, and circumstances.',
  },
];

export default async function AlphaCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero section */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center bg-accent/20 text-text-main text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          6-Session Course
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-text-main mb-5">
          Alpha Course
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A space to explore life, faith, and meaning — with no pressure, no
          commitment, and no silly questions.
        </p>
      </div>

      {/* What is Alpha */}
      <section className="grid md:grid-cols-2 gap-10 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-main mb-4">
            What is Alpha?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Alpha is a{' '}
              <strong>6-session course designed for anyone curious about
              the Christian faith</strong>{' '}
              — whether you are new to Christianity, exploring it for the first
              time, or simply want to revisit the basics.
            </p>
            <p>
              Each session starts with a meal and time to connect, followed by a
              short video and an open conversation where every question is
              welcome. There is no pressure, no commitment required, and no
              judging anyone&apos;s starting point.
            </p>
            <p>
              Alpha has been run in 169 countries and by over 40 million people.
              It is hosted locally by Phuket International Church in an
              international, multilingual setting.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: '🍽️', title: 'Meal Together', text: 'Each session starts with food and casual conversation.' },
            { icon: '🎬', title: 'Short Video', text: 'A short, engaging film explores the session topic.' },
            { icon: '💬', title: 'Open Discussion', text: 'Small group conversation — ask anything, share anything.' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-text-main">{item.title}</p>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sessions */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text-main mb-6">
          The 6 Sessions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.num}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {session.num}
              </div>
              <div>
                <p className="font-semibold text-text-main text-sm mb-1">
                  {session.title}
                </p>
                <p className="text-xs text-gray-500">{session.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who is Alpha for */}
      <section className="bg-gray-50 rounded-2xl p-8 mb-14">
        <h2 className="text-2xl font-bold text-text-main mb-4">
          Who is Alpha For?
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
          {[
            'People with no church background who are curious about Christianity',
            'Those who grew up in faith but have questions or doubts',
            'People going through a hard season looking for meaning',
            'Anyone exploring spirituality for the first time',
            'Christians who want to revisit and deepen the foundations of their faith',
            'Those who were invited by a friend and are just checking it out',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary rounded-2xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Ready to Join?</h2>
        <p className="text-gray-200 mb-8 max-w-xl mx-auto">
          Our next Alpha Course starts soon. Sign up via the contact form and
          let us know you&apos;re interested — we&apos;ll send you all the
          details.
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block bg-accent text-text-main px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors text-lg"
        >
          Sign Up for Alpha →
        </Link>
        <p className="text-gray-300 text-sm mt-4">
          Free of charge. No commitment required.
        </p>
      </section>
    </div>
  );
}
