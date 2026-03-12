export function churchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: 'Phuket International Church',
    url: 'https://phuketinternationalchurch.com',
    telephone: '+66634546790',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Land & Houses Park, Chalong 80/19',
      addressLocality: 'Chalong',
      addressRegion: 'Phuket',
      postalCode: '83130',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 7.8467,
      longitude: 98.3566,
    },
    openingHours: ['Su 10:30-11:30', 'Th 18:30-20:00'],
    sameAs: [
      'https://www.facebook.com/phuketinternationalchurch',
    ],
  };
}

export function eventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Land & Houses Park, Chalong 80/19',
        addressLocality: 'Chalong',
        addressRegion: 'Phuket',
        addressCountry: 'TH',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Phuket International Church',
      url: 'https://phuketinternationalchurch.com',
    },
    url: event.url,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
