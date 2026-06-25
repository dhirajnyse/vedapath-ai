import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v0.8.5",
    badge: "v0.8.5 beta",
    slug: "beta",
    nav: "Beta",
    title: "VedaPath Beta Welcome Room",
    pageLabel: "Beta welcome",
    eyebrow: "Public beta doorway",
    h1: "Let the first minute feel clear.",
    lead: "A launch-facing welcome room that gives visitors one honest choice: ask, calm, learn, practice, review, or follow the beta journey.",
    source: "Katha Upanishad 1.3.14",
    family: "Upanishad | Shruti",
    stance: "Beta invitation, not spiritual authority.",
    progress: 91,
    next: "First Session Flow",
    primaryAsk: "Choose the one beta doorway that should greet first-time visitors.",
    summary: "Beta Welcome Room turns the public entry into a simple, source-first doorway instead of a crowded product map.",
    items: [
      ["One choice", "A new visitor should not see the whole universe first.", "Show one calm doorway with optional depth."],
      ["Trust upfront", "The source-first posture must be visible before any promise.", "Place citation, boundary, and prototype status near the action."],
      ["Human tone", "The beta should feel warm without sounding like a guru.", "Use plain words, no pressure, and no transformation claims."],
      ["Return path", "A visitor who leaves should know the next room.", "Route to First Session Flow or Build Status."]
    ],
    modes: {
      brief: [
        ["Beta promise", "The first minute should make VedaPath feel calm, careful, and usable."],
        ["UX move", "Reduce the opening to one primary action and a visible boundary."],
        ["Launch move", "Invite curiosity without asking for private data before trust exists."]
      ],
      checklist: [
        ["First action", "Can a visitor pick a path in under one minute?"],
        ["Prototype truth", "Is beta status visible near the invitation?"],
        ["No pressure", "Does the copy avoid urgency, fear, or spiritual authority?"]
      ],
      boundary: [
        ["No conversion funnel", "Do not make the welcome page manipulate urgency."],
        ["No hidden profiling", "Do not infer faith, distress, or identity from the first doorway."],
        ["No authority claim", "Do not present beta access as spiritual guidance."]
      ]
    }
  },
  {
    version: "v0.8.6",
    badge: "v0.8.6 flow",
    slug: "flow",
    nav: "Flow",
    title: "VedaPath First Session Flow",
    pageLabel: "First session",
    eyebrow: "One calm session",
    h1: "Guide one complete session, then stop.",
    lead: "A first-session product flow that moves from question to source, boundary, reflection, carry action, and return invitation.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Guided session, not therapy or instruction.",
    progress: 92,
    next: "Source Dataset Studio",
    primaryAsk: "Define the smallest complete VedaPath session a beta user can finish.",
    summary: "First Session Flow makes VedaPath testable as a beginning-to-end experience: arrive, ask, source, reflect, carry, and return.",
    items: [
      ["Arrive", "Name why the user is here.", "Offer ask, calm, learn, or practice without judgment."],
      ["Source", "Show one source candidate before expanding.", "Keep citation, family, and confidence visible."],
      ["Boundary", "Say what the answer does not claim.", "Protects users from overreach and product hype."],
      ["Return", "End with one next room and one saved local signal.", "Makes repeat use gentle and clear."]
    ],
    modes: {
      brief: [
        ["Session promise", "A complete VedaPath moment should be small enough to finish and meaningful enough to repeat."],
        ["Design move", "Use one source card, one reflection, one carry action, and one return invitation."],
        ["Beta move", "Measure completion before adding accounts or complex personalization."]
      ],
      checklist: [
        ["Complete", "Does the flow have a beginning, middle, and close?"],
        ["Light", "Can it finish in three to five minutes?"],
        ["Grounded", "Does source and boundary appear before reflection?"]
      ],
      boundary: [
        ["No endless scroll", "Do not turn first use into a feature tour."],
        ["No therapy loop", "Do not ask users to disclose deeply."],
        ["No forced memory", "Do not require account or sync to finish a session."]
      ]
    }
  },
  {
    version: "v0.8.7",
    badge: "v0.8.7 dataset",
    slug: "dataset",
    nav: "Dataset",
    title: "VedaPath Source Dataset Studio",
    pageLabel: "Dataset studio",
    eyebrow: "First source set",
    h1: "Make the first dataset small and trusted.",
    lead: "A production-minded studio for selecting the first 25 source-backed question records with citation, family, boundary, and review state.",
    source: "Mundaka Upanishad 1.1.3",
    family: "Upanishad | Shruti",
    stance: "Dataset planning, not verified authority.",
    progress: 93,
    next: "Answer Contract",
    primaryAsk: "Pick the first 25 beta questions that deserve reviewed source records.",
    summary: "Source Dataset Studio narrows the product from many prototype ideas to a first reviewable beta dataset.",
    items: [
      ["Question source", "Every record should start from a real user question.", "Prevents content built only from founder imagination."],
      ["Citation fields", "Text family, passage id, translation note, and source URL are required.", "Avoids source-family confusion."],
      ["Review lane", "Each record needs source, language, boundary, and rights status.", "Makes trust operational."],
      ["Beta eligibility", "Only complete-enough records should power public answers.", "Keeps prototype honesty intact."]
    ],
    modes: {
      brief: [
        ["Dataset promise", "The first source set should be small, visible, and reviewable."],
        ["Product move", "Use high-frequency confusion first: Gita vs Veda, Oppenheimer, Gayatri, Atman, karma, dharma."],
        ["Trust move", "A missing field should block confidence, not hide behind polished UI."]
      ],
      checklist: [
        ["Real question", "Did a real learner ask this?"],
        ["Specific source", "Can a citation and family be named?"],
        ["Review state", "Is the record public-ready, hold, or blocked?"]
      ],
      boundary: [
        ["No scraped authority", "Do not build the first dataset by scraping and trusting it blindly."],
        ["No vague citation", "Do not accept broad claims like from the Vedas without passage detail."],
        ["No hidden missing fields", "Do not let incomplete records look complete."]
      ]
    }
  },
  {
    version: "v0.8.8",
    badge: "v0.8.8 contract",
    slug: "answer",
    nav: "Answer",
    title: "VedaPath Answer Contract",
    pageLabel: "Answer contract",
    eyebrow: "Answer anatomy",
    h1: "Every answer should show how it knows.",
    lead: "A beta answer contract that defines direct answer, source card, plain meaning, optional depth, boundary, and correction route.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Answer format, not final interpretation.",
    progress: 94,
    next: "Reviewer Ops Board",
    primaryAsk: "Lock the answer shape that every beta response must follow.",
    summary: "Answer Contract turns VedaPath's trust philosophy into a repeatable response format for beta answers.",
    items: [
      ["Direct answer", "Start with the clearest useful response.", "Respects the user's question."],
      ["Source card", "Show citation, family, confidence, and review state.", "Makes trust inspectable."],
      ["Depth layers", "Offer Sanskrit, commentary, or debate only on demand.", "Keeps beginners safe from overload."],
      ["Correction route", "Let source issues become reviewed tickets.", "Prevents silent knowledge rewrites."]
    ],
    modes: {
      brief: [
        ["Answer promise", "A good answer is not only correct-looking. It is inspectable."],
        ["UX move", "Keep the top answer short, then unfold source and depth."],
        ["Beta move", "Use this contract as the evaluation target for every generated answer."]
      ],
      checklist: [
        ["Useful", "Does the first sentence answer the user?"],
        ["Cited", "Can the source family and citation be checked?"],
        ["Bounded", "Is overclaiming explicitly blocked?"]
      ],
      boundary: [
        ["No guru answer", "Do not let the AI speak as a spiritual authority."],
        ["No unsupported certainty", "Do not show high confidence without source evidence."],
        ["No hidden correction", "Do not silently change knowledge without review history."]
      ]
    }
  },
  {
    version: "v0.8.9",
    badge: "v0.8.9 ops",
    slug: "reviewops",
    nav: "Ops",
    title: "VedaPath Reviewer Ops Board",
    pageLabel: "Reviewer ops",
    eyebrow: "Human review operations",
    h1: "Make review practical before making it prestigious.",
    lead: "A small operations board for assigning source, translation, boundary, and product review tasks without claiming endorsement.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Review operations, not endorsement.",
    progress: 95,
    next: "Consent and Privacy Room",
    primaryAsk: "Define the first reviewer workflow that can run with a small trusted group.",
    summary: "Reviewer Ops Board turns scholar and careful-reader help into scoped tasks, decisions, and release gates.",
    items: [
      ["Task scope", "One reviewer should know exactly what they are deciding.", "Avoids vague endorsement pressure."],
      ["Evidence packet", "Attach passage, answer, source fields, and blocked claims.", "Makes review fast and respectful."],
      ["Decision state", "Approve, hold, block, or request evidence.", "Keeps review auditable."],
      ["Private identity", "Reviewer names stay private unless consented.", "Protects trust and dignity."]
    ],
    modes: {
      brief: [
        ["Ops promise", "Review should feel like careful product work, not ceremony."],
        ["Founder move", "Start with five reviewers and one narrow source lane."],
        ["Trust move", "Never imply outreach equals approval."]
      ],
      checklist: [
        ["Scoped", "Can the reviewer say yes or no to one field?"],
        ["Evidence", "Is the source packet complete enough?"],
        ["Consent", "Is reviewer display permission separate from review work?"]
      ],
      boundary: [
        ["No endorsement blur", "Do not imply a reviewer endorses the whole product."],
        ["No unpaid burden", "Do not ask for broad review without narrow scope."],
        ["No spiritual certification", "Review improves product quality, not authority."]
      ]
    }
  },
  {
    version: "v0.9.0",
    badge: "v0.9.0 privacy",
    slug: "privacy",
    nav: "Privacy",
    title: "VedaPath Consent and Privacy Room",
    pageLabel: "Consent and privacy",
    eyebrow: "Trust before memory",
    h1: "Ask consent before remembering.",
    lead: "A beta privacy room that names what may be stored, what must stay local, what can be exported, and what can be deleted.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Consent design, not legal advice.",
    progress: 96,
    next: "Teacher Companion Mode",
    primaryAsk: "Write the beta consent contract before adding production accounts.",
    summary: "Consent and Privacy Room makes user trust visible before VedaPath moves from local prototype memory to real storage.",
    items: [
      ["May remember", "User-chosen preferences, saved sources, and explicit practice completions.", "Only after clear consent."],
      ["Must not infer", "Faith, distress, mental health, family conflict, or private identity.", "Never from behavior alone."],
      ["Controls", "Export, delete, pause memory, and local-only mode.", "User control remains visible."],
      ["Data route", "Local draft, account memory, review ticket, or blocked.", "Every route needs a purpose."]
    ],
    modes: {
      brief: [
        ["Privacy promise", "A calm product should not create hidden worry."],
        ["Product move", "Make memory understandable before making it powerful."],
        ["Beta move", "Keep sensitive reflection local until real consent, deletion, and export exist."]
      ],
      checklist: [
        ["Visible", "Can users see what is remembered?"],
        ["Controllable", "Can users clear, export, or pause memory?"],
        ["Bounded", "Are forbidden inferences named clearly?"]
      ],
      boundary: [
        ["No hidden profile", "Do not infer private identity or distress from usage."],
        ["No silent sync", "Do not sync personal content before consent."],
        ["No legal theater", "Do not hide product behavior behind vague policy copy."]
      ]
    }
  },
  {
    version: "v0.9.1",
    badge: "v0.9.1 teacher",
    slug: "teacher",
    nav: "Teacher",
    title: "VedaPath Teacher Companion Mode",
    pageLabel: "Teacher companion",
    eyebrow: "Teaching support",
    h1: "Support teachers without replacing them.",
    lead: "A teacher-facing mode for preparing source cards, discussion prompts, boundaries, and homework paths without claiming classroom authority.",
    source: "Katha Upanishad 1.2.23",
    family: "Upanishad | Shruti",
    stance: "Teaching support, not teacher replacement.",
    progress: 97,
    next: "Student Study Mode",
    primaryAsk: "Design one classroom-safe handoff a teacher would actually use.",
    summary: "Teacher Companion Mode gives educators source-first materials while keeping human teaching, tradition, and context central.",
    items: [
      ["Lesson card", "One source, plain meaning, and optional depth.", "Useful without overwhelming students."],
      ["Discussion question", "One respectful question with multiple possible views.", "Supports conversation, not dogma."],
      ["Boundary note", "What not to overclaim in class.", "Keeps category and tradition care visible."],
      ["Homework path", "One reading, one reflection, one source check.", "Makes learning actionable."]
    ],
    modes: {
      brief: [
        ["Teacher promise", "VedaPath can prepare materials, but the teacher remains the teacher."],
        ["UX move", "Make source cards printable, copyable, and bounded."],
        ["Beta move", "Test with teachers who need citations, not spectacle."]
      ],
      checklist: [
        ["Useful", "Would a teacher use this without editing everything?"],
        ["Plural", "Does it respect multiple interpretations?"],
        ["Bounded", "Does it avoid replacing teacher judgment?"]
      ],
      boundary: [
        ["No replacement", "Do not position VedaPath as the teacher."],
        ["No single doctrine", "Do not flatten traditions into one view."],
        ["No classroom surveillance", "Do not collect student data in prototype mode."]
      ]
    }
  },
  {
    version: "v0.9.2",
    badge: "v0.9.2 student",
    slug: "student",
    nav: "Student",
    title: "VedaPath Student Study Mode",
    pageLabel: "Student study",
    eyebrow: "Learning support",
    h1: "Study with structure, not pressure.",
    lead: "A student-facing study room for source cards, flash prompts, comparison notes, and careful claim checks.",
    source: "Chandogya Upanishad 6.1.3",
    family: "Upanishad | Shruti",
    stance: "Study aid, not exam authority.",
    progress: 98,
    next: "Beta Signal Ledger",
    primaryAsk: "Create the smallest study loop that helps a learner return tomorrow.",
    summary: "Student Study Mode turns VedaPath into a gentle study companion with source recall, comparison, and claim-checking habits.",
    items: [
      ["Recall", "Remember the source family and citation.", "Builds accuracy before interpretation."],
      ["Plain meaning", "Explain the idea without jargon.", "Keeps beginners included."],
      ["Compare", "Separate text, tradition, and modern analogy.", "Prevents category confusion."],
      ["Return", "Save one local study card and next source.", "Encourages rhythm without pressure."]
    ],
    modes: {
      brief: [
        ["Study promise", "A learner should feel more capable, not judged."],
        ["Product move", "Use short study loops: recall, explain, compare, check."],
        ["Beta move", "Make study progress local and exportable before accounts."]
      ],
      checklist: [
        ["Clear", "Can a beginner understand the task?"],
        ["Cited", "Does every study card keep source family visible?"],
        ["Repeatable", "Can the learner return tomorrow with one next source?"]
      ],
      boundary: [
        ["No exam guarantee", "Do not promise grades or mastery."],
        ["No rote-only learning", "Do not reduce sacred texts to quiz trivia."],
        ["No hidden tracking", "Do not store student progress without consent."]
      ]
    }
  },
  {
    version: "v0.9.3",
    badge: "v0.9.3 signals",
    slug: "signals",
    nav: "Signals",
    title: "VedaPath Beta Signal Ledger",
    pageLabel: "Beta signals",
    eyebrow: "Launch learning",
    h1: "Read signals without chasing noise.",
    lead: "A beta signal ledger for tracking useful product evidence: repeated questions, source issues, calm completions, reviewer offers, and return paths.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Product learning, not user surveillance.",
    progress: 99,
    next: "Public Beta Command Center",
    primaryAsk: "Choose which beta signals matter without building hidden tracking.",
    summary: "Beta Signal Ledger helps the founder learn from launch while keeping privacy, consent, and signal humility intact.",
    items: [
      ["Question pull", "Which questions repeat across visitors?", "Shows dataset priority."],
      ["Trust friction", "Where do users ask for source or correction?", "Shows review priority."],
      ["Calm return", "Which local flows users repeat willingly.", "Shows habit priority without private inference."],
      ["Reviewer signal", "Who offers correction or source help?", "Shows operations priority."]
    ],
    modes: {
      brief: [
        ["Signal promise", "Use signals to improve the product, not to define the user."],
        ["Founder move", "Track patterns that reduce risk: source gaps, category confusion, return paths."],
        ["Privacy move", "Prefer aggregate and explicit feedback over hidden behavioral identity."]
      ],
      checklist: [
        ["Useful", "Will this signal change a product decision?"],
        ["Respectful", "Can it be tracked without private inference?"],
        ["Actionable", "Does it route to dataset, review, UX, or launch copy?"]
      ],
      boundary: [
        ["No surveillance", "Do not turn calm practice into behavioral profiling."],
        ["No vanity metrics", "Do not confuse traffic with trust."],
        ["No private inference", "Do not infer faith, distress, or identity from clicks."]
      ]
    }
  },
  {
    version: "v0.9.4",
    badge: "v0.9.4 command",
    slug: "command",
    nav: "Command",
    title: "VedaPath Public Beta Command Center",
    pageLabel: "Beta command",
    eyebrow: "Beta control center",
    h1: "Launch the beta with calm control.",
    lead: "A founder command center that brings the beta sprint together: welcome, session, dataset, answer contract, review, privacy, teachers, students, and signals.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Founder decision center, not automatic launch approval.",
    progress: 100,
    next: "Founder launch decision",
    primaryAsk: "Decide what can be shown publicly, what needs review, and what must stay held.",
    summary: "Public Beta Command Center completes the beta sprint and gives the founder one calm launch decision surface.",
    items: [
      ["Public-ready", "Welcome, first session, answer contract, and launch copy.", "Can be shown as prototype."],
      ["Review-needed", "Dataset, source records, teacher materials, and answer confidence.", "Needs human review before authority claims."],
      ["Privacy-needed", "Accounts, memory, analytics, and student use.", "Needs explicit consent and controls."],
      ["Hold", "Licensed audio, verified answer claims, and ritual instruction.", "Do not ship without review and rights."]
    ],
    modes: {
      brief: [
        ["Command promise", "A beta launch should feel clear because the held claims are visible."],
        ["Founder move", "Choose one public path and one review path before sharing widely."],
        ["Product truth", "The beta is strong enough to show, but not to overclaim."]
      ],
      checklist: [
        ["Ready", "What can be public as prototype today?"],
        ["Review", "What needs source or human review before confidence?"],
        ["Hold", "What must not be promised yet?"]
      ],
      boundary: [
        ["No automatic launch", "This command center informs a decision; it does not approve launch by itself."],
        ["No authority leap", "Do not convert prototype quality into verified spiritual authority."],
        ["No hidden data", "Do not add accounts, analytics, or memory without consent and deletion paths."]
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
  const start = "          <!-- VEDAPATH BETA SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH BETA SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH PERSONAL SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH PERSONAL SPRINT NAV END -->", `          <!-- VEDAPATH PERSONAL SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else {
    const storyLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link" href="story.html">Story</a>`;
    const activeStoryLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link active" href="story.html">Story</a>`;
    const marker = content.includes(activeStoryLink) ? activeStoryLink : storyLink;
    if (content.includes(marker)) {
      content = content.replace(marker, `${marker}\n${start}\n${nav}\n${end}`);
    }
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
          <a class="link" href="calm.html">Calm</a>
          <a class="link" href="daily.html">Daily</a>
          <a class="link" href="practice.html">Practice</a>
          <a class="link" href="story.html">Story</a>
          <!-- VEDAPATH BETA SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH BETA SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Public beta sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn launch energy into beta-ready product decisions.</p>
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
          <span class="badge green">Beta progress</span>
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
              <div><strong>Show</strong><p>Make the beta decision visible.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Source</strong><p>Anchor it to a careful source candidate.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Bound</strong><p>Name what this feature must not claim.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Ship</strong><p>Leave with one next beta action.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a beta planning surface. It does not create production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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

This release should not imply production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const linkBody = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA SPRINT LINKS START -->",
    "<!-- VEDAPATH BETA SPRINT LINKS END -->",
    linkBody,
    "<!-- VEDAPATH PERSONAL SPRINT LINKS END -->"
  );
  const featureBody = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA SPRINT FEATURES START -->",
    "<!-- VEDAPATH BETA SPRINT FEATURES END -->",
    featureBody,
    "<!-- VEDAPATH PERSONAL SPRINT FEATURES END -->"
  );
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}

