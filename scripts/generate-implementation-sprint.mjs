import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.3.5",
    badge: "v1.3.5 json",
    slug: "sourcejson",
    nav: "Source JSON",
    title: "VedaPath Source JSON Contract",
    pageLabel: "Source JSON contract",
    eyebrow: "Implementation lane",
    h1: "Give every source record a home shape.",
    lead: "A source JSON contract for citation, family, passage, allowed use, review state, rights state, answer coverage, and no-go boundaries.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Data contract, not a live database.",
    progress: 91,
    next: "Answer Renderer Shell",
    primaryAsk: "Freeze the first source-record shape before backend or retrieval work begins.",
    summary: "Source JSON Contract gives VedaPath a stable source-record shape that future retrieval, review, and answer rendering can share.",
    items: [
      ["Identity", "Source id, citation, family, text layer, and edition note.", "Stops category blur."],
      ["Use rights", "Display allowed, quote limit, translation status, and audio status.", "Prevents rights overreach."],
      ["Review", "Lane states for source, language, boundary, and product.", "Makes trust inspectable."],
      ["Coverage", "Questions it can answer and claims it must refuse.", "Keeps answers narrow."]
    ],
    modes: {
      brief: [
        ["Contract promise", "A calm product starts with disciplined records."],
        ["Build move", "Write the record shape before choosing storage."],
        ["Trust move", "Make missing fields block public confidence."]
      ],
      checklist: [
        ["Complete", "Does each record carry citation, rights, and review fields?"],
        ["Reusable", "Can retrieval and answer rendering read the same shape?"],
        ["Blocking", "Can missing fields stop public use?"]
      ],
      boundary: [
        ["No live data claim", "Do not imply this JSON is a production database."],
        ["No hidden rights", "Do not omit rights state."],
        ["No broad coverage", "Do not let one source answer every nearby topic."]
      ]
    }
  },
  {
    version: "v1.3.6",
    badge: "v1.3.6 renderer",
    slug: "answerrenderer",
    nav: "Renderer",
    title: "VedaPath Answer Renderer Shell",
    pageLabel: "Answer renderer shell",
    eyebrow: "Answer implementation",
    h1: "Render trust the same way every time.",
    lead: "An answer renderer shell that turns source JSON into direct answer, source card, confidence card, deeper layer, and boundary line.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Renderer shell, not live AI generation.",
    progress: 92,
    next: "Beta Waitlist Room",
    primaryAsk: "Define the repeatable answer surface before connecting an AI model.",
    summary: "Answer Renderer Shell separates presentation from generation so every answer shows source, confidence, and boundary consistently.",
    items: [
      ["Direct answer", "One useful answer sentence before detail.", "Protects simplicity."],
      ["Source card", "Citation, family, review state, rights note, and source id.", "Shows grounding."],
      ["Confidence card", "Basis, risk, missing field, and upgrade path.", "Explains trust."],
      ["Boundary line", "What not to overclaim and when review is needed.", "Keeps humility visible."]
    ],
    modes: {
      brief: [
        ["Renderer promise", "Trust should be a stable component, not custom copy."],
        ["UX move", "Use one answer anatomy across all flows."],
        ["Engineering move", "Let source data decide what the renderer can show."]
      ],
      checklist: [
        ["Consistent", "Does every answer show the same trust parts?"],
        ["Readable", "Is the first answer still simple?"],
        ["Guarded", "Can missing source fields hide risky sections?"]
      ],
      boundary: [
        ["No model magic", "Do not connect generation before source state exists."],
        ["No hidden citation", "Do not bury the source card."],
        ["No confidence theater", "Do not display confidence without reasons."]
      ]
    }
  },
  {
    version: "v1.3.7",
    badge: "v1.3.7 waitlist",
    slug: "betawaitlist",
    nav: "Waitlist",
    title: "VedaPath Beta Waitlist Room",
    pageLabel: "Beta waitlist room",
    eyebrow: "Public beta intake",
    h1: "Invite early users without rushing the promise.",
    lead: "A waitlist room for audience type, interest path, consent note, beta boundary, feedback willingness, and launch hold state.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Waitlist prototype, not live signup.",
    progress: 93,
    next: "Consent Toggle Mock",
    primaryAsk: "Shape beta intake around consent, source interest, and reviewable feedback.",
    summary: "Beta Waitlist Room turns launch excitement into a careful intake path that respects user expectation and product limits.",
    items: [
      ["Audience", "Learner, teacher, parent, reviewer, creator, or calm seeker.", "Guides beta cohorts."],
      ["Interest", "Ask, learn, calm, teach, review, or build with sources.", "Shows why they came."],
      ["Consent", "Email permission, feedback permission, and privacy boundary.", "Protects trust."],
      ["Hold state", "Beta access waits until source scope and support routes are ready.", "Keeps launch honest."]
    ],
    modes: {
      brief: [
        ["Waitlist promise", "A waitlist should gather fit, not hype."],
        ["Launch move", "Invite the right early users for a narrow beta."],
        ["Privacy move", "Collect only what supports beta access."]
      ],
      checklist: [
        ["Minimal", "Does the waitlist avoid unnecessary personal data?"],
        ["Useful", "Can audience type guide beta scope?"],
        ["Honest", "Is prototype status visible?"]
      ],
      boundary: [
        ["No public signup claim", "Do not call this a live waitlist."],
        ["No sensitive intake", "Do not collect private distress or health details."],
        ["No access promise", "Do not promise immediate beta entry."]
      ]
    }
  },
  {
    version: "v1.3.8",
    badge: "v1.3.8 consent",
    slug: "consenttoggle",
    nav: "Consent",
    title: "VedaPath Consent Toggle Mock",
    pageLabel: "Consent toggle mock",
    eyebrow: "Permission controls",
    h1: "Make every memory permission visible.",
    lead: "A consent toggle mock for local memory, synced learning path, feedback contact, reviewer follow-up, export, delete, and pause.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Consent UI mock, not production accounts.",
    progress: 94,
    next: "Reviewer Queue Mock",
    primaryAsk: "Design the consent controls users must see before real accounts or memory ship.",
    summary: "Consent Toggle Mock makes VedaPath's memory promise tangible through named permissions and visible reversibility.",
    items: [
      ["Local only", "Keep reflections and drafts on device.", "Protects private practice."],
      ["Sync path", "Save source trail and learning preferences after opt-in.", "Adds continuity."],
      ["Contact", "Allow beta updates or reviewer follow-up separately.", "Avoids bundled consent."],
      ["Exit", "Export, delete, revoke, pause, and clear device.", "Gives memory an exit."]
    ],
    modes: {
      brief: [
        ["Consent promise", "Permission should be visible before memory begins."],
        ["UX move", "Use separate toggles for separate purposes."],
        ["Data move", "No field is stored without an exit path."]
      ],
      checklist: [
        ["Specific", "Does each toggle name one purpose?"],
        ["Reversible", "Can the user undo it?"],
        ["Plain", "Can a non-technical user understand it?"]
      ],
      boundary: [
        ["No bundled consent", "Do not combine unrelated permissions."],
        ["No silent sync", "Do not upload private local notes."],
        ["No hidden profile", "Do not infer sensitive identity from use."]
      ]
    }
  },
  {
    version: "v1.3.9",
    badge: "v1.3.9 queue",
    slug: "reviewmock",
    nav: "Review Mock",
    title: "VedaPath Reviewer Queue Mock",
    pageLabel: "Reviewer queue mock",
    eyebrow: "Human review handoff",
    h1: "Give reviewers the exact next decision.",
    lead: "A reviewer queue mock with lane, evidence, answer impact, missing fields, decision choices, and no-endorsement language.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Queue mock, not reviewer approval.",
    progress: 95,
    next: "Source Import Checklist",
    primaryAsk: "Define how source issues become small review decisions instead of vague feedback.",
    summary: "Reviewer Queue Mock makes scholar and careful-reader review practical by turning issues into scoped, evidence-backed decisions.",
    items: [
      ["Lane", "Source, Sanskrit, translation, interpretation, boundary, or rights.", "Narrows responsibility."],
      ["Evidence", "Citation, current answer, user concern, and missing field.", "Saves reviewer time."],
      ["Decision", "Approve, hold, block, request evidence, or retire.", "Keeps state clear."],
      ["Audit", "Decision note without public identity leakage.", "Creates traceable trust."]
    ],
    modes: {
      brief: [
        ["Queue promise", "Review work should be small enough to complete."],
        ["Ops move", "Give each card one decision lane."],
        ["Trust move", "Publish state, not private reviewer pressure."]
      ],
      checklist: [
        ["Scoped", "Is there one review lane?"],
        ["Evidence-backed", "Can the reviewer see why it matters?"],
        ["Auditable", "Can the decision be traced later?"]
      ],
      boundary: [
        ["No endorsement blur", "Do not turn review into public endorsement."],
        ["No vague cards", "Do not ask reviewers to inspect everything."],
        ["No identity leak", "Do not publish names without consent."]
      ]
    }
  },
  {
    version: "v1.4.0",
    badge: "v1.4.0 import",
    slug: "sourceimport",
    nav: "Import",
    title: "VedaPath Source Import Checklist",
    pageLabel: "Source import checklist",
    eyebrow: "Dataset operations",
    h1: "Import sources only when the gaps are named.",
    lead: "A source import checklist for citation, edition, language fields, translation rights, review lanes, public eligibility, and blocked claims.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Import checklist, not corpus ingestion.",
    progress: 96,
    next: "Beta QA Matrix",
    primaryAsk: "Make source import boring, careful, and reviewable before scaling the dataset.",
    summary: "Source Import Checklist turns dataset growth into a disciplined process with visible blockers and no-go fields.",
    items: [
      ["Citation", "Text family, section, verse, edition, and source URL.", "Grounds the record."],
      ["Language", "Original text, transliteration, translation note, and uncertainty.", "Protects meaning."],
      ["Rights", "Display, quote, translation, and audio permissions.", "Avoids rights mistakes."],
      ["Eligibility", "Ready, hold, blocked, or reviewer-needed.", "Controls public use."]
    ],
    modes: {
      brief: [
        ["Import promise", "Dataset growth should be slower than trust loss."],
        ["Ops move", "Mark blockers before records enter answers."],
        ["Quality move", "Make every missing field visible."]
      ],
      checklist: [
        ["Cited", "Is the source identity exact?"],
        ["Allowed", "Are rights fields clear?"],
        ["Eligible", "Can this record answer public questions?"]
      ],
      boundary: [
        ["No mass import", "Do not bulk import without review fields."],
        ["No rights guess", "Do not assume translation or audio rights."],
        ["No hidden gaps", "Do not hide incomplete records."]
      ]
    }
  },
  {
    version: "v1.4.1",
    badge: "v1.4.1 qa",
    slug: "betaqa",
    nav: "QA",
    title: "VedaPath Beta QA Matrix",
    pageLabel: "Beta QA matrix",
    eyebrow: "Release quality",
    h1: "Test the beta where trust can break.",
    lead: "A beta QA matrix for source citation, category clarity, calm boundary, privacy controls, mobile layout, copy buttons, and live Pages readiness.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "QA matrix, not formal certification.",
    progress: 97,
    next: "Help Boundary Center",
    primaryAsk: "Define the tests that must pass before inviting real beta users.",
    summary: "Beta QA Matrix turns VedaPath's product values into release checks for trust, privacy, usability, and mobile simplicity.",
    items: [
      ["Source QA", "Citation visible, family clear, confidence reason shown.", "Tests grounding."],
      ["Boundary QA", "No guru, therapy, ritual, science overclaim, or crisis advice.", "Tests humility."],
      ["UX QA", "No horizontal overflow, readable cards, working tabs, copy buttons.", "Tests simplicity."],
      ["Launch QA", "Live Pages markers, clean git status, and rollback note.", "Tests operations."]
    ],
    modes: {
      brief: [
        ["QA promise", "The beta should fail in testing before users feel the failure."],
        ["Release move", "Test values, not only links."],
        ["UX move", "Mobile simplicity is a launch requirement."]
      ],
      checklist: [
        ["Grounded", "Do all answer surfaces show source and confidence?"],
        ["Safe", "Are no-go claims blocked?"],
        ["Usable", "Does mobile render without awkward overflow?"]
      ],
      boundary: [
        ["No false certification", "Do not call QA a guarantee."],
        ["No skipped mobile", "Do not launch without mobile checks."],
        ["No ignored failures", "Do not ship known trust failures silently."]
      ]
    }
  },
  {
    version: "v1.4.2",
    badge: "v1.4.2 help",
    slug: "helpcenter",
    nav: "Help",
    title: "VedaPath Help Boundary Center",
    pageLabel: "Help boundary center",
    eyebrow: "User support clarity",
    h1: "Help users know what VedaPath can and cannot do.",
    lead: "A help center for product use, source limits, calm boundaries, privacy controls, corrections, and emergency redirection.",
    source: "Bhagavad Gita 6.5",
    family: "Bhagavad Gita | Smriti",
    stance: "Help prototype, not live support.",
    progress: 98,
    next: "Founder Metrics Board",
    primaryAsk: "Prepare user help copy before beta users ask for support.",
    summary: "Help Boundary Center gives VedaPath a plain-language support surface that reduces confusion and protects users.",
    items: [
      ["How to ask", "Question types, source hints, and no-source cases.", "Improves answers."],
      ["What it is not", "Not guru, therapy, ritual authority, or emergency support.", "Protects users."],
      ["Privacy help", "Local memory, export, delete, pause, and consent toggles.", "Builds agency."],
      ["Correction help", "Report source, category, translation, boundary, or privacy issue.", "Routes improvement."]
    ],
    modes: {
      brief: [
        ["Help promise", "Clear help prevents misplaced trust."],
        ["Support move", "Answer common confusion before launch."],
        ["Safety move", "Keep emergency and therapy boundaries direct."]
      ],
      checklist: [
        ["Plain", "Can users understand the limits quickly?"],
        ["Actionable", "Can they correct an issue?"],
        ["Protective", "Does serious distress route away from the product?"]
      ],
      boundary: [
        ["No live support claim", "Do not imply staff are monitoring help requests."],
        ["No crisis handling", "Do not handle emergency situations in-product."],
        ["No hidden deletion", "Do not make privacy controls hard to find."]
      ]
    }
  },
  {
    version: "v1.4.3",
    badge: "v1.4.3 metrics",
    slug: "foundermetrics",
    nav: "Metrics",
    title: "VedaPath Founder Metrics Board",
    pageLabel: "Founder metrics board",
    eyebrow: "Launch signal",
    h1: "Measure trust signals, not vanity noise.",
    lead: "A founder metrics board for source readiness, beta interest, feedback quality, review backlog, privacy issues, and hold decisions.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Metrics design, not live analytics.",
    progress: 99,
    next: "Release Candidate Room",
    primaryAsk: "Choose launch metrics that improve trust instead of profiling users.",
    summary: "Founder Metrics Board keeps VedaPath launch learning focused on source quality, trust risk, and product clarity.",
    items: [
      ["Readiness", "Ready source records, held records, and reviewer-needed records.", "Shows product truth."],
      ["Interest", "Waitlist cohort and chosen path, collected with consent.", "Guides beta scope."],
      ["Quality", "Feedback type, correction rate, and unresolved trust issues.", "Improves the system."],
      ["Hold", "Reasons to pause: source risk, privacy concern, support gap, or UI issue.", "Protects launch."]
    ],
    modes: {
      brief: [
        ["Metrics promise", "Measure what helps VedaPath become more trustworthy."],
        ["Founder move", "Watch hold signals as closely as growth signals."],
        ["Privacy move", "Use aggregate learning, not private profiling."]
      ],
      checklist: [
        ["Decisionful", "Would this metric change a release decision?"],
        ["Aggregate", "Can it be measured without profiling?"],
        ["Balanced", "Does it include hold and risk signals?"]
      ],
      boundary: [
        ["No vanity chase", "Do not optimize for traffic over trust."],
        ["No hidden profiling", "Do not infer faith, distress, or identity."],
        ["No ignored holds", "Do not bury pause conditions."]
      ]
    }
  },
  {
    version: "v1.4.4",
    badge: "v1.4.4 candidate",
    slug: "releasecandidate",
    nav: "Candidate",
    title: "VedaPath Release Candidate Room",
    pageLabel: "Release candidate room",
    eyebrow: "Implementation decision",
    h1: "Choose one real lane and make it shippable.",
    lead: "A release candidate room that gathers source JSON, answer renderer, waitlist, consent, review mock, import checklist, QA, help, and metrics into one implementation decision.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Release candidate decision, not production launch.",
    progress: 100,
    next: "Founder instruction",
    primaryAsk: "Choose the next real build lane: source JSON plus renderer, waitlist plus consent, or reviewer queue plus import checklist.",
    summary: "Release Candidate Room completes the implementation-readiness sprint and turns VedaPath's next step into one shippable lane.",
    items: [
      ["Source lane", "Source JSON, import checklist, QA, and renderer shell.", "Best for answer trust."],
      ["User lane", "Waitlist, consent toggles, help center, and metrics.", "Best for beta entry."],
      ["Review lane", "Reviewer mock, scholar packets, source score, and hold states.", "Best for human trust."],
      ["Decision", "Pick one lane, name blockers, and define done.", "Prevents scattered building."]
    ],
    modes: {
      brief: [
        ["Candidate promise", "The next sprint should implement one narrow thing well."],
        ["Founder move", "Choose source, user, or review lane before more pages."],
        ["Build move", "Make the chosen lane testable and shippable."]
      ],
      checklist: [
        ["Narrow", "Is the lane small enough to build?"],
        ["Valuable", "Does it reduce the biggest launch risk?"],
        ["Testable", "Can we verify it with real checks?"]
      ],
      boundary: [
        ["No all-at-once build", "Do not build source, user, and review systems together."],
        ["No production claim", "Do not call this a launch."],
        ["No trust shortcut", "Do not skip source, consent, review, or QA gates."]
      ]
    }
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

function sprintNav(prefix = "", rel = "") {
  return visible.map((item) => {
    const activeClass = rel === `${item.slug}.html` ? " active" : "";
    return `          <a class="link${activeClass}" href="${prefix}${item.slug}.html">${item.nav}</a>`;
  }).join("\n");
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH ACTIVATION SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH ACTIVATION SPRINT NAV END -->", `          <!-- VEDAPATH ACTIVATION SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
  const data = { ...item, rooms };
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
          <a class="link" href="betabeacon.html">Beta Beacon</a>
          <a class="link" href="trustcenter.html">Trust</a>
          <a class="link" href="calm.html">Calm</a>
          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Implementation readiness sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms prepare one real build lane while preserving the calm, source-first user experience.</p>
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

          <h2>Decision Signals</h2>
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
          <span class="badge green">Implementation readiness</span>
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
              <div><strong>Shape</strong><p>Name the implementation object.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Gate</strong><p>Add source, consent, or review limits.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Test</strong><p>Make the release check visible.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Choose</strong><p>Pick one shippable lane.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is an implementation-readiness prototype. It does not create production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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

## Decision Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## No-Go Boundary

This release should not imply production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT LINKS START -->",
    "<!-- VEDAPATH IMPLEMENTATION SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH ACTIVATION SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES START -->",
    "<!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH ACTIVATION SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH IMPLEMENTATION SPRINT NOTES START -->",
    "<!-- VEDAPATH IMPLEMENTATION SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH ACTIVATION SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT SUMMARY START -->",
    "<!-- VEDAPATH IMPLEMENTATION SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH ACTIVATION SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${118 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable implementation-readiness handoff

${shortTitle(item)} should never claim production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH IMPLEMENTATION SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH ACTIVATION SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="releasecandidate.html">Release Candidate</a>')) {
    content = content.replace('<a href="betabeacon.html">Beta Beacon</a>', '<a href="betabeacon.html">Beta Beacon</a> | <a href="releasecandidate.html">Release Candidate</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Implementation-readiness sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Implementation-readiness sprint progress: ${visible.length}/10 rooms complete. The next real lane still requires a focused implementation decision.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Implementation-readiness sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${99 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH IMPLEMENTATION SPRINT PHASES START -->",
    "            <!-- VEDAPATH IMPLEMENTATION SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH ACTIVATION SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${99 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.3.4 Public Beta Beacon"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Implementation-readiness sprint complete" : `${visible.length}/10 implementation rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Choose one narrow implementation lane before adding more public surfaces.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, authentication, licensed audio, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing the next implementation lane."}</span></li>
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
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT HOME START -->",
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH ACTIVATION SPRINT HOME END -->"
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
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES START -->",
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH ACTIVATION SPRINT FEATURES END -->"
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

console.log(`Generated implementation-readiness sprint through ${active.version} (${visible.length}/10).`);
