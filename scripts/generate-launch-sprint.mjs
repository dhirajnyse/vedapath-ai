import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v0.6.5",
    badge: "v0.6.5 signal",
    slug: "signal",
    nav: "Signal",
    title: "VedaPath Founder Signal Map",
    pageLabel: "Founder signal map",
    eyebrow: "Founder signal",
    h1: "Find the first true audience signal.",
    lead: "A calm founder surface for reading launch signals without chasing noise, vanity, or vague excitement.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Signal, not surveillance.",
    progress: 86,
    next: "Trust Demo Tour",
    primaryAsk: "Choose one audience signal to test this week.",
    summary: "Founder Signal Map turns curiosity, feedback, and early reactions into visible product signals without hidden tracking.",
    items: [
      ["Learner pull", "Are beginners asking for clearer source labels?", "Evidence: repeated questions, saved rooms, feedback tickets."],
      ["Family calm", "Are shared reflection rooms being opened?", "Evidence: Calm Circle, Before Reply, and Use Case interest."],
      ["Builder trust", "Are people inspecting gates instead of only the logo?", "Evidence: Storage, Access, Feedback, and Story clicks."],
      ["Reviewer interest", "Are careful readers offering corrections?", "Evidence: source issues, category confusion, and reviewer routes."]
    ],
    modes: {
      brief: [
        ["Founder read", "Treat signal as directional evidence, not truth. The first audience is where curiosity repeats without needing hype."],
        ["Source lens", "Act steadily, then observe the result. Do not turn a single reaction into identity or destiny."],
        ["Output", "Pick one signal, one question, one test, and one review boundary."]
      ],
      checklist: [
        ["Ask", "What did the user try to do without being persuaded?"],
        ["Evidence", "What source, room, or feedback path created the signal?"],
        ["Boundary", "What should not be inferred from this signal?"]
      ],
      boundary: [
        ["No hidden profile", "Do not infer personality, religion, distress, or private state from prototype behavior."],
        ["No vanity metric", "Do not confuse admiration for the logo with trust in the product."],
        ["No forced audience", "Do not force every user into the same path."]
      ]
    }
  },
  {
    version: "v0.6.6",
    badge: "v0.6.6 tour",
    slug: "tour",
    nav: "Tour",
    title: "VedaPath Trust Demo Tour",
    pageLabel: "Trust demo tour",
    eyebrow: "Guided demo",
    h1: "Show trust before asking for belief.",
    lead: "A short guided path for users, reviewers, and partners to understand why VedaPath is source-first.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Demo, not proof.",
    progress: 88,
    next: "Source Record Studio",
    primaryAsk: "Walk a visitor through one trust path.",
    summary: "Trust Demo Tour gives the product a calm walkthrough: ask, source, boundary, review, feedback, story, and next action.",
    items: [
      ["Ask", "Start from a real question.", "The visitor sees that the product begins with a source need."],
      ["Source", "Open citation and source family.", "The answer is grounded before it is persuasive."],
      ["Boundary", "Show what not to overclaim.", "The product earns calm by refusing false authority."],
      ["Review", "Route issues visibly.", "Corrections become work, not silent rewrites."]
    ],
    modes: {
      brief: [
        ["Tour promise", "VedaPath does not ask visitors to trust an answer blindly. It shows the trust path."],
        ["Best first demo", "Use the Oppenheimer example because it is familiar, culturally charged, and correctable."],
        ["Visitor close", "Leave the visitor with one source-backed next room, not a sales pitch."]
      ],
      checklist: [
        ["Minute 1", "Ask and answer with source card."],
        ["Minute 2", "Open Pramana Meter and boundary."],
        ["Minute 3", "Show Feedback Intake and Launch Story Room."]
      ],
      boundary: [
        ["No authority theater", "The tour must not sound like spiritual certification."],
        ["No feature flood", "Do not show every room. Show the trust chain."],
        ["No production claim", "Say prototype when backend, accounts, and reviewers are not live."]
      ]
    }
  },
  {
    version: "v0.6.7",
    badge: "v0.6.7 record",
    slug: "record",
    nav: "Record",
    title: "VedaPath Source Record Studio",
    pageLabel: "Source record studio",
    eyebrow: "Record studio",
    h1: "Shape one source before it shapes an answer.",
    lead: "A source-record drafting room for turning citations, translations, review needs, and boundaries into a clean record.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Draft record, not authority.",
    progress: 90,
    next: "Reviewer Workbench",
    primaryAsk: "Draft one source record with missing fields visible.",
    summary: "Source Record Studio makes source storage tactile: record fields, translation notes, review flags, and retrieval eligibility.",
    items: [
      ["Source identity", "Text family, citation, edition, and language.", "Required before retrieval."],
      ["Translation layer", "Rendering, translator, license, and notes.", "Required before public display."],
      ["Review state", "Source, translation, boundary, and rights lanes.", "Required before promotion."],
      ["Use boundary", "Allowed use, blocked use, and no-go claims.", "Required before answer confidence."]
    ],
    modes: {
      brief: [
        ["Record promise", "Every trusted answer starts as a visible source record."],
        ["Product move", "Make missing metadata visible so the product cannot pretend a source is ready."],
        ["Founder use", "Draft the first 25 records from high-frequency questions."]
      ],
      checklist: [
        ["Citation", "Text family, passage id, source URL, and edition note."],
        ["Meaning", "Plain meaning, Sanskrit note, translation caution."],
        ["Release", "Reviewer route, confidence, allowed use, blocked use."]
      ],
      boundary: [
        ["No hidden source", "Do not allow answer confidence without source identity."],
        ["No license blur", "Do not display translation or audio without rights."],
        ["No final authority", "A complete record is still not spiritual authority."]
      ]
    }
  },
  {
    version: "v0.6.8",
    badge: "v0.6.8 workbench",
    slug: "workbench",
    nav: "Workbench",
    title: "VedaPath Reviewer Workbench",
    pageLabel: "Reviewer workbench",
    eyebrow: "Reviewer workbench",
    h1: "Review should feel precise, not ceremonial.",
    lead: "A clean workbench for source, translation, boundary, rights, and product reviewers to see exactly what needs a decision.",
    source: "Katha Upanishad 1.2.23",
    family: "Upanishad | Shruti",
    stance: "Scoped review, not final verdict.",
    progress: 91,
    next: "Launch Readiness Board",
    primaryAsk: "Route one record to the right reviewer lane.",
    summary: "Reviewer Workbench turns review identity and access rules into a visible, role-scoped decision room.",
    items: [
      ["Source lane", "Citation, family, edition, and passage match.", "Approves source identity only."],
      ["Translation lane", "Meaning, rendering, rights, and notes.", "Approves language layer only."],
      ["Boundary lane", "No-go claims, calm safety, and authority posture.", "Approves public wording only."],
      ["Product lane", "UX clarity, release notes, and user-facing flow.", "Approves interface readiness only."]
    ],
    modes: {
      brief: [
        ["Review promise", "One reviewer cannot approve every dimension."],
        ["Product move", "Each decision has scope, evidence, state, and audit note."],
        ["Founder use", "Invite reviewers into one narrow lane first."]
      ],
      checklist: [
        ["Scope", "What exactly can this reviewer decide?"],
        ["Evidence", "Which source, field, or screen are they reviewing?"],
        ["Decision", "Approve, hold, block, or request evidence."]
      ],
      boundary: [
        ["No anonymous authority", "Do not claim review without accountable scoped role."],
        ["No spiritual certification", "Review improves product trust, not religious authority."],
        ["No forced exposure", "Private reviewer identity stays behind policy."]
      ]
    }
  },
  {
    version: "v0.6.9",
    badge: "v0.6.9 readiness",
    slug: "readiness",
    nav: "Ready",
    title: "VedaPath Launch Readiness Board",
    pageLabel: "Launch readiness board",
    eyebrow: "Readiness board",
    h1: "Launch when the boundaries are visible.",
    lead: "A founder board for deciding what is ready, what is held, and what should remain unclaimed at launch.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Launch gate, not launch pressure.",
    progress: 92,
    next: "Invite Prototype",
    primaryAsk: "Move only ready surfaces into launch copy.",
    summary: "Launch Readiness Board connects demo readiness, trust gates, public copy, feedback routing, and blocked claims.",
    items: [
      ["Ready", "Logo, story, source-first demo, feedback intake.", "Can be shown publicly as prototype."],
      ["Review", "Source records, reviewer workbench, first 108 questions.", "Needs human evidence."],
      ["Hold", "Production storage, accounts, licensed audio.", "Not live yet."],
      ["Block", "Guru voice, therapy claim, ritual authority, verified-answer claim.", "Never launch as product promise."]
    ],
    modes: {
      brief: [
        ["Launch promise", "The product may be inspiring, but the release posture must stay exact."],
        ["Founder move", "Launch what is true now. Say what is still becoming."],
        ["Decision", "Public demo is ready when no-go claims are visible beside the invitation."]
      ],
      checklist: [
        ["Public wording", "Does it say prototype where needed?"],
        ["Feedback route", "Can a visitor report source or boundary issues?"],
        ["No-go claims", "Are blocked claims visible before sharing?"]
      ],
      boundary: [
        ["No deadline pressure", "Do not ship a claim because the product feels beautiful."],
        ["No silent risk", "Every hold condition should be named."],
        ["No launch myth", "Launch is a learning event, not proof of authority."]
      ]
    }
  },
  {
    version: "v0.7.0",
    badge: "v0.7.0 invite",
    slug: "invite",
    nav: "Invite",
    title: "VedaPath Invite and Waitlist Prototype",
    pageLabel: "Invite prototype",
    eyebrow: "Invite prototype",
    h1: "Invite gently. Promise carefully.",
    lead: "A no-submit waitlist and invitation copy room for testing launch language before any account or email system exists.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Invitation, not capture.",
    progress: 93,
    next: "First 108 Questions Map",
    primaryAsk: "Choose one invitation without collecting private data yet.",
    summary: "Invite Prototype shapes early-access copy, consent language, and launch asks while avoiding fake sign-up behavior.",
    items: [
      ["Learner invite", "For people curious about sources.", "Ask: try one question."],
      ["Family invite", "For shared calm and conversation.", "Ask: try one reflection together."],
      ["Reviewer invite", "For careful readers and scholars.", "Ask: review one source trail."],
      ["Builder invite", "For product and trust-minded people.", "Ask: inspect the gate model."]
    ],
    modes: {
      brief: [
        ["Invite promise", "The prototype can invite interest without pretending to store emails."],
        ["Consent posture", "When a real waitlist exists, say what is collected and why."],
        ["Founder move", "Use one short ask per audience."]
      ],
      checklist: [
        ["Audience", "Who is this invite for?"],
        ["Ask", "What one action should they take?"],
        ["Privacy", "What is not being collected in this prototype?"]
      ],
      boundary: [
        ["No fake signup", "Do not imply email capture exists if it does not."],
        ["No pressure", "Do not make calm feel like urgency."],
        ["No broad promise", "Do not promise transformation or spiritual certainty."]
      ]
    }
  },
  {
    version: "v0.7.1",
    badge: "v0.7.1 questions",
    slug: "questions",
    nav: "Questions",
    title: "VedaPath First 108 Questions Map",
    pageLabel: "First 108 questions",
    eyebrow: "Question map",
    h1: "Build the first dataset from real questions.",
    lead: "A curation map for the first 108 source-backed questions, arranged by learner need, source family, and review route.",
    source: "Chandogya Upanishad 6.1.3",
    family: "Upanishad | Shruti",
    stance: "Question map, not answer bank.",
    progress: 94,
    next: "Scholar Outreach Kit",
    primaryAsk: "Pick one question family for the first verified set.",
    summary: "First 108 Questions Map helps move from prototype examples to a reviewed source dataset.",
    items: [
      ["Source basics", "What is Veda, Upanishad, Gita, Itihasa, Purana?", "Beginner category clarity."],
      ["Famous quotes", "Oppenheimer, Gayatri, Tat tvam asi, karma, dharma.", "High-risk misquote clarity."],
      ["Calm practice", "How do source ideas support steadiness?", "Bounded reflection."],
      ["Modern claims", "Science, quantum, productivity, success claims.", "Claim-checking and refusal."]
    ],
    modes: {
      brief: [
        ["Dataset promise", "The first 108 should be reviewed questions, not scraped content."],
        ["Founder move", "Start with high-frequency confusion and high-trust source cards."],
        ["Release posture", "Every record needs source family, citation, boundary, and review state."]
      ],
      checklist: [
        ["Question", "Does a real user ask it?"],
        ["Source", "Can a specific source candidate be shown?"],
        ["Boundary", "What should the answer refuse or soften?"]
      ],
      boundary: [
        ["No proof mining", "Do not select questions only to make grand claims."],
        ["No unsourced answer", "Every dataset entry needs a citation trail."],
        ["No hidden reviewer gap", "Missing review must be visible."]
      ]
    }
  },
  {
    version: "v0.7.2",
    badge: "v0.7.2 outreach",
    slug: "outreach",
    nav: "Outreach",
    title: "VedaPath Scholar Outreach Kit",
    pageLabel: "Scholar outreach kit",
    eyebrow: "Reviewer outreach",
    h1: "Ask for review with humility and precision.",
    lead: "A copy room for inviting scholars, teachers, Sanskrit learners, and careful readers to review narrow source trails.",
    source: "Mundaka Upanishad 1.2.12",
    family: "Upanishad | Shruti",
    stance: "Outreach, not endorsement.",
    progress: 95,
    next: "Calm Use Cases Gallery",
    primaryAsk: "Invite one reviewer to one scoped task.",
    summary: "Scholar Outreach Kit creates respectful review requests with scope, evidence, and no endorsement pressure.",
    items: [
      ["Source reviewer", "Check source family, passage id, and edition.", "Narrow evidence review."],
      ["Translation reviewer", "Check meaning, rendering, and license note.", "Language-layer review."],
      ["Boundary reviewer", "Check overclaim, guru voice, therapy, ritual, crisis.", "Public-safety review."],
      ["Product reviewer", "Check whether the interface explains trust clearly.", "UX clarity review."]
    ],
    modes: {
      brief: [
        ["Outreach promise", "Ask for a narrow review, not a broad endorsement."],
        ["Founder move", "Make it easy to say yes: one passage, one screen, one decision."],
        ["Tone", "Respect the reviewer, the tradition, and the limits of the prototype."]
      ],
      checklist: [
        ["Scope", "What exactly are they reviewing?"],
        ["Evidence", "What passage, screen, and field are attached?"],
        ["Consent", "Can their identity remain private unless they choose otherwise?"]
      ],
      boundary: [
        ["No endorsement claim", "Do not imply outreach equals approval."],
        ["No unpaid burden", "Keep requests small and respectful."],
        ["No final authority", "Review supports product quality, not final spiritual truth."]
      ]
    }
  },
  {
    version: "v0.7.3",
    badge: "v0.7.3 use cases",
    slug: "usecases",
    nav: "Use Cases",
    title: "VedaPath Calm Use Cases Gallery",
    pageLabel: "Calm use cases",
    eyebrow: "Use case gallery",
    h1: "Make calm practical without making it clinical.",
    lead: "A gallery of everyday moments where source-backed reflection can help users act with steadiness and agency.",
    source: "Bhagavad Gita 6.5",
    family: "Bhagavad Gita | Smriti",
    stance: "Reflection support, not therapy.",
    progress: 96,
    next: "Founder Console",
    primaryAsk: "Choose one everyday use case for launch storytelling.",
    summary: "Calm Use Cases Gallery shows where VedaPath can help everyday life without medical, therapeutic, or ritual claims.",
    items: [
      ["Before reply", "Pause before a difficult message.", "Output: calmer draft with one next step."],
      ["Morning start", "Begin with one source and one clean action.", "Output: simple first move."],
      ["Family conversation", "Slow a shared moment around one question.", "Output: shared agreement."],
      ["Evening close", "Acknowledge, release, and close the day.", "Output: no self-judgment."]
    ],
    modes: {
      brief: [
        ["Use-case promise", "The product can support steadiness without diagnosing, treating, or commanding."],
        ["Founder move", "Launch with one practical use case, not a universe of promises."],
        ["Source posture", "Keep citation and boundary visible in every calm use case."]
      ],
      checklist: [
        ["Moment", "What everyday moment is this for?"],
        ["Agency", "What does the user choose, not receive as command?"],
        ["Boundary", "What is clearly outside product scope?"]
      ],
      boundary: [
        ["No therapy", "Do not claim treatment, diagnosis, or emergency support."],
        ["No ritual instruction", "Do not prescribe sacred practice."],
        ["No identity label", "Do not classify the user from their moment."]
      ]
    }
  },
  {
    version: "v0.7.4",
    badge: "v0.7.4 founder",
    slug: "founder",
    nav: "Founder",
    title: "VedaPath Founder Console",
    pageLabel: "Founder console",
    eyebrow: "Founder console",
    h1: "Choose the next real product move.",
    lead: "A calm decision console that brings the launch sprint together and stops before production claims get ahead of reality.",
    source: "Bhagavad Gita 18.66",
    family: "Bhagavad Gita | Smriti",
    stance: "Founder decision, not product authority.",
    progress: 100,
    next: "Founder direction",
    primaryAsk: "Pick the next build lane: backend, reviewers, audio, or launch.",
    summary: "Founder Console summarizes the ten-build sprint and turns it into one next decision.",
    items: [
      ["Production backend", "Durable source records, accounts, consent, exports.", "Best if the next goal is real product memory."],
      ["Reviewer operations", "Role workflows, source review, translation review.", "Best if trust is the next bottleneck."],
      ["Licensed audio", "Rights, speakers, attribution, silent fallback.", "Best if sound becomes a signature feature."],
      ["Launch refinement", "Landing copy, invite flow, outreach, analytics.", "Best if audience learning comes first."]
    ],
    modes: {
      brief: [
        ["Founder promise", "The sprint is complete. The next move should be chosen deliberately, not reactively."],
        ["Product truth", "VedaPath has a powerful prototype spine. It still needs production systems before making production claims."],
        ["Decision", "Choose one lane and make the next release narrower, deeper, and testable."]
      ],
      checklist: [
        ["If backend", "Start with source records and consent, not all memories."],
        ["If reviewers", "Start with one source trail and one scoped reviewer role."],
        ["If launch", "Start with one audience and one clear invitation."]
      ],
      boundary: [
        ["No premature authority", "Do not let excitement turn prototype trust into product certainty."],
        ["No scattered next step", "Do not start backend, audio, reviewers, and launch all at once."],
        ["No hidden user data", "Do not add real persistence without explicit consent design."]
      ]
    }
  }
];

