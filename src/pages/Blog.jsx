import { RelatedTools } from '../components/ToolCopy.jsx';
import { Link } from 'react-router-dom';
import { useSEO } from '../seo/useSEO.js';
import { articleSchema } from '../seo/Schema.jsx';
import { PAGES, SITE_URL, canonicalFor } from '../seo/seoConfig.js';
import { pageCopy } from '../data/pageCopy.js';

export default function Blog() {
  const p = PAGES.blog;
  const a = pageCopy.blog;
  useSEO({
    title: p.title,
    description: p.description,
    canonical: canonicalFor(p.path),
    schema: articleSchema({
      headline: a.headline,
      description: a.description,
      url: SITE_URL + p.path,
      datePublished: a.datePublished,
    }),
  });

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <p className="text-sm font-semibold text-emerald-300">ContractGuard Blog</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{a.headline}</h1>
          <p className="mt-3 text-sm text-slate-300">
            Published <time dateTime={a.datePublished}>7 October 2026</time>
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-lg leading-8 text-slate-800">{a.intro}</p>
        {a.sections.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-2xl font-extrabold">{s.h}</h2>
            <p className="mt-2 leading-7 text-slate-800">{s.p}</p>
          </section>
        ))}
        <p className="mt-10 rounded-xl border border-emerald-300 bg-emerald-50 p-5 leading-7 text-slate-900">
          {a.outro}{' '}
          <Link to="/ai-contract-reader" className="font-bold text-emerald-800 underline">Scan a contract now</Link>.
        </p>
        <RelatedTools current="blog" />
      </article>
    </>
  );
}