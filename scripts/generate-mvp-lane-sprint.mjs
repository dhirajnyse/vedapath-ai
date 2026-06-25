import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.4.5",
    badge: "v1.4.5 seed",
    slug: "mvpseed",
    nav: "Seed",
    title: "VedaPath MVP Source Seed",
    pageLabel: "MVP source seed",
    eyebrow: "Working MVP lane",
    h1: "Start the real product with a tiny trusted seed.",
    lead: "A first working source seed for the MVP lane: small enough to review, structured enough to power retrieval, and honest about gaps.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "MVP data seed, not verified corpus coverage.",
    progress: 91,
    next: "Local Retrieval Demo",
    primaryAsk: "Choose the first source records that are narrow, reviewable, and useful for beta answers.",
    summary: "MVP Source Seed narrows VedaPath from many prototypes to a small source set that can power a real first answer lane.",
    items: [
      ["Record shape", "Citation, family, public answer scope, review state, and no-go claims.", "Makes retrieval possible."],
      ["First topics", "Steady action, source categories, question discipline, and calm boundaries.", "Serves early users."],
      ["Review gaps", "Translation note, commentary lane, rights state, and Sanskrit review.", "Keeps humility visible."],
      ["Ready rule", "Only reviewed and eligible records can power public confidence.", "Protects trust."]
    ],
    modes: {
      brief: [
        ["Seed promise", "The MVP should begin with a small source set that is easy to inspect."],
        ["Product move", "Prefer ten strong records over a hundred vague ones."],
        ["Trust move", "Make every missing field visible before public use."]
      ],
      checklist: [
        ["Narrow", "Can each record answer a specific beta question?"],
        ["Reviewed", "Is the review state explicit?"],
        ["Blocked", "Are no-go claims named?"]
      ],
      boundary: [
        ["No corpus claim", "Do not imply broad scriptural coverage."],
        ["No hidden gaps", "Do not hide missing review or rights fields."],
        ["No public confidence", "Do not use draft records for high-confidence answers."]
      ]
    }
  },
  {
    version: "v1.4.6",
    badge: "v1.4.6 retrieval",
    slug: "localretrieval",
    nav: "Retrieval",
    title: "VedaPath Local Retrieval Demo",
    pageLabel: "Local retrieval demo",
    eyebrow: "Source lookup",
    h1: "Find the source before forming the answer.",
    lead: "A local retrieval demo for matching question type, source family, topic, eligibility, and fallback state before any model response.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Static retrieval demo, not production search.",
    progress: 92,
    next: "Answer Renderer Demo",
    primaryAsk: "Make source lookup a visible step before answer generation.",
    summary: "Local Retrieval Demo proves the first MVP answer can start with eligible source records instead of broad model guessing.",
    items: [
      ["Question route", "Lookup, explain, compare, claim-check, or calm reflection.", "Clarifies search intent."],
      ["Match reason", "Topic, source family, keyword, and answer scope.", "Explains retrieval."],
      ["Eligibility", "Ready records pass; hold, blocked, and rights-needed records stop.", "Guards output."],
      ["Fallback", "No-source and reviewer-needed become honest product states.", "Avoids invention."]
    ],
    modes: {
      brief: [
        ["Retrieval promise", "A narrow sourced answer is better than a broad confident one."],
        ["UX move", "Show match reason in plain language."],
        ["Engineering move", "Gate eligibility before ranking."]
      ],
      checklist: [
        ["Matched", "Can the page explain why a source was found?"],
        ["Eligible", "Are blocked records excluded?"],
        ["Fallback", "Can no-source resolve safely?"]
      ],
      boundary: [
        ["No live search claim", "Do not call this production retrieval."],
        ["No hidden ranking", "Do not hide why a source was selected."],
        ["No source invention", "Do not answer when no eligible source exists."]
      ]
    }
  },
  {
    version: "v1.4.7",
    badge: "v1.4.7 renderer demo",
    slug: "rendererdemo",
    nav: "Renderer",
    title: "VedaPath Answer Renderer Demo",
    pageLabel: "Answer renderer demo",
    eyebrow: "Answer UI",
    h1: "Make the answer card feel inevitable.",
    lead: "A rendered answer demo with direct response, source card, confidence reason, plain meaning, deeper layer, and boundary line.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Static renderer demo, not AI generation.",
    progress: 93,
    next: "Citation Drawer",
    primaryAsk: "Lock the visual answer anatomy before connecting real generation.",
    summary: "Answer Renderer Demo turns source-first trust into one clean, repeatable card that stays readable on mobile.",
    items: [
      ["Direct answer", "One clear response first.", "Keeps simplicity."],
      ["Source card", "Citation, family, review state, and rights status.", "Shows grounding."],
      ["Confidence reason", "Why the answer is direct, limited, or uncertain.", "Makes trust legible."],
      ["Boundary", "What not to overclaim and what needs review.", "Keeps humility visible."]
    ],
    modes: {
      brief: [
        ["Renderer promise", "The answer should feel calm because the trust parts are stable."],
        ["Design move", "Reserve large text for the answer, small cards for evidence."],
        ["Product move", "Every answer should have a visible boundary."]
      ],
      checklist: [
        ["Readable", "Can a user scan the answer quickly?"],
        ["Grounded", "Is the source card unavoidable?"],
        ["Humble", "Is overclaiming blocked in the visible UI?"]
      ],
      boundary: [
        ["No AI claim", "Do not imply generation is live."],
        ["No hidden source", "Do not hide the citation behind secondary clicks."],
        ["No generic confidence", "Do not show confidence without reason."]
      ]
    }
  },
  {
    version: "v1.4.8",
    badge: "v1.4.8 citation",
    slug: "citationdrawer",
    nav: "Citation",
    title: "VedaPath Citation Drawer",
    pageLabel: "Citation drawer",
    eyebrow: "Evidence detail",
    h1: "Let curious users inspect the source without leaving the answer.",
    lead: "A citation drawer for source identity, passage context, translation note, review state, related records, and correction route.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Citation UI prototype, not licensed text display.",
    progress: 94,
    next: "Confidence Engine Demo",
    primaryAsk: "Design source inspection without overwhelming beginner answers.",
    summary: "Citation Drawer gives VedaPath a progressive evidence layer: simple answer first, inspectable source detail on demand.",
    items: [
      ["Identity", "Text family, citation, edition note, and source id.", "Prevents confusion."],
      ["Context", "What the passage can and cannot answer.", "Keeps scope narrow."],
      ["Review state", "Source, language, boundary, and rights lanes.", "Shows trust status."],
      ["Correction", "Report citation, category, translation, or boundary issue.", "Improves the source set."]
    ],
    modes: {
      brief: [
        ["Drawer promise", "Depth should be available without making the first answer heavy."],
        ["UX move", "Keep evidence one click away, not one page away."],
        ["Trust move", "Show review lanes beside the citation."]
      ],
      checklist: [
        ["Inspectible", "Can a user see source identity clearly?"],
        ["Scoped", "Does the drawer say what the source cannot support?"],
        ["Correctable", "Can users report an issue?"]
      ],
      boundary: [
        ["No full-text claim", "Do not display restricted translations."],
        ["No context inflation", "Do not overextend one passage."],
        ["No hidden correction", "Do not bury issue reporting."]
      ]
    }
  },
  {
    version: "v1.4.9",
    badge: "v1.4.9 confidence",
    slug: "confidenceengine",
    nav: "Confidence",
    title: "VedaPath Confidence Engine Demo",
    pageLabel: "Confidence engine demo",
    eyebrow: "Trust logic",
    h1: "Compute confidence from visible reasons.",
    lead: "A confidence engine demo that combines citation strength, review lane, rights state, answer scope, and boundary risk into one readable result.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Confidence logic demo, not automated certification.",
    progress: 95,
    next: "Consent Settings Demo",
    primaryAsk: "Make confidence depend on source fields rather than model tone.",
    summary: "Confidence Engine Demo shows how VedaPath can produce high, medium, low, or no-answer states from inspectable source data.",
    items: [
      ["Basis", "Direct passage, commentary, scholarly view, analogy, or uncertain.", "Sets grounding."],
      ["Review lane", "Reviewed, draft, held, blocked, or specialist-needed.", "Controls confidence."],
      ["Risk", "Ritual, therapy, science, privacy, or category overclaim.", "Adds caution."],
      ["Result", "High, medium, low, reviewer-needed, or no-source.", "Guides the answer."]
    ],
    modes: {
      brief: [
        ["Confidence promise", "Confidence should be explainable enough to challenge."],
        ["Logic move", "Use source fields and risk fields before answer tone."],
        ["UX move", "Show what would improve confidence."]
      ],
      checklist: [
        ["Explainable", "Can the user see the reason?"],
        ["Conservative", "Do risky gaps lower confidence?"],
        ["Actionable", "Does low confidence create a next step?"]
      ],
      boundary: [
        ["No fake precision", "Do not output arbitrary numeric scores."],
        ["No tone-based trust", "Do not trust confident language alone."],
        ["No blocked answers", "Do not answer from blocked records."]
      ]
    }
  },
  {
    version: "v1.5.0",
    badge: "v1.5.0 consent",
    slug: "consentsettings",
    nav: "Settings",
    title: "VedaPath Consent Settings Demo",
    pageLabel: "Consent settings demo",
    eyebrow: "User control",
    h1: "Make privacy settings part of the product, not a footnote.",
    lead: "A consent settings demo for local memory, source path sync, beta email, reviewer follow-up, export, delete, and pause.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Settings demo, not live account storage.",
    progress: 96,
    next: "Feedback Ticket Demo",
    primaryAsk: "Prepare user-owned controls before any real memory or account system is added.",
    summary: "Consent Settings Demo gives VedaPath a plain, reversible permission surface for future accounts and beta continuity.",
    items: [
      ["Local memory", "Keep private reflections on device only.", "Protects sensitive use."],
      ["Sync path", "Save learning path only after opt-in.", "Adds continuity."],
      ["Contact", "Separate beta updates from reviewer follow-up.", "Avoids bundled consent."],
      ["Exit", "Export, delete, pause, and clear local preview.", "Preserves user agency."]
    ],
    modes: {
      brief: [
        ["Consent promise", "The user should always know what VedaPath remembers."],
        ["UX move", "Name each permission in ordinary language."],
        ["Data move", "Every memory has an exit path."]
      ],
      checklist: [
        ["Specific", "Does each setting have one purpose?"],
        ["Reversible", "Can it be paused or deleted?"],
        ["Visible", "Is privacy accessible from the product surface?"]
      ],
      boundary: [
        ["No silent memory", "Do not remember without permission."],
        ["No bundled contact", "Do not combine email and review follow-up."],
        ["No hidden deletion", "Do not make clearing data hard."]
      ]
    }
  },
  {
    version: "v1.5.1",
    badge: "v1.5.1 ticket",
    slug: "feedbackticket",
    nav: "Ticket",
    title: "VedaPath Feedback Ticket Demo",
    pageLabel: "Feedback ticket demo",
    eyebrow: "Correction loop",
    h1: "Turn every correction into a reviewable ticket.",
    lead: "A feedback ticket demo for source issue, category confusion, boundary concern, privacy concern, usability friction, and reviewer routing.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Ticket demo, not live support intake.",
    progress: 97,
    next: "Reviewer Decision Demo",
    primaryAsk: "Make public feedback useful without collecting private sensitive details.",
    summary: "Feedback Ticket Demo routes user corrections into typed product work while blocking sensitive personal intake.",
    items: [
      ["Issue type", "Source, category, translation, boundary, privacy, or usability.", "Routes work."],
      ["Evidence", "Page link, citation, and optional short note.", "Improves triage."],
      ["Privacy guard", "No medical, crisis, family, or private identity details.", "Protects users."],
      ["Route", "Reviewer queue, product backlog, privacy hold, or no-action note.", "Closes the loop."]
    ],
    modes: {
      brief: [
        ["Ticket promise", "Corrections should improve trust without asking users to overshare."],
        ["Ops move", "Type every ticket before review."],
        ["Safety move", "Block sensitive personal stories at intake."]
      ],
      checklist: [
        ["Typed", "Does the ticket name the issue class?"],
        ["Scoped", "Can it be reviewed without private data?"],
        ["Routed", "Is the next owner clear?"]
      ],
      boundary: [
        ["No live support", "Do not imply immediate response."],
        ["No sensitive storage", "Do not collect private distress details."],
        ["No silent changes", "Do not alter source records without review."]
      ]
    }
  },
  {
    version: "v1.5.2",
    badge: "v1.5.2 decision",
    slug: "reviewdecision",
    nav: "Decision",
    title: "VedaPath Reviewer Decision Demo",
    pageLabel: "Reviewer decision demo",
    eyebrow: "Human trust",
    h1: "Let reviewers decide one clear thing at a time.",
    lead: "A reviewer decision demo for source approval, language hold, boundary correction, rights block, and answer release state.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Decision demo, not actual reviewer approval.",
    progress: 98,
    next: "Beta Landing Draft",
    primaryAsk: "Make reviewer decisions scoped enough to audit and safe enough to publish.",
    summary: "Reviewer Decision Demo shows how VedaPath can convert feedback tickets and source gaps into accountable release states.",
    items: [
      ["Lane", "Source, language, boundary, rights, or answer release.", "Narrows decision."],
      ["Choice", "Approve, hold, block, request evidence, or retire.", "Clarifies state."],
      ["Reason", "Short note tied to evidence.", "Creates auditability."],
      ["Public effect", "Display, lower confidence, hide answer, or route fallback.", "Connects review to UX."]
    ],
    modes: {
      brief: [
        ["Decision promise", "Review builds trust when the decision scope is precise."],
        ["Ops move", "Separate source approval from answer release."],
        ["UX move", "Let review state change what users see."]
      ],
      checklist: [
        ["Scoped", "Is the decision lane exact?"],
        ["Auditable", "Is the reason tied to evidence?"],
        ["Effective", "Does it change public answer behavior?"]
      ],
      boundary: [
        ["No broad endorsement", "Do not present one review as tradition-wide approval."],
        ["No private identity leak", "Do not publish reviewers without consent."],
        ["No ignored block", "Do not display blocked records."]
      ]
    }
  },
  {
    version: "v1.5.3",
    badge: "v1.5.3 landing",
    slug: "betalanding",
    nav: "Landing",
    title: "VedaPath Beta Landing Draft",
    pageLabel: "Beta landing draft",
    eyebrow: "Public beta story",
    h1: "Invite beta users into clarity, not hype.",
    lead: "A beta landing draft that presents the first answer, source trust, calm companion, waitlist boundary, and honest prototype status.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Landing draft, not final marketing approval.",
    progress: 99,
    next: "MVP Lane Control Room",
    primaryAsk: "Prepare a public beta story that is warm, useful, and careful.",
    summary: "Beta Landing Draft turns VedaPath's MVP lane into public-facing copy without losing source-first humility.",
    items: [
      ["Promise", "Ancient texts. Clear paths. Source-first calm.", "Memorable and direct."],
      ["Proof", "Source card, confidence reason, citation drawer, and trust center.", "Shows method."],
      ["Use", "Ask, inspect, reflect, learn, and return.", "Explains flow."],
      ["Boundary", "Prototype, no authority, no therapy, no ritual replacement.", "Keeps launch honest."]
    ],
    modes: {
      brief: [
        ["Landing promise", "Public copy should be calm because the product is careful."],
        ["Brand move", "Lead with source-first clarity, not spectacle."],
        ["Launch move", "Make prototype status visible in the main story."]
      ],
      checklist: [
        ["Clear", "Can a visitor understand the offer quickly?"],
        ["Credible", "Does the story show trust mechanics?"],
        ["Humble", "Are no-go boundaries visible?"]
      ],
      boundary: [
        ["No launch overclaim", "Do not imply production systems are live."],
        ["No healing claim", "Do not market calm as therapy."],
        ["No sacred sales pressure", "Do not use reverence as a shortcut."]
      ]
    }
  },
  {
    version: "v1.5.4",
    badge: "v1.5.4 mvp control",
    slug: "mvpcontrol",
    nav: "MVP Control",
    title: "VedaPath MVP Lane Control Room",
    pageLabel: "MVP lane control room",
    eyebrow: "MVP lane decision",
    h1: "Ship one narrow lane with visible trust.",
    lead: "A control room that brings source seed, local retrieval, answer renderer, citation drawer, confidence engine, consent settings, feedback ticket, reviewer decision, and beta landing into one MVP lane.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "MVP lane control, not production launch.",
    progress: 100,
    next: "Founder instruction",
    primaryAsk: "Choose whether the next sprint turns this MVP lane into actual static data, a real interactive page, or backend storage.",
    summary: "MVP Lane Control Room completes the working-MVP-lane sprint and gives VedaPath one practical path from prototype to shippable beta slice.",
    items: [
      ["Data", "Source seed and reviewable record shape.", "Creates trustworthy inputs."],
      ["Answer", "Retrieval, renderer, citation drawer, and confidence engine.", "Creates trustworthy outputs."],
      ["User", "Consent settings, feedback ticket, and beta landing.", "Creates safe entry."],
      ["Review", "Reviewer decision and hold states.", "Creates accountable improvement."]
    ],
    modes: {
      brief: [
        ["MVP promise", "Ship one lane users can trust before expanding the world."],
        ["Founder move", "Choose static data, interactive page, or backend storage next."],
        ["Product move", "Keep source, consent, feedback, and review visible together."]
      ],
      checklist: [
        ["Shippable", "Can this lane be built without broad platform work?"],
        ["Trustworthy", "Are source and review states visible?"],
        ["Useful", "Can a beta user complete one meaningful journey?"]
      ],
      boundary: [
        ["No broad product claim", "Do not imply every VedaPath surface is production-ready."],
        ["No backend claim", "Do not claim real storage or retrieval until built."],
        ["No trust shortcut", "Do not skip source, consent, feedback, or review."]
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
  const start = "          <!-- VEDAPATH MVP LANE SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH MVP LANE SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV END -->", `          <!-- VEDAPATH IMPLEMENTATION SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="releasecandidate.html">Candidate</a>
          <a class="link" href="betabeacon.html">Beta</a>
          <a class="link" href="trustcenter.html">Trust</a>
          <!-- VEDAPATH MVP LANE SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH MVP LANE SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Working MVP lane sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms move VedaPath from implementation readiness toward one shippable beta slice.</p>
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
          <span class="badge green">MVP lane</span>
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
              <div><strong>Data</strong><p>Shape the source record.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Answer</strong><p>Render source and confidence.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>User</strong><p>Protect consent and feedback.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Review</strong><p>Route human decisions.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a working-MVP-lane prototype. It does not create production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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
    "<!-- VEDAPATH MVP LANE SPRINT LINKS START -->",
    "<!-- VEDAPATH MVP LANE SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH MVP LANE SPRINT FEATURES START -->",
    "<!-- VEDAPATH MVP LANE SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH MVP LANE SPRINT NOTES START -->",
    "<!-- VEDAPATH MVP LANE SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH MVP LANE SPRINT SUMMARY START -->",
    "<!-- VEDAPATH MVP LANE SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${128 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable working-MVP-lane handoff

${shortTitle(item)} should never claim production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH MVP LANE SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH MVP LANE SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH IMPLEMENTATION SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="mvpcontrol.html">MVP Control</a>')) {
    content = content.replace('<a href="releasecandidate.html">Release Candidate</a>', '<a href="releasecandidate.html">Release Candidate</a> | <a href="mvpcontrol.html">MVP Control</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Working-MVP-lane sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Working-MVP-lane sprint progress: ${visible.length}/10 rooms complete. Real backend storage, live retrieval, and authentication remain future implementation choices.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Working-MVP-lane sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${109 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH MVP LANE SPRINT PHASES START -->",
    "            <!-- VEDAPATH MVP LANE SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH IMPLEMENTATION SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${109 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.4.4 Release Candidate Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Working-MVP-lane sprint complete" : `${visible.length}/10 MVP lane rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the MVP lane narrow: data, answer, user controls, and review.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, authentication, licensed audio, therapy, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing the next build lane."}</span></li>
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
    "          <!-- VEDAPATH MVP LANE SPRINT HOME START -->",
    "          <!-- VEDAPATH MVP LANE SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT HOME END -->"
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
    "          <!-- VEDAPATH MVP LANE SPRINT FEATURES START -->",
    "          <!-- VEDAPATH MVP LANE SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH IMPLEMENTATION SPRINT FEATURES END -->"
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

console.log(`Generated working-MVP-lane sprint through ${active.version} (${visible.length}/10).`);