const uptoArg = process.argv.find((arg) => arg.startsWith("--upto="));
const upto = uptoArg ? Number(uptoArg.split("=")[1]) : releases.length - 1;
if (!Number.isInteger(upto) || upto < 0 || upto >= releases.length) {
  throw new Error(`Invalid --upto value. Use 0 through ${releases.length - 1}.`);
}

const active = releases[upto];
const visible = releases.slice(0, upto + 1);
const future = releases.slice(upto + 1);

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  return readFileSync(file(rel), utf8);
}

function write(rel, content) {
  const target = file(rel);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content.replace(/\r\n/g, "\n").replace(/\n{3,}$/g, "\n"), utf8);
}

function safeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function sprintNav(prefix = "") {
  return visible.map((item) => `          <a class="link" href="${prefix}${item.slug}.html">${item.nav}</a>`).join("\n");
}

function updateBlock(content, start, end, block) {
  const full = `${start}\n${block}\n${end}`;
  if (content.includes(start) && content.includes(end)) {
    return content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), full);
  }
  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH SPRINT NAV END -->";
  const nav = sprintNav(prefix);
  const updated = updateBlock(content, start, end, nav);
  if (updated) {
    content = updated;
  } else {
    const storyLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link" href="story.html">Story</a>`;
    const activeStoryLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link active" href="story.html">Story</a>`;
    const marker = content.includes(activeStoryLink) ? activeStoryLink : storyLink;
    const insert = `${marker}\n${start}\n${nav}\n${end}`;
    content = content.replace(marker, insert);
  }
  content = content
    .replace(/v0\.6\.4 story|v0\.6\.5 signal|v0\.6\.6 tour|v0\.6\.7 record|v0\.6\.8 workbench|v0\.6\.9 readiness|v0\.7\.0 invite|v0\.7\.1 questions|v0\.7\.2 outreach|v0\.7\.3 use cases|v0\.7\.4 founder/g, active.badge)
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

