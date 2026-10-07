import { useMemo, useState } from 'react';
import { ToolCopy, RelatedTools, copyText } from '../components/ToolCopy.jsx';
import { useSEO } from '../seo/useSEO.js';
import { PAGES, canonicalFor } from '../seo/seoConfig.js';
import { pageCopy } from '../data/pageCopy.js';

const copy = pageCopy.invoice;
const today = () => new Date().toISOString().slice(0, 10);
const money = (n, c) => c + (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => (isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));

export default function InvoiceGenerator() {
  const p = PAGES.invoice;
  useSEO({ title: p.title, description: p.description, canonical: canonicalFor(p.path) });

  const [f, setF] = useState({
    fromName: '', fromEmail: '', fromAddress: '',
    toName: '', toEmail: '', toAddress: '',
    number: 'INV-001', date: today(), dueDays: 14, currency: '$', tax: 0,
    lateFee: '1.5% per month on overdue balances', payment: '', notes: '',
  });
  const [items, setItems] = useState([{ desc: '', qty: 1, rate: 0 }]);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setItem = (i, k) => (e) => setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: e.target.value } : it)));

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0);
    const tax = subtotal * ((parseFloat(f.tax) || 0) / 100);
    return { subtotal, tax, total: subtotal + tax };
  }, [items, f.tax]);

  const issued = new Date(f.date + 'T00:00:00');
  const due = new Date(issued);
  due.setDate(due.getDate() + (parseInt(f.dueDays, 10) || 0));

  function plainText() {
    const rows = items.map((it) => '- ' + (it.desc || 'Item') + ': ' + (it.qty || 0) + ' x ' + money(parseFloat(it.rate) || 0, f.currency) + ' = ' + money((parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), f.currency));
    return [
      'INVOICE ' + f.number,
      'Date: ' + fmtDate(issued) + '   Due: ' + fmtDate(due),
      '',
      'From: ' + f.fromName + ' ' + f.fromEmail + ' ' + f.fromAddress,
      'Bill to: ' + f.toName + ' ' + f.toEmail + ' ' + f.toAddress,
      '',
      ...rows,
      '',
      'Subtotal: ' + money(totals.subtotal, f.currency),
      'Tax: ' + money(totals.tax, f.currency),
      'TOTAL DUE: ' + money(totals.total, f.currency),
      '',
      f.lateFee ? 'Late payment: ' + f.lateFee : '',
      f.payment ? 'Payment details: ' + f.payment : '',
      f.notes ? 'Notes: ' + f.notes : '',
    ].join('\n');
  }

  async function onCopy() {
    if (await copyText(plainText())) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Free Invoice Generator</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{copy.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[400px,1fr]">
        <form className="card no-print space-y-4" onSubmit={(e) => e.preventDefault()} aria-label="Invoice details">
          <h2 className="text-lg font-bold">From (you)</h2>
          <div><label className="label" htmlFor="i-fn">Name or business</label><input id="i-fn" className="input" value={f.fromName} onChange={set('fromName')} /></div>
          <div><label className="label" htmlFor="i-fe">Email</label><input id="i-fe" type="email" className="input" value={f.fromEmail} onChange={set('fromEmail')} /></div>
          <div><label className="label" htmlFor="i-fa">Address</label><textarea id="i-fa" rows={2} className="input" value={f.fromAddress} onChange={set('fromAddress')} /></div>

          <h2 className="pt-2 text-lg font-bold">Bill to (client)</h2>
          <div><label className="label" htmlFor="i-tn">Client name</label><input id="i-tn" className="input" value={f.toName} onChange={set('toName')} /></div>
          <div><label className="label" htmlFor="i-te">Client email</label><input id="i-te" type="email" className="input" value={f.toEmail} onChange={set('toEmail')} /></div>
          <div><label className="label" htmlFor="i-ta">Client address</label><textarea id="i-ta" rows={2} className="input" value={f.toAddress} onChange={set('toAddress')} /></div>

          <h2 className="pt-2 text-lg font-bold">Invoice details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label" htmlFor="i-no">Invoice number</label><input id="i-no" className="input" value={f.number} onChange={set('number')} /></div>
            <div><label className="label" htmlFor="i-dt">Issue date</label><input id="i-dt" type="date" className="input" value={f.date} onChange={set('date')} /></div>
            <div><label className="label" htmlFor="i-dd">Days to pay</label><input id="i-dd" type="number" min="0" className="input" value={f.dueDays} onChange={set('dueDays')} /></div>
            <div><label className="label" htmlFor="i-cu">Currency symbol</label><input id="i-cu" className="input" value={f.currency} onChange={set('currency')} maxLength={4} /></div>
            <div><label className="label" htmlFor="i-tx">Tax %</label><input id="i-tx" type="number" min="0" step="0.1" className="input" value={f.tax} onChange={set('tax')} /></div>
          </div>

          <h2 className="pt-2 text-lg font-bold">Line items</h2>
          {items.map((it, i) => (
            <fieldset key={i} className="space-y-2 rounded-lg border border-slate-300 p-3">
              <legend className="px-1 text-sm font-semibold">Item {i + 1}</legend>
              <input aria-label={'Description for item ' + (i + 1)} className="input" placeholder="Description" value={it.desc} onChange={setItem(i, 'desc')} />
              <div className="grid grid-cols-2 gap-2">
                <input aria-label={'Quantity for item ' + (i + 1)} type="number" min="0" step="any" className="input" placeholder="Qty" value={it.qty} onChange={setItem(i, 'qty')} />
                <input aria-label={'Rate for item ' + (i + 1)} type="number" min="0" step="any" className="input" placeholder="Rate" value={it.rate} onChange={setItem(i, 'rate')} />
              </div>
              {items.length > 1 && (
                <button type="button" className="text-sm font-semibold text-red-800 underline" onClick={() => setItems(items.filter((_, idx) => idx !== i))} aria-label={'Remove item ' + (i + 1)}>
                  Remove item
                </button>
              )}
            </fieldset>
          ))}
          <button type="button" className="btn-secondary w-full" onClick={() => setItems(items.concat({ desc: '', qty: 1, rate: 0 }))}>
            + Add line item
          </button>

          <div><label className="label" htmlFor="i-lf">Late payment wording</label><input id="i-lf" className="input" value={f.lateFee} onChange={set('lateFee')} /></div>
          <div><label className="label" htmlFor="i-pm">Payment details</label><textarea id="i-pm" rows={2} className="input" value={f.payment} onChange={set('payment')} placeholder="Bank name, account number, PayPal email..." /></div>
          <div><label className="label" htmlFor="i-nt">Notes</label><textarea id="i-nt" rows={2} className="input" value={f.notes} onChange={set('notes')} /></div>
        </form>

        <div>
          <div className="no-print mb-3 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => window.print()} aria-label="Print or save invoice as PDF">Print / Save as PDF</button>
            <button type="button" className="btn-secondary" onClick={onCopy} aria-label="Copy invoice as text">{copied ? 'Copied!' : 'Copy as text'}</button>
          </div>
          <div id="invoice-preview" className="print-area rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-navy-900">INVOICE</h2>
                <p className="mt-1 text-sm">No. {f.number}</p>
              </div>
              <div className="text-sm sm:text-right">
                <p>Issued: <strong>{fmtDate(issued)}</strong></p>
                <p>Due: <strong>{fmtDate(due)}</strong></p>
              </div>
            </div>
            <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="font-bold uppercase tracking-wide text-slate-700">From</p>
                <p className="mt-1 whitespace-pre-line">{f.fromName || 'Your name'}{'\n'}{f.fromEmail}{'\n'}{f.fromAddress}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide text-slate-700">Bill to</p>
                <p className="mt-1 whitespace-pre-line">{f.toName || 'Client name'}{'\n'}{f.toEmail}{'\n'}{f.toAddress}</p>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-navy-900 text-left">
                    <th className="py-2 pr-2">Description</th>
                    <th className="py-2 pr-2 text-right">Qty</th>
                    <th className="py-2 pr-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-2 pr-2">{it.desc || 'Item'}</td>
                      <td className="py-2 pr-2 text-right">{it.qty}</td>
                      <td className="py-2 pr-2 text-right">{money(parseFloat(it.rate) || 0, f.currency)}</td>
                      <td className="py-2 text-right">{money((parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), f.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(totals.subtotal, f.currency)}</dd></div>
              <div className="flex justify-between"><dt>Tax ({parseFloat(f.tax) || 0}%)</dt><dd>{money(totals.tax, f.currency)}</dd></div>
              <div className="flex justify-between border-t-2 border-navy-900 pt-2 text-lg font-extrabold"><dt>Total due</dt><dd>{money(totals.total, f.currency)}</dd></div>
            </dl>
            <div className="mt-6 space-y-2 text-sm">
              {f.payment && <p><strong>Payment details:</strong> {f.payment}</p>}
              {f.lateFee && <p><strong>Late payment:</strong> {f.lateFee}</p>}
              {f.notes && <p><strong>Notes:</strong> {f.notes}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 pt-4">
        <ToolCopy copy={copy} />
        <RelatedTools current="invoice" />
      </div>
    </>
  );
}