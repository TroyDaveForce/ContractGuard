import { useEffect, useRef, useState } from 'react';
import ClauseCard from '../components/ClauseCard.jsx';
import RiskGauge from '../components/RiskGauge.jsx';
import PaywallModal from '../components/PaywallModal.jsx';
import AdSlot from '../components/AdSlot.jsx';
import { ToolCopy, RelatedTools } from '../components/ToolCopy.jsx';
import {
  analyzeContract,
  loadSavedScan,
  saveScan,
  clearSavedScan,
  hasUsedFreeScan,
  markFreeScanUsed,
  loadPro,
  savePro,
  isUnlocked,
} from '../engine/analyzeContract.js';
import { useSEO } from '../seo/useSEO.js';
import { softwareApplicationSchema, faqSchema } from '../seo/Schema.jsx';
import { PAGES, SITE_URL, canonicalFor, ADSENSE_CLIENT, AD_SLOTS } from '../seo/seoConfig.js';
import { pageCopy } from '../data/pageCopy.js';

const copy = pageCopy.analyzer;

export default function Analyzer() {
  const p = PAGES.analyzer;
  useSEO({
    title: p.title,
    description: p.description,
    canonical: canonicalFor(p.path),
    schema: [
      softwareApplicationSchema({ name: 'ContractGuard AI Contract Reader', url: SITE_URL + p.path, description: p.description }),
      faqSchema(copy.faq),
    ],
  });

  const [text, setText] = useState(() => loadSavedScan().text || '');
  const [result, setResult] = useState(() => loadSavedScan().result);
  const [pro, setPro] = useState(() => loadPro());
  const [notice, setNotice] = useState('');
  const [fileInfo, setFileInfo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const fileRef = useRef(null);
  const resultsRef = useRef(null);

  const unlocked = isUnlocked(result, pro);

  useEffect(() => {
    // keep the typed text between refreshes even before a scan
    try {
      localStorage.setItem('cg_text', JSON.stringify(text));
    } catch {
      /* ignore */
    }
  }, [text]);

  function handleScan() {
    if (!text.trim()) {
      setResult(null);
      setNotice('Please paste your contract text first, or upload a .txt or .docx file.');
      return;
    }
    setNotice('');
    // TODO: swap in real LLM API here
    const res = analyzeContract(text);
    res.isFree = !hasUsedFreeScan();
    if (res.isFree) markFreeScanUsed();
    saveScan(res, text);
    setResult(res);
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resultsRef.current.focus({ preventScroll: true });
      }
    }, 50);
  }

  function handleClear() {
    setText('');
    setResult(null);
    setNotice('');
    setFileInfo('');
    clearSavedScan();
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setNotice('');
    const name = file.name.toLowerCase();
    try {
      let content = '';
      if (name.endsWith('.txt')) {
        content = await file.text();
      } else if (name.endsWith('.docx')) {
        const mod = await import('mammoth/mammoth.browser.js');
        const mammoth = mod.default || mod;
        const out = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        content = out.value;
      } else {
        setNotice('Unsupported file type. Please upload a .txt or .docx file, or paste the text.');
        return;
      }
      if (!content.trim()) {
        setNotice('That file looks empty. Please check it or paste the text instead.');
        return;
      }
      setText(content);
      setFileInfo('Loaded ' + file.name);
    } catch (err) {
      setNotice('Sorry, that file could not be read. Try pasting the text instead.');
    }
  }

  // TODO: integrate Stripe Checkout here
  function handlePayment(plan) {
    let next;
    if (plan === 'unlimited') {
      next = { plan: 'unlimited', scanIds: pro.scanIds };
    } else {
      const ids = result ? Array.from(new Set(pro.scanIds.concat(result.id))) : pro.scanIds;
      next = { plan: pro.plan === 'unlimited' ? 'unlimited' : 'single', scanIds: ids };
    }
    savePro(next); // saved under localStorage key "cg_pro"
    setPro(next);
    setModalOpen(false);
  }

  const issues = result ? result.issues : [];
  const adAfter = Math.floor((issues.length - 1) / 2);
  const counts = result ? result.counts : null;

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Free AI Contract Reader</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{copy.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="card">
          <label htmlFor="contract-text" className="label text-base">Paste your contract</label>
          <textarea
            id="contract-text"
            aria-label="Contract text"
            className="input min-h-[280px] resize-y font-mono text-sm leading-6"
            placeholder="Paste the full text of your client contract here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" className="btn-primary sm:min-w-[200px]" onClick={handleScan} aria-label="Scan contract for risky clauses">
              Scan Contract
            </button>
            <button type="button" className="btn-secondary" onClick={() => fileRef.current && fileRef.current.click()} aria-label="Upload a .txt or .docx file">
              Upload .txt / .docx
            </button>
            <input ref={fileRef} type="file" accept=".txt,.docx" className="hidden" onChange={handleFile} aria-label="Contract file input" tabIndex={-1} />
            <button type="button" className="btn-secondary" onClick={handleClear} aria-label="Clear contract and results">
              Clear
            </button>
          </div>
          {fileInfo && <p className="mt-3 text-sm font-medium text-emerald-800" role="status">{fileInfo}</p>}
          {notice && (
            <p role="alert" className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-900">
              {notice}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-700">Your text stays in your browser. ContractGuard is a reading aid, not legal advice.</p>
        </div>

        {result && (
          <section ref={resultsRef} tabIndex={-1} aria-labelledby="results-h" aria-live="polite" className="mt-8 outline-none">
            <div className="card">
              <h2 id="results-h" className="text-2xl font-extrabold">Your scan results</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
                <RiskGauge score={result.score} />
                <div>
                  <p className="text-slate-800">
                    {counts.total === 0
                      ? 'No risky clauses were found in ' + result.wordCount + ' words.'
                      : 'We found ' + counts.total + (counts.total === 1 ? ' issue' : ' issues') + ' in ' + result.wordCount + ' words.'}
                  </p>
                  <ul className="mt-4 grid grid-cols-3 gap-3 text-center" aria-label="Issue summary">
                    <li className="rounded-lg bg-red-50 p-3 ring-1 ring-red-200">
                      <span className="block text-2xl font-extrabold text-red-800">{counts.high}</span>
                      <span className="text-xs font-semibold text-red-900">High</span>
                    </li>
                    <li className="rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                      <span className="block text-2xl font-extrabold text-amber-900">{counts.medium}</span>
                      <span className="text-xs font-semibold text-amber-900">Medium</span>
                    </li>
                    <li className="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-200">
                      <span className="block text-2xl font-extrabold text-emerald-900">{counts.low}</span>
                      <span className="text-xs font-semibold text-emerald-900">Low</span>
                    </li>
                  </ul>
                  {counts.total > 0 && (
                    <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                      <div className="bg-red-600" style={{ width: (counts.high / counts.total) * 100 + '%' }} />
                      <div className="bg-amber-500" style={{ width: (counts.medium / counts.total) * 100 + '%' }} />
                      <div className="bg-emerald-600" style={{ width: (counts.low / counts.total) * 100 + '%' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!unlocked && counts.total > 0 && (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-navy-900">
                  Your free scan is used. Unlock this report to read every explanation and copy the suggested rewrites.
                </p>
                <button type="button" className="btn-primary shrink-0" onClick={() => setModalOpen(true)}>
                  Unlock full report
                </button>
              </div>
            )}

            {counts.total === 0 ? (
              <>
                <div role="status" className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-5">
                  <p className="text-lg font-bold text-emerald-900">This contract looks clean.</p>
                  <p className="mt-1 text-emerald-900">
                    None of our 14 checks found a risky clause. That is a good sign, but it is not a guarantee, so read the whole document yourself and consider a lawyer for large projects.
                  </p>
                </div>
                <AdSlot data-ad-client={ADSENSE_CLIENT} data-ad-slot={AD_SLOTS.analyzer} />
              </>
            ) : (
              <div className="mt-5 space-y-5">
                {issues.map((issue, i) => (
                  <div key={issue.id}>
                    <ClauseCard issue={issue} locked={!unlocked} onUnlock={() => setModalOpen(true)} />
                    {/* Ad slot 2 of 3: middle of the results */}
                    {i === adAfter && <AdSlot data-ad-client={ADSENSE_CLIENT} data-ad-slot={AD_SLOTS.analyzer} />}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="px-4 pb-6 pt-6">
        <ToolCopy copy={copy} />
        <section aria-labelledby="faq-h" className="mx-auto mt-12 max-w-3xl">
          <h2 id="faq-h" className="text-2xl font-extrabold">Frequently asked questions</h2>
          <dl className="mt-4 space-y-5">
            {copy.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-bold text-navy-900">{f.q}</dt>
                <dd className="mt-1 leading-7 text-slate-800">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <RelatedTools current="analyzer" />
      </div>

      <PaywallModal open={modalOpen} onClose={() => setModalOpen(false)} onPay={handlePayment} />
    </>
  );
}