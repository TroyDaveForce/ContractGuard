import { useMemo, useState } from 'react';
import { ToolCopy, RelatedTools, OutputPanel } from '../components/ToolCopy.jsx';
import { useSEO } from '../seo/useSEO.js';
import { PAGES, canonicalFor } from '../seo/seoConfig.js';
import { pageCopy } from '../data/pageCopy.js';

const copy = pageCopy.nda;
const today = () => new Date().toISOString().slice(0, 10);

function buildNda(f) {
  const a = f.disclosing.trim() || '[Disclosing Party]';
  const b = f.receiving.trim() || '[Receiving Party]';
  const purpose = f.purpose.trim() || '[describe the purpose, e.g. discussing a website project]';
  const law = f.law.trim() || '[state or country]';
  const years = Number(f.years) || 2;
  const mutual = f.type === 'mutual';
  const L = [];
  L.push(mutual ? 'MUTUAL NON-DISCLOSURE AGREEMENT' : 'NON-DISCLOSURE AGREEMENT');
  L.push('');
  if (mutual) {
    L.push('This Agreement is made on ' + f.date + ' between ' + a + ' ("Party A") and ' + b + ' ("Party B"). Each party may share confidential information with the other, and each is both a discloser and a recipient under this Agreement.');
  } else {
    L.push('This Agreement is made on ' + f.date + ' between ' + a + ' ("Discloser") and ' + b + ' ("Recipient").');
  }
  L.push('');
  L.push('1. Purpose');
  L.push('The parties wish to share information for the following purpose: ' + purpose + ' (the "Purpose").');
  L.push('');
  L.push('2. Confidential Information');
  L.push('Confidential Information means non-public information that is shared for the Purpose and is marked confidential or would reasonably be understood to be confidential, including business plans, designs, code, files, prices and customer details.');
  L.push('');
  L.push('3. Obligations');
  L.push((mutual ? 'Each party' : 'The Recipient') + ' will (a) keep the other side\'s Confidential Information private, (b) use it only for the Purpose, (c) share it only with people who need it for the Purpose and who are bound to keep it confidential, and (d) protect it with at least reasonable care.');
  L.push('');
  L.push('4. Exclusions');
  L.push('These duties do not apply to information that is or becomes public through no fault of the recipient, was already known to the recipient, was independently developed, or was received lawfully from a third party. A recipient may disclose information when required by law, after giving prompt notice where permitted.');
  L.push('');
  L.push('5. Term');
  L.push('The duty of confidentiality lasts for ' + years + ' year' + (years === 1 ? '' : 's') + ' from the date of this Agreement. After that period the obligations end.');
  L.push('');
  L.push('6. Return of Materials');
  L.push('On written request, the recipient will return or delete the other side\'s Confidential Information.');
  L.push('');
  L.push('7. No License');
  L.push('This Agreement does not transfer ownership of, or any license to, any Confidential Information.');
  L.push('');
  L.push('8. Governing Law');
  L.push('This Agreement is governed by the laws of ' + law + '.');
  L.push('');
  L.push('9. Entire Agreement');
  L.push('This is the entire agreement about confidentiality for the Purpose. Changes must be in writing and signed by both parties.');
  L.push('');
  L.push('Signed:');
  L.push('');
  L.push(a + ': ______________________   Date: __________');
  L.push(b + ': ______________________   Date: __________');
  L.push('');
  L.push('This template is general information and not legal advice.');
  return L.join('\n');
}

export default function NdaGenerator() {
  const p = PAGES.nda;
  useSEO({ title: p.title, description: p.description, canonical: canonicalFor(p.path) });
  const [f, setF] = useState({ type: 'mutual', disclosing: '', receiving: '', date: today(), purpose: '', years: 2, law: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const text = useMemo(() => buildNda(f), [f]);

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Free NDA Generator</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{copy.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[360px,1fr]">
        <form className="card space-y-4 no-print" onSubmit={(e) => e.preventDefault()} aria-label="NDA details">
          <fieldset>
            <legend className="label">Type of NDA</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="type" value="mutual" checked={f.type === 'mutual'} onChange={set('type')} /> Mutual
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="type" value="oneway" checked={f.type === 'oneway'} onChange={set('type')} /> One-way
              </label>
            </div>
          </fieldset>
          <div>
            <label className="label" htmlFor="nda-a">{f.type === 'mutual' ? 'Party A name' : 'Disclosing party'}</label>
            <input id="nda-a" className="input" value={f.disclosing} onChange={set('disclosing')} placeholder="Full name or business" />
          </div>
          <div>
            <label className="label" htmlFor="nda-b">{f.type === 'mutual' ? 'Party B name' : 'Receiving party'}</label>
            <input id="nda-b" className="input" value={f.receiving} onChange={set('receiving')} placeholder="Full name or business" />
          </div>
          <div>
            <label className="label" htmlFor="nda-date">Effective date</label>
            <input id="nda-date" type="date" className="input" value={f.date} onChange={set('date')} />
          </div>
          <div>
            <label className="label" htmlFor="nda-purpose">Purpose</label>
            <textarea id="nda-purpose" rows={3} className="input" value={f.purpose} onChange={set('purpose')} placeholder="e.g. discussing a website redesign" />
          </div>
          <div>
            <label className="label" htmlFor="nda-years">Confidentiality lasts (years)</label>
            <input id="nda-years" type="number" min="1" max="10" className="input" value={f.years} onChange={set('years')} />
          </div>
          <div>
            <label className="label" htmlFor="nda-law">Governing law</label>
            <input id="nda-law" className="input" value={f.law} onChange={set('law')} placeholder="e.g. Lagos State, Nigeria" />
          </div>
        </form>
        <OutputPanel text={text} filename="non-disclosure-agreement.txt" />
      </div>

      <div className="px-4 pb-10 pt-4">
        <ToolCopy copy={copy} />
        <RelatedTools current="nda" />
      </div>
    </>
  );
}