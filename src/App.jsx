import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdSlot from './components/AdSlot.jsx';
import { useSEO } from './seo/useSEO.js';
import { ADSENSE_CLIENT, AD_SLOTS, canonicalFor } from './seo/seoConfig.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Analyzer = lazy(() => import('./pages/Analyzer.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const NdaGenerator = lazy(() => import('./pages/NdaGenerator.jsx'));
const InvoiceGenerator = lazy(() => import('./pages/InvoiceGenerator.jsx'));
const ProposalWriter = lazy(() => import('./pages/ProposalWriter.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  useSEO({
    title: 'Page not found \u2014 ContractGuard',
    description: 'This page could not be found. Try the free AI contract reader instead.',
    canonical: canonicalFor('/'),
  });
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-slate-700">That page does not exist, but your contract still needs reading.</p>
      <Link to="/ai-contract-reader" className="btn-primary mt-6">Go to the contract reader</Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-navy-900"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh] p-8 text-center text-slate-600" role="status">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-contract-reader" element={<Analyzer />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/nda-generator" element={<NdaGenerator />} />
            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/proposal-writer" element={<ProposalWriter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {/* Ad slot 3 of 3: just above the footer */}
      <AdSlot data-ad-client={ADSENSE_CLIENT} data-ad-slot={AD_SLOTS.footer} />
      <Footer />
    </div>
  );
}