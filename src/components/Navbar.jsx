import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  ['/ai-contract-reader', 'Contract Reader'],
  ['/nda-generator', 'NDA'],
  ['/invoice-generator', 'Invoice'],
  ['/proposal-writer', 'Proposal'],
  ['/blog', 'Blog'],
  ['/pricing', 'Pricing'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    'block rounded-md px-3 py-2 text-sm font-medium ' +
    (isActive ? 'bg-navy-700 text-white' : 'text-slate-200 hover:bg-navy-800 hover:text-white');

  return (
    <header className="no-print sticky top-0 z-40 bg-navy-900 text-white">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3">
        <Link to="/" aria-label="ContractGuard home" className="flex items-center gap-2 text-lg font-bold">
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 6l22 8v17c0 14-9 24-22 29C19 55 10 45 10 31V14z" fill="#10b981" />
            <path d="M22 32l7 7 13-14" fill="none" stroke="#0b1b3a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Contract<span className="text-emerald-400">Guard</span>
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-navy-800 md:hidden"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <ul
          id="nav-menu"
          className={(open ? 'flex' : 'hidden') + ' w-full flex-col gap-1 pb-2 pt-2 md:flex md:w-auto md:flex-row md:items-center md:pb-0 md:pt-0'}
        >
          {links.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}