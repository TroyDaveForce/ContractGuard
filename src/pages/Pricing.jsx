import { Link } from 'react-router-dom';
import { useSEO } from '../seo/useSEO.js';
import { PAGES, canonicalFor } from '../seo/seoConfig.js';

export default function Pricing() {
  const p = PAGES.pricing;
  useSEO({ title: p.title, description: p.description, canonical: canonicalFor(p.path) });

  const plans = [
    {
      name: 'Free scan',
      price: '$0',
      per: 'your first contract',
      points: ['Risk score from 0 to 100', 'Full explanations and rewrites for your first scan', 'No account needed'],
      cta: 'Try it free',
      style: 'btn-secondary',
    },
    {
      name: 'Single report',
      price: '$10',
      per: 'per report',
      points: ['Unlock one full report', 'Plain-English explanation for every issue', 'Copy-ready suggested rewrites'],
      cta: 'Scan a contract',
      style: 'btn-primary',
    },
    {
      name: 'Unlimited',
      price: '$29',
      per: 'per month',
      points: ['Unlimited contract scans', 'Every report fully unlocked', 'Best for agencies and busy freelancers'],
      cta: 'Go Unlimited',
      style: 'btn-accent',
      featured: true,
    },
  ];

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Simple pricing for freelancers</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-200">
            Scan your first contract free. Pay only when you want to unlock a report, or go unlimited.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-10" aria-label="Plans">
        <ul className="grid gap-6 md:grid-cols-3">
          {plans.map((pl) => (
            <li key={pl.name} className={'card flex flex-col ' + (pl.featured ? 'border-2 border-emerald-600' : '')}>
              {pl.featured && <span className="mb-2 w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase text-emerald-900">Best value</span>}
              <h2 className="text-xl font-extrabold">{pl.name}</h2>
              <p className="mt-2">
                <span className="text-4xl font-extrabold text-navy-900">{pl.price}</span>{' '}
                <span className="text-slate-700">{pl.per}</span>
              </p>
              <ul className="mt-4 flex-1 list-disc space-y-2 pl-5 text-slate-800 marker:text-emerald-700">
                {pl.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <Link to="/ai-contract-reader" className={pl.style + ' mt-6'}>{pl.cta}</Link>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-3xl space-y-3 leading-7 text-slate-800">
          <h2 className="text-2xl font-extrabold">How the plans work</h2>
          <p>Every visitor gets one free scan with the full report. After that, the Risk Score and issue count stay visible, while the detailed explanations and suggested rewrites are locked.</p>
          <p>Pay $10 to unlock the report for one scan, or choose the $29 monthly plan to unlock every scan. You can choose either option from the unlock window on the results page.</p>
          <p>ContractGuard is a reading aid and does not provide legal advice.</p>
        </div>
      </section>
    </>
  );
}