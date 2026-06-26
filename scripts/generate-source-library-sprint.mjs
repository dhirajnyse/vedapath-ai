import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const sourceRecords = [
  {
    id: "bg-2-48-steadiness",
    title: "Steadiness In Action",
    source: "Bhagavad Gita 2.48",
    source_family: "Bhagavad Gita | Smriti",
    tradition_layer: "Itihasa context",
    theme: "steady action",
    readiness: "preview-ready",
    review_state: "reviewed-preview",
    rights_state: "citation-only plus paraphrase",
    score: 84,
    source_note: "Useful for calm action language when the product keeps it as reflection support, not therapy or guaranteed peace.",
    answer_boundary: "Do not promise serenity, diagnosis, treatment, ritual authority, or guaranteed results.",
    translation_policy: "Show citation and summary; keep direct translation text out until rights are approved.",
    review_notes: "Connects to karma-yoga and non-attachment to results, but the answer must avoid flattening the tradition.",
    question_examples: [
      "How can I act calmly when results feel uncertain?",
      "What does the Gita suggest about steady effort?"
    ],
    tags: ["calm", "action", "agency"]
  },
  {
    id: "bg-18-63-agency",
    title: "Reflect And Choose",
    source: "Bhagavad Gita 18.63",
    source_family: "Bhagavad Gita | Smriti",
    tradition_layer: "Itihasa context",
    theme: "agency",
    readiness: "needs-review",
    review_state: "source-review",
    rights_state: "citation-only",
    score: 72,
    source_note: "Strong for agency language, but it needs speaker and battlefield-context notes before public use.",
    answer_boundary: "Do not imply every life choice is simple, isolated, or free from real constraints.",
    translation_policy: "Use citation, context note, and paraphrase-level summary only.",
    review_notes: "Needs theological context and a boundary against oracle-like decision making.",
    question_examples: [
      "How do I make a difficult decision without outsourcing it?",
      "Can scripture help me choose without telling me what to do?"
    ],
    tags: ["agency", "choice", "responsibility"]
  },
  {
    id: "katha-1-2-1-discernment",
    title: "Good And Pleasant Gate",
    source: "Katha Upanishad 1.2.1",
    source_family: "Upanishad | Shruti",
    tradition_layer: "Upanishadic teaching",
    theme: "discernment",
    readiness: "needs-review",
    review_state: "boundary-review",
    rights_state: "citation-only",
    score: 69,
    source_note: "Good candidate for discernment, but it can become judgmental if the product overreaches.",
    answer_boundary: "Do not use for moral policing, relationship advice, emergency decisions, or shame.",
    translation_policy: "Keep citation and concept summary until translation-rights and commentary lane are reviewed.",
    review_notes: "Needs gentle explanation of shreyas and preyas without turning them into labels for people.",
    question_examples: [
      "How do I tell short-term comfort from a deeper good?",
      "What is a calm way to think about discernment?"
    ],
    tags: ["discernment", "choice", "upanishad"]
  },
  {
    id: "mundaka-1-1-4-knowledge",
    title: "Two Kinds Of Knowing",
    source: "Mundaka Upanishad 1.1.4",
    source_family: "Upanishad | Shruti",
    tradition_layer: "Upanishadic teaching",
    theme: "knowledge",
    readiness: "draft",
    review_state: "category-review",
    rights_state: "citation-only",
    score: 63,
    source_note: "Useful for explaining layers of knowledge, but easy to misuse as anti-science or anti-scholarship.",
    answer_boundary: "Do not frame higher and lower knowledge as a ranking of people, disciplines, or modern science.",
    translation_policy: "Use source label and concept summary; no direct quotation until rights review is complete.",
    review_notes: "Needs Sanskrit term review and commentary differences before broad public answers.",
    question_examples: [
      "What does Hindu philosophy mean by different kinds of knowledge?",
      "How can I study deeply without dismissing practical knowledge?"
    ],
    tags: ["knowledge", "study", "category"]
  },
  {
    id: "isha-1-restraint",
    title: "Restraint Without Withdrawal",
    source: "Isha Upanishad 1",
    source_family: "Upanishad | Shruti",
    tradition_layer: "Upanishadic teaching",
    theme: "restraint",
    readiness: "rights-hold",
    review_state: "rights-review",
    rights_state: "restricted-text-hold",
    score: 58,
    source_note: "High-value source, but public display needs careful rights and interpretation handling.",
    answer_boundary: "Do not pressure users to abandon safety, property, shelter, responsibility, or family duties.",
    translation_policy: "Citation-only until an approved translation and paraphrase policy are selected.",
    review_notes: "Needs rights gate and school-specific interpretation boundary.",
    question_examples: [
      "How can I practice restraint without escaping responsibility?",
      "What does non-possessiveness mean in daily life?"
    ],
    tags: ["restraint", "rights", "responsibility"]
  },
  {
    id: "taittiriya-1-11-1-conduct",
    title: "Conduct After Learning",
    source: "Taittiriya Upanishad 1.11.1",
    source_family: "Upanishad | Shruti",
    tradition_layer: "Upanishadic instruction",
    theme: "conduct",
    readiness: "needs-review",
    review_state: "authority-review",
    rights_state: "citation-only",
    score: 61,
    source_note: "Useful for duty and conduct, but it must not become command language in the product.",
    answer_boundary: "Do not override consent, law, safety, personal boundaries, or local professional guidance.",
    translation_policy: "Use citation and educational summary only until authority boundary is approved.",
    review_notes: "Needs careful voice rules so it remains learning support, not social control.",
    question_examples: [
      "What does tradition say about conduct after learning?",
      "How do I carry learning into daily behavior without becoming rigid?"
    ],
    tags: ["conduct", "duty", "authority"]
  },
  {
    id: "chandogya-6-8-7-identity",
    title: "Self And Being Context",
    source: "Chandogya Upanishad 6.8.7",
    source_family: "Upanishad | Shruti",
    tradition_layer: "Upanishadic teaching",
    theme: "self inquiry",
    readiness: "draft",
    review_state: "commentary-review",
    rights_state: "citation-only",
    score: 57,
    source_note: "Important identity teaching, but it needs commentary lanes before simplified answer use.",
    answer_boundary: "Do not collapse complex metaphysics into self-esteem slogans or psychological advice.",
    translation_policy: "Citation and topic map only until translation and commentary view are approved.",
    review_notes: "Needs Advaita and other interpretation lanes before public comparison.",
    question_examples: [
      "What is the context of the famous self-teaching in the Upanishads?",
      "How should beginners approach Atman and Brahman carefully?"
    ],
    tags: ["self", "being", "commentary"]
  },
  {
    id: "rigveda-1-164-46-many-names",
    title: "Many Names Context",
    source: "Rigveda 1.164.46",
    source_family: "Veda | Shruti",
    tradition_layer: "Vedic hymn",
    theme: "plural expression",
    readiness: "needs-review",
    review_state: "source-review",
    rights_state: "citation-only",
    score: 66,
    source_note: "Often used in modern pluralism discussions, but the product should avoid oversimplified slogans.",
    answer_boundary: "Do not use as proof that every tradition says the same thing or that debate does not matter.",
    translation_policy: "Citation-only until translation rights and scholarly context are selected.",
    review_notes: "Needs Vedic hymn context and careful separation from modern analogy.",
    question_examples: [
      "Does the Rigveda support religious pluralism?",
      "How should I understand many names without flattening difference?"
    ],
    tags: ["veda", "plurality", "context"]
  }
];

