import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const releaseDate = "July 6, 2026";
const finalVersion = "v4.2.4";
const finalBadge = "v4.2.4 invite";

const versions = [
  {
    version: "v4.2.0",
    label: "Source Edition Intake",
    short: "edition intake",
    nav: "Edition",
    page: "sourceeditionintake.html",
    bodyClass: "source-edition-intake-page",
    kind: "edition",
    dataFile: "data/vedapath-source-edition-intake.json",
    doc: "docs/SOURCE_EDITION_INTAKE.md",
    phase: 380,
    summary: "Source Edition Intake captures edition, translator, language, rights posture, and missing source fields before pilot use."
  },
  {
    version: "v4.2.1",
    label: "Rights Review Desk",
    short: "rights desk",
    nav: "Rights Desk",
    page: "rightsreviewdesk.html",
    bodyClass: "rights-review-desk-page",
    kind: "rightsDesk",
    dataFile: "data/vedapath-rights-review-desk.json",
    doc: "docs/RIGHTS_REVIEW_DESK.md",
    phase: 381,
    summary: "Rights Review Desk separates allowed, review-needed, excerpt-only, and blocked source use before public pilot answers expand."
  },
  {
    version: "v4.2.2",
    label: "Reviewer Identity Lite",
    short: "reviewer identity",
    nav: "Identity",
    page: "revieweridentitylite.html",
    bodyClass: "reviewer-identity-lite-page",
    kind: "identity",
    dataFile: "data/vedapath-reviewer-identity-lite.json",
    doc: "docs/REVIEWER_IDENTITY_LITE.md",
    phase: 382,
    summary: "Reviewer Identity Lite makes source decisions carry role, scope, conflict, and authority boundaries without creating real accounts."
  },
  {
    version: "v4.2.3",
    label: "Answer Promotion Rules",
    short: "promotion rules",
    nav: "Promote",
    page: "answerpromotionrules.html",
    bodyClass: "answer-promotion-rules-page",
    kind: "promotion",
    dataFile: "data/vedapath-answer-promotion-rules.json",
    doc: "docs/ANSWER_PROMOTION_RULES.md",
    phase: 383,
    summary: "Answer Promotion Rules stop a source candidate from becoming a public answer pattern until citation, rights, review, and boundary checks pass."
  },
  {
    version: "v4.2.4",
    label: "Pilot Invite Packet",
    short: "pilot invite",
    nav: "Invite",
    page: "pilotinvitepacket.html",
    bodyClass: "pilot-invite-packet-page",
    kind: "invite",
    dataFile: "data/vedapath-pilot-invite-packet.json",
    doc: "docs/PILOT_INVITE_PACKET.md",
    phase: 384,
    summary: "Pilot Invite Packet gives the founder a calm, bounded invitation builder for a small public pilot without account, payment, or production promises."
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
  ["Waitlist", "publicpilotwaitlistgate.html"],
  ["Edition", "sourceeditionintake.html"],
  ["Rights Desk", "rightsreviewdesk.html"],
  ["Identity", "revieweridentitylite.html"],
  ["Promote", "answerpromotionrules.html"],
  ["Invite", "pilotinvitepacket.html"]
];

const publicRisk = "This remains a static GitHub Pages prototype. It grants no production source authority, no reviewer account authority, no public launch permission, and no storage outside visible browser-local preview state.";

const sourceRecords = [
  {
    id: "bg-2-48",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    title: "Steady action",
    edition: "Founder demo edition note",
    translator: "Needs licensed or public-domain decision",
    language: "Sanskrit source with English rendering",
    rights: "excerpt-only",
    status: "review",
    confidence: "High for citation, pending translation rights",
    allowedUse: "Use as a cited source candidate for calm action examples.",
    missingFields: ["edition id", "translation rights", "reviewer signoff"],
    boundary: "Reflection support, not therapy, ritual instruction, or spiritual authority."
  },
  {
    id: "bg-11-32",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    title: "Cosmic-form quote context",
    edition: "Founder demo edition note",
    translator: "Needs licensed or public-domain decision",
    language: "Sanskrit source with English rendering",
    rights: "excerpt-only",
    status: "review",
    confidence: "High for citation, careful with popular wording",
    allowedUse: "Use to correct the Oppenheimer quote category with restraint.",
    missingFields: ["edition id", "translation source", "commentary boundary"],
    boundary: "Do not call it a direct Vedic quote."
  },
  {
    id: "rigveda-3-62-10",
    citation: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    title: "Gayatri mantra source candidate",
    edition: "Source needs edition path",
    translator: "Needs reviewer-approved rendering",
    language: "Vedic Sanskrit",
    rights: "review-needed",
    status: "hold",
    confidence: "Citation known, interpretation must be careful",
    allowedUse: "Use source label and boundary before any explanation expands.",
    missingFields: ["edition id", "recitation boundary", "reviewer identity"],
    boundary: "Study support only, not recitation authority."
  },
  {
    id: "katha-1-2-23",
    citation: "Katha Upanishad 1.2.23",
    family: "Upanishad | Shruti",
    title: "Self-knowledge caution",
    edition: "Source needs edition path",
    translator: "Needs public-domain or licensed rendering",
    language: "Sanskrit source with English rendering",
    rights: "review-needed",
    status: "hold",
    confidence: "Good source family, pending edition",
    allowedUse: "Use only as a candidate until source edition is approved.",
    missingFields: ["edition id", "translation rights", "interpretation lane"],
    boundary: "Do not turn into deterministic self-help advice."
  }
];

const dataByKind = {
  edition: {
    headline: "Name the exact source before the answer grows.",
    copy: "A pilot answer should not just say Bhagavad Gita or Rigveda. It should show the source family, edition posture, translation status, and what is still missing.",
    boundary: publicRisk,
    metrics: [
      { label: "Records", value: "4" },
      { label: "Edition-ready", value: "0" },
      { label: "Review holds", value: "2" },
      { label: "Storage", value: "Local preview" }
    ],
    records: sourceRecords,
    intakeQuestions: [
      "Which edition or public-domain source is being used?",
      "Who is responsible for translation rights?",
      "What fields are missing before pilot answer use?",
      "What boundary must appear with the learner-facing card?"
    ]
  },
  rightsDesk: {
    headline: "Let rights decide the lane before product excitement decides.",
    copy: "The rights desk turns each source into one clear use lane so the public pilot never confuses citation confidence with permission to reproduce or expand text.",
    boundary: publicRisk,
    metrics: [
      { label: "Lanes", value: "4" },
      { label: "Allowed", value: "0" },
      { label: "Excerpt", value: "2" },
      { label: "Blocked", value: "1" }
    ],
    lanes: [
      { id: "allowed", title: "Allowed", copy: "Approved source and use scope are documented." },
      { id: "review-needed", title: "Review needed", copy: "Edition, translator, or use rights are not yet clear." },
      { id: "excerpt-only", title: "Excerpt only", copy: "Short cited reference is acceptable for demo, full text is not." },
      { id: "blocked", title: "Blocked", copy: "No learner-facing use until founder and reviewer clear it." }
    ],
    records: sourceRecords.map((record, index) => ({
      ...record,
      decision: index === 1 ? "excerpt-only" : index === 3 ? "blocked" : record.rights,
      next: index === 3 ? "Find an approved edition before public pilot." : "Attach edition and reviewer note."
    })),
    checklist: [
      "Never treat citation confidence as reuse permission.",
      "Show missing fields beside every learner-facing source card.",
      "Move serious gaps into review tickets before public use.",
      "Keep public pilot copy short, cited, and bounded."
    ]
  },
  identity: {
    headline: "A review decision needs a visible reviewer posture.",
    copy: "Before production accounts exist, VedaPath can still model reviewer identity: role, scope, conflict note, decision lane, and what the reviewer is not authorizing.",
    boundary: publicRisk,
    metrics: [
      { label: "Reviewer roles", value: "4" },
      { label: "Authority", value: "None" },
      { label: "Conflicts", value: "Visible" },
      { label: "Storage", value: "Local preview" }
    ],
    roles: [
      { id: "source-reviewer", title: "Source reviewer", scope: "Can flag citation, edition, and source family issues." },
      { id: "language-reviewer", title: "Language reviewer", scope: "Can flag Sanskrit/transliteration and translation concerns." },
      { id: "boundary-reviewer", title: "Boundary reviewer", scope: "Can flag overclaim, therapy, ritual, and authority risks." },
      { id: "founder-review", title: "Founder review", scope: "Can decide product posture, not scholarly truth." }
    ],
    rules: [
      "A reviewer note is evidence, not final religious authority.",
      "Every decision should include scope and conflict posture.",
      "A public pilot answer needs at least one source and one boundary review.",
      "Production identity still needs secure accounts and audit history."
    ]
  },
  promotion: {
    headline: "Promote only what survives source, rights, review, and boundary checks.",
    copy: "The promotion rules make answer patterns harder to misuse. A candidate can stay in draft, move to review, or become pilot-ready only after every visible gate passes.",
    boundary: publicRisk,
    metrics: [
      { label: "Promotion gates", value: "6" },
      { label: "Pilot-ready", value: "0" },
      { label: "Draft candidates", value: "4" },
      { label: "Production", value: "Off" }
    ],
    candidates: [
      { id: "steady-action", title: "Begin with one honest action", citation: "Bhagavad Gita 2.48", status: "draft", risk: "Translation rights incomplete." },
      { id: "oppenheimer-category", title: "Oppenheimer quote category correction", citation: "Bhagavad Gita 11.32", status: "review", risk: "Popular quote wording can overstate source category." },
      { id: "gayatri-care", title: "Gayatri mantra careful explanation", citation: "Rigveda 3.62.10", status: "hold", risk: "Recitation and ritual boundary must be explicit." },
      { id: "upanishad-caution", title: "Self-knowledge caution", citation: "Katha Upanishad 1.2.23", status: "hold", risk: "Needs edition and interpretation lane." }
    ],
    gates: [
      "Citation is exact and source family is visible.",
      "Edition or rights posture is recorded.",
      "Reviewer role and scope are visible.",
      "Plain meaning and deeper interpretation are separated.",
      "Boundary language is learner-facing.",
      "No live AI, account, or public launch authority is implied."
    ]
  },
  invite: {
    headline: "Invite a few people into a calm pilot, not a loud launch.",
    copy: "The invite packet gives the founder a copyable message, eligibility gate, and local invite memory for a small public pilot while accounts, payments, and production remain closed.",
    boundary: publicRisk,
    metrics: [
      { label: "Invite lanes", value: "4" },
      { label: "Saved invites", value: "Local" },
      { label: "Accounts", value: "Off" },
      { label: "Payments", value: "Off" }
    ],
    segments: [
      { id: "learner", title: "Curious learner", promise: "One source-first question, one calm next step." },
      { id: "teacher", title: "Teacher or guide", promise: "Clear source family, citation, and boundary language." },
      { id: "reviewer", title: "Reviewer", promise: "A visible path to flag citation, rights, and overclaim risks." },
      { id: "founder", title: "Founder friend", promise: "A tiny, honest product test before public scale." }
    ],
    gates: [
      "Invitation says prototype, not production service.",
      "No payment, account, or private data request.",
      "Feedback route is visible.",
      "Source and boundary remain the center of the experience."
    ],
    defaultNote: "I am inviting you to try a very small VedaPath AI pilot. Ask one question, inspect the source card, and tell me what felt clear or confusing."
  }
};

mkdirSync("assets", { recursive: true });
mkdirSync("data", { recursive: true });
mkdirSync("docs", { recursive: true });

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, text) {
  writeFileSync(file, String(text).replace(/\r?\n/g, "\n"), "utf8");
}

