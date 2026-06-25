import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.0.5",
    badge: "v1.0.5 arch",
    slug: "architecture",
    nav: "Arch",
    title: "VedaPath Production Architecture Map",
    pageLabel: "Production architecture",
    eyebrow: "Production foundation",
    h1: "Design the system before storing trust.",
    lead: "A production architecture room for source records, answer service, reviewer workflow, consent, audit, exports, and launch operations.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Architecture map, not implemented backend.",
    progress: 91,
    next: "Account Consent Prototype",
    primaryAsk: "Choose the production system boundaries before any real user data is stored.",
    summary: "Production Architecture Map turns VedaPath's prototype rooms into a clear service map for source trust, privacy, review, and launch operations.",
    items: [
      ["Source core", "Source records, citations, translation rights, and review state.", "Powers answer confidence."],
      ["User core", "Account, consent, export, delete, and memory preferences.", "Protects personal data."],
      ["Review core", "Reviewer roles, scoped decisions, audit trail, and release gates.", "Makes trust inspectable."],
      ["Launch core", "Pilot posture, feedback triage, analytics boundaries, and rollback.", "Keeps launch controllable."]
    ],
    modes: {
      brief: [
        ["Architecture promise", "Production should make trust easier to inspect, not harder."],
        ["Product move", "Separate source truth, user memory, reviewer decisions, and launch operations."],
        ["Engineering move", "Do not add storage until consent, export, delete, and audit are designed together."]
      ],
      checklist: [
        ["Bounded", "Does each system own one kind of data?"],
        ["Auditable", "Can source and review changes be traced?"],
        ["Private", "Can user data be exported, deleted, and paused?"]
      ],
      boundary: [
        ["No hidden backend", "Do not imply production storage exists until it is implemented."],
        ["No mixed trust", "Do not mix source review with personal memory records."],
        ["No launch shortcut", "Do not launch production accounts without consent controls."]
      ]
    }
  },
  {
    version: "v1.0.6",
    badge: "v1.0.6 account",
    slug: "account",
    nav: "Account",
    title: "VedaPath Account Consent Prototype",
    pageLabel: "Account consent",
    eyebrow: "Consent before account",
    h1: "Make sign-in earn its place.",
    lead: "A production account consent room that explains what sign-in enables, what stays local, what syncs, and how deletion works.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Consent prototype, not live authentication.",
    progress: 92,
    next: "Source API Contract",
    primaryAsk: "Decide what a VedaPath account may remember and what must remain local by default.",
    summary: "Account Consent Prototype makes future sign-in useful, optional, and transparent before real authentication is added.",
    items: [
      ["Why sign in", "Save source paths, reviewed feedback, and consented calm preferences.", "Gives account value."],
      ["Local by default", "Private journal lines, sensitive reflections, and family moments.", "Avoids silent exposure."],
      ["User controls", "Export, delete, pause sync, revoke grants, and clear device.", "Keeps user agency visible."],
      ["Blocked memory", "Distress, faith identity, family conflict, or health inference.", "Prevents hidden profiling."]
    ],
    modes: {
      brief: [
        ["Consent promise", "An account should never be the price of calm."],
        ["UX move", "Explain sign-in as an optional upgrade for continuity, not a gate."],
        ["Engineering move", "Every synced field needs purpose, consent, export, and delete behavior."]
      ],
      checklist: [
        ["Optional", "Can the user use the core beta without signing in?"],
        ["Named", "Is every synced field named in plain words?"],
        ["Reversible", "Can users export, delete, or pause memory?"]
      ],
      boundary: [
        ["No forced sign-in", "Do not make basic calm or source reading require an account."],
        ["No silent sync", "Do not upload local reflections without explicit consent."],
        ["No identity inference", "Do not infer private identity from practice behavior."]
      ]
    }
  },
  {
    version: "v1.0.7",
    badge: "v1.0.7 api",
    slug: "sourceapi",
    nav: "Source API",
    title: "VedaPath Source API Contract",
    pageLabel: "Source API",
    eyebrow: "Source service",
    h1: "Let answers ask the source service first.",
    lead: "A source API contract room for query, citation lookup, eligibility, review status, translation rights, and no-source refusal.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "API contract, not deployed service.",
    progress: 93,
    next: "Reviewer Workflow Contract",
    primaryAsk: "Define the source service response shape before building production retrieval.",
    summary: "Source API Contract describes the service boundary that every trusted answer must call before claiming confidence.",
    items: [
      ["Query", "Question text, requested depth, language, and user-safe context.", "Finds candidate records."],
      ["Source response", "Citation, family, review state, rights state, and allowed use.", "Tells answers what can be shown."],
      ["Eligibility", "Ready, hold, blocked, reviewer-needed, or no-source.", "Prevents false confidence."],
      ["Refusal", "No source found or unsafe claim requires a careful boundary response.", "Protects trust."]
    ],
    modes: {
      brief: [
        ["API promise", "The answer layer should not invent confidence. It should receive confidence from source state."],
        ["Product move", "Make missing source state a first-class answer condition."],
        ["Engineering move", "Design response contracts before choosing retrieval implementation details."]
      ],
      checklist: [
        ["Specific", "Does the response include exact source identity?"],
        ["Eligible", "Can the answer know whether a record is public-ready?"],
        ["Refusable", "Can no-source cases produce safe answers?"]
      ],
      boundary: [
        ["No invented citation", "Do not let answers create citation-like text."],
        ["No rights bypass", "Do not display translations or audio without rights state."],
        ["No confidence leak", "Do not expose high confidence for hold or blocked records."]
      ]
    }
  },
  {
    version: "v1.0.8",
    badge: "v1.0.8 workflow",
    slug: "reviewflow",
    nav: "Review Flow",
    title: "VedaPath Reviewer Workflow Contract",
    pageLabel: "Reviewer workflow",
    eyebrow: "Human review workflow",
    h1: "Make review a workflow, not a label.",
    lead: "A reviewer workflow contract for source, language, boundary, rights, and product decisions with scoped permissions and audit notes.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Workflow contract, not endorsement.",
    progress: 94,
    next: "Retrieval Service Blueprint",
    primaryAsk: "Define how a record moves from draft to reviewed to public-ready.",
    summary: "Reviewer Workflow Contract turns review from a vague trust word into scoped decisions, states, and release gates.",
    items: [
      ["Draft", "Record exists with missing fields visible.", "Cannot power high-confidence answers."],
      ["Review lanes", "Source, language, boundary, rights, and product review.", "Separates decision scope."],
      ["Decision", "Approve, hold, block, request evidence, or retire.", "Keeps state precise."],
      ["Audit", "Who reviewed what lane, when, and why.", "Creates traceable trust."]
    ],
    modes: {
      brief: [
        ["Workflow promise", "Review only builds trust when the reviewed field is clear."],
        ["Product move", "Use lane-specific review states instead of one broad approved flag."],
        ["Ops move", "Keep reviewer identity private unless display consent exists."]
      ],
      checklist: [
        ["Scoped", "Can each reviewer decide only one lane?"],
        ["Traceable", "Can a public confidence change be explained?"],
        ["Respectful", "Is reviewer display separate from reviewer work?"]
      ],
      boundary: [
        ["No endorsement blur", "Do not turn review into a blanket endorsement."],
        ["No anonymous authority", "Do not claim review without accountable process."],
        ["No public identity leak", "Do not reveal reviewers without consent."]
      ]
    }
  },
  {
    version: "v1.0.9",
    badge: "v1.0.9 retrieval svc",
    slug: "retrievalsvc",
    nav: "Retrieval",
    title: "VedaPath Retrieval Service Blueprint",
    pageLabel: "Retrieval service",
    eyebrow: "Answer retrieval",
    h1: "Retrieve only what is ready to answer.",
    lead: "A retrieval service blueprint for ranking source records by match, eligibility, confidence, boundary, and explainable reason.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Retrieval blueprint, not deployed retrieval.",
    progress: 95,
    next: "Answer Evaluation Harness",
    primaryAsk: "Define retrieval ranking so answers prefer reviewed, eligible, source-specific records.",
    summary: "Retrieval Service Blueprint makes production answer generation depend on review state, source specificity, and visible match reasons.",
    items: [
      ["Match", "Question intent, source family, topic, and claim type.", "Finds likely records."],
      ["Eligibility filter", "Ready records first; hold, blocked, and no-rights records excluded.", "Protects public output."],
      ["Reason", "Why this record matched and what it cannot answer.", "Keeps retrieval explainable."],
      ["Fallback", "No-source, analogy-only, or reviewer-needed response.", "Prevents hallucinated authority."]
    ],
    modes: {
      brief: [
        ["Retrieval promise", "The system should prefer a narrower trusted answer over a broad uncertain one."],
        ["Product move", "Show match reasons beside source cards."],
        ["Engineering move", "Treat record eligibility as a hard gate before ranking."]
      ],
      checklist: [
        ["Eligible", "Are blocked or hold records excluded from public answers?"],
        ["Explainable", "Can the user see why a source was selected?"],
        ["Fallback", "Is no-source handled without invention?"]
      ],
      boundary: [
        ["No retrieval overreach", "Do not rank records that are not public-ready."],
        ["No broad answer", "Do not answer beyond the retrieved record scope."],
        ["No hidden reason", "Do not hide why a record was used."]
      ]
    }
  },
  {
    version: "v1.1.0",
    badge: "v1.1.0 eval harness",
    slug: "evalharness",
    nav: "Eval",
    title: "VedaPath Answer Evaluation Harness",
    pageLabel: "Evaluation harness",
    eyebrow: "Production eval",
    h1: "Test answers before users trust them.",
    lead: "A production evaluation harness for citation coverage, category clarity, boundary safety, refusal quality, and reviewer escalation.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Evaluation design, not automated certification.",
    progress: 96,
    next: "Export and Delete Center",
    primaryAsk: "Define the eval checks that must pass before answer changes are released.",
    summary: "Answer Evaluation Harness turns VedaPath's trust rules into repeatable checks before new answer behavior is shipped.",
    items: [
      ["Citation coverage", "Every serious answer needs citation or no-source explanation.", "Checks grounding."],
      ["Category clarity", "Veda, Upanishad, Gita, Purana, commentary, modern analogy.", "Prevents confusion."],
      ["Boundary safety", "Guru voice, therapy, ritual, science overclaim, and privacy risks.", "Checks no-go behavior."],
      ["Escalation", "Reviewer-needed cases become queue items.", "Connects tests to human review."]
    ],
    modes: {
      brief: [
        ["Eval promise", "VedaPath should fail loudly in testing before it fails quietly in public."],
        ["Product move", "Make eval results part of release readiness."],
        ["Engineering move", "Evaluate both answer content and the absence of overclaiming."]
      ],
      checklist: [
        ["Grounded", "Does the answer cite or refuse properly?"],
        ["Clear", "Does it label source family and analogy correctly?"],
        ["Safe", "Does it avoid authority, therapy, ritual, and privacy overreach?"]
      ],
      boundary: [
        ["No certification theater", "Passing evals does not make the AI an authority."],
        ["No hidden failures", "Do not ship known failing cases without release notes."],
        ["No eval-only trust", "Human review is still needed for source-sensitive records."]
      ]
    }
  },
  {
    version: "v1.1.1",
    badge: "v1.1.1 export",
    slug: "exportdelete",
    nav: "Export",
    title: "VedaPath Export and Delete Center",
    pageLabel: "Export and delete",
    eyebrow: "User control",
    h1: "Give memory an exit.",
    lead: "A user-control room for exporting source paths, deleting account data, clearing local memory, revoking consent, and seeing retention rules.",
    source: "Bhagavad Gita 6.5",
    family: "Bhagavad Gita | Smriti",
    stance: "Privacy control design, not legal advice.",
    progress: 97,
    next: "Privacy-Safe Analytics",
    primaryAsk: "Define export and delete behavior before any production memory launches.",
    summary: "Export and Delete Center makes user-owned memory practical by designing export, deletion, revocation, and local-clear controls.",
    items: [
      ["Export", "Saved sources, preferences, review tickets, and consent grants.", "Lets users leave with their data."],
      ["Delete", "Account data, synced preferences, and personal records.", "Removes durable memory."],
      ["Clear local", "Device-only drafts, streaks, and prototypes.", "Handles browser-local data."],
      ["Retention", "What is kept for audit, why, and for how long.", "Makes limits visible."]
    ],
    modes: {
      brief: [
        ["Control promise", "A product that remembers should also know how to forget."],
        ["UX move", "Put export, delete, revoke, and local-clear in plain language."],
        ["Engineering move", "Design deletion before persistence, not after launch pressure."]
      ],
      checklist: [
        ["Complete", "Can each stored field be exported or deleted?"],
        ["Clear", "Can users understand what remains for audit?"],
        ["Local", "Can device-only data be cleared separately?"]
      ],
      boundary: [
        ["No irreversible mystery", "Do not store data without explaining deletion behavior."],
        ["No hidden audit", "Do not keep personal data for audit without naming it."],
        ["No fake delete", "Do not offer delete controls that only hide data from view."]
      ]
    }
  },
  {
    version: "v1.1.2",
    badge: "v1.1.2 analytics",
    slug: "analytics",
    nav: "Analytics",
    title: "VedaPath Privacy-Safe Analytics",
    pageLabel: "Privacy-safe analytics",
    eyebrow: "Learning without profiling",
    h1: "Learn from launch without studying the user.",
    lead: "An analytics boundary room for aggregate product signals, explicit feedback, source gaps, and privacy-safe launch decisions.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Product analytics design, not user profiling.",
    progress: 98,
    next: "Launch Ops Runbook",
    primaryAsk: "Choose the few analytics signals that improve VedaPath without profiling users.",
    summary: "Privacy-Safe Analytics defines launch learning around aggregate product signals rather than hidden identity or distress inference.",
    items: [
      ["Aggregate use", "Room opens, completion counts, and source card interactions.", "Shows product health."],
      ["Source gaps", "No-source queries, correction requests, and review-needed categories.", "Improves dataset."],
      ["Explicit feedback", "User-submitted issue type and optional note.", "Keeps learning consented."],
      ["Blocked inference", "No faith, distress, family, health, or identity profiling.", "Protects users."]
    ],
    modes: {
      brief: [
        ["Analytics promise", "VedaPath should learn what to improve without trying to define who the user is."],
        ["Product move", "Track source gaps and flow friction, not sensitive identity."],
        ["Launch move", "Use explicit feedback before behavioral inference."]
      ],
      checklist: [
        ["Useful", "Will this signal change a release decision?"],
        ["Aggregate", "Can it be measured without identifying the user?"],
        ["Blocked", "Could this become sensitive inference if misused?"]
      ],
      boundary: [
        ["No surveillance", "Do not profile users from calm or source behavior."],
        ["No distress inference", "Do not infer mental state from room use."],
        ["No vanity chase", "Do not confuse traffic with trust."]
      ]
    }
  },
  {
    version: "v1.1.3",
    badge: "v1.1.3 runbook",
    slug: "runbook",
    nav: "Runbook",
    title: "VedaPath Launch Ops Runbook",
    pageLabel: "Launch runbook",
    eyebrow: "Launch operations",
    h1: "Launch with a rollback path.",
    lead: "A launch operations runbook for pilot scope, incident response, source corrections, privacy issues, reviewer escalation, and rollback.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Operations runbook, not automatic approval.",
    progress: 99,
    next: "Production Control Room",
    primaryAsk: "Define what the team does when launch feedback reveals a trust or privacy issue.",
    summary: "Launch Ops Runbook gives VedaPath a practical operating rhythm for release, feedback, incidents, rollback, and reviewer escalation.",
    items: [
      ["Pilot scope", "Audience, source pack, live surfaces, and held claims.", "Sets launch boundaries."],
      ["Incident types", "Source error, category confusion, privacy concern, unsafe answer.", "Defines response routes."],
      ["Escalation", "Reviewer, founder, product, privacy, or hold decision.", "Keeps action clear."],
      ["Rollback", "Remove claim, hide answer, pause feature, or stop pilot.", "Protects trust quickly."]
    ],
    modes: {
      brief: [
        ["Runbook promise", "A calm launch includes knowing how to pause."],
        ["Ops move", "Name incident routes before the first public wave."],
        ["Founder move", "Decide who can pause a feature and why."]
      ],
      checklist: [
        ["Scoped", "Is the pilot scope visible?"],
        ["Ready", "Is each incident type routed?"],
        ["Reversible", "Can the launch pause safely?"]
      ],
      boundary: [
        ["No stubborn launch", "Do not keep a feature live when trust issues appear."],
        ["No vague incident", "Do not bury source or privacy issues as generic feedback."],
        ["No blame tone", "Do not shame users who report errors."]
      ]
    }
  },
  {
    version: "v1.1.4",
    badge: "v1.1.4 production",
    slug: "prodcontrol",
    nav: "Prod Control",
    title: "VedaPath Production Control Room",
    pageLabel: "Production control",
    eyebrow: "Production decision",
    h1: "Choose the build that makes trust real.",
    lead: "A production control room that brings architecture, consent, source API, review workflow, retrieval, evaluation, export, analytics, and runbook into one decision surface.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Founder decision center, not production approval.",
    progress: 100,
    next: "Founder production instruction",
    primaryAsk: "Choose the first real implementation lane: source service, account consent, reviewer workflow, or evaluation harness.",
    summary: "Production Control Room completes the production-readiness sprint and turns the next step into one concrete implementation lane.",
    items: [
      ["Source service first", "Build source records, citation inspector, API, and retrieval eligibility.", "Best if trust accuracy is the bottleneck."],
      ["Consent first", "Build accounts, grants, export, delete, and local-clear behavior.", "Best if user memory is the next feature."],
      ["Review first", "Build reviewer workflow, audit trail, and release gates.", "Best if human trust is the blocker."],
      ["Eval first", "Build answer tests, no-go checks, and release dashboards.", "Best if answer behavior needs hardening."]
    ],
    modes: {
      brief: [
        ["Control promise", "The next production move should be narrower than the vision and deeper than the prototype."],
        ["Founder move", "Pick one implementation lane, one success metric, and one hold condition."],
        ["Product truth", "VedaPath is ready for serious production planning, not broad production claims."]
      ],
      checklist: [
        ["Lane", "Which implementation lane reduces the biggest launch risk?"],
        ["Metric", "How will we know this lane improved trust?"],
        ["Hold", "What condition pauses implementation or launch?"]
      ],
      boundary: [
        ["No all-at-once build", "Do not build accounts, retrieval, review, and analytics together."],
        ["No production claim", "Do not imply backend systems exist until implemented and verified."],
        ["No trust shortcut", "Do not skip consent, review, eval, or rollback just to move faster."]
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
  const start = "          <!-- VEDAPATH PRODUCTION SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH PRODUCTION SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH READINESS SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH READINESS SPRINT NAV END -->", `          <!-- VEDAPATH READINESS SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH BETA SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH BETA SPRINT NAV END -->", `          <!-- VEDAPATH BETA SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="launchcenter.html">Launch Center</a>
          <a class="link" href="command.html">Command</a>
          <a class="link" href="calm.html">Calm</a>
          <a class="link" href="practice.html">Practice</a>
          <!-- VEDAPATH PRODUCTION SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH PRODUCTION SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Production readiness sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn launch readiness into architecture, consent, source services, review, and operations.</p>
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
          <span class="badge green">Production readiness</span>
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
              <div><strong>Design</strong><p>Name the production boundary.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Protect</strong><p>Keep consent, review, and audit visible.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Implement</strong><p>Choose one narrow lane.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Verify</strong><p>Ship only after checks pass.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a production-readiness planning surface. It does not create production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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

This release should not imply production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTION SPRINT LINKS START -->",
    "<!-- VEDAPATH PRODUCTION SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH READINESS SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTION SPRINT FEATURES START -->",
    "<!-- VEDAPATH PRODUCTION SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH READINESS SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH PRODUCTION SPRINT NOTES START -->",
    "<!-- VEDAPATH PRODUCTION SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH READINESS SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTION SPRINT SUMMARY START -->",
    "<!-- VEDAPATH PRODUCTION SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH READINESS SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${88 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable production-readiness handoff

${shortTitle(item)} should never claim production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTION SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH PRODUCTION SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH READINESS SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="prodcontrol.html">Production Control</a>')) {
    content = content.replace('<a href="launchcenter.html">Launch Center</a>', '<a href="launchcenter.html">Launch Center</a> | <a href="prodcontrol.html">Production Control</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Production readiness sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Production readiness sprint progress: ${visible.length}/10 rooms complete. Real backend, real authentication, real reviewer operations, and licensed audio still require implementation decisions.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder production instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Production readiness sprint complete. Next release waits for founder production instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${69 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH PRODUCTION SPRINT PHASES START -->",
    "            <!-- VEDAPATH PRODUCTION SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH READINESS SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${69 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.0.4 Launch Control Center"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Production readiness sprint complete" : `${visible.length}/10 production readiness rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep production posture narrow: source service, consent, review, or evaluation.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, reviewer approval, authentication, analytics, or licensed audio.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder production instruction before the next lane."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/\d+% launch readiness sprint\. New: [\s\S]*?<\/p>/, `${active.progress}% production readiness sprint. New: ${shortTitle(active)} turns the next implementation choice into one narrow lane.</p>`);
  content = content.replace(/100% trusted MVP prototype\. New: [\s\S]*?<\/p>/, `${active.progress}% production readiness sprint. New: ${shortTitle(active)} turns the next implementation choice into one narrow lane.</p>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH PRODUCTION SPRINT HOME START -->",
    "          <!-- VEDAPATH PRODUCTION SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH READINESS SPRINT HOME END -->"
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
    "          <!-- VEDAPATH PRODUCTION SPRINT FEATURES START -->",
    "          <!-- VEDAPATH PRODUCTION SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH READINESS SPRINT FEATURES END -->"
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

console.log(`Generated production readiness sprint through ${active.version} (${visible.length}/10).`);
