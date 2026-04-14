{/* Content is English-only. To translate, extract text to messages/{locale}.json and use generateMetadata */}
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What We Believe — Phuket International Church',
  description:
    'Our Statement of Faith — the 16 fundamental truths of Phuket International Church, affiliated with the Assembly of God Fellowship Thailand.',
};

export default async function WhatWeBelievePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href={`/${locale}/about`} className="hover:text-primary transition-colors">
          About
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-text-main font-medium">What We Believe</span>
      </nav>

      <h1 className="text-4xl font-bold text-text-main mb-4">What We Believe</h1>
      <p className="text-gray-500 mb-8">
        Statement of Fundamental Truths — Phuket International Church, affiliated with the
        Assembly of God Fellowship Thailand.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2>1. The Scriptures Inspired</h2>
        <p>
          The Scriptures, both the Old and New Testaments, are verbally inspired of God and are
          the revelation of God to man, the infallible, authoritative rule of faith and conduct
          (2 Timothy 3:15-17; 1 Thessalonians 2:13; 2 Peter 1:21).
        </p>

        <h2>2. The One True God</h2>
        <p>
          The one true God has revealed himself as the eternally self-existent &ldquo;I AM,&rdquo;
          the Creator of heaven and earth and the Redeemer of mankind. He has further revealed
          himself as embodying the principles of relationship and association as Father, Son, and
          Holy Spirit (Deuteronomy 6:4; Isaiah 43:10, 11; Matthew 28:19; Luke 3:22).
        </p>

        <h2>3. The Deity of the Lord Jesus Christ</h2>
        <p>The Lord Jesus Christ is the eternal Son of God. The Scriptures declare:</p>
        <ul>
          <li>His virgin birth (Matthew 1:23; Luke 1:31, 35)</li>
          <li>His sinless life (Hebrews 7:26; 1 Peter 2:22)</li>
          <li>His miracles (Acts 2:22; 10:38)</li>
          <li>
            His substitutionary work on the cross (1 Corinthians 15:3; 2 Corinthians 5:21)
          </li>
          <li>
            His bodily resurrection from the dead (Matthew 28:6; Luke 24:39; 1 Corinthians 15:4)
          </li>
          <li>
            His exaltation to the right hand of God (Acts 1:9, 11; 2:33; Philippians 2:9-11;
            Hebrews 1:3)
          </li>
        </ul>

        <h2>4. The Fall of Man</h2>
        <p>
          Man was created good and upright; for God said, &ldquo;Let us make man in our image,
          after our likeness.&rdquo; However, man by voluntary transgression fell and thereby
          incurred not only physical death but also spiritual death, which is separation from God
          (Genesis 1:26, 27; 2:17; 3:6; Romans 5:12-19).
        </p>

        <h2>5. The Salvation of Man</h2>
        <p>
          Man&apos;s only hope of redemption is through the shed blood of Jesus Christ the Son of
          God. Salvation is received through repentance toward God and faith toward the Lord Jesus
          Christ. By the washing of regeneration and renewing of the Holy Spirit, being justified
          by grace through faith, man becomes an heir of God according to the hope of eternal life
          (Luke 24:47; John 3:3; Romans 10:13-15; Ephesians 2:8; Titus 2:11; 3:5-7).
        </p>

        <h2>6. The Ordinances of the Church</h2>
        <h3>Baptism in Water</h3>
        <p>
          The ordinance of baptism by immersion is commanded in the Scriptures. All who repent and
          believe on Christ as Savior and Lord are to be baptized. Thus they declare to the world
          that they have died with Christ and that they also have been raised with Him to walk in
          newness of life (Matthew 28:19; Mark 16:16; Acts 10:47, 48; Romans 6:4).
        </p>
        <h3>Holy Communion</h3>
        <p>
          The Lord&apos;s Supper, consisting of the elements — bread and the fruit of the vine —
          is the symbol expressing our sharing the divine nature of our Lord Jesus Christ
          (2 Peter 1:4); a memorial of His suffering and death (1 Corinthians 11:26); and a
          prophecy of His second coming (1 Corinthians 11:26); and is enjoined on all believers
          &ldquo;till He come!&rdquo;
        </p>

        <h2>7. The Baptism in the Holy Spirit</h2>
        <p>
          All believers are entitled to and should ardently expect and earnestly seek the promise
          of the Father, the baptism in the Holy Spirit and fire, according to the command of our
          Lord Jesus Christ. This was the normal experience of all in the early Christian church.
          With it comes the enduement of power for life and service, the bestowment of the gifts
          and their uses in the work of the ministry (Luke 24:49; Acts 1:4, 8; 1 Corinthians
          12:1-31). This experience is distinct from and subsequent to the experience of the new
          birth (Acts 8:12-17; 10:44-46; 11:14-16; 15:7-9).
        </p>

        <h2>8. The Initial Physical Evidence of the Baptism in the Holy Spirit</h2>
        <p>
          The baptism of believers in the Holy Spirit is witnessed by the initial physical sign of
          speaking with other tongues as the Spirit of God gives them utterance (Acts 2:4). The
          speaking in tongues in this instance is the same in essence as the gift of tongues
          (1 Corinthians 12:4-10, 28), but different in purpose and use.
        </p>

        <h2>9. Sanctification</h2>
        <p>
          Sanctification is an act of separation from that which is evil, and of dedication unto
          God (Romans 12:1, 2; 1 Thessalonians 5:23; Hebrews 13:12). Scriptures teach a life of
          &ldquo;holiness without which no man shall see the Lord&rdquo; (Hebrews 12:14). By the
          power of the Holy Spirit we are able to obey the command: &ldquo;Be ye holy, for I am
          holy&rdquo; (1 Peter 1:15, 16).
        </p>

        <h2>10. The Church and Its Mission</h2>
        <p>
          The Church is the body of Christ, the habitation of God through the Spirit, with divine
          appointments for the fulfillment of her Great Commission. Each believer, born of the
          Spirit, is an integral part of the general assembly and church of the firstborn, which
          are written in heaven (Ephesians 1:22, 23; 2:22; Hebrews 12:23).
        </p>

        <h2>11. The Ministry</h2>
        <p>
          A divinely called and scripturally ordained ministry has been provided by our Lord for
          the fourfold purpose of leading the Church in: (1) evangelization of the world
          (Mark 16:15-20), (2) worship of God (John 4:23, 24), (3) building a Body of saints
          being perfected in the image of His Son (Ephesians 4:11, 16), and (4) meeting human
          need with ministries of love and compassion (Psalm 112:9; Galatians 2:10; 6:10;
          James 1:27).
        </p>

        <h2>12. Divine Healing</h2>
        <p>
          Divine healing is an integral part of the gospel. Deliverance from sickness is provided
          for in the Atonement, and is the privilege of all believers (Isaiah 53:4, 5;
          Matthew 8:16, 17; James 5:14-16).
        </p>

        <h2>13. The Blessed Hope</h2>
        <p>
          The resurrection of those who have fallen asleep in Christ and their translation
          together with those who are alive and remain unto the coming of the Lord is the imminent
          and blessed hope of the Church (1 Thessalonians 4:16, 17; Romans 8:23; Titus 2:13;
          1 Corinthians 15:51, 52).
        </p>

        <h2>14. The Millennial Reign of Christ</h2>
        <p>
          The second coming of Christ includes the rapture of the saints, which is our blessed
          hope, followed by the visible return of Christ with His saints to reign on the earth for
          one thousand years (Zechariah 14:5; Matthew 24:27, 30; Revelation 1:7; 19:11-14;
          20:1-6). This millennial reign will bring the salvation of national Israel (Ezekiel
          37:21, 22; Zephaniah 3:19, 20; Romans 11:26, 27) and the establishment of universal
          peace (Isaiah 11:6-9; Psalm 72:3-8; Micah 4:3, 4).
        </p>

        <h2>15. The Final Judgment</h2>
        <p>
          There will be a final judgment in which the wicked dead will be raised and judged
          according to their works. Whosoever is not found written in the Book of Life, together
          with the devil and his angels, the beast and the false prophet, will be consigned to
          everlasting punishment in the lake which burneth with fire and brimstone, which is the
          second death (Matthew 25:46; Mark 9:43-48; Revelation 19:20; 20:11-15; 21:8).
        </p>

        <h2>16. The New Heavens and the New Earth</h2>
        <p>
          &ldquo;We, according to His promise, look for new heavens and a new earth, wherein
          dwelleth righteousness&rdquo; (2 Peter 3:13; Revelation 21 and 22).
        </p>

        <hr />

        <p className="text-sm text-gray-500">
          These tenets of faith are drawn from Article IV of the{' '}
          <Link href={`/${locale}/bylaws`} className="text-primary hover:underline">
            Church Bylaws
          </Link>
          , adopted November 16, 2025. You can also{' '}
          <a
            href="/documents/bylaws.pdf"
            target="_blank"
            rel="noopener"
            className="text-primary hover:underline"
          >
            view the full bylaws document (PDF)
          </a>
          .
        </p>
      </div>

      <div className="mt-8">
        <Link href={`/${locale}/about`} className="text-primary hover:underline">
          &larr; Back to About
        </Link>
      </div>
    </div>
  );
}
