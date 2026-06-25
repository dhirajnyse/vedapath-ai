import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.8.5",
    badge: "v1.8.5 search shell",
    slug: "betasearchshell",
    nav: "Shell",
    title: "VedaPath Beta Search Shell",
    pageLabel: "Beta search shell",
    eyebrow: "Interactive search",
    h1: "Let users search the seed without mystery.",
    lead: "A first browser-only search shell that reads the static beta seed and shows reviewed status, source family, blocked claims, and fallback boundaries.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Browser-only search shell, not live retrieval.",
    progress: 81,
    next: "Source Filter Bar",
    defaultQuery: "steadiness",
    primaryAsk: "Make static beta records searchable while keeping every result visibly prototype and review-needed.",
    summary: "Beta Search Shell turns the static seed into a usable beta surface without pretending retrieval or generation is live.",
    items: [
      ["Search input", "Keyword search across title, citation, family, summary, and blocked claims.", "Makes the seed usable."],
      ["Result cards", "Every result shows source candidate, family, review state, and rights state.", "Keeps trust visible."],
      ["Prototype mark", "Records remain non-public-answer-eligible until reviewed.", "Prevents overclaim."],
      ["Empty state", "No result leads to a careful fallback rather than invention.", "Protects the answer path."]
    ]
  },
  {
    version: "v1.8.6",
    badge: "v1.8.6 filters",
    slug: "sourcefilters",
    nav: "Filters",
    title: "VedaPath Source Filter Bar",
    pageLabel: "Source filters",
    eyebrow: "Filter controls",
    h1: "Filter by what matters for trust.",
    lead: "A filter bar that helps users narrow by source family, review status, allowed intent, and visible blocked claims.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Static filter prototype, not verified taxonomy.",
    progress: 82,
    next: "Result Reason Panel",
    defaultQuery: "upanishad",
    primaryAsk: "Let users narrow source records without hiding review and rights boundaries.",
    summary: "Source Filter Bar makes search calmer by giving users visible constraints instead of a blank text box.",
    items: [
      ["Family filter", "Gita, Veda, Upanishad, or other families can be inspected separately.", "Prevents category blur."],
      ["Review filter", "Review-needed and prototype records remain visibly separate from eligible records.", "Keeps quality honest."],
      ["Intent filter", "Lookup, category check, and reflection preview are not mixed casually.", "Protects answer type."],
      ["Risk filter", "Blocked claims remain readable and searchable.", "Teaches boundaries."]
    ]
  },
  {
    version: "v1.8.7",
    badge: "v1.8.7 reasons",
    slug: "resultreasons",
    nav: "Reasons",
    title: "VedaPath Result Reason Panel",
    pageLabel: "Result reasons",
    eyebrow: "Match reasons",
    h1: "Explain why a result appeared.",
    lead: "A result reason panel that shows which field matched the query and why the record is not yet public-answer eligible.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Reason panel prototype, not semantic ranking.",
    progress: 83,
    next: "Question Match Preview",
    defaultQuery: "category",
    primaryAsk: "Make result selection inspectable enough that users can challenge it.",
    summary: "Result Reason Panel makes search less magical by showing match fields, review state, and no-go boundaries beside each record.",
    items: [
      ["Match field", "Title, source, family, summary, intent, or blocked claim can explain a hit.", "Builds confidence."],
      ["Review reason", "Prototype-support and review-needed states are not hidden.", "Keeps humility."],
      ["Rights reason", "Display-citation-only remains visible.", "Protects text use."],
      ["No-rank claim", "The UI avoids claiming semantic ranking.", "Keeps scope honest."]
    ]
  },
  {
    version: "v1.8.8",
    badge: "v1.8.8 question match",
    slug: "questionmatch",
    nav: "Question",
    title: "VedaPath Question Match Preview",
    pageLabel: "Question match",
    eyebrow: "Question fixtures",
    h1: "Compare the query with known beta questions.",
    lead: "A question match preview that reads the fixture file and displays expected route, source candidate, reviewer need, and boundary.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Fixture preview, not real user intent detection.",
    progress: 84,
    next: "Fallback Explorer",
    defaultQuery: "answer",
    primaryAsk: "Use the fixture file to make early search behavior testable.",
    summary: "Question Match Preview connects seed records with expected beta questions so source routing can be tested before live AI.",
    items: [
      ["Fixture search", "Known questions become visible examples.", "Makes QA practical."],
      ["Expected route", "Source-first preview, fallback, or review-needed behavior is displayed.", "Checks product flow."],
      ["Expected source", "The fixture names the source candidate.", "Keeps answers grounded."],
      ["Reviewer flag", "Reviewer-needed remains visible before public use.", "Protects trust."]
    ]
  },
  {
    version: "v1.8.9",
    badge: "v1.8.9 fallbacks",
    slug: "fallbackexplorer",
    nav: "Fallbacks",
    title: "VedaPath Fallback Explorer",
    pageLabel: "Fallback explorer",
    eyebrow: "No-answer UX",
    h1: "Show the careful path when search is empty.",
    lead: "A fallback explorer that turns no result, no eligible record, rights hold, and sensitive context into clear next steps.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Fallback explorer, not safety certification.",
    progress: 85,
    next: "Evidence Drawer Preview",
    defaultQuery: "therapy",
    primaryAsk: "Make empty search outcomes respectful, useful, and bounded.",
    summary: "Fallback Explorer makes refusal and uncertainty part of the product experience rather than a dead end.",
    items: [
      ["No result", "Invite a narrower source question.", "Avoids vague answers."],
      ["No eligible record", "Explain review-needed state before answer composition.", "Avoids false confidence."],
      ["Sensitive context", "Avoid therapy, crisis, medical, legal, and family advice.", "Protects users."],
      ["Rights hold", "Show citation identity without showing restricted text.", "Respects source use."]
    ]
  },
  {
    version: "v1.9.0",
    badge: "v1.9.0 evidence",
    slug: "searchevidence",
    nav: "Evidence",
    title: "VedaPath Search Evidence Drawer",
    pageLabel: "Search evidence",
    eyebrow: "Evidence preview",
    h1: "Keep source evidence one step from search.",
    lead: "An evidence drawer preview that turns a search result into a compact citation, category, rights, review, and boundary handoff.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Evidence drawer prototype, not licensed source display.",
    progress: 86,
    next: "Review State Filter",
    defaultQuery: "rights",
    primaryAsk: "Let source detail expand without overwhelming the search result list.",
    summary: "Search Evidence Drawer gives VedaPath a simple result-to-evidence interaction that preserves source boundaries.",
    items: [
      ["Citation detail", "Source candidate and family remain visible.", "Prevents category confusion."],
      ["Rights state", "Display-citation-only is clear.", "Protects source display."],
      ["Review state", "Review-needed remains the default.", "Prevents beta overclaim."],
      ["Boundary handoff", "Blocked claims remain close to each result.", "Supports careful use."]
    ]
  },
  {
    version: "v1.9.1",
    badge: "v1.9.1 review filter",
    slug: "reviewstatefilter",
    nav: "Review",
    title: "VedaPath Review State Filter",
    pageLabel: "Review state filter",
    eyebrow: "Review controls",
    h1: "Let review status shape search behavior.",
    lead: "A review state filter that separates active prototype, prototype support, review-needed, and future beta-eligible states.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Review filter prototype, not actual approval.",
    progress: 87,
    next: "Copy Handoff Builder",
    defaultQuery: "review",
    primaryAsk: "Expose review status so beta search never reads as approved corpus.",
    summary: "Review State Filter makes source status a first-class search control instead of buried metadata.",
    items: [
      ["Status chip", "Each result names active-prototype or prototype-support.", "Keeps status visible."],
      ["Eligibility flag", "Public answer eligibility stays false until approved.", "Prevents misuse."],
      ["Reviewer route", "Review-needed records can become handoff items.", "Supports workflow."],
      ["Future states", "The UI can later add beta-eligible without redesign.", "Keeps path open."]
    ]
  },
  {
    version: "v1.9.2",
    badge: "v1.9.2 handoff",
    slug: "handoffbuilder",
    nav: "Handoff",
    title: "VedaPath Copy Handoff Builder",
    pageLabel: "Copy handoff",
    eyebrow: "Reviewer handoff",
    h1: "Turn search results into reviewer-ready notes.",
    lead: "A copy handoff builder that summarizes selected search context into a short review note for source, rights, category, and boundary work.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Copy handoff prototype, not live ticket creation.",
    progress: 88,
    next: "Mobile Search Polish",
    defaultQuery: "blocked",
    primaryAsk: "Make search useful for reviewers without creating a backend workflow yet.",
    summary: "Copy Handoff Builder turns beta search into an operations bridge, giving reviewers compact context without hidden automation.",
    items: [
      ["Handoff text", "Release, query, result count, source candidates, and boundary summary.", "Makes review portable."],
      ["No ticket claim", "Copy text is not a submitted support ticket.", "Keeps scope honest."],
      ["Review focus", "Source, rights, category, and boundary are named.", "Guides reviewer attention."],
      ["Privacy note", "No user personal context is included.", "Protects users."]
    ]
  },
  {
    version: "v1.9.3",
    badge: "v1.9.3 mobile",
    slug: "mobilesearch",
    nav: "Mobile",
    title: "VedaPath Mobile Search Polish",
    pageLabel: "Mobile search polish",
    eyebrow: "Mobile UX",
    h1: "Make beta search calm on a small screen.",
    lead: "A mobile search polish pass that keeps input, filters, results, and handoff readable on phone-size layouts.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Responsive polish, not native app release.",
    progress: 89,
    next: "Interactive Beta Search Control Room",
    defaultQuery: "source",
    primaryAsk: "Keep the beta search workflow usable without forcing dense desktop controls onto mobile.",
    summary: "Mobile Search Polish protects VedaPath's simplicity promise by keeping search usable and readable on small screens.",
    items: [
      ["Single column", "Search controls and results stack cleanly.", "Keeps reading calm."],
      ["Stable controls", "Inputs and chips do not shift the layout unpredictably.", "Prevents friction."],
      ["Readable cards", "Source, family, review, and boundary stay scannable.", "Protects trust."],
      ["Copy area", "Handoff text remains available without crowding the result list.", "Supports action."]
    ]
  },
  {
    version: "v1.9.4",
    badge: "v1.9.4 search",
    slug: "searchconsole",
    nav: "Search",
    title: "VedaPath Interactive Beta Search Control Room",
    pageLabel: "Interactive beta search",
    eyebrow: "Search control",
    h1: "Make the first beta seed searchable, but not overclaimed.",
    lead: "A control room for browser-only beta search across seed records and question fixtures, with visible review, rights, fallback, and handoff boundaries.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Interactive search control, not production retrieval.",
    progress: 90,
    next: "Founder instruction",
    defaultQuery: "beta",
    primaryAsk: "Choose whether the next sprint builds reviewer workflow, hosted backend storage, or public beta onboarding.",
    summary: "Interactive Beta Search Control Room completes the browser-only search sprint and makes the static beta seed usable without pretending it is production retrieval.",
    items: [
      ["Search path", "Seed records and fixtures can be searched in-browser.", "Makes the beta tangible."],
      ["Trust path", "Review state, rights state, blocked claims, and no-answer boundaries stay visible.", "Protects credibility."],
      ["Handoff path", "Search context can become a reviewer-ready copy note.", "Supports improvement."],
      ["Next path", "Reviewer workflow, hosted backend, or public onboarding can come next.", "Keeps the build decision clear."]
    ]
  }
];

