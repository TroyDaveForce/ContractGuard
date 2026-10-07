import { useMemo, useState } from 'react';
import { ToolCopy, RelatedTools, OutputPanel } from '../components/ToolCopy.jsx';
import { useSEO } from '../seo/useSEO.js';
import { PAGES, canonicalFor } from '../seo/seoConfig.js';
import { pageCopy } from '../data/pageCopy.js';

const copy = pageCopy.proposal;

function buildProposal(f) {
  const me = f.me.trim() || '[Your name]';
  const client = f.client.trim() || '[Client name]';
  const title = f.title.trim() || '[Project title]';
  const problem = f.problem.trim() || '[Describe the problem the client wants solved]';
  const items = f.deliverables.split('\n').map((s) => s.trim()).filter(Boolean);
  const deposit = Number(f.deposit) || 50;
  const revisions = Number(f.revisions) || 2;
  const L = [];
  L.push('PROJECT PROPOSAL: ' + title);
  L.push('Prepared for ' + client + ' by ' + me);
  L.push('');
  L.push('1. The Challenge');
  L.push(problem);
  L.push('');
  L.push('2. Deliverables');
  (items.length ? items : ['[List your deliverables, one per line]']).forEach((d, i) => L.push('   ' + (i + 1) + '. ' + d));
  L.push('');
  L.push('3. Timeline');
  L.push(f.timeline.trim() || '[Add your timeline, e.g. 3 weeks from deposit]');
  L.push('');
  L.push('4. Investment');
  L.push('Total project fee: ' + (f.price.trim() || '[amount]') + '. A deposit of ' + deposit + '% is due before work begins; the balance is due within 14 days of delivery.');
  L.push('');
  L.push('5. Terms');
  L.push('- Revisions: ' + revisions + ' round' + (revisions === 1 ? '' : 's') + ' of revisions per deliverable are included. Extra revisions or work outside this scope are billed at my standard rate through a written change order.');
  L.push('- Late payment: invoices unpaid after the due date accrue a late fee of 1.5% per month.');
  L.push('- Cancellation: if the project is cancelled, you pay for all work completed to that date and the deposit is non-refundable.');
  L.push('- Ownership: ownership of the final deliverables transfers to you upon full payment. I keep rights to my pre-existing tools and methods.');
  L.push('- Portfolio: I may show the finished work in my portfolio unless we agree otherwise in writing.');
  L.push('');
  L.push('6. Approval');
  L.push('This proposal is valid for ' + (Number(f.valid) || 14) + ' days. To accept, reply with the words "Approved" or sign below.');
  L.push('');
  L.push('Client: ______________________   Date: __________');
  L.push(me + ': ______________________   Date: __________');
  return L.join('\n');
}

export default function ProposalWriter() {
  const p = PAGES.proposal;
  useSEO({ title: p.title, description: p.description, canonical: canonicalFor(p.path) });
  const [f, setF] = useState({ me: '', client: '', title: '', problem: '', deliverables: '', timeline: '', price: '', deposit: 50, revisions: 2, valid: 14 });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const text = useMemo(() => buildProposal(f), [f]);

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Free Proposal Writer</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{copy.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[360px,1fr]">
        <form className="card no-print space-y-4" onSubmit={(e) => e.preventDefault()} aria-label="Proposal details">
          <div><label className="label" htmlFor="p-me">Your name</label><input id="p-me" className="input" value={f.me} onChange={set('me')} /></div>
          <div><label className="label" htmlFor="p-cl">Client name</label><input id="p-cl" className="input" value={f.client} onChange={set('client')} /></div>
          <div><label className="label" htmlFor="p-ti">Project title</label><input id="p-ti" className="input" value={f.title} onChange={set('title')} /></div>
          <div><label className="label" htmlFor="p-pr">The problem to solve</label><textarea id="p-pr" rows={3} className="input" value={f.problem} onChange={set('problem')} /></div>
          <div><label className="label" htmlFor="p-de">Deliverables (one per line)</label><textarea id="p-de" rows={4} className="input" value={f.deliverables} onChange={set('deliverables')} /></div>
          <div><label className="label" htmlFor="p-tl">Timeline</label><input id="p-tl" className="input" value={f.timeline} onChange={set('timeline')} placeholder="e.g. 3 weeks from deposit" /></div>
          <div><label className="label" htmlFor="p-pc">Total price</label><input id="p-pc" className="input" value={f.price} onChange={set('price')} placeholder="e.g. $1,500" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label" htmlFor="p-dp">Deposit %</label><input id="p-dp" type="number" min="0" max="100" className="input" value={f.deposit} onChange={set('deposit')} /></div>
            <div><label className="label" htmlFor="p-rv">Revisions</label><input id="p-rv" type="number" min="1" max="10" className="input" value={f.revisions} onChange={set('revisions')} /></div>
            <div><label className="label" htmlFor="p-vl">Valid (days)</label><input id="p-vl" type="number" min="1" className="input" value={f.valid} onChange={set('valid')} /></div>
          </div>
        </form>
        <OutputPanel text={text} filename="project-proposal.txt" />
      </div>

      <div className="px-4 pb-10 pt-4">
        <ToolCopy copy={copy} />
        <RelatedTools current="proposal" />
      </div>
    </>
  );
}