function readable(file) {
  try {
    readFileSync(file, "utf8");
    return true;
  } catch {
    return false;
  }
}

function navHtml(activeLabel, prefix = "") {
  return navCore.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${prefix}${href}">${label}</a>`;
  }).join("\n") + `\n        <span class="version-pill">${finalBadge}</span>`;
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
  <link rel="stylesheet" href="assets/vedapath-pilot-readiness.css" />
</head>
<body class="${item.bodyClass} pilot-readiness-surface">
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

    <section class="pr-hero">
      <div class="pr-hero-copy">
        <p class="pr-eyebrow">${item.version} ${item.short}</p>
        <h1>${item.label}</h1>
        <p>${item.summary}</p>
      </div>
      <aside class="pr-hero-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>Public pilot discipline.</strong>
        <span>Source first. Permission visible.</span>
      </aside>
    </section>

    <section class="pr-app" data-pilot-readiness-app data-kind="${item.kind}" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-pilot-readiness.js"></script>
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
This room is part of the public-pilot readiness layer. It makes pilot use more trustworthy without granting live AI authority, production source authority, reviewer account authority, public launch permission, or production storage.

## User Value
- Keeps the source path visible before answer expansion.
- Keeps rights, reviewer scope, and boundaries visible.
- Gives the founder a concrete next decision instead of a vague roadmap.
- Preserves VedaPath's calm, source-first posture.

