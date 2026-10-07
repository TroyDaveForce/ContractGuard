const STYLES = {
  high: 'bg-red-100 text-red-900 ring-red-300',
  medium: 'bg-amber-100 text-amber-900 ring-amber-300',
  low: 'bg-emerald-100 text-emerald-900 ring-emerald-300',
};
const DOTS = { high: 'bg-red-600', medium: 'bg-amber-500', low: 'bg-emerald-600' };
const LABELS = { high: 'High risk', medium: 'Medium risk', low: 'Low risk' };

export default function RiskBadge({ severity }) {
  return (
    <span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ' + STYLES[severity]}>
      <span className={'h-2 w-2 rounded-full ' + DOTS[severity]} aria-hidden="true" />
      {LABELS[severity]}
    </span>
  );
}