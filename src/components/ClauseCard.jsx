import { useState } from 'react';
import RiskBadge from './RiskBadge.jsx';
import { copyText } from './ToolCopy.jsx';

const BORDER = { high: 'border-l-red-600', medium: 'border-l-amber-500', low: 'border-l-emerald-600' };

const FILLER_EXPLAIN =
  'Unlock this report to read a plain-English explanation of why this clause matters and what it could mean for you as a freelancer.';
const FILLER_REDLINE =
  'Unlock this report to copy a fairer, ready-to-send replacement clause that you can paste into your reply to the client.';

export default function ClauseCard({ issue, locked, onUnlock }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(issue.redline);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <article className={'card border-l-8 ' + BORDER[issue.severity]} aria-label={issue.label + ' (' + issue.severity + ' risk)'}>
      <div className="flex flex-wrap items-center gap-3">
        <RiskBadge severity={issue.severity} />
        <h3 className="text-lg font-bold">{issue.label}</h3>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
        {issue.missing ? 'Related sentence (the protective clause is missing)' : 'Found in your contract'}
      </p>
      <blockquote className="mt-1 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-slate-900">
        <mark className="bg-transparent text-slate-900">{issue.sentence}</mark>
      </blockquote>

      <div className="relative mt-4">
        <div className={locked ? 'select-none blur-sm' : ''} aria-hidden={locked ? 'true' : undefined}>
          <h4 className="text-sm font-bold text-navy-900">What this means</h4>
          <p className="mt-1 text-sm leading-6 text-slate-800">{locked ? FILLER_EXPLAIN : issue.explanation}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-navy-900">Suggested rewrite</h4>
            {!locked && (
              <button type="button" onClick={handleCopy} aria-label={'Copy suggested rewrite for ' + issue.label} className="btn-secondary !min-h-[36px] !px-3 !py-1.5 !text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-slate-900">
            {locked ? FILLER_REDLINE : issue.redline}
          </p>
        </div>

        {locked && (
          <button
            type="button"
            onClick={onUnlock}
            aria-label={'Unlock explanation and rewrite for ' + issue.label}
            className="absolute inset-0 flex items-center justify-center rounded-md"
          >
            <span className="btn-accent shadow-lg">Unlock explanation &amp; rewrite</span>
          </button>
        )}
      </div>
      <span className="sr-only" role="status" aria-live="polite">{copied ? 'Rewrite copied to clipboard' : ''}</span>
    </article>
  );
}