const uptoArg = process.argv.find((arg) => arg.startsWith("--upto="));
const upto = uptoArg ? Number.parseInt(uptoArg.split("=")[1], 10) : releases.length - 1;

if (!Number.isInteger(upto) || upto < 0 || upto >= releases.length) {
  throw new Error(`Use --upto=0 through --upto=${releases.length - 1}`);
}

const visible = releases.slice(0, upto + 1);
const future = releases.slice(upto + 1);
const active = visible.at(-1);

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  return readFileSync(file(rel), utf8);
}

function write(rel, content) {
  const out = file(rel);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, content, utf8);
}

function safeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function shortTitle(item) {
  return item.title.replace(/^VedaPath\s+/, "");
}

function docName(item) {
  return shortTitle(item).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, body, insertAfter) {
  const block = `${start}\n${body}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), block);
  }
  if (insertAfter && content.includes(insertAfter)) {
    return content.replace(insertAfter, `${insertAfter}\n${block}`);
  }
  return `${content.trimEnd()}\n\n${block}\n`;
}

function modesFor(item) {
  return {
    brief: [
      ["Search promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No retrieval claim", "Do not imply live semantic retrieval, backend storage, or AI generation."],
      ["No approval claim", "Do not imply seed records are reviewed, public answer eligible, or complete corpus coverage."],
      ["No authority claim", "Do not present VedaPath as a guru, therapist, ritual authority, emergency service, or replacement for teachers and tradition."]
    ]
  };
}

function sprintNav(prefix = "", rel = "") {
  return visible.map((item) => {
    const activeClass = rel === `${item.slug}.html` ? " active" : "";
    return `          <a class="link${activeClass}" href="${prefix}${item.slug}.html">${item.nav}</a>`;
  }).join("\n");
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV END -->", `          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("<span class=\"version\">")) {
    content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  }
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

