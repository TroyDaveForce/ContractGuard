export function scoreInfo(score) {
  if (score >= 80) return { label: 'Looks safe', color: '#059669' };
  if (score >= 55) return { label: 'Some risks', color: '#d97706' };
  if (score >= 30) return { label: 'Risky', color: '#ea580c' };
  return { label: 'High risk', color: '#dc2626' };
}

export default function RiskGauge({ score }) {
  const size = 176;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const info = scoreInfo(score);

  return (
    <div className="flex flex-col items-center" role="img" aria-label={'Risk score ' + score + ' out of 100. ' + info.label + '.'}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={info.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform={'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-navy-900">{score}</span>
          <span className="text-sm font-medium text-slate-700">out of 100</span>
        </div>
      </div>
      <p className="mt-2 text-base font-bold text-navy-900">{info.label}</p>
    </div>
  );
}