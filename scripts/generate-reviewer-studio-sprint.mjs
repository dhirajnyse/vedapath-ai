import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const reviewItems = [
  {
    id: "review-bg-2-48-steadiness",
    title: "Steadiness in Action Reader Trace",
    source_candidate: "Bhagavad Gita 2.48",
    text_family: "Bhagavad Gita | Smriti",
    queue: "source",
    severity: "medium",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "source reviewer",
    claim_under_review: "Can this passage support a calm carry-action prompt without sounding like therapy?",
    evidence_needed: "Translation edition, commentary lane, source-rights decision, and no-go wording review.",
    proposed_public_effect: "Display as reflection preview only after review.",
    no_go: "Do not imply therapy, diagnosis, emergency support, ritual authority, or guaranteed peace.",
    user_facing_boundary: "Reflection candidate, not medical advice or spiritual authority.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "request-source"
  },
  {
    id: "review-katha-choice",
    title: "Good vs Pleasant Context Gate",
    source_candidate: "Katha Upanishad 1.2.1",
    text_family: "Upanishad | Shruti",
    queue: "boundary",
    severity: "high",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "boundary reviewer",
    claim_under_review: "Can the reader use this source for discernment without judging another person's life?",
    evidence_needed: "Upanishad context, translation rights, and social/ethical overextension check.",
    proposed_public_effect: "Keep reflection prompt, strengthen no-go copy.",
    no_go: "Do not use for moral policing, relationship advice, health decisions, or emergency choices.",
    user_facing_boundary: "Source-guided reflection, not moral command.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "hold"
  },
  {
    id: "review-mundaka-knowledge",
    title: "Two Kinds of Knowing Category Check",
    source_candidate: "Mundaka Upanishad 1.1.4",
    text_family: "Upanishad | Shruti",
    queue: "category",
    severity: "medium",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "category reviewer",
    claim_under_review: "Does the explanation avoid dismissing science, scholarship, and practical skill?",
    evidence_needed: "Sanskrit term review, commentary variants, and category labels.",
    proposed_public_effect: "Allow beginner concept explanation after category review.",
    no_go: "Do not frame higher/lower knowledge as anti-science or anti-scholarship.",
    user_facing_boundary: "Educational layer, not a ranking of people or disciplines.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "request-source"
  },
  {
    id: "review-isha-restraint",
    title: "Restraint Reflection Rights Check",
    source_candidate: "Isha Upanishad 1",
    text_family: "Upanishad | Shruti",
    queue: "rights",
    severity: "high",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "rights reviewer",
    claim_under_review: "Can the product show a paraphrase-level reflection without exposing restricted text?",
    evidence_needed: "Translation rights, paraphrase policy, and school-specific interpretation boundary.",
    proposed_public_effect: "Display citation and reflection only, no full text.",
    no_go: "Do not pressure users to give up safety, property, shelter, or responsibility.",
    user_facing_boundary: "Reflection support, not economic, legal, or renunciation advice.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "hold"
  },
  {
    id: "review-taittiriya-conduct",
    title: "Conduct After Learning Authority Check",
    source_candidate: "Taittiriya Upanishad 1.11.1",
    text_family: "Upanishad | Shruti",
    queue: "authority",
    severity: "high",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "authority reviewer",
    claim_under_review: "Does conduct guidance avoid becoming command, policy, or social control?",
    evidence_needed: "Contextual source note, translation review, and consent/safety no-go copy.",
    proposed_public_effect: "Hold until authority boundary is reviewed.",
    no_go: "Do not override consent, law, safety, or personal boundaries.",
    user_facing_boundary: "Educational reflection, not social command.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "block-overclaim"
  },
  {
    id: "review-bg-18-63-agency",
    title: "Reflect and Choose Agency Check",
    source_candidate: "Bhagavad Gita 18.63",
    text_family: "Bhagavad Gita | Smriti",
    queue: "source",
    severity: "medium",
    status: "needs-review",
    rights_state: "display-citation-only",
    reviewer_role: "source reviewer",
    claim_under_review: "Can the product support personal agency without pretending choices are easy or isolated?",
    evidence_needed: "Speaker/context note, theological frame, and modern decision boundary.",
    proposed_public_effect: "Display with agency boundary and reviewer note.",
    no_go: "Do not pretend every decision is easy, isolated, or free of real constraints.",
    user_facing_boundary: "Reflection candidate, not command or oracle.",
    decision_options: ["hold", "request-source", "approve-preview", "block-overclaim"],
    suggested_decision: "request-source"
  }
];