function pageHtml(item) {
  const rooms = visible.map(({ version, slug, nav }) => ({ version, slug, nav }));
  const data = { ...item, modes: modesFor(item), rooms };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${item.title}</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-beta-search.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>${item.pageLabel}</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="datasetconsole.html">Dataset</a>
          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Interactive beta search sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn the static beta seed into a searchable, inspectable browser-only beta surface.</p>
          <div class="room-list" id="roomList"></div>
        </aside>

        <section class="panel">
          <div class="hero-grid">
            <div>
              <span class="eyebrow">${item.eyebrow}</span>
              <h1>${item.h1}</h1>
              <p class="muted">${item.lead}</p>
            </div>
            <div class="mark-stage">
              <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath ${item.nav} logo">
            </div>
          </div>

          <div class="source-block" aria-label="Release source card">
            <div>
              <span class="source-meta">Release</span>
              <span class="source-value">${item.version}</span>
            </div>
            <div>
              <span class="source-meta">Source candidate</span>
              <span class="source-value">${item.source}</span>
            </div>
            <div>
              <span class="source-meta">Text family</span>
              <span class="source-value">${item.family}</span>
            </div>
            <div>
              <span class="source-meta">Boundary</span>
              <span class="source-value">${item.stance}</span>
            </div>
          </div>

          <section class="beta-search" id="betaSearch" data-default-query="${item.defaultQuery}" aria-label="Interactive beta search">
            <div class="search-head">
              <div>
                <span class="eyebrow">Browser-only seed search</span>
                <h2>Search Beta Seed</h2>
                <p class="muted">Reads <strong>data/vedapath-beta-seed.json</strong> and <strong>data/vedapath-question-fixtures.json</strong>. Prototype records are not public answer eligible.</p>
              </div>
              <div id="betaSearchStats" class="search-stats" aria-live="polite"></div>
            </div>
            <label class="search-label" for="betaSearchInput">Search source, family, boundary, or blocked claim</label>
            <div class="search-row">
              <input id="betaSearchInput" class="search-input" type="search" autocomplete="off" value="${item.defaultQuery}" placeholder="Try Gita, review, therapy, source">
              <button class="button primary" id="betaSearchButton" type="button">Search</button>
            </div>
            <div class="query-chips" id="betaSearchChips" aria-label="Quick searches"></div>
            <div class="result-grid" id="betaSearchResults"></div>
            <label class="search-label" for="betaSearchHandoff">Reviewer handoff preview</label>
            <textarea id="betaSearchHandoff" readonly aria-label="Search handoff output"></textarea>
          </section>

          <h2>Search Signals</h2>
          <div class="item-list" id="itemList"></div>

          <div class="tabs" role="tablist" aria-label="${item.title} layers">
            <button class="tab active" type="button" data-mode="brief">Brief</button>
            <button class="tab" type="button" data-mode="checklist">Checklist</button>
            <button class="tab" type="button" data-mode="boundary">Boundary</button>
          </div>

          <div id="modePanel"></div>

          <div class="button-row" style="margin-top: 14px;">
            <button class="button primary" id="copyBrief" type="button">Copy Brief</button>
            <button class="button safe" id="copyJson" type="button">Copy JSON</button>
            <button class="button" id="copyBoundary" type="button">Copy Boundary</button>
          </div>

          <textarea id="output" readonly aria-label="${item.title} output"></textarea>
        </section>

        <aside class="panel tight" aria-label="${item.title} sprint rail">
          <span class="badge green">Browser-only search</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.progress} percent">
            <div class="bar" style="--score:${item.progress}%"></div>
          </div>
          <div class="metric-grid">
            <div class="metric">
              <span>Current</span>
              <strong>${item.version}</strong>
            </div>
            <div class="metric">
              <span>Sprint</span>
              <strong>${visible.length}/10</strong>
            </div>
            <div class="metric">
              <span>Progress</span>
              <strong>${item.progress}%</strong>
            </div>
            <div class="metric">
              <span>Next</span>
              <strong>${item.next}</strong>
            </div>
          </div>

          <div class="sprint-list">
            <div class="sprint-step active">
              <span class="step-index">1</span>
              <div><strong>Search</strong><p>Read the static seed.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Explain</strong><p>Show match reasons.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Bound</strong><p>Keep review and no-go claims visible.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Handoff</strong><p>Copy reviewer context.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Search Boundary</h2>
            <p class="muted">This is browser-only search over prototype seed data. It is not production retrieval, live AI generation, a reviewed corpus, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-beta-search.js"></script>
  </body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Source Candidate