## Known Risks
- Data is prototype seed data.
- Rights and licensed translation review remain unresolved.
- Local browser memory is useful for demos but not production audit storage.
`;
}

function writePagesAndData() {
  for (const item of versions) {
    write(item.page, pageTemplate(item));
    write(item.dataFile, JSON.stringify(dataByKind[item.kind], null, 2));
    write(item.doc, docTemplate(item));
  }
}

function writeAssets() {
  write("assets/vedapath-pilot-readiness.css", `:root {
  --pr-bg: #fffaf2;
  --pr-panel: rgba(255, 255, 255, 0.82);
  --pr-panel-warm: rgba(255, 248, 238, 0.9);
  --pr-line: rgba(77, 55, 42, 0.15);
  --pr-ink: #1f1712;
  --pr-muted: #60483a;
  --pr-bhagwa: #d85b22;
  --pr-ochre: #a83e12;
  --pr-gold: #dfa83a;
  --pr-green: #165f4d;
  --pr-calm: #e8f2ed;
}

.pilot-readiness-surface {
  background:
    linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px),
    radial-gradient(circle at 84% 10%, rgba(224, 168, 58, 0.11), transparent 28%),
    linear-gradient(145deg, #fffaf2 0%, #fff7eb 42%, #fcfbf6 100%);
  background-size: 18px 18px, 18px 18px, auto, auto;
  color: var(--pr-ink);
}

.pilot-readiness-surface .workspace {
  width: min(1360px, calc(100% - 28px));
}

.pr-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 230px;
  gap: 20px;
  align-items: center;
  padding: 30px 0 26px;
  border-bottom: 1px solid var(--pr-line);
}

.pr-hero-copy {
  max-width: 860px;
}

.pr-hero h1 {
  margin: 10px 0;
  font-size: clamp(30px, 3.6vw, 46px);
  line-height: 1.06;
  letter-spacing: 0;
}

.pr-hero p {
  max-width: 760px;
  color: var(--pr-muted);
  font-size: 16px;
}

.pr-hero-card,
.pr-card,
.pr-panel,
.pr-step,
.pr-field,
.pr-table,
.pr-choice {
  border: 1px solid var(--pr-line);
  border-radius: 8px;
  background: var(--pr-panel);
  box-shadow: 0 18px 48px rgba(48, 31, 19, 0.052);
}

