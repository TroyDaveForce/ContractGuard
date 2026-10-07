// ContractGuard rule set. Each rule:
//   id, label, severity ("high" | "medium" | "low"),
//   detect  : array of regular expressions (any match flags the sentence)
//   verify  : optional function(sentence) => boolean, extra check after a regex match
//   absentIf: optional regex; for "missing clause" rules the issue is flagged only if the
//             WHOLE contract does not contain it
//   explanation, redline

const WORD_DAYS = { thirty: 30, 'forty-five': 45, 'forty five': 45, sixty: 60, 'seventy-five': 75, 'seventy five': 75, ninety: 90 };

// Largest "N days" figure in a sentence (digits or common words).
function maxDays(sentence) {
  const re = /\b(\d{1,3}|thirty|forty[- ]five|sixty|seventy[- ]five|ninety)\b\s*(?:\(\s*\d+\s*\)\s*)?(?:calendar\s+|business\s+|working\s+)?days?\b/gi;
  let best = 0;
  let m;
  while ((m = re.exec(sentence)) !== null) {
    const raw = m[1].toLowerCase();
    const n = WORD_DAYS[raw] !== undefined ? WORD_DAYS[raw] : parseInt(raw, 10);
    if (n > best) best = n;
  }
  const net = sentence.match(/\bnet[\s-]*(\d{2,3})\b/i);
  if (net) best = Math.max(best, parseInt(net[1], 10));
  return best;
}

const PLACES =
  '(?:delaware|california|new\\s+york|texas|florida|nevada|washington|illinois|massachusetts|england|london|united\\s+kingdom|united\\s+states|singapore|ireland|germany|france|netherlands|australia|canada|ontario|british\\s+columbia|dubai|uae|hong\\s+kong|switzerland|sweden|new\\s+zealand)';

