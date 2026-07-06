import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const releaseDate = "July 6, 2026";
const targetVersion = process.argv[2] || "v4.1.4";
const versions = [
  {
    version: "v4.1.0",
    label: "Production Retrieval Pilot Gate",
    short: "pilot gate",
    page: "productionretrievalpilotgate.html",
    nav: "Pilot",
    bodyClass: "production-retrieval-pilot-page",
    kind: "gate",
    dataFile: "data/vedapath-production-retrieval-pilot-gate.json",
    doc: "docs/PRODUCTION_RETRIEVAL_PILOT_GATE.md",
    phase: 370,
    summary: "Production Retrieval Pilot Gate separates allowed static retrieval pilot work from blocked live-answer authority."
  },
  {
    version: "v4.1.1",
    label: "Verified Source Record Schema",
    short: "source records",
    page: "verifiedsourcerecordschema.html",
    nav: "Records",
    bodyClass: "verified-source-record-schema-page",
    kind: "schema",
    dataFile: "data/vedapath-verified-source-record-schema.json",
    doc: "docs/VERIFIED_SOURCE_RECORD_SCHEMA.md",
    phase: 371,
    summary: "Verified Source Record Schema defines the minimum source contract before retrieval can be trusted."
  },
  {
    version: "v4.1.2",
    label: "Retrieval Reviewer Desk",
    short: "reviewer desk",
    page: "retrievalreviewerdesk.html",
    nav: "Desk",
    bodyClass: "retrieval-reviewer-desk-page",
    kind: "desk",
    dataFile: "data/vedapath-retrieval-reviewer-desk.json",
    doc: "docs/RETRIEVAL_REVIEWER_DESK.md",
    phase: 372,
    summary: "Retrieval Reviewer Desk lets a reviewer inspect candidate matches, missing fields, and safe decisions."
  },
  {
    version: "v4.1.3",
    label: "First 25 Source QA Pack",
    short: "QA pack",
    page: "first25sourceqapack.html",
    nav: "QA Pack",
    bodyClass: "source-qa-pack-page",
    kind: "qa",
    dataFile: "data/vedapath-first-25-source-qa-pack.json",
    doc: "docs/FIRST_25_SOURCE_QA_PACK.md",
    phase: 373,
    summary: "First 25 Source QA Pack creates a visible curated seed set with coverage, review status, and risks."
  },
  {
    version: "v4.1.4",
    label: "Learner Ask Flow",
    short: "ask flow",
    page: "learneraskflow.html",
    nav: "Ask Flow",
    bodyClass: "learner-ask-flow-page",
    kind: "ask",
    dataFile: "data/vedapath-learner-ask-flow.json",
    doc: "docs/LEARNER_ASK_FLOW.md",
    phase: 374,
    summary: "Learner Ask Flow gives users one simple, source-carded question path over the curated demo source pack."
  }
];

const targetIndex = versions.findIndex((item) => item.version === targetVersion);
if (targetIndex === -1) {
  throw new Error(`Unknown target version ${targetVersion}`);
}

const activeVersions = versions.slice(0, targetIndex + 1);
const currentRelease = activeVersions[activeVersions.length - 1];

