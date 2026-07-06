import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const releaseDate = "July 6, 2026";
const finalVersion = "v4.1.9";
const finalBadge = "v4.1.9 waitlist";

const versions = [
  {
    version: "v4.1.5",
    label: "Citation Deep Link Layer",
    short: "deep links",
    page: "citationdeeplinklayer.html",
    nav: "Links",
    bodyClass: "citation-deep-link-layer-page",
    kind: "links",
    dataFile: "data/vedapath-citation-deep-link-layer.json",
    doc: "docs/CITATION_DEEP_LINK_LAYER.md",
    phase: 375,
    summary: "Citation Deep Link Layer gives each learner-visible source card a stable citation anchor, copyable reference packet, and passage navigation posture."
  },
  {
    version: "v4.1.6",
    label: "Source Edition and Rights Matrix",
    short: "rights",
    page: "sourceeditionrightsmatrix.html",
    nav: "Rights",
    bodyClass: "source-edition-rights-matrix-page",
    kind: "rights",
    dataFile: "data/vedapath-source-edition-rights-matrix.json",
    doc: "docs/SOURCE_EDITION_RIGHTS_MATRIX.md",
    phase: 376,
    summary: "Source Edition and Rights Matrix separates public-domain, licensed, excerpt-only, and blocked source use before any public pilot answer expands."
  },
  {
    version: "v4.1.7",
    label: "Reviewer Decision History",
    short: "history",
    page: "reviewerdecisionhistory.html",
    nav: "History",
    bodyClass: "reviewer-decision-history-page",
    kind: "history",
    dataFile: "data/vedapath-reviewer-decision-history.json",
    doc: "docs/REVIEWER_DECISION_HISTORY.md",
    phase: 377,
    summary: "Reviewer Decision History turns source review outcomes into a visible local audit trail instead of silent knowledge rewrites."
  },
  {
    version: "v4.1.8",
    label: "Retrieval Scoring Explanation",
    short: "score",
    page: "retrievalscoringexplanation.html",
    nav: "Score",
    bodyClass: "retrieval-scoring-explanation-page",
    kind: "score",
    dataFile: "data/vedapath-retrieval-scoring-explanation.json",
    doc: "docs/RETRIEVAL_SCORING_EXPLANATION.md",
    phase: 378,
    summary: "Retrieval Scoring Explanation shows why a source candidate ranks higher or lower through fit, citation quality, rights, and boundary scores."
  },
  {
    version: "v4.1.9",
    label: "Public Pilot Waitlist Gate",
    short: "waitlist",
    page: "publicpilotwaitlistgate.html",
    nav: "Waitlist",
    bodyClass: "public-pilot-waitlist-gate-page",
    kind: "waitlist",
    dataFile: "data/vedapath-public-pilot-waitlist-gate.json",
    doc: "docs/PUBLIC_PILOT_WAITLIST_GATE.md",
    phase: 379,
    summary: "Public Pilot Waitlist Gate creates a privacy-light pilot entry path with local interest capture, eligibility boundaries, and no account or payment promises."
  }
];

const navCore = [
  ["Home", "index.html"],
  ["Build", "build-status.html"],
  ["Brand", "brand/brand-board.html"],
  ["Blueprint", "blueprint.html"],
  ["Answers", "citedanswerlab.html"],
  ["Review", "reviewqueuepersistence.html"],
  ["Mantra", "mantralenslab.html"],
  ["Life", "lifecompanionlab.html"],
  ["Talk", "conversationcompanionlab.html"],
  ["Pattern", "patterncompanionlab.html"],
  ["Daily", "daily.html"],
  ["Packet", "answerpacketpilot.html"],
  ["Launch", "launchreadinesshub.html"],
  ["Pilot", "productionretrievalpilotgate.html"],
  ["Records", "verifiedsourcerecordschema.html"],
  ["Desk", "retrievalreviewerdesk.html"],
  ["QA Pack", "first25sourceqapack.html"],
  ["Ask Flow", "learneraskflow.html"],
  ["Links", "citationdeeplinklayer.html"],
  ["Rights", "sourceeditionrightsmatrix.html"],
  ["History", "reviewerdecisionhistory.html"],
  ["Score", "retrievalscoringexplanation.html"],
  ["Waitlist", "publicpilotwaitlistgate.html"]
];

