import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v1.2.5",
    badge: "v1.2.5 welcome",
    slug: "betawelcome",
    nav: "Welcome",
    title: "VedaPath Public Beta Welcome",
    pageLabel: "Public beta welcome",
    eyebrow: "First public doorway",
    h1: "Welcome users with one calm choice.",
    lead: "A public beta doorway that gives first visitors one source-first path, one calm path, and one clear trust boundary.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Welcome prototype, not production onboarding.",
    progress: 91,
    next: "Question Studio",
    primaryAsk: "Make the first public screen choose one path without overwhelming the user.",
    summary: "Public Beta Welcome gives VedaPath a simple public doorway for curious visitors, calm seekers, students, and reviewers.",
    items: [
      ["Choose path", "Ask a source question, take a calm practice, or inspect trust.", "Reduces first-visit confusion."],
      ["Show boundary", "Prototype status, no guru voice, no therapy claim, no ritual authority.", "Sets honest expectations."],
      ["Use the logo", "Keep the Bhagwa mark visible as energy with calm restraint.", "Builds memory."],
      ["Invite return", "Offer a saved local path without forcing sign-in.", "Keeps agency intact."]
    ],
    modes: {
      brief: [
        ["Doorway promise", "The first screen should feel like arrival, not a dashboard."],
        ["UX move", "One primary action and two quiet secondary paths."],
        ["Launch move", "State prototype limits before users invest trust."]
      ],
      checklist: [
        ["Simple", "Can the visitor choose in under ten seconds?"],
        ["Honest", "Is prototype status visible?"],
        ["Calm", "Does the page avoid pressure and clutter?"]
      ],
      boundary: [
        ["No crowded launch", "Do not show every room on first entry."],
        ["No authority claim", "Do not imply VedaPath replaces tradition or teachers."],
        ["No forced account", "Do not block first use behind sign-in."]
      ]
    }
  },
  {
    version: "v1.2.6",
    badge: "v1.2.6 question",
    slug: "questionstudio",
    nav: "Question",
    title: "VedaPath Question Studio",
    pageLabel: "Question studio",
    eyebrow: "Ask with source context",
    h1: "Help the user ask a better first question.",
    lead: "A question studio with prompt types, source-family hints, claim-risk labels, and a no-source fallback before answer generation.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Question-shaping prototype, not live retrieval.",
    progress: 92,
    next: "Confidence Card",
    primaryAsk: "Shape user questions so VedaPath can answer with source clarity instead of broad guessing.",
    summary: "Question Studio improves the first ask by separating text lookup, concept explanation, claim check, calm reflection, and modern analogy.",
    items: [
      ["Prompt type", "Lookup, explain, compare, claim check, calm reflection, or analogy.", "Clarifies answer mode."],
      ["Source hint", "Veda, Upanishad, Gita, Purana, commentary, modern view, or unsure.", "Prevents category confusion."],
      ["Risk label", "Science claim, ritual claim, distress claim, or tradition claim.", "Routes caution early."],
      ["Fallback", "If no source is available, say so directly.", "Protects trust."]
    ],
    modes: {
      brief: [
        ["Question promise", "A better question is the first source-safety feature."],
        ["Product move", "Let the user mark the kind of answer they want."],
        ["Trust move", "Show when a question needs review or a no-source answer."]
      ],
      checklist: [
        ["Typed", "Does the question have an answer mode?"],
        ["Scoped", "Is source family known or marked unsure?"],
        ["Safe", "Are risky claim types flagged before answering?"]
      ],
      boundary: [
        ["No leading user", "Do not force the user toward a claim."],
        ["No false source", "Do not invent a source family from weak hints."],
        ["No distress intake", "Do not collect private crisis details."]
      ]
    }
  },
  {
    version: "v1.2.7",
    badge: "v1.2.7 confidence",
    slug: "confidencecard",
    nav: "Confidence",
    title: "VedaPath Confidence Card",
    pageLabel: "Confidence card",
    eyebrow: "Trust at answer level",
    h1: "Show confidence as a reason, not a feeling.",
    lead: "A confidence card that names citation strength, review state, source-family clarity, boundary risk, and what would improve the answer.",
    source: "Bhagavad Gita 4.34",
    family: "Bhagavad Gita | Smriti",
    stance: "Confidence display, not certification.",
    progress: 93,
    next: "Learning Trail",
    primaryAsk: "Make every public answer show why it deserves its confidence level.",
    summary: "Confidence Card makes answer trust visible through source strength, review state, boundary risk, and missing evidence.",
    items: [
      ["Source strength", "Direct passage, commentary, scholarly view, analogy, or uncertain.", "Explains grounding."],
      ["Review state", "Draft, reviewed, held, blocked, or needs specialist review.", "Prevents vague approval."],
      ["Risk state", "Category confusion, overclaim, ritual, therapy, or modern science risk.", "Shows caution."],
      ["Upgrade path", "What source, reviewer, or field would raise confidence.", "Turns uncertainty into action."]
    ],
    modes: {
      brief: [
        ["Confidence promise", "Confidence should be inspectable and humble."],
        ["UX move", "Show confidence beside citation, not as a mysterious score."],
        ["Quality move", "Every low-confidence answer should explain what is missing."]
      ],
      checklist: [
        ["Visible", "Can users see why confidence is high or low?"],
        ["Actionable", "Does uncertainty create a review task?"],
        ["Bounded", "Does confidence stop at the source scope?"]
      ],
      boundary: [
        ["No fake precision", "Do not use numeric confidence without explanation."],
        ["No review blur", "Do not imply all claims are reviewed."],
        ["No overreach", "Do not let confidence outrun the cited source."]
      ]
    }
  },
  {
    version: "v1.2.8",
    badge: "v1.2.8 trail",
    slug: "learningtrail",
    nav: "Trail",
    title: "VedaPath Learning Trail",
    pageLabel: "Learning trail",
    eyebrow: "Progressive learning",
    h1: "Turn one answer into a gentle trail.",
    lead: "A learning trail that moves from beginner meaning to source comparison, Sanskrit lens, commentary context, and careful claim-checking.",
    source: "Mundaka Upanishad 1.1.5",
    family: "Upanishad | Shruti",
    stance: "Learning path prototype, not curriculum certification.",
    progress: 94,
    next: "Calm Companion",
    primaryAsk: "Give users a next learning step without burying the answer in complexity.",
    summary: "Learning Trail lets VedaPath grow depth progressively while keeping the first answer calm and readable.",
    items: [
      ["Beginner step", "Plain meaning and why the source matters.", "Starts with clarity."],
      ["Compare step", "Related passage, commentary, or tradition-aware contrast.", "Adds depth."],
      ["Language step", "Sanskrit term, transliteration, and translation caution.", "Builds respect."],
      ["Claim step", "What can and cannot be concluded.", "Prevents inflation."]
    ],
    modes: {
      brief: [
        ["Learning promise", "Depth should unfold, not land all at once."],
        ["UX move", "Offer one next step at a time."],
        ["Content move", "Separate language learning from claim proof."]
      ],
      checklist: [
        ["Beginner-safe", "Can a newcomer follow the first step?"],
        ["Layered", "Are deeper views optional?"],
        ["Careful", "Are claims checked before becoming lessons?"]
      ],
      boundary: [
        ["No curriculum claim", "Do not present this as official religious education."],
        ["No flattening", "Do not pretend all schools agree."],
        ["No hidden complexity", "Do not bury uncertainty."]
      ]
    }
  },
  {
    version: "v1.2.9",
    badge: "v1.2.9 companion",
    slug: "calmcompanion",
    nav: "Companion",
    title: "VedaPath Calm Companion",
    pageLabel: "Calm companion",
    eyebrow: "Personal steadiness",
    h1: "Make calm practical without pretending to heal.",
    lead: "A calm companion surface that turns one source candidate into one reflection question, one small action, and one clear safety boundary.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Reflection support, not therapy or emergency support.",
    progress: 95,
    next: "Feedback Portal",
    primaryAsk: "Make personal calm feel useful while keeping the boundary unmistakable.",
    summary: "Calm Companion gives users a short source-backed reflection path for everyday steadiness without therapy, diagnosis, or dependency.",
    items: [
      ["Arrive", "Name the moment without judging it.", "Reduces pressure."],
      ["Read", "Open one source candidate and category.", "Keeps reflection grounded."],
      ["Reflect", "Answer one clean question.", "Creates space."],
      ["Carry", "Choose one small action in ordinary life.", "Returns calm to responsibility."]
    ],
    modes: {
      brief: [
        ["Calm promise", "VedaPath supports steadiness, not escape from life."],
        ["UX move", "Use short, gentle steps and visible boundaries."],
        ["Safety move", "Direct serious distress to human and emergency support."]
      ],
      checklist: [
        ["Grounded", "Is the reflection tied to a source candidate?"],
        ["Small", "Is the action realistic today?"],
        ["Safe", "Are therapy and emergency boundaries clear?"]
      ],
      boundary: [
        ["No therapy", "Do not diagnose, treat, or advise on crisis."],
        ["No dependency", "Do not make calm depend on daily streak pressure."],
        ["No ritual instruction", "Do not prescribe ritual practice."]
      ]
    }
  },
  {
    version: "v1.3.0",
    badge: "v1.3.0 feedback",
    slug: "feedbackportal",
    nav: "Feedback",
    title: "VedaPath Feedback Portal",
    pageLabel: "Feedback portal",
    eyebrow: "Public learning loop",
    h1: "Let users improve trust without exposing themselves.",
    lead: "A public feedback portal for source issue, category confusion, answer boundary, privacy concern, and product friction reports.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Feedback prototype, not live intake.",
    progress: 96,
    next: "Scholar Packet",
    primaryAsk: "Design feedback intake so users can report issues safely and specifically.",
    summary: "Feedback Portal turns public reactions into structured improvement signals while blocking sensitive personal intake.",
    items: [
      ["Issue type", "Source, category, translation, boundary, privacy, or usability.", "Routes work."],
      ["Evidence", "Optional citation, screenshot note, or page link.", "Improves triage."],
      ["Privacy", "Warn users not to submit private distress, medical, or family details.", "Protects users."],
      ["Outcome", "Review queue, hold decision, product backlog, or no-action note.", "Closes the loop."]
    ],
    modes: {
      brief: [
        ["Feedback promise", "Users should be able to correct the product without oversharing."],
        ["Ops move", "Turn every report into a typed queue item."],
        ["Privacy move", "Block sensitive personal detail at the door."]
      ],
      checklist: [
        ["Typed", "Is every report categorized?"],
        ["Useful", "Does it ask for evidence without demanding private data?"],
        ["Routed", "Can the team see the next action?"]
      ],
      boundary: [
        ["No private intake", "Do not collect sensitive personal stories."],
        ["No support promise", "Do not imply live crisis or counseling support."],
        ["No silent rewrite", "Do not change source knowledge without review."]
      ]
    }
  },
  {
    version: "v1.3.1",
    badge: "v1.3.1 packet",
    slug: "scholarpacket",
    nav: "Packet",
    title: "VedaPath Scholar Packet Builder",
    pageLabel: "Scholar packet builder",
    eyebrow: "Review packet",
    h1: "Send scholars a complete question, not a vague request.",
    lead: "A packet builder for citation, translation note, answer draft, confidence card, boundary question, and requested review lane.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Packet prototype, not a scholarly agreement.",
    progress: 97,
    next: "Source Scoreboard",
    primaryAsk: "Make review requests respectful, scoped, and easy to answer.",
    summary: "Scholar Packet Builder packages VedaPath review requests with evidence, scope, and no-endorsement language.",
    items: [
      ["Citation pack", "Source, edition, translation note, and uncertainty.", "Respects source work."],
      ["Answer draft", "What the user would see and where confidence appears.", "Shows impact."],
      ["Review lane", "Source, language, interpretation, boundary, or rights.", "Narrows the ask."],
      ["Consent", "Private feedback, named credit, or anonymous review.", "Protects reviewer agency."]
    ],
    modes: {
      brief: [
        ["Packet promise", "A scholar should know exactly what is being asked."],
        ["Review move", "Send the evidence and the public impact together."],
        ["Respect move", "Credit and public naming must be optional."]
      ],
      checklist: [
        ["Complete", "Does the packet include source and answer draft?"],
        ["Scoped", "Is the review lane narrow?"],
        ["Respectful", "Is no-endorsement language clear?"]
      ],
      boundary: [
        ["No rubber stamp", "Do not ask for broad endorsement."],
        ["No vague labor", "Do not send unspecific review requests."],
        ["No public naming", "Do not publish names without consent."]
      ]
    }
  },
  {
    version: "v1.3.2",
    badge: "v1.3.2 scoreboard",
    slug: "sourcescore",
    nav: "Scoreboard",
    title: "VedaPath Source Pack Scoreboard",
    pageLabel: "Source pack scoreboard",
    eyebrow: "Dataset readiness",
    h1: "Show which sources are ready and why.",
    lead: "A source pack scoreboard for citation completeness, review state, rights state, answer coverage, no-go risks, and launch eligibility.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Dataset-readiness prototype, not verified corpus status.",
    progress: 98,
    next: "Launch Story Studio",
    primaryAsk: "Make source pack readiness visible before public beta expansion.",
    summary: "Source Pack Scoreboard gives the founder a simple view of ready, held, blocked, and reviewer-needed source records.",
    items: [
      ["Completeness", "Citation, source family, translation note, and answer boundary.", "Shows readiness."],
      ["Review", "Draft, reviewed, held, blocked, or specialist-needed.", "Shows trust state."],
      ["Coverage", "Which public questions the source can answer.", "Prevents broad use."],
      ["Risk", "Rights, ritual, therapy, science, or category overclaim.", "Protects launch."]
    ],
    modes: {
      brief: [
        ["Scoreboard promise", "Launch readiness should be visible record by record."],
        ["Founder move", "Sort source records into ready, hold, and review."],
        ["Product move", "Use readiness to decide answer availability."]
      ],
      checklist: [
        ["Complete", "Are required fields visible?"],
        ["Reviewed", "Is review state clear?"],
        ["Eligible", "Can this record power public answers safely?"]
      ],
      boundary: [
        ["No corpus claim", "Do not imply the full tradition is covered."],
        ["No hidden holds", "Do not answer from held records."],
        ["No rights bypass", "Do not display restricted content."]
      ]
    }
  },
  {
    version: "v1.3.3",
    badge: "v1.3.3 story",
    slug: "launchstory",
    nav: "Story",
    title: "VedaPath Launch Story Studio",
    pageLabel: "Launch story studio",
    eyebrow: "Public narrative",
    h1: "Tell the launch story without sounding inflated.",
    lead: "A launch story studio for headline, source-first promise, calm use case, trust proof, boundary line, and next invitation.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Launch copy prototype, not final marketing approval.",
    progress: 99,
    next: "Beta Beacon",
    primaryAsk: "Prepare public launch copy that is warm, clear, and humble.",
    summary: "Launch Story Studio helps VedaPath speak to the world with calm confidence and visible limits.",
    items: [
      ["Headline", "Ancient texts. Clear paths.", "Keeps the promise memorable."],
      ["Use case", "Ask, source, reflect, learn, and return.", "Explains the product."],
      ["Trust proof", "Source card, confidence card, review queue, and trust center.", "Shows method."],
      ["Boundary", "Prototype status, no authority, no therapy, no ritual replacement.", "Keeps copy honest."]
    ],
    modes: {
      brief: [
        ["Story promise", "The launch should sound calm because the product is calm."],
        ["Brand move", "Lead with clarity, not mystique."],
        ["Trust move", "Make limits part of the story, not fine print."]
      ],
      checklist: [
        ["Memorable", "Can a user repeat the promise?"],
        ["Concrete", "Does the copy show what the product does?"],
        ["Humble", "Are boundaries visible in the main story?"]
      ],
      boundary: [
        ["No exaggerated launch", "Do not claim to solve inner life."],
        ["No sacred marketing", "Do not use reverence as a sales trick."],
        ["No hidden prototype", "Do not bury prototype status."]
      ]
    }
  },
  {
    version: "v1.3.4",
    badge: "v1.3.4 beta beacon",
    slug: "betabeacon",
    nav: "Beta Beacon",
    title: "VedaPath Public Beta Beacon",
    pageLabel: "Public beta beacon",
    eyebrow: "Activation decision",
    h1: "A calm beta is ready when trust is visible.",
    lead: "A beta beacon that brings welcome, question shaping, confidence, learning, calm practice, feedback, scholar packets, source scoring, and launch story into one decision surface.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Beta decision surface, not production approval.",
    progress: 100,
    next: "Founder instruction",
    primaryAsk: "Choose the next real implementation lane: live source retrieval, beta waitlist, reviewer workflow, or public landing polish.",
    summary: "Public Beta Beacon completes the activation sprint and gives VedaPath one calm decision surface before real public beta work.",
    items: [
      ["First visit", "Welcome path and question studio.", "Starts simply."],
      ["First answer", "Confidence card and learning trail.", "Builds trust."],
      ["Return", "Calm companion and user-owned rhythm.", "Keeps care gentle."],
      ["Improve", "Feedback portal, scholar packet, source scoreboard, and launch story.", "Turns launch into learning."]
    ],
    modes: {
      brief: [
        ["Beacon promise", "Public beta should feel calm because the trust system is visible."],
        ["Founder move", "Choose one implementation lane before adding more surfaces."],
        ["Launch move", "Keep public scope narrow until source quality is proven."]
      ],
      checklist: [
        ["Visible", "Can users inspect trust on first use?"],
        ["Pausable", "Can the founder hold risky areas?"],
        ["Next", "Is one implementation lane clear?"]
      ],
      boundary: [
        ["No production approval", "Do not call this a launch sign-off."],
        ["No broad beta", "Do not invite everyone before source scope is ready."],
        ["No authority claim", "Do not present VedaPath as teacher, priest, scholar, or tradition."]
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
  const start = "          <!-- VEDAPATH ACTIVATION SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH ACTIVATION SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV END -->", `          <!-- VEDAPATH PRODUCTIZATION SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
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
          <a class="link" href="launchbeacon.html">Launch Beacon</a>
          <a class="link" href="trustcenter.html">Trust</a>
          <a class="link" href="calm.html">Calm</a>
          <!-- VEDAPATH ACTIVATION SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH ACTIVATION SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Public beta activation sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms make first use, trust, return, feedback, and beta decision-making feel calm and inspectable.</p>
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
          <span class="badge green">Beta activation</span>
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
              <div><strong>Arrive</strong><p>Make the first choice calm.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Trust</strong><p>Show source, confidence, and boundary.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Return</strong><p>Invite rhythm without pressure.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Improve</strong><p>Route feedback and review.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This is a public beta activation prototype. It does not create production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.</p>
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
    "<!-- VEDAPATH ACTIVATION SPRINT LINKS START -->",
    "<!-- VEDAPATH ACTIVATION SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH ACTIVATION SPRINT FEATURES START -->",
    "<!-- VEDAPATH ACTIVATION SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH ACTIVATION SPRINT NOTES START -->",
    "<!-- VEDAPATH ACTIVATION SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH ACTIVATION SPRINT SUMMARY START -->",
    "<!-- VEDAPATH ACTIVATION SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${108 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable public beta activation handoff

${shortTitle(item)} should never claim production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH ACTIVATION SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH ACTIVATION SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH PRODUCTIZATION SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="betabeacon.html">Beta Beacon</a>')) {
    content = content.replace('<a href="launchbeacon.html">Launch Beacon</a>', '<a href="launchbeacon.html">Launch Beacon</a> | <a href="betabeacon.html">Beta Beacon</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Public beta activation sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Public beta activation sprint progress: ${visible.length}/10 rooms complete. Real backend retrieval, accounts, reviewer operations, and licensed audio still require implementation.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Public beta activation sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${89 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH ACTIVATION SPRINT PHASES START -->",
    "            <!-- VEDAPATH ACTIVATION SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH PRODUCTIZATION SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${89 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.2.4 World Launch Beacon"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Public beta activation sprint complete" : `${visible.length}/10 beta activation rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep first use simple: arrive, ask, trust, return, improve.</span></li>
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
    "          <!-- VEDAPATH ACTIVATION SPRINT HOME START -->",
    "          <!-- VEDAPATH ACTIVATION SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT HOME END -->"
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
    "          <!-- VEDAPATH ACTIVATION SPRINT FEATURES START -->",
    "          <!-- VEDAPATH ACTIVATION SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH PRODUCTIZATION SPRINT FEATURES END -->"
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

console.log(`Generated public beta activation sprint through ${active.version} (${visible.length}/10).`);