const releases = [
  {
    version: "v2.0.5",
    badge: "v2.0.5 review intake",
    slug: "reviewintake",
    nav: "Intake",
    title: "VedaPath Review Intake Desk",
    pageLabel: "Reviewer studio",
    eyebrow: "Review intake",
    h1: "Turn reader traces into review work.",
    lead: "A browser-only review intake desk that turns source reader handoffs into visible review items with queue, severity, source, and no-go boundaries.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Review intake prototype, not submitted workflow.",
    progress: 101,
    next: "Source Evidence Checklist",
    defaultQueue: "all",
    primaryAsk: "Start treating reader output as reviewable product evidence.",
    summary: "Review Intake Desk creates the first visible bridge between guided reading and human review.",
    items: [
      ["Queue cards", "Every trace becomes a scoped review item.", "Makes review concrete."],
      ["Severity label", "Medium and high risks are visible.", "Helps prioritize."],
      ["No-go line", "Misuse stays attached to the item.", "Prevents context loss."],
      ["Prototype boundary", "The desk does not claim real approval.", "Keeps scope honest."]
    ]
  },
  {
    version: "v2.0.6",
    badge: "v2.0.6 source check",
    slug: "sourcecheck",
    nav: "Source",
    title: "VedaPath Source Evidence Checklist",
    pageLabel: "Source evidence",
    eyebrow: "Source checklist",
    h1: "Review the source before the answer.",
    lead: "A source evidence checklist that keeps citation, family, evidence needed, and reviewer role visible before any public answer state changes.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Evidence checklist, not source approval.",
    progress: 102,
    next: "Rights Review Gate",
    defaultQueue: "source",
    primaryAsk: "Make source evidence the first review gate.",
    summary: "Source Evidence Checklist prevents review from becoming a vague thumbs-up.",
    items: [
      ["Evidence needed", "Each item names what is missing.", "Guides reviewer action."],
      ["Role label", "Source, boundary, rights, or authority reviewer is explicit.", "Keeps scope clear."],
      ["Candidate source", "Citation identity remains visible.", "Prevents category blur."],
      ["Decision hold", "Items can stay held without shame.", "Protects accuracy."]
    ]
  },
  {
    version: "v2.0.7",
    badge: "v2.0.7 rights gate",
    slug: "rightsreview",
    nav: "Rights",
    title: "VedaPath Rights Review Gate",
    pageLabel: "Rights review",
    eyebrow: "Rights gate",
    h1: "Respect the text before displaying it.",
    lead: "A rights gate that separates citation display, paraphrase preview, translation rights, and public text use before content becomes beta-visible.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Rights gate prototype, not legal clearance.",
    progress: 103,
    next: "Boundary Decision Board",
    defaultQueue: "rights",
    primaryAsk: "Keep source rights visible before adding richer text display.",
    summary: "Rights Review Gate makes text-use caution part of the product workflow.",
    items: [
      ["Rights state", "Display-citation-only remains prominent.", "Avoids accidental text display."],
      ["Public effect", "The proposed user-facing change is named.", "Prevents hidden changes."],
      ["Legal boundary", "The page does not claim clearance.", "Keeps humility."],
      ["Reviewer action", "Rights decisions can stay held.", "Protects launch readiness."]
    ]
  },
  {
    version: "v2.0.8",
    badge: "v2.0.8 boundary board",
    slug: "boundaryboard",
    nav: "Boundary",
    title: "VedaPath Boundary Decision Board",
    pageLabel: "Boundary board",
    eyebrow: "Boundary decisions",
    h1: "Decide what the product must not say.",
    lead: "A boundary board that makes therapy, authority, moral policing, anti-science, and life-command risks visible before a reader prompt ships.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Boundary board, not safety certification.",
    progress: 104,
    next: "Reviewer Decision Composer",
    defaultQueue: "boundary",
    primaryAsk: "Turn no-go boundaries into review decisions, not footnotes.",
    summary: "Boundary Decision Board makes restraint an active product decision.",
    items: [
      ["No-go filter", "Boundary-heavy items can be inspected together.", "Focuses risk work."],
      ["User boundary", "Public-facing boundary copy is visible.", "Keeps wording practical."],
      ["Block option", "Overclaims can be blocked explicitly.", "Protects trust."],
      ["Calm tone", "The board stays firm without becoming harsh.", "Keeps UX humane."]
    ]
  },
  {
    version: "v2.0.9",
    badge: "v2.0.9 decision",
    slug: "decisioncomposer",
    nav: "Decision",
    title: "VedaPath Reviewer Decision Composer",
    pageLabel: "Decision composer",
    eyebrow: "Review decision",
    h1: "Write the decision in one clean line.",
    lead: "A decision composer that lets a reviewer choose hold, request source, approve preview, or block overclaim and then copy a compact decision note.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Decision composer, not real approval.",
    progress: 105,
    next: "Local Decision Memory",
    defaultQueue: "category",
    primaryAsk: "Make review decisions explicit enough to audit later.",
    summary: "Reviewer Decision Composer turns review intent into a readable, copyable decision packet.",
    items: [
      ["Decision buttons", "The reviewer chooses one clear state.", "Avoids vague feedback."],
      ["Decision note", "The handoff includes source, role, queue, and boundary.", "Keeps context."],
      ["Public effect", "The intended product outcome is visible.", "Links review to UX."],
      ["No approval claim", "Preview approval is not production approval.", "Keeps scope honest."]
    ]
  },
  {
    version: "v2.1.0",
    badge: "v2.1.0 decision memory",
    slug: "decisionmemory",
    nav: "Memory",
    title: "VedaPath Local Decision Memory",
    pageLabel: "Decision memory",
    eyebrow: "Local memory",
    h1: "Remember decisions only on this device.",
    lead: "A local decision memory preview that saves reviewer choices in the browser so workflow value can be tested before accounts, sync, or real approval.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Local decision memory, not durable review history.",
    progress: 106,
    next: "Review Audit Trail",
    defaultQueue: "all",
    primaryAsk: "Test reviewer rhythm without claiming durable workflow storage.",
    summary: "Local Decision Memory tests review workflow behavior while preserving the privacy and authority boundary.",
    items: [
      ["Local save", "Decisions stay in the browser preview.", "Protects scope."],
      ["Decision count", "Saved decision count is visible.", "Shows workflow value."],
      ["Clear control", "Preview memory can be cleared.", "Keeps user control."],
      ["No account claim", "The app does not imply reviewer identity.", "Avoids false workflow."]
    ]
  },
  {
    version: "v2.1.1",
    badge: "v2.1.1 audit",
    slug: "reviewaudit",
    nav: "Audit",
    title: "VedaPath Review Audit Trail",
    pageLabel: "Review audit",
    eyebrow: "Audit trail",
    h1: "Keep the decision and the boundary together.",
    lead: "An audit trail preview that shows saved decision, source candidate, no-go line, reviewer role, and public effect in one local record.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Audit preview, not compliance log.",
    progress: 107,
    next: "Public Effect Preview",
    defaultQueue: "authority",
    primaryAsk: "Make every review decision explainable without turning it into a legal record.",
    summary: "Review Audit Trail keeps product decisions accountable without pretending compliance infrastructure exists.",
    items: [
      ["Audit row", "Decision, source, role, no-go, and effect stay together.", "Prevents drift."],
      ["Local-only", "Audit rows are preview state only.", "Keeps honesty."],
      ["Boundary reuse", "The no-go line travels with the decision.", "Prevents overclaim."],
      ["Export posture", "Copy, not sync, remains the handoff.", "Keeps scope lean."]
    ]
  },
  {
    version: "v2.1.2",
    badge: "v2.1.2 public effect",
    slug: "publiceffect",
    nav: "Effect",
    title: "VedaPath Public Effect Preview",
    pageLabel: "Public effect",
    eyebrow: "Public effect",
    h1: "Show what the user would see next.",
    lead: "A public effect preview that translates reviewer decisions into display, hold, request-source, or block-overclaim outcomes without changing production content.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Public effect preview, not production release.",
    progress: 108,
    next: "Mobile Review Polish",
    defaultQueue: "source",
    primaryAsk: "Connect reviewer decisions to the user-facing answer state.",
    summary: "Public Effect Preview helps VedaPath see how review choices should shape the learner experience.",
    items: [
      ["Display outcome", "Decision maps to public preview behavior.", "Closes the review loop."],
      ["Hold outcome", "Held items remain visible as held.", "Avoids silent changes."],
      ["Block outcome", "Overclaim blocks are explicit.", "Protects users."],
      ["No release claim", "The preview does not publish content.", "Keeps authority clear."]
    ]
  },
  {
    version: "v2.1.3",
    badge: "v2.1.3 review mobile",
    slug: "reviewmobile",
    nav: "Mobile",
    title: "VedaPath Mobile Review Polish",
    pageLabel: "Mobile review",
    eyebrow: "Mobile review",
    h1: "Let review stay calm on a small screen.",
    lead: "A mobile polish pass that keeps queue filters, selected item, decision buttons, memory, and handoff readable on phone-size screens.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Responsive review polish, not native reviewer app.",
    progress: 109,
    next: "Reviewer Studio Control Room",
    defaultQueue: "all",
    primaryAsk: "Keep reviewer workflow usable without dense dashboard clutter.",
    summary: "Mobile Review Polish keeps VedaPath's trust workflow calm and usable on small screens.",
    items: [
      ["Single column", "The queue, decision, and audit stack cleanly.", "Protects mobile clarity."],
      ["Stable controls", "Decision buttons stay easy to tap.", "Prevents mistakes."],
      ["Readable queue", "Source and risk labels remain scannable.", "Protects review quality."],
      ["No clutter", "The page stays operational, not decorative.", "Keeps focus."]
    ]
  },
  {
    version: "v2.1.4",
    badge: "v2.1.4 reviewer",
    slug: "reviewerstudio",
    nav: "Studio",
    title: "VedaPath Reviewer Studio Control Room",
    pageLabel: "Reviewer studio",
    eyebrow: "Reviewer control",
    h1: "Make trust review a calm product habit.",
    lead: "A control room for browser-only reviewer workflow: queue filters, source evidence, boundary checks, local decisions, audit preview, public effect, and copyable handoff.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Reviewer studio prototype, not real approval workflow.",
    progress: 110,
    next: "Founder instruction",
    defaultQueue: "all",
    primaryAsk: "Choose whether the next sprint builds reviewed content, accounts, or a production backend path.",
    summary: "Reviewer Studio Control Room completes the review sprint and gives VedaPath a concrete trust workflow after source reading.",
    items: [
      ["Review path", "Queue, filters, decision, and audit are in one workspace.", "Makes trust operational."],
      ["Source path", "Evidence needed and source candidate remain visible.", "Protects accuracy."],
      ["Boundary path", "No-go and public boundary copy stay close to every decision.", "Protects users."],
      ["Next path", "The studio prepares reviewed content, accounts, or backend work.", "Keeps strategy clear."]
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
      ["Review promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No approval claim", "Do not imply production approval, scholar endorsement, legal clearance, or public launch readiness."],
      ["No authority claim", "Do not let reviewer workflow become guru voice, ritual authority, therapy, diagnosis, or life command."],
      ["No storage claim", "Local browser decisions are preview state only until accounts, consent, and backend storage exist."]
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
  const start = "          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH GUIDED READER SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH GUIDED READER SPRINT NAV END -->", `          <!-- VEDAPATH GUIDED READER SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("<span class=\"version\">")) {
    content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  }
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

function reviewData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "reviewer studio prototype",
    warning: "Prototype review data only. Local decisions are not scholar approval, legal clearance, production storage, or public answer release.",
    items: reviewItems
  };
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
    <link rel="stylesheet" href="assets/vedapath-reviewer-studio.css">
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
          <a class="link" href="sourcereader.html">Reader</a>
          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Reviewer studio sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn reader traces into browser-only review workflow.</p>
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

          <section class="review-studio" id="reviewStudio" data-default-queue="${item.defaultQueue}" aria-label="Reviewer studio">
            <div class="review-head">
              <div>
                <span class="eyebrow">Browser-only review studio</span>
                <h2>Reviewer Studio</h2>
                <p class="muted">Reads <strong>data/vedapath-review-queue.json</strong>. Decisions are device-local preview state until real reviewer accounts and backend storage exist.</p>
              </div>
              <div id="reviewStats" class="review-stats" aria-live="polite"></div>
            </div>
            <div class="review-layout">
              <div>
                <label class="review-label" for="queueFilter">Queue filter</label>
                <select id="queueFilter" class="review-select"></select>
                <div class="review-chips" id="reviewChips" aria-label="Review quick filters"></div>
                <div class="review-list" id="reviewList" aria-label="Review queue"></div>
              </div>
              <div>
                <div id="reviewDetail" class="review-detail"></div>
                <div class="decision-row" id="decisionRow" aria-label="Decision options"></div>
                <div class="review-actions">
                  <button class="button primary" id="saveDecision" type="button">Save Local Decision</button>
                  <button class="button safe" id="copyReviewHandoff" type="button">Copy Handoff</button>
                  <button class="button" id="clearReviewMemory" type="button">Clear Local Preview</button>
                </div>
                <label class="review-label" for="reviewHandoff">Reviewer handoff preview</label>
                <textarea id="reviewHandoff" readonly aria-label="Reviewer handoff output"></textarea>
                <div id="auditTrail" class="audit-trail" aria-label="Local audit preview"></div>
              </div>
            </div>
          </section>

          <h2>Review Signals</h2>
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
          <span class="badge green">Reviewer studio</span>
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
              <div><strong>Intake</strong><p>Receive reader traces.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Review</strong><p>Check source, rights, and boundary.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Decide</strong><p>Hold, request, approve preview, or block.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Trace</strong><p>Copy local audit context.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="muted">This is a browser-only reviewer workflow prototype. It is not scholar approval, legal clearance, production storage, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-reviewer-studio.js"></script>
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

## Review Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-review-queue.json
- data/vedapath-reader-passages.json

## No-Go Boundary

This release should not imply production approval, scholar endorsement, legal clearance, durable review storage, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function writeReviewAssets() {
  write("data/vedapath-review-queue.json", `${safeJson(reviewData())}\n`);
  write("assets/vedapath-reviewer-studio.css", `/* VedaPath reviewer studio */
.review-studio {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.88);
}

.review-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 260px);
  gap: 14px;
  align-items: start;
}

