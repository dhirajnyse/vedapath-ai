import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.6.5",
    badge: "v1.6.5 schema",
    slug: "sourcecontract",
    nav: "Schema",
    title: "VedaPath Source Schema Contract",
    pageLabel: "Source schema contract",
    eyebrow: "Implementation contract",
    h1: "Make source truth machine-readable.",
    lead: "A source schema contract that names the minimum fields needed before a passage can support a beta answer.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Schema contract, not a complete source database.",
    progress: 61,
    next: "Static Dataset Loader",
    primaryAsk: "Approve the smallest source record shape that can survive beta scrutiny.",
    summary: "Source Schema Contract turns VedaPath's trust language into fields a real implementation can validate.",
    items: [
      ["Identity fields", "id, title, citation, family, section, and source note.", "Makes every record traceable."],
      ["Review fields", "review state, reviewer lane, rights state, and confidence basis.", "Makes trust inspectable."],
      ["Answer scope", "allowed intents, blocked claims, fallback copy, and risk tags.", "Keeps answers narrow."],
      ["Change log", "created date, last review, decision note, and retired state.", "Makes edits auditable."]
    ]
  },
  {
    version: "v1.6.6",
    badge: "v1.6.6 loader",
    slug: "datasetloader",
    nav: "Loader",
    title: "VedaPath Static Dataset Loader",
    pageLabel: "Static dataset loader",
    eyebrow: "Data loading",
    h1: "Load only records that pass the gate.",
    lead: "A static dataset loader preview for importing reviewed source records while rejecting missing fields, blocked rights, or unsafe answer scopes.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Static loader demo, not production ingestion.",
    progress: 62,
    next: "Retrieval Scoring Harness",
    primaryAsk: "Prove that draft records cannot silently become public answer fuel.",
    summary: "Static Dataset Loader gives VedaPath a safe first ingestion path before any backend or account system exists.",
    items: [
      ["Validation", "Required fields, allowed families, and citation format are checked.", "Prevents broken records."],
      ["Eligibility", "Draft, blocked, rights-needed, and specialist-needed records stay out of public answers.", "Protects output."],
      ["Import report", "Accepted, held, blocked, and duplicate records are counted.", "Makes QA visible."],
      ["Fallback pack", "No-source and reviewer-needed examples ship with the dataset.", "Prevents invention."]
    ]
  },
  {
    version: "v1.6.7",
    badge: "v1.6.7 scoring",
    slug: "retrievalscoring",
    nav: "Scoring",
    title: "VedaPath Retrieval Scoring Harness",
    pageLabel: "Retrieval scoring",
    eyebrow: "Retrieval logic",
    h1: "Score match quality without hiding judgment.",
    lead: "A retrieval scoring harness that explains why one source candidate was selected, held, or rejected.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Scoring harness, not production semantic search.",
    progress: 63,
    next: "Answer Assembly Contract",
    primaryAsk: "Make retrieval scoring readable enough for both users and reviewers.",
    summary: "Retrieval Scoring Harness maps match strength, source eligibility, risk, and fallback behavior into an inspectable decision.",
    items: [
      ["Intent match", "Question route is compared to allowed source intents.", "Avoids wrong answer lanes."],
      ["Concept match", "Topic tags, Sanskrit concepts, and plain-language terms are compared.", "Keeps retrieval useful."],
      ["Trust weight", "Review state and confidence basis adjust the result.", "Keeps quality above volume."],
      ["Reject reason", "No match, unsafe scope, rights hold, or reviewer-needed appears plainly.", "Keeps failure honest."]
    ]
  },
  {
    version: "v1.6.8",
    badge: "v1.6.8 assembly",
    slug: "answerassembly",
    nav: "Assembly",
    title: "VedaPath Answer Assembly Contract",
    pageLabel: "Answer assembly",
    eyebrow: "Answer contract",
    h1: "Assemble the answer from trusted parts.",
    lead: "An answer assembly contract that defines which source fields become direct answer, evidence card, confidence reason, and boundary line.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Assembly contract, not live AI generation.",
    progress: 64,
    next: "Evaluation Fixture Lab",
    primaryAsk: "Lock the answer structure before connecting any model-powered writing.",
    summary: "Answer Assembly Contract gives VedaPath a repeatable output shape that can be tested before it becomes generative.",
    items: [
      ["Direct answer", "Short answer text must be supported by an eligible source record.", "Keeps response grounded."],
      ["Evidence card", "Citation, family, review state, basis, and confidence reason stay visible.", "Keeps trust near the answer."],
      ["Depth slots", "Plain meaning, Sanskrit note, commentary note, and debate note stay separated.", "Prevents flattening."],
      ["Boundary slot", "No-go claim and next safe step are required.", "Keeps humility built in."]
    ]
  },
  {
    version: "v1.6.9",
    badge: "v1.6.9 eval",
    slug: "fixturelab",
    nav: "Fixtures",
    title: "VedaPath Evaluation Fixture Lab",
    pageLabel: "Evaluation fixture lab",
    eyebrow: "Quality checks",
    h1: "Test the answer before trusting the answer.",
    lead: "An evaluation fixture lab for source category confusion, unsupported claims, missing boundary, and unsafe calm-path language.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Evaluation fixture demo, not automated certification.",
    progress: 65,
    next: "Rights and Translation Gate",
    primaryAsk: "Create visible test cases for the errors VedaPath must never normalize.",
    summary: "Evaluation Fixture Lab turns product risk into repeatable checks, making trust measurable before launch.",
    items: [
      ["Category check", "Gita, Veda, Upanishad, Purana, commentary, and modern interpretation are tested separately.", "Prevents source confusion."],
      ["Support check", "Every direct answer must map to source support or fallback.", "Blocks unsupported confidence."],
      ["Boundary check", "Therapy, ritual, science, and personal crisis claims require visible limits.", "Keeps users safe."],
      ["Regression pack", "Known mistakes become fixtures before public release.", "Protects future builds."]
    ]
  },
  {
    version: "v1.7.0",
    badge: "v1.7.0 rights",
    slug: "rightsgate",
    nav: "Rights",
    title: "VedaPath Rights and Translation Gate",
    pageLabel: "Rights gate",
    eyebrow: "Rights and language",
    h1: "Respect the text before displaying the text.",
    lead: "A rights and translation gate that separates citation, paraphrase, public-domain text, licensed text, and reviewer-needed language.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Rights gate demo, not legal advice.",
    progress: 66,
    next: "Reviewer Workflow Board",
    primaryAsk: "Prevent VedaPath from mixing citation confidence with display rights.",
    summary: "Rights and Translation Gate gives VedaPath a practical way to cite carefully while avoiding careless text display.",
    items: [
      ["Display mode", "Citation only, paraphrase, public-domain excerpt, licensed excerpt, or hidden text.", "Separates use cases."],
      ["Translation note", "Translator, source, review state, and date are named when available.", "Adds context."],
      ["Rights hold", "Unclear or restricted text can still inform internal review but cannot be shown publicly.", "Protects launch."],
      ["Reviewer lane", "Language issues route to Sanskrit, translation, or scholarly review.", "Improves accuracy."]
    ]
  },
  {
    version: "v1.7.1",
    badge: "v1.7.1 review",
    slug: "reviewworkflow",
    nav: "Review",
    title: "VedaPath Reviewer Workflow Board",
    pageLabel: "Reviewer workflow",
    eyebrow: "Human review",
    h1: "Let review change what users see.",
    lead: "A reviewer workflow board that turns tickets and source gaps into public answer states: approved, held, blocked, retired, or released.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Workflow board demo, not actual reviewer approval.",
    progress: 67,
    next: "Beta User Consent Gate",
    primaryAsk: "Design the workflow that decides when a source record can power public answers.",
    summary: "Reviewer Workflow Board makes human review operational: scoped decisions create visible product behavior.",
    items: [
      ["Queue columns", "New, triaged, reviewer-needed, held, approved, blocked, and released.", "Makes work visible."],
      ["Decision scope", "Source, language, boundary, rights, or answer release.", "Prevents broad endorsement."],
      ["Public effect", "Display, lower confidence, hide, fallback, or release.", "Connects review to UX."],
      ["Audit trail", "Decision note, ticket link, reviewer lane, and date.", "Keeps changes accountable."]
    ]
  },
  {
    version: "v1.7.2",
    badge: "v1.7.2 consent gate",
    slug: "betaconsent",
    nav: "Consent",
    title: "VedaPath Beta User Consent Gate",
    pageLabel: "Beta consent gate",
    eyebrow: "Beta consent",
    h1: "Ask permission before the product remembers.",
    lead: "A beta consent gate that separates anonymous browsing, local-only memory, account sync, review sharing, and product updates.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Consent gate demo, not account storage.",
    progress: 68,
    next: "Launch Readiness Checklist",
    primaryAsk: "Make beta participation reversible, specific, and understandable.",
    summary: "Beta User Consent Gate protects the calm experience by making memory, sharing, contact, export, and deletion explicit.",
    items: [
      ["Consent choices", "Local-only, sync later, reviewer-visible, email updates, or no memory.", "Keeps permission specific."],
      ["Data preview", "Show the exact preference, reflection, or learning state before saving.", "Creates clarity."],
      ["Exit path", "Clear local preview, export, delete, pause, and unsubscribe.", "Preserves agency."],
      ["Sensitive guard", "No medical, crisis, private family, or identity-heavy stories in beta memory.", "Protects users."]
    ]
  },
  {
    version: "v1.7.3",
    badge: "v1.7.3 readiness",
    slug: "betareadiness",
    nav: "Ready",
    title: "VedaPath Launch Readiness Checklist",
    pageLabel: "Launch readiness",
    eyebrow: "Beta readiness",
    h1: "Launch only what the team can explain.",
    lead: "A launch readiness checklist for source data, retrieval behavior, answer fixtures, review workflow, consent, privacy, and public copy.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Readiness checklist, not public launch approval.",
    progress: 69,
    next: "Beta Implementation Control Room",
    primaryAsk: "Define the checklist that must be green before a public beta invite.",
    summary: "Launch Readiness Checklist gives VedaPath a calm gate: no beta until data, trust, consent, and support boundaries are explainable.",
    items: [
      ["Data ready", "Schema, loader, reviewed seed, rights state, and fixture pack exist.", "Validates source inputs."],
      ["Answer ready", "Retrieval, assembly, confidence, and boundary checks pass.", "Validates output."],
      ["People ready", "Reviewer workflow, correction loop, privacy note, and support boundary are visible.", "Validates operations."],
      ["Public ready", "Landing copy, beta status, no-go claims, and feedback route are clear.", "Validates launch story."]
    ]
  },
  {
    version: "v1.7.4",
    badge: "v1.7.4 implementation",
    slug: "implementationconsole",
    nav: "Implement",
    title: "VedaPath Beta Implementation Control Room",
    pageLabel: "Beta implementation",
    eyebrow: "Implementation control",
    h1: "Choose the first beta path with calm precision.",
    lead: "A beta implementation control room that ties schema, loader, retrieval scoring, answer assembly, evaluation, rights, review, consent, and readiness into one build path.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Implementation control, not production launch.",
    progress: 70,
    next: "Founder instruction",
    primaryAsk: "Choose whether the next sprint builds static beta data, hosted backend storage, or reviewer workflow first.",
    summary: "Beta Implementation Control Room completes the implementation-path sprint and prepares VedaPath for a serious first beta build decision.",
    items: [
      ["Build path", "Static beta data, hosted backend storage, or reviewer workflow.", "Makes the next decision explicit."],
      ["Trust path", "Schema, fixtures, rights gate, confidence rules, and review workflow.", "Keeps quality central."],
      ["User path", "Consent gate, feedback queue, export/delete, and clear public status.", "Protects agency."],
      ["Launch path", "Readiness checklist and no-go claims decide what can be shown publicly.", "Keeps the launch honest."]
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
      ["Implementation promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No production claim", "Do not imply live backend storage, live AI generation, public corpus coverage, or completed beta launch."],
      ["No authority claim", "Do not present VedaPath as a guru, therapist, ritual authority, emergency service, or replacement for teachers and tradition."],
      ["No hidden consent", "Do not save, sync, share, or review user context without explicit visible permission and exit controls."]
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
  const start = "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH WORKING DATA SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH WORKING DATA SPRINT NAV END -->", `          <!-- VEDAPATH WORKING DATA SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="workingconsole.html">Working MVP</a>
          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Beta implementation sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms move VedaPath from working data demo toward a first real beta implementation choice.</p>
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

          <h2>Implementation Signals</h2>
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
          <span class="badge green">Implementation path</span>
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
              <div><strong>Contract</strong><p>Define source and answer rules.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Quality</strong><p>Run retrieval and fixture gates.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>People</strong><p>Route review and consent.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Beta</strong><p>Choose the first implementation path.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is an implementation-path prototype. It does not create production storage, live AI generation, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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

## Implementation Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## No-Go Boundary

This release should not imply production storage, live AI generation, public launch approval, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT LINKS START -->",
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH WORKING DATA SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES START -->",
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH WORKING DATA SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT NOTES START -->",
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH WORKING DATA SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT SUMMARY START -->",
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH WORKING DATA SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${148 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable beta-implementation handoff

${shortTitle(item)} should never claim production storage, live AI generation, public launch approval, authentication, licensed source text, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH BETA IMPLEMENTATION SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH WORKING DATA SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="implementationconsole.html">Implementation</a>')) {
    content = content.replace('href="workingconsole.html">Working MVP</a>', 'href="workingconsole.html">Working MVP</a> | <a href="implementationconsole.html">Implementation</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Beta implementation sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>${Math.min(100, 80 + visible.length * 2)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 80 + visible.length * 2)}%"></div></div>
          <p>Implementation-path sprint progress: ${visible.length}/10 rooms complete. Next: choose a real beta build path.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 30 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 30 + visible.length)}%"></div></div>
          <p>Beta implementation path: schema, loader, retrieval scoring, answer assembly, evaluation, rights, review, consent, and readiness are now mapped.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Beta implementation sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${129 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH BETA IMPLEMENTATION SPRINT PHASES START -->",
    "            <!-- VEDAPATH BETA IMPLEMENTATION SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH WORKING DATA SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${129 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.6.4 Working MVP Console"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Beta implementation sprint complete" : `${visible.length}/10 implementation rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: source schema, loader, retrieval, answer assembly, evaluation, rights, review, consent, readiness.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, live AI generation, public launch approval, authentication, licensed source text, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing static beta data, hosted backend storage, or reviewer workflow."}</span></li>
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
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT HOME START -->",
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH WORKING DATA SPRINT HOME END -->"
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
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES START -->",
    "          <!-- VEDAPATH BETA IMPLEMENTATION SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH WORKING DATA SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}

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

console.log(`Generated beta-implementation sprint through ${active.version} (${visible.length}/10).`);
