import { RULES } from './clauseRules.js';

const WEIGHTS = { high: 20, medium: 10, low: 4 };
const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };
const HOLD = '\u0001';

/** Split contract text into sentence-like pieces (no regex look-behind, works on older Safari). */
export function splitSentences(raw) {
  let t = String(raw || '').replace(/\r\n?/g, '\n');
  // strip leading list numbers like "7." or "(a)" at line start
  t = t.replace(/^[ \t]*(?:\d+(?:\.\d+)*[.)]|\([a-zA-Z0-9]{1,3}\))[ \t]+/gm, '');
  // protect abbreviations and decimals so they do not break sentences
  t = t.replace(/\b(?:U\.S\.A|U\.S|U\.K|e\.g|i\.e|Inc|Ltd|Co|Corp|No|Nos|vs|etc|Mr|Mrs|Ms|Dr)\./gi, (m) => m.replace(/\./g, HOLD));
  t = t.replace(/(\d)\.(\d)/g, '$1' + HOLD + '$2');
  const parts = t.match(/[^.!?\n]+[.!?]*/g) || [];
  return parts
    .map((p) => p.split(HOLD).join('.').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 2);
}

function findHit(rule, sentences, fullText) {
  if (rule.absentIf && rule.absentIf.test(fullText)) return -1;
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const matched = rule.detect.some((re) => re.test(s));
    if (!matched) continue;
    if (rule.verify && !rule.verify(s)) continue;
    return i;
  }
  return -1;
}

function contextSentence(sentences, i) {
  let text = sentences[i];
  let j = i + 1;
  // headings are short: pull in the following sentence(s) so the quote makes sense
  while (text.length < 60 && j < sentences.length && j <= i + 2) {
    text += ' ' + sentences[j];
    j++;
  }
  return text.length > 420 ? text.slice(0, 417) + '...' : text;
}

export function analyzeContract(rawText) {
  // TODO: swap in real LLM API here
  const text = String(rawText || '').trim();
  const sentences = splitSentences(text);
  const issues = [];

  RULES.forEach((rule, order) => {
    const idx = findHit(rule, sentences, text);
    if (idx === -1) return;
    issues.push({
      id: rule.id,
      label: rule.label,
      severity: rule.severity,
      missing: rule.type === 'missing',
      sentence: contextSentence(sentences, idx),
      explanation: rule.explanation,
      redline: rule.redline,
      order,
    });
  });

  issues.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.order - b.order);

  const counts = { high: 0, medium: 0, low: 0, total: issues.length };
  let penalty = 0;
  issues.forEach((i) => {
    counts[i.severity] += 1;
    penalty += WEIGHTS[i.severity];
  });
  // 100 = no issues. Smooth decay so several high-severity issues push the score close to 0.
  const score = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-penalty / 55))));

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    scannedAt: new Date().toISOString(),
    wordCount: text ? text.split(/\s+/).length : 0,
    score,
    counts,
    issues,
    isFree: false,
  };
}

// ---------- localStorage helpers (kept here so the file structure stays small) ----------
const KEYS = { result: 'cg_result', text: 'cg_text', free: 'cg_free_used', pro: 'cg_pro' };

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: app still works for this session */
  }
}

export function loadSavedScan() {
  return { result: read(KEYS.result, null), text: read(KEYS.text, '') };
}
export function saveScan(result, text) {
  write(KEYS.result, result);
  write(KEYS.text, text);
}
export function clearSavedScan() {
  try {
    localStorage.removeItem(KEYS.result);
    localStorage.removeItem(KEYS.text);
  } catch {
    /* ignore */
  }
}
export function hasUsedFreeScan() {
  return read(KEYS.free, false) === true;
}
export function markFreeScanUsed() {
  write(KEYS.free, true);
}
// cg_pro holds { plan: "none" | "single" | "unlimited", scanIds: [...] }
export function loadPro() {
  const v = read(KEYS.pro, null);
  if (v && typeof v === 'object') return { plan: v.plan || 'none', scanIds: Array.isArray(v.scanIds) ? v.scanIds : [] };
  return { plan: 'none', scanIds: [] };
}
export function savePro(pro) {
  write(KEYS.pro, pro);
}
export function isUnlocked(result, pro) {
  if (!result) return false;
  return pro.plan === 'unlimited' || result.isFree === true || pro.scanIds.includes(result.id);
}