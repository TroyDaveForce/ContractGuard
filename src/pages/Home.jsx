import { Link } from 'react-router-dom';
import AdSlot from '../components/AdSlot.jsx';
import { useSEO } from '../seo/useSEO.js';
import { PAGES, canonicalFor, ADSENSE_CLIENT, AD_SLOTS } from '../seo/seoConfig.js';
import { pageCopy, TOOLS } from '../data/pageCopy.js';

export default function Home() {
  const p = PAGES.home;
  const c = pageCopy.home;
  useSEO({ title: p.title, description: p.description, canonical: canonicalFor(p.path) });

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <p className="inline-block rounded-full bg-navy-700 px-3 py-1 text-sm font-semibold text-emerald-300">
            Built for freelancers &middot; First scan free
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">{c.headline}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">{c.sub}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/ai-contract-reader" className="btn-accent w-full sm:w-auto">Scan my contract</Link>
            <Link to="/pricing" className="btn-secondary w-full sm:w-auto">See pricing</Link>
          </div>
        </div>
      </section>

      {/* Ad slot 1 of 3: below the hero */}
      <AdSlot data-ad-client={ADSENSE_CLIENT} data-ad-slot={AD_SLOTS.home} />

      <section className="mx-auto max-w-5xl px-4 py-8" aria-labelledby="features-h">
        <h2 id="features-h" className="text-center text-2xl font-extrabold sm:text-3xl">Stop signing things you do not understand</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {c.features.map((f) => (
            <li key={f.title} className="card">
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-slate-700">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="steps-h">
        <h2 id="steps-h" className="text-center text-2xl font-extrabold sm:text-3xl">How it works</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {c.steps.map((s, i) => (
            <li key={s.title} className="card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-bold text-white" aria-hidden="true">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-slate-700">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12" aria-labelledby="tools-h">
        <h2 id="tools-h" className="text-center text-2xl font-extrabold sm:text-3xl">Free tools for your freelance business</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {Object.values(TOOLS).map((t) => (
            <li key={t.path}>
              <Link to={t.path} className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-600">
                <span className="block text-lg font-bold text-navy-900">{t.name}</span>
                <span className="mt-1 block text-slate-700">{t.blurb}</span>
                <span className="mt-2 block font-semibold text-emerald-700">Open tool &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}