function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const body = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA SPRINT NOTES START -->",
    "<!-- VEDAPATH BETA SPRINT NOTES END -->",
    body,
    "<!-- VEDAPATH PERSONAL SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA SPRINT SUMMARY START -->",
    "<!-- VEDAPATH BETA SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH PERSONAL SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${68 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable beta handoff

${shortTitle(item)} should never claim production storage, verified answers, reviewer approval, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH BETA SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH BETA SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH PERSONAL SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="command.html">Beta Command</a>')) {
    content = content.replace('<a href="tower.html">Control Tower</a>', '<a href="tower.html">Control Tower</a> | <a href="command.html">Beta Command</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 25, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Public beta sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Public beta sprint progress: ${visible.length}/10 rooms complete. Remaining product work still needs production backend, real reviewer operations, and licensed audio decisions.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder launch decision"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Beta sprint complete. Next release waits for founder launch direction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${49 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH BETA SPRINT PHASES START -->",
    "            <!-- VEDAPATH BETA SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH PERSONAL SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${49 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v0.8.4 Next Build Control Tower"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Public beta sprint complete" : `${visible.length}/10 beta sprint rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the beta interface simple: one doorway, one source, one boundary, one action.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, reviewer approval, therapy, ritual instruction, or licensed audio.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder launch direction before the next lane."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/100% trusted MVP prototype\. New: [\s\S]*?<\/p>/, `${active.progress}% public beta sprint. New: ${shortTitle(active)} gives the launch path a source-first decision surface.</p>`);
  content = content.replace(/\d+% personal calm sprint\. New: [\s\S]*?<\/p>/, `${active.progress}% public beta sprint. New: ${shortTitle(active)} gives the launch path a source-first decision surface.</p>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH BETA SPRINT HOME START -->",
    "          <!-- VEDAPATH BETA SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH PERSONAL SPRINT HOME END -->"
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
    "          <!-- VEDAPATH BETA SPRINT FEATURES START -->",
    "          <!-- VEDAPATH BETA SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH PERSONAL SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}

const rootHtml = readdirSync(root).filter((name) => name.endsWith(".html"));
for (const rel of rootHtml) {
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

console.log(`Generated public beta sprint through ${active.version} (${visible.length}/10).`);