const sprintCss = `
:root {
  --bg: #fff7ea;
  --surface: #fffdf8;
  --ink: #1f1a17;
  --muted: #604638;
  --line: rgba(91, 70, 56, 0.16);
  --bhagwa: #d65a1f;
  --ochre: #a83e12;
  --gold: #e0a83b;
  --green: #145c4a;
  --indigo: #29335c;
  --soft-red: #fde8dd;
  --soft-green: #e8f0ea;
  --shadow: 0 18px 50px rgba(70, 36, 14, 0.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

a { color: inherit; text-decoration: none; }
button, textarea { font: inherit; }
button { cursor: pointer; }

.shell {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 22px 0 16px;
  border-bottom: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.brand img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 8px 22px rgba(214, 90, 31, 0.13);
}

.brand strong {
  display: block;
  font-size: 20px;
  line-height: 1.1;
  white-space: nowrap;
}

.brand span, .muted, .meta, .source-meta, .room-card span, .mini-card p, .sprint-step p {
  color: var(--muted);
}

.brand span, .meta, .source-meta {
  font-size: 13px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.link, .version, .button, .tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border-radius: 8px;
  font-weight: 850;
  white-space: nowrap;
}

.link {
  padding: 8px 10px;
  color: #432414;
}

.link.active, .version {
  border: 1px solid #efb899;
  color: var(--ochre);
  background: rgba(255, 253, 248, 0.74);
}

.version { padding: 8px 14px; }

.workspace {
  display: grid;
  grid-template-columns: 0.92fr 1.32fr 0.9fr;
  gap: 16px;
  padding: 20px 0 34px;
  align-items: start;
}

.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.84);
  padding: 18px;
  box-shadow: var(--shadow);
}

.panel.tight { box-shadow: none; }

.eyebrow, .badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border-radius: 999px;
  padding: 5px 10px;
  color: var(--ochre);
  background: var(--soft-red);
  font-size: 12px;
  font-weight: 900;
}

.badge.green {
  color: var(--green);
  background: var(--soft-green);
}

h1, h2, h3, p { margin-top: 0; }
h1 {
  margin: 18px 0 12px;
  font-size: clamp(42px, 6vw, 72px);
  line-height: 0.96;
  letter-spacing: 0;
}
h2 { margin-bottom: 12px; font-size: 26px; line-height: 1.08; }
h3 { margin-bottom: 6px; font-size: 17px; }

.room-list, .item-list, .grid, .metric-grid, .sprint-list {
  display: grid;
  gap: 10px;
}

.room-card, .item-card, .mini-card, .metric, .sprint-step {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.78);
  text-align: left;
}

.room-card {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 11px;
}

.room-card.active, .room-card:hover, .room-card:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.index-pill, .step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--soft-green);
  color: var(--green);
  font-size: 13px;
  font-weight: 900;
}

.room-card.active .index-pill, .sprint-step.active .step-index {
  background: var(--bhagwa);
  color: white;
}

.room-card strong, .room-card span:not(.index-pill) {
  display: block;
}

.room-card span:not(.index-pill) {
  font-size: 13px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 18px;
  align-items: center;
}

.mark-stage {
  border: 1px solid #f1d0bd;
  border-radius: 8px;
  background: #fff0df;
  padding: 10px;
}

.mark-stage img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.source-block {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
  padding: 14px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--bhagwa);
  border-radius: 8px;
  background: var(--surface);
}

.source-value {
  display: block;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.35;
}

.item-card {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
}

.item-card p { margin-bottom: 0; }

.tabs, .button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tabs {
  margin: 16px 0 12px;
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

.tab, .button {
  border: 1px solid #efb899;
  background: var(--surface);
  color: var(--ochre);
  padding: 9px 12px;
}

.tab.active, .button.primary {
  border-color: var(--bhagwa);
  background: var(--bhagwa);
  color: white;
}

.button.safe {
  border-color: #b9d3ca;
  color: #064f43;
}

.grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.mini-card {
  padding: 13px;
  border-left: 3px solid #f0a07d;
}

textarea {
  width: 100%;
  min-height: 170px;
  margin-top: 14px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.metric-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 12px 0;
}

.metric { padding: 12px; }
.metric span { display: block; color: var(--muted); font-size: 12px; }
.metric strong { display: block; margin-top: 5px; font-size: 25px; line-height: 1; }

.progress {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(168, 62, 18, 0.14);
}

.bar {
  width: var(--score);
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--bhagwa), var(--gold));
}

.sprint-step {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 12px;
}

.boundary {
  border-style: dashed;
  box-shadow: none;
}

@media (max-width: 1100px) {
  .workspace { grid-template-columns: 1fr; }
  .topbar { align-items: flex-start; flex-direction: column; }
  .nav { justify-content: flex-start; }
}

@media (max-width: 760px) {
  .shell { width: min(100% - 28px, 1240px); }
  .hero-grid, .source-block, .grid, .metric-grid { grid-template-columns: 1fr; }
  .mark-stage { max-width: 180px; }
  h1 { font-size: 44px; }
}
`;