- Source: ${item.source}
- Text family: ${item.family}
- Boundary: ${item.stance}

## Search Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function writeSearchAssets() {
  write("assets/vedapath-beta-search.css", `/* VedaPath interactive beta search */
.beta-search {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.86);
}

.search-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 240px);
  gap: 14px;
  align-items: start;
}

.search-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stat-card, .result-card, .fixture-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.stat-card {
  padding: 10px;
}

.stat-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.stat-card strong {
  display: block;
  font-size: 22px;
  line-height: 1.1;
}

.search-label {
  display: block;
  margin: 14px 0 6px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.search-input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px 12px;
}

.query-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.query-chip {
  min-height: 34px;
  border: 1px solid #efb899;
  border-radius: 999px;
  background: var(--surface);
  color: var(--ochre);
  padding: 7px 10px;
  font-weight: 850;
}

.result-grid {
  display: grid;
  gap: 10px;
}

.result-card {
  padding: 13px;
  border-left: 4px solid var(--bhagwa);
}

.fixture-card {
  padding: 12px;
  border-left: 4px solid var(--green);
}

.result-card h3, .fixture-card h3 {
  margin-bottom: 6px;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 8px 0;
}

.result-meta span {
  display: inline-flex;
  min-height: 27px;
  align-items: center;
  border-radius: 999px;
  padding: 4px 8px;
  background: var(--soft-red);
  color: var(--ochre);
  font-size: 12px;
  font-weight: 850;
}

.result-meta span.safe {
  background: var(--soft-green);
  color: var(--green);
}

.match-note {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 760px) {
  .search-head, .search-row, .search-stats { grid-template-columns: 1fr; }
}
`);

  write("assets/vedapath-beta-search.js", `const betaSearchRoot = document.getElementById("betaSearch");

if (betaSearchRoot) {
  initBetaSearch().catch((error) => {
    betaSearchRoot.innerHTML = '<p class="muted">Search preview could not load the local seed files.</p>';
    console.error(error);
  });
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function text(value) {
  return String(value || "");
}

function fieldBlob(record) {
  return [
    record.title,
    record.source_candidate,
    record.text_family,
    record.status,
    record.review_state,
    record.rights_state,
    record.boundary,
    record.summary,
    ...(record.allowed_intents || []),
    ...(record.blocked_claims || [])
  ].map(text).join(" ").toLowerCase();
}

function matchReason(record, query) {
  const needle = query.toLowerCase();
  const checks = [
    ["title", record.title],
    ["source", record.source_candidate],
    ["family", record.text_family],
    ["summary", record.summary],
    ["boundary", record.boundary],
    ["intent", (record.allowed_intents || []).join(" ")],
    ["blocked claim", (record.blocked_claims || []).join(" ")]
  ];
  const hit = checks.find((row) => text(row[1]).toLowerCase().includes(needle));
  return hit ? "Matched " + hit[0] + "." : "Shown as part of the beta seed.";
}

function fixtureBlob(fixture) {
  return [
    fixture.question,
    fixture.expected_route,
    fixture.expected_source_candidate,
    fixture.expected_boundary
  ].map(text).join(" ").toLowerCase();
}

function renderStats(root, records, fixtures, results) {
  root.querySelector("#betaSearchStats").innerHTML = [
    ["Seed", records.length],
    ["Fixtures", fixtures.length],
    ["Results", results.length],
    ["Eligible", records.filter((record) => record.public_answer_eligible).length]
  ].map((row) => '<div class="stat-card"><span>' + row[0] + '</span><strong>' + row[1] + '</strong></div>').join("");
}

function resultCard(record, query) {
  return '<article class="result-card">' +
    '<h3>' + record.title + '</h3>' +
    '<p class="muted">' + record.summary + '</p>' +
    '<div class="result-meta">' +
      '<span>' + record.release + '</span>' +
      '<span class="safe">' + record.text_family + '</span>' +
      '<span>' + record.review_state + '</span>' +
      '<span>' + record.rights_state + '</span>' +
      '<span>eligible: ' + String(record.public_answer_eligible) + '</span>' +
    '</div>' +
    '<p><strong>Source:</strong> ' + record.source_candidate + '</p>' +
    '<p><strong>Boundary:</strong> ' + record.boundary + '</p>' +
    '<p class="match-note">' + matchReason(record, query) + '</p>' +
  '</article>';
}

function fixtureCard(fixture) {
  return '<article class="fixture-card">' +
    '<h3>Fixture: ' + fixture.expected_route + '</h3>' +
    '<p>' + fixture.question + '</p>' +
    '<p class="muted">Expected source: ' + fixture.expected_source_candidate + '</p>' +
    '<p class="match-note">Reviewer needed: ' + String(fixture.reviewer_needed) + '</p>' +
  '</article>';
}

function handoffText(query, results, fixtures) {
  const top = results.slice(0, 3).map((record) => '- ' + record.title + ' | ' + record.source_candidate + ' | ' + record.review_state);
  return [
    'VedaPath Beta Search Handoff',
    'Query: ' + query,
    'Result count: ' + results.length,
    'Fixture matches: ' + fixtures.length,
    '',
    'Top records:',
    ...(top.length ? top : ['- No matching source records. Use fallback copy.']),
    '',
    'Boundary: prototype seed search only; not production retrieval, reviewed corpus coverage, or live AI generation.'
  ].join('\\n');
}

async function initBetaSearch() {
  const seed = await loadJson("data/vedapath-beta-seed.json");
  const fixtureData = await loadJson("data/vedapath-question-fixtures.json");
  const records = seed.records || [];
  const fixtures = fixtureData.fixtures || [];
  const input = betaSearchRoot.querySelector("#betaSearchInput");
  const resultsNode = betaSearchRoot.querySelector("#betaSearchResults");
  const handoff = betaSearchRoot.querySelector("#betaSearchHandoff");
  const chips = ["beta", "Gita", "Upanishad", "review", "rights", "therapy", "blocked", "source"];

  betaSearchRoot.querySelector("#betaSearchChips").innerHTML = chips.map((chip) => (
    '<button class="query-chip" type="button" data-query="' + chip + '">' + chip + '</button>'
  )).join("");

  function render() {
    const query = input.value.trim() || betaSearchRoot.dataset.defaultQuery || "beta";
    const needle = query.toLowerCase();
    const recordResults = records.filter((record) => fieldBlob(record).includes(needle));
    const fixtureResults = fixtures.filter((fixture) => fixtureBlob(fixture).includes(needle)).slice(0, 2);
    renderStats(betaSearchRoot, records, fixtures, recordResults);
    resultsNode.innerHTML = [
      ...(recordResults.length ? recordResults.map((record) => resultCard(record, query)) : ['<article class="result-card"><h3>No eligible seed result</h3><p class="muted">Try a narrower source, family, review, rights, or blocked-claim query. Do not invent an answer from an empty search.</p></article>']),
      ...fixtureResults.map(fixtureCard)
    ].join("");
    handoff.value = handoffText(query, recordResults, fixtureResults);
  }

  betaSearchRoot.querySelector("#betaSearchButton").addEventListener("click", render);
  input.addEventListener("input", render);
  betaSearchRoot.querySelector("#betaSearchChips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-query]");
    if (!button) return;
    input.value = button.dataset.query;
    render();
  });
  render();
}
`);
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT LINKS START -->",
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES START -->",
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES END -->"
  );
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}

