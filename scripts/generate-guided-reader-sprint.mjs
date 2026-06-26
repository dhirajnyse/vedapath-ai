import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const passages = [
  {
    id: "bg-2-48",
    title: "Steadiness in Action",
    source_candidate: "Bhagavad Gita 2.48",
    text_family: "Bhagavad Gita | Smriti",
    category: "action and steadiness",
    level: "beginner",
    plain_meaning: "The passage is commonly read as an invitation to act with steadiness rather than becoming owned by success or failure.",
    beginner_note: "Start with the action in front of you. Let the result matter, but do not let it become your whole identity.",
    context_boundary: "This is a reflection candidate, not therapy, medical advice, ritual instruction, or a promise of instant peace.",
    reflection_question: "What is one duty I can do clearly today without turning the outcome into my identity?",
    carry_action: "Choose one small task and do it slowly, cleanly, and without checking for praise.",
    reviewer_note: "Needs translation edition, commentary lane, and source rights review before public answer use.",
    no_go: "Do not use this passage to shame people for grief, illness, exhaustion, or real-world constraints.",
    signals: ["action", "steadiness", "outcome", "calm", "duty"]
  },
  {
    id: "katha-1-2-1",
    title: "The Good and the Merely Pleasant",
    source_candidate: "Katha Upanishad 1.2.1",
    text_family: "Upanishad | Shruti",
    category: "choice and discernment",
    level: "curious learner",
    plain_meaning: "The passage is often read as a distinction between what is deeply good and what is only immediately pleasing.",
    beginner_note: "A calm path is not always the easy path. The first step is to name which choice gives depth, not just relief.",
    context_boundary: "This is a source-guided reflection, not moral policing, family advice, or spiritual authority.",
    reflection_question: "Which option before me feels pleasant now, and which option still feels clean tomorrow?",
    carry_action: "Delay one impulsive choice long enough to name the good you are protecting.",
    reviewer_note: "Needs Upanishad-specific commentary context and careful wording for modern ethical questions.",
    no_go: "Do not turn this into judgment of another person's life, relationship, health, or emergency decision.",
    signals: ["choice", "pleasant", "good", "discernment", "clarity"]
  },
  {
    id: "mundaka-1-1-4",
    title: "Two Kinds of Knowing",
    source_candidate: "Mundaka Upanishad 1.1.4",
    text_family: "Upanishad | Shruti",
    category: "knowledge and depth",
    level: "philosophy learner",
    plain_meaning: "The passage is often associated with a distinction between lower and higher forms of knowledge.",
    beginner_note: "Some learning gathers facts. Some learning changes how you stand in the world. VedaPath should help users see the difference.",
    context_boundary: "This is an educational layer, not a ranking of people, schools, faiths, or modern disciplines.",
    reflection_question: "What am I trying to collect, and what am I trying to understand?",
    carry_action: "Turn one broad question into a narrower source question before seeking an answer.",
    reviewer_note: "Needs Sanskrit terms, commentary variants, and category caution before deeper public use.",
    no_go: "Do not use this passage to dismiss science, scholarship, work skills, or practical knowledge.",
    signals: ["knowledge", "learning", "higher", "lower", "source"]
  },
  {
    id: "isha-1",
    title: "Held With Restraint",
    source_candidate: "Isha Upanishad 1",
    text_family: "Upanishad | Shruti",
    category: "restraint and belonging",
    level: "reflective reader",
    plain_meaning: "The passage is often approached as a meditation on living in the world without grasping at it as possession.",
    beginner_note: "The calm move is not escape. It is a different relationship with what you use, hold, and release.",
    context_boundary: "This is reflection support, not economic, legal, property, or renunciation advice.",
    reflection_question: "What am I holding so tightly that it has stopped serving the work?",
    carry_action: "Use one thing with care today, then leave it without needing it to define you.",
    reviewer_note: "Needs translation-rights review and school-specific interpretation boundaries.",
    no_go: "Do not use this passage to pressure someone to give up safety, money, shelter, or responsibility.",
    signals: ["restraint", "belonging", "release", "use", "world"]
  },
  {
    id: "taittiriya-1-11-1",
    title: "Conduct After Learning",
    source_candidate: "Taittiriya Upanishad 1.11.1",
    text_family: "Upanishad | Shruti",
    category: "ethics and conduct",
    level: "teacher or student",
    plain_meaning: "This passage is often used to frame conduct, respect, truthfulness, and responsibility after learning.",
    beginner_note: "Learning becomes visible through conduct. The next step is not more noise, but cleaner action.",
    context_boundary: "This is educational reflection, not legal advice, institutional policy, or social command.",
    reflection_question: "Where should my learning become visible in behavior today?",
    carry_action: "Choose one honest, respectful action that makes learning practical.",
    reviewer_note: "Needs careful handling because conduct instructions can be overextended into modern authority claims.",
    no_go: "Do not use this passage to override consent, law, safety, or personal boundaries.",
    signals: ["conduct", "truth", "respect", "learning", "teacher"]
  },
  {
    id: "bg-18-63",
    title: "Reflect and Choose",
    source_candidate: "Bhagavad Gita 18.63",
    text_family: "Bhagavad Gita | Smriti",
    category: "reflection and agency",
    level: "decision point",
    plain_meaning: "The passage is often read as honoring reflection and personal agency after instruction is given.",
    beginner_note: "A source can guide without replacing the person who must choose. That is the product posture too.",
    context_boundary: "This is a reflection candidate, not a command, oracle, or final authority over personal life.",
    reflection_question: "What have I heard clearly, and what choice is actually mine to make?",
    carry_action: "Write the next choice in one plain sentence, then take responsibility for one small step.",
    reviewer_note: "Needs commentary context because the speaker, setting, and theological frame matter.",
    no_go: "Do not use this passage to pretend every decision is easy, isolated, or free of real constraints.",
    signals: ["choice", "agency", "instruction", "reflection", "decision"]
  }
];