const sprintJs = `
const data = JSON.parse(document.getElementById("room-data").textContent);
const state = { mode: "brief" };

function renderRooms() {
  const list = document.getElementById("roomList");
  list.innerHTML = data.rooms.map((room, index) => \`
    <a class="room-card \${room.slug === data.slug ? "active" : ""}" href="\${room.slug}.html">
      <span class="index-pill">\${index + 1}</span>
      <span>
        <strong>\${room.nav}</strong>
        <span>\${room.version}</span>
      </span>
    </a>
  \`).join("");
}

function renderItems() {
  document.getElementById("itemList").innerHTML = data.items.map((item, index) => \`
    <div class="item-card">
      <span class="index-pill">\${index + 1}</span>
      <div>
        <strong>\${item[0]}</strong>
        <p class="muted">\${item[1]}</p>
        <p>\${item[2]}</p>
      </div>
    </div>
  \`).join("");
}

function renderTabs() {
  [...document.querySelectorAll(".tab")].forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === state.mode);
    tab.addEventListener("click", () => {
      state.mode = tab.dataset.mode;
      renderMode();
      renderTabs();
    }, { once: true });
  });
}

function renderMode() {
  const rows = data.modes[state.mode] || data.modes.brief;
  document.getElementById("modePanel").innerHTML = \`
    <div class="grid">
      \${rows.map((row) => \`
        <div class="mini-card">
          <h3>\${row[0]}</h3>
          <p>\${row[1]}</p>
        </div>
      \`).join("")}
    </div>
  \`;
}

function briefText() {
  const featureTitle = data.title.replace(/^VedaPath\\s+/, "");
  return [
    \`VedaPath \${featureTitle}\`,
    \`Release: \${data.version}\`,
    \`Primary ask: \${data.primaryAsk}\`,
    \`Source candidate: \${data.source}\`,
    \`Text family: \${data.family}\`,
    \`Boundary: \${data.stance}\`,
    "",
    data.summary,
    "",
    ...data.items.map((item) => \`- \${item[0]}: \${item[1]}\`)
  ].join("\\n");
}

function jsonText() {
  return JSON.stringify({
    product: "VedaPath AI",
    release: data.version,
    feature: data.title,
    source_candidate: data.source,
    text_family: data.family,
    boundary: data.stance,
    primary_ask: data.primaryAsk,
    items: data.items.map((item) => ({ name: item[0], question: item[1], evidence: item[2] }))
  }, null, 2);
}

function boundaryText() {
  const rows = data.modes.boundary || [];
  return [
    \`VedaPath Boundary Handoff\`,
    \`Release: \${data.version}\`,
    \`Feature: \${data.title}\`,
    ...rows.map((row) => \`- \${row[0]}: \${row[1]}\`)
  ].join("\\n");
}

function setOutput(text, button, label) {
  const output = document.getElementById("output");
  output.value = text;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 900);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function render() {
  renderRooms();
  renderItems();
  renderTabs();
  renderMode();
  document.getElementById("output").value = briefText();
  document.getElementById("copyBrief").addEventListener("click", (event) => setOutput(briefText(), event.currentTarget, "Brief Copied"));
  document.getElementById("copyJson").addEventListener("click", (event) => setOutput(jsonText(), event.currentTarget, "JSON Copied"));
  document.getElementById("copyBoundary").addEventListener("click", (event) => setOutput(boundaryText(), event.currentTarget, "Boundary Copied"));
}

render();
`;