const sourceRecords = [
  {
    id: "bg-2-48-steadiness",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 2.48",
    title: "Steadiness in action",
    status: "ready",
    confidence: "high",
    rights: "excerpt-only",
    linkId: "source:bg:2:48",
    passageAnchor: "bhagavad-gita-2-48",
    allowedUse: "Use for calm path, practice, and learner action cards.",
    boundary: "Reflection support only, not therapy, diagnosis, or ritual instruction.",
    summary: "The source candidate supports steadiness while acting, with caution about clinging to results.",
    missingFields: ["licensed translation"]
  },
  {
    id: "bg-11-32-time",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 11.32",
    title: "Time and destruction",
    status: "ready",
    confidence: "high",
    rights: "excerpt-only",
    linkId: "source:bg:11:32",
    passageAnchor: "bhagavad-gita-11-32",
    allowedUse: "Use for Oppenheimer-source clarification and category correction.",
    boundary: "Do not call it a direct Vedic quote or a four-Veda passage.",
    summary: "This is the commonly cited source family behind the Oppenheimer line in popular culture.",
    missingFields: ["translation variant notes"]
  },
  {
    id: "bg-17-15-speech",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 17.15",
    title: "Disciplined speech",
    status: "ready",
    confidence: "high",
    rights: "excerpt-only",
    linkId: "source:bg:17:15",
    passageAnchor: "bhagavad-gita-17-15",
    allowedUse: "Use for speech-before-reply drafts and conversation companion.",
    boundary: "Do not make the app an authority over personal relationships.",
    summary: "The passage supports truthful, gentle, beneficial speech as a practice discipline.",
    missingFields: ["licensed translation"]
  },
  {
    id: "isha-1-stewardship",
    family: "Isha Upanishad | Upanishad",
    citation: "Isha Upanishad 1",
    title: "Stewardship and restraint",
    status: "review",
    confidence: "medium",
    rights: "edition-needed",
    linkId: "source:isha:1",
    passageAnchor: "isha-upanishad-1",
    allowedUse: "Use for restraint, ownership, and simplicity reflections after edition review.",
    boundary: "Do not use it as a proof text for modern economic claims.",
    summary: "The opening passage is often read around restraint, belonging, and sacred presence.",
    missingFields: ["translation comparison", "edition note"]
  },
  {
    id: "katha-1-2-23-self",
    family: "Katha Upanishad | Upanishad",
    citation: "Katha Upanishad 1.2.23",
    title: "Self knowledge boundary",
    status: "review",
    confidence: "medium",
    rights: "edition-needed",
    linkId: "source:katha:1:2:23",
    passageAnchor: "katha-upanishad-1-2-23",
    allowedUse: "Use as a source candidate for humility around knowledge after review.",
    boundary: "Do not turn this into mystical certainty or guru authority.",
    summary: "The passage is commonly associated with limits of mere instruction or intellect in realizing the Self.",
    missingFields: ["exact translation review", "commentary comparison"]
  }
];

const pageData = {
  links: {
    headline: "Every source card needs a path back to the passage.",
    copy: "The link layer keeps citation, family, anchor, status, rights posture, and boundary together so learners can inspect where an answer is standing.",
    boundary: "Deep links are prototype anchors until verified editions and passage rights are approved.",
    metrics: [
      { label: "Anchors", value: "5" },
      { label: "Ready links", value: "3" },
      { label: "Review links", value: "2" },
      { label: "Authority", value: "Prototype" }
    ],
    records: sourceRecords,
    linkRules: [
      { title: "Stable anchor", copy: "Use a human-readable citation anchor that can survive UI changes." },
      { title: "Visible category", copy: "Show source family beside every link so Gita, Veda, Upanishad, and commentary do not blur." },
      { title: "Copyable packet", copy: "Let reviewers copy link id, citation, family, status, rights, and boundary in one move." }
    ]
  },
  rights: {
    headline: "A source can be true and still not public-pilot ready.",
    copy: "The rights matrix separates public-domain references, excerpt-only use, licensed translation needs, and blocked use before the learner-facing answer expands.",
    boundary: "This is a product-rights readiness model, not legal advice. Final use needs source edition review.",
    metrics: [
      { label: "Source lanes", value: "4" },
      { label: "Approved demo", value: "3" },
      { label: "Needs edition", value: "2" },
      { label: "Blocked", value: "0" }
    ],
    lanes: [
      { lane: "Citation metadata", status: "Allowed", use: "Always show citation, source family, status, and boundary." },
      { lane: "Short excerpt", status: "Conditional", use: "Use only when edition/translation posture is clear." },
      { lane: "Full translation", status: "Blocked", use: "Do not publish until licensed or public-domain edition is chosen." },
      { lane: "Commentary summary", status: "Review", use: "Allow only reviewed summaries with school/context labels." }
    ],
    records: sourceRecords,
    checklist: [
      "Record edition name or source owner.",
      "Keep source family visible before answer confidence.",
      "Never hide missing rights fields behind a high confidence answer.",
      "Route unknown rights to reviewer history, not to public pilot."
    ]
  },
  history: {
    headline: "Review decisions should leave a trail.",
    copy: "This page models local review memory: decisions are visible, filterable, and copyable before any production review service exists.",
    boundary: "Browser-local review history is a prototype. Production needs identity, immutable audit, and reviewer permissions.",
    metrics: [
      { label: "Seed decisions", value: "4" },
      { label: "Local writes", value: "Browser" },
      { label: "Export", value: "Copy" },
      { label: "Production", value: "Closed" }
    ],
    decisions: [
      { id: "review-bg-2-48", status: "accepted", owner: "Source reviewer", citation: "Bhagavad Gita 2.48", decision: "Ready for calm/practice source card.", risk: "Do not make therapy claims.", next: "Attach rights note." },
      { id: "review-bg-11-32", status: "accepted", owner: "Claim reviewer", citation: "Bhagavad Gita 11.32", decision: "Ready for Oppenheimer correction.", risk: "Do not call it direct Veda.", next: "Add variant note." },
      { id: "review-isha-1", status: "needs-edition", owner: "Rights reviewer", citation: "Isha Upanishad 1", decision: "Hold public excerpt until edition chosen.", risk: "Translation rights unclear.", next: "Select edition." },
      { id: "review-katha-1-2-23", status: "needs-commentary", owner: "Scholar reviewer", citation: "Katha Upanishad 1.2.23", decision: "Use only for humility boundary after commentary review.", risk: "Mystical authority overreach.", next: "Add school context." }
    ],
    filters: ["all", "accepted", "needs-edition", "needs-commentary"]
  },
  score: {
    headline: "Ranking should be explainable before it feels intelligent.",
    copy: "The scoring explanation decomposes a source candidate into match fit, citation completeness, rights readiness, boundary clarity, and reviewer status.",
    boundary: "Scores are transparent prototype heuristics. They are not truth, authority, or final scholarly judgment.",
    metrics: [
      { label: "Candidates", value: "4" },
      { label: "Score factors", value: "5" },
      { label: "Top score", value: "89" },
      { label: "Blocked answers", value: "0" }
    ],
    query: "How can I act calmly when results are uncertain?",
    candidates: [
      {
        id: "score-bg-2-48",
        title: "Steadiness in action",
        citation: "Bhagavad Gita 2.48",
        family: "Bhagavad Gita | Smriti",
        score: 89,
        decision: "Use as primary source card.",
        factors: [
          { label: "Query fit", value: 94 },
          { label: "Citation complete", value: 92 },
          { label: "Rights readiness", value: 78 },
          { label: "Boundary clarity", value: 91 },
          { label: "Reviewer status", value: 90 }
        ]
      },
      {
        id: "score-bg-3-19",
        title: "Duty without attachment",
        citation: "Bhagavad Gita 3.19",
        family: "Bhagavad Gita | Smriti",
        score: 82,
        decision: "Use as secondary support.",
        factors: [
          { label: "Query fit", value: 84 },
          { label: "Citation complete", value: 88 },
          { label: "Rights readiness", value: 76 },
          { label: "Boundary clarity", value: 82 },
          { label: "Reviewer status", value: 80 }
        ]
      },
      {
        id: "score-isha-1",
        title: "Stewardship and restraint",
        citation: "Isha Upanishad 1",
        family: "Isha Upanishad | Upanishad",
        score: 71,
        decision: "Hold as deeper layer until edition review.",
        factors: [
          { label: "Query fit", value: 74 },
          { label: "Citation complete", value: 78 },
          { label: "Rights readiness", value: 48 },
          { label: "Boundary clarity", value: 76 },
          { label: "Reviewer status", value: 68 }
        ]
      },
      {
        id: "score-bg-11-32",
        title: "Time and destruction",
        citation: "Bhagavad Gita 11.32",
        family: "Bhagavad Gita | Smriti",
        score: 42,
        decision: "Do not use for this calm-action query.",
        factors: [
          { label: "Query fit", value: 28 },
          { label: "Citation complete", value: 95 },
          { label: "Rights readiness", value: 78 },
          { label: "Boundary clarity", value: 92 },
          { label: "Reviewer status", value: 86 }
        ]
      }
    ]
  },
  waitlist: {
    headline: "Invite the public carefully, not loudly.",
    copy: "The waitlist gate lets VedaPath collect pilot interest locally while keeping the product boundary honest: no accounts, no payments, no promise of production access.",
    boundary: "This is browser-local interest capture only. Production waitlist needs consent, privacy notice, export controls, and account security.",
    metrics: [
      { label: "Pilot lanes", value: "4" },
      { label: "Local entries", value: "Browser" },
      { label: "Accounts", value: "Off" },
      { label: "Payments", value: "Off" }
    ],
    segments: [
      { id: "learner", label: "Curious learner", need: "Ask simple source-backed questions without feeling judged." },
      { id: "teacher", label: "Teacher or guide", need: "Show source category and boundaries clearly." },
      { id: "reviewer", label: "Reviewer or scholar", need: "Inspect citations, rights, and answer restraint." },
      { id: "founder", label: "Founder pilot", need: "Validate demand and trust posture before backend build." }
    ],
    gates: [
      { title: "No live authority", copy: "Pilot copy must say prototype and source-backed, not guru or final answer." },
      { title: "No hidden storage", copy: "Local browser memory stays visible and clearable." },
      { title: "No payment pressure", copy: "Public pilot interest comes before monetization." },
      { title: "Reviewer route", copy: "Serious source issues become review tickets before public use." }
    ]
  }
};