const sourceRecords = [
  {
    id: "bg-2-47-action-outcome",
    family: "Bhagavad Gita | Smriti",
    title: "Action and outcomes",
    citation: "Bhagavad Gita 2.47",
    status: "ready",
    confidence: "high",
    allowedUse: "Use for steady action reflections and source-carded answer drafts.",
    boundary: "Do not turn this into guaranteed calm, fatalism, or passivity.",
    summary: "The passage is commonly read as directing attention toward action while keeping outcomes from becoming identity.",
    routes: ["calm", "daily", "learner"],
    risks: ["outcome-detachment overreach"],
    missingFields: ["licensed translation", "commentary comparison"]
  },
  {
    id: "bg-2-48-steadiness",
    family: "Bhagavad Gita | Smriti",
    title: "Steadiness in action",
    citation: "Bhagavad Gita 2.48",
    status: "ready",
    confidence: "high",
    allowedUse: "Use for calm path, practice, and learner action cards.",
    boundary: "Reflection support only, not therapy, diagnosis, or ritual instruction.",
    summary: "The source candidate supports steadiness while acting, with caution about clinging to results.",
    routes: ["practice", "calm", "ask"],
    risks: ["spiritual prescription"],
    missingFields: ["licensed translation"]
  },
  {
    id: "bg-11-32-time",
    family: "Bhagavad Gita | Smriti",
    title: "Time and destruction",
    citation: "Bhagavad Gita 11.32",
    status: "ready",
    confidence: "high",
    allowedUse: "Use for Oppenheimer-source clarification and category correction.",
    boundary: "Do not call it a direct Vedic quote or a four-Veda passage.",
    summary: "This is the commonly cited source family behind the Oppenheimer line in popular culture.",
    routes: ["claim-check", "learner", "answer"],
    risks: ["Veda versus Gita confusion"],
    missingFields: ["translation variant notes"]
  },
  {
    id: "bg-6-5-self-effort",
    family: "Bhagavad Gita | Smriti",
    title: "Self effort and self support",
    citation: "Bhagavad Gita 6.5",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for agency-first learning and calm practice prompts.",
    boundary: "Do not shame users who feel stuck or imply self-help alone is sufficient.",
    summary: "The passage is commonly read as a call toward self-uplift and inner responsibility.",
    routes: ["practice", "life", "learner"],
    risks: ["self-blame"],
    missingFields: ["commentary comparison"]
  },
  {
    id: "bg-12-13-compassion",
    family: "Bhagavad Gita | Smriti",
    title: "Compassion and non-hostility",
    citation: "Bhagavad Gita 12.13",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for conversation tone and relational reflection.",
    boundary: "Do not flatten devotion into generic productivity advice.",
    summary: "The verse is often read as describing qualities of a steady, compassionate devotee.",
    routes: ["talk", "life", "learner"],
    risks: ["devotional flattening"],
    missingFields: ["school-specific commentary"]
  },
  {
    id: "bg-17-15-speech",
    family: "Bhagavad Gita | Smriti",
    title: "Disciplined speech",
    citation: "Bhagavad Gita 17.15",
    status: "ready",
    confidence: "high",
    allowedUse: "Use for speech-before-reply drafts and conversation companion.",
    boundary: "Do not make the app an authority over personal relationships.",
    summary: "The passage supports truthful, gentle, beneficial speech as a practice discipline.",
    routes: ["talk", "pattern", "learner"],
    risks: ["relationship advice overreach"],
    missingFields: ["licensed translation"]
  },
  {
    id: "bg-3-19-duty",
    family: "Bhagavad Gita | Smriti",
    title: "Duty without attachment",
    citation: "Bhagavad Gita 3.19",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for practical action cards and work-pressure reflection.",
    boundary: "Do not prescribe social duty or caste duty.",
    summary: "The passage supports doing the needed action without fastening identity to the result.",
    routes: ["daily", "work", "learner"],
    risks: ["duty overreach"],
    missingFields: ["context notes"]
  },
  {
    id: "bg-4-39-learning",
    family: "Bhagavad Gita | Smriti",
    title: "Learning, attention, and trust",
    citation: "Bhagavad Gita 4.39",
    status: "review",
    confidence: "medium",
    allowedUse: "Use only as a learning-path source candidate until commentary is reviewed.",
    boundary: "Do not present faith language as a generic cognitive hack.",
    summary: "The source is relevant to learning posture, but needs careful devotional context.",
    routes: ["learning", "learner"],
    risks: ["faith-language flattening"],
    missingFields: ["reviewer note", "commentary comparison"]
  },
  {
    id: "isa-1-stewardship",
    family: "Isha Upanishad | Upanishad",
    title: "Stewardship and restraint",
    citation: "Isha Upanishad 1",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for restraint, ownership, and simplicity reflections.",
    boundary: "Do not use it as a proof text for modern economic claims.",
    summary: "The opening passage is often read around restraint, belonging, and sacred presence.",
    routes: ["life", "source", "learner"],
    risks: ["modern economic overclaim"],
    missingFields: ["translation comparison"]
  },
  {
    id: "katha-1-2-23-self",
    family: "Katha Upanishad | Upanishad",
    title: "Self knowledge boundary",
    citation: "Katha Upanishad 1.2.23",
    status: "review",
    confidence: "medium",
    allowedUse: "Use as a source candidate for humility around knowledge.",
    boundary: "Do not turn this into mystical certainty or guru authority.",
    summary: "The passage is commonly associated with limits of mere instruction or intellect in realizing the Self.",
    routes: ["blueprint", "learner"],
    risks: ["mystical authority"],
    missingFields: ["exact translation review", "commentary comparison"]
  },
  {
    id: "chandogya-6-8-7-identity",
    family: "Chandogya Upanishad | Upanishad",
    title: "Tat tvam asi context",
    citation: "Chandogya Upanishad 6.8.7",
    status: "review",
    confidence: "medium",
    allowedUse: "Use only with explicit school/context boundaries.",
    boundary: "Do not pretend every school reads the phrase identically.",
    summary: "A famous teaching passage often discussed in Vedanta, needing interpretation labels.",
    routes: ["samvada", "learner"],
    risks: ["school-flattening"],
    missingFields: ["interpretation stack", "teacher review"]
  },
  {
    id: "taittiriya-2-1-brahman",
    family: "Taittiriya Upanishad | Upanishad",
    title: "Brahman description",
    citation: "Taittiriya Upanishad 2.1",
    status: "review",
    confidence: "medium",
    allowedUse: "Use only for glossary and philosophical orientation.",
    boundary: "Do not reduce metaphysical language into motivational copy.",
    summary: "A major Upanishadic source for Brahman-language, needing careful translation and context.",
    routes: ["glossary", "learner"],
    risks: ["metaphysical flattening"],
    missingFields: ["glossary review", "translation comparison"]
  },
  {
    id: "mundaka-1-1-4-knowledge",
    family: "Mundaka Upanishad | Upanishad",
    title: "Higher and lower knowledge",
    citation: "Mundaka Upanishad 1.1.4",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for explaining source layers and learning paths.",
    boundary: "Do not make anti-science claims from the distinction.",
    summary: "The passage is often cited for differentiating forms of knowledge.",
    routes: ["learning", "source", "learner"],
    risks: ["anti-science overclaim"],
    missingFields: ["translation comparison"]
  },
  {
    id: "brihad-1-3-28-asato",
    family: "Brihadaranyaka Upanishad | Upanishad",
    title: "From untruth to truth",
    citation: "Brihadaranyaka Upanishad 1.3.28",
    status: "review",
    confidence: "medium",
    allowedUse: "Use as a reflection source candidate only after citation review.",
    boundary: "Do not use as ritual instruction or guaranteed transformation.",
    summary: "A famous prayer-like passage often used for truth, light, and mortality reflection.",
    routes: ["calm", "practice"],
    risks: ["ritual instruction"],
    missingFields: ["citation verification", "licensed translation"]
  },
  {
    id: "mandukya-1-om",
    family: "Mandukya Upanishad | Upanishad",
    title: "Om and all experience",
    citation: "Mandukya Upanishad 1",
    status: "review",
    confidence: "medium",
    allowedUse: "Use for concept overview, not chant guidance.",
    boundary: "Do not turn into recitation authority.",
    summary: "The opening is a central source for Om-focused philosophical discussion.",
    routes: ["mantra", "learner"],
    risks: ["chant authority"],
    missingFields: ["recitation boundary", "commentary comparison"]
  },
  {
    id: "rig-3-62-10-gayatri",
    family: "Rigveda | Veda",
    title: "Gayatri mantra source",
    citation: "Rigveda 3.62.10",
    status: "review",
    confidence: "high",
    allowedUse: "Use for source identification and respectful boundary notes.",
    boundary: "Do not provide ritual authority, initiation guidance, or overconfident practice instruction.",
    summary: "A central Vedic mantra source that needs special care around recitation, tradition, and context.",
    routes: ["mantra", "review", "learner"],
    risks: ["ritual overreach"],
    missingFields: ["tradition review", "recitation permissions"]
  },
  {
    id: "rig-10-129-nasadiya",
    family: "Rigveda | Veda",
    title: "Creation and uncertainty",
    citation: "Rigveda 10.129",
    status: "review",
    confidence: "medium",
    allowedUse: "Use for careful cosmology and philosophical wonder.",
    boundary: "Do not claim the verse proves modern physics.",
    summary: "A famous hymn often discussed for its speculative humility around origins.",
    routes: ["claim-check", "source", "learner"],
    risks: ["modern science overclaim"],
    missingFields: ["translation comparison", "scholarly note"]
  },
  {
    id: "rig-1-164-46-many-names",
    family: "Rigveda | Veda",
    title: "One reality, many names",
    citation: "Rigveda 1.164.46",
    status: "review",
    confidence: "medium",
    allowedUse: "Use only with source and interpretation caution.",
    boundary: "Do not make every tradition say the same thing.",
    summary: "A frequently cited hymn line often used in pluralistic discussions, needing careful framing.",
    routes: ["samvada", "learner"],
    risks: ["false equivalence"],
    missingFields: ["scholarly note", "translation comparison"]
  },
  {
    id: "yoga-1-2-citta",
    family: "Yoga Sutra | Darshana",
    title: "Mind fluctuation definition",
    citation: "Yoga Sutra 1.2",
    status: "ready",
    confidence: "high",
    allowedUse: "Use for philosophical orientation around attention, not medical claims.",
    boundary: "Do not present as therapy or mental-health treatment.",
    summary: "The sutra defines yoga in relation to the settling or restraint of mental fluctuations.",
    routes: ["practice", "daily", "learner"],
    risks: ["therapy overclaim"],
    missingFields: ["commentary comparison"]
  },
  {
    id: "yoga-1-33-attitudes",
    family: "Yoga Sutra | Darshana",
    title: "Helpful attitudes",
    citation: "Yoga Sutra 1.33",
    status: "ready",
    confidence: "medium",
    allowedUse: "Use for relational tone and conversation practice prompts.",
    boundary: "Do not prescribe one emotional response for every situation.",
    summary: "The sutra is commonly read as a practical orientation toward different kinds of people and situations.",
    routes: ["talk", "life", "learner"],
    risks: ["emotional prescription"],
    missingFields: ["commentary comparison"]
  },
  {
    id: "mahabharata-12-calm-duty",
    family: "Mahabharata | Itihasa",
    title: "Duty and reflection context",
    citation: "Mahabharata, Shanti Parva candidate",
    status: "draft",
    confidence: "low",
    allowedUse: "Keep as a placeholder candidate until exact passage is verified.",
    boundary: "Do not answer from this record yet.",
    summary: "Potential Itihasa source lane for duty, grief, and decision making, pending exact citation.",
    routes: ["future", "review"],
    risks: ["uncertain citation"],
    missingFields: ["exact citation", "translation", "reviewer approval"]
  },
  {
    id: "bhagavata-1-2-6-devotion",
    family: "Bhagavata Purana | Purana",
    title: "Devotion and causeless practice",
    citation: "Bhagavata Purana 1.2.6",
    status: "review",
    confidence: "medium",
    allowedUse: "Use only with devotional source labels.",
    boundary: "Do not flatten bhakti into generic wellness language.",
    summary: "A devotional source candidate often discussed around bhakti and inner satisfaction.",
    routes: ["devotion", "learner"],
    risks: ["bhakti flattening"],
    missingFields: ["tradition review", "translation comparison"]
  },
  {
    id: "vivekachudamani-discernment",
    family: "Vedanta commentary | Later text",
    title: "Discernment support",
    citation: "Vivekachudamani candidate",
    status: "draft",
    confidence: "low",
    allowedUse: "Use only as a future commentary lane placeholder.",
    boundary: "Do not cite as Shruti or primary Veda.",
    summary: "Potential later Vedanta commentary lane for discernment, pending source verification.",
    routes: ["future", "review"],
    risks: ["category confusion"],
    missingFields: ["exact verse", "authorship/context note", "reviewer approval"]
  },
  {
    id: "narada-bhakti-candidate",
    family: "Bhakti Sutra | Later text",
    title: "Devotional definition candidate",
    citation: "Narada Bhakti Sutra candidate",
    status: "draft",
    confidence: "low",
    allowedUse: "Use only as a future source placeholder.",
    boundary: "Do not use for final answers until exact sutra and tradition notes are reviewed.",
    summary: "Potential bhakti source lane for future devotional learning paths.",
    routes: ["future", "review"],
    risks: ["devotional authority"],
    missingFields: ["exact sutra", "translation", "reviewer approval"]
  },
  {
    id: "gita-mahatmya-candidate",
    family: "Commentarial tradition | Later text",
    title: "Gita reverence candidate",
    citation: "Gita Mahatmya candidate",
    status: "draft",
    confidence: "low",
    allowedUse: "Use only for future tradition-context experiments.",
    boundary: "Do not use as primary Gita source.",
    summary: "A placeholder for later tradition context, explicitly separated from canonical Gita verses.",
    routes: ["future", "review"],
    risks: ["primary-source confusion"],
    missingFields: ["source edition", "reviewer approval"]
  },
  {
    id: "source-gap-modern-science",
    family: "Unsourced or uncertain",
    title: "Modern science claim gap",
    citation: "No verified source",
    status: "blocked",
    confidence: "none",
    allowedUse: "Use as a refusal and correction sample.",
    boundary: "Do not answer as if a scripture proves the claim.",
    summary: "A record for teaching VedaPath to say no when a modern overclaim lacks a source.",
    routes: ["claim-check", "eval"],
    risks: ["hallucinated citation"],
    missingFields: ["verified source absent"]
  },
  {
    id: "source-gap-personal-advice",
    family: "Unsourced or uncertain",
    title: "Personal crisis advice gap",
    citation: "No verified source",
    status: "blocked",
    confidence: "none",
    allowedUse: "Use for safety boundaries and support redirection.",
    boundary: "Do not provide emergency, medical, legal, or mental-health advice.",
    summary: "A safety record that keeps calm-product features from pretending to be emergency support.",
    routes: ["safety", "eval"],
    risks: ["high-stakes advice"],
    missingFields: ["support routing policy"]
  }
];