function pageHtml(item) {
  const rooms = visible.map(({ version, slug, nav }) => ({ version, slug, nav }));
  const data = { ...item, rooms };
  const activeClass = (slug) => item.slug === slug ? " active" : "";
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
${visible.map((room) => `          <a class="link${activeClass(room.slug)}" href="${room.slug}.html">${room.nav}</a>`).join("\n")}
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Ten-build sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Each room turns launch energy into one narrow, source-first product decision.</p>
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
          <span class="badge green">Sprint progress</span>
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
              <strong>${upto + 1}/10</strong>
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
              <div><strong>Arrive</strong><p>Name the product decision.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Source</strong><p>Anchor it to a careful source candidate.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Bound</strong><p>Say what this release must not claim.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Carry</strong><p>Leave with one founder action.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This room is a prototype planning surface. It does not create production storage, verified answers, reviewer approval, therapy, ritual instruction, or spiritual authority.</p>
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

${item.items.map((itemRow) => `- ${itemRow[0]}: ${itemRow[1]} ${itemRow[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${item.title.replace("VedaPath ", "")}](${item.slug}.html)\n- [${item.title.replace("VedaPath ", "")} Notes](docs/${docName(item)}.md)`).join("\n");
  const block = `<!-- VEDAPATH LAUNCH SPRINT LINKS START -->\n${links}\n<!-- VEDAPATH LAUNCH SPRINT LINKS END -->`;
  if (content.includes("<!-- VEDAPATH LAUNCH SPRINT LINKS START -->")) {
    content = content.replace(/<!-- VEDAPATH LAUNCH SPRINT LINKS START -->[\s\S]*?<!-- VEDAPATH LAUNCH SPRINT LINKS END -->/, block);
  } else {
    content = content.replace("- [Launch Story Notes](docs/LAUNCH_STORY_ROOM.md)", `- [Launch Story Notes](docs/LAUNCH_STORY_ROOM.md)\n${block}`);
  }
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus a [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${active.title.replace("VedaPath ", "")} with:`);
  const bulletBlock = visible.map((item) => `- ${item.title.replace("VedaPath ", "")}: ${item.summary}`).join("\n");
  const start = "<!-- VEDAPATH LAUNCH SPRINT FEATURES START -->";
  const end = "<!-- VEDAPATH LAUNCH SPRINT FEATURES END -->";
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${bulletBlock}\n${end}`);
  } else {
    content = content.replace("- Launch Story Room with audience variants, founder copy, social copy, reviewer ask, no-go claims, and source-first launch boundaries", `- Launch Story Room with audience variants, founder copy, social copy, reviewer ask, no-go claims, and source-first launch boundaries\n${start}\n${bulletBlock}\n${end}`);
  }
  write("README.md", content);
}

