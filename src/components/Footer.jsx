import { Link } from 'react-router-dom';
import { TOOLS } from '../data/pageCopy.js';

export default function Footer() {
  return (
    <footer className="no-print bg-navy-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">
            Contract<span className="text-emerald-400">Guard</span>
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Plain-English contract checks for freelancers. Your text stays in your browser.
          </p>
        </div>
        <nav aria-label="Tools">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Tools</p>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.values(TOOLS).map((t) => (
              <li key={t.path}>
                <Link className="text-slate-200 underline-offset-2 hover:text-white hover:underline" to={t.path}>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">More</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-slate-200 underline-offset-2 hover:text-white hover:underline" to="/pricing">Pricing</Link></li>
            <li><Link className="text-slate-200 underline-offset-2 hover:text-white hover:underline" to="/blog">Blog</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-navy-700">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-300">
          &copy; {new Date().getFullYear()} ContractGuard. ContractGuard is an educational reading aid and does not provide legal advice.
          For important contracts, consult a qualified lawyer.
        </p>
      </div>
    </footer>
  );
}