const releases = [
  {
    version: "v2.1.5",
    badge: "v2.1.5 source shelf",
    slug: "sourceshelf",
    nav: "Shelf",
    title: "VedaPath Source Shelf Intake",
    pageLabel: "Source shelf",
    eyebrow: "Source shelf",
    h1: "Give every answer a source shelf.",
    lead: "A calm intake room for the first curated source records: citation, family, theme, rights state, readiness, and boundary in one place.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Source shelf prototype, not canonical database.",
    sprintPercent: 10,
    defaultFamily: "all",
    defaultReadiness: "all",
    next: "Citation Schema Desk",
    primaryAsk: "Turn trusted answer ideas into structured source records.",
    summary: "Source Shelf Intake starts the curated source layer that future retrieval can trust.",
    items: [
      ["Source record", "Each passage candidate gets a stable id, citation, family, theme, and readiness.", "Prevents loose notes."],
      ["Boundary attached", "Every record carries what the answer must not claim.", "Protects user trust."],
      ["Rights state", "Display limits are visible before the answer uses text.", "Avoids accidental misuse."],
      ["Simple shelf", "The UI stays scan-first and calm.", "Keeps founder review fast."]
    ]
  },
  {
    version: "v2.1.6",
    badge: "v2.1.6 citation schema",
    slug: "citationschema",
    nav: "Schema",
    title: "VedaPath Citation Schema Desk",
    pageLabel: "Citation schema",
    eyebrow: "Citation schema",
    h1: "Make citation a product contract.",
    lead: "A schema desk for source identity, source family, rights state, review state, readiness score, and answer boundary before retrieval exists.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Schema preview, not final data contract.",
    sprintPercent: 20,
    defaultFamily: "Bhagavad Gita | Smriti",
    defaultReadiness: "all",
    next: "Family Classifier",
    primaryAsk: "Define the source fields that every answer must inherit.",
    summary: "Citation Schema Desk turns source-first UX into a data contract.",
    items: [
      ["Stable fields", "Record fields make source provenance inspectable.", "Supports future retrieval."],
      ["Question examples", "Each source maps to likely user questions.", "Links learning need to source context."],
      ["Readiness score", "Records have cautious launch signals.", "Makes gaps visible."],
      ["Review state", "Source, rights, category, and authority review are separate.", "Prevents blurry approval."]
    ]
  },
  {
    version: "v2.1.7",
    badge: "v2.1.7 family classifier",
    slug: "familyclassifier",
    nav: "Family",
    title: "VedaPath Family Classifier",
    pageLabel: "Source family",
    eyebrow: "Family classifier",
    h1: "Never confuse the family of a source.",
    lead: "A family classifier that separates Bhagavad Gita, Upanishad, and Veda records so answers stop calling everything the four Vedas.",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    stance: "Family classification preview, not scholarly finality.",
    sprintPercent: 30,
    defaultFamily: "Upanishad | Shruti",
    defaultReadiness: "all",
    next: "Passage Rights Matrix",
    primaryAsk: "Make source-family labels impossible to hide.",
    summary: "Family Classifier reduces category confusion, one of VedaPath's central trust promises.",
    items: [
      ["Family filters", "Users can isolate source families instantly.", "Makes category visible."],
      ["Layer labels", "Tradition layer sits near the source family.", "Prevents shallow grouping."],
      ["Overclaim guard", "Family boundary appears in the source packet.", "Stops Veda/Gita confusion."],
      ["Calm correction", "The UI corrects without shaming the user.", "Keeps learning open."]
    ]
  },
  {
    version: "v2.1.8",
    badge: "v2.1.8 rights matrix",
    slug: "rightsmatrix",
    nav: "Rights",
    title: "VedaPath Passage Rights Matrix",
    pageLabel: "Rights matrix",
    eyebrow: "Rights matrix",
    h1: "Respect the text before using it.",
    lead: "A rights matrix that separates citation-only records, paraphrase preview candidates, restricted text holds, and translation review needs.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Rights matrix prototype, not legal clearance.",
    sprintPercent: 40,
    defaultFamily: "all",
    defaultReadiness: "rights-hold",
    next: "Translation Note Gate",
    primaryAsk: "Treat source display rights as a first-class product field.",
    summary: "Passage Rights Matrix keeps source reverence practical and launch-safe.",
    items: [
      ["Rights hold", "Restricted text records are separated from ready previews.", "Protects public display."],
      ["Translation policy", "Every record says how text may be shown.", "Makes display behavior explicit."],
      ["Citation-only path", "Source identity can be useful without full text.", "Supports cautious beta."],
      ["No legal claim", "The product never pretends legal clearance exists.", "Keeps scope honest."]
    ]
  },
  {
    version: "v2.1.9",
    badge: "v2.1.9 translation gate",
    slug: "translationgate",
    nav: "Translate",
    title: "VedaPath Translation Note Gate",
    pageLabel: "Translation gate",
    eyebrow: "Translation note gate",
    h1: "Show the translation rule before the answer.",
    lead: "A translation note gate that keeps citation, summary, paraphrase, and direct-text policy visible before any source-backed answer is assembled.",
    source: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    stance: "Translation policy preview, not licensed text system.",
    sprintPercent: 50,
    defaultFamily: "Upanishad | Shruti",
    defaultReadiness: "draft",
    next: "Concept Glossary Builder",
    primaryAsk: "Give each source record a safe display policy.",
    summary: "Translation Note Gate prevents the product from sliding into unreviewed text display.",
    items: [
      ["Policy line", "Each source packet includes a translation policy.", "Keeps rights visible."],
      ["Summary lane", "Summary remains separate from direct quotation.", "Protects integrity."],
      ["Draft filter", "Draft records can be studied without being shipped.", "Keeps pace safe."],
      ["Public copy", "Answer boundaries stay plain and readable.", "Keeps UX simple."]
    ]
  },
  {
    version: "v2.2.0",
    badge: "v2.2.0 glossary builder",
    slug: "glossarybuilder",
    nav: "Glossary",
    title: "VedaPath Concept Glossary Builder",
    pageLabel: "Concept glossary",
    eyebrow: "Concept glossary",
    h1: "Connect concepts without flattening them.",
    lead: "A glossary builder for themes, tags, and concept boundaries so Sanskrit and philosophy learning can deepen without becoming noisy.",
    source: "Chandogya Upanishad 6.8.7",
    family: "Upanishad | Shruti",
    stance: "Glossary preview, not commentary authority.",
    sprintPercent: 60,
    defaultFamily: "all",
    defaultReadiness: "all",
    next: "Question Source Map",
    primaryAsk: "Turn source themes into careful beginner pathways.",
    summary: "Concept Glossary Builder connects source records to learning language while preserving depth.",
    items: [
      ["Theme field", "Records expose concept themes for learner pathways.", "Builds future navigation."],
      ["Tag clusters", "Simple tags connect related records.", "Keeps discovery calm."],
      ["Boundary notes", "Concept explanations carry no-go lines.", "Prevents slogans."],
      ["Commentary caution", "Complex topics stay in review until lanes exist.", "Respects tradition."]
    ]
  },
  {
    version: "v2.2.1",
    badge: "v2.2.1 question map",
    slug: "questionmap",
    nav: "Questions",
    title: "VedaPath Question Source Map",
    pageLabel: "Question map",
    eyebrow: "Question source map",
    h1: "Map modern questions to careful sources.",
    lead: "A question-source map that connects user language to candidate records without pretending that one verse answers every life situation.",
    source: "Rigveda 1.164.46",
    family: "Veda | Shruti",
    stance: "Question map prototype, not retrieval ranking.",
    sprintPercent: 70,
    defaultFamily: "all",
    defaultReadiness: "needs-review",
    next: "Readiness Scorecard",
    primaryAsk: "Let user questions point to source candidates with boundaries.",
    summary: "Question Source Map prepares retrieval while keeping source claims humble.",
    items: [
      ["Question examples", "Each record has real user-question seeds.", "Supports future dataset growth."],
      ["Candidate language", "The map suggests sources, not final answers.", "Avoids oracle behavior."],
      ["Review status", "Question fit inherits review state.", "Stops premature launch."],
      ["Source packet", "The selected record can be copied for review.", "Speeds founder iteration."]
    ]
  },
  {
    version: "v2.2.2",
    badge: "v2.2.2 readiness score",
    slug: "readinessscore",
    nav: "Score",
    title: "VedaPath Readiness Scorecard",
    pageLabel: "Readiness score",
    eyebrow: "Readiness scorecard",
    h1: "Let readiness be visible, not implied.",
    lead: "A readiness scorecard that makes preview-ready, needs-review, draft, and rights-hold source states visible before search uses the library.",
    source: "Taittiriya Upanishad 1.11.1",
    family: "Upanishad | Shruti",
    stance: "Readiness score preview, not production QA.",
    sprintPercent: 80,
    defaultFamily: "all",
    defaultReadiness: "preview-ready",
    next: "Source Packet Export",
    primaryAsk: "Use score and state to decide what retrieval may touch first.",
    summary: "Readiness Scorecard turns source quality into a visible product signal.",
    items: [
      ["Score cards", "Records show readiness score and state.", "Makes uncertainty clear."],
      ["Preview-ready filter", "Only strong candidates are easy to isolate.", "Supports beta launch."],
      ["Risk contrast", "Draft and holds remain visible but not hidden.", "Keeps learning honest."],
      ["Next sprint signal", "Scores identify which records need review.", "Guides work."]
    ]
  },
  {
    version: "v2.2.3",
    badge: "v2.2.3 source packet",
    slug: "sourcepacketexport",
    nav: "Packet",
    title: "VedaPath Source Packet Export",
    pageLabel: "Source packet",
    eyebrow: "Source packet export",
    h1: "Make every source portable for review.",
    lead: "A source packet export room that turns a selected record into copyable review context with citation, rights, readiness, questions, and boundaries.",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    stance: "Packet export preview, not reviewer approval.",
    sprintPercent: 90,
    defaultFamily: "all",
    defaultReadiness: "all",
    next: "Source Library Control Room",
    primaryAsk: "Give founder and reviewer work a copyable source artifact.",
    summary: "Source Packet Export makes source review faster and less lossy.",
    items: [
      ["Copy packet", "Selected source records generate review handoffs.", "Reduces manual summary work."],
      ["Pin memory", "Local pins prove library behavior before accounts.", "Tests habit safely."],
      ["Question fit", "Example questions travel with the source.", "Keeps context attached."],
      ["Public boundary", "The packet says what not to overclaim.", "Protects launch quality."]
    ]
  },
  {
    version: "v2.2.4",
    badge: "v2.2.4 source library",
    slug: "sourcelibrary",
    nav: "Library",
    title: "VedaPath Source Library Control Room",
    pageLabel: "Source library",
    eyebrow: "Source library control",
    h1: "Build the library before the oracle.",
    lead: "A source library control room with curated records, family filters, readiness filters, packet export, local pins, and clear boundaries for future retrieval.",
    source: "Curated source set v1",
    family: "Veda | Upanishad | Bhagavad Gita",
    stance: "Curated source library prototype, not canonical corpus.",
    sprintPercent: 100,
    defaultFamily: "all",
    defaultReadiness: "all",
    next: "Founder instruction",
    primaryAsk: "Use this library as the first trusted source dataset for retrieval planning.",
    summary: "Source Library Control Room completes the curated-source sprint and gives VedaPath a concrete dataset foundation.",
    items: [
      ["Curated dataset", "Eight starter records are structured and inspectable.", "Creates a retrieval seed."],
      ["Filterable library", "Family, readiness, and search work in one calm page.", "Keeps UX simple."],
      ["Packet handoff", "Every record can become a review packet.", "Supports future scholar workflow."],
      ["Retrieval foundation", "The next engineering step can use source records instead of loose page copy.", "Moves toward real MVP."]
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
      ["Source promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", `Keep this boundary visible: ${item.stance}`]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No corpus claim", "Do not imply this starter set is the whole Vedic or Hindu source landscape."],
      ["No authority claim", "Do not let source records become guru voice, ritual instruction, therapy, diagnosis, or emergency support."],
      ["No rights claim", "Citation, paraphrase, and translation display remain governed by rights and review policy."]
    ]
  };
}