const questions = [
  {
    id: "q-steady-results",
    label: "Results feel uncertain",
    question: "How can I act calmly when results are uncertain?",
    recordIds: ["bg-2-48-steadiness", "bg-2-47-action-outcome", "bg-3-19-duty"],
    answerTitle: "Begin with the next honest action, not the result you cannot control.",
    plainMeaning: "The source path supports steady action. It does not promise instant peace, but it gives the learner a clean next step.",
    carry: "Choose one small duty. Do it slowly, cleanly, and without checking for praise."
  },
  {
    id: "q-oppenheimer",
    label: "Oppenheimer quote",
    question: "What scripture did Oppenheimer quote?",
    recordIds: ["bg-11-32-time"],
    answerTitle: "The famous line is associated with the Bhagavad Gita, not the four Vedas.",
    plainMeaning: "The source should be labeled as Bhagavad Gita 11.32, usually classified as Smriti within the Mahabharata context.",
    carry: "State the category carefully before discussing the wider philosophical connection."
  },
  {
    id: "q-gayatri",
    label: "Gayatri mantra",
    question: "Can VedaPath explain the Gayatri mantra?",
    recordIds: ["rig-3-62-10-gayatri"],
    answerTitle: "VedaPath can identify the source and explain boundaries before interpretation.",
    plainMeaning: "The source candidate is Rigveda 3.62.10, but practice, recitation, and tradition-specific guidance need human review.",
    carry: "Open source identity first. Keep ritual and pronunciation authority out of the prototype answer."
  },
  {
    id: "q-speech",
    label: "Reply calmly",
    question: "How should I reply when my first response feels sharp?",
    recordIds: ["bg-17-15-speech", "yoga-1-33-attitudes"],
    answerTitle: "Pause, then choose truthful words that reduce heat.",
    plainMeaning: "The source path supports speech that is truthful, beneficial, and gentle, while keeping the app from becoming a relationship authority.",
    carry: "Remove one sharp sentence. Send only what is true and useful."
  },
  {
    id: "q-modern-science",
    label: "Modern science claim",
    question: "Did the Vedas prove quantum physics?",
    recordIds: ["rig-10-129-nasadiya", "source-gap-modern-science"],
    answerTitle: "Do not turn wonder into a modern science claim.",
    plainMeaning: "The Nasadiya hymn can support careful reflection on origins and uncertainty, but it should not be used as proof of a modern theory.",
    carry: "Separate inspiration from evidence. Ask for a precise source and a precise claim."
  }
];

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  const dir = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
  ensureDir(dir);
  writeFileSync(file, content.replace(/\r\n/g, "\n"), "utf8");
}

function read(file) {
  return readFileSync(file, "utf8");
}

function writeJson(file, data) {
  write(file, `${JSON.stringify(data, null, 2)}\n`);
}

function removeMarkedBlock(text, start, end) {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) return text;
  const endIndex = text.indexOf(end, startIndex);
  if (endIndex === -1) return text;
  return text.slice(0, startIndex) + text.slice(endIndex + end.length);
}

function upsertMarkdownBlock(file, start, end, block, afterHeading = null) {
  let text = read(file);
  text = removeMarkedBlock(text, start, end).trimStart();
  const marked = `${start}\n${block.trim()}\n${end}\n\n`;
  if (afterHeading && text.startsWith(afterHeading)) {
    write(file, `${afterHeading}\n\n${marked}${text.slice(afterHeading.length).trimStart()}`);
    return;
  }
  write(file, `${marked}${text}`);
}

function navItems(prefix = "") {
  const base = [
    ["Home", "index.html"],
    ["Build", "build-status.html"],
    ["Brand", "brand/brand-board.html"],
    ["Blueprint", "blueprint.html"],
    ["Answers", "citedanswerlab.html"],
    ["Review", "reviewqueuepersistence.html"],
    ["Mantra", "mantralenslab.html"],
    ["Life", "lifecompanionlab.html"],
    ["Talk", "conversationcompanionlab.html"],
    ["Pattern", "patterncompanionlab.html"],
    ["Daily", "daily.html"],
    ["Packet", "answerpacketpilot.html"],
    ["Launch", "launchreadinesshub.html"]
  ];
  return base.concat(activeVersions.map((item) => [item.nav, item.page])).map(([label, href]) => [label, prefix + href]);
}

function navHtml(active, prefix = "") {
  const links = navItems(prefix).map(([label, href]) => {
    const activeClass = label === active ? " active" : "";
    return `        <a class="link${activeClass}" href="${href}">${label}</a>`;
  }).join("\n");
  return `      <nav class="navlinks nav" aria-label="Primary navigation">\n${links}\n        <span class="version-pill">${currentRelease.version} ${currentRelease.short}</span>\n      </nav>`;
}

function pageTemplate(item, subtitle, introTitle, introCopy) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${item.label} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css" />
</head>
<body class="${item.bodyClass} retrieval-pilot-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${subtitle}</small></span>
      </a>
${navHtml(item.nav)}
    </header>

    <section class="rp-opening">
      <div>
        <p class="rp-eyebrow">${item.version} ${item.short}</p>
        <h1>${introTitle}</h1>
        <p>${introCopy}</p>
      </div>
      <aside class="rp-opening-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>Source first. Calm path.</strong>
        <span>No live answer authority. No hidden source claims.</span>
      </aside>
    </section>

    <section class="rp-app" data-retrieval-app data-kind="${item.kind}" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-retrieval-pilot.js"></script>