.pr-hero-card {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.pr-hero-card img,
.pr-logo-mini {
  width: 86px;
  height: 86px;
  border-radius: 8px;
  object-fit: cover;
}

.pr-hero-card span,
.pr-muted {
  color: var(--pr-muted);
}

.pr-app {
  padding-top: 18px;
}

.pr-grid {
  display: grid;
  grid-template-columns: minmax(205px, 0.46fr) minmax(0, 1.8fr) minmax(235px, 0.55fr);
  gap: 14px;
  align-items: start;
}

.pr-main,
.pr-stack,
.pr-list,
.pr-actions,
.pr-form {
  display: grid;
  gap: 12px;
}

.pr-card,
.pr-panel {
  padding: 16px;
}

.pr-card h2,
.pr-panel h2 {
  margin: 8px 0;
  font-size: clamp(21px, 2.2vw, 28px);
  line-height: 1.1;
}

.pr-card h3,
.pr-panel h3,
.pr-step h3 {
  margin: 6px 0;
  font-size: 16px;
  line-height: 1.16;
}

.pr-card p,
.pr-panel p,
.pr-step p,
.pr-field p {
  color: var(--pr-muted);
}

.pr-eyebrow,
.pr-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  border: 1px solid rgba(216, 91, 34, 0.23);
  border-radius: 999px;
  padding: 3px 9px;
  background: rgba(252, 232, 221, 0.75);
  color: var(--pr-ochre);
  font-size: 12px;
  font-weight: 900;
}

.pr-eyebrow.green,
.pr-chip.allowed,
.pr-chip.ready,
.pr-chip.source-reviewer,
.pr-chip.learner {
  border-color: rgba(22, 95, 77, 0.24);
  background: rgba(232, 242, 237, 0.92);
  color: var(--pr-green);
}

.pr-chip.review-needed,
.pr-chip.excerpt-only,
.pr-chip.review,
.pr-chip.teacher,
.pr-chip.founder {
  border-color: rgba(223, 168, 58, 0.38);
  background: rgba(255, 244, 218, 0.9);
  color: #7a5413;
}

.pr-chip.blocked,
.pr-chip.hold,
.pr-chip.boundary-reviewer,
.pr-chip.reviewer {
  border-color: rgba(168, 62, 18, 0.24);
  background: rgba(255, 238, 229, 0.92);
  color: var(--pr-ochre);
}

.pr-button,
.pr-select,
.pr-textarea,
.pr-input {
  border: 1px solid rgba(216, 91, 34, 0.24);
  border-radius: 8px;
  background: rgba(255, 253, 249, 0.92);
  color: var(--pr-ink);
  font: inherit;
}

.pr-button,
.pr-select,
.pr-input {
  min-height: 42px;
}

.pr-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0 13px;
  font-weight: 900;
  cursor: pointer;
}

.pr-button.primary,
.pr-button.is-active {
  border-color: var(--pr-bhagwa);
  background: var(--pr-bhagwa);
  color: #fffaf3;
}

.pr-button.green {
  border-color: rgba(22, 95, 77, 0.3);
  color: var(--pr-green);
}

.pr-select,
.pr-input {
  width: 100%;
  padding: 0 12px;
  font-weight: 800;
}

.pr-textarea {
  min-height: 108px;
  width: 100%;
  padding: 12px;
  resize: vertical;
}

.pr-actions {
  grid-template-columns: repeat(auto-fit, minmax(140px, max-content));
  align-items: center;
}

.pr-fields,
.pr-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.pr-field {
  padding: 12px;
}

.pr-field span {
  display: block;
  color: var(--pr-muted);
  font-size: 12px;
}

.pr-field strong {
  display: block;
  margin-top: 5px;
  font-size: 17px;
  line-height: 1.16;
}

.pr-table {
  overflow: hidden;
}

.pr-table-row {
  display: grid;
  grid-template-columns: 1.1fr 1fr 0.75fr 1.25fr;
  gap: 12px;
  padding: 13px 15px;
  border-bottom: 1px solid var(--pr-line);
  align-items: center;
}

.pr-table-row:last-child {
  border-bottom: 0;
}