.review-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.review-stat,
.review-card,
.review-detail,
.audit-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.review-stat {
  padding: 10px;
}

.review-stat span,
.review-detail span,
.audit-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.review-stat strong {
  display: block;
  font-size: 22px;
  line-height: 1.1;
}

.review-layout {
  display: grid;
  grid-template-columns: minmax(230px, 0.86fr) minmax(0, 1.14fr);
  gap: 14px;
  align-items: start;
}

.review-label {
  display: block;
  margin: 14px 0 6px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 850;
}

.review-select {
  width: 100%;
  min-height: 42px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px 12px;
  font-weight: 800;
}

.review-chips,
.decision-row,
.review-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-chips {
  margin: 10px 0;
}

.review-chip,
.decision-button {
  min-height: 34px;
  border: 1px solid #efb899;
  border-radius: 8px;
  background: var(--surface);
  color: var(--ochre);
  padding: 7px 10px;
  font-weight: 850;
}

.review-chip.active,
.decision-button.active {
  background: var(--bhagwa);
  border-color: var(--bhagwa);
  color: white;
}

.review-list {
  display: grid;
  gap: 8px;
}

.review-card {
  width: 100%;
  padding: 11px;
  text-align: left;
  color: inherit;
}

.review-card.active,
.review-card:hover,
.review-card:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.review-card strong,
.review-card span {
  display: block;
}