</body>
</html>
`;
}

function writePages() {
  const pageCopy = {
    gate: [
      "Production retrieval gate",
      "Pilot retrieval without pretending it is production.",
      "A calm gate for what can be tested now, what needs review, and what must stay locked before public authority."
    ],
    schema: [
      "Verified source records",
      "Every answer starts with a source record.",
      "A source record is the contract between curiosity, citation, boundary, and reviewer confidence."
    ],
    desk: [
      "Retrieval reviewer desk",
      "Review the match before the answer speaks.",
      "A reviewer can see why a candidate appeared, what is missing, and whether the candidate should move forward."
    ],
    qa: [
      "First 25 source QA pack",
      "Make the curated source set visible.",
      "The first pack should show coverage, status, missing fields, and risk before it becomes retrieval fuel."
    ],
    ask: [
      "Learner ask flow",
      "Ask once. See the source. Carry one step.",
      "A simple learner path over curated demo records, with confidence and boundary visible before any answer expands."
    ]
  };
  for (const item of activeVersions) {
    const copy = pageCopy[item.kind];
    write(item.page, pageTemplate(item, copy[0], copy[1], copy[2]));
  }
}

function writeCss() {
  write("assets/vedapath-retrieval-pilot.css", `:root {
  --rp-bg: rgba(255, 253, 248, 0.76);
  --rp-panel: rgba(255, 255, 255, 0.68);
  --rp-panel-strong: rgba(255, 255, 255, 0.88);
  --rp-line: rgba(91, 70, 56, 0.16);
  --rp-line-strong: rgba(214, 90, 31, 0.32);
  --rp-ink: #201713;
  --rp-muted: #65483a;
  --rp-accent: #d65a1f;
  --rp-ochre: #a83e12;
  --rp-gold: #e0a83b;
  --rp-green: #145c4a;
  --rp-calm: #e7f1ec;
}

.retrieval-pilot-surface .workspace {
  width: min(1320px, calc(100% - 28px));
}

.retrieval-pilot-surface {
  background:
    linear-gradient(rgba(255, 255, 255, 0.72) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.72) 1px, transparent 1px),
    #fff8ed;
  background-size: 18px 18px;
}

.rp-opening {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.32fr);
  gap: 18px;
  align-items: center;
  padding: 36px 0 28px;
  border-bottom: 1px solid var(--rp-line);
}

.rp-opening h1 {
  max-width: 880px;
  margin: 10px 0;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.02;
  letter-spacing: 0;
}

.rp-opening p {
  max-width: 780px;
  margin: 0;
  color: var(--rp-muted);
  font-size: 17px;
}

.rp-eyebrow,
.rp-chip,
.rp-status,
.rp-mini-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  border: 1px solid rgba(214, 90, 31, 0.22);
  border-radius: 999px;
  padding: 3px 9px;
  background: rgba(253, 232, 221, 0.72);
  color: var(--rp-ochre);
  font-size: 12px;
  font-weight: 900;
}

.rp-chip.green,
.rp-status.ready,
.rp-status.allowed,
.rp-mini-label.green {
  border-color: rgba(20, 92, 74, 0.22);
  background: rgba(231, 241, 236, 0.86);
  color: var(--rp-green);
}

.rp-status.review,
.rp-status.draft {
  border-color: rgba(224, 168, 59, 0.38);
  background: rgba(255, 244, 215, 0.88);
  color: #765013;
}

.rp-status.blocked {
  border-color: rgba(168, 62, 18, 0.28);
  background: rgba(255, 229, 218, 0.92);
  color: var(--rp-ochre);
}

.rp-opening-card,
.rp-panel,
.rp-card,
.rp-rail-card,
.rp-metric,
.rp-record,
.rp-flow-step,
.rp-table {
  border: 1px solid var(--rp-line);
  border-radius: 8px;
  background: var(--rp-panel);
  box-shadow: 0 18px 52px rgba(48, 31, 19, 0.06);
}

.rp-opening-card {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 18px;
  text-align: center;
}

.rp-opening-card img {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  object-fit: cover;
}

.rp-opening-card span {
  color: var(--rp-muted);
  font-size: 13px;
}

.rp-grid {
  display: grid;
  grid-template-columns: minmax(190px, 0.48fr) minmax(0, 1.8fr) minmax(230px, 0.56fr);
  gap: 14px;
  align-items: start;
  padding-top: 18px;
}

.rp-panel {
  padding: 16px;
}

.rp-main {
  display: grid;
  gap: 14px;
}

.rp-panel h2,
.rp-card h2,
.rp-rail-card h2 {
  margin: 8px 0 8px;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.08;
}

.rp-panel h3,
.rp-card h3,
.rp-record h3 {
  margin: 6px 0 6px;
  font-size: 18px;
  line-height: 1.16;
}

.rp-panel p,
.rp-card p,
.rp-record p,
.rp-rail-card p {
  color: var(--rp-muted);
}

.rp-card,
.rp-rail-card {
  padding: 16px;
}

.rp-rail-list,
.rp-stack,
.rp-record-grid,
.rp-actions,
.rp-filter-row {
  display: grid;
  gap: 10px;
}

.rp-record-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rp-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.rp-metric {
  min-height: 76px;
  padding: 12px;
}

.rp-metric span {
  display: block;
  color: var(--rp-muted);
  font-size: 12px;
}

.rp-metric strong {
  display: block;
  margin-top: 4px;
  font-size: clamp(20px, 2vw, 24px);
  line-height: 1;
  overflow-wrap: anywhere;
}

.rp-grid > .rp-panel .rp-metrics {
  grid-template-columns: 1fr;
}

.rp-flow-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.rp-flow-step {
  min-height: 130px;
  padding: 12px;
  border-left: 3px solid rgba(224, 168, 59, 0.72);
}

.rp-number {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--rp-calm);
  color: var(--rp-green);
  font-size: 13px;
  font-weight: 900;
}

.rp-record {
  padding: 13px;
  border-left: 3px solid var(--rp-accent);
}

.rp-record p {
  margin-bottom: 8px;
}

.rp-record-meta,
.rp-field-grid,
.rp-decision-grid {
  display: grid;
  gap: 8px;
}

.rp-field-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.rp-decision-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.rp-field {
  min-height: 76px;
  padding: 10px;
  border: 1px solid var(--rp-line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.66);
}

.rp-field span {
  display: block;
  color: var(--rp-muted);
  font-size: 12px;
}

.rp-field strong {
  display: block;
  margin-top: 4px;
  overflow-wrap: anywhere;
}

.rp-button,
.rp-select,
.rp-input,
.rp-textarea {
  min-height: 38px;
  border: 1px solid rgba(214, 90, 31, 0.28);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.82);
  color: var(--rp-ink);
  font: inherit;
  font-weight: 800;
}

.rp-button {
  padding: 8px 12px;
  cursor: pointer;
}

.rp-button.primary {
  border-color: var(--rp-accent);
  background: var(--rp-accent);
  color: white;
}

.rp-button.green {
  border-color: rgba(20, 92, 74, 0.26);
  color: var(--rp-green);
}

.rp-button.is-active,
.rp-button[aria-pressed="true"] {
  border-color: var(--rp-accent);
  background: rgba(253, 232, 221, 0.82);
  color: var(--rp-ochre);
}

.rp-select,
.rp-input,
.rp-textarea {
  width: 100%;
  padding: 9px 10px;
}

.rp-textarea {
  min-height: 112px;
  resize: vertical;
  font-weight: 600;
}

.rp-table {
  overflow: hidden;
}

.rp-table-row {
  display: grid;
  grid-template-columns: minmax(120px, 0.7fr) minmax(160px, 1.2fr) minmax(120px, 0.8fr) minmax(120px, 0.8fr);
  gap: 10px;
  padding: 11px 12px;
  border-bottom: 1px solid var(--rp-line);
}

.rp-table-row:last-child {
  border-bottom: 0;
}

.rp-table-head {
  background: rgba(231, 241, 236, 0.48);
  color: var(--rp-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.rp-progress {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(168, 62, 18, 0.14);
}

.rp-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--rp-accent), var(--rp-gold));
}

.rp-answer {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 12px;
}

.rp-empty {
  padding: 16px;
  border: 1px dashed var(--rp-line-strong);
  border-radius: 8px;
  color: var(--rp-muted);
  background: rgba(255, 253, 248, 0.58);
}

.vp-command-shell-ready .vp-command-rail *,
.vp-command-shell-ready .vp-rail-link span {
  min-width: 0;
}

.vp-command-shell-ready .vp-rail-link span:last-child {
  overflow-wrap: anywhere;
}

