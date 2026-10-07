# ContractGuard

An AI-style contract reader for freelancers. Paste a contract, get a risk score, highlighted risky clauses, plain-English explanations and suggested rewrites. 100% static: React + Vite + Tailwind, no backend, no database. The analysis runs in the browser with a rule-based engine (src/engine). Where a real LLM would go, look for: `// TODO: swap in real LLM API here`.

## Run it locally

1. Install Node.js 18 or newer from nodejs.org.
2. Open a terminal in this folder and run `npm install`.
3. Run `npm run dev` and open the address it prints (usually http://localhost:5173).
4. Run `npm run build` to create the `dist` folder (the whole static site).
5. Run `npm run preview` to test the built site locally.

## Before you launch (checklist)

1. In `src/seo/seoConfig.js` change SITE_URL to your real domain. Do the same in `public/sitemap.xml` and `public/robots.txt`.
2. Add a 1200x630 image named `og-image.png` into the `public` folder (used for social sharing previews).
3. AdSense: replace `ca-pub-XXXXXXXXXXXXXXXX` in `index.html` AND in `src/seo/seoConfig.js`, then replace the slot numbers in AD_SLOTS. Set USE_ADSENSE to false in `index.html` if you do not want ads.
4. Payments are SIMULATED. Search for `TODO: integrate Stripe Checkout here` in `src/pages/Analyzer.jsx` and connect Stripe Checkout (Payment Links work without a backend). Remove the "Simulate successful payment" button from `src/components/PaywallModal.jsx` when real payments go live.
5. Everything is client-side, so the paywall can be bypassed by someone who edits localStorage. For real revenue protection, verify payments on a server later.


## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to vercel.com, click Add New Project and import the repository.
3. Vercel detects Vite. Build command: `npm run build`. Output directory: `dist`.
4. Click Deploy. The included `vercel.json` makes page routes like /nda-generator work on refresh.

## Deploy to Cloudflare Pages

1. Push this folder to GitHub.
2. In the Cloudflare dashboard open Workers and Pages, then Create, then Pages, then Connect to Git.
3. Choose the repository. Build command: `npm run build`. Build output directory: `dist`.
4. Click Save and Deploy. The `_redirects` file (copied from `public`) handles routing.

## Deploy to Netlify

1. Push this folder to GitHub.
2. In Netlify click Add new site, then Import an existing project, and pick the repository.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Click Deploy. The `_redirects` file handles routing.
5. Prefer drag and drop? Run `npm run build`, then drag the `dist` folder onto app.netlify.com/drop.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder to it.
2. If your site will live at https://USERNAME.github.io/REPO/ (a project site), build with a base path. In PowerShell: `$env:VITE_BASE="/REPO/"` then `npm run build`. If you use a custom domain or a USERNAME.github.io repository, skip this.
3. Run `npm run deploy:gh`. This builds the site and publishes `dist` to the gh-pages branch.
4. In the repository go to Settings, then Pages, and set the source to the gh-pages branch.
5. The build copies `index.html` to `404.html`, so deep links work. Note: GitHub Pages answers unknown URLs with a 404 status, so for best SEO prefer Vercel, Netlify or Cloudflare Pages.

## Project map

- src/engine/clauseRules.js : the 14 detection rules (regex + explanation + redline)
- src/engine/analyzeContract.js : runs the rules, scores the contract, local storage helpers
- src/pages : Home, Analyzer, Pricing, NDA / Invoice / Proposal tools, Blog
- src/seo : useSEO hook, site config, JSON-LD builders
- src/data/pageCopy.js : all written page content

ContractGuard is a reading aid, not legal advice.