.pr-table-head {
  background: rgba(255, 248, 238, 0.84);
  color: var(--pr-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.pr-step {
  position: relative;
  padding: 13px;
  border-left: 3px solid rgba(223, 168, 58, 0.55);
}

.pr-number {
  display: inline-grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--pr-calm);
  color: var(--pr-green);
  font-size: 13px;
  font-weight: 900;
}

.pr-check {
  display: flex;
  gap: 10px;
  align-items: start;
  padding: 12px;
  border: 1px solid var(--pr-line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.66);
}

.pr-check input {
  margin-top: 4px;
  accent-color: var(--pr-bhagwa);
}

.pr-status {
  border-left: 4px solid var(--pr-bhagwa);
  background: var(--pr-panel-warm);
}

.pr-status.ready {
  border-left-color: var(--pr-green);
}

.pr-saved {
  border-style: dashed;
}

@media (max-width: 1120px) {
  .pr-grid,
  .pr-hero {
    grid-template-columns: 1fr;
  }

  .pr-hero-card {
    justify-items: start;
    text-align: left;
  }
}

@media (max-width: 760px) {
  .pilot-readiness-surface .workspace {
    width: min(100% - 18px, 1360px);
  }

  .pr-hero {
    padding-top: 20px;
  }

  .pr-hero h1 {
    font-size: clamp(28px, 10vw, 38px);
  }

  .pr-fields,
  .pr-metrics,
  .pr-table-row {
    grid-template-columns: 1fr;
  }

  .pr-card,
  .pr-panel {
    padding: 14px;
  }
}
`);

  write("assets/vedapath-pilot-readiness.js", `(function () {
  const app = document.querySelector("[data-pilot-readiness-app]");
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
    return '<span class="pr-chip ' + slug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="pr-metrics">' + metrics.map(function (metric) {
      return '<div class="pr-field"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="pr-grid"><aside class="pr-panel">' + left + '</aside><main class="pr-main">' + main + '</main><aside class="pr-panel">' + side + '</aside></section>';
  }

  function safeRead(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveLocal(key, value, limit) {
    const next = [value].concat(safeRead(key)).slice(0, limit || 8);
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
  }

  function recordSummary(record) {
    return '<article class="pr-card pr-status"><div class="pr-actions">' + chip(record.rights || record.status) + chip(record.family) + '</div><h2>' + escapeHtml(record.title) + '</h2><p><strong>' + escapeHtml(record.citation) + '</strong></p><p>' + escapeHtml(record.allowedUse) + '</p><div class="pr-fields"><div class="pr-field"><span>Edition</span><strong>' + escapeHtml(record.edition) + '</strong></div><div class="pr-field"><span>Translator</span><strong>' + escapeHtml(record.translator) + '</strong></div><div class="pr-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence) + '</strong></div><div class="pr-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary) + '</strong></div></div></article>';
  }

  function renderEdition(data) {
    const key = "vedapathSourceEditionIntakeV420";
    let selectedId = data.records[0].id;
    function selected() {
      return data.records.find(function (record) { return record.id === selectedId; }) || data.records[0];
    }
    function paint() {
      const record = selected();
      const saved = safeRead(key);
      const left = '<span class="pr-eyebrow">Edition queue</span><h2>Choose source</h2><div class="pr-list">' + data.records.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-record="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + '</button>';
      }).join("") + '</div>';
      const missing = '<div class="pr-list">' + record.missingFields.map(function (field) {
        return '<article class="pr-step"><span class="pr-number">!</span><h3>' + escapeHtml(field) + '</h3><p>Must be resolved before public pilot answer expansion.</p></article>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Source edition intake</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' + recordSummary(record) + '<article class="pr-card"><h2>Missing fields</h2>' + missing + '<label><span class="pr-muted">Local edition note</span><textarea class="pr-textarea" data-edition-note>Edition needs a public-domain or licensed translation decision before learner-facing expansion.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-edition type="button">Save Intake Note</button><button class="pr-button green" data-copy-edition type="button">Copy Intake Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Questions</span><h2>Before answer use</h2><div class="pr-stack">' + data.intakeQuestions.map(function (question, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(question) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved edition note' + (saved.length === 1 ? "" : "s") + ' in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-record]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-record");
          paint();
        });
      });
      app.querySelector("[data-save-edition]")?.addEventListener("click", function () {
        saveLocal(key, { citation: record.citation, note: app.querySelector("[data-edition-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-edition]")?.addEventListener("click", function () {
        copyText(["VedaPath Source Edition Intake", record.citation, record.family, "Edition: " + record.edition, "Translator: " + record.translator, "Missing: " + record.missingFields.join(", "), "Boundary: " + record.boundary].join("\\n"));
      });
    }
    paint();
  }

  function renderRightsDesk(data) {
    const key = "vedapathRightsReviewDeskV421";
    let lane = "all";
    function visible() {
      return lane === "all" ? data.records : data.records.filter(function (record) { return record.decision === lane || record.rights === lane; });
    }
    function paint() {
      const saved = safeRead(key);
      const rows = visible().map(function (record) {
        return '<div class="pr-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.decision || record.rights) + '</span><span>' + escapeHtml(record.next) + '</span></div>';
      }).join("");
      const left = '<span class="pr-eyebrow">Use lanes</span><h2>Filter rights</h2><div class="pr-list"><button class="pr-button' + (lane === "all" ? " is-active" : "") + '" data-lane="all" type="button">All lanes</button>' + data.lanes.map(function (item) {
        return '<button class="pr-button' + (item.id === lane ? " is-active" : "") + '" data-lane="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Rights review</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><div class="pr-table"><div class="pr-table-row pr-table-head"><span>Citation</span><span>Family</span><span>Lane</span><span>Next</span></div>' + rows + '</div><article class="pr-card"><label><span class="pr-muted">Local rights note</span><textarea class="pr-textarea" data-rights-note>Keep this source in review until edition and use permission are recorded.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-rights type="button">Save Rights Note</button><button class="pr-button green" data-copy-rights type="button">Copy Rights Snapshot</button></div></article>';
      const side = '<span class="pr-eyebrow green">Checklist</span><h2>Release discipline</h2><div class="pr-stack">' + data.checklist.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved rights note' + (saved.length === 1 ? "" : "s") + '.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-lane]").forEach(function (button) {
        button.addEventListener("click", function () {
          lane = button.getAttribute("data-lane");
          paint();
        });
      });
      app.querySelector("[data-save-rights]")?.addEventListener("click", function () {
        saveLocal(key, { lane: lane, note: app.querySelector("[data-rights-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-rights]")?.addEventListener("click", function () {
        copyText(visible().map(function (record) { return record.citation + " | " + record.decision + " | " + record.next; }).join("\\n"));
      });
    }
    paint();
  }

  function renderIdentity(data) {
    const key = "vedapathReviewerIdentityLiteV422";
    let selectedId = data.roles[0].id;
    function role() {
      return data.roles.find(function (item) { return item.id === selectedId; }) || data.roles[0];
    }
    function paint() {
      const saved = safeRead(key);
      const active = role();
      const left = '<span class="pr-eyebrow">Reviewer posture</span><h2>Choose role</h2><div class="pr-list">' + data.roles.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-role="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Identity lite</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.scope) + '</p><label><span class="pr-muted">Conflict or limitation note</span><textarea class="pr-textarea" data-identity-note>I can review source posture for this demo, but I am not granting final scholarly or production authority.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-identity type="button">Save Identity Note</button><button class="pr-button green" data-copy-identity type="button">Copy Identity Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Rules</span><h2>Reviewer boundaries</h2><div class="pr-stack">' + data.rules.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' identity note' + (saved.length === 1 ? "" : "s") + ' saved.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-role]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-role");
          paint();
        });
      });
      app.querySelector("[data-save-identity]")?.addEventListener("click", function () {
        saveLocal(key, { role: active.title, scope: active.scope, note: app.querySelector("[data-identity-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-identity]")?.addEventListener("click", function () {
        copyText(["VedaPath Reviewer Identity", active.title, "Scope: " + active.scope, "Boundary: " + data.boundary].join("\\n"));
      });
    }
    paint();
  }

  function renderPromotion(data) {
    const key = "vedapathAnswerPromotionRulesV423";
    let selectedId = data.candidates[0].id;
    function candidate() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function statusText() {
      const checked = app.querySelectorAll("[data-gate-check]:checked").length;
      return checked === data.gates.length ? "Pilot-ready draft" : checked >= 4 ? "Review candidate" : "Keep in draft";
    }
    function paint() {
      const active = candidate();
      const saved = safeRead(key);
      const left = '<span class="pr-eyebrow">Candidates</span><h2>Choose answer</h2><div class="pr-list">' + data.candidates.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-candidate="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const checks = data.gates.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-gate-check ' + (index < 3 ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Promotion rules</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status"><div class="pr-actions">' + chip(active.status) + chip(active.citation) + '</div><h2>' + escapeHtml(active.title) + '</h2><p>Risk: ' + escapeHtml(active.risk) + '</p><div class="pr-form">' + checks + '</div><div class="pr-actions"><button class="pr-button primary" data-promote type="button">Evaluate Promotion</button><button class="pr-button green" data-save-promotion type="button">Save Promotion Note</button></div><div class="pr-card pr-saved" data-promotion-status><h3>Promotion posture</h3><p>Keep in draft until every gate is checked.</p></div></article>';
      const side = '<span class="pr-eyebrow green">Rule</span><h2>No silent promotion</h2><p>A useful answer pattern should not become a public pilot pattern unless the source, rights, reviewer, and boundary trail are visible.</p><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved promotion note' + (saved.length === 1 ? "" : "s") + '.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-candidate]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-candidate");
          paint();
        });
      });
      app.querySelector("[data-promote]")?.addEventListener("click", function () {
        const status = statusText();
        const panel = app.querySelector("[data-promotion-status]");
        if (panel) {
          panel.classList.toggle("ready", status === "Pilot-ready draft");
          panel.innerHTML = '<h3>Promotion posture</h3><p>' + escapeHtml(status) + '</p>';
        }
      });
      app.querySelector("[data-save-promotion]")?.addEventListener("click", function () {
        saveLocal(key, { candidate: active.title, status: statusText(), date: new Date().toISOString() }, 8);
        paint();
      });
    }
    paint();
  }

  function renderInvite(data) {
    const key = "vedapathPilotInvitePacketV424";
    let selectedId = data.segments[0].id;
    function segment() {
      return data.segments.find(function (item) { return item.id === selectedId; }) || data.segments[0];
    }
    function packet(active, note) {
      return ["VedaPath AI Pilot Invite", "Segment: " + active.title, "Promise: " + active.promise, "Message: " + note, "Boundary: " + data.boundary].join("\\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = segment();
      const left = '<span class="pr-eyebrow">Invite lane</span><h2>Choose person</h2><div class="pr-list">' + data.segments.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-segment="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Pilot invite</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.promise) + '</p><label><span class="pr-muted">Invite message</span><textarea class="pr-textarea" data-invite-note>' + escapeHtml(data.defaultNote) + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-invite type="button">Save Invite</button><button class="pr-button green" data-copy-invite type="button">Copy Invite Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Gate</span><h2>Small pilot rules</h2><div class="pr-stack">' + data.gates.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local invites</h3><p>' + saved.length + ' invite packet' + (saved.length === 1 ? "" : "s") + ' saved in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-segment]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-segment");
          paint();
        });
      });
      app.querySelector("[data-save-invite]")?.addEventListener("click", function () {
        saveLocal(key, { segment: active.title, note: app.querySelector("[data-invite-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-invite]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-invite-note]")?.value || ""));
      });
    }
    paint();
  }

  const renderers = {
    edition: renderEdition,
    rightsDesk: renderRightsDesk,
    identity: renderIdentity,
    promotion: renderPromotion,
    invite: renderInvite
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) { return response.json(); })
    .then(function (data) {
      const renderer = renderers[app.getAttribute("data-kind")];
      if (renderer) renderer(data);
    })
    .catch(function () {
      app.innerHTML = '<article class="pr-card"><h2>Unable to load pilot readiness data.</h2><p>Check the local JSON file path.</p></article>';
    });
})();
`);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  text = text.replace(
    '{ title: "Retrieval", labels: ["Packet", "Launch", "Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist"] }',
    '{ title: "Retrieval", labels: ["Packet", "Launch", "Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist", "Edition", "Rights Desk", "Identity", "Promote", "Invite"] }'
  );
  text = text.replace(
    '"Waitlist": "Public Pilot Waitlist Gate"',
    '"Waitlist": "Public Pilot Waitlist Gate",\n    "Edition": "Source Edition Intake",\n    "Rights Desk": "Rights Review Desk",\n    "Identity": "Reviewer Identity Lite",\n    "Promote": "Answer Promotion Rules",\n    "Invite": "Pilot Invite Packet"'
  );
  text = text.replace(
    '"public-pilot-waitlist-gate-page": "Public Pilot Waitlist Gate"',
    '"public-pilot-waitlist-gate-page": "Public Pilot Waitlist Gate",\n    "source-edition-intake-page": "Source Edition Intake",\n    "rights-review-desk-page": "Rights Review Desk",\n    "reviewer-identity-lite-page": "Reviewer Identity Lite",\n    "answer-promotion-rules-page": "Answer Promotion Rules",\n    "pilot-invite-packet-page": "Pilot Invite Packet"'
  );
  write("assets/vedapath-command-shell.js", text);
}

function navForFile(file, activeLabel) {
  const prefix = file.startsWith("brand/") ? "../" : "";
  return navHtml(activeLabel, prefix);
}

function activeFromFile(file, text) {
  const activeMatch = text.match(/<a class="link active"[^>]*>([^<]+)<\/a>/);
  if (activeMatch) return activeMatch[1].trim();
  const found = navCore.find(([, href]) => href === file || href === file.replace(/^brand\//, "brand/"));
  return found ? found[0] : "Home";
}

function updateNavInFile(file, forcedActive) {
  if (!readable(file)) return;
  let text = read(file);
  if (!text.includes('class="navlinks nav"')) return;
  const active = forcedActive || activeFromFile(file, text);
  text = text.replace(/(<nav class="navlinks nav"[^>]*>\s*)[\s\S]*?(\s*<\/nav>)/, `$1\n${navForFile(file, active)}\n      $2`);
  write(file, text);
}

function updateCoreNavs() {
  const files = [
    "index.html",
    "build-status.html",
    "brand/brand-board.html",
    "blueprint.html",
    "citedanswerlab.html",
    "reviewqueuepersistence.html",
    "mantralenslab.html",
    "lifecompanionlab.html",
    "conversationcompanionlab.html",
    "patterncompanionlab.html",
    "daily.html",
    "answerpacketpilot.html",
    "launchreadinesshub.html",
    "productionretrievalpilotgate.html",
    "verifiedsourcerecordschema.html",
    "retrievalreviewerdesk.html",
    "first25sourceqapack.html",
    "learneraskflow.html",
    "citationdeeplinklayer.html",
    "sourceeditionrightsmatrix.html",
    "reviewerdecisionhistory.html",
    "retrievalscoringexplanation.html",
    "publicpilotwaitlistgate.html",
    ...versions.map((item) => item.page)
  ];
  for (const file of files) updateNavInFile(file);
}

function updateStaticChecks() {
  let text = read("scripts/check-static-links.mjs");
  for (const item of versions) {
    if (!text.includes(`"${item.page}"`)) {
      text = text.replace('  "publicpilotwaitlistgate.html"', `  "publicpilotwaitlistgate.html",\n  "${item.page}"`);
    }
  }
  write("scripts/check-static-links.mjs", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/v4\.1\.9 waitlist/g, finalBadge);
  text = text.replace(/v4\.1\.9 trust launch/g, "v4.2.4 pilot readiness");
  if (!text.includes("<!-- V420-V424 HOME STRIP START -->")) {
    const strip = `