function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT NOTES START -->",
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT SUMMARY START -->",
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${168 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep the search browser-only until a real backend is approved

${shortTitle(item)} should never claim live semantic retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="searchconsole.html">Search</a>')) {
    content = content.replace('href="datasetconsole.html">Dataset</a>', 'href="datasetconsole.html">Dataset</a> | <a href="searchconsole.html">Search</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Interactive beta search sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>Interactive beta search sprint progress: ${visible.length}/10 rooms complete. The static seed can now be searched in-browser.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 50 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 50 + visible.length)}%"></div></div>
          <p>Interactive beta search path: search shell, filters, result reasons, fixture matching, fallback, evidence, review filter, handoff, and mobile polish are now mapped.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Interactive beta search sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${149 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH INTERACTIVE SEARCH SPRINT PHASES START -->",
    "            <!-- VEDAPATH INTERACTIVE SEARCH SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH STATIC BETA DATA SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${149 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.8.4 Static Beta Dataset Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Interactive beta search sprint complete" : `${visible.length}/10 interactive search rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: browser-only search, filters, result reasons, fixtures, fallbacks, evidence, review state, handoff, mobile polish.</span></li>
              <li><span class="dot"></span><span>Do not claim live retrieval, backend storage, live AI generation, reviewed corpus coverage, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing reviewer workflow, hosted backend, or public beta onboarding."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT HOME START -->",
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT HOME END -->"
  );
  write("index.html", content);
}

function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">
            <h3>${shortTitle(item)}</h3>
            <p>${item.summary}</p>
          </div>`).join("\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES START -->",
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeSearchAssets();

for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) {
  addSprintNavToHtml(rel);
}
if (existsSync(file("brand/brand-board.html"))) {
  addSprintNavToHtml("brand/brand-board.html", "../");
}

updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();

console.log(`Generated interactive-search sprint through ${active.version} (${visible.length}/10).`);
