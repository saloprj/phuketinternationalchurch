import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: 'About Us — Phuket International Church',
    description:
      'Learn about Phuket International Church — our mission, our team, and who we are.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let staff: {
    id: number;
    name: string;
    role: string;
    bio: string;
    photoUrl: string | null;
    email: string | null;
    phone: string | null;
    order: number;
  }[] = [];
  try {
    staff = await prisma.staffMember.findMany({ orderBy: { order: 'asc' } });
  } catch {
    // DB not available
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-main mb-8">
        About Phuket International Church
      </h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="prose prose-lg max-w-none">
          <h2>Who We Are</h2>
          <p>
            Phuket International Church is an international, multicultural
            church located in the heart of Phuket, Thailand. We are affiliated
            with the Assemblies of God and are committed to the mission of
            making disciples who love God and love their neighbors.
          </p>
          <p>
            Our congregation includes people from Thailand, Russia, China, the
            UK, the USA, Australia, and dozens of other nations. We worship
            together in English, with Thai and Russian services also available.
          </p>
          <blockquote>
            &ldquo;Missions is not the ultimate goal of the church. Worship
            is.&rdquo; — John Piper
          </blockquote>
          <h2>Our Mission</h2>
          <p>
            Make disciples who love God and love their neighbors. (Matthew
            22:37-40, 28:19-20)
          </p>
          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Worship</strong> — Encountering God together in spirit and
              truth
            </li>
            <li>
              <strong>Community</strong> — Genuine relationships across cultures
              and nationalities
            </li>
            <li>
              <strong>Discipleship</strong> — Growing in faith, knowledge, and
              character
            </li>
            <li>
              <strong>Mission</strong> — Serving Phuket and the world with the
              love of Christ
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <Image
            src="/assets/church-interior.jpg"
            alt="Church interior"
            width={600}
            height={400}
            className="rounded-2xl object-cover w-full"
          />
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-text-main text-lg mb-3">
              Service Times
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span className="font-medium">Sunday English</span>
                <span className="text-primary font-semibold">10:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Thursday Russian</span>
                <span className="text-primary font-semibold">6:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Wednesday Team Night</span>
                <span className="text-primary font-semibold">8:30 PM</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Land &amp; Houses Park, Chalong Clubhouse, Phuket 83130
            </p>
          </div>
        </div>
      </div>

      {staff.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-text-main mb-8">Our Team</h2>
          <div className="mb-10 rounded-2xl overflow-hidden">
            <Image
              src="/images/church/team-2026.jpg"
              alt="Phuket International Church leadership team"
              width={1600}
              height={1067}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="text-center">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full w-32 h-32 object-cover mx-auto mb-3"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-14 h-14 text-primary/40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}
                <h3 className="font-bold text-text-main">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <p className="text-xs text-gray-500 mt-1">{member.phone}</p>
                )}
                {member.bio && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Affiliation section */}
      <section className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-text-main mb-4">
          Our Affiliation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Phuket International Church is affiliated with the{' '}
          <strong>Assembly of God Fellowship Thailand</strong>, committed to
          planting multiplying churches that love God, love people, and serve
          the world.
        </p>
        <div className="my-8 max-w-lg mx-auto">
          <Image
            src="/assets/registration-certificate.jpg"
            alt="Official registration certificate from the Assembly of God Fellowship Thailand"
            width={1200}
            height={850}
            className="rounded-xl shadow-md border border-gray-200"
          />
          <p className="text-xs text-gray-400 mt-2">
            Official registration certificate — valid March 2026 to December 2027
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`/${locale}/about/what-we-believe`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
          >
            What We Believe
          </a>
          <a
            href={`/${locale}/bylaws`}
            className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition-colors text-sm"
          >
            Church Bylaws
          </a>
        </div>
      </section>
    </div>
  );
}
