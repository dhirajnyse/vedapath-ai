import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.1.5",
    badge: "v1.1.5 source svc",
    slug: "sourcesvc",
    nav: "Source Svc",
    title: "VedaPath Source Service Sandbox",
    pageLabel: "Source service sandbox",
    eyebrow: "Backend lane preview",
    h1: "Make the source service visible before it is live.",
    lead: "A clickable sandbox for query shape, source eligibility, reviewer state, rights status, and no-source responses before production backend work begins.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Service sandbox, not a live API.",
    progress: 91,
    next: "Answer Preview Workbench",
    primaryAsk: "Freeze the public source-service contract before writing production retrieval code.",
    summary: "Source Service Sandbox gives VedaPath a narrow first implementation lane: one query, one candidate set, one eligibility decision, and one safe fallback.",
    items: [
      ["Query contract", "Question text, source family hint, depth, language, and safety context.", "Keeps input shape small."],
      ["Eligibility state", "Ready, hold, blocked, rights-needed, reviewer-needed, or no-source.", "Stops false confidence early."],
      ["Response reason", "Match reason, missing fields, and public-display allowance.", "Makes retrieval explainable."],
      ["Fallback", "No-source and analogy-only answers get careful boundaries.", "Protects the user's trust."]
    ],
    modes: {
      brief: [
        ["Build promise", "The backend should first make source state visible, not clever."],
        ["UX move", "Show eligibility and match reason beside the answer."],
        ["Engineering move", "Return no-source as a product state, not as an error."]
      ],
      checklist: [
        ["Small", "Can one endpoint answer one source lookup clearly?"],
        ["Gated", "Can it block hold and rights-needed records?"],
        ["Readable", "Can a non-engineer understand why the answer was allowed?"]
      ],
      boundary: [
        ["No live claim", "Do not call this a deployed API."],
        ["No hidden confidence", "Do not let the answer layer invent confidence."],
        ["No rights bypass", "Do not display restricted translation or audio fields."]
      ]
    }
  },
  {
    version: "v1.1.6",
    badge: "v1.1.6 answer preview",
    slug: "answerpreview",
    nav: "Answer Lab",
    title: "VedaPath Answer Preview Workbench",
    pageLabel: "Answer preview workbench",
    eyebrow: "Answer behavior",
    h1: "Preview the answer before the user trusts it.",
    lead: "A release room for direct answer, source card, plain meaning, deeper layer, boundary, and reviewer escalation in one repeatable answer format.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Answer-format prototype, not verified answer generation.",
    progress: 92,
    next: "Consent Memory Vault",
    primaryAsk: "Lock the first public answer format around source, confidence, and boundary.",
    summary: "Answer Preview Workbench turns VedaPath's source-first doctrine into a simple answer card users can scan without losing depth.",
    items: [
      ["Direct answer", "One clear response before layered detail.", "Respects the user's time."],
      ["Source card", "Citation, family, confidence, review state, and rights note.", "Keeps trust inspectable."],
      ["Deeper layer", "Sanskrit, commentary, debate, and context on demand.", "Prevents overwhelming beginners."],
      ["Boundary", "What not to overclaim and when to ask a human.", "Keeps humility visible."]
    ],
    modes: {
      brief: [
        ["Answer promise", "A calm answer is clear first, then deep by invitation."],
        ["Product move", "Make the source card impossible to miss."],
        ["Quality move", "Every answer needs a boundary line, not only a citation."]
      ],
      checklist: [
        ["Scannable", "Can a beginner understand the answer in ten seconds?"],
        ["Grounded", "Is the source family and confidence visible?"],
        ["Humble", "Does the answer say what it cannot prove?"]
      ],
      boundary: [
        ["No guru voice", "Do not speak as a spiritual authority."],
        ["No broad proof", "Do not turn one passage into universal proof."],
        ["No therapy voice", "Do not provide medical or crisis guidance."]
      ]
    }
  },
  {
    version: "v1.1.7",
    badge: "v1.1.7 memory vault",
    slug: "memoryvault",
    nav: "Memory",
    title: "VedaPath Consent Memory Vault",
    pageLabel: "Consent memory vault",
    eyebrow: "User-owned continuity",
    h1: "Let memory begin with permission.",
    lead: "A memory-vault preview for saved paths, source preferences, local reflections, synced grants, export, delete, and pause controls.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Consent model, not production storage.",
    progress: 93,
    next: "Reviewer Operations Desk",
    primaryAsk: "Decide which memories are useful enough to sync and which must stay local.",
    summary: "Consent Memory Vault makes future personalization explicit: remembered only with purpose, permission, export, delete, and pause.",
    items: [
      ["Remember", "Saved source paths, reading preferences, and consented learning goals.", "Supports continuity."],
      ["Stay local", "Private reflections, sensitive moments, and raw calm notes.", "Protects intimacy."],
      ["Control", "Export, delete, pause sync, clear device, and revoke grant.", "Gives memory an exit."],
      ["Blocked", "No distress, identity, family conflict, or health inference.", "Prevents hidden profiling."]
    ],
    modes: {
      brief: [
        ["Memory promise", "VedaPath should remember less, but remember honestly."],
        ["UX move", "Show every memory grant in plain language."],
        ["Data move", "Every stored field needs purpose, consent, export, and delete."]
      ],
      checklist: [
        ["Useful", "Does this memory improve the next visit?"],
        ["Consented", "Did the user explicitly allow it?"],
        ["Reversible", "Can it be exported, paused, and deleted?"]
      ],
      boundary: [
        ["No silent sync", "Do not upload local reflections automatically."],
        ["No sensitive inference", "Do not infer mental state or private identity."],
        ["No account pressure", "Do not make calm depend on sign-in."]
      ]
    }
  },
  {
    version: "v1.1.8",
    badge: "v1.1.8 review desk",
    slug: "reviewdesk",
    nav: "Review Desk",
    title: "VedaPath Reviewer Operations Desk",
    pageLabel: "Reviewer operations desk",
    eyebrow: "Human review operations",
    h1: "Turn review into a daily operating desk.",
    lead: "A reviewer operations surface for source checks, language notes, boundary decisions, rights holds, escalation, and release readiness.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Operations prototype, not reviewer endorsement.",
    progress: 94,
    next: "Public Trust Center",
    primaryAsk: "Define the reviewer desk that keeps public answers release-ready.",
    summary: "Reviewer Operations Desk turns expert help into scoped tasks, visible decision states, and calm release lanes.",
    items: [
      ["Task lanes", "Source, Sanskrit, translation, boundary, rights, and product review.", "Separates responsibility."],
      ["Decision states", "Approve, hold, request evidence, block, retire, or escalate.", "Keeps review precise."],
      ["Daily rhythm", "Triage new gaps, close safe records, and pause risky ones.", "Makes review sustainable."],
      ["Audit note", "Record what changed and why without public identity leakage.", "Keeps trust traceable."]
    ],
    modes: {
      brief: [
        ["Review promise", "Review should be work the team can operate, not a vague badge."],
        ["Ops move", "Give each reviewer one lane and one decision shape."],
        ["Trust move", "Publish review state, not private reviewer details."]
      ],
      checklist: [
        ["Scoped", "Is the review lane narrow?"],
        ["Audited", "Can the decision be traced later?"],
        ["Respectful", "Is reviewer identity protected unless consented?"]
      ],
      boundary: [
        ["No blanket endorsement", "Do not make one review imply all-tradition approval."],
        ["No public pressure", "Do not expose reviewers as marketing proof."],
        ["No ignored holds", "Do not ship records with unresolved hold states."]
      ]
    }
  },
  {
    version: "v1.1.9",
    badge: "v1.1.9 trust center",
    slug: "trustcenter",
    nav: "Trust Center",
    title: "VedaPath Public Trust Center",
    pageLabel: "Public trust center",
    eyebrow: "Public trust surface",
    h1: "Show the promise, the limits, and the proof.",
    lead: "A public trust center for source policy, privacy boundary, review process, evaluation checks, correction route, and launch status.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Trust-center prototype, not legal compliance certification.",
    progress: 95,
    next: "First Answer Flow",
    primaryAsk: "Create the public page that tells users exactly how VedaPath earns trust.",
    summary: "Public Trust Center gives users one plain place to inspect VedaPath's boundaries, source method, privacy posture, and correction path.",
    items: [
      ["Source method", "What counts as source-backed, commentary, analogy, or uncertain.", "Clarifies authority."],
      ["Privacy posture", "Local memory, synced grants, export, delete, and blocked inference.", "Protects agency."],
      ["Review process", "What human review means and what it does not mean.", "Avoids endorsement blur."],
      ["Correction route", "How users report source, category, translation, or boundary issues.", "Keeps learning accountable."]
    ],
    modes: {
      brief: [
        ["Trust promise", "Trust grows when limits are visible."],
        ["Launch move", "Put the trust center beside the product, not below it."],
        ["Support move", "Make corrections easy without asking users to argue."]
      ],
      checklist: [
        ["Plain", "Can a first-time user understand the limits?"],
        ["Actionable", "Can a user report a source issue?"],
        ["Current", "Does launch status match the actual product?"]
      ],
      boundary: [
        ["No legal overclaim", "Do not call this compliance certification."],
        ["No authority mask", "Do not imply tradition-wide endorsement."],
        ["No dark pattern", "Do not hide correction or delete paths."]
      ]
    }
  },
  {
    version: "v1.2.0",
    badge: "v1.2.0 first answer",
    slug: "firstanswer",
    nav: "First Answer",
    title: "VedaPath First Answer Flow",
    pageLabel: "First answer flow",
    eyebrow: "Public first use",
    h1: "Make the first answer feel calm and earned.",
    lead: "A first-use flow that moves from question to source card, plain answer, boundary, and one next learning path without crowding the screen.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "First-use prototype, not live AI answering.",
    progress: 96,
    next: "Return Rhythm Engine",
    primaryAsk: "Design the first public answer so trust is visible in the first minute.",
    summary: "First Answer Flow makes VedaPath's public entry tangible: ask, see source, read clearly, notice boundary, and continue gently.",
    items: [
      ["Ask", "One question box with sample prompts and no crowded onboarding.", "Keeps the entry simple."],
      ["Source", "Citation and source family before deeper interpretation.", "Builds trust early."],
      ["Answer", "Direct answer, plain meaning, and optional deeper layer.", "Balances clarity and depth."],
      ["Continue", "One next question, one saved path, or one calm reflection.", "Avoids product overload."]
    ],
    modes: {
      brief: [
        ["First-use promise", "The user should feel oriented before they feel impressed."],
        ["UX move", "One primary action, one source card, one next step."],
        ["Growth move", "Retention begins with clarity, not features."]
      ],
      checklist: [
        ["Fast", "Can a user get oriented in under one minute?"],
        ["Cited", "Is the source visible before confidence?"],
        ["Gentle", "Is there only one next step?"]
      ],
      boundary: [
        ["No crowded tour", "Do not show every feature at first visit."],
        ["No instant authority", "Do not overstate a first answer."],
        ["No forced account", "Do not require sign-in to understand the product."]
      ]
    }
  },
  {
    version: "v1.2.1",
    badge: "v1.2.1 return",
    slug: "returnengine",
    nav: "Return",
    title: "VedaPath Return Rhythm Engine",
    pageLabel: "Return rhythm engine",
    eyebrow: "Healthy retention",
    h1: "Invite return without creating pressure.",
    lead: "A retention prototype for daily source prompts, unfinished paths, calm practice reminders, and user-owned frequency controls.",
    source: "Bhagavad Gita 6.26",
    family: "Bhagavad Gita | Smriti",
    stance: "Retention design, not behavioral profiling.",
    progress: 97,
    next: "Scholar Invitation Room",
    primaryAsk: "Define a return loop that helps users continue without guilt or dependency.",
    summary: "Return Rhythm Engine turns retention into a respectful rhythm: source curiosity, small practice, and user-controlled reminders.",
    items: [
      ["Open path", "Resume a saved source, question, or reflection.", "Creates continuity."],
      ["Daily source", "One source-backed prompt with explicit category.", "Keeps learning grounded."],
      ["Frequency", "User chooses daily, weekly, paused, or none.", "Protects autonomy."],
      ["No pressure", "No guilt streaks, distress inference, or urgency copy.", "Keeps calm sincere."]
    ],
    modes: {
      brief: [
        ["Return promise", "VedaPath should invite, not hook."],
        ["Product move", "Make pause and frequency controls as visible as reminders."],
        ["Ethics move", "Avoid streak pressure for personal calm."]
      ],
      checklist: [
        ["Voluntary", "Can the user pause the rhythm easily?"],
        ["Grounded", "Does each return prompt cite a source candidate?"],
        ["Kind", "Does the copy avoid guilt or urgency?"]
      ],
      boundary: [
        ["No addiction loop", "Do not use pressure mechanics for calm."],
        ["No distress profiling", "Do not infer emotional state from return behavior."],
        ["No hidden notifications", "Do not message users without explicit preference."]
      ]
    }
  },
  {
    version: "v1.2.2",
    badge: "v1.2.2 scholar invite",
    slug: "scholarinvite",
    nav: "Invite",
    title: "VedaPath Scholar Invitation Room",
    pageLabel: "Scholar invitation room",
    eyebrow: "Respectful collaboration",
    h1: "Invite scholars without asking them to rubber-stamp.",
    lead: "A collaboration room for review scope, time boundary, citation package, compensation note, public-credit consent, and no-endorsement language.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Invitation prototype, not a reviewer agreement.",
    progress: 98,
    next: "Founder Launch Pipeline",
    primaryAsk: "Prepare a respectful scholar invitation that protects scope and avoids endorsement pressure.",
    summary: "Scholar Invitation Room helps VedaPath ask for help with humility: clear scope, cited evidence, time respect, and consented public credit.",
    items: [
      ["Scope", "Which records, fields, and decisions need review.", "Prevents vague asks."],
      ["Evidence pack", "Citation, translation note, current answer, boundary, and open question.", "Respects reviewer time."],
      ["Credit consent", "Private review, named credit, or anonymous contribution.", "Protects identity."],
      ["No endorsement", "Review is scoped feedback, not tradition-wide approval.", "Avoids authority misuse."]
    ],
    modes: {
      brief: [
        ["Invitation promise", "Ask for expertise with respect, precision, and no pressure."],
        ["Ops move", "Send review packets, not vague product pitches."],
        ["Trust move", "Separate reviewer feedback from public endorsement."]
      ],
      checklist: [
        ["Scoped", "Is the ask narrow enough to answer?"],
        ["Prepared", "Is the evidence package complete?"],
        ["Consentful", "Is public credit optional?"]
      ],
      boundary: [
        ["No rubber stamp", "Do not ask scholars to endorse the whole product."],
        ["No unpaid assumption", "Do not assume labor without respect for time and terms."],
        ["No public naming", "Do not name reviewers without explicit consent."]
      ]
    }
  },
  {
    version: "v1.2.3",
    badge: "v1.2.3 pipeline",
    slug: "launchpipeline",
    nav: "Pipeline",
    title: "VedaPath Founder Launch Pipeline",
    pageLabel: "Founder launch pipeline",
    eyebrow: "Founder operating lane",
    h1: "Turn launch into one visible pipeline.",
    lead: "A founder pipeline for source pack, answer quality, reviewer readiness, privacy controls, beta invites, support route, and hold decisions.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Launch pipeline, not launch approval.",
    progress: 99,
    next: "World Launch Beacon",
    primaryAsk: "Use one pipeline to decide what is ready, what is held, and what needs review.",
    summary: "Founder Launch Pipeline gathers the practical public-launch lanes into one calm decision board for the founder.",
    items: [
      ["Source pack", "Which questions and passages are ready for public beta.", "Sets scope."],
      ["Quality gate", "Eval pass, reviewer state, boundary checks, and no-go cases.", "Protects trust."],
      ["User controls", "Consent, export, delete, pause, and feedback routes.", "Protects users."],
      ["Launch hold", "What blocks release and who can pause it.", "Keeps speed responsible."]
    ],
    modes: {
      brief: [
        ["Pipeline promise", "The founder should see launch truth at a glance."],
        ["Ops move", "Sort every release item into ready, review, hold, or later."],
        ["Decision move", "Make the hold condition as visible as the launch button."]
      ],
      checklist: [
        ["Scoped", "Is the public beta small enough?"],
        ["Protected", "Are privacy and correction controls visible?"],
        ["Pausable", "Can the founder stop a risky release?"]
      ],
      boundary: [
        ["No forced optimism", "Do not hide hold states to keep momentum."],
        ["No public expansion", "Do not expand scope before source pack quality is stable."],
        ["No vague support", "Do not launch without a correction and support route."]
      ]
    }
  },
  {
    version: "v1.2.4",
    badge: "v1.2.4 beacon",
    slug: "launchbeacon",
    nav: "Beacon",
    title: "VedaPath World Launch Beacon",
    pageLabel: "World launch beacon",
    eyebrow: "Public launch signal",
    h1: "Signal calm without overpromising authority.",
    lead: "A launch beacon that brings the source service, answer format, consent memory, reviewer desk, trust center, first answer, return rhythm, scholar invite, and founder pipeline into one public-ready story.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Launch story prototype, not public production approval.",
    progress: 100,
    next: "Founder instruction",
    primaryAsk: "Choose whether the next sprint implements real backend source retrieval, account consent, or public beta copy.",
    summary: "World Launch Beacon completes the productization sprint and frames VedaPath as calm, source-first, public-facing, and still honest about its limits.",
    items: [
      ["Public story", "Ancient texts, clear paths, source-first calm, and visible boundaries.", "Explains why VedaPath matters."],
      ["Product proof", "First answer flow, trust center, return rhythm, and reviewer pathway.", "Shows how it works."],
      ["Launch safety", "Consent, delete, correction, hold state, and no-authority posture.", "Keeps promise honest."],
      ["Next build", "Pick backend retrieval, account consent, or public beta copy as the real lane.", "Turns vision into action."]
    ],
    modes: {
      brief: [
        ["Beacon promise", "The launch signal should feel alive, calm, and honest."],
        ["Product move", "Lead with the first answer and trust center, not a feature dump."],
        ["Founder move", "Choose one implementation lane before the next ten-build sprint."]
      ],
      checklist: [
        ["Clear", "Can the public understand the promise in one minute?"],
        ["Honest", "Are prototype and production boundaries visible?"],
        ["Next", "Is the next implementation decision obvious?"]
      ],
      boundary: [
        ["No authority claim", "Do not present VedaPath as guru, priest, scholar, or tradition."],
        ["No production claim", "Do not imply live backend retrieval or accounts exist until implemented."],
        ["No healing claim", "Do not market calm as therapy, medical support, or crisis care."]
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
  const start = "          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH PRODUCTION SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH PRODUCTION SPRINT NAV END -->", `          <!-- VEDAPATH PRODUCTION SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH READINESS SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH READINESS SPRINT NAV END -->", `          <!-- VEDAPATH READINESS SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="prodcontrol.html">Prod Control</a>
          <a class="link" href="calm.html">Calm</a>
          <a class="link" href="practice.html">Practice</a>
          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Public productization sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms move VedaPath from production readiness toward a public, calm, source-first product shell.</p>
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
          <span class="badge green">Public productization</span>
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
              <div><strong>Focus</strong><p>Name the public use case.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Ground</strong><p>Attach source and boundary.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Control</strong><p>Show consent, review, or hold state.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Ship</strong><p>Choose one honest next lane.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a public-productization prototype. It does not create production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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
    "<!-- VEDAPATH PRODUCTIZATION SPRINT LINKS START -->",
    "<!-- VEDAPATH PRODUCTIZATION SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH PRODUCTION SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES START -->",
    "<!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH PRODUCTION SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH PRODUCTIZATION SPRINT NOTES START -->",
    "<!-- VEDAPATH PRODUCTIZATION SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH PRODUCTION SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT SUMMARY START -->",
    "<!-- VEDAPATH PRODUCTIZATION SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH PRODUCTION SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${98 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable public-productization handoff

${shortTitle(item)} should never claim production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH PRODUCTIZATION SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH PRODUCTION SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="launchbeacon.html">Launch Beacon</a>')) {
    content = content.replace('<a href="prodcontrol.html">Production Control</a>', '<a href="prodcontrol.html">Production Control</a> | <a href="launchbeacon.html">Launch Beacon</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Public productization sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Public productization sprint progress: ${visible.length}/10 rooms complete. Real backend retrieval, accounts, reviewer operations, and licensed audio still require implementation.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Public productization sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${79 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH PRODUCTIZATION SPRINT PHASES START -->",
    "            <!-- VEDAPATH PRODUCTIZATION SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH PRODUCTION SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${79 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.1.4 Production Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Public productization sprint complete" : `${visible.length}/10 productization rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the public promise simple: source, answer, consent, review, trust, return.</span></li>
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
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT HOME START -->",
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH PRODUCTION SPRINT HOME END -->"
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
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES START -->",
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH PRODUCTION SPRINT FEATURES END -->"
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

console.log(`Generated public productization sprint through ${active.version} (${visible.length}/10).`);
