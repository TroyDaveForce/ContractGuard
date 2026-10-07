import { useEffect, useRef } from 'react';

/**
 * AdSlot - a labelled, fixed-height box so the page never jumps when an ad loads.
 * Props: data-ad-client (ca-pub-...), data-ad-slot (ad unit number).
 *
 * NOTE: AdSense does work in Nigeria, but the publisher has to verify their address
 * and identity first, and payouts only happen once the balance passes $100.
 * Ads must never block or break the main tool: this component is isolated, wrapped in
 * try/catch, and shows a harmless placeholder until a real publisher ID is configured.
 */
export default function AdSlot(props) {
  const client = props['data-ad-client'];
  const slot = props['data-ad-slot'];
  const isPlaceholder = !client || String(client).includes('XXXX');
  const pushed = useRef(false);

  useEffect(() => {
    if (isPlaceholder || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      /* never let an ad error affect the app */
    }
  }, [isPlaceholder]);

  return (
    <aside aria-label="Advertisement" className="no-print mx-auto my-8 w-full max-w-4xl px-4">
      <div className="relative h-[120px] overflow-hidden rounded-lg border border-dashed border-slate-400 bg-slate-100">
        <span className="absolute left-2 top-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
          Advertisement
        </span>
        {isPlaceholder ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-700">
            Ad placeholder (slot {slot || 'n/a'}). Set your AdSense ID to show real ads.
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', height: '120px' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        )}
      </div>
    </aside>
  );
}