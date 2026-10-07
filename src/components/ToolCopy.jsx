import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, RELATED } from '../data/pageCopy.js';

export async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy method */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Renders: What this tool does / How to use it / Why freelancers need this */
export function ToolCopy({ copy }) {
  return (
    <article className="mx-auto max-w-3xl space-y-12">
      <section aria-labelledby="what-heading">
        <h2 id="what-heading" className="text-2xl font-extrabold">What this tool does</h2>
        {copy.whatItDoes.map((p, i) => (
          <p key={i} className="mt-3 leading-7 text-slate-800">{p}</p>
        ))}
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-2xl font-extrabold">How to use it</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-slate-800 marker:font-bold marker:text-emerald-700">
          {copy.howToUse.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-2xl font-extrabold">Why freelancers need this</h2>
        {copy.whyFreelancers.map((b, i) =>
          b.type === 'ul' ? (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-800 marker:text-emerald-700">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          ) : (
            <p key={i} className="mt-3 leading-7 text-slate-800">{b.text}</p>
          )
        )}
      </section>
    </article>
  );
}

/** "Related Tools" section with three real internal links. */
export function RelatedTools({ current }) {
  const keys = RELATED[current] || [];
  return (
    <section aria-labelledby="related-heading" className="mx-auto mt-14 max-w-3xl">
      <h2 id="related-heading" className="text-2xl font-extrabold">Related Tools</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {keys.map((k) => (
          <li key={k}>
            <Link
              to={TOOLS[k].path}
              className="block h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-600 hover:shadow"
            >
              <span className="block font-bold text-navy-900">{TOOLS[k].name}</span>
              <span className="mt-1 block text-sm text-slate-700">{TOOLS[k].blurb}</span>
              <span className="mt-2 block text-sm font-semibold text-emerald-700">Open tool &rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Text preview with Copy / Download / Print buttons (used by NDA and Proposal pages). */
export function OutputPanel({ text, filename }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <div>
      <div className="no-print flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={onCopy} aria-label="Copy document text">
          {copied ? 'Copied!' : 'Copy text'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => downloadText(filename, text)} aria-label="Download as text file">
          Download .txt
        </button>
        <button type="button" className="btn-secondary" onClick={() => window.print()} aria-label="Print or save as PDF">
          Print / PDF
        </button>
      </div>
      <pre className="print-area mt-4 max-h-[640px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-300 bg-white p-4 font-sans text-sm leading-6 text-slate-900">
        {text}
      </pre>
      <span className="sr-only" role="status" aria-live="polite">{copied ? 'Copied to clipboard' : ''}</span>
    </div>
  );
}