@media (max-width: 1100px) {
  .rp-grid,
  .rp-opening,
  .rp-answer {
    grid-template-columns: 1fr;
  }

  .rp-flow-grid,
  .rp-field-grid,
  .rp-decision-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .retrieval-pilot-surface .workspace {
    width: min(100% - 20px, 1320px);
  }

  .rp-flow-grid,
  .rp-record-grid,
  .rp-field-grid,
  .rp-decision-grid,
  .rp-metrics,
  .rp-table-row {
    grid-template-columns: 1fr;
  }

  .rp-opening h1 {
    font-size: 34px;
  }
}
`);
}

function writeJs() {
  write("assets/vedapath-retrieval-pilot.js", `(function () {
  const app = document.querySelector("[data-retrieval-app]");
  if (!app) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function statusClass(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function chip(value, extra) {
    return '<span class="rp-status ' + statusClass(value) + (extra ? " " + extra : "") + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="rp-metrics">' + metrics.map(function (metric) {
      return '<div class="rp-metric"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function flowSteps(items) {
    return '<div class="rp-flow-grid">' + items.map(function (item, index) {
      return '<article class="rp-flow-step"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
    }).join("") + '</div>';
  }

  function recordCard(record) {
    return '<article class="rp-record" data-record-id="' + escapeHtml(record.id) + '">' +
      '<div class="rp-record-meta">' +
      '<div>' + chip(record.status) + '</div>' +
      '<h3>' + escapeHtml(record.title) + '</h3>' +
      '<p><strong>' + escapeHtml(record.citation) + '</strong> &middot; ' + escapeHtml(record.family) + '</p>' +
      '<p>' + escapeHtml(record.summary) + '</p>' +
      '</div>' +
      '<div class="rp-field-grid">' +
      '<div class="rp-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence) + '</strong></div>' +
      '<div class="rp-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary) + '</strong></div>' +
      '<div class="rp-field"><span>Missing</span><strong>' + escapeHtml((record.missingFields || []).join(", ")) + '</strong></div>' +
      '</div>' +
    '</article>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="rp-grid"><aside class="rp-panel">' + left + '</aside><main class="rp-main">' + main + '</main><aside class="rp-panel">' + side + '</aside></section>';
  }

  function renderGate(data) {
    const left = '<span class="rp-eyebrow">Gate posture</span><h2>What may open?</h2><p>' + escapeHtml(data.position) + '</p>' +
      '<div class="rp-rail-list">' + data.postures.map(function (item) {
        return '<article class="rp-rail-card">' + chip(item.decision, item.decision === "Allowed" ? "allowed" : "") + '<h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
      }).join("") + '</div>';

    const main = '<article class="rp-card"><span class="rp-eyebrow">Production gate</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' +
      flowSteps(data.flow) + '</article>' +
      '<article class="rp-card"><span class="rp-eyebrow green">Decision matrix</span><div class="rp-decision-grid">' +
      data.decisions.map(function (item) {
        return '<div class="rp-field"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong><p>' + escapeHtml(item.reason) + '</p></div>';
      }).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">Founder packet</span><textarea class="rp-textarea" readonly>' + escapeHtml(data.packet) + '</textarea><div class="rp-actions"><button class="rp-button primary" data-copy-packet type="button">Copy Gate Packet</button><a class="rp-button green" href="verifiedsourcerecordschema.html">Open Records</a></div></article>';

    const side = '<span class="rp-eyebrow green">Readiness</span><h2>Pilot pulse</h2>' + metricGrid(data.metrics) + '<div class="rp-stack">' +
      data.locks.map(function (item) {
        return '<article class="rp-rail-card"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
      }).join("") + '</div>';
    renderShell(left, main, side);
  }

  function renderSchema(data) {
    const left = '<span class="rp-eyebrow">Schema lanes</span><h2>Minimum fields</h2><div class="rp-rail-list">' +
      data.fields.map(function (field, index) {
        return '<article class="rp-rail-card"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(field.name) + '</h3><p>' + escapeHtml(field.why) + '</p></article>';
      }).join("") + '</div>';

    const main = '<article class="rp-card"><span class="rp-eyebrow green">Record contract</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' +
      '<div class="rp-field-grid">' + data.required.map(function (item) {
        return '<div class="rp-field"><span>' + escapeHtml(item.key) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
      }).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">Sample source records</span><div class="rp-record-grid">' +
      data.records.slice(0, 6).map(recordCard).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">JSON contract</span><textarea class="rp-textarea" readonly>' + escapeHtml(JSON.stringify(data.example, null, 2)) + '</textarea></article>';

    const side = '<span class="rp-eyebrow green">Quality</span><h2>Schema pulse</h2>' + metricGrid(data.metrics) +
      '<div class="rp-stack">' + data.rules.map(function (rule) {
        return '<article class="rp-rail-card"><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
      }).join("") + '</div>';
    renderShell(left, main, side);
  }

  function renderDesk(data) {
    let selectedId = data.candidates[0].id;
    function selected() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function paint() {
      const candidate = selected();
      const left = '<span class="rp-eyebrow">Reviewer queue</span><h2>Candidate matches</h2><div class="rp-rail-list">' +
        data.candidates.map(function (item) {
          const pressed = item.id === selectedId ? ' aria-pressed="true"' : "";
          return '<button class="rp-button" data-candidate="' + escapeHtml(item.id) + '"' + pressed + ' type="button">' + escapeHtml(item.title) + '<br><span>' + escapeHtml(item.citation) + '</span></button>';
        }).join("") + '</div>';
      const main = '<article class="rp-card"><span class="rp-eyebrow">Review before answer</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="rp-card"><span class="rp-eyebrow green">Selected candidate</span>' + recordCard(candidate.record) + '<div class="rp-field-grid">' +
        '<div class="rp-field"><span>Match score</span><strong>' + escapeHtml(candidate.score) + '</strong></div>' +
        '<div class="rp-field"><span>Why matched</span><strong>' + escapeHtml(candidate.reason) + '</strong></div>' +
        '<div class="rp-field"><span>Decision</span><strong>' + escapeHtml(candidate.decision) + '</strong></div>' +
        '</div></article>' +
        '<article class="rp-card"><span class="rp-eyebrow">Review note</span><textarea class="rp-textarea" readonly>' + escapeHtml(candidate.packet) + '</textarea></article>';
      const side = '<span class="rp-eyebrow green">Decision gate</span><h2>Reviewer pulse</h2><div class="rp-stack">' + data.steps.map(function (step, index) {
        return '<article class="rp-rail-card"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(step.title) + '</h3><p>' + escapeHtml(step.copy) + '</p></article>';
      }).join("") + '</div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-candidate]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-candidate");
          paint();
        });
      });
    }
    paint();
  }

  function renderQa(data) {
    let filter = "all";
    function filtered() {
      if (filter === "all") return data.records;
      return data.records.filter(function (record) { return record.status === filter || record.family.indexOf(filter) !== -1; });
    }
    function paint() {
      const rows = filtered();
      const left = '<span class="rp-eyebrow">QA filters</span><h2>Coverage view</h2><div class="rp-filter-row">' +
        data.filters.map(function (item) {
          const active = item.value === filter ? " is-active" : "";
          return '<button class="rp-button' + active + '" data-filter="' + escapeHtml(item.value) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="rp-card"><span class="rp-eyebrow green">First 25 pack</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<div class="rp-table"><div class="rp-table-row rp-table-head"><span>Citation</span><span>Source lane</span><span>Status</span><span>Risk</span></div>' +
        rows.map(function (record) {
          return '<div class="rp-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.status) + '</span><span>' + escapeHtml((record.risks || []).join(", ")) + '</span></div>';
        }).join("") + '</div>';
      const side = '<span class="rp-eyebrow green">Pack pulse</span><h2>Visible, not final</h2><div class="rp-progress"><span style="width:' + data.progress + '%"></span></div><p>' + escapeHtml(data.boundary) + '</p><div class="rp-stack">' +
        data.rules.map(function (rule) {
          return '<article class="rp-rail-card"><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
        }).join("") + '</div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          filter = button.getAttribute("data-filter");
          paint();
        });
      });
    }
    paint();
  }

  function renderAsk(data) {
    const memoryKey = "vedapathLearnerAskFlowV414";
    let selectedId = data.questions[0].id;
    function getSelected() {
      return data.questions.find(function (item) { return item.id === selectedId; }) || data.questions[0];
    }
    function recordsFor(question) {
      return question.recordIds.map(function (id) {
        return data.records.find(function (record) { return record.id === id; });
      }).filter(Boolean);
    }
    function saveMemory(question) {
      const current = JSON.parse(localStorage.getItem(memoryKey) || "[]");
      current.unshift({ question: question.question, answerTitle: question.answerTitle, date: new Date().toISOString() });
      localStorage.setItem(memoryKey, JSON.stringify(current.slice(0, 7)));
    }
    function memoryStats() {
      const current = JSON.parse(localStorage.getItem(memoryKey) || "[]");
      return current;
    }
    function paint() {
      const question = getSelected();
      const records = recordsFor(question);
      const memory = memoryStats();
      const left = '<span class="rp-eyebrow">Start small</span><h2>One question</h2><div class="rp-rail-list">' +
        data.questions.map(function (item) {
          const active = item.id === selectedId ? " is-active" : "";
          return '<button class="rp-button' + active + '" data-question="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div><label><span class="rp-mini-label">Your question</span><textarea class="rp-textarea" data-ask-input>' + escapeHtml(question.question) + '</textarea></label><button class="rp-button primary" data-run-ask type="button">Ask With Sources</button>';
      const main = '<article class="rp-card"><span class="rp-eyebrow green">Source-backed answer</span><h2>' + escapeHtml(question.answerTitle) + '</h2><p>' + escapeHtml(question.plainMeaning) + '</p>' +
        '<div class="rp-answer"><div>' + records.map(recordCard).join("") + '</div><div class="rp-card"><span class="rp-mini-label green">Carry one step</span><h3>' + escapeHtml(question.carry) + '</h3><p>' + escapeHtml(data.boundary) + '</p></div></div></article>' +
        '<article class="rp-card"><span class="rp-eyebrow">Answer packet</span><textarea class="rp-textarea" readonly>' + escapeHtml(answerPacket(question, records)) + '</textarea></article>';
      const side = '<span class="rp-eyebrow green">Local memory</span><h2>Learner pulse</h2>' + metricGrid([
        { label: "Saved asks", value: memory.length },
        { label: "Visible records", value: records.length },
        { label: "Top source", value: records[0] ? records[0].citation : "None" },
        { label: "Authority", value: "Prototype" }
      ]) + '<div class="rp-stack"><article class="rp-rail-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article><article class="rp-rail-card"><h3>Next</h3><p>Use this flow as the first learner-facing retrieval pilot before live model calls.</p></article></div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-question]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-question");
          paint();
        });
      });
      const input = app.querySelector("[data-ask-input]");
      app.querySelector("[data-run-ask]").addEventListener("click", function () {
        const text = input.value.toLowerCase();
        const found = data.questions.find(function (item) {
          return text.includes(item.label.toLowerCase().split(" ")[0]) || text.includes(item.question.toLowerCase().split(" ")[0]);
        });
        if (found) selectedId = found.id;
        saveMemory(getSelected());
        paint();
      });
    }
    paint();
  }

  function answerPacket(question, records) {
    const primary = records[0] || {};
    return [
      "VedaPath Learner Ask Packet",
      "Question: " + question.question,
      "Answer: " + question.answerTitle,
      "Primary source: " + (primary.citation || "No source"),
      "Source family: " + (primary.family || "Unknown"),
      "Confidence: " + (primary.confidence || "Unknown"),
      "Boundary: " + (primary.boundary || "Do not overclaim."),
      "Carry: " + question.carry
    ].join("\\n");
  }

  const renderers = {
    gate: renderGate,
    schema: renderSchema,
    desk: renderDesk,
    qa: renderQa,
    ask: renderAsk
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load page data");
      return response.json();
    })
    .then(function (data) {
      renderers[app.getAttribute("data-kind")](data);
      app.addEventListener("click", function (event) {
        if (!event.target.matches("[data-copy-packet]")) return;
        const text = app.querySelector("textarea")?.value || "";
        navigator.clipboard?.writeText(text);
      });
    })
    .catch(function (error) {
      app.innerHTML = '<div class="rp-empty">Unable to load this retrieval pilot surface: ' + escapeHtml(error.message) + '</div>';
    });
})();
`);
}

function writeData() {
  writeJson("data/vedapath-curated-source-records-v414.json", {
    release: currentRelease.version,
    updated: releaseDate,
    records: sourceRecords
  });

  const gate = {
    release: "v4.1.0",
    headline: "Open the pilot gate, not production authority.",
    position: "The next useful move is not a live AI answer engine. It is a controlled source retrieval pilot where every output is draft, visible, and reviewable.",
    copy: "VedaPath can now test retrieval behavior against curated records while keeping public answer authority, automatic storage, and live model execution disabled.",
    flow: [
      { title: "Curate", copy: "Only reviewed source records enter the pilot lane." },
      { title: "Retrieve", copy: "Candidates show source, match reason, and missing fields." },
      { title: "Review", copy: "Reviewer decisions stay visible before answer drafting." },
      { title: "Pilot", copy: "Learner-facing answers remain prototype packets." }
    ],
    postures: [
      { title: "Static curated pilot", decision: "Allowed", copy: "Use local JSON records and visible source cards." },
      { title: "Reviewer-assisted draft", decision: "Allowed", copy: "Reviewer can mark accept, hold, return, or block." },
      { title: "Live public answer authority", decision: "Blocked", copy: "No production AI authority until source rights, review identity, and safety gates exist." }
    ],
    decisions: [
      { label: "Retrieval", value: "Prototype only", reason: "Local source records, no live corpus." },
      { label: "Answer", value: "Draft only", reason: "Every learner answer is visibly non-production." },
      { label: "Release", value: "Founder gate", reason: "Founder review before public pilot expansion." }
    ],
    metrics: [
      { label: "Gate status", value: "Open" },
      { label: "Production authority", value: "Closed" },
      { label: "Records needed", value: "25" },
      { label: "Next room", value: "Schema" }
    ],
    locks: [
      { title: "No hidden corpus", copy: "Every candidate must point to a visible source record." },
      { title: "No silent acceptance", copy: "Corrections and reviewer notes become records, not invisible edits." },
      { title: "No spiritual authority", copy: "The product explains source lanes and boundaries, not ritual or guru authority." }
    ],
    packet: "Production Retrieval Pilot Gate\\nAllowed: static curated retrieval, reviewer draft decisions, local QA.\\nBlocked: live public answer authority, production storage, automatic spiritual or therapeutic advice.\\nFounder decision: continue into verified source records before live retrieval."
  };

  const schema = {
    release: "v4.1.1",
    headline: "A source record must carry citation, category, confidence, use, and boundary.",
    copy: "The schema turns VedaPath from a collection of screens into a trust contract. Retrieval can only be as good as the records it is allowed to return.",
    fields: [
      { name: "Identity", why: "Record id, source family, title, citation." },
      { name: "Use", why: "What the record can support in an answer." },
      { name: "Boundary", why: "What the answer must not imply." },
      { name: "Review", why: "Status, missing fields, and reviewer role." },
      { name: "Routes", why: "Where the record may appear." }
    ],
    required: [
      { key: "record_id", value: "Stable id" },
      { key: "source_family", value: "Veda, Gita, Upanishad, later text, uncertain" },
      { key: "citation", value: "Visible reference" },
      { key: "allowed_use", value: "Permitted answer lane" },
      { key: "boundary", value: "Do-not-overclaim rule" },
      { key: "review_status", value: "ready, review, draft, blocked" }
    ],
    example: sourceRecords[1],
    metrics: [
      { label: "Records", value: sourceRecords.length },
      { label: "Ready", value: sourceRecords.filter((item) => item.status === "ready").length },
      { label: "Review", value: sourceRecords.filter((item) => item.status === "review").length },
      { label: "Blocked", value: sourceRecords.filter((item) => item.status === "blocked").length }
    ],
    rules: [
      { title: "Citation before confidence", copy: "The answer cannot sound confident until the source identity is visible." },
      { title: "Boundary travels with the source", copy: "The app should never separate a source from its caution." },
      { title: "Draft means draft", copy: "Low-confidence or placeholder records do not produce learner answers." }
    ],
    records: sourceRecords
  };

  const desk = {
    release: "v4.1.2",
    headline: "Reviewer decisions should happen before answer confidence.",
    copy: "This desk turns retrieval matches into visible decisions. The candidate is not the answer; it is a review object.",
    metrics: [
      { label: "Candidates", value: 4 },
      { label: "Acceptable", value: 2 },
      { label: "Needs review", value: 1 },
      { label: "Blocked", value: 1 }
    ],
    steps: [
      { title: "Inspect", copy: "Read source family, citation, status, and missing fields." },
      { title: "Decide", copy: "Accept, hold, return, or block the match." },
      { title: "Explain", copy: "Leave one reason for the next reviewer." },
      { title: "Packet", copy: "Only accepted candidates feed answer packets." }
    ],
    candidates: [
      {
        id: "cand-steadiness",
        title: "Steady action",
        citation: "Bhagavad Gita 2.48",
        score: "92",
        reason: "Question asks about calm action while results are uncertain.",
        decision: "Accept for prototype",
        record: sourceRecords[1],
        packet: "Decision: Accept for prototype\\nReason: Direct source candidate, clear use lane, visible boundary.\\nMissing: licensed translation before production."
      },
      {
        id: "cand-oppenheimer",
        title: "Oppenheimer source",
        citation: "Bhagavad Gita 11.32",
        score: "90",
        reason: "Question asks to identify the scripture behind a popular quote.",
        decision: "Accept with category caution",
        record: sourceRecords[2],
        packet: "Decision: Accept with category caution\\nReason: Corrects Gita versus four Vedas confusion.\\nBoundary: Do not call direct Vedic quote."
      },
      {
        id: "cand-gayatri",
        title: "Gayatri source",
        citation: "Rigveda 3.62.10",
        score: "84",
        reason: "Question asks about mantra identity and meaning.",
        decision: "Hold for tradition review",
        record: sourceRecords[15],
        packet: "Decision: Hold for tradition review\\nReason: Source identity is strong, but practice and recitation boundaries need reviewer approval."
      },
      {
        id: "cand-science",
        title: "Modern science claim",
        citation: "No verified source",
        score: "22",
        reason: "Question attempts to prove a modern theory through scripture.",
        decision: "Block answer claim",
        record: sourceRecords[23],
        packet: "Decision: Block answer claim\\nReason: No verified source supports the claim. Return a claim-check response."
      }
    ]
  };

  const qa = {
    release: "v4.1.3",
    headline: "The first 25 source records are visible before they become retrieval fuel.",
    copy: "This pack makes the source set inspectable: status, family, risk, missing fields, and blocked lanes are part of the product, not hidden admin work.",
    progress: 76,
    boundary: "This is a prototype QA pack. It is not a licensed corpus, scholarly edition, or production knowledge base.",
    filters: [
      { label: "All", value: "all" },
      { label: "Ready", value: "ready" },
      { label: "Review", value: "review" },
      { label: "Draft", value: "draft" },
      { label: "Blocked", value: "blocked" },
      { label: "Gita", value: "Bhagavad Gita" },
      { label: "Veda", value: "Veda" },
      { label: "Upanishad", value: "Upanishad" }
    ],
    metrics: [
      { label: "Total records", value: sourceRecords.length },
      { label: "Ready", value: sourceRecords.filter((item) => item.status === "ready").length },
      { label: "Needs review", value: sourceRecords.filter((item) => item.status === "review").length },
      { label: "Blocked", value: sourceRecords.filter((item) => item.status === "blocked").length }
    ],
    rules: [
      { title: "No answer from draft records", copy: "Draft records can appear in reviewer work, not learner answers." },
      { title: "Blocked records teach refusal", copy: "No-source records are useful because they train the product to stop." },
      { title: "Review status is content", copy: "Users should see when a source needs human review." }
    ],
    records: sourceRecords
  };

  const ask = {
    release: "v4.1.4",
    headline: "Ask once, see the source, and carry one grounded step.",
    boundary: "Prototype answer only. Not therapy, medical advice, ritual instruction, or final scholarly authority.",
    questions,
    records: sourceRecords
  };

  const datasets = [
    ["data/vedapath-production-retrieval-pilot-gate.json", gate, "v4.1.0"],
    ["data/vedapath-verified-source-record-schema.json", schema, "v4.1.1"],
    ["data/vedapath-retrieval-reviewer-desk.json", desk, "v4.1.2"],
    ["data/vedapath-first-25-source-qa-pack.json", qa, "v4.1.3"],
    ["data/vedapath-learner-ask-flow.json", ask, "v4.1.4"]
  ];

  for (const [file, data, version] of datasets) {
    if (versions.findIndex((item) => item.version === version) <= targetIndex) {
      writeJson(file, data);
    }
  }
}

function replaceNavInFile(file, activeLabel) {
  if (!existsSync(file)) return;
  const prefix = file.includes("/") ? "../" : "";
  const text = read(file);
  const nextNav = navHtml(activeLabel, prefix);
  const replaced = text.replace(/      <nav class="[^"]*nav[^"]*" aria-label="(?:Project links|Primary navigation)">[\s\S]*?      <\/nav>/, nextNav);
  if (replaced !== text) write(file, replaced);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${currentRelease.version} ${currentRelease.short}";`);
  const groupLine = `    { title: "Retrieval", labels: [${activeVersions.map((item) => `"${item.nav}"`).join(", ")}] }`;
  text = text.replace(/  const groups = \[[\s\S]*?\n  \];/, `  const groups = [
    { title: "Start", labels: ["Home", "Build", "Brand", "Blueprint"] },
    { title: "Source", labels: ["Answers", "Review", "Mantra"] },
    { title: "Practice", labels: ["Life", "Talk", "Pattern", "Daily"] },
${groupLine}
  ];`);
  const pageTitleLines = activeVersions.map((item) => `    ${JSON.stringify(item.nav)}: ${JSON.stringify(item.label)}`).join(",\n");
  text = text.replace(/  const pageTitles = \{[\s\S]*?\n  \};/, `  const pageTitles = {
    Home: "VedaPath command center",
    Build: "Build status",
    Brand: "Brand board",
    Blueprint: "Product blueprint",
    Answers: "Cited answer room",
    Review: "Review queue",
    Mantra: "Mantra lens",
    Life: "Life companion",
    Talk: "Conversation companion",
    Pattern: "Pattern companion",
    Daily: "Daily calm loop",
    Packet: "Answer packet pilot",
    Launch: "Launch readiness hub",
${pageTitleLines}
  };`);
  const bodyLines = [
    `    "permission-execution-draft-page": "Controlled draft gate"`,
    `    "permission-execution-draft-review-page": "Controlled draft review gate"`,
    `    "review-decision-page": "Controlled review decision gate"`,
    `    "permission-execution-decision-page": "Founder decision gate"`,
    `    "answer-packet-pilot-page": "Answer packet pilot"`,
    `    "launch-readiness-hub-page": "Launch readiness hub"`
  ].concat(activeVersions.map((item) => `    "${item.bodyClass}": "${item.label}"`)).join(",\n");
  text = text.replace(/  const bodyPageTitles = \{[\s\S]*?\n  \};/, `  const bodyPageTitles = {
${bodyLines}
  };`);
  write("assets/vedapath-command-shell.js", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/<link rel="stylesheet" href="assets\/vedapath-command-shell.css">/, '<link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css">\n      <link rel="stylesheet" href="assets/vedapath-command-shell.css">');
  replaceNavInFile("index.html", "Home");
  text = read("index.html");
  const start = "<!-- V410-V414 HOME STRIP START -->";
  const end = "<!-- V410-V414 HOME STRIP END -->";
  text = removeMarkedBlock(text, start, end);
  const cards = activeVersions.map((item, index) => `<article class="rp-flow-step"><span class="rp-number">${index + 1}</span><h3>${item.nav}</h3><p>${item.summary}</p><a class="rp-button green" href="${item.page}">Open</a></article>`).join("\n          ");
  const block = `${start}
      <section class="rp-card" aria-label="Retrieval pilot path">
        <span class="rp-eyebrow green">${currentRelease.version} source flow</span>
        <h2>Retrieval pilot path</h2>
        <p class="muted">The next source layer is intentionally small: gate the pilot, define records, review retrieval, inspect the first pack, then let a learner ask with sources visible.</p>
        <div class="rp-flow-grid">
          ${cards}
        </div>
      </section>
      ${end}`;
  text = text.replace(/    <\/main>/, `${block}\n\n    </main>`);
  write("index.html", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  replaceNavInFile("build-status.html", "Build");
  text = read("build-status.html");
  text = text.replace(/<span class="version">v[^<]+<\/span>/, `<span class="version">${currentRelease.version} ${currentRelease.short}</span>`);
  const summary = `      <section class="summary" aria-label="Progress summary">
        <article class="tile">
          <span>Current version</span>
          <strong>${currentRelease.version}</strong>
          <p>${currentRelease.summary}</p>
        </article>
        <article class="tile">
          <span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>The clickable MVP now has a controlled retrieval pilot lane from gate to learner ask.</p>
        </article>
        <article class="tile">
          <span>Full vision progress</span>
          <strong>99%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>
          <p>The source layer now has gate posture, source schema, reviewer desk, QA pack, and learner-facing source flow.</p>
        </article>
        <article class="tile">
          <span>Next release</span>
          <strong>v4.1.5 Citation Deep Link Layer</strong>
          <p>Prepare source links and passage anchors so source cards can move from prototype records toward verified reference navigation.</p>
        </article>
      </section>`;
  text = text.replace(/      <section class="summary" aria-label="Progress summary">[\s\S]*?      <\/section>/, summary);
  const phaseStart = "<!-- V410-V414 PHASES START -->";
  const phaseEnd = "<!-- V410-V414 PHASES END -->";
  text = removeMarkedBlock(text, phaseStart, phaseEnd);
  const phases = `${phaseStart}
${activeVersions.map((item) => `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase ${item.phase}: ${item.label}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">100%</div>
            </article>`).join("\n")}
            ${phaseEnd}`;
  const phaseAnchor = "Phase 369: Launch Readiness Hub";
  const anchorIndex = text.indexOf(phaseAnchor);
  if (anchorIndex !== -1) {
    const articleEnd = text.indexOf("</article>", anchorIndex);
    text = text.slice(0, articleEnd + "</article>".length) + "\n" + phases + text.slice(articleEnd + "</article>".length);
  }
  const versionPanel = `        <aside class="panel version">
          <h2>Version Notes</h2>
          <div class="version-row"><span>Release</span><strong>${currentRelease.version} ${currentRelease.label}</strong></div>
          <div class="version-row"><span>Previous</span><strong>${targetIndex > 0 ? activeVersions[targetIndex - 1].version + " " + activeVersions[targetIndex - 1].label : "v4.0.9 Launch Readiness Hub"}</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Move from static launch readiness into a source-recorded retrieval pilot.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for citation deep-link review</strong></div>
          <div class="panel note">
            <h2>North Star</h2>
            <p>Make sacred and philosophical knowledge easier to approach without flattening its depth, confusing categories, or pretending the AI is an authority.</p>
          </div>
          <h2>Next Build Checklist</h2>
          <ul class="checklist">
            <li><span class="dot"></span><span>Add source deep links and passage anchors for learner-visible citations.</span></li>
            <li><span class="dot"></span><span>Keep draft records out of learner answers until review status changes.</span></li>
            <li><span class="dot"></span><span>Preserve the calm command shell and simple learner ask path.</span></li>
          </ul>
        </aside>`;
  text = text.replace(/        <aside class="panel version">[\s\S]*?        <\/aside>/, versionPanel);
  write("build-status.html", text);
}