mkdirSync("data", { recursive: true });
mkdirSync("docs", { recursive: true });
mkdirSync("assets", { recursive: true });

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, text) {
  writeFileSync(file, text.replace(/\r?\n/g, "\n"), "utf8");
}

function navHtml(activeLabel, prefix = "") {
  const links = navCore.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${prefix}${href}">${label}</a>`;
  }).join("\n");
  return `${links}\n        <span class="version-pill">${finalBadge}</span>`;
}

function pageTemplate(item) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${item.label} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-trust-launch.css" />
</head>
<body class="${item.bodyClass} trust-launch-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${item.short}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(item.nav)}
      </nav>
    </header>

    <section class="tl-opening">
      <div>
        <p class="tl-eyebrow">${item.version} ${item.short}</p>
        <h1>${item.label}</h1>
        <p>${item.summary}</p>
      </div>
      <aside class="tl-opening-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>Trust before scale.</strong>
        <span>Simple, visible, reviewable.</span>
      </aside>
    </section>

    <section class="tl-app" data-trust-launch-app data-kind="${item.kind}" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-trust-launch.js"></script>
</body>
</html>
`;
}

function docTemplate(item) {
  return `# ${item.label}

Release: ${item.version}
Date: ${releaseDate}

## Purpose
${item.summary}

## Product Rule
This room is part of the trust-launch layer. It makes the retrieval pilot easier to inspect without granting live AI authority, production source authority, storage authority, or public launch permission.

## User Value
- Keeps the source path visible.
- Keeps rights and review status visible.
- Keeps the learner journey calm and simple.
- Gives the founder a concrete next decision instead of a vague roadmap.

## Known Risks
- Data is still prototype seed data.
- Source edition and licensed translation review remain required.
- Local browser memory is useful for demos but not production audit storage.
`;
}

function writeDataAndPages() {
  for (const item of versions) {
    write(item.page, pageTemplate(item));
    write(item.dataFile, JSON.stringify(pageData[item.kind], null, 2));
    write(item.doc, docTemplate(item));
  }
}

function writeAssets() {
  write("assets/vedapath-trust-launch.css", `:root {
  --tl-bg: rgba(255, 253, 248, 0.76);
  --tl-panel: rgba(255, 255, 255, 0.72);
  --tl-panel-strong: rgba(255, 255, 255, 0.9);
  --tl-line: rgba(91, 70, 56, 0.16);
  --tl-ink: #201713;
  --tl-muted: #65483a;
  --tl-bhagwa: #d65a1f;
  --tl-ochre: #a83e12;
  --tl-gold: #e0a83b;
  --tl-green: #145c4a;
  --tl-calm: #e7f1ec;
}

