import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.7.5",
    badge: "v1.7.5 seed data",
    slug: "betasourcepack",
    nav: "Seed",
    title: "VedaPath Beta Source Seed Pack",
    pageLabel: "Beta source seed",
    eyebrow: "Static beta data",
    h1: "Begin beta with records we can inspect.",
    lead: "A first static beta source seed that treats every passage as a reviewable product record, not loose inspirational content.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Static candidate seed, not verified public corpus coverage.",
    progress: 71,
    next: "Question Fixture Set",
    primaryAsk: "Start the beta dataset with records that have source identity, review state, allowed intents, and blocked claims.",
    summary: "Beta Source Seed Pack creates the first concrete source inventory for VedaPath's beta data path.",
    items: [
      ["Source record", "Citation, family, title, topic tags, and source note.", "Creates stable inventory."],
      ["Review state", "Prototype, review-needed, rights-needed, or eligible-for-beta.", "Keeps claims honest."],
      ["Allowed intents", "Lookup, reflection, category check, comparison, or no-answer.", "Controls use."],
      ["Blocked claims", "Therapy, ritual authority, science proof, and broad tradition claims.", "Protects users."]
    ]
  },
  {
    version: "v1.7.6",
    badge: "v1.7.6 fixtures",
    slug: "questionfixtures",
    nav: "Questions",
    title: "VedaPath Question Fixture Set",
    pageLabel: "Question fixtures",
    eyebrow: "Beta question set",
    h1: "Turn user questions into test fixtures.",
    lead: "A fixture set for the first beta questions, with expected route, source need, risk type, and no-answer behavior.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Question fixture demo, not production evaluation coverage.",
    progress: 72,
    next: "Topic Map Board",
    primaryAsk: "Capture the questions the first beta must answer, refuse, or route to review.",
    summary: "Question Fixture Set gives VedaPath a repeatable way to test whether source routing and answer boundaries are improving.",
    items: [
      ["Question text", "Plain-language user question plus normalized intent.", "Keeps tests human."],
      ["Expected route", "Source lookup, claim check, calm reflection, compare, or no-answer.", "Checks routing."],
      ["Expected source", "Citation candidate or reviewer-needed fallback.", "Checks retrieval."],
      ["Expected boundary", "What the answer must not imply.", "Checks humility."]
    ]
  },
  {
    version: "v1.7.7",
    badge: "v1.7.7 topic map",
    slug: "topicmap",
    nav: "Topics",
    title: "VedaPath Beta Topic Map Board",
    pageLabel: "Beta topic map",
    eyebrow: "Topic mapping",
    h1: "Map the beta before expanding the world.",
    lead: "A topic map board for the first beta lanes: action, steadiness, source categories, claim checking, and calm reflection.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Topic map prototype, not full tradition taxonomy.",
    progress: 73,
    next: "Category Safety Matrix",
    primaryAsk: "Keep the beta narrow enough that source coverage, review, and user expectations stay aligned.",
    summary: "Beta Topic Map Board prevents VedaPath from drifting into broad coverage before its first trusted lanes are ready.",
    items: [
      ["Topic lane", "Action, steadiness, source category, claim check, or reflection.", "Keeps scope clear."],
      ["Source family", "Gita, Veda, Upanishad, commentary, modern view, or uncertain.", "Prevents category blur."],
      ["Coverage state", "Seeded, sparse, review-needed, or out of beta scope.", "Shows gaps."],
      ["Next record", "The source candidate that would improve the lane next.", "Guides curation."]
    ]
  },
  {
    version: "v1.7.8",
    badge: "v1.7.8 matrix",
    slug: "categorymatrix",
    nav: "Matrix",
    title: "VedaPath Category Safety Matrix",
    pageLabel: "Category matrix",
    eyebrow: "Category safety",
    h1: "Separate source family before meaning.",
    lead: "A category safety matrix for Veda, Upanishad, Gita, Itihasa, Purana, commentary, academic view, and modern interpretation.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Category matrix, not universal classification authority.",
    progress: 74,
    next: "No-Answer Fallback Set",
    primaryAsk: "Make category confusion visible before users receive a confident answer.",
    summary: "Category Safety Matrix gives VedaPath a simple way to stop popular-culture shortcuts from becoming product truth.",
    items: [
      ["Source label", "Each answer must say where it stands.", "Builds trust."],
      ["Common confusion", "Gita vs Veda, Upanishad vs Veda, tradition vs text, analogy vs claim.", "Catches mistakes."],
      ["Correction copy", "Gentle correction without shaming the user.", "Keeps tone calm."],
      ["Hold rule", "Uncertain category routes to reviewer or low confidence.", "Prevents false clarity."]
    ]
  },
  {
    version: "v1.7.9",
    badge: "v1.7.9 fallbacks",
    slug: "fallbackset",
    nav: "Fallbacks",
    title: "VedaPath No-Answer Fallback Set",
    pageLabel: "No-answer fallbacks",
    eyebrow: "Fallback design",
    h1: "A careful no is part of trust.",
    lead: "A fallback set for no-source, category uncertainty, unsafe personal context, rights hold, and reviewer-needed states.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Fallback copy demo, not safety certification.",
    progress: 75,
    next: "Static Search Prototype",
    primaryAsk: "Design refusals and fallback states that feel respectful, useful, and clearly bounded.",
    summary: "No-Answer Fallback Set makes VedaPath safer by treating refusal as a designed product moment, not an error.",
    items: [
      ["No source", "Say no eligible source is available and offer a narrow next question.", "Avoids invention."],
      ["Uncertain category", "Name uncertainty and route to review.", "Avoids false correction."],
      ["Sensitive context", "Avoid therapy, crisis, legal, medical, or family advice.", "Protects users."],
      ["Rights hold", "Cite identity without showing restricted text.", "Respects source use."]
    ]
  },
  {
    version: "v1.8.0",
    badge: "v1.8.0 search",
    slug: "staticsearch",
    nav: "Search",
    title: "VedaPath Static Source Search Prototype",
    pageLabel: "Static source search",
    eyebrow: "Static search",
    h1: "Search the seed before asking the model.",
    lead: "A static search prototype that filters the beta seed by topic, source family, intent, review state, and blocked claim.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Static search prototype, not live semantic retrieval.",
    progress: 76,
    next: "Answer Preview Lab",
    primaryAsk: "Prove that the first beta can find candidate records without guessing.",
    summary: "Static Source Search Prototype gives VedaPath a visible bridge from curated seed data to source-first answer retrieval.",
    items: [
      ["Filter fields", "Topic, family, intent, review state, and risk tag.", "Makes search transparent."],
      ["Result reason", "Explain why a record matched the question.", "Builds confidence."],
      ["Hold display", "Held records can explain why they are not eligible.", "Shows discipline."],
      ["No-result state", "A no-source fallback appears before any answer is composed.", "Prevents guessing."]
    ]
  },
  {
    version: "v1.8.1",
    badge: "v1.8.1 preview",
    slug: "answerpreview",
    nav: "Preview",
    title: "VedaPath Static Answer Preview Lab",
    pageLabel: "Answer preview",
    eyebrow: "Answer preview",
    h1: "Preview the answer from the seed record.",
    lead: "A static answer preview lab that turns one beta source record into direct answer, source card, confidence reason, and boundary line.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Static answer preview, not live model generation.",
    progress: 77,
    next: "Data Quality Console",
    primaryAsk: "Show the answer shape that a reviewed seed record can safely support.",
    summary: "Static Answer Preview Lab makes the beta answer path tangible without pretending generation or broad retrieval is live.",
    items: [
      ["Answer slot", "One direct answer constrained by the source record.", "Keeps it useful."],
      ["Evidence slot", "Citation, family, review state, and basis.", "Keeps it grounded."],
      ["Confidence slot", "High, medium, low, hold, or no-answer with reason.", "Keeps trust visible."],
      ["Boundary slot", "What not to overclaim and what to ask next.", "Keeps it humble."]
    ]
  },
  {
    version: "v1.8.2",
    badge: "v1.8.2 quality",
    slug: "dataquality",
    nav: "Quality",
    title: "VedaPath Beta Data Quality Console",
    pageLabel: "Data quality",
    eyebrow: "Data quality",
    h1: "Make data gaps visible before beta.",
    lead: "A data quality console for missing citation, weak topic map, unclear rights, missing fallback, and unresolved reviewer decision.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Quality console demo, not complete data audit.",
    progress: 78,
    next: "Beta Seed Review Pack",
    primaryAsk: "Create a visible QA board for every source record before public beta use.",
    summary: "Beta Data Quality Console turns invisible source-data risk into plain checks a founder or reviewer can inspect.",
    items: [
      ["Required fields", "Citation, family, intent, risk, review, rights, and fallback.", "Prevents incomplete records."],
      ["Quality flags", "Missing note, weak category, no boundary, rights hold, or reviewer-needed.", "Surfaces risk."],
      ["Release state", "Draft, held, beta-eligible, retired, or blocked.", "Controls public use."],
      ["Next fix", "Each gap has one owner-friendly next action.", "Keeps progress calm."]
    ]
  },
  {
    version: "v1.8.3",
    badge: "v1.8.3 review pack",
    slug: "seedreview",
    nav: "Review Pack",
    title: "VedaPath Beta Seed Review Pack",
    pageLabel: "Seed review pack",
    eyebrow: "Review handoff",
    h1: "Give reviewers a small honest pack.",
    lead: "A beta seed review pack that summarizes source records, question fixtures, blocked claims, category risks, and open review decisions.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Review handoff demo, not scholar endorsement.",
    progress: 79,
    next: "Static Beta Dataset Control Room",
    primaryAsk: "Prepare a review packet that a human can inspect without digging through the whole site.",
    summary: "Beta Seed Review Pack turns the static beta dataset into a human-readable handoff for source, language, rights, and boundary review.",
    items: [
      ["Record summary", "Each record has one-line source identity and beta purpose.", "Speeds review."],
      ["Fixture summary", "Questions expected to pass, hold, or no-answer.", "Shows behavior."],
      ["Risk summary", "Category confusion, rights hold, sensitive context, or overclaim risk.", "Focuses attention."],
      ["Decision request", "Approve, hold, block, or request evidence.", "Creates clear review."]
    ]
  },
  {
    version: "v1.8.4",
    badge: "v1.8.4 dataset",
    slug: "datasetconsole",
    nav: "Dataset",
    title: "VedaPath Static Beta Dataset Control Room",
    pageLabel: "Static beta dataset",
    eyebrow: "Dataset control",
    h1: "Let the first beta dataset stay small and trustworthy.",
    lead: "A control room for the static beta data path: source seed, question fixtures, topic map, safety matrix, fallbacks, search, preview, quality, and review handoff.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Static beta dataset control, not production corpus launch.",
    progress: 80,
    next: "Founder instruction",
    primaryAsk: "Choose whether the next sprint turns the static seed into an interactive beta search page, reviewer workflow, or hosted backend.",
    summary: "Static Beta Dataset Control Room completes the static beta data sprint and gives VedaPath a real seed-data path toward beta.",
    items: [
      ["Data path", "Seed records, topic map, category matrix, and quality checks.", "Creates trustworthy inputs."],
      ["Question path", "Fixtures, fallbacks, static search, and answer preview.", "Creates testable behavior."],
      ["Review path", "Seed review pack and open decisions.", "Creates accountable improvement."],
      ["Next path", "Interactive search, reviewer workflow, or hosted backend.", "Makes the next build choice clear."]
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

function recordId(item) {
  return `vp-${item.version.replace(/\./g, "-").replace(/^v/, "v")}-${item.slug}`;
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
      ["Dataset promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No corpus claim", "Do not imply the beta seed covers the whole Vedic or Hindu philosophical landscape."],
      ["No production claim", "Do not imply live backend storage, live semantic search, live AI generation, or public launch approval."],
      ["No authority claim", "Do not present VedaPath as a guru, therapist, ritual authority, emergency service, or replacement for teachers and tradition."]
    ]
  };
}