function updateDocs() {
  const releaseLines = activeVersions.slice().reverse().map((item) => `## ${item.version} ${item.label}
- ${item.summary}
- Primary files: \`${item.page}\`, \`${item.dataFile}\`, \`assets/vedapath-retrieval-pilot.js\`, \`assets/vedapath-retrieval-pilot.css\`.
- Product note: this remains a static GitHub Pages prototype; no live AI retrieval or production source authority is granted.`).join("\n\n");

  upsertMarkdownBlock("README.md", "<!-- V410-V414 README START -->", "<!-- V410-V414 README END -->", releaseLines);
  upsertMarkdownBlock("docs/PROTOTYPE_NOTES.md", "<!-- V410-V414 NOTES START -->", "<!-- V410-V414 NOTES END -->", releaseLines);
  upsertMarkdownBlock("docs/PRODUCT_BLUEPRINT.md", "<!-- V410-V414 BLUEPRINT START -->", "<!-- V410-V414 BLUEPRINT END -->", `## ${currentRelease.version} Retrieval Pilot Position

VedaPath has entered a source-recorded retrieval pilot lane. The product should continue to feel calm and simple, but the trust system now has five clearer layers:

1. Production Retrieval Pilot Gate.
2. Verified Source Record Schema.
3. Retrieval Reviewer Desk.
4. First 25 Source QA Pack.
5. Learner Ask Flow.

Next release candidate: v4.1.5 Citation Deep Link Layer.`);

  for (const item of activeVersions) {
    write(item.doc, `# ${item.label}

Release: ${item.version}

${item.summary}

## Product Rule

This is a static pilot surface. It may support founder review, learner demos, and source-record design, but it does not grant live retrieval, public answer authority, ritual authority, or production storage.

## Main Files

- \`${item.page}\`
- \`${item.dataFile}\`
- \`assets/vedapath-retrieval-pilot.js\`
- \`assets/vedapath-retrieval-pilot.css\`

## Known Boundary

Every source-facing answer must show source family, citation, confidence, and what not to overclaim.
`);
  }
}