.review-card span {
  color: var(--muted);
  font-size: 12px;
}

.review-card.high {
  border-left: 4px solid var(--bhagwa);
}

.review-card.medium {
  border-left: 4px solid var(--gold);
}

.review-detail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border-left: 4px solid var(--green);
}

.review-detail .wide {
  grid-column: 1 / -1;
}

.decision-row {
  margin: 12px 0;
}

.review-actions {
  margin: 12px 0;
}

#reviewHandoff {
  width: 100%;
  min-height: 168px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
}

.audit-trail {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.audit-card {
  padding: 12px;
}

@media (max-width: 860px) {
  .review-head,
  .review-layout,
  .review-detail,
  .review-stats {
    grid-template-columns: 1fr;
  }

  .review-actions .button,
  .decision-button,
  .review-chip {
    width: 100%;
  }
}
`);

  write("assets/vedapath-reviewer-studio.js", `const reviewStudioRoot = document.getElementById("reviewStudio");

if (reviewStudioRoot) {
  initReviewStudio().catch((error) => {
    reviewStudioRoot.innerHTML = '<p class="muted">Reviewer studio could not load review queue data.</p>';
    console.error(error);
  });
}

async function reviewLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function reviewText(value) {
  return value === 0 ? "0" : String(value || "");
}

function reviewSafe(value) {
  return reviewText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function reviewStorageKey() {
  return "vedapath-reviewer-studio-decisions";
}

function readReviewDecisions() {
  try {
    return JSON.parse(localStorage.getItem(reviewStorageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeReviewDecisions(decisions) {
  localStorage.setItem(reviewStorageKey(), JSON.stringify(decisions.slice(0, 20)));
}

function selectedDecisionFor(item, decisions) {
  const hit = decisions.find((decision) => decision.id === item.id);
  return hit ? hit.decision : item.suggested_decision;
}

function publicEffect(decision) {
  const effects = {
    "hold": "Keep held; do not show as answer-ready.",
    "request-source": "Ask for stronger source evidence before display.",
    "approve-preview": "Allow reflection preview only; not production approval.",
    "block-overclaim": "Block public use until overclaim is rewritten."
  };
  return effects[decision] || effects.hold;
}

function handoffText(item, decision, decisions) {
  return [
    "VedaPath Reviewer Studio Handoff",
    "Review item: " + item.title,
    "Source candidate: " + item.source_candidate,
    "Text family: " + item.text_family,
    "Queue: " + item.queue,
    "Reviewer role: " + item.reviewer_role,
    "Decision: " + decision,
    "Public effect: " + publicEffect(decision),
    "Evidence needed: " + item.evidence_needed,
    "No-go: " + item.no_go,
    "Saved local decisions: " + decisions.length,
    "",
    "Boundary: browser-only review prototype; not scholar approval, legal clearance, production storage, public answer release, therapy, or spiritual authority."
  ].join("\\n");
}

function renderReviewStats(root, items, filtered, decisions) {
  const high = items.filter((item) => item.severity === "high").length;
  root.querySelector("#reviewStats").innerHTML = [
    ["Items", items.length],
    ["Visible", filtered.length],
    ["High risk", high],
    ["Saved", decisions.length]
  ].map((row) => '<div class="review-stat"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
}

async function initReviewStudio() {
  const queueData = await reviewLoadJson("data/vedapath-review-queue.json");
  const items = queueData.items || [];
  const filter = reviewStudioRoot.querySelector("#queueFilter");
  const chipsNode = reviewStudioRoot.querySelector("#reviewChips");
  const listNode = reviewStudioRoot.querySelector("#reviewList");
  const detailNode = reviewStudioRoot.querySelector("#reviewDetail");
  const decisionNode = reviewStudioRoot.querySelector("#decisionRow");
  const handoff = reviewStudioRoot.querySelector("#reviewHandoff");
  const auditNode = reviewStudioRoot.querySelector("#auditTrail");
  const queues = ["all", ...Array.from(new Set(items.map((item) => item.queue)))];
  const state = {
    queue: reviewStudioRoot.dataset.defaultQueue || "all",
    itemId: items[0] && items[0].id,
    decision: ""
  };

  filter.innerHTML = queues.map((queue) => (
    '<option value="' + reviewSafe(queue) + '">' + reviewSafe(queue) + '</option>'
  )).join("");

  function filteredItems() {
    return state.queue === "all" ? items : items.filter((item) => item.queue === state.queue);
  }

  function selectedItem() {
    const filtered = filteredItems();
    return filtered.find((item) => item.id === state.itemId) || filtered[0] || items[0];
  }

  function ensureSelected() {
    const item = selectedItem();
    state.itemId = item && item.id;
    return item;
  }

  function renderChips() {
    chipsNode.innerHTML = queues.map((queue) => (
      '<button class="review-chip' + (queue === state.queue ? ' active' : '') + '" type="button" data-queue="' + reviewSafe(queue) + '">' + reviewSafe(queue) + '</button>'
    )).join("");
  }

  function renderList(item) {
    const filtered = filteredItems();
    listNode.innerHTML = filtered.map((row) => (
      '<button class="review-card ' + reviewSafe(row.severity) + (row.id === item.id ? ' active' : '') + '" type="button" data-review-id="' + reviewSafe(row.id) + '">' +
        '<strong>' + reviewSafe(row.title) + '</strong>' +
        '<span>' + reviewSafe(row.source_candidate) + '</span>' +
        '<span>' + reviewSafe(row.queue + " | " + row.severity + " | " + row.reviewer_role) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderDetail(item, decision) {
    detailNode.innerHTML = [
      ["Source", item.source_candidate],
      ["Family", item.text_family],
      ["Queue", item.queue],
      ["Role", item.reviewer_role],
      ["Claim under review", item.claim_under_review, "wide"],
      ["Evidence needed", item.evidence_needed, "wide"],
      ["No-go", item.no_go, "wide"],
      ["Public effect", publicEffect(decision), "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
  }

  function renderDecisionButtons(item, decision) {
    decisionNode.innerHTML = item.decision_options.map((option) => (
      '<button class="decision-button' + (option === decision ? ' active' : '') + '" type="button" data-decision="' + reviewSafe(option) + '">' + reviewSafe(option) + '</button>'
    )).join("");
  }

  function renderAudit(decisions) {
    if (!decisions.length) {
      auditNode.innerHTML = '<article class="audit-card"><strong>No local review decisions yet</strong><p class="muted">Save a decision and the local audit preview will begin.</p></article>';
      return;
    }
    auditNode.innerHTML = decisions.slice(0, 4).map((decision) => (
      '<article class="audit-card"><strong>' + reviewSafe(decision.decision) + '</strong><span>' + reviewSafe(decision.title) + '</span><p class="muted">' + reviewSafe(decision.source) + ' | ' + reviewSafe(decision.date) + '</p></article>'
    )).join("");
  }

  function render() {
    const decisions = readReviewDecisions();
    const item = ensureSelected();
    if (!item) return;
    const decision = state.decision || selectedDecisionFor(item, decisions);
    filter.value = state.queue;
    renderReviewStats(reviewStudioRoot, items, filteredItems(), decisions);
    renderChips();
    renderList(item);
    renderDetail(item, decision);
    renderDecisionButtons(item, decision);
    renderAudit(decisions);
    handoff.value = handoffText(item, decision, decisions);
  }

  filter.addEventListener("change", () => {
    state.queue = filter.value;
    state.itemId = (filteredItems()[0] || items[0]).id;
    state.decision = "";
    render();
  });

  chipsNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-queue]");
    if (!button) return;
    state.queue = button.dataset.queue;
    state.itemId = (filteredItems()[0] || items[0]).id;
    state.decision = "";
    render();
  });

  listNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-id]");
    if (!button) return;
    state.itemId = button.dataset.reviewId;
    state.decision = "";
    render();
  });

  decisionNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-decision]");
    if (!button) return;
    state.decision = button.dataset.decision;
    render();
  });

  reviewStudioRoot.querySelector("#saveDecision").addEventListener("click", () => {
    const item = selectedItem();
    const decision = state.decision || item.suggested_decision;
    const decisions = readReviewDecisions().filter((row) => row.id !== item.id);
    decisions.unshift({
      id: item.id,
      title: item.title,
      source: item.source_candidate,
      queue: item.queue,
      decision,
      date: new Date().toISOString().slice(0, 10)
    });
    writeReviewDecisions(decisions);
    render();
  });

  reviewStudioRoot.querySelector("#clearReviewMemory").addEventListener("click", () => {
    localStorage.removeItem(reviewStorageKey());
    render();
  });

  reviewStudioRoot.querySelector("#copyReviewHandoff").addEventListener("click", () => {
    handoff.focus();
    handoff.select();
    const button = reviewStudioRoot.querySelector("#copyReviewHandoff");
    const originalText = button.textContent;
    const showCopied = () => {
      button.textContent = "Copied Handoff";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1400);
    };
    const fallbackCopy = () => {
      try {
        document.execCommand("copy");
      } catch (error) {
        return;
      }
      showCopied();
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(handoff.value).then(showCopied).catch(fallbackCopy);
      return;
    }
    fallbackCopy();
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
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT LINKS START -->",
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH GUIDED READER SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES START -->",
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH GUIDED READER SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT NOTES START -->",
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH GUIDED READER SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT SUMMARY START -->",
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH GUIDED READER SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${188 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep review decisions browser-only until reviewer identity, consent, backend storage, and source policy are approved

${shortTitle(item)} should never claim production approval, scholar endorsement, legal clearance, durable review storage, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH GUIDED READER SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="reviewerstudio.html">Reviewer</a>')) {
    content = content.replace('href="sourcereader.html">Reader</a>', 'href="sourcereader.html">Reader</a> | <a href="reviewerstudio.html">Reviewer</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Reviewer studio sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>Reviewer studio sprint progress: ${visible.length}/10 rooms complete. Reader traces can now become browser-only review decisions.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 70 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 70 + visible.length)}%"></div></div>
          <p>Reviewer studio path: intake, source evidence, rights gate, boundary board, decision composer, local memory, audit trail, public effect, and mobile polish are now mapped.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Reviewer studio sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${169 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH REVIEWER STUDIO SPRINT PHASES START -->",
    "            <!-- VEDAPATH REVIEWER STUDIO SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH GUIDED READER SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${169 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.0.4 Guided Source Reader Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Reviewer studio sprint complete" : `${visible.length}/10 reviewer studio rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: queue, source evidence, rights, boundary, decision, local memory, audit, public effect, mobile polish.</span></li>
              <li><span class="dot"></span><span>Do not claim scholar approval, legal clearance, production storage, therapy, ritual instruction, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing reviewed content, accounts, or production backend work."}</span></li>
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
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT HOME START -->",
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH GUIDED READER SPRINT HOME END -->"
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
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES START -->",
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH GUIDED READER SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeReviewAssets();

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

console.log(`Generated reviewer-studio sprint through ${active.version} (${visible.length}/10).`);
