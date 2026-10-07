// Central SEO configuration. Replace SITE_URL with your real domain before launch.
export const SITE_URL = 'https://contractguard-1.netlify.app';
export const SITE_NAME = 'ContractGuard';
export const OG_IMAGE = SITE_URL + '/og-image.png'; // add a 1200x630 image at public/og-image.png

// Replace with your real AdSense publisher ID and ad unit slot numbers.
export const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';
export const AD_SLOTS = { home: '1111111111', analyzer: '2222222222', footer: '3333333333' };

export const PAGES = {
  home: {
    path: '/',
    title: 'ContractGuard \u2014 Free Freelance Contract Review & Risk Checker',
    description:
      'Paste your freelance contract and ContractGuard highlights risky clauses, explains them in plain English and suggests fairer wording. Free first scan.',
  },
  analyzer: {
    path: '/ai-contract-reader',
    title: 'Free AI Contract Reader \u2014 Analyze Freelance Contracts & Highlight Risky Clauses',
    description:
      'Paste a client contract and get a 0-100 risk score, the risky clauses highlighted, plain-English explanations and suggested rewrites. Runs privately in your browser.',
  },
  nda: {
    path: '/nda-generator',
    title: 'Free NDA Generator \u2014 Create a Non-Disclosure Agreement Online',
    description:
      'Create a clear one-way or mutual non-disclosure agreement in minutes. Fill in the details, preview the wording, then copy, download or print it.',
  },
  invoice: {
    path: '/invoice-generator',
    title: 'Free Invoice Generator \u2014 Create a Professional Freelance Invoice Online',
    description:
      'Build a clean freelance invoice with automatic totals, tax, due date and late-fee wording. Print it or save it as a PDF in seconds.',
  },
  proposal: {
    path: '/proposal-writer',
    title: 'Free Proposal Writer \u2014 Draft a Winning Freelance Project Proposal',
    description:
      'Turn your project details into a polished freelance proposal with scope, timeline, pricing and protective terms. Copy or download it instantly.',
  },
  pricing: {
    path: '/pricing',
    title: 'ContractGuard Pricing \u2014 Pay Per Scan or Go Unlimited',
    description:
      'Your first contract scan is free. Unlock a full report for $10 or scan unlimited contracts for $29 per month.',
  },
  blog: {
    path: '/blog',
    title: 'Freelance Contract Red Flags \u2014 The ContractGuard Blog',
    description:
      'Seven contract clauses that quietly cost freelancers money, explained in plain English with fairer wording to ask for.',
  },
};

export function canonicalFor(path) {
  return SITE_URL + path;
}