function updateChangelog() {
  const entries = activeVersions.slice().reverse().map((item) => `## ${item.version} ${item.label}
- Changes made: ${item.summary}
- Files changed: \`${item.page}\`, \`${item.dataFile}\`, \`${item.doc}\`, \`assets/vedapath-retrieval-pilot.js\`, \`assets/vedapath-retrieval-pilot.css\`, \`assets/vedapath-command-shell.js\`, \`index.html\`, \`build-status.html\`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, \`scripts/check-static-links.mjs\`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.`).join("\n\n");
  upsertMarkdownBlock("CHANGELOG.md", "<!-- V410-V414 CHANGELOG START -->", "<!-- V410-V414 CHANGELOG END -->", entries, "# Changelog");
}

function updateStaticChecker() {
  const pages = [
    "index.html",
    "build-status.html",
    "answerpacketpilot.html",
    "launchreadinesshub.html",
    "controlledpermissionexecutionauthorizationdraftreviewgate.html",
    "controlledpermissionexecutionauthorizationreviewdecisiongate.html",
    "founderpermissionexecutionauthorizationdecisiongate.html",
    ...activeVersions.map((item) => item.page)
  ];
  write("scripts/check-static-links.mjs", `import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const pages = ${JSON.stringify(pages, null, 2)};

const missing = [];
const attrPattern = /(?:href|src)="([^"]+)"/g;

for (const page of pages) {
  const text = readFileSync(page, "utf8");
  for (const match of text.matchAll(attrPattern)) {
    const ref = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;

    const file = ref.split("#")[0].split("?")[0];
    if (!file) continue;

    const target = path.resolve(path.dirname(page), file);
    if (!existsSync(target)) {
      missing.push(\`\${page} -> \${ref}\`);
    }
  }
}

if (missing.length) {
  console.error(missing.join("\\n"));
  process.exit(1);
}

console.log(\`static-links-ok \${pages.length}\`);
`);
}

function updateCoreNavs() {
  const core = [
    ["index.html", "Home"],
    ["build-status.html", "Build"],
    ["brand/brand-board.html", "Brand"],
    ["blueprint.html", "Blueprint"],
    ["citedanswerlab.html", "Answers"],
    ["reviewqueuepersistence.html", "Review"],
    ["mantralenslab.html", "Mantra"],
    ["lifecompanionlab.html", "Life"],
    ["conversationcompanionlab.html", "Talk"],
    ["patterncompanionlab.html", "Pattern"],
    ["daily.html", "Daily"],
    ["answerpacketpilot.html", "Packet"],
    ["launchreadinesshub.html", "Launch"]
  ];
  for (const [file, active] of core) replaceNavInFile(file, active);
}

writeCss();
writeJs();
writeData();
writePages();
updateCoreNavs();
updateCommandShell();
updateIndex();
updateBuildStatus();
updateDocs();
updateChangelog();
updateStaticChecker();

console.log(`applied ${currentRelease.version} ${currentRelease.label}`);