const NOTICE_GIVEN = /\b(\d+|seven|ten|fourteen|fifteen|thirty)\s*(?:\(\s*\d+\s*\)\s*)?(?:calendar\s+|business\s+)?days['\u2019]?\s+(?:prior\s+|advance\s+)?(?:written\s+)?notice/i;
const TERM_GIVEN = /\b(\d+|one|two|three|four|five|seven|ten)\s*(?:\(\s*\d+\s*\)\s*)?(?:calendar\s+)?(years?|months?)\b/i;

export const RULES = [
  {
    id: 'unlimited_revisions',
    label: 'Unlimited revisions',
    severity: 'medium',
    detect: [
      /unlimited\s+(?:revisions?|changes|edits|rounds|amendments|modifications)/i,
      /as\s+many\s+(?:revisions?|changes|edits|rounds)/i,
      /(?:any\s+number\s+of|without\s+limit(?:ation)?\s+(?:on|to|of)?)\s*(?:revisions?|changes|edits|rounds)/i,
      /(?:revisions?|changes|edits|amendments)[^.]{0,60}\buntil\b[^.]{0,40}(?:satisf|approv|happy)/i,
      /\buntil\s+(?:the\s+)?(?:client|company)\s+is\s+(?:completely\s+|fully\s+|totally\s+)?(?:satisfied|happy|approves?)/i,
      /(?:revisions?|changes|edits)[^.]{0,60}at\s+no\s+(?:additional|extra)\s+(?:cost|charge|fee)/i,
    ],
    explanation:
      "This wording lets the client ask for changes again and again with no cap. A project can drag on for months while you keep working for the same flat fee, and you have little power to say the job is finished. Your effective hourly rate quietly shrinks with every extra round.",
    redline:
      "The fee includes up to two (2) rounds of revisions to each deliverable. Additional revisions or changes outside the agreed scope will be billed at Freelancer's standard rate of [hourly rate]. A revision round begins when Client sends consolidated feedback in writing.",
  },
  {
    id: 'slow_payment',
    label: 'Slow payment terms (30+ days)',
    severity: 'medium',
    detect: [
      /\bnet[\s-]*\d{2,3}\b/i,
      /(?:pay|payment|invoice|fee|compensation|remuneration)[^.]{0,140}\bdays?\b/i,
      /\bdays?\b[^.]{0,100}(?:invoice|payment|receipt)/i,
    ],
    verify: (s) => /(?:pay|invoice|fee|compensat|remunerat)/i.test(s) && maxDays(s) >= 30,
    explanation:
      "Payment is due a month or more after you send your invoice. You finish the work, then effectively lend the client money for weeks while your own bills keep arriving. Many freelancers ask for 7 to 14 days, plus a deposit up front, to protect their cash flow.",
    redline:
      "Client will pay each invoice within fourteen (14) days of the invoice date. A deposit of [50]% of the project fee is due before work begins.",
  },
  {
    id: 'ip_transfer',
    label: 'All intellectual property transferred to client',
    severity: 'high',
    detect: [
      /(?:assigns?|transfers?|conveys?|surrenders?)[^.]{0,100}(?:right|title|interest|ownership)[^.]{0,80}(?:intellectual\s+property|work\s+product|deliverables|materials|work)/i,
      /all\s+intellectual\s+property[^.]{0,100}(?:belong|vest|be\s+the\s+(?:sole\s+|exclusive\s+)?property|owned|shall\s+be\s+owned)/i,
      /(?:owns?|ownership\s+of)[^.]{0,50}all[^.]{0,40}intellectual\s+property/i,
      /(?:pre-?existing|background|prior)\s+(?:intellectual\s+property|IP|materials|tools|code)[^.]{0,80}(?:assign|transfer|belong|owned)/i,
    ],
    explanation:
      "This clause hands over ownership of your intellectual property, which can be far more than the finished deliverable. Depending on the wording, it may include your drafts, templates, tools and methods that you reuse for other clients. You could lose the right to reuse your own work, sometimes even before you have been paid.",
    redline:
      "Upon receipt of full payment, Freelancer assigns to Client ownership of the final deliverables created specifically for Client. Freelancer retains all rights in pre-existing materials, tools, templates and methods, and grants Client a non-exclusive, perpetual license to use any of these that are incorporated in the deliverables.",
  },
  {
    id: 'work_for_hire',
    label: 'Work made for hire',
    severity: 'high',
    detect: [/work[s]?\s*(?:made\s*)?(?:for|-for-)\s*hire/i, /work[- ]made[- ]for[- ]hire/i, /works?\s+for\s+hire/i],
    explanation:
      "Work for hire means the law treats your client as the author from the moment you create the work, almost as if you were their employee. You get no ownership rights, and you may lose the ability to show the work in your portfolio. It is normal for employees but unusual and risky for independent contractors.",
    redline:
      "The parties agree that Freelancer is an independent contractor and that the deliverables are not works made for hire. Ownership transfers to Client only upon full payment, and Freelancer may display the work in a portfolio unless otherwise agreed in writing.",
  },
  {
    id: 'non_compete',
    label: 'Non-compete restriction',
    severity: 'high',
    detect: [
      /non-?\s?compet(?:e|ition)/i,
      /(?:shall|will|agrees?\s+to|may)\s+not[^.]{0,100}(?:compet(?:e|ing|itor)|similar\s+(?:services|business|clients|work))/i,
      /(?:refrain|prohibited|barred|restricted)[^.]{0,80}(?:competing|competitors?|similar\s+(?:services|business|clients))/i,
    ],
    explanation:
      "A non-compete stops you from working with other clients in the same field, sometimes for months or years after the project ends. Freelancers earn their living from many clients, so this can block your normal work. Some places will not enforce broad non-competes, but you should not count on that.",
    redline:
      "During the term, Freelancer will not knowingly provide the same services to a direct competitor of Client on the specific project covered by this Agreement. Nothing in this Agreement restricts Freelancer from working with other clients or in the same industry.",
  },
  {
    id: 'exclusivity',
    label: 'Exclusivity requirement',
    severity: 'high',
    detect: [
      /exclusive(?:ly)?\s+(?:services|basis|engagement|relationship|provider|contractor)/i,
      /(?:work|provide\s+(?:services|work)|devote)[^.]{0,40}\b(?:exclusively|solely|only)\b[^.]{0,20}(?:for|to)\b/i,
      /exclusively\s+for\s+(?:the\s+)?(?:client|company)/i,
      /(?:shall|will|may)\s+not[^.]{0,60}(?:services|work)[^.]{0,40}(?:any\s+other|third\s+part(?:y|ies)|other\s+clients?)/i,
    ],
    explanation:
      "Exclusivity means you may only work for this client while the contract runs. If projects slow down or an invoice is paid late, you cannot replace the income with other work. Unless the client pays you a full-time rate for your full-time attention, this is a poor trade.",
    redline:
      "Freelancer is engaged on a non-exclusive basis and may provide services to other clients during the term, provided Client's confidential information is not disclosed. If Client requires exclusivity, a retainer of [amount] per month will apply.",
  },
  {
    id: 'indemnification',
    label: 'Indemnification (you cover their legal costs)',
    severity: 'high',
    detect: [
      /indemnif(?:y|ies|ied|ication)/i,
      /hold\s+(?:\w+\s+){0,3}harmless/i,
      /(?:responsible|liable)\s+for[^.]{0,60}(?:legal\s+(?:fees|costs|expenses)|attorneys?['\u2019]?\s+fees)/i,
    ],
    explanation:
      "Indemnification means that if the client is sued or faces a problem connected to your work, you may have to pay their legal bills and damages. The amount is often unlimited and can apply even when the client contributed to the problem. For the price of one project, that is a very large risk to carry.",
    redline:
      "Freelancer will indemnify Client only against third-party claims that the deliverables, as delivered by Freelancer, infringe a third party's copyright, and only to the extent caused by Freelancer's breach. Freelancer's total liability under this Agreement is limited to the fees paid for the project.",
  },
  {
    id: 'no_kill_fee',
    label: 'No kill fee',
    severity: 'medium',
    detect: [
      /\bno\s+kill\s+fee\b/i,
      /(?:cancel|terminat)[^.]{0,120}(?:no|without)\s+(?:further\s+)?(?:payment|compensation|fee|obligation|liability)/i,
      /(?:not\s+(?:be\s+)?(?:entitled|owed|due)|no\s+(?:right|entitlement))[^.]{0,80}(?:payment|compensation|fees)/i,
      /(?:not\s+(?:be\s+)?(?:obligated|required|liable)\s+to\s+pay)[^.]{0,80}(?:work|services|fees)/i,
      /(?:forfeit|waive)[^.]{0,60}(?:payment|fees|compensation)[^.]{0,60}(?:terminat|cancel)/i,
    ],
    explanation:
      "This wording suggests the client can cancel and owe you nothing for work already done. You could spend weeks on a project and walk away empty-handed. A kill fee, which pays you for lost time and opportunity, is a standard protection freelancers ask for.",
    redline:
      "If Client cancels this Agreement for any reason, Client will pay for all work completed up to the cancellation date plus a kill fee of [25]% of the remaining unpaid project fee. Deposits are non-refundable.",
  },
  {
    id: 'auto_renewal',
    label: 'Automatic renewal',
    severity: 'low',
    detect: [
      /auto(?:matic(?:ally)?)?[-\s]?renew/i,
      /(?:shall|will)\s+(?:automatically\s+)?(?:renew|be\s+renewed|extend)[^.]{0,80}(?:unless|successive|additional|further|term)/i,
      /renew(?:s|ed)?\s+(?:automatically|for\s+successive)/i,
      /\bevergreen\b/i,
    ],
    explanation:
      "The contract renews by itself unless you act within a specific window. If you miss that window, you may be locked in for another full term, often at the old rate even as your costs rise. It is easy to forget a renewal date months after signing.",
    redline:
      "This Agreement ends at the close of the initial term unless both parties agree to renew in writing. Any renewal will be at Freelancer's then-current rates, and Freelancer will send a reminder at least thirty (30) days before the term ends.",
  },
  {
    id: 'termination_no_notice',
    label: 'Termination without notice',
    severity: 'high',
    detect: [
      /(?:terminat|cancel)[^.]{0,100}(?:at\s+any\s+time|immediately)[^.]{0,80}without\s+(?:prior\s+|advance\s+|written\s+)?(?:notice|cause|reason)/i,
      /without\s+(?:prior\s+|advance\s+|written\s+)?notice[^.]{0,100}(?:terminat|cancel)/i,
      /(?:terminat|cancel)[^.]{0,120}without\s+(?:prior\s+|advance\s+|written\s+)?(?:notice|cause|reason)/i,
      /(?:client|company)[^.]{0,80}(?:terminate|cancel|end)[^.]{0,80}(?:immediately|at\s+any\s+time|in\s+its\s+sole\s+discretion|for\s+convenience)/i,
    ],
    verify: (s) => !NOTICE_GIVEN.test(s),
    explanation:
      "The client can end the agreement immediately, sometimes without any reason or warning. You could lose your income overnight with no time to find replacement work. Fair contracts give both sides notice and pay for the work already done.",
    redline:
      "Either party may terminate this Agreement with fourteen (14) days' written notice. Upon termination, Client will pay for all work performed through the termination date and for any non-cancellable expenses.",
  },
  {
    id: 'no_late_penalty',
    label: 'No late payment penalty',
    severity: 'medium',
    type: 'missing',
    detect: [/\b(?:invoice[sd]?|payments?|fees?|compensation)\b[^.]{0,120}\b(?:due|payable|within|owed|pay)\b/i],
    absentIf:
      /(?:late\s+(?:fee|payment|charge|penalt|interest)|interest\s+(?:on|at|of|shall|will|accrue)|(?:overdue|past\s+due|unpaid)[^.]{0,80}(?:interest|fee|charge|penalt|suspend)|\d+(?:\.\d+)?\s*%\s*(?:per|a|each)\s*(?:month|annum|year)|penalt(?:y|ies)\s+for\s+(?:late|non-?payment))/i,
    explanation:
      "Your contract describes payment but says nothing about what happens if the client pays late. With no consequence, paying late costs the client nothing, and some clients treat due dates as suggestions. A late fee gives you something concrete to point to when you chase an invoice.",
    redline:
      "Invoices unpaid after the due date will accrue a late fee of 1.5% per month (or the maximum allowed by law, if lower). Freelancer may pause work on any project while an invoice is more than seven (7) days overdue.",
  },
  {
    id: 'unlimited_confidentiality',
    label: 'Confidentiality with no end date',
    severity: 'low',
    detect: [
      /confiden[^.]{0,200}(?:perpetual|in\s+perpetuity|indefinite|forever|without\s+(?:time\s+)?limit|no\s+(?:expiration|expiry|end\s+date))/i,
      /(?:perpetual|in\s+perpetuity|indefinite|forever)[^.]{0,200}(?:confiden|non-?disclos|secret)/i,
      /(?:confidentiality|non-?disclosure|secrecy)[^.]{0,100}(?:shall|will)\s+(?:survive|continue|remain)[^.]{0,80}(?:termination|expiration|end)/i,
    ],
    verify: (s) => !TERM_GIVEN.test(s),
    explanation:
      "The secrecy duty has no end date, so you may have to stay quiet about the project, and possibly about everything you learned, forever. That can make it hard to show your work, describe your experience or serve similar clients later. Fair contracts usually limit confidentiality to a few years.",
    redline:
      "Freelancer will keep Client's confidential information private for [two (2)] years after the end of this Agreement. Confidentiality does not cover information that is public, already known to Freelancer, or independently developed.",
  },
  {
    id: 'foreign_jurisdiction',
    label: 'Disputes handled in a foreign court',
    severity: 'medium',
    detect: [
      new RegExp('(?:courts?|jurisdiction|venue|arbitration|tribunal)[^.]{0,120}\\b(?:of|in|at|within|located\\s+in)\\s+(?:the\\s+)?(?:state\\s+of\\s+|city\\s+of\\s+|county\\s+of\\s+)?' + PLACES + '\\b', 'i'),
      new RegExp('governed\\s+(?:by|under)[^.]{0,80}laws?\\s+of\\s+(?:the\\s+)?(?:state\\s+of\\s+)?' + PLACES + '\\b', 'i'),
      /\bexclusive\s+jurisdiction\b/i,
      /\b(?:ICC|LCIA|ICDR|JAMS)\b/,
    ],
    explanation:
      "Disputes would be settled in a court or arbitration in a place that may be far from you, possibly in another country. Even a small unpaid invoice could cost more in travel, local lawyers and fees than it is worth, so you would probably never chase it. The client gets a home-field advantage. If the named place is your own home jurisdiction, you can ignore this flag.",
    redline:
      "This Agreement is governed by the laws of [Freelancer's country or state]. The parties will first try to resolve any dispute in good faith, then through online mediation or in the courts of [Freelancer's location].",
  },
  {
    id: 'scope_creep',
    label: 'Vague scope ("other duties as required")',
    severity: 'medium',
    detect: [
      /(?:and|or)\s+(?:any\s+)?other\s+(?:duties|tasks|services|work|responsibilities)[^.]{0,50}\b(?:as|that|which|when)\b[^.]{0,30}(?:required|needed|requested|assigned|necessary|directed|deemed)/i,
      /other\s+(?:duties|tasks|services|work)\s+as\s+(?:may\s+be\s+)?(?:required|needed|assigned|requested|directed)/i,
      /such\s+other\s+(?:duties|services|tasks|work)/i,
      /additional\s+(?:tasks|services|work|duties)[^.]{0,60}(?:at\s+no\s+(?:additional|extra)\s+(?:cost|charge|fee)|as\s+(?:required|requested|needed))/i,
      /including\s+(?:but\s+)?not\s+limited\s+to[^.]{0,100}(?:services|duties|tasks|deliverables)/i,
      /any\s+(?:and\s+all\s+)?(?:other\s+)?(?:tasks|work|duties)[^.]{0,40}(?:client|company)\s+(?:may\s+)?(?:request|require|assign)/i,
    ],
    explanation:
      "Vague phrases like 'and other duties as required' have no limit. The client can keep adding tasks without adjusting your fee, and you cannot easily say no because you already agreed. The job slowly grows into something much bigger than the price you quoted.",
    redline:
      "Freelancer will perform only the services and deliverables listed in the Statement of Work. Any additional tasks must be agreed in writing in a change order that includes an adjusted fee and timeline.",
  },
];

export default RULES;