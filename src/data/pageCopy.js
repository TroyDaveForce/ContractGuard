// All written content. Tool pages follow: What this tool does / How to use it / Why freelancers need this.

export const TOOLS = {
  analyzer: {
    path: '/ai-contract-reader',
    name: 'AI Contract Reader',
    blurb: 'Scan a client contract and see the risky clauses explained in plain English.',
  },
  nda: {
    path: '/nda-generator',
    name: 'NDA Generator',
    blurb: 'Create a fair one-way or mutual non-disclosure agreement in minutes.',
  },
  invoice: {
    path: '/invoice-generator',
    name: 'Invoice Generator',
    blurb: 'Build a professional invoice with automatic totals and late-fee wording.',
  },
  proposal: {
    path: '/proposal-writer',
    name: 'Proposal Writer',
    blurb: 'Turn project details into a clear proposal with protective terms.',
  },
};

export const RELATED = {
  analyzer: ['nda', 'invoice', 'proposal'],
  nda: ['analyzer', 'invoice', 'proposal'],
  invoice: ['analyzer', 'nda', 'proposal'],
  proposal: ['analyzer', 'nda', 'invoice'],
  blog: ['analyzer', 'nda', 'proposal'],
};

export const pageCopy = {
  home: {
    headline: 'Know what you are signing before you sign it.',
    sub: 'Paste a client contract. ContractGuard highlights the risky clauses, explains each one in plain English and suggests fairer wording you can send back.',
    features: [
      { title: 'Risky clauses, highlighted', text: 'Fourteen common traps are checked, from endless revisions to ownership grabs and slow payment.' },
      { title: 'Plain English, no jargon', text: 'Every flagged sentence comes with a short explanation written for people who are not lawyers.' },
      { title: 'Better wording included', text: 'Copy a fairer replacement clause straight into your reply and ask for the change.' },
    ],
    steps: [
      { title: 'Paste', text: 'Drop in the contract text or upload a .txt or .docx file.' },
      { title: 'Scan', text: 'Get a 0 to 100 risk score and a list of issues in a second or two.' },
      { title: 'Negotiate', text: 'Use the explanations and rewrites to push back with confidence.' },
    ],
  },

  analyzer: {
    intro: 'Paste your client contract below. Your first scan is free, and the text never leaves your browser.',
    whatItDoes: [
      'ContractGuard reads the contract your client sent and looks for the clauses that most often cost freelancers money, time or control over their own work. You paste the text in, press one button, and the tool checks it against fourteen common problem areas, from endless revision rounds to payment terms that leave you waiting two months.',
      'When it finds something, it does not just flag it. It shows the exact sentence from your contract, explains in everyday language what that sentence could mean for you, and offers a fairer way to word it that you can copy into an email.',
      'Everything runs inside your browser, so the contract is never uploaded to a server. You get a risk score from 0 to 100 and a short, ordered list of things worth raising before you sign. It is a careful first read, not a replacement for a lawyer when the stakes are high.',
    ],
    howToUse: [
      'Copy the full text of the contract from your email, PDF or Word file. Include the small print at the end, because that is where terms about jurisdiction and renewal often hide.',
      'Paste it into the big text box on this page, or upload a .txt or .docx file and let the tool fill the box for you.',
      'Press Scan Contract. The scan takes a second or two and happens entirely on your device.',
      'Check your Risk Score first. Higher is safer, and anything under about 60 deserves a careful second look before you reply.',
      'Read each flagged card, starting with the red ones, and compare the highlighted sentence with the plain English explanation.',
      'Copy the suggested rewrite for any clause you want to change, paste it into your reply and ask the client to confirm the edit in writing.',
    ],
    whyFreelancers: [
      { type: 'p', text: 'Most freelancers sign what they are sent. There is no legal team on your side, the client is waiting, and the project is exciting. That is exactly when one sentence about ownership or payment timing can quietly cost you thousands.' },
      { type: 'ul', items: [
        'Catch ownership grabs before you hand over work built with your own tools and skills.',
        'Spot payment terms that make you the client\'s unpaid bank for 60 or 90 days.',
        'Avoid being locked out of future clients by broad non-compete or exclusivity wording.',
        'Walk into negotiations with specific wording to ask for, not just a vague bad feeling.',
      ] },
      { type: 'p', text: 'Pushing back is easier when you can point to a particular sentence and offer a calm alternative. Most clients accept reasonable edits, and the ones who refuse tell you something useful about the working relationship ahead.' },
    ],
    faq: [
      { q: 'Is ContractGuard a replacement for a lawyer?', a: 'No. ContractGuard is a reading aid that points out common risky clauses and suggests fairer wording. It is not legal advice. For large projects, long-term deals or anything unusual, have a qualified lawyer review the final contract.' },
      { q: 'Is my contract uploaded or stored anywhere?', a: 'No. The scan runs entirely in your web browser. Your contract text and results are saved only in your own browser storage so a page refresh does not lose them, and you can clear them with the Clear button.' },
      { q: 'What kinds of clauses does the contract reader look for?', a: 'It checks fourteen areas: unlimited revisions, slow payment, intellectual property transfer, work for hire, non-compete, exclusivity, indemnification, missing kill fee, auto-renewal, termination without notice, missing late-payment penalty, endless confidentiality, foreign jurisdiction and vague scope language.' },
      { q: 'How is the Risk Score calculated?', a: 'Every issue found lowers the score from 100. High severity issues reduce it the most, medium issues less, and low issues the least. A contract with no flagged issues scores 100, while one packed with high severity problems scores close to 0.' },
      { q: 'Can I use it for contracts from clients in other countries?', a: 'Yes, the wording patterns are common in international freelance agreements. Keep in mind that the law differs by country, so a clause that is enforceable in one place may not be in another. Check local rules before relying on any suggestion.' },
    ],
  },

  nda: {
    intro: 'Answer a few questions and get a plain-language NDA. Nothing you type leaves your browser.',
    whatItDoes: [
      'This tool builds a plain-language non-disclosure agreement in a few minutes. You fill in who is sharing information, who is receiving it, the purpose of the conversation and how long the secrecy should last, and the agreement writes itself in the preview.',
      'You can choose a one-way NDA, where only one side shares confidential material, or a mutual NDA, where both sides do. The wording is deliberately short and readable, with a clear end date, so nobody ends up bound to secrecy forever.',
      'You can copy the finished text, download it as a file, or print it to PDF and send it for signature.',
    ],
    howToUse: [
      'Pick one-way or mutual, depending on who will be sharing sensitive information.',
      'Enter the full names or business names of both parties and the date the agreement starts.',
      'Describe the purpose in one sentence, such as discussing a website redesign or reviewing a product idea.',
      'Choose how many years the confidentiality should last and which country or state\'s law should apply.',
      'Read the preview carefully and change any detail that does not match your situation.',
      'Copy, download or print the agreement and send it for signature before you share anything confidential.',
    ],
    whyFreelancers: [
      { type: 'p', text: 'Clients and prospects often ask freelancers to sign an NDA before a first call. Having a fair template ready means you can say yes quickly instead of accepting whatever document arrives, which is frequently drafted to protect only the sender.' },
      { type: 'ul', items: [
        'Set a sensible end date instead of an open-ended duty of secrecy.',
        'Protect your own ideas and rates when you are the one sharing.',
        'Look professional by replying with a clean agreement within the hour.',
        'Keep the scope tied to the project so ordinary skills you gain stay yours.',
      ] },
      { type: 'p', text: 'A template cannot cover every situation. Ask a lawyer to review it if the information involved is valuable or if the other party is based in a different country.' },
    ],
  },

  invoice: {
    intro: 'Fill in the details, watch the totals update, then print or save your invoice as a PDF.',
    whatItDoes: [
      'This free invoice generator turns a few details into a clean, professional invoice you can print or save as a PDF. You add your business information, your client\'s information and the work you did, and the tool handles the arithmetic.',
      'It calculates the subtotal, the tax and the total as you type, works out the due date from your payment terms, and adds a late-payment line so clients know what happens when an invoice slips.',
      'Everything is processed in your browser. There is no account to create and nothing is stored on a server.',
    ],
    howToUse: [
      'Enter your name or business name, email and address in the From section.',
      'Add your client\'s details in the Bill To section, along with an invoice number and issue date.',
      'Choose how many days the client has to pay. Fourteen days or less keeps your cash flow healthy.',
      'List each piece of work as a line item with a description, quantity and rate. Add tax if it applies to you.',
      'Add your payment details and any notes, such as bank information or a thank-you message.',
      'Check the preview, then press Print or save as PDF and send it to your client.',
    ],
    whyFreelancers: [
      { type: 'p', text: 'A clear invoice is the quickest route to being paid on time. Vague invoices create questions, and questions create delays. When the amount, due date and payment method are obvious, your client\'s accounts team has nothing to chase you about.' },
      { type: 'ul', items: [
        'Get paid faster with an unmistakable due date and total.',
        'Look established, even if you are a one-person business.',
        'Set expectations on late fees before a payment is ever late.',
        'Keep tidy records for tax time with consistent invoice numbers.',
      ] },
      { type: 'p', text: 'Pair your invoice with a contract that backs it up. If your agreement allows 60-day payment, even a perfect invoice will not make the money arrive sooner, which is why a contract check comes first.' },
    ],
  },

  proposal: {
    intro: 'Describe the project and get a structured proposal with scope, timeline, price and protective terms.',
    whatItDoes: [
      'This tool turns your project details into a polished freelance proposal. You describe the problem you are solving, list the deliverables, set a timeline and price, and the proposal assembles itself into a clear document your client can approve.',
      'Unlike a generic template, it builds protective terms into the proposal itself: a limited number of revision rounds, a deposit, a late-payment fee and payment for work completed if the project is cancelled.',
      'You can copy the text into an email, download it as a file or print it as a PDF. Nothing leaves your browser.',
    ],
    howToUse: [
      'Enter your name, your client\'s name and a short project title.',
      'Write two or three sentences about the problem the client wants solved.',
      'List your deliverables, one per line, so the scope is specific and easy to check.',
      'Set the timeline, the total price, the deposit percentage and how many revision rounds are included.',
      'Review the generated proposal and adjust any wording before you send it.',
      'Copy or download it, send it to the client, and ask them to reply with a written approval.',
    ],
    whyFreelancers: [
      { type: 'p', text: 'A good proposal wins work and prevents arguments. When the deliverables, price and rules are written down before the project starts, there is far less room for the misunderstandings that lead to unpaid extras.' },
      { type: 'ul', items: [
        'Define the scope so extra requests become paid change orders.',
        'Show clients you are organized, which helps justify your price.',
        'Put your own protective terms on the table first.',
        'Save hours by not writing every proposal from a blank page.',
      ] },
      { type: 'p', text: 'When the client replies with their own contract, run it through the ContractGuard reader and compare it with the terms you proposed.' },
    ],
  },

  blog: {
    headline: '7 Contract Clauses That Quietly Cost Freelancers Money',
    description: 'Seven contract clauses that quietly cost freelancers money, explained in plain English with fairer wording to ask for.',
    datePublished: '2026-10-07',
    intro: 'Most contract problems do not look dangerous when you read them. They look like routine legal language, and that is why they work. Here are seven clauses worth stopping on, and what to ask for instead.',
    sections: [
      { h: '1. Unlimited revisions', p: 'If the contract lets the client ask for changes until they are satisfied, the project has no finish line. Ask for a fixed number of revision rounds, usually two, with extra rounds billed at your hourly rate.' },
      { h: '2. Payment after 30, 60 or 90 days', p: 'Long payment terms turn you into a lender. Ask for payment within 7 to 14 days, and for a deposit before work starts, so the project never runs on your own money.' },
      { h: '3. Everything you make belongs to them', p: 'Broad intellectual property and work-for-hire wording can include your templates, tools and drafts. Ask that ownership of the final deliverables transfers only after full payment, and that you keep your pre-existing materials.' },
      { h: '4. Non-compete and exclusivity', p: 'These clauses can block you from working with other clients in your field. Unless the client pays a full-time rate, ask to remove them or limit them to a direct competitor on the same project.' },
      { h: '5. Indemnification', p: 'This can make you responsible for the client\'s legal costs if something goes wrong. Ask to limit it to third-party copyright claims caused by your breach, with your liability capped at the project fee.' },
      { h: '6. Cancellation and termination with no pay', p: 'If the client can cancel instantly and owe nothing, you carry all the risk. Ask for written notice, payment for work completed and a kill fee that covers the time you reserved.' },
      { h: '7. Vague scope and foreign courts', p: 'Phrases like other duties as required let the work grow forever, and a distant court makes it too expensive to chase unpaid invoices. List deliverables exactly and choose a jurisdiction you can actually reach.' },
    ],
    outro: 'You do not need to be a lawyer to spot these. Paste your next contract into the ContractGuard reader and it will point to the exact sentences, explain them and give you fairer wording to send back. This article is general information, not legal advice.',
  },
};