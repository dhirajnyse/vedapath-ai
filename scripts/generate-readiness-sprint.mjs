import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v0.9.5",
    badge: "v0.9.5 checklist",
    slug: "launchcheck",
    nav: "Checklist",
    title: "VedaPath Beta Launch Checklist",
    pageLabel: "Launch checklist",
    eyebrow: "Launch readiness",
    h1: "Launch only what is honest.",
    lead: "A public-beta checklist that separates ready prototype surfaces, review-needed trust claims, privacy holds, and blocked launch promises.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Readiness checklist, not launch permission.",
    progress: 91,
    next: "First 25 Source Pack",
    primaryAsk: "Decide what can be shown publicly today and what must remain held.",
    summary: "Beta Launch Checklist turns launch excitement into visible ready, review, privacy, and hold lanes.",
    items: [
      ["Ready lane", "Logo, source-first ask, calm path, beta command, and boundary copy.", "Can be shown as prototype."],
      ["Review lane", "Source records, answer confidence, teacher materials, and Sanskrit notes.", "Needs human review before authority claims."],
      ["Privacy lane", "Accounts, memory, analytics, and student use.", "Needs consent, export, and delete controls."],
      ["Hold lane", "Licensed audio, ritual instruction, verified-answer claims, and health claims.", "Do not launch until rights and review exist."]
    ],
    modes: {
      brief: [
        ["Launch promise", "The product can be inspiring and still be exact about what is ready."],
        ["Founder move", "Move only true surfaces into public copy."],
        ["Trust move", "Every held claim should be visible before the beta invitation."]
      ],
      checklist: [
        ["Ready", "Can this surface be shown without pretending it is production-backed?"],
        ["Review", "Does this claim need a source or human decision?"],
        ["Hold", "Would shipping this confuse authority, privacy, or safety boundaries?"]
      ],
      boundary: [
        ["No launch pressure", "Do not ship a claim because the page feels beautiful."],
        ["No hidden risk", "Do not hide review gaps behind polished wording."],
        ["No authority leap", "Do not treat beta readiness as spiritual authority."]
      ]
    }
  },
  {
    version: "v0.9.6",
    badge: "v0.9.6 source pack",
    slug: "sourcepack",
    nav: "Source Pack",
    title: "VedaPath First 25 Source Pack",
    pageLabel: "First source pack",
    eyebrow: "Dataset seed",
    h1: "Trust starts with twenty-five careful records.",
    lead: "A first-source-pack room for choosing beta questions, citations, source-family labels, review state, and blocked overclaims.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Source-pack planning, not verified dataset.",
    progress: 92,
    next: "Citation Inspector",
    primaryAsk: "Select the first 25 questions that deserve production source records.",
    summary: "First 25 Source Pack narrows the beta dataset to a small, reviewable, high-frequency group of source-backed questions.",
    items: [
      ["Famous confusion", "Oppenheimer, Gita vs Veda, Gayatri, karma, dharma.", "High public value because errors are common."],
      ["Source basics", "Veda, Upanishad, Gita, Itihasa, Purana, commentary.", "Builds category clarity."],
      ["Calm practice", "Steady action, self-lift, before reply, family conversation.", "Connects calm features to source candidates."],
      ["Modern claims", "Science, productivity, success, quantum, and wellness claims.", "Requires careful refusal and analogy labels."]
    ],
    modes: {
      brief: [
        ["Dataset promise", "A smaller reviewed set beats a large uncertain library."],
        ["Product move", "Start with questions users actually ask and errors that matter."],
        ["Trust move", "Every source record needs a missing-field state before it can power confident answers."]
      ],
      checklist: [
        ["Question", "Is this likely to be asked by a real beta user?"],
        ["Citation", "Can a source family and passage be named?"],
        ["Boundary", "What should the answer refuse or soften?"]
      ],
      boundary: [
        ["No scraped certainty", "Do not turn scraped text into trusted records."],
        ["No vague sources", "Do not accept broad labels without citation detail."],
        ["No hidden incompleteness", "Do not let missing fields look beta-ready."]
      ]
    }
  },
  {
    version: "v0.9.7",
    badge: "v0.9.7 citation",
    slug: "citation",
    nav: "Citation",
    title: "VedaPath Citation Inspector",
    pageLabel: "Citation inspector",
    eyebrow: "Citation quality",
    h1: "Make every citation inspectable.",
    lead: "A citation quality room that checks source family, passage id, translation layer, rights note, reviewer state, and answer eligibility.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Citation inspection, not final authority.",
    progress: 93,
    next: "Review Trail",
    primaryAsk: "Define the citation checks required before a source powers a beta answer.",
    summary: "Citation Inspector makes source quality visible before any answer receives high confidence.",
    items: [
      ["Identity", "Source family, text name, chapter or passage id, and edition note.", "Prevents broad source confusion."],
      ["Language", "Original text, transliteration, translation, and translation rights.", "Prevents unreviewed display."],
      ["Context", "Plain meaning, tradition note, and interpretation caveat.", "Prevents flattening depth."],
      ["Eligibility", "Ready, hold, blocked, or reviewer-needed.", "Prevents false confidence."]
    ],
    modes: {
      brief: [
        ["Inspector promise", "A citation should be something a careful reader can inspect, not a decoration under an answer."],
        ["UX move", "Show missing citation fields as visible holds."],
        ["Release move", "Only eligible citations can appear in beta answer cards."]
      ],
      checklist: [
        ["Specific", "Does the citation identify a passage, not only a tradition?"],
        ["Licensed", "Is display or translation use allowed?"],
        ["Reviewed", "Is the source state explicit?"]
      ],
      boundary: [
        ["No decorative citation", "Do not use citations as trust decoration without inspectable fields."],
        ["No rights blur", "Do not display translations or audio without rights review."],
        ["No confidence shortcut", "Do not use high confidence when citation state is incomplete."]
      ]
    }
  },
  {
    version: "v0.9.8",
    badge: "v0.9.8 trail",
    slug: "reviewtrail",
    nav: "Trail",
    title: "VedaPath Review Trail",
    pageLabel: "Review trail",
    eyebrow: "Decision history",
    h1: "Let trust leave a trail.",
    lead: "A review-history room that shows who reviewed what kind of field, what changed, what stayed blocked, and what must not be implied.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Review trail, not endorsement.",
    progress: 94,
    next: "Boundary Safety QA",
    primaryAsk: "Design the review trail that turns source changes into visible product history.",
    summary: "Review Trail makes source and boundary decisions auditable without turning reviewer participation into broad endorsement.",
    items: [
      ["Decision scope", "Source, translation, boundary, rights, or product wording.", "Shows exactly what was reviewed."],
      ["Decision state", "Approve, hold, block, or request evidence.", "Keeps status unambiguous."],
      ["Change note", "What changed and why.", "Avoids silent knowledge rewrites."],
      ["Display consent", "Whether reviewer identity may be shown.", "Separates review from publicity."]
    ],
    modes: {
      brief: [
        ["Trail promise", "Users should see that trust was earned through specific decisions."],
        ["Product move", "Every public confidence upgrade should have a traceable reason."],
        ["Boundary move", "Reviewer work should not be presented as blanket endorsement."]
      ],
      checklist: [
        ["Scoped", "Is the reviewed field named?"],
        ["Auditable", "Can the product explain why the state changed?"],
        ["Respectful", "Is reviewer display consent separate from review work?"]
      ],
      boundary: [
        ["No endorsement blur", "Do not imply one review approves the whole product."],
        ["No silent rewrite", "Do not change source meaning without visible review state."],
        ["No public identity leak", "Do not show reviewer identity without consent."]
      ]
    }
  },
  {
    version: "v0.9.9",
    badge: "v0.9.9 safety",
    slug: "safety",
    nav: "Safety",
    title: "VedaPath Boundary Safety QA",
    pageLabel: "Boundary QA",
    eyebrow: "No-go testing",
    h1: "Test what the product must refuse.",
    lead: "A no-go QA room for checking guru voice, therapy claims, ritual instruction, scientific overclaims, privacy leaks, and source-family confusion.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Safety QA, not legal or medical advice.",
    progress: 95,
    next: "Pilot Launch Room",
    primaryAsk: "Create the no-go checks that every beta release must pass.",
    summary: "Boundary Safety QA turns VedaPath's humility into testable refusal and caution checks.",
    items: [
      ["Authority", "Guru, oracle, priest, ritual authority, or final verdict.", "Must be refused or softened."],
      ["Health", "Therapy, diagnosis, emergency support, or medical claims.", "Must route to real-world support."],
      ["Science", "Proof of quantum physics, success, or modern claims.", "Must label analogy and uncertainty."],
      ["Privacy", "Hidden profiling, student tracking, family conflict storage.", "Must block or require explicit consent."]
    ],
    modes: {
      brief: [
        ["Safety promise", "A calm product becomes trustworthy partly by refusing the wrong work."],
        ["Release move", "Each beta release needs no-go checks before public copy."],
        ["UX move", "Refusals should be gentle, useful, and source-aware when possible."]
      ],
      checklist: [
        ["Identify", "Which boundary could this feature cross?"],
        ["Refuse", "Does the product decline the unsafe role clearly?"],
        ["Redirect", "Does it offer a safer next step?"]
      ],
      boundary: [
        ["No guru voice", "Do not speak as spiritual authority."],
        ["No therapy claim", "Do not diagnose, treat, or handle emergencies."],
        ["No private inference", "Do not infer personal identity or distress from use."]
      ]
    }
  },
  {
    version: "v1.0.0",
    badge: "v1.0.0 pilot",
    slug: "pilot",
    nav: "Pilot",
    title: "VedaPath Pilot Launch Room",
    pageLabel: "Pilot launch",
    eyebrow: "Small public pilot",
    h1: "Pilot small. Learn clearly.",
    lead: "A pilot launch room for choosing a narrow audience, one promise, one source pack, one feedback route, and one stop condition.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Pilot plan, not mass launch.",
    progress: 96,
    next: "Feedback Triage Lab",
    primaryAsk: "Choose the smallest public pilot that can teach the most without overclaiming.",
    summary: "Pilot Launch Room defines a small beta launch with audience, promise, source scope, feedback path, and stop conditions.",
    items: [
      ["Audience", "Learners curious about source clarity, not everyone at once.", "Keeps launch focused."],
      ["Promise", "Ask a question and see source, context, confidence, and boundary.", "Keeps claim honest."],
      ["Source scope", "First 25 reviewed or review-labeled questions.", "Avoids broad answer promises."],
      ["Stop condition", "Pause if source confusion, privacy risk, or overclaiming appears.", "Keeps learning safe."]
    ],
    modes: {
      brief: [
        ["Pilot promise", "The first public launch should be small enough to protect trust."],
        ["Founder move", "Pick one audience and one promise."],
        ["Product move", "Treat launch as learning, not proof."]
      ],
      checklist: [
        ["Narrow", "Is the pilot audience specific?"],
        ["Honest", "Can the promise be proven by current screens?"],
        ["Stoppable", "Is there a condition that pauses the pilot?"]
      ],
      boundary: [
        ["No mass launch fantasy", "Do not market beyond the source pack and review state."],
        ["No verified-answer claim", "Do not imply all answers are reviewed."],
        ["No uncontrolled data", "Do not collect personal data without controls."]
      ]
    }
  },
  {
    version: "v1.0.1",
    badge: "v1.0.1 triage",
    slug: "triage",
    nav: "Triage",
    title: "VedaPath Feedback Triage Lab",
    pageLabel: "Feedback triage",
    eyebrow: "Beta feedback",
    h1: "Turn feedback into decisions.",
    lead: "A triage lab for sorting beta feedback into source issue, UX friction, privacy concern, reviewer offer, launch copy, or blocked private disclosure.",
    source: "Mundaka Upanishad 1.2.12",
    family: "Upanishad | Shruti",
    stance: "Feedback triage, not private counseling.",
    progress: 97,
    next: "Educator Kit",
    primaryAsk: "Define the feedback queue that helps the product improve without collecting sensitive stories.",
    summary: "Feedback Triage Lab turns beta reactions into actionable queues while blocking sensitive private intake.",
    items: [
      ["Source issue", "Wrong source, vague citation, translation concern, or category confusion.", "Routes to review trail."],
      ["UX friction", "Confusing path, too much text, unclear action, or mobile issue.", "Routes to design polish."],
      ["Privacy concern", "Memory, account, export, delete, or student-use question.", "Routes to consent work."],
      ["Reviewer offer", "Someone wants to help source or language review.", "Routes to reviewer ops."]
    ],
    modes: {
      brief: [
        ["Feedback promise", "Feedback should become product work, not a pile of vague comments."],
        ["Safety move", "Block private distress or family-conflict disclosure from public feedback."],
        ["Founder move", "Review the queue weekly and choose one release action."]
      ],
      checklist: [
        ["Category", "Can the feedback be assigned to one queue?"],
        ["Action", "Does it create a product decision?"],
        ["Privacy", "Should the user be told not to submit sensitive details?"]
      ],
      boundary: [
        ["No private intake", "Do not ask for sensitive emotional, medical, or family details."],
        ["No silent change", "Do not accept source corrections without review."],
        ["No promise of response", "Do not promise personal support from feedback."]
      ]
    }
  },
  {
    version: "v1.0.2",
    badge: "v1.0.2 educator",
    slug: "educator",
    nav: "Educator",
    title: "VedaPath Educator Kit",
    pageLabel: "Educator kit",
    eyebrow: "Teaching handoff",
    h1: "Give teachers source cards, not replacement claims.",
    lead: "An educator kit for sharing source cards, discussion prompts, comparison notes, and classroom boundaries with teachers and study groups.",
    source: "Chandogya Upanishad 6.1.3",
    family: "Upanishad | Shruti",
    stance: "Educator support, not teacher replacement.",
    progress: 98,
    next: "Return Rhythm Board",
    primaryAsk: "Create one educator handoff that is useful, copyable, and clearly bounded.",
    summary: "Educator Kit packages VedaPath's source-first method into teacher-safe cards and discussion prompts.",
    items: [
      ["Source card", "Citation, family, plain meaning, and confidence.", "Lets teachers inspect the basis."],
      ["Discussion", "One fair question with more than one possible view.", "Supports learning, not dogma."],
      ["Compare", "Text, tradition, modern analogy, and boundary.", "Prevents category collapse."],
      ["Handoff", "Copyable classroom note with no student tracking.", "Keeps privacy simple."]
    ],
    modes: {
      brief: [
        ["Educator promise", "VedaPath supports teachers by making source work easier, not by replacing their judgment."],
        ["UX move", "Keep the handoff copyable and short."],
        ["Launch move", "Use educator feedback to improve source clarity, not to claim endorsement."]
      ],
      checklist: [
        ["Useful", "Would a teacher actually use this card?"],
        ["Bounded", "Does it avoid replacing teacher context?"],
        ["Private", "Does it avoid student tracking?"]
      ],
      boundary: [
        ["No teacher replacement", "Do not position VedaPath as the educator."],
        ["No endorsement claim", "Do not imply educators endorse the product by using a card."],
        ["No student surveillance", "Do not collect student data in this prototype."]
      ]
    }
  },
  {
    version: "v1.0.3",
    badge: "v1.0.3 return",
    slug: "return",
    nav: "Return",
    title: "VedaPath Return Rhythm Board",
    pageLabel: "Return rhythm",
    eyebrow: "Gentle retention",
    h1: "Invite return without pressure.",
    lead: "A return-rhythm board for daily source, weekly review, local streaks, learning paths, and respectful reminders without guilt or hidden profiling.",
    source: "Bhagavad Gita 6.5",
    family: "Bhagavad Gita | Smriti",
    stance: "Return rhythm, not habit pressure.",
    progress: 99,
    next: "Launch Control Center",
    primaryAsk: "Design the return loop that helps users come back without making calm feel like homework.",
    summary: "Return Rhythm Board shapes VedaPath retention around source curiosity, calm practice, and user-owned rhythm.",
    items: [
      ["Daily source", "One optional passage or concept.", "Invites return without obligation."],
      ["Weekly review", "One source learned, one claim corrected, one calm action carried.", "Makes progress meaningful."],
      ["Local streak", "Device-local completion count with clear reset.", "Avoids account pressure."],
      ["Reminder boundary", "No guilt, no spiritual ranking, no private inference.", "Keeps calm humane."]
    ],
    modes: {
      brief: [
        ["Return promise", "A calm product should invite return, not create another pressure system."],
        ["Product move", "Use source curiosity and practical action as the return hook."],
        ["Privacy move", "Keep prototype rhythm local until accounts and consent exist."]
      ],
      checklist: [
        ["Gentle", "Does the loop avoid guilt or ranking?"],
        ["Useful", "Does returning create source understanding or steady action?"],
        ["Private", "Is rhythm memory local or explicitly consented?"]
      ],
      boundary: [
        ["No guilt loop", "Do not make users feel spiritually behind."],
        ["No hidden scoring", "Do not infer personal worth from streaks."],
        ["No silent reminders", "Do not notify or sync without consent."]
      ]
    }
  },
  {
    version: "v1.0.4",
    badge: "v1.0.4 launch center",
    slug: "launchcenter",
    nav: "Launch Center",
    title: "VedaPath Launch Control Center",
    pageLabel: "Launch control",
    eyebrow: "Founder launch command",
    h1: "Hold the center before launch.",
    lead: "A launch control center that brings readiness, source pack, citation, review, safety, pilot, feedback, educator, and return rhythm into one decision surface.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Founder decision center, not automatic launch approval.",
    progress: 100,
    next: "Founder launch instruction",
    primaryAsk: "Choose the launch posture: hold, private pilot, public beta, or reviewer-first.",
    summary: "Launch Control Center completes the readiness sprint and gives VedaPath one calm founder launch decision surface.",
    items: [
      ["Hold", "If source pack, privacy, or no-go checks are not ready.", "Protect trust before reach."],
      ["Private pilot", "If the first 25 records and feedback triage are ready.", "Learn with a small audience."],
      ["Public beta", "If source, safety, privacy, and launch copy are aligned.", "Share clearly as prototype."],
      ["Reviewer-first", "If authority risk is the biggest blocker.", "Build review trail before reach."]
    ],
    modes: {
      brief: [
        ["Launch center promise", "The best launch decision is calm because the tradeoffs are visible."],
        ["Founder move", "Pick one posture, one audience, and one next release action."],
        ["Product truth", "VedaPath can be shown with pride only where its boundaries are shown with equal clarity."]
      ],
      checklist: [
        ["Posture", "Hold, private pilot, public beta, or reviewer-first?"],
        ["Reason", "Which evidence supports that posture?"],
        ["Next", "What is the next single release action?"]
      ],
      boundary: [
        ["No automatic launch", "This center supports judgment; it does not approve launch by itself."],
        ["No claim inflation", "Do not let version 1 language imply verified authority."],
        ["No hidden data", "Do not add production memory, analytics, or accounts without consent controls."]
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
  const start = "          <!-- VEDAPATH READINESS SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH READINESS SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH BETA SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH BETA SPRINT NAV END -->", `          <!-- VEDAPATH BETA SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH PERSONAL SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH PERSONAL SPRINT NAV END -->", `          <!-- VEDAPATH PERSONAL SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else {
    const storyLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link" href="story.html">Story</a>`;
    if (content.includes(storyLink)) {
      content = content.replace(storyLink, `${storyLink}\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="command.html">Command</a>
          <!-- VEDAPATH READINESS SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH READINESS SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Launch readiness sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn beta momentum into launch judgment, source trust, and simple return paths.</p>
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
          <span class="badge green">Readiness progress</span>
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
              <div><strong>Ready</strong><p>Name what can honestly ship.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Review</strong><p>Route what still needs source or human decision.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Hold</strong><p>Protect what must not be promised.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Launch</strong><p>Choose one small next action.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a launch-readiness planning surface. It does not create production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH READINESS SPRINT LINKS START -->",
    "<!-- VEDAPATH READINESS SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH BETA SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH READINESS SPRINT FEATURES START -->",
    "<!-- VEDAPATH READINESS SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH BETA SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH READINESS SPRINT NOTES START -->",
    "<!-- VEDAPATH READINESS SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH BETA SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH READINESS SPRINT SUMMARY START -->",
    "<!-- VEDAPATH READINESS SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH BETA SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${78 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable launch-readiness handoff

${shortTitle(item)} should never claim production storage, verified answers, reviewer approval, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH READINESS SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH READINESS SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH BETA SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="launchcenter.html">Launch Center</a>')) {
    content = content.replace('<a href="command.html">Beta Command</a>', '<a href="command.html">Beta Command</a> | <a href="launchcenter.html">Launch Center</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Launch readiness sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Launch readiness sprint progress: ${visible.length}/10 rooms complete. Production backend, real reviewer operations, and licensed audio still require separate implementation decisions.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder launch instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Readiness sprint complete. Next release waits for founder launch instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${59 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH READINESS SPRINT PHASES START -->",
    "            <!-- VEDAPATH READINESS SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH BETA SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${59 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v0.9.4 Public Beta Command Center"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Launch readiness sprint complete" : `${visible.length}/10 readiness rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep launch posture simple: ready, review, hold, or pilot.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, reviewer approval, therapy, ritual instruction, or licensed audio.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder launch instruction before the next lane."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/\d+% public beta sprint\. New: [\s\S]*?<\/p>/, `${active.progress}% launch readiness sprint. New: ${shortTitle(active)} gives the launch path one calm decision surface.</p>`);
  content = content.replace(/100% trusted MVP prototype\. New: [\s\S]*?<\/p>/, `${active.progress}% launch readiness sprint. New: ${shortTitle(active)} gives the launch path one calm decision surface.</p>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH READINESS SPRINT HOME START -->",
    "          <!-- VEDAPATH READINESS SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH BETA SPRINT HOME END -->"
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
    "          <!-- VEDAPATH READINESS SPRINT FEATURES START -->",
    "          <!-- VEDAPATH READINESS SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH BETA SPRINT FEATURES END -->"
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

console.log(`Generated launch readiness sprint through ${active.version} (${visible.length}/10).`);