function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  content = content.replace(/^The v[^ ]+ release turns/m, `The ${active.version} release turns`);
  const features = visible.map((item) => `- ${item.title.replace("VedaPath ", "")}: ${item.summary}`).join("\n");
  const start = "<!-- VEDAPATH LAUNCH SPRINT NOTES START -->";
  const end = "<!-- VEDAPATH LAUNCH SPRINT NOTES END -->";
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${features}\n${end}`);
  } else {
    content = content.replace("- Launch Story Room with audience variants, founder copy, social copy, reviewer ask, no-go claims, and source-first launch boundaries", `- Launch Story Room with audience variants, founder copy, social copy, reviewer ask, no-go claims, and source-first launch boundaries\n${start}\n${features}\n${end}`);
  }
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const featureSummary = visible.map((item) => `- ${item.title.replace("VedaPath ", "")}: ${item.summary}`).join("\n");
  const listStart = "<!-- VEDAPATH LAUNCH SPRINT SUMMARY START -->";
  const listEnd = "<!-- VEDAPATH LAUNCH SPRINT SUMMARY END -->";
  if (content.includes(listStart)) {
    content = content.replace(new RegExp(`${escapeRegExp(listStart)}[\\s\\S]*?${escapeRegExp(listEnd)}`), `${listStart}\n${featureSummary}\n${listEnd}`);
  } else {
    content = content.replace("- user and scholar correction loops", `- user and scholar correction loops\n${listStart}\n${featureSummary}\n${listEnd}`);
  }
  const sections = visible.map((item, index) => `### ${48 + index}. ${item.title.replace("VedaPath ", "")}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable founder handoff