.trust-launch-surface {
  background:
    linear-gradient(rgba(255, 255, 255, 0.72) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.72) 1px, transparent 1px),
    radial-gradient(circle at 80% 12%, rgba(224, 168, 59, 0.11), transparent 30%),
    #fff8ed;
  background-size: 18px 18px, 18px 18px, auto, auto;
}

.trust-launch-surface .workspace {
  width: min(1320px, calc(100% - 28px));
}

.tl-opening {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 18px;
  align-items: center;
  padding: 34px 0 28px;
  border-bottom: 1px solid var(--tl-line);
}

.tl-opening h1 {
  max-width: 860px;
  margin: 10px 0;
  font-size: clamp(30px, 4.2vw, 50px);
  line-height: 1.04;
  letter-spacing: 0;
}

.tl-opening p {
  max-width: 780px;
  color: var(--tl-muted);
  font-size: 16px;
}

.tl-opening-card,
.tl-card,
.tl-panel,
.tl-step,
.tl-field,
.tl-table,
.tl-segment {
  border: 1px solid var(--tl-line);
  border-radius: 8px;
  background: var(--tl-panel);
  box-shadow: 0 18px 52px rgba(48, 31, 19, 0.055);
}

.tl-opening-card {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.tl-opening-card img,
.tl-logo-mini {
  width: 82px;
  height: 82px;
  border-radius: 8px;
  object-fit: cover;
}

.tl-opening-card span,
.tl-muted {
  color: var(--tl-muted);
}

.tl-app {
  padding-top: 18px;
}

.tl-grid {
  display: grid;
  grid-template-columns: minmax(190px, 0.48fr) minmax(0, 1.75fr) minmax(230px, 0.58fr);
  gap: 14px;
  align-items: start;
}

.tl-main,
.tl-stack,
.tl-list,
.tl-actions {
  display: grid;
  gap: 12px;
}

.tl-card,
.tl-panel {
  padding: 16px;
}

.tl-card h2,
.tl-panel h2 {
  margin: 8px 0 8px;
  font-size: clamp(22px, 2.3vw, 30px);
  line-height: 1.08;
}

.tl-card h3,
.tl-panel h3,
.tl-step h3 {
  margin: 6px 0;
  font-size: 17px;
  line-height: 1.16;
}

.tl-card p,
.tl-panel p,
.tl-step p,
.tl-field p {
  color: var(--tl-muted);
}

.tl-eyebrow,
.tl-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  border: 1px solid rgba(214, 90, 31, 0.22);
  border-radius: 999px;
  padding: 3px 9px;
  background: rgba(253, 232, 221, 0.72);
  color: var(--tl-ochre);
  font-size: 12px;
  font-weight: 900;
}

.tl-eyebrow.green,
.tl-chip.ready,
.tl-chip.accepted,
.tl-chip.allowed {
  border-color: rgba(20, 92, 74, 0.22);
  background: rgba(231, 241, 236, 0.88);
  color: var(--tl-green);
}

.tl-chip.review,
.tl-chip.conditional,
.tl-chip.needs-edition,
.tl-chip.needs-commentary {
  border-color: rgba(224, 168, 59, 0.38);
  background: rgba(255, 244, 215, 0.88);
  color: #765013;
}

.tl-chip.blocked {
  border-color: rgba(168, 62, 18, 0.28);
  background: rgba(255, 229, 218, 0.92);
  color: var(--tl-ochre);
}

.tl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 1px solid rgba(168, 62, 18, 0.24);
  border-radius: 8px;
  background: var(--tl-panel-strong);
  color: var(--tl-ochre);
  padding: 8px 12px;
  font: inherit;
  font-weight: 900;
  text-align: left;
  cursor: pointer;
}

.tl-button.is-active,
.tl-button.primary {
  border-color: var(--tl-bhagwa);
  background: var(--tl-bhagwa);
  color: white;
}

.tl-button.green {
  border-color: rgba(20, 92, 74, 0.28);
  color: var(--tl-green);
}

.tl-record,
.tl-table-row,
.tl-score-card {
  border-left: 3px solid var(--tl-bhagwa);
}

.tl-metrics,
.tl-fields,
.tl-score-grid,
.tl-segment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.tl-field {
  min-height: 76px;
  padding: 12px;
}

.tl-field span {
  display: block;
  color: var(--tl-muted);
  font-size: 12px;
}

.tl-field strong {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  line-height: 1.04;
  overflow-wrap: anywhere;
}

.tl-table {
  overflow: hidden;
}

.tl-table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 0.7fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--tl-line);
}

.tl-table-row:last-child {
  border-bottom: 0;
}

.tl-table-head {
  border-left: 0;
  background: rgba(231, 241, 236, 0.38);
  color: var(--tl-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.tl-progress {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(168, 62, 18, 0.14);
}

.tl-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--tl-bhagwa), var(--tl-gold));
}

.tl-score-factor {
  display: grid;
  gap: 5px;
}

.tl-textarea,
.tl-input,
.tl-select {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(214, 90, 31, 0.24);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.88);
  color: var(--tl-ink);
  padding: 10px;
  font: inherit;
}

.tl-textarea {
  min-height: 126px;
  resize: vertical;
}

.tl-number {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--tl-calm);
  color: var(--tl-green);
  font-size: 13px;
  font-weight: 900;
}

.tl-empty {
  padding: 18px;
  border: 1px dashed rgba(168, 62, 18, 0.28);
  border-radius: 8px;
  color: var(--tl-muted);
}