const releases = [
  {
    version: "v1.9.5",
    badge: "v1.9.5 reader shell",
    slug: "readerstart",
    nav: "Reader",
    title: "VedaPath Source Reader Shell",
    pageLabel: "Guided source reader",
    eyebrow: "Guided reading",
    h1: "Open one source slowly.",
    lead: "A reader shell that turns search results into a calm source-opening experience with source identity, plain meaning, and visible boundary.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Reader shell, not commentary authority.",
    progress: 91,
    next: "Passage Focus Lens",
    defaultPassage: "bg-2-48",
    primaryAsk: "Move from finding a source to opening it with a simple, bounded reader.",
    summary: "Source Reader Shell gives VedaPath the first calm reading surface after beta search.",
    items: [
      ["Passage picker", "A user can choose one source candidate before reading.", "Prevents scattered browsing."],
      ["Source card", "Citation, family, category, and boundary remain visible.", "Keeps trust close."],
      ["Plain meaning", "Beginner-friendly explanation appears before deeper layers.", "Keeps the path approachable."],
      ["No authority voice", "The page avoids guru, therapy, and command language.", "Protects product posture."]
    ]
  },
  {
    version: "v1.9.6",
    badge: "v1.9.6 focus lens",
    slug: "passagefocus",
    nav: "Focus",
    title: "VedaPath Passage Focus Lens",
    pageLabel: "Passage focus",
    eyebrow: "Focus lens",
    h1: "Let one passage hold the room.",
    lead: "A focus lens that keeps the selected source, family, level, and category stable while the user moves through reading layers.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Focus lens, not final interpretation.",
    progress: 92,
    next: "Meaning Layer Stack",
    defaultPassage: "katha-1-2-1",
    primaryAsk: "Keep source focus stable so the user does not get lost in features.",
    summary: "Passage Focus Lens makes the reader feel simple by anchoring every action to one chosen passage.",
    items: [
      ["Stable selection", "The selected passage remains visible across modes.", "Reduces cognitive load."],
      ["Category cue", "The source family and category are never hidden.", "Prevents category confusion."],
      ["Level cue", "Beginner, learner, or decision-point mode is explicit.", "Supports progressive depth."],
      ["Focus warning", "The UI says what the lens cannot conclude.", "Prevents overclaim."]
    ]
  },
  {
    version: "v1.9.7",
    badge: "v1.9.7 meaning",
    slug: "meaninglayers",
    nav: "Meaning",
    title: "VedaPath Meaning Layer Stack",
    pageLabel: "Meaning layers",
    eyebrow: "Meaning layers",
    h1: "Make meaning layered, not loud.",
    lead: "A meaning stack that separates plain meaning, beginner note, context boundary, reviewer note, and no-go caution.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Meaning stack, not Sanskrit commentary replacement.",
    progress: 93,
    next: "Context Boundary Gate",
    defaultPassage: "mundaka-1-1-4",
    primaryAsk: "Separate plain meaning from context, caution, and review need.",
    summary: "Meaning Layer Stack gives VedaPath a readable pattern for depth without overwhelming beginners.",
    items: [
      ["Plain meaning", "A short paraphrase comes first.", "Keeps reading usable."],
      ["Beginner note", "Modern personal language is clearly marked.", "Keeps source and reflection separate."],
      ["Reviewer note", "Deeper claims are deferred to review.", "Protects accuracy."],
      ["No-go caution", "Misuse is named near the meaning.", "Keeps boundaries alive."]
    ]
  },
  {
    version: "v1.9.8",
    badge: "v1.9.8 context gate",
    slug: "contextgate",
    nav: "Context",
    title: "VedaPath Context Boundary Gate",
    pageLabel: "Context gate",
    eyebrow: "Context boundary",
    h1: "Keep context beside comfort.",
    lead: "A context gate that shows where the source can support reflection and where the product must refuse authority, therapy, or life-command claims.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Context gate, not safety certification.",
    progress: 94,
    next: "Reflection Prompt Rail",
    defaultPassage: "isha-1",
    primaryAsk: "Let calm UX carry serious boundaries without making the page feel cold.",
    summary: "Context Boundary Gate keeps personal calm work source-backed but carefully limited.",
    items: [
      ["Boundary card", "The reader says what the source candidate cannot do.", "Avoids false reassurance."],
      ["No-go line", "Misuse is visible in plain language.", "Protects vulnerable users."],
      ["Source context", "Family and candidate citation remain present.", "Keeps reflection anchored."],
      ["Refusal path", "Sensitive overclaims lead to a careful stop.", "Keeps trust intact."]
    ]
  },
  {
    version: "v1.9.9",
    badge: "v1.9.9 reflect",
    slug: "reflectionrail",
    nav: "Reflect",
    title: "VedaPath Reflection Prompt Rail",
    pageLabel: "Reflection rail",
    eyebrow: "Reflection prompt",
    h1: "Ask one question, not ten.",
    lead: "A reflection rail that offers exactly one clean question from the selected passage and keeps it separate from translation, commentary, and advice.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Reflection rail, not therapy or diagnosis.",
    progress: 95,
    next: "Carry Action Builder",
    defaultPassage: "taittiriya-1-11-1",
    primaryAsk: "Turn source reading into one honest reflection without pressure.",
    summary: "Reflection Prompt Rail turns calm into a product behavior: one question, one source, one boundary.",
    items: [
      ["One question", "The reader avoids a crowded self-help worksheet.", "Keeps calmness real."],
      ["Reflection label", "The prompt is marked as reflection, not scripture meaning.", "Protects categories."],
      ["User agency", "The question invites choice rather than command.", "Avoids guru voice."],
      ["Review need", "Complex interpretation is not hidden.", "Protects depth."]
    ]
  },
  {
    version: "v2.0.0",
    badge: "v2.0.0 carry",
    slug: "carrybuilder",
    nav: "Carry",
    title: "VedaPath Carry Action Builder",
    pageLabel: "Carry action",
    eyebrow: "Carry action",
    h1: "Leave with one clean action.",
    lead: "A carry builder that turns a source reflection into one small action while refusing prescriptions, therapy claims, and ritual authority.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Carry action, not life prescription.",
    progress: 96,
    next: "Session Memory Preview",
    defaultPassage: "bg-18-63",
    primaryAsk: "Make the reader useful in daily life without pretending to decide for the user.",
    summary: "Carry Action Builder gives VedaPath a signature calm handoff from reading to grounded action.",
    items: [
      ["Small action", "The action is intentionally modest.", "Protects agency."],
      ["Source tie", "The action stays connected to the selected source candidate.", "Prevents generic advice."],
      ["No command", "The wording avoids pretending the app knows the user's life.", "Keeps humility."],
      ["Copy handoff", "The action can be copied with source and boundary.", "Supports practice."]
    ]
  },
  {
    version: "v2.0.1",
    badge: "v2.0.1 memory",
    slug: "readmemory",
    nav: "Memory",
    title: "VedaPath Reader Memory Preview",
    pageLabel: "Reader memory",
    eyebrow: "Device-local memory",
    h1: "Remember the rhythm, not the person.",
    lead: "A device-local memory preview that saves completed reading sessions in the browser so the loop can be tested before accounts or sync.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Local memory preview, not account history.",
    progress: 97,
    next: "Reviewer Trace Handoff",
    defaultPassage: "bg-2-48",
    primaryAsk: "Test reading rhythm with browser-only memory and a clear privacy boundary.",
    summary: "Reader Memory Preview lets VedaPath test habit loops without pretending to have durable user accounts.",
    items: [
      ["Local save", "Reading sessions stay in this browser only.", "Protects privacy."],
      ["Streak preview", "Session count and last passage are visible.", "Tests habit value."],
      ["Clear control", "The user can clear preview memory.", "Keeps control local."],
      ["No profile claim", "The app does not infer identity or spirituality.", "Avoids hidden profiling."]
    ]
  },
  {
    version: "v2.0.2",
    badge: "v2.0.2 trace",
    slug: "tracehandoff",
    nav: "Trace",
    title: "VedaPath Reviewer Trace Handoff",
    pageLabel: "Reviewer trace",
    eyebrow: "Reviewer trace",
    h1: "Make every reading reviewable.",
    lead: "A trace handoff that copies source candidate, layer, prompt, carry action, no-go boundary, and reviewer note into one compact review packet.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Trace handoff, not submitted ticket.",
    progress: 98,
    next: "Mobile Reader Polish",
    defaultPassage: "katha-1-2-1",
    primaryAsk: "Turn reader behavior into reviewable product evidence.",
    summary: "Reviewer Trace Handoff connects the reader experience to future human review without claiming workflow automation.",
    items: [
      ["Trace packet", "Source, prompt, action, and no-go line copy together.", "Makes review easier."],
      ["Reviewer note", "Open review needs are not hidden.", "Protects accuracy."],
      ["No ticket claim", "Copying is not a submitted workflow.", "Keeps scope honest."],
      ["Boundary reuse", "The no-go line travels with the packet.", "Prevents context loss."]
    ]
  },
  {
    version: "v2.0.3",
    badge: "v2.0.3 reader mobile",
    slug: "readermobile",
    nav: "Mobile",
    title: "VedaPath Mobile Reader Polish",
    pageLabel: "Mobile reader",
    eyebrow: "Mobile reader",
    h1: "Keep the reader calm in one hand.",
    lead: "A mobile polish pass that keeps passage choice, source card, layer controls, memory, and handoff readable on phone-size screens.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Responsive reader polish, not native app release.",
    progress: 99,
    next: "Guided Source Reader Control Room",
    defaultPassage: "isha-1",
    primaryAsk: "Protect the simplicity promise on mobile before the reader becomes more powerful.",
    summary: "Mobile Reader Polish keeps VedaPath's most personal reading flow clean on small screens.",
    items: [
      ["Single column", "The reader stacks without horizontal overflow.", "Keeps mobile calm."],
      ["Stable actions", "Save, copy, and clear controls remain obvious.", "Prevents frustration."],
      ["Readable layers", "Meaning, boundary, reflection, and carry cards are scannable.", "Protects depth."],
      ["No crowding", "The logo and cards support focus rather than decoration.", "Keeps attention steady."]
    ]
  },
  {
    version: "v2.0.4",
    badge: "v2.0.4 reader",
    slug: "sourcereader",
    nav: "Control",
    title: "VedaPath Guided Source Reader Control Room",
    pageLabel: "Guided source reader",
    eyebrow: "Reader control",
    h1: "Open one source slowly, then carry one action calmly.",
    lead: "A control room for guided source reading: passage choice, source identity, plain meaning, boundary, reflection, carry action, local rhythm, and reviewer handoff.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Guided reader control, not final commentary or personal authority.",
    progress: 100,
    next: "Founder instruction",
    defaultPassage: "bg-2-48",
    primaryAsk: "Choose whether the next sprint turns the reader into reviewed content, accounts, or public beta onboarding.",
    summary: "Guided Source Reader Control Room completes the reader sprint and makes VedaPath feel like a real source-first learning companion.",
    items: [
      ["Reader path", "Choose a passage, read layers, reflect, and carry one action.", "Makes the product feel alive."],
      ["Trust path", "Source family, boundary, reviewer note, and no-go line stay visible.", "Protects credibility."],
      ["Rhythm path", "Device-local saved sessions test habit value without accounts.", "Protects privacy."],
      ["Review path", "Copyable trace handoff prepares the next human review loop.", "Supports growth."]
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
      ["Reader promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No commentary claim", "Do not imply final interpretation, school consensus, or Sanskrit authority."],
      ["No therapy claim", "Do not frame source reflection as medical care, emergency support, diagnosis, or mental health treatment."],
      ["No life-command claim", "Do not present VedaPath as a guru, oracle, ritual authority, family authority, or replacement for teachers and tradition."]
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
  const start = "          <!-- VEDAPATH GUIDED READER SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH GUIDED READER SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV END -->", `          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("<span class=\"version\">")) {
    content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  }
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

function passageData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "guided source reader prototype",
    warning: "Prototype passage candidates only. No full scripture text, final commentary, therapy, ritual instruction, or spiritual authority.",
    passages
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
    <link rel="stylesheet" href="assets/vedapath-source-reader.css">
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
          <a class="link" href="searchconsole.html">Search</a>
          <!-- VEDAPATH GUIDED READER SPRINT NAV START -->
${sprintNav("", `${item.slug}.html`)}
          <!-- VEDAPATH GUIDED READER SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Guided source reader sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten focused rooms turn beta search into a calm source-opening reader.</p>
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

          <section class="source-reader" id="sourceReader" data-default-passage="${item.defaultPassage}" aria-label="Guided source reader">
            <div class="reader-head">
              <div>
                <span class="eyebrow">Source-first reader</span>
                <h2>Guided Source Reader</h2>
                <p class="muted">Reads <strong>data/vedapath-reader-passages.json</strong>. Passage candidates are paraphrase-level prototypes until reviewed.</p>
              </div>
              <div id="readerStats" class="reader-stats" aria-live="polite"></div>
            </div>
            <div class="reader-layout">
              <div>
                <label class="reader-label" for="passageSelect">Choose source candidate</label>
                <select id="passageSelect" class="reader-select"></select>
                <div class="passage-list" id="passageList" aria-label="Passage candidates"></div>
              </div>
              <div>
                <div id="readerSourceCard" class="reader-source-card"></div>
                <div class="reader-tabs" id="readerTabs" role="tablist" aria-label="Reader layers"></div>
                <div id="readerLayer" class="reader-layer"></div>
                <div class="reader-actions">
                  <button class="button primary" id="saveReading" type="button">Save Reading</button>
                  <button class="button safe" id="copyReaderHandoff" type="button">Copy Handoff</button>
                  <button class="button" id="clearReaderMemory" type="button">Clear Local Preview</button>
                </div>
                <label class="reader-label" for="readerHandoff">Reader handoff preview</label>
                <textarea id="readerHandoff" readonly aria-label="Reader handoff output"></textarea>
              </div>
            </div>
          </section>

          <h2>Reader Signals</h2>
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
          <span class="badge green">Guided reader</span>
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
              <div><strong>Choose</strong><p>Pick one source candidate.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Read</strong><p>Separate meaning and boundary.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Reflect</strong><p>Answer one clean question.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Carry</strong><p>Leave with one small action.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Reader Boundary</h2>
            <p class="muted">This is a guided source-reader prototype. It is not full scripture text, final commentary, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-source-reader.js"></script>
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

## Reader Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-reader-passages.json
- data/vedapath-beta-seed.json

## No-Go Boundary

This release should not imply final commentary, full scripture text, translation rights, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
`;
}

function writeReaderAssets() {
  write("data/vedapath-reader-passages.json", `${safeJson(passageData())}\n`);
  write("assets/vedapath-source-reader.css", `/* VedaPath guided source reader */
.source-reader {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.88);
}

.reader-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 260px);
  gap: 14px;
  align-items: start;
}

.reader-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.reader-stat,
.passage-card,
.reader-source-card,
.reader-layer-card,
.memory-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.reader-stat {
  padding: 10px;
}

.reader-stat span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.reader-stat strong {
  display: block;
  font-size: 22px;
  line-height: 1.1;
}

.reader-layout {
  display: grid;
  grid-template-columns: minmax(210px, 0.82fr) minmax(0, 1.18fr);
  gap: 14px;
  align-items: start;
}

.reader-label {
  display: block;
  margin: 14px 0 6px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 850;
}

.reader-select {
  width: 100%;
  min-height: 42px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px 12px;
  font-weight: 800;
}

.passage-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.passage-card {
  width: 100%;
  padding: 11px;
  text-align: left;
  color: inherit;
}

.passage-card.active,
.passage-card:hover,
.passage-card:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.passage-card strong,
.passage-card span {
  display: block;
}

.passage-card span {
  color: var(--muted);
  font-size: 12px;
}

.reader-source-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
  padding: 12px;
  border-left: 4px solid var(--bhagwa);
}

.reader-source-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.reader-source-card strong {
  display: block;
  line-height: 1.2;
}

.reader-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.reader-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid #efb899;
  border-radius: 8px;
  background: var(--surface);
  color: var(--ochre);
  padding: 7px 10px;
  font-weight: 850;
}

.reader-tab.active {
  background: var(--bhagwa);
  border-color: var(--bhagwa);
  color: white;
}

.reader-layer {
  display: grid;
  gap: 10px;
}

.reader-layer-card,
.memory-card {
  padding: 13px;
}

.reader-layer-card.accent {
  border-left: 4px solid var(--green);
}

.reader-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

#readerHandoff {
  width: 100%;
  min-height: 160px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
}

.memory-list {
  display: grid;
  gap: 8px;
}

@media (max-width: 860px) {
  .reader-head,
  .reader-layout,
  .reader-source-card,
  .reader-stats {
    grid-template-columns: 1fr;
  }

  .reader-actions .button,
  .reader-tab {
    width: 100%;
  }
}
`);

  write("assets/vedapath-source-reader.js", `const sourceReaderRoot = document.getElementById("sourceReader");

if (sourceReaderRoot) {
  initSourceReader().catch((error) => {
    sourceReaderRoot.innerHTML = '<p class="muted">Reader preview could not load passage candidates.</p>';
    console.error(error);
  });
}

async function readerLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function readerText(value) {
  return value === 0 ? "0" : String(value || "");
}

function readerSafe(value) {
  return readerText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function storageKey() {
  return "vedapath-source-reader-sessions";
}

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeSessions(sessions) {
  localStorage.setItem(storageKey(), JSON.stringify(sessions.slice(0, 14)));
}

function handoffText(passage, mode, sessions) {
  return [
    "VedaPath Guided Source Reader Handoff",
    "Source candidate: " + passage.source_candidate,
    "Text family: " + passage.text_family,
    "Category: " + passage.category,
    "Layer: " + mode,
    "Reflection: " + passage.reflection_question,
    "Carry action: " + passage.carry_action,
    "Reviewer note: " + passage.reviewer_note,
    "No-go: " + passage.no_go,
    "Saved local sessions: " + sessions.length,
    "",
    "Boundary: prototype reader only; not full scripture text, final commentary, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\\n");
}

function renderReaderStats(root, passages, betaRecords, sessions, passage) {
  const last = sessions[0] ? sessions[0].title : "None";
  root.querySelector("#readerStats").innerHTML = [
    ["Passages", passages.length],
    ["Seed records", betaRecords.length],
    ["Saved", sessions.length],
    ["Last", last]
  ].map((row) => '<div class="reader-stat"><span>' + readerSafe(row[0]) + '</span><strong>' + readerSafe(row[1]) + '</strong></div>').join("");
}

function layerRows(passage, mode, sessions) {
  const rows = {
    source: [
      ["Source identity", passage.source_candidate],
      ["Family", passage.text_family],
      ["Category", passage.category],
      ["Level", passage.level]
    ],
    meaning: [
      ["Plain meaning", passage.plain_meaning],
      ["Beginner note", passage.beginner_note],
      ["Reviewer note", passage.reviewer_note]
    ],
    boundary: [
      ["Context boundary", passage.context_boundary],
      ["No-go line", passage.no_go],
      ["Product stance", "Reflection support, not authority."]
    ],
    reflect: [
      ["One clean question", passage.reflection_question],
      ["Carry into life", passage.carry_action]
    ],
    memory: [
      ["Saved sessions", String(sessions.length)],
      ["Latest passage", sessions[0] ? sessions[0].title : "No local sessions yet."],
      ["Privacy", "Saved only in this browser preview until real accounts and consent exist."]
    ]
  };
  return rows[mode] || rows.meaning;
}

async function initSourceReader() {
  const passageData = await readerLoadJson("data/vedapath-reader-passages.json");
  const betaData = await readerLoadJson("data/vedapath-beta-seed.json");
  const passages = passageData.passages || [];
  const betaRecords = betaData.records || [];
  const select = sourceReaderRoot.querySelector("#passageSelect");
  const passageList = sourceReaderRoot.querySelector("#passageList");
  const sourceCard = sourceReaderRoot.querySelector("#readerSourceCard");
  const tabsNode = sourceReaderRoot.querySelector("#readerTabs");
  const layerNode = sourceReaderRoot.querySelector("#readerLayer");
  const handoff = sourceReaderRoot.querySelector("#readerHandoff");
  const state = {
    passageId: sourceReaderRoot.dataset.defaultPassage || (passages[0] && passages[0].id),
    mode: "meaning"
  };
  const tabs = [
    ["source", "Source"],
    ["meaning", "Meaning"],
    ["boundary", "Boundary"],
    ["reflect", "Reflect"],
    ["memory", "Memory"]
  ];

  select.innerHTML = passages.map((passage) => (
    '<option value="' + readerSafe(passage.id) + '">' + readerSafe(passage.source_candidate + " - " + passage.title) + '</option>'
  )).join("");

  function selectedPassage() {
    return passages.find((passage) => passage.id === state.passageId) || passages[0];
  }

  function renderPassageList(passage) {
    passageList.innerHTML = passages.map((item) => (
      '<button class="passage-card' + (item.id === passage.id ? ' active' : '') + '" type="button" data-passage-id="' + readerSafe(item.id) + '">' +
        '<strong>' + readerSafe(item.title) + '</strong>' +
        '<span>' + readerSafe(item.source_candidate) + '</span>' +
        '<span>' + readerSafe(item.text_family) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderSourceCard(passage) {
    sourceCard.innerHTML = [
      ["Source", passage.source_candidate],
      ["Family", passage.text_family],
      ["Category", passage.category],
      ["Boundary", passage.context_boundary]
    ].map((row) => '<div><span>' + readerSafe(row[0]) + '</span><strong>' + readerSafe(row[1]) + '</strong></div>').join("");
  }

  function renderTabs() {
    tabsNode.innerHTML = tabs.map((tab) => (
      '<button class="reader-tab' + (tab[0] === state.mode ? ' active' : '') + '" type="button" data-reader-mode="' + tab[0] + '">' + tab[1] + '</button>'
    )).join("");
  }

  function renderLayer(passage, sessions) {
    const rows = layerRows(passage, state.mode, sessions);
    const cards = rows.map((row, index) => (
      '<article class="reader-layer-card' + (index === 0 ? ' accent' : '') + '">' +
        '<h3>' + readerSafe(row[0]) + '</h3>' +
        '<p>' + readerSafe(row[1]) + '</p>' +
      '</article>'
    )).join("");
    const memory = state.mode === "memory" ? '<div class="memory-list">' + sessions.slice(0, 4).map((session) => (
      '<article class="memory-card"><strong>' + readerSafe(session.title) + '</strong><p class="muted">' + readerSafe(session.source) + ' | ' + readerSafe(session.date) + '</p></article>'
    )).join("") + '</div>' : "";
    layerNode.innerHTML = cards + memory;
  }

  function render() {
    const passage = selectedPassage();
    const sessions = readSessions();
    select.value = passage.id;
    renderReaderStats(sourceReaderRoot, passages, betaRecords, sessions, passage);
    renderPassageList(passage);
    renderSourceCard(passage);
    renderTabs();
    renderLayer(passage, sessions);
    handoff.value = handoffText(passage, state.mode, sessions);
  }

  select.addEventListener("change", () => {
    state.passageId = select.value;
    render();
  });

  passageList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-passage-id]");
    if (!button) return;
    state.passageId = button.dataset.passageId;
    render();
  });

  tabsNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reader-mode]");
    if (!button) return;
    state.mode = button.dataset.readerMode;
    render();
  });

  sourceReaderRoot.querySelector("#saveReading").addEventListener("click", () => {
    const passage = selectedPassage();
    const sessions = readSessions();
    sessions.unshift({
      title: passage.title,
      source: passage.source_candidate,
      date: new Date().toISOString().slice(0, 10)
    });
    writeSessions(sessions);
    render();
  });

  sourceReaderRoot.querySelector("#clearReaderMemory").addEventListener("click", () => {
    localStorage.removeItem(storageKey());
    render();
  });

  sourceReaderRoot.querySelector("#copyReaderHandoff").addEventListener("click", () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(handoff.value).catch(() => {});
    }
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
    "<!-- VEDAPATH GUIDED READER SPRINT LINKS START -->",
    "<!-- VEDAPATH GUIDED READER SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH GUIDED READER SPRINT FEATURES START -->",
    "<!-- VEDAPATH GUIDED READER SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH GUIDED READER SPRINT NOTES START -->",
    "<!-- VEDAPATH GUIDED READER SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH GUIDED READER SPRINT SUMMARY START -->",
    "<!-- VEDAPATH GUIDED READER SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${178 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep the reader prototype browser-only until reviewed content, accounts, or backend storage are approved

${shortTitle(item)} should never claim final commentary, full scripture text, translation rights, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH GUIDED READER SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH GUIDED READER SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH INTERACTIVE SEARCH SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="sourcereader.html">Reader</a>')) {
    content = content.replace('href="searchconsole.html">Search</a>', 'href="searchconsole.html">Search</a> | <a href="sourcereader.html">Reader</a>');
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Guided source reader sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>Guided reader sprint progress: ${visible.length}/10 rooms complete. Search can now become a source-opening reader.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${Math.min(100, 60 + visible.length)}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${Math.min(100, 60 + visible.length)}%"></div></div>
          <p>Guided reader path: source shell, focus lens, meaning layers, context gate, reflection rail, carry action, memory preview, trace handoff, and mobile polish are now mapped.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Guided source reader sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${159 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH GUIDED READER SPRINT PHASES START -->",
    "            <!-- VEDAPATH GUIDED READER SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH INTERACTIVE SEARCH SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${159 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v1.9.4 Interactive Beta Search Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Guided source reader sprint complete" : `${visible.length}/10 guided reader rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: choose one passage, read layers, reflect once, carry one action, save locally, copy reviewer trace.</span></li>
              <li><span class="dot"></span><span>Do not claim final commentary, full scripture text, therapy, diagnosis, ritual instruction, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing reviewed content, accounts, or public beta onboarding."}</span></li>
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
    "          <!-- VEDAPATH GUIDED READER SPRINT HOME START -->",
    "          <!-- VEDAPATH GUIDED READER SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT HOME END -->"
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
    "          <!-- VEDAPATH GUIDED READER SPRINT FEATURES START -->",
    "          <!-- VEDAPATH GUIDED READER SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH INTERACTIVE SEARCH SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeReaderAssets();

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

console.log(`Generated guided-reader sprint through ${active.version} (${visible.length}/10).`);