function sourceRecords() {
  return visible.map((item, index) => ({
    id: recordId(item),
    release: item.version,
    slug: item.slug,
    title: shortTitle(item),
    source_candidate: item.source,
    text_family: item.family,
    status: index === visible.length - 1 ? "active-prototype" : "prototype-support",
    public_answer_eligible: false,
    review_state: "review-needed",
    rights_state: "display-citation-only",
    allowed_intents: ["source_lookup", "category_check", "reflection_preview"],
    blocked_claims: ["therapy", "ritual_authority", "science_proof", "complete_corpus_coverage"],
    boundary: item.stance,
    summary: item.summary
  }));
}

function questionFixtures() {
  return visible.map((item) => ({
    id: `fixture-${item.slug}`,
    question: item.primaryAsk,
    expected_route: item.slug === "fallbackset" ? "no_answer_fallback" : "source_first_preview",
    expected_source_candidate: item.source,
    expected_boundary: item.stance,
    reviewer_needed: true
  }));
}

function writeDataFiles() {
  write("data/vedapath-beta-seed.json", `${JSON.stringify({
    product: "VedaPath AI",
    release: active.version,
    status: "static beta seed prototype",
    warning: "Prototype data only. Records are not public answer eligible until reviewed.",
    records: sourceRecords()
  }, null, 2)}\n`);
  write("data/vedapath-question-fixtures.json", `${JSON.stringify({
    product: "VedaPath AI",
    release: active.version,
    status: "question fixture prototype",
    fixtures: questionFixtures()
  }, null, 2)}\n`);
}