@media (max-width: 1080px) {
  .tl-grid {
    grid-template-columns: 1fr;
  }

  .tl-panel {
    position: static;
  }
}

@media (max-width: 760px) {
  .tl-opening {
    grid-template-columns: 1fr;
  }

  .tl-opening-card {
    justify-items: start;
    text-align: left;
  }

  .tl-metrics,
  .tl-fields,
  .tl-score-grid,
  .tl-segment-grid,
  .tl-table-row {
    grid-template-columns: 1fr;
  }
}
`);

  write("assets/vedapath-trust-launch.js", `(function () {
  const app = document.querySelector("[data-trust-launch-app]");
  if (!app) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function chip(value) {
    return '<span class="tl-chip ' + slug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="tl-metrics">' + metrics.map(function (metric) {
      return '<div class="tl-field"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="tl-grid"><aside class="tl-panel">' + left + '</aside><main class="tl-main">' + main + '</main><aside class="tl-panel">' + side + '</aside></section>';
  }

  function recordPacket(record) {
    return [
      "VedaPath Citation Packet",
      "Link id: " + record.linkId,
      "Citation: " + record.citation,
      "Family: " + record.family,
      "Anchor: #" + record.passageAnchor,
      "Status: " + record.status,
      "Rights: " + record.rights,
      "Boundary: " + record.boundary
    ].join("\\n");
  }

  function renderRecord(record) {
    return '<article class="tl-card tl-record" id="' + escapeHtml(record.passageAnchor || record.id) + '">' +
      chip(record.status) + '<h3>' + escapeHtml(record.title) + '</h3>' +
      '<p><strong>' + escapeHtml(record.citation) + '</strong> | ' + escapeHtml(record.family) + '</p>' +
      '<p>' + escapeHtml(record.summary) + '</p>' +
      '<div class="tl-fields"><div class="tl-field"><span>Link id</span><strong>' + escapeHtml(record.linkId || record.id) + '</strong></div>' +
      '<div class="tl-field"><span>Rights</span><strong>' + escapeHtml(record.rights || "unknown") + '</strong></div>' +
      '<div class="tl-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence || "unknown") + '</strong></div>' +
      '<div class="tl-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary || "Do not overclaim.") + '</strong></div></div>' +
    '</article>';
  }

  function renderLinks(data) {
    let selectedId = data.records[0].id;
    function selected() {
      return data.records.find(function (record) { return record.id === selectedId; }) || data.records[0];
    }
    function paint() {
      const record = selected();
      const left = '<span class="tl-eyebrow">Citation anchors</span><h2>Pick a source</h2><div class="tl-list">' +
        data.records.map(function (item) {
          return '<button class="tl-button' + (item.id === selectedId ? " is-active" : "") + '" data-record="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Deep link layer</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        renderRecord(record) +
        '<article class="tl-card"><span class="tl-eyebrow">Copyable packet</span><textarea class="tl-textarea" readonly>' + escapeHtml(recordPacket(record)) + '</textarea><div class="tl-actions"><button class="tl-button primary" data-copy type="button">Copy Citation Packet</button><a class="tl-button green" href="#' + escapeHtml(record.passageAnchor) + '">Jump To Anchor</a></div></article>';
      const side = '<span class="tl-eyebrow green">Rules</span><h2>Link discipline</h2><div class="tl-stack">' +
        data.linkRules.map(function (rule, index) {
          return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
        }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-record]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-record");
          paint();
        });
      });
    }
    paint();
  }

  function renderRights(data) {
    const left = '<span class="tl-eyebrow">Rights lanes</span><h2>Before public use</h2><div class="tl-list">' +
      data.lanes.map(function (lane) {
        return '<article class="tl-step">' + chip(lane.status) + '<h3>' + escapeHtml(lane.lane) + '</h3><p>' + escapeHtml(lane.use) + '</p></article>';
      }).join("") + '</div>';
    const rows = data.records.map(function (record) {
      return '<div class="tl-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.rights) + '</span><span>' + escapeHtml((record.missingFields || []).join(", ") || "None") + '</span></div>';
    }).join("");
    const main = '<article class="tl-card"><span class="tl-eyebrow green">Rights matrix</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
      '<div class="tl-table"><div class="tl-table-row tl-table-head"><span>Citation</span><span>Family</span><span>Rights</span><span>Missing</span></div>' + rows + '</div>';
    const side = '<span class="tl-eyebrow green">Checklist</span><h2>Release discipline</h2><div class="tl-stack">' +
      data.checklist.map(function (item, index) {
        return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
    renderShell(left, main, side);
  }

  function renderHistory(data) {
    const storageKey = "vedapathReviewerDecisionHistoryV417";
    const local = JSON.parse(localStorage.getItem(storageKey) || "[]");
    let filter = "all";
    function entries() {
      const all = data.decisions.concat(local);
      return filter === "all" ? all : all.filter(function (item) { return item.status === filter; });
    }
    function exportText(items) {
      return items.map(function (item) {
        return [item.id, item.status, item.owner, item.citation, item.decision, item.risk, item.next].join(" | ");
      }).join("\\n");
    }
    function paint() {
      const items = entries();
      const left = '<span class="tl-eyebrow">Decision filters</span><h2>Review trail</h2><div class="tl-list">' +
        data.filters.map(function (item) {
          return '<button class="tl-button' + (item === filter ? " is-active" : "") + '" data-filter="' + escapeHtml(item) + '" type="button">' + escapeHtml(item) + '</button>';
        }).join("") + '</div><button class="tl-button green" data-add-local type="button">Add Local Review Note</button>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Reviewer memory</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<div class="tl-stack">' + items.map(function (item) {
          return '<article class="tl-card tl-record">' + chip(item.status) + '<h3>' + escapeHtml(item.citation) + '</h3><p><strong>' + escapeHtml(item.owner) + '</strong> | ' + escapeHtml(item.decision) + '</p><p>Risk: ' + escapeHtml(item.risk) + '</p><p>Next: ' + escapeHtml(item.next) + '</p></article>';
        }).join("") + '</div>';
      const side = '<span class="tl-eyebrow green">Export</span><h2>Visible audit</h2><textarea class="tl-textarea" readonly>' + escapeHtml(exportText(items)) + '</textarea><div class="tl-actions"><button class="tl-button primary" data-copy type="button">Copy History</button></div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          filter = button.getAttribute("data-filter");
          paint();
        });
      });
      app.querySelector("[data-add-local]")?.addEventListener("click", function () {
        const next = {
          id: "local-review-" + Date.now(),
          status: "needs-edition",
          owner: "Local reviewer",
          citation: "Bhagavad Gita 2.48",
          decision: "Add source edition note before pilot use.",
          risk: "Rights posture incomplete.",
          next: "Review edition field."
        };
        localStorage.setItem(storageKey, JSON.stringify([next].concat(local).slice(0, 8)));
        paint();
      });
    }
    paint();
  }

  function renderScore(data) {
    let selectedId = data.candidates[0].id;
    function selected() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function factorHtml(candidate) {
      return '<div class="tl-score-grid">' + candidate.factors.map(function (factor) {
        return '<div class="tl-field tl-score-factor"><span>' + escapeHtml(factor.label) + '</span><strong>' + escapeHtml(factor.value) + '</strong><div class="tl-progress"><span style="width:' + Math.max(0, Math.min(100, factor.value)) + '%"></span></div></div>';
      }).join("") + '</div>';
    }
    function paint() {
      const candidate = selected();
      const left = '<span class="tl-eyebrow">Candidate rank</span><h2>Query</h2><p>' + escapeHtml(data.query) + '</p><div class="tl-list">' +
        data.candidates.map(function (item) {
          return '<button class="tl-button' + (item.id === selectedId ? " is-active" : "") + '" data-score="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + ' | ' + escapeHtml(item.score) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Score explanation</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="tl-card tl-score-card"><h2>' + escapeHtml(candidate.title) + '</h2><p><strong>' + escapeHtml(candidate.citation) + '</strong> | ' + escapeHtml(candidate.family) + '</p><div class="tl-fields"><div class="tl-field"><span>Total score</span><strong>' + escapeHtml(candidate.score) + '</strong></div><div class="tl-field"><span>Decision</span><strong>' + escapeHtml(candidate.decision) + '</strong></div></div>' + factorHtml(candidate) + '</article>';
      const side = '<span class="tl-eyebrow green">Boundary</span><h2>Score is not truth</h2><p>' + escapeHtml(data.boundary) + '</p><article class="tl-card"><h3>Next</h3><p>Use this explanation beside learner answers before live retrieval ranking exists.</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-score]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-score");
          paint();
        });
      });
    }
    paint();
  }

  function renderWaitlist(data) {
    const storageKey = "vedapathPublicPilotWaitlistV419";
    let selected = data.segments[0].id;
    function saved() {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
    function selectedSegment() {
      return data.segments.find(function (item) { return item.id === selected; }) || data.segments[0];
    }
    function paint() {
      const entries = saved();
      const segment = selectedSegment();
      const left = '<span class="tl-eyebrow">Pilot fit</span><h2>Choose a lane</h2><div class="tl-list">' +
        data.segments.map(function (item) {
          return '<button class="tl-button' + (item.id === selected ? " is-active" : "") + '" data-segment="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Waitlist gate</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="tl-card"><h2>' + escapeHtml(segment.label) + '</h2><p>' + escapeHtml(segment.need) + '</p><label><span class="tl-muted">One line about your pilot need</span><textarea class="tl-textarea" data-wait-note>I want VedaPath to help me ask one source-first question calmly.</textarea></label><div class="tl-actions"><button class="tl-button primary" data-save-waitlist type="button">Save Local Interest</button><button class="tl-button green" data-copy-packet type="button">Copy Pilot Packet</button></div></article>' +
        '<article class="tl-card"><span class="tl-eyebrow">Local preview</span><h2>' + entries.length + ' saved interest note' + (entries.length === 1 ? "" : "s") + '</h2><p>' + (entries[0] ? escapeHtml(entries[0].segment + " | " + entries[0].note) : "No local pilot interest saved yet.") + '</p></article>';
      const side = '<span class="tl-eyebrow green">Entry rules</span><h2>Public pilot boundary</h2><div class="tl-stack">' +
        data.gates.map(function (gate, index) {
          return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><h3>' + escapeHtml(gate.title) + '</h3><p>' + escapeHtml(gate.copy) + '</p></article>';
        }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-segment]").forEach(function (button) {
        button.addEventListener("click", function () {
          selected = button.getAttribute("data-segment");
          paint();
        });
      });
      app.querySelector("[data-save-waitlist]")?.addEventListener("click", function () {
        const note = app.querySelector("[data-wait-note]")?.value || "";
        const next = { segment: selectedSegment().label, note: note, date: new Date().toISOString() };
        localStorage.setItem(storageKey, JSON.stringify([next].concat(entries).slice(0, 5)));
        paint();
      });
      app.querySelector("[data-copy-packet]")?.addEventListener("click", function () {
        const note = app.querySelector("[data-wait-note]")?.value || "";
        const packet = "VedaPath Public Pilot Interest\\nSegment: " + selectedSegment().label + "\\nNeed: " + selectedSegment().need + "\\nNote: " + note + "\\nBoundary: " + data.boundary;
        navigator.clipboard?.writeText(packet);
      });
    }
    paint();
  }

  const renderers = {
    links: renderLinks,
    rights: renderRights,
    history: renderHistory,
    score: renderScore,
    waitlist: renderWaitlist
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load page data");
      return response.json();
    })
    .then(function (data) {
      const renderer = renderers[app.getAttribute("data-kind")];
      if (!renderer) throw new Error("Unknown trust launch surface");
      renderer(data);
      app.addEventListener("click", function (event) {
        if (!event.target.matches("[data-copy]")) return;
        const text = app.querySelector("textarea")?.value || "";
        navigator.clipboard?.writeText(text);
      });
    })
    .catch(function (error) {
      app.innerHTML = '<div class="tl-empty">Unable to load this trust launch surface: ' + escapeHtml(error.message) + '</div>';
    });
})();
`);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  text = text.replace(
    `{ title: "Retrieval", labels: ["Pilot", "Records", "Desk", "QA Pack", "Ask Flow"] }`,
    `{ title: "Retrieval", labels: ["Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist"] }`
  );
  text = text.replace(
    `"Ask Flow": "Learner Ask Flow"`,
    `"Ask Flow": "Learner Ask Flow",
    "Links": "Citation Deep Link Layer",
    "Rights": "Source Edition and Rights Matrix",
    "History": "Reviewer Decision History",
    "Score": "Retrieval Scoring Explanation",
    "Waitlist": "Public Pilot Waitlist Gate"`
  );
  text = text.replace(
    `"learner-ask-flow-page": "Learner Ask Flow"`,
    `"learner-ask-flow-page": "Learner Ask Flow",
    "citation-deep-link-layer-page": "Citation Deep Link Layer",
    "source-edition-rights-matrix-page": "Source Edition and Rights Matrix",
    "reviewer-decision-history-page": "Reviewer Decision History",
    "retrieval-scoring-explanation-page": "Retrieval Scoring Explanation",
    "public-pilot-waitlist-gate-page": "Public Pilot Waitlist Gate"`
  );
  write("assets/vedapath-command-shell.js", text);
}

function updateNavInFile(file, activeLabel, prefix = "") {
  if (!readable(file)) return;
  let text = read(file);
  if (!text.includes('class="navlinks nav"')) return;
  if (!text.includes("publicpilotwaitlistgate.html")) {
    text = text.replace(/(\s*)<span class="version-pill">[^<]+<\/span>/, "\n" + navCore.slice(18).map(([label, href]) => {
      const active = label === activeLabel ? " active" : "";
      return `        <a class="link${active}" href="${prefix}${href}">${label}</a>`;
    }).join("\n") + '$1<span class="version-pill">' + finalBadge + '</span>');
  } else {
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  }
  write(file, text);
}

function readable(file) {
  try {
    readFileSync(file, "utf8");
    return true;
  } catch {
    return false;
  }
}

function updateCoreNav() {
  const coreFiles = [
    ["index.html", "Home", ""],
    ["build-status.html", "Build", ""],
    ["blueprint.html", "Blueprint", ""],
    ["citedanswerlab.html", "Answers", ""],
    ["reviewqueuepersistence.html", "Review", ""],
    ["mantralenslab.html", "Mantra", ""],
    ["lifecompanionlab.html", "Life", ""],
    ["conversationcompanionlab.html", "Talk", ""],
    ["patterncompanionlab.html", "Pattern", ""],
    ["daily.html", "Daily", ""],
    ["answerpacketpilot.html", "Packet", ""],
    ["launchreadinesshub.html", "Launch", ""],
    ["productionretrievalpilotgate.html", "Pilot", ""],
    ["verifiedsourcerecordschema.html", "Records", ""],
    ["retrievalreviewerdesk.html", "Desk", ""],
    ["first25sourceqapack.html", "QA Pack", ""],
    ["learneraskflow.html", "Ask Flow", ""],
    ["brand/brand-board.html", "Brand", "../"]
  ];
  for (const [file, active, prefix] of coreFiles) {
    updateNavInFile(file, active, prefix);
  }
}

function updateStaticChecks() {
  let text = read("scripts/check-static-links.mjs");
  const insert = versions.map((item) => `  "${item.page}"`).join(",\n");
  if (!text.includes("publicpilotwaitlistgate.html")) {
    text = text.replace('  "learneraskflow.html"', '  "learneraskflow.html",\n' + insert);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/v4\.1\.4 ask flow/g, finalBadge);
  text = text.replace(/v4\.1\.4 source flow/g, "v4.1.9 trust launch");
  if (!text.includes("<!-- V415-V419 HOME STRIP START -->")) {
    const strip = `