<!-- V420-V424 HOME STRIP START -->
      <section class="rp-card" aria-label="Public pilot readiness path">
        <span class="rp-eyebrow green">v4.2.4 pilot readiness</span>
        <h2>Public pilot readiness path</h2>
        <p class="muted">Before a wider pilot, VedaPath now checks edition, rights, reviewer identity, answer promotion, and invite language in one calm path.</p>
        <div class="rp-flow-grid">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Edition</h3><p>Capture edition, translator, rights posture, and missing source fields.</p><a class="rp-button green" href="sourceeditionintake.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Rights Desk</h3><p>Separate allowed, review-needed, excerpt-only, and blocked source lanes.</p><a class="rp-button green" href="rightsreviewdesk.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Identity</h3><p>Attach reviewer role, scope, conflict posture, and no-authority boundary.</p><a class="rp-button green" href="revieweridentitylite.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Promote</h3><p>Require citation, rights, reviewer, plain meaning, and boundary checks.</p><a class="rp-button green" href="answerpromotionrules.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Invite</h3><p>Create a small, honest public pilot invite without accounts or payment.</p><a class="rp-button green" href="pilotinvitepacket.html">Open</a></article>
        </div>
      </section>
      <!-- V420-V424 HOME STRIP END -->
`;
    text = text.replace("      <!-- V415-V419 HOME STRIP END -->", "      <!-- V415-V419 HOME STRIP END -->" + strip);
  }
  write("index.html", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/v4\.1\.9 waitlist/g, finalBadge);
  text = text.replace(
    /<span>Current version<\/span>\s*<strong>v4\.1\.9<\/strong>\s*<p>[\s\S]*?<\/p>/,
    `<span>Current version</span>
          <strong>${finalVersion}</strong>
          <p>Pilot Invite Packet completes the public-pilot readiness chain: edition intake, rights desk, reviewer identity, promotion rules, and a bounded invite packet.</p>`
  );
  text = text.replace(
    /<p>The clickable MVP now has a trust-launch layer from citation link to public pilot waitlist gate\.<\/p>/,
    "<p>The clickable MVP now has a pilot-readiness layer from source edition intake to invite packet.</p>"
  );
  text = text.replace(
    /<p>The source layer now has inspectable links, rights readiness, reviewer history, scoring explanation, and pilot entry boundaries\.<\/p>/,
    "<p>The source layer now shows edition posture, rights lanes, reviewer scope, promotion gates, and invite boundaries before public pilot use.</p>"
  );
  text = text.replace(
    /<span>Next release<\/span>\s*<strong>v4\.2\.0 Pilot Telemetry Room<\/strong>\s*<p>[\s\S]*?<\/p>/,
    `<span>Next release</span>
          <strong>v4.2.5 Pilot Telemetry Consent</strong>
          <p>Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible.</p>`
  );
  if (!text.includes("Phase 384: Pilot Invite Packet")) {
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
    /<div class="version-row"><span>Release<\/span><strong>v4\.1\.9 Public Pilot Waitlist Gate<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v4\.1\.8 Retrieval Scoring Explanation<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.2.4 Pilot Invite Packet</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.2.3 Answer Promotion Rules</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make the public pilot invite clear, bounded, and source-first before telemetry begins.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for pilot telemetry consent design</strong></div>`
  );
  text = text.replace(
    /<li><span class="dot"><\/span><span>Add consent-first pilot telemetry\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep waitlist storage local until a real privacy and account model exists\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Preserve citation, rights, review, and score visibility in every learner-facing path\.<\/span><\/li>/,
    `<li><span class="dot"></span><span>Add consent-first pilot telemetry.</span></li>
            <li><span class="dot"></span><span>Track invite path, source family, and feedback without hidden personal data.</span></li>
            <li><span class="dot"></span><span>Preserve edition, rights, reviewer, promotion, and invite boundaries in every pilot measurement.</span></li>`
  );
  write("build-status.html", text);
}