function sourceNav(prefix = "", rel = "") {
  const isSourcePage = visible.some((item) => rel === `${item.slug}.html`);
  return `          <a class="link${isSourcePage ? " active" : ""}" href="${prefix}${active.slug}.html">Sources</a>`;
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV END -->";
  const nav = sourceNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else if (content.includes("          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV END -->")) {
    content = content.replace("          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV END -->", `          <!-- VEDAPATH REVIEWER STUDIO SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  } else if (content.includes("<span class=\"version\">")) {
    content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  }
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

function libraryData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "curated source library prototype",
    warning: "Starter source-library data only. It is not a canonical corpus, scholar endorsement, legal clearance, therapy, ritual instruction, or spiritual authority.",
    records: sourceRecords
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
    <link rel="stylesheet" href="assets/vedapath-source-library.css">
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
          <a class="link" href="reviewerstudio.html">Reviewer</a>
          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV START -->
${sourceNav("", `${item.slug}.html`)}
          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Source library sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten source-data rooms turn citation-first thinking into a retrieval-ready foundation.</p>
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
              <span class="source-meta">Focus source</span>
              <span class="source-value">${item.source}</span>
            </div>
            <div>
              <span class="source-meta">Family lane</span>
              <span class="source-value">${item.family}</span>
            </div>
            <div>
              <span class="source-meta">Boundary</span>
              <span class="source-value">${item.stance}</span>
            </div>
          </div>

          <section class="source-library" id="sourceLibrary" data-family="${item.defaultFamily}" data-readiness="${item.defaultReadiness}" aria-label="Curated source library">
            <div class="library-head">
              <div>
                <span class="eyebrow">Curated source data</span>
                <h2>Source Library</h2>
                <p class="muted">Reads <strong>data/vedapath-source-library.json</strong>. Records are starter data for retrieval planning, not a canonical corpus.</p>
              </div>
              <div id="sourceStats" class="source-stats" aria-live="polite"></div>
            </div>

            <div class="library-tools">
              <label>
                <span>Family</span>
                <select id="familyFilter"></select>
              </label>
              <label>
                <span>Readiness</span>
                <select id="readinessFilter"></select>
              </label>
              <label>
                <span>Search</span>
                <input id="sourceSearch" type="search" placeholder="source, theme, tag">
              </label>
            </div>

            <div class="library-layout">
              <div id="sourceList" class="source-list" aria-label="Source records"></div>
              <div>
                <div id="sourceDetail" class="source-detail"></div>
                <div class="library-actions">
                  <button class="button primary" id="pinSource" type="button">Pin Source</button>
                  <button class="button safe" id="copySourcePacket" type="button">Copy Packet</button>
                  <button class="button" id="clearSourcePins" type="button">Clear Pins</button>
                </div>
                <label class="library-label" for="sourcePacket">Source packet preview</label>
                <textarea id="sourcePacket" readonly aria-label="Source packet output"></textarea>
                <div id="pinnedSources" class="pinned-sources" aria-label="Pinned source preview"></div>
              </div>
            </div>
          </section>

          <h2>Source Signals</h2>
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
          <span class="badge green">Source library</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent">
            <div class="bar" style="--score:${item.sprintPercent}%"></div>
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
              <span>Source records</span>
              <strong>${sourceRecords.length}</strong>
            </div>
            <div class="metric">
              <span>Next</span>
              <strong>${item.next}</strong>
            </div>
          </div>

          <div class="sprint-list">
            <div class="sprint-step active">
              <span class="step-index">1</span>
              <div><strong>Record</strong><p>Capture citation and family.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Guard</strong><p>Attach rights and boundaries.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Map</strong><p>Connect modern questions.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Packet</strong><p>Export review context.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Library Boundary</h2>
            <p class="muted">This starter set is not a canonical corpus, scholar endorsement, legal clearance, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-source-library.js"></script>
  </body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Source Focus

- Source: ${item.source}
- Family: ${item.family}
- Boundary: ${item.stance}

## Source Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-review-queue.json

## No-Go Boundary

This release should not imply canonical corpus coverage, scholar endorsement, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
`;
}

function writeSourceAssets() {
  write("data/vedapath-source-library.json", `${safeJson(libraryData())}\n`);
  write("assets/vedapath-source-library.css", `/* VedaPath source library */
.source-library {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.88);
}

.library-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 280px);
  gap: 14px;
  align-items: start;
}

.source-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.source-stat,
.source-record,
.source-detail,
.pinned-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.source-stat {
  padding: 10px;
}

.source-stat span,
.source-detail span,
.pinned-card span,
.library-tools span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.source-stat strong {
  display: block;
  font-size: 22px;
  line-height: 1.1;
}

.library-tools {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0;
}

.library-tools label {
  font-weight: 850;
}

.library-tools select,
.library-tools input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px 12px;
  font-weight: 800;
}

.library-layout {
  display: grid;
  grid-template-columns: minmax(230px, 0.9fr) minmax(0, 1.1fr);
  gap: 14px;
  align-items: start;
}

.source-list {
  display: grid;
  gap: 8px;
}

.source-record {
  width: 100%;
  padding: 11px;
  color: inherit;
  text-align: left;
}

.source-record.active,
.source-record:hover,
.source-record:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.source-record strong,
.source-record span {
  display: block;
}

.source-record span {
  color: var(--muted);
  font-size: 12px;
}

.score-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}

.score-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #f1dcd2;
}

.score-fill {
  height: 100%;
  width: var(--score);
  background: linear-gradient(90deg, var(--bhagwa), var(--gold));
}

.source-detail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border-left: 4px solid var(--green);
}

.source-detail .wide {
  grid-column: 1 / -1;
}

.library-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.library-label {
  display: block;
  margin: 14px 0 6px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 850;
}

#sourcePacket {
  width: 100%;
  min-height: 190px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
}

.pinned-sources {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.pinned-card {
  padding: 12px;
}

@media (max-width: 860px) {
  .library-head,
  .library-tools,
  .library-layout,
  .source-detail,
  .source-stats {
    grid-template-columns: 1fr;
  }

  .library-actions .button {
    width: 100%;
  }
}
`);

  write("assets/vedapath-source-library.js", `const sourceLibraryRoot = document.getElementById("sourceLibrary");

if (sourceLibraryRoot) {
  initSourceLibrary().catch((error) => {
    sourceLibraryRoot.innerHTML = '<p class="muted">Source library could not load curated source data.</p>';
    console.error(error);
  });
}

async function sourceLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function sourceText(value) {
  return value === 0 ? "0" : String(value || "");
}

function sourceSafe(value) {
  return sourceText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function sourceStorageKey() {
  return "vedapath-source-library-pins";
}

function readSourcePins() {
  try {
    return JSON.parse(localStorage.getItem(sourceStorageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeSourcePins(pins) {
  localStorage.setItem(sourceStorageKey(), JSON.stringify(pins.slice(0, 20)));
}

function sourcePacketText(record, pins) {
  return [
    "VedaPath Source Library Packet",
    "Record: " + record.title,
    "Source: " + record.source,
    "Source family: " + record.source_family,
    "Tradition layer: " + record.tradition_layer,
    "Theme: " + record.theme,
    "Readiness: " + record.readiness + " (" + record.score + "/100)",
    "Review state: " + record.review_state,
    "Rights state: " + record.rights_state,
    "Translation policy: " + record.translation_policy,
    "Source note: " + record.source_note,
    "Answer boundary: " + record.answer_boundary,
    "Question examples: " + record.question_examples.join(" | "),
    "Pinned local sources: " + pins.length,
    "",
    "Boundary: starter source-library prototype; not canonical corpus coverage, scholar endorsement, legal clearance, therapy, ritual instruction, emergency support, or spiritual authority."
  ].join("\\n");
}

function renderSourceStats(root, records, filtered, pins) {
  const ready = records.filter((record) => record.readiness === "preview-ready").length;
  root.querySelector("#sourceStats").innerHTML = [
    ["Sources", records.length],
    ["Visible", filtered.length],
    ["Preview-ready", ready],
    ["Pinned", pins.length]
  ].map((row) => '<div class="source-stat"><span>' + sourceSafe(row[0]) + '</span><strong>' + sourceSafe(row[1]) + '</strong></div>').join("");
}

async function initSourceLibrary() {
  const libraryData = await sourceLoadJson("data/vedapath-source-library.json");
  const records = libraryData.records || [];
  const familyFilter = sourceLibraryRoot.querySelector("#familyFilter");
  const readinessFilter = sourceLibraryRoot.querySelector("#readinessFilter");
  const search = sourceLibraryRoot.querySelector("#sourceSearch");
  const listNode = sourceLibraryRoot.querySelector("#sourceList");
  const detailNode = sourceLibraryRoot.querySelector("#sourceDetail");
  const packet = sourceLibraryRoot.querySelector("#sourcePacket");
  const pinsNode = sourceLibraryRoot.querySelector("#pinnedSources");
  const families = ["all", ...Array.from(new Set(records.map((record) => record.source_family)))];
  const readinesses = ["all", ...Array.from(new Set(records.map((record) => record.readiness)))];
  const state = {
    family: sourceLibraryRoot.dataset.family || "all",
    readiness: sourceLibraryRoot.dataset.readiness || "all",
    search: "",
    recordId: records[0] && records[0].id
  };

  familyFilter.innerHTML = families.map((family) => '<option value="' + sourceSafe(family) + '">' + sourceSafe(family) + '</option>').join("");
  readinessFilter.innerHTML = readinesses.map((readiness) => '<option value="' + sourceSafe(readiness) + '">' + sourceSafe(readiness) + '</option>').join("");

  function filteredRecords() {
    const term = state.search.trim().toLowerCase();
    return records.filter((record) => {
      const familyMatch = state.family === "all" || record.source_family === state.family;
      const readinessMatch = state.readiness === "all" || record.readiness === state.readiness;
      const searchText = [record.title, record.source, record.source_family, record.theme, record.tags.join(" ")].join(" ").toLowerCase();
      const searchMatch = !term || searchText.includes(term);
      return familyMatch && readinessMatch && searchMatch;
    });
  }

  function selectedRecord() {
    const filtered = filteredRecords();
    return filtered.find((record) => record.id === state.recordId) || filtered[0] || records[0];
  }

  function ensureSelected() {
    const record = selectedRecord();
    state.recordId = record && record.id;
    return record;
  }

  function renderList(record) {
    const filtered = filteredRecords();
    listNode.innerHTML = filtered.map((row) => (
      '<button class="source-record' + (row.id === record.id ? ' active' : '') + '" type="button" data-source-id="' + sourceSafe(row.id) + '">' +
        '<strong>' + sourceSafe(row.title) + '</strong>' +
        '<span>' + sourceSafe(row.source) + '</span>' +
        '<span>' + sourceSafe(row.source_family + " | " + row.readiness) + '</span>' +
        '<div class="score-line"><span>' + sourceSafe(row.score) + '</span><div class="score-track"><div class="score-fill" style="--score:' + sourceSafe(row.score) + '%"></div></div></div>' +
      '</button>'
    )).join("") || '<article class="pinned-card"><strong>No matching sources</strong><p class="muted">Clear filters to see the starter set.</p></article>';
  }

  function renderDetail(record) {
    detailNode.innerHTML = [
      ["Source", record.source],
      ["Family", record.source_family],
      ["Theme", record.theme],
      ["Readiness", record.readiness + " | " + record.score + "/100"],
      ["Rights", record.rights_state],
      ["Review", record.review_state],
      ["Translation policy", record.translation_policy, "wide"],
      ["Source note", record.source_note, "wide"],
      ["Answer boundary", record.answer_boundary, "wide"],
      ["Question examples", record.question_examples.join(" | "), "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + sourceSafe(row[0]) + '</span><strong>' + sourceSafe(row[1]) + '</strong></div>').join("");
  }

  function renderPins(pins) {
    if (!pins.length) {
      pinsNode.innerHTML = '<article class="pinned-card"><strong>No pinned sources yet</strong><p class="muted">Pin a source and the local source shelf preview will begin.</p></article>';
      return;
    }
    pinsNode.innerHTML = pins.slice(0, 4).map((pin) => (
      '<article class="pinned-card"><strong>' + sourceSafe(pin.title) + '</strong><span>' + sourceSafe(pin.source) + '</span><p class="muted">' + sourceSafe(pin.family) + ' | ' + sourceSafe(pin.date) + '</p></article>'
    )).join("");
  }

  function render() {
    const pins = readSourcePins();
    const record = ensureSelected();
    if (!record) return;
    familyFilter.value = state.family;
    readinessFilter.value = state.readiness;
    search.value = state.search;
    renderSourceStats(sourceLibraryRoot, records, filteredRecords(), pins);
    renderList(record);
    renderDetail(record);
    renderPins(pins);
    packet.value = sourcePacketText(record, pins);
  }

  familyFilter.addEventListener("change", () => {
    state.family = familyFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  readinessFilter.addEventListener("change", () => {
    state.readiness = readinessFilter.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  search.addEventListener("input", () => {
    state.search = search.value;
    state.recordId = (filteredRecords()[0] || records[0]).id;
    render();
  });

  listNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-source-id]");
    if (!button) return;
    state.recordId = button.dataset.sourceId;
    render();
  });

  sourceLibraryRoot.querySelector("#pinSource").addEventListener("click", () => {
    const record = selectedRecord();
    const pins = readSourcePins().filter((row) => row.id !== record.id);
    pins.unshift({
      id: record.id,
      title: record.title,
      source: record.source,
      family: record.source_family,
      date: new Date().toISOString().slice(0, 10)
    });
    writeSourcePins(pins);
    render();
  });

  sourceLibraryRoot.querySelector("#clearSourcePins").addEventListener("click", () => {
    localStorage.removeItem(sourceStorageKey());
    render();
  });

  sourceLibraryRoot.querySelector("#copySourcePacket").addEventListener("click", () => {
    packet.focus();
    packet.select();
    const button = sourceLibraryRoot.querySelector("#copySourcePacket");
    const originalText = button.textContent;
    const showCopied = () => {
      button.textContent = "Copied Packet";
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
      navigator.clipboard.writeText(packet.value).then(showCopied).catch(fallbackCopy);
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
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT LINKS START -->",
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT LINKS END -->",
    links,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT LINKS END -->"
  );
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES START -->",
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES END -->",
    features,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES END -->"
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
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT NOTES START -->",
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT NOTES END -->",
    notes,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT SUMMARY START -->",
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${198 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep source-library records as starter data until scholar review, rights policy, and retrieval evaluation are approved

${shortTitle(item)} should never claim canonical corpus coverage, scholar endorsement, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH SOURCE LIBRARY SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH REVIEWER STUDIO SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes(`href="${active.slug}.html">Sources</a>`)) {
    if (content.includes('href="reviewerstudio.html">Reviewer</a>')) {
      content = content.replace('href="reviewerstudio.html">Reviewer</a>', `href="reviewerstudio.html">Reviewer</a> | <a href="${active.slug}.html">Sources</a>`);
    } else {
      content = content.replace('href="sourcereader.html">Reader</a>', `href="sourcereader.html">Reader</a> | <a href="${active.slug}.html">Sources</a>`);
    }
  } else {
    content = content.replace(/href="[^"]+\.html">Sources<\/a>/, `href="${active.slug}.html">Sources</a>`);
  }
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Source library sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>Source library sprint progress: ${visible.length}/10 rooms complete. The MVP now has a curated source-data foundation.</p>`);
  const vision = Math.min(100, 82 + visible.length);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${vision}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${vision}%"></div></div>
          <p>Source library path: source shelf, schema, family classifier, rights matrix, translation gate, glossary, question map, readiness score, packet export, and control room.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder instruction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Source library sprint complete. Next release waits for founder instruction."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${179 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH SOURCE LIBRARY SPRINT PHASES START -->",
    "            <!-- VEDAPATH SOURCE LIBRARY SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH REVIEWER STUDIO SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${179 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.1.4 Reviewer Studio Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Source library sprint complete" : `${visible.length}/10 source library rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the path simple: source shelf, citation schema, family classifier, rights matrix, translation gate, glossary, question map, readiness score, packet export.</span></li>
              <li><span class="dot"></span><span>Do not claim canonical corpus coverage, scholar endorsement, legal clearance, therapy, ritual instruction, or spiritual authority.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing retrieval implementation, accounts, or scholar review operations."}</span></li>
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
    "          <!-- VEDAPATH SOURCE LIBRARY SPRINT HOME START -->",
    "          <!-- VEDAPATH SOURCE LIBRARY SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT HOME END -->"
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
    "          <!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES START -->",
    "          <!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH REVIEWER STUDIO SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeSourceAssets();

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

console.log(`Generated source-library sprint through ${active.version} (${visible.length}/10).`);