<!-- V415-V419 HOME STRIP START -->
      <section class="rp-card" aria-label="Trust launch path">
        <span class="rp-eyebrow green">v4.1.9 trust launch</span>
        <h2>Trust launch path</h2>
        <p class="muted">The retrieval pilot now has a calm public-pilot runway: source links, rights, review history, scoring explanation, and a waitlist gate.</p>
        <div class="rp-flow-grid">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Links</h3><p>Stable citation anchors and copyable source packets keep the learner path inspectable.</p><a class="rp-button green" href="citationdeeplinklayer.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Rights</h3><p>Edition posture separates citation metadata, short excerpt, full translation, and commentary use.</p><a class="rp-button green" href="sourceeditionrightsmatrix.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>History</h3><p>Reviewer decisions become visible local audit records instead of silent source changes.</p><a class="rp-button green" href="reviewerdecisionhistory.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Score</h3><p>Candidate ranking explains fit, citation quality, rights, boundaries, and review state.</p><a class="rp-button green" href="retrievalscoringexplanation.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Waitlist</h3><p>Public pilot interest stays privacy-light, local, and clearly bounded.</p><a class="rp-button green" href="publicpilotwaitlistgate.html">Open</a></article>
        </div>
      </section>
      <!-- V415-V419 HOME STRIP END -->