function updateReadme() {
  let text = read("README.md");
  if (!text.includes("<!-- V420-V424 README START -->")) {
    const block = `<!-- V420-V424 README START -->
${versions.map((item) => `## ${item.version} ${item.label}
- ${item.summary}
- Primary files: \`${item.page}\`, \`${item.dataFile}\`, \`assets/vedapath-pilot-readiness.js\`, \`assets/vedapath-pilot-readiness.css\`.
- Product note: this remains a static GitHub Pages prototype; no live AI retrieval, source rights approval, reviewer account authority, public launch, account storage, or production authority is granted.`).join("\n\n")}
<!-- V420-V424 README END -->

`;
    text = block + text;
  }
  write("README.md", text);
}

function updateChangelog() {
  let text = read("CHANGELOG.md");
  if (!text.includes("<!-- V420-V424 CHANGELOG START -->")) {
    const block = `<!-- V420-V424 CHANGELOG START -->
${versions.slice().reverse().map((item) => `## ${item.version} ${item.label}
- Changes made: ${item.summary}
- Files changed: \`${item.page}\`, \`${item.dataFile}\`, \`${item.doc}\`, \`assets/vedapath-pilot-readiness.js\`, \`assets/vedapath-pilot-readiness.css\`, \`assets/vedapath-command-shell.js\`, \`index.html\`, \`build-status.html\`, \`README.md\`, and \`scripts/check-static-links.mjs\`.
- Checks run: Node syntax checks, JSON parse checks, \`scripts/check-static-links.mjs\`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.`).join("\n\n")}
<!-- V420-V424 CHANGELOG END -->

`;
    text = text.replace("# Changelog\n\n", "# Changelog\n\n" + block);
  }
  write("CHANGELOG.md", text);
}

function updatePrototypeNotes() {
  const files = ["docs/PROTOTYPE_NOTES.md", "docs/PRODUCT_BLUEPRINT.md"];
  for (const file of files) {
    if (!readable(file)) continue;
    let text = read(file);
    if (!text.includes("v4.2.4 Pilot Invite Packet")) {
      text = `## v4.2.4 Pilot Readiness Batch

VedaPath now has a public-pilot readiness layer: Source Edition Intake, Rights Review Desk, Reviewer Identity Lite, Answer Promotion Rules, and Pilot Invite Packet. The layer keeps the path calm and simple while making edition posture, rights lanes, reviewer scope, promotion gates, and invite boundaries visible before telemetry or public scale.

${text}`;
      write(file, text);
    }
  }
}

function run() {
  writeAssets();
  writePagesAndData();
  updateCommandShell();
  updateCoreNavs();
  updateStaticChecks();
  updateIndex();
  updateBuildStatus();
  updateReadme();
  updateChangelog();
  updatePrototypeNotes();
  console.log("applied v4.2.0-v4.2.4 public pilot readiness batch");
}

run();