${item.title.replace("VedaPath ", "")} should never claim production storage, verified answers, reviewer approval, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  const start = "<!-- VEDAPATH LAUNCH SPRINT BLUEPRINT START -->";
  const end = "<!-- VEDAPATH LAUNCH SPRINT BLUEPRINT END -->";
  const block = `${start}\n${sections}\n${end}`;
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), block);
  } else {
    content = content.replace("## Product Personality", `${block}\n\n## Product Personality`);
  }
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function docName(item) {
  return item.title.replace("VedaPath ", "").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content.replace(/<a href="story\.html">Launch Story<\/a>(?![\s\S]*?Founder Console)/, `<a href="story.html">Launch Story</a> | <a href="founder.html">Founder Console</a>`);
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Clickable trusted MVP prototype with the launch sprint through ${active.title.replace("VedaPath ", "")}: ${visible.map((item) => item.title.replace("VedaPath ", "")).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Launch sprint progress: ${visible.length}/10 rooms complete. Remaining product work still needs production backend, real reviewer operations, and licensed audio decisions.</p>`);
  const nextLabel = future[0]?.version || "Founder direction";
  const nextText = future[0]?.title.replace("VedaPath ", "") || "Ten-build sprint complete. Next release waits for founder choice: backend, reviewers, audio, or launch refinement.";
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${nextLabel}</strong>
          <p>${nextText}</p>`);
  const phaseBlock = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${29 + index}: ${item.title.replace("VedaPath ", "")}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  const phaseStart = "            <!-- VEDAPATH LAUNCH SPRINT PHASES START -->";
  const phaseEnd = "            <!-- VEDAPATH LAUNCH SPRINT PHASES END -->";
  if (content.includes(phaseStart)) {
    content = content.replace(new RegExp(`${escapeRegExp(phaseStart)}[\\s\\S]*?${escapeRegExp(phaseEnd)}`), `${phaseStart}\n${phaseBlock}\n${phaseEnd}`);
  } else {
    content = content.replace(/            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 29: Production Implementation and Licensed Audio<\/strong>[\s\S]*?<\/article>/, `${phaseStart}\n${phaseBlock}\n${phaseEnd}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase ${29 + releases.length}: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`);
  }
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${active.title.replace("VedaPath ", "")}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + visible.at(-2).title.replace("VedaPath ", "") : "v0.6.4 Launch Story"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Ten-build sprint complete" : `${visible.length}/10 sprint rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep source, boundary, and prototype status visible.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, reviewer approval, therapy, ritual instruction, or licensed audio.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${future[0].title.replace("VedaPath ", "")}.` : "Stop for founder direction before the next product lane."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/100% trusted MVP prototype\. New: [\s\S]*?<\/p>/, `100% trusted MVP prototype. New: ${active.title.replace("VedaPath ", "")} completes sprint room ${visible.length}/10 with a source-first founder handoff.</p>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  const start = "          <!-- VEDAPATH LAUNCH SPRINT HOME START -->";
  const end = "          <!-- VEDAPATH LAUNCH SPRINT HOME END -->";
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${cards}\n${end}`);
  } else {
    content = content.replace(/          <section class="rail-panel">\s*<h2>Launch Story<\/h2>[\s\S]*?<\/section>/, (match) => `${match}\n\n${start}\n${cards}\n${end}`);
  }
  write("index.html", content);
}

function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">
            <h3>${item.title.replace("VedaPath ", "")}</h3>
            <p>${item.summary}</p>
          </div>`).join("\n");
  const start = "          <!-- VEDAPATH LAUNCH SPRINT FEATURES START -->";
  const end = "          <!-- VEDAPATH LAUNCH SPRINT FEATURES END -->";
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${cards}\n${end}`);
  } else {
    content = content.replace(/          <div class="feature">\s*<h3>Launch Story Room<\/h3>[\s\S]*?<\/div>/, (match) => `${match}\n${start}\n${cards}\n${end}`);
  }
  write("blueprint.html", content);
}

write("assets/vedapath-sprint.css", sprintCss.trim() + "\n");
write("assets/vedapath-sprint.js", sprintJs.trim() + "\n");

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}

const topLevelHtml = [
  "access.html", "bell.html", "blueprint.html", "bridge.html", "calm.html", "card.html", "circle.html",
  "compass.html", "consent.html", "daily.html", "dashboard.html", "drill.html", "eval.html", "evening.html",
  "feedback.html", "fixtures.html", "index.html", "launch.html", "ledger.html", "lens.html", "library.html",
  "life.html", "loop.html", "memory.html", "model.html", "morning.html", "passages.html", "passport.html",
  "path.html", "policy.html", "practice.html", "queue.html", "reply.html", "retrieval.html", "rhythm.html",
  "samvada.html", "sankalpa.html", "schema.html", "scholar.html", "seeds.html", "seva.html", "storage.html",
  "story.html", "voice.html"
];

for (const rel of topLevelHtml) {
  if (existsSync(file(rel))) addSprintNavToHtml(rel);
}
addSprintNavToHtml("brand/brand-board.html", "../");

updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();

console.log(`Generated launch sprint through ${active.version} (${visible.length}/10).`);