`;
    text = text.replace("      <!-- V410-V414 HOME STRIP END -->", "      <!-- V410-V414 HOME STRIP END -->" + strip);
  }
  write("index.html", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/v4\.1\.4 ask flow/g, finalBadge);
  text = text.replace(
    /<span>Current version<\/span>\s*<strong>v4\.1\.4<\/strong>\s*<p>[\s\S]*?<\/p>/,
    `<span>Current version</span>
          <strong>${finalVersion}</strong>
          <p>Public Pilot Waitlist Gate completes the trust-launch runway: citation links, rights posture, reviewer history, score explanation, and local pilot interest.</p>`
  );
  text = text.replace(
    /<p>The clickable MVP now has a controlled retrieval pilot lane from gate to learner ask\.<\/p>/,
    "<p>The clickable MVP now has a trust-launch layer from citation link to public pilot waitlist gate.</p>"
  );
  text = text.replace(
    /<p>The source layer now has gate posture, source schema, reviewer desk, QA pack, and learner-facing source flow\.<\/p>/,
    "<p>The source layer now has inspectable links, rights readiness, reviewer history, scoring explanation, and pilot entry boundaries.</p>"
  );
  text = text.replace(
    /<span>Next release<\/span>\s*<strong>v4\.1\.5 Citation Deep Link Layer<\/strong>\s*<p>[\s\S]*?<\/p>/,
    `<span>Next release</span>
          <strong>v4.2.0 Pilot Telemetry Room</strong>
          <p>Measure which public-pilot path users choose while keeping consent, privacy, and no-authority boundaries visible.</p>`
  );
  if (!text.includes("Phase 379: Public Pilot Waitlist Gate")) {
    const phases = versions.map((item) => `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase ${item.phase}: ${item.label}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">100%</div>
            </article>`).join("\n");
    text = text.replace("            <!-- V410-V414 PHASES END -->", phases + "\n            <!-- V410-V414 PHASES END -->");
  }
  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>v4\.1\.4 Learner Ask Flow<\/strong><\/div>[\s\S]*?<ul class="checklist">[\s\S]*?<\/ul>/,
    `<div class="version-row"><span>Release</span><strong>v4.1.9 Public Pilot Waitlist Gate</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.1.8 Retrieval Scoring Explanation</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Turn retrieval pilot trust into a public-pilot entry path without granting production authority.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for pilot telemetry design</strong></div>
          <div class="panel note">
            <h2>North Star</h2>
            <p>Make sacred and philosophical knowledge easier to approach without flattening its depth, confusing categories, or pretending the AI is an authority.</p>
          </div>
          <h2>Next Build Checklist</h2>
          <ul class="checklist">
            <li><span class="dot"></span><span>Add consent-first pilot telemetry.</span></li>
            <li><span class="dot"></span><span>Keep waitlist storage local until a real privacy and account model exists.</span></li>
            <li><span class="dot"></span><span>Preserve citation, rights, review, and score visibility in every learner-facing path.</span></li>
          </ul>`
  );
  write("build-status.html", text);
}

function prependDocs() {
  const readmeBlock = `<!-- V415-V419 README START -->
