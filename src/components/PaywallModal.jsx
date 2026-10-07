import { useEffect, useRef, useState } from 'react';

export default function PaywallModal({ open, onClose, onPay }) {
  const [plan, setPlan] = useState('single');
  const firstRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    setPlan('single');
    const t = setTimeout(() => firstRef.current && firstRef.current.focus(), 0);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const optionClass = (active) =>
    'w-full rounded-xl border-2 px-4 py-4 text-left transition ' +
    (active ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-white hover:border-slate-400');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/70 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="paywall-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="paywall-title" className="text-xl font-extrabold">Unlock the full report</h2>
            <p className="mt-1 text-sm text-slate-700">
              Your free scan is used. See the plain-English explanations and ready-to-send rewrites for every issue.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close payment window" className="rounded-md p-2 text-slate-700 hover:bg-slate-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-3" role="radiogroup" aria-label="Choose a plan">
          <button
            ref={firstRef}
            type="button"
            role="radio"
            aria-checked={plan === 'single'}
            onClick={() => setPlan('single')}
            className={optionClass(plan === 'single')}
          >
            <span className="block text-base font-bold text-navy-900">Unlock this report &mdash; $10</span>
            <span className="block text-sm text-slate-700">One-time payment for this scan only.</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={plan === 'unlimited'}
            onClick={() => setPlan('unlimited')}
            className={optionClass(plan === 'unlimited')}
          >
            <span className="block text-base font-bold text-navy-900">Go Unlimited &mdash; $29/month</span>
            <span className="block text-sm text-slate-700">Unlimited scans and full reports. Cancel anytime.</span>
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-dashed border-slate-400 bg-slate-50 p-4">
          <p className="text-sm text-slate-800">
            Test mode: no real payment is taken. Use this button to try the unlocked experience.
          </p>
          <button type="button" className="btn-primary mt-3 w-full" onClick={() => onPay(plan)}>
            Simulate successful payment
          </button>
        </div>
      </div>
    </div>
  );
}