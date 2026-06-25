import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.5.5",
    badge: "v1.5.5 data pack",
    slug: "workingdata",
    nav: "Data",
    title: "VedaPath Working Source Data Pack",
    pageLabel: "Working source data",
    eyebrow: "Working data demo",
    h1: "Turn source records into product fuel.",
    lead: "A compact working data pack that shows how one source record can carry citation, family, review state, user question fit, and visible boundaries.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Static source data demo, not verified corpus coverage.",
    progress: 51,
    next: "Query Router Demo",
    primaryAsk: "Make the first source data shape concrete enough to power retrieval, answer rendering, and review.",
    summary: "Working Source Data Pack gives VedaPath a visible data spine: every answer starts from a record that can be reviewed, limited, and improved.",
    items: [
      ["Record identity", "Each entry has id, title, citation, text family, and topic tags.", "Makes source lookup stable."],
      ["Review fields", "Each entry names source review, language review, rights state, and boundary risk.", "Keeps trust visible."],
      ["Answer scope", "Each entry lists allowed questions, blocked claims, and fallback behavior.", "Prevents broad overclaim."],
      ["Beta seed", "Begin with a small reviewed pack before adding scale.", "Protects quality."]
    ]
  },
  {
    version: "v1.5.6",
    badge: "v1.5.6 router",
    slug: "queryrouter",
    nav: "Router",
    title: "VedaPath Query Router Demo",
    pageLabel: "Query router",
    eyebrow: "Question routing",
    h1: "Route the question before answering it.",
    lead: "A simple router that classifies a question as source lookup, category check, calm reflection, interpretation comparison, or reviewer-needed.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Routing prototype, not live classification.",
    progress: 52,
    next: "Local Retrieval Workspace",
    primaryAsk: "Separate question intent before retrieval so the answer can stay narrow and honest.",
    summary: "Query Router Demo makes the first invisible step visible: VedaPath should understand what kind of answer is allowed before it searches.",
    items: [
      ["Intent label", "Lookup, compare, claim-check, calm reflection, or no-answer.", "Sets the answer lane."],
      ["Risk label", "Science overclaim, therapy, ritual, category confusion, or sensitive personal context.", "Adds caution early."],
      ["Needed evidence", "Direct passage, commentary, scholarly view, or reviewer decision.", "Guides retrieval."],
      ["Fallback state", "If the question is too broad or risky, route to a careful next step.", "Protects the user."]
    ]
  },
  {
    version: "v1.5.7",
    badge: "v1.5.7 retrieval",
    slug: "retrievalworkspace",
    nav: "Retrieve",
    title: "VedaPath Local Retrieval Workspace",
    pageLabel: "Local retrieval workspace",
    eyebrow: "Retrieval workspace",
    h1: "Rank only the records that are allowed to answer.",
    lead: "A retrieval workspace that scores source candidates by eligibility, match reason, source family, review state, and boundary fit.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Local retrieval demo, not production search.",
    progress: 53,
    next: "Answer Composer Workspace",
    primaryAsk: "Show why a source candidate was selected before any answer is composed.",
    summary: "Local Retrieval Workspace gives VedaPath a practical search preview with eligible records, hold states, and visible match reasons.",
    items: [
      ["Candidate list", "Return a small list with citation, family, topic, and review state.", "Makes selection inspectable."],
      ["Match reason", "Explain the keyword, concept, or category connection.", "Builds trust."],
      ["Eligibility gate", "Blocked, rights-needed, and specialist-needed records cannot answer publicly.", "Keeps output safe."],
      ["No-source path", "When nothing fits, the product says so plainly.", "Avoids invention."]
    ]
  },
  {
    version: "v1.5.8",
    badge: "v1.5.8 composer",
    slug: "answercomposer",
    nav: "Compose",
    title: "VedaPath Answer Composer Workspace",
    pageLabel: "Answer composer",
    eyebrow: "Answer composition",
    h1: "Compose answers from source state, not confidence tone.",
    lead: "An answer composer that assembles direct answer, source card, plain meaning, deeper layer, and boundary line from source fields.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Answer composition demo, not live generation.",
    progress: 54,
    next: "Citation Evidence Panel",
    primaryAsk: "Turn the source record into a clean answer pattern before adding model generation.",
    summary: "Answer Composer Workspace connects retrieval to the user-facing answer, preserving one calm structure across source, meaning, and boundary.",
    items: [
      ["Direct answer", "One useful sentence first.", "Serves beginners."],
      ["Source card", "Citation, family, basis, confidence, and review state stay near the answer.", "Keeps grounding visible."],
      ["Depth layers", "Plain meaning appears first; Sanskrit and debate unfold on demand.", "Protects simplicity."],
      ["Boundary line", "Every answer says what not to overclaim.", "Keeps humility built in."]
    ]
  },
  {
    version: "v1.5.9",
    badge: "v1.5.9 evidence",
    slug: "evidencepanel",
    nav: "Evidence",
    title: "VedaPath Citation Evidence Panel",
    pageLabel: "Citation evidence",
    eyebrow: "Evidence panel",
    h1: "Keep evidence close to every claim.",
    lead: "A citation evidence panel that shows source identity, passage context, translation status, related claims, and review notes without crowding the main answer.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Evidence UI demo, not licensed full-text display.",
    progress: 55,
    next: "Confidence Rulebook",
    primaryAsk: "Make every serious claim inspectable without turning the first answer into a research paper.",
    summary: "Citation Evidence Panel gives VedaPath an evidence drawer that can support curiosity, correction, and scholar review while keeping the main surface calm.",
    items: [
      ["Source identity", "Text family, citation, section note, and edition note.", "Prevents category confusion."],
      ["Context window", "What the source can support and what it cannot support.", "Keeps claims bounded."],
      ["Translation state", "Draft, public-domain, licensed, or reviewer-needed.", "Protects rights and accuracy."],
      ["Related review", "Open issues, resolved decisions, and suggested corrections.", "Creates a learning loop."]
    ]
  },
  {
    version: "v1.6.0",
    badge: "v1.6.0 confidence",
    slug: "confidencerules",
    nav: "Rules",
    title: "VedaPath Confidence Rulebook",
    pageLabel: "Confidence rulebook",
    eyebrow: "Trust rules",
    h1: "Make confidence a rulebook, not a mood.",
    lead: "A confidence rulebook that turns citation basis, review state, risk type, and answer scope into clear high, medium, low, hold, or no-answer outcomes.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Confidence rules demo, not automated certification.",
    progress: 56,
    next: "Consent Memory Preview",
    primaryAsk: "Define confidence from visible rules so users can understand and challenge it.",
    summary: "Confidence Rulebook makes trust less magical: the product explains why it is confident, cautious, waiting for review, or refusing to answer.",
    items: [
      ["Basis rule", "Direct passage beats analogy; commentary and scholarly view must be labeled.", "Reduces confusion."],
      ["Review rule", "Draft or specialist-needed records lower confidence or hold the answer.", "Protects quality."],
      ["Risk rule", "Therapy, ritual, science, privacy, and identity-sensitive questions trigger extra boundaries.", "Adds care."],
      ["Outcome rule", "High, medium, low, review-needed, no-source, or no-answer.", "Makes behavior predictable."]
    ]
  },
  {
    version: "v1.6.1",
    badge: "v1.6.1 memory",
    slug: "memorypreview",
    nav: "Memory",
    title: "VedaPath Consent Memory Preview",
    pageLabel: "Consent memory",
    eyebrow: "Consent preview",
    h1: "Preview memory before storing it.",
    lead: "A consent memory preview that shows what the product would remember, why it helps, where it lives, and how the user can export or delete it.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Consent memory prototype, not account sync.",
    progress: 57,
    next: "Feedback Queue Simulator",
    primaryAsk: "Make future personalization opt-in, visible, reversible, and modest.",
    summary: "Consent Memory Preview keeps calm personal use from becoming hidden tracking: memory must be named, limited, and under user control.",
    items: [
      ["Memory preview", "Show the exact learning preference or reflection summary before saving.", "Creates consent."],
      ["Storage label", "Device-local, account sync, reviewer-visible, or never saved.", "Clarifies location."],
      ["Exit controls", "Export, pause, delete, and clear local preview.", "Preserves agency."],
      ["Sensitive block", "Medical, crisis, private family, and identity details should not enter prototype memory.", "Protects users."]
    ]
  },
  {
    version: "v1.6.2",
    badge: "v1.6.2 feedback",
    slug: "feedbackqueue",
    nav: "Feedback",
    title: "VedaPath Feedback Queue Simulator",
    pageLabel: "Feedback queue",
    eyebrow: "Correction queue",
    h1: "Turn user feedback into careful queues.",
    lead: "A feedback queue simulator that routes citation issues, category confusion, translation concerns, boundary flags, and usability friction into reviewable tickets.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Feedback queue demo, not live support intake.",
    progress: 58,
    next: "Reviewer Decision Log",
    primaryAsk: "Give users a way to improve the product without collecting sensitive personal stories.",
    summary: "Feedback Queue Simulator shows how VedaPath can learn from users through typed, privacy-light review tickets instead of silent answer rewrites.",
    items: [
      ["Ticket type", "Source, category, translation, boundary, privacy, or UX.", "Routes the work."],
      ["Evidence fields", "Page, citation, answer id, and short note.", "Makes review possible."],
      ["Privacy filter", "Warn against private medical, crisis, family, or identity details.", "Keeps intake safe."],
      ["Queue state", "New, triaged, reviewer-needed, blocked, resolved, or released.", "Creates operational clarity."]
    ]
  },
  {
    version: "v1.6.3",
    badge: "v1.6.3 decisions",
    slug: "decisionlog",
    nav: "Decisions",
    title: "VedaPath Reviewer Decision Log",
    pageLabel: "Reviewer decisions",
    eyebrow: "Review log",
    h1: "Record review decisions without making them endorsements.",
    lead: "A reviewer decision log that separates source approval, translation note, boundary correction, answer release, and public display state.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Decision log demo, not scholar endorsement.",
    progress: 59,
    next: "Working MVP Console",
    primaryAsk: "Make human review auditable while avoiding broad claims of authority.",
    summary: "Reviewer Decision Log gives VedaPath a way to publish better answers because decisions are scoped, reasoned, and visible.",
    items: [
      ["Decision lane", "Source, language, boundary, rights, answer release, or UX.", "Keeps review narrow."],
      ["Decision result", "Approve, hold, block, request evidence, retire, or release.", "Creates state."],
      ["Reason note", "Short reason tied to evidence or ticket id.", "Makes review auditable."],
      ["Public effect", "Display, lower confidence, hide answer, ask reviewer, or route fallback.", "Connects review to users."]
    ]
  },
  {
    version: "v1.6.4",
    badge: "v1.6.4 working",
    slug: "workingconsole",
    nav: "Working MVP",
    title: "VedaPath Working MVP Console",
    pageLabel: "Working MVP console",
    eyebrow: "Working MVP chain",
    h1: "Let the first working slice prove the promise.",
    lead: "A control console that ties data pack, router, retrieval, composer, evidence, confidence, consent, feedback, and reviewer decisions into one beta-ready working path.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Working MVP console, not production launch.",
    progress: 60,
    next: "Founder instruction",
    primaryAsk: "Choose the first production implementation path: static data beta, hosted backend, or reviewer workflow.",
    summary: "Working MVP Console completes the working data demo sprint and gives VedaPath a practical static-data path toward a real beta slice.",
    items: [
      ["Input", "Question route and source data record.", "Starts the chain honestly."],
      ["Grounding", "Retrieval, evidence panel, and confidence rulebook.", "Keeps trust visible."],
      ["User control", "Consent memory and feedback queue.", "Protects agency."],
      ["Human review", "Reviewer decisions change public answer state.", "Improves safely."]
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
      ["Product promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep the visible boundary: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No production claim", "Do not imply live storage, live retrieval, live AI generation, or verified public corpus coverage."],
      ["No authority claim", "Do not present VedaPath as a guru, ritual authority, therapist, emergency service, or replacement for teachers and tradition."],
      ["No hidden data", "Do not remember personal context without explicit consent, export, pause, and delete controls."]
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
  const start = "          <!-- VEDAPATH WORKING DATA SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH WORKING DATA SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH MVP LANE SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH MVP LANE SPRINT NAV END -->", `          <!-- VEDAPATH MVP LANE SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="releasecandidate.html">Candidate</a>
          <a class="link" href="betabeacon.html">Beta</a>
          <a class="link" href="mvpcontrol.html">MVP Control</a>
          <!-- VEDAPATH WORKING DATA SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH WORKING DATA SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Working data demo sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn the MVP lane into a source-data-to-answer chain a beta user can understand.</p>
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

          <h2>Working Chain Signals</h2>
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
          <span class="badge green">Working MVP chain</span>
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
              <div><strong>Data</strong><p>Shape source records.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Retrieve</strong><p>Find eligible evidence.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Answer</strong><p>Compose with confidence.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Review</strong><p>Route feedback and decisions.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a working data demo. It does not create production storage, live retrieval, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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

## Working Chain Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## No-Go Boundary

This release should not imply production storage, live retrieval, live AI generation, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH WORKING DATA SPRINT LINKS START -->",
    "<!-- VEDAPATH WORKING DATA SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH MVP LANE SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH WORKING DATA SPRINT FEATURES START -->",
    "<!-- VEDAPATH WORKING DATA SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH MVP LANE SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH WORKING DATA SPRINT NOTES START -->",
    "<!-- VEDAPATH WORKING DATA SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH MVP LANE SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH WORKING DATA SPRINT SUMMARY START -->",
    "<!-- VEDAPATH WORKING DATA SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH MVP LANE SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${138 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable working-data handoff

${shortTitle(item)} should never claim production storage, live retrieval, live AI generation, authentication, licensed source text, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH WORKING DATA SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH WORKING DATA SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH MVP LANE SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="workingconsole.html">Working MVP</a>')) {
    content = content.replace('href="mvpcontrol.html">MVP Control</a>', 'href="mvpcontrol.html">MVP Control</a> | <a href="workingconsole.html">Working MVP</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Working data demo sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>${Math.min(100, 40 + visible.length * 4)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 40 + visible.length * 4)}%"></div></div>
          <p>Working data demo sprint progress: ${visible.length}/10 rooms complete. Next: production implementation choice.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 20 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 20 + visible.length)}%"></div></div>
          <p>Working data chain progress: data, retrieval, answer composition, evidence, consent, feedback, and review are now mapped as product surfaces.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Working data demo sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${119 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH WORKING DATA SPRINT PHASES START -->",
    "            <!-- VEDAPATH WORKING DATA SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH MVP LANE SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${119 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.5.4 MVP Lane Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Working data demo sprint complete" : `${visible.length}/10 working data rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the chain simple: question route, source record, evidence, answer, consent, feedback, review.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, live retrieval, live AI generation, authentication, licensed source text, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing the first production implementation path."}</span></li>
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
    "          <!-- VEDAPATH WORKING DATA SPRINT HOME START -->",
    "          <!-- VEDAPATH WORKING DATA SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH MVP LANE SPRINT HOME END -->"
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
    "          <!-- VEDAPATH WORKING DATA SPRINT FEATURES START -->",
    "          <!-- VEDAPATH WORKING DATA SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH MVP LANE SPRINT FEATURES END -->"
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

console.log(`Generated working-data sprint through ${active.version} (${visible.length}/10).`);