function sprintNav(prefix = "", rel = "") {
  return visible.map((item) => {
    const activeClass = rel === `${item.slug}.html` ? " active" : "";
    return `          <a class="link${activeClass}" href="${prefix}${item.slug}.html">${item.nav}</a>`;
  }).join("\n");
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV END -->", `          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="implementationconsole.html">Implementation</a>
          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH STATIC BETA DATA SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Static beta data sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms move VedaPath from implementation plan to a small static beta source seed.</p>
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

          <h2>Beta Data Signals</h2>
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
          <span class="badge green">Static seed path</span>
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
              <div><strong>Seed</strong><p>Record source candidates.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Test</strong><p>Fixture questions and fallbacks.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Search</strong><p>Preview static retrieval.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Review</strong><p>Package gaps for humans.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Seed Data Files</h2>
            <p class="muted">This sprint writes <strong>data/vedapath-beta-seed.json</strong> and <strong>data/vedapath-question-fixtures.json</strong> as prototype records. They are not public answer eligible until reviewed.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
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

## Beta Data Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Files

- data/vedapath-beta-seed.json
- data/vedapath-question-fixtures.json

## No-Go Boundary

This release should not imply complete corpus coverage, production storage, live semantic search, live AI generation, public launch approval, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT LINKS START -->",
    "<!-- VEDAPATH STATIC BETA DATA SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES START -->",
    "<!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH STATIC BETA DATA SPRINT NOTES START -->",
    "<!-- VEDAPATH STATIC BETA DATA SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT SUMMARY START -->",
    "<!-- VEDAPATH STATIC BETA DATA SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${158 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep source records review-needed until explicitly approved

${shortTitle(item)} should never claim complete corpus coverage, production storage, live semantic search, live AI generation, public launch approval, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH STATIC BETA DATA SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH STATIC BETA DATA SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="datasetconsole.html">Dataset</a>')) {
    content = content.replace('href="implementationconsole.html">Implementation</a>', 'href="implementationconsole.html">Implementation</a> | <a href="datasetconsole.html">Dataset</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Static beta data sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>Static beta data sprint progress: ${visible.length}/10 rooms complete. The MVP path now has prototype seed data files.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 40 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 40 + visible.length)}%"></div></div>
          <p>Static beta data path: source seed, fixtures, topic map, safety matrix, fallbacks, search, preview, quality, and review pack are now mapped.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Static beta data sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${139 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH STATIC BETA DATA SPRINT PHASES START -->",
    "            <!-- VEDAPATH STATIC BETA DATA SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH BETA IMPLEMENTATION SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${139 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.7.4 Beta Implementation Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Static beta data sprint complete" : `${visible.length}/10 static beta data rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: source seed, fixtures, topic map, safety matrix, fallbacks, search, preview, quality, review pack.</span></li>
              <li><span class="dot"></span><span>Do not claim complete corpus coverage, production backend, live semantic search, live AI generation, public launch approval, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing interactive beta search, reviewer workflow, or hosted backend."}</span></li>
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
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT HOME START -->",
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT HOME END -->"
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
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES START -->",
    "          <!-- VEDAPATH STATIC BETA DATA SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeDataFiles();

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

console.log(`Generated static-beta-data sprint through ${active.version} (${visible.length}/10).`);
