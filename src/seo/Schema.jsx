import { SITE_NAME, SITE_URL, OG_IMAGE } from './seoConfig.js';

// JSON-LD builders. useSEO() injects the result into <head>.
export function softwareApplicationSchema({ name, url, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (web browser)',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'First contract scan free' },
      { '@type': 'Offer', price: '10', priceCurrency: 'USD', description: 'Unlock one full report' },
      { '@type': 'Offer', price: '29', priceCurrency: 'USD', description: 'Unlimited scans, per month' },
    ],
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema({ headline, description, url, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: OG_IMAGE,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

// Optional: render JSON-LD directly in the page body instead of via useSEO.
export default function Schema({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}