${versions.slice().reverse().map((item) => `## ${item.version} ${item.label}
- ${item.summary}
- Primary files: \`${item.page}\`, \`${item.dataFile}\`, \`assets/vedapath-trust-launch.js\`, \`assets/vedapath-trust-launch.css\`.
- Product note: this remains a static GitHub Pages prototype; no live AI retrieval, source rights approval, public launch, account storage, or production authority is granted.`).join("\n\n")}
<!-- V415-V419 README END -->

`;
  let readme = read("README.md");
  if (!readme.includes("V415-V419 README START")) {
    write("README.md", readmeBlock + readme);
  }

  let prototype = read("docs/PROTOTYPE_NOTES.md");
  if (!prototype.includes("V415-V419 README START")) {
    write("docs/PROTOTYPE_NOTES.md", readmeBlock + prototype);
  }

  const changelogBlock = `<!-- V415-V419 CHANGELOG START -->
${versions.slice().reverse().map((item) => `## ${item.version} ${item.label}
- Changes made: ${item.summary}
- Files changed: \`${item.page}\`, \`${item.dataFile}\`, \`${item.doc}\`, \`assets/vedapath-trust-launch.js\`, \`assets/vedapath-trust-launch.css\`, \`assets/vedapath-command-shell.js\`, \`index.html\`, \`build-status.html\`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, \`scripts/check-static-links.mjs\`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.
`).join("\n")}
<!-- V415-V419 CHANGELOG END -->

`;
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("V415-V419 CHANGELOG START")) {
    changelog = changelog.replace("# Changelog\n\n", "# Changelog\n\n" + changelogBlock);
    write("CHANGELOG.md", changelog);
  }

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  if (!blueprint.includes("v4.1.9 Trust Launch Position")) {
    const block = `## v4.1.9 Trust Launch Position

VedaPath now has a trust-launch runway on top of the retrieval pilot:

1. Citation Deep Link Layer.
2. Source Edition and Rights Matrix.
3. Reviewer Decision History.
4. Retrieval Scoring Explanation.
5. Public Pilot Waitlist Gate.

The product direction remains simple: ask clearly, show source and boundary, explain why a source was chosen, and invite public users only through a privacy-light pilot path.

`;
    write("docs/PRODUCT_BLUEPRINT.md", block + blueprint);
  }
}

writeDataAndPages();
writeAssets();
updateCommandShell();
updateCoreNav();
updateStaticChecks();
updateIndex();
updateBuildStatus();
prependDocs();

console.log("applied v4.1.5-v4.1.9 trust launch batch");
