import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.4.5 qa harness";
const checkCommand = "`node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms";
const staticRisk = "Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.";

const baseNav = [
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
  ["Launch", "launchreadinesshub.html"],
  ["Pilot", "productionretrievalpilotgate.html"],
  ["Records", "verifiedsourcerecordschema.html"],
  ["Desk", "retrievalreviewerdesk.html"],
  ["QA Pack", "first25sourceqapack.html"],
  ["Ask Flow", "learneraskflow.html"],
  ["Links", "citationdeeplinklayer.html"],
  ["Rights", "sourceeditionrightsmatrix.html"],
  ["History", "reviewerdecisionhistory.html"],
  ["Score", "retrievalscoringexplanation.html"],
  ["Waitlist", "publicpilotwaitlistgate.html"],
  ["Edition", "sourceeditionintake.html"],
  ["Rights Desk", "rightsreviewdesk.html"],
  ["Identity", "revieweridentitylite.html"],
  ["Promote", "answerpromotionrules.html"],
  ["Invite", "pilotinvitepacket.html"],
  ["Telemetry", "pilottelemetryconsent.html"],
  ["Signals", "pilotlearningsignalreview.html"],
  ["First Session", "firstsessionlaunchspine.html"],
  ["Source Triage", "sourcereadinesstriage.html"],
  ["Answer Gate", "answerreadinessgate.html"],
  ["Launch Console", "privatepilotlaunchconsole.html"],
  ["Feedback", "pilotfeedbackintake.html"],
  ["Feedback Desk", "feedbackreviewdesk.html"],
  ["Session Script", "pilotusersessionscript.html"],
  ["Safety", "launchsafetychecklist.html"],
  ["Readiness Score", "privatepilotreadinessscore.html"],
  ["Invite Review", "pilotinvitereview.html"],
  ["Rights Board", "sourcerightsapprovalboard.html"],
  ["Session Export", "pilotsessionexportpacket.html"],
  ["Feedback Audit", "feedbacktoticketaudittrail.html"],
  ["Retrieval Adapter", "retrievaladaptershell.html"],
  ["Fixture Adapter", "retrievalfixtureadapter.html"],
  ["Ranking Contract", "sourcecandidaterankingcontract.html"],
  ["No-Source", "nosourceanswerbehavior.html"],
  ["Citation Packet", "citationpacketrenderer.html"],
  ["QA Harness", "retrievalqaharness.html"]
];

const sharedRecords = [
  {
    id: "bg-2-48-steadiness",
    status: "ready",
    title: "Steady action",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports a careful reflection on steady action without promising emotional control or perfect results.",
    confidence: "High | 86/100",
    boundary: "Reflection support only; not therapy, medical advice, ritual instruction, or spiritual command.",
    missingFields: ["licensed translation display", "reviewer note"]
  },
  {
    id: "bg-11-32-time",
    status: "ready",
    title: "Oppenheimer source correction",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    summary: "Corrects the common category confusion: the famous line is associated with the Gita, not the four Vedas.",
    confidence: "High | 91/100",
    boundary: "Do not call it a direct quote from the four Vedas.",
    missingFields: ["translation variant review"]
  },
  {
    id: "rigveda-3-62-10-gayatri",
    status: "review",
    title: "Gayatri mantra review candidate",
    citation: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    summary: "A high-value source candidate that must stay in review until Sanskrit, recitation, and rights posture are stronger.",
    confidence: "Medium | 68/100",
    boundary: "No ritual instruction, initiation advice, or pronunciation authority.",
    missingFields: ["recitation boundary", "rights approval", "mantra reviewer"]
  },
  {
    id: "no-source-modern-airplane",
    status: "no-source",
    title: "Airplane claim gap",
    citation: "No reviewed source candidate",
    family: "No-source gap",
    summary: "The fixture set should refuse confident answers about modern technology claims when no reviewed source supports them.",
    confidence: "Low | 8/100",
    boundary: "Create a review ticket instead of inventing source support.",
    missingFields: ["reviewed source", "claim evidence", "scholar note"]
  }
];

const versions = [
  {
    version: "v4.4.1",
    badge: "v4.4.1 fixture adapter",
    label: "Fixture Adapter",
    href: "retrievalfixtureadapter.html",
    pageClass: "retrieval-fixture-adapter-page",
    pageTitle: "Retrieval Fixture Adapter",
    small: "fixture adapter",
    kind: "desk",
    docFile: "docs/RETRIEVAL_FIXTURE_ADAPTER.md",
    dataFile: "data/vedapath-retrieval-fixture-adapter.json",
    changes: "Adds a visible fixture adapter room that reads curated source candidates, exposes source ids, match reasons, confidence, and blocks answer composition until review.",
    headline: "Read fixtures before any answer exists.",
    copy: "The adapter shows exactly which local record would be returned for a learner question, why it matched, and what still blocks production use.",
    data: {
      headline: "Read fixtures before any answer exists.",
      copy: "This room is the first visible adapter over local curated records. It returns candidate evidence, not generated answers.",
      metrics: [
        { label: "Fixture records", value: "4" },
        { label: "Answer writes", value: "0" },
        { label: "Network calls", value: "0" },
        { label: "Live AI", value: "off" }
      ],
      candidates: [
        {
          id: "calm-action",
          title: "Calm action question",
          citation: "Bhagavad Gita 2.48",
          score: "86",
          reason: "Matches calm, action, result, and Gita 2.48 terms with a reviewed-preview record.",
          decision: "Return citation packet only",
          packet: "Adapter result: bg-2-48-steadiness | Bhagavad Gita 2.48 | confidence 86 | return evidence first | do not compose a final answer.",
          record: sharedRecords[0]
        },
        {
          id: "oppenheimer-source",
          title: "Oppenheimer source correction",
          citation: "Bhagavad Gita 11.32",
          score: "91",
          reason: "Exact alias and citation match: Oppenheimer, death quote, Gita 11.32.",
          decision: "Return source correction",
          packet: "Adapter result: bg-11-32-time | Bhagavad Gita 11.32 | confidence 91 | source correction allowed with boundary.",
          record: sharedRecords[1]
        },
        {
          id: "gayatri-review",
          title: "Gayatri mantra review",
          citation: "Rigveda 3.62.10",
          score: "68",
          reason: "Known source candidate, but recitation and rights boundaries keep it review-needed.",
          decision: "Return review-needed packet",
          packet: "Adapter result: rigveda-3-62-10-gayatri | Rigveda 3.62.10 | confidence 68 | hold answer expansion until mantra review.",
          record: sharedRecords[2]
        }
      ],
      steps: [
        { title: "Load fixtures", copy: "Read only local curated JSON." },
        { title: "Match record", copy: "Return source id, citation, and reason." },
        { title: "Block unsafe use", copy: "Hold records with rights or review gaps." },
        { title: "No answer yet", copy: "Answer composition stays disabled." }
      ]
    }
  },
  {
    version: "v4.4.2",
    badge: "v4.4.2 ranking contract",
    label: "Ranking Contract",
    href: "sourcecandidaterankingcontract.html",
    pageClass: "source-candidate-ranking-contract-page",
    pageTitle: "Source Candidate Ranking Contract",
    small: "ranking contract",
    kind: "gate",
    docFile: "docs/SOURCE_CANDIDATE_RANKING_CONTRACT.md",
    dataFile: "data/vedapath-source-candidate-ranking-contract.json",
    changes: "Adds a ranking contract room that names fit, citation, rights, review state, and boundary penalties before a source candidate can be top-ranked.",
    headline: "Rank by trust, not by confidence alone.",
    copy: "The ranking contract keeps source fit, citation quality, rights posture, review state, and boundary risk visible before answer rendering.",
    data: {
      position: "Ranking should reward direct evidence and penalize rights gaps, review gaps, and risky overclaiming.",
      headline: "Rank by trust, not by confidence alone.",
      copy: "A candidate may match the words in a question and still be unsafe for an answer if rights, review, or boundary signals are weak.",
      postures: [
        { decision: "Allowed", title: "Direct reviewed source", copy: "Reviewed source id, citation, and answer boundary are all present." },
        { decision: "Review", title: "Useful but incomplete", copy: "Candidate exists, but rights, translation, or reviewer fields are incomplete." },
        { decision: "Blocked", title: "No reliable source", copy: "No reviewed source supports the claim or the claim asks for overreach." }
      ],
      flow: [
        { title: "Fit", copy: "Question terms match the source record." },
        { title: "Citation", copy: "Citation and source id are stable." },
        { title: "Rights", copy: "Allowed use is visible." },
        { title: "Boundary", copy: "Overclaim risk is penalized." }
      ],
      decisions: [
        { label: "Fit score", value: "+40", reason: "Strong semantic or curated alias match." },
        { label: "Citation quality", value: "+20", reason: "Stable source id, family, and citation." },
        { label: "Rights hold", value: "-30", reason: "Missing edition or display permission blocks answer rendering." },
        { label: "Review hold", value: "-25", reason: "Mantra, commentary, or claim-check records need human review." },
        { label: "Overclaim risk", value: "-40", reason: "Modern proof, miracle, medical, ritual, or authority claims must not rank into answers." },
        { label: "No-source floor", value: "<20", reason: "Below threshold, create a ticket instead of answering." }
      ],
      packet: "Ranking contract v4.4.2\nReturn: source_id, citation, family, fit_score, citation_score, rights_penalty, review_penalty, boundary_penalty, final_score, decision.\nNever rank a blocked source into answer-ready output.",
      metrics: [
        { label: "Scoring lanes", value: "5" },
        { label: "Blocked penalty", value: "-40" },
        { label: "No-source floor", value: "<20" },
        { label: "Answer writes", value: "0" }
      ],
      locks: [
        { title: "Rights before rank", copy: "Citation is not permission." },
        { title: "Review before confidence", copy: "A useful source can still need human review." },
        { title: "Refusal before overclaim", copy: "Low or risky matches should become no-source packets." }
      ]
    }
  },
  {
    version: "v4.4.3",
    badge: "v4.4.3 no-source",
    label: "No-Source",
    href: "nosourceanswerbehavior.html",
    pageClass: "no-source-answer-behavior-page",
    pageTitle: "No-Source Answer Behavior",
    small: "no-source behavior",
    kind: "gate",
    docFile: "docs/NO_SOURCE_ANSWER_BEHAVIOR.md",
    dataFile: "data/vedapath-no-source-answer-behavior.json",
    changes: "Adds a no-source behavior room so VedaPath has a graceful answer path when the fixture set cannot support a question.",
    headline: "When the source is not there, say so calmly.",
    copy: "The no-source behavior protects trust by refusing weak answers and creating a review path instead of pretending coverage.",
    data: {
      position: "No-source is a product feature, not a failure. It keeps trust higher than false helpfulness.",
      headline: "When the source is not there, say so calmly.",
      copy: "This room defines what the user sees when a question has no reviewed source candidate or when the candidate is blocked.",
      postures: [
        { decision: "Allowed", title: "Reviewed source exists", copy: "Return citation packet and boundary before answer text." },
        { decision: "Review", title: "Weak or incomplete source", copy: "Show candidate and invite review instead of final answer." },
        { decision: "Blocked", title: "No reviewed source", copy: "Say the current source set cannot support the claim." }
      ],
      flow: [
        { title: "Acknowledge", copy: "Name that the question is valid but the source set is limited." },
        { title: "Boundary", copy: "Do not invent proof, authority, or certainty." },
        { title: "Route", copy: "Create a source-gap or review-needed ticket." },
        { title: "Offer next", copy: "Suggest a nearby safe source family only if known." }
      ],
      decisions: [
        { label: "Airplane claim", value: "No-source", reason: "No reviewed source in the fixture set supports the modern technology claim." },
        { label: "Bitcoin claim", value: "No-source", reason: "Modern financial claims cannot be answered from starter sacred-text fixtures." },
        { label: "Medical cure", value: "Blocked", reason: "Medical claims must route to emergency or clinical boundaries, not scripture answers." },
        { label: "Ritual instruction", value: "Review", reason: "Needs tradition, teacher, and ritual context before any guidance." },
        { label: "Category confusion", value: "Answerable", reason: "If a source classification record exists, answer with source labels." },
        { label: "Calm reflection", value: "Answerable", reason: "If framed as reflection and source-backed, answer with boundary." }
      ],
      packet: "No-source answer v4.4.3\nI do not have a reviewed source in this VedaPath fixture set for that claim. I should not invent support. I can create a review ticket with the question, likely source family, missing evidence, and risk.",
      metrics: [
        { label: "No-source cases", value: "4" },
        { label: "Overclaim", value: "blocked" },
        { label: "Ticket route", value: "visible" },
        { label: "Live answer", value: "off" }
      ],
      locks: [
        { title: "No forced answer", copy: "The product must be allowed to pause." },
        { title: "No shame", copy: "The user should feel guided, not corrected harshly." },
        { title: "No hidden expansion", copy: "A no-source case can create a ticket, not silently widen the corpus." }
      ]
    }
  },
  {
    version: "v4.4.4",
    badge: "v4.4.4 citation packet",
    label: "Citation Packet",
    href: "citationpacketrenderer.html",
    pageClass: "citation-packet-renderer-page",
    pageTitle: "Citation Packet Renderer",
    small: "citation packet",
    kind: "ask",
    docFile: "docs/CITATION_PACKET_RENDERER.md",
    dataFile: "data/vedapath-citation-packet-renderer.json",
    changes: "Adds a citation packet renderer that turns a selected source candidate into a structured answer packet with citation, confidence, boundary, and carry action.",
    headline: "Render the citation before the answer.",
    copy: "This renderer makes the source packet feel product-ready while still preventing final AI generation or public authority claims.",
    data: {
      memoryKey: "vedapathCitationPacketRendererV444",
      boundary: "Citation packet only. It supports review and answer drafting, not final production AI output.",
      questions: [
        {
          id: "steady-action",
          label: "Calm action",
          question: "How can I act calmly when results are uncertain?",
          recordIds: ["bg-2-48-steadiness"],
          answerTitle: "Begin with the next honest action, not the result you cannot control.",
          plainMeaning: "The source candidate supports steadiness in action, with a visible boundary against promising instant calm.",
          carry: "Choose one small duty and do it slowly, clearly, and without checking for praise."
        },
        {
          id: "oppenheimer",
          label: "Oppenheimer",
          question: "What scripture did Oppenheimer quote?",
          recordIds: ["bg-11-32-time"],
          answerTitle: "Oppenheimer was quoting the Gita, not the four Vedas.",
          plainMeaning: "The packet should correct the category gently and show the source family.",
          carry: "Say the source precisely before widening the cultural context."
        },
        {
          id: "gayatri",
          label: "Gayatri",
          question: "Explain Gayatri mantra carefully.",
          recordIds: ["rigveda-3-62-10-gayatri"],
          answerTitle: "Gayatri needs source, reverence, and review boundaries.",
          plainMeaning: "The packet can name the source, but answer expansion waits for mantra review.",
          carry: "Respect the review boundary before simplifying the mantra."
        }
      ],
      records: sharedRecords.slice(0, 3)
    }
  },
  {
    version: "v4.4.5",
    badge: "v4.4.5 qa harness",
    label: "QA Harness",
    href: "retrievalqaharness.html",
    pageClass: "retrieval-qa-harness-page",
    pageTitle: "Retrieval QA Harness",
    small: "qa harness",
    kind: "qa",
    docFile: "docs/RETRIEVAL_QA_HARNESS.md",
    dataFile: "data/vedapath-retrieval-qa-harness.json",
    changes: "Adds a retrieval QA harness with pass, review, and no-source cases so future retrieval changes can be checked before they affect answer cards.",
    headline: "Test retrieval before trusting it.",
    copy: "The QA harness makes the fixture adapter accountable: correct citation, expected source family, review holds, and no-source refusals are visible.",
    data: {
      headline: "Test retrieval before trusting it.",
      copy: "This QA harness turns the first retrieval behavior into visible cases that future implementation can run against.",
      progress: 92,
      boundary: "QA harness only. Passing these cases does not prove broad coverage, licensed text display, scholar approval, live AI safety, or production readiness.",
      metrics: [
        { label: "Cases", value: "6" },
        { label: "Pass", value: "3" },
        { label: "Review", value: "1" },
        { label: "No-source", value: "2" }
      ],
      filters: [
        { label: "All", value: "all" },
        { label: "Pass", value: "pass" },
        { label: "Review", value: "review" },
        { label: "No-source", value: "no-source" }
      ],
      records: [
        { citation: "Bhagavad Gita 2.48", family: "Bhagavad Gita | Smriti", status: "pass", risks: ["reflection boundary"] },
        { citation: "Bhagavad Gita 11.32", family: "Bhagavad Gita | Smriti", status: "pass", risks: ["category confusion"] },
        { citation: "Mahabharata classification", family: "Bhagavad Gita | Smriti", status: "pass", risks: ["Shruti/Smriti clarity"] },
        { citation: "Rigveda 3.62.10", family: "Veda | Shruti", status: "review", risks: ["mantra review", "rights approval"] },
        { citation: "No reviewed source", family: "Modern aircraft claim", status: "no-source", risks: ["overclaim"] },
        { citation: "No reviewed source", family: "Bitcoin prediction claim", status: "no-source", risks: ["modern proof claim"] }
      ],
      rules: [
        { title: "Wrong citation fails", copy: "A Gita answer cannot cite the Vedas directly." },
        { title: "Review holds pass only as review", copy: "A useful mantra source should not become answer-ready without review." },
        { title: "No-source is success", copy: "Unsupported modern claims pass only when the product refuses to invent support." }
      ]
    }
  }
];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return readFileSync(filePath(file), "utf8");
}

function write(file, content) {
  writeFileSync(filePath(file), content, "utf8");
}

function insertAfterOnce(text, anchor, addition) {
  if (text.includes(addition.trim())) return text;
  if (!text.includes(anchor)) throw new Error(`Missing anchor: ${anchor.slice(0, 90)}`);
  return text.replace(anchor, anchor + addition);
}

function navHtml(activeLabel) {
  const links = baseNav.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${href}">${label}</a>`;
  }).join("\n");
  return `${links}\n        <span class="version-pill">${finalBadge}</span>`;
}

function pageHtml(item) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${item.pageTitle} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css" />
</head>
<body class="${item.pageClass} retrieval-pilot-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${item.small}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(item.label)}
      </nav>
    </header>

    <section class="rp-opening">
      <div>
        <span class="rp-eyebrow">${item.badge}</span>
        <h1>${item.headline}</h1>
        <p>${item.copy}</p>
      </div>
      <aside class="rp-opening-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>${item.pageTitle}</strong>
        <span>Source first. Calm path.</span>
      </aside>
    </section>

    <section data-retrieval-app data-kind="${item.kind}" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-retrieval-pilot.js"></script>
</body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.pageTitle}

## Product Purpose

${item.changes}

## User Promise

${item.headline}

## Boundary

${staticRisk}

## Data Contract

- Data file: \`${item.dataFile}\`
- Renderer: \`${item.kind}\`
- Page: \`${item.href}\`
- Production writes: disabled

## Checks

- The page loads through the shared command shell.
- The data file parses as JSON.
- The retrieval surface renders evidence, boundary, and review posture.
- The room does not claim live AI, production storage, or source authority.
`;
}

function updateRetrievalPilotAsset() {
  let text = read("assets/vedapath-retrieval-pilot.js");
  text = text.replace('const memoryKey = "vedapathLearnerAskFlowV414";', 'const memoryKey = data.memoryKey || "vedapathLearnerAskFlowV414";');
  write("assets/vedapath-retrieval-pilot.js", text);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  const oldGroup = '{ title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score", "Invite Review", "Rights Board", "Session Export", "Feedback Audit", "Retrieval Adapter"] }';
  const newGroup = '{ title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score", "Invite Review", "Rights Board", "Session Export", "Feedback Audit", "Retrieval Adapter"] },\n    { title: "Retrieval Quality", labels: ["Fixture Adapter", "Ranking Contract", "No-Source", "Citation Packet", "QA Harness"] }';
  text = text.replace(oldGroup, newGroup);
  text = insertAfterOnce(
    text,
    '    "Retrieval Adapter": "First Real Retrieval Adapter Shell"',
    ',\n    "Fixture Adapter": "Retrieval Fixture Adapter",\n    "Ranking Contract": "Source Candidate Ranking Contract",\n    "No-Source": "No-Source Answer Behavior",\n    "Citation Packet": "Citation Packet Renderer",\n    "QA Harness": "Retrieval QA Harness"'
  );
  text = insertAfterOnce(
    text,
    '    "retrieval-adapter-shell-page": "First Real Retrieval Adapter Shell"',
    ',\n    "retrieval-fixture-adapter-page": "Retrieval Fixture Adapter",\n    "source-candidate-ranking-contract-page": "Source Candidate Ranking Contract",\n    "no-source-answer-behavior-page": "No-Source Answer Behavior",\n    "citation-packet-renderer-page": "Citation Packet Renderer",\n    "retrieval-qa-harness-page": "Retrieval QA Harness"'
  );
  if (!text.includes("const extraLinks = [")) {
    const extra = `\n  const extraLinks = [\n    ["Fixture Adapter", "retrievalfixtureadapter.html"],\n    ["Ranking Contract", "sourcecandidaterankingcontract.html"],\n    ["No-Source", "nosourceanswerbehavior.html"],\n    ["Citation Packet", "citationpacketrenderer.html"],\n    ["QA Harness", "retrievalqaharness.html"]\n  ];\n`;
    text = text.replace("  function safeParse(value, fallback) {", `${extra}\n  function safeParse(value, fallback) {`);
  }
  const oldCollect = `  function collectLinks(nav) {
    return Array.from(nav.querySelectorAll("a")).map((link) => ({
      label: link.textContent.trim(),
      href: link.getAttribute("href") || "#",
      active: link.classList.contains("active")
    })).filter((link) => link.label);
  }`;
  const newCollect = `  function collectLinks(nav) {
    const links = Array.from(nav.querySelectorAll("a")).map((link) => ({
      label: link.textContent.trim(),
      href: link.getAttribute("href") || "#",
      active: link.classList.contains("active")
    })).filter((link) => link.label);
    const seen = new Set(links.map((link) => link.label));
    extraLinks.forEach(([label, href]) => {
      if (!seen.has(label)) {
        links.push({
          label,
          href,
          active: normalizePath(href) === normalizePath(location.href)
        });
      }
    });
    return links;
  }`;
  if (text.includes(oldCollect)) text = text.replace(oldCollect, newCollect);
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const additions = versions.map((item) => `  "${item.href}"`).join(",\n");
  if (!text.includes('"retrievalqaharness.html"')) {
    text = text.replace('  "retrievaladaptershell.html"', `  "retrievaladaptershell.html",\n${additions}`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateInlineVersionBadges() {
  const htmlFiles = [
    "index.html",
    "build-status.html",
    "retrievaladaptershell.html",
    "pilotinvitereview.html",
    "sourcerightsapprovalboard.html",
    "pilotsessionexportpacket.html",
    "feedbacktoticketaudittrail.html"
  ];
  for (const file of htmlFiles) {
    if (!existsSync(filePath(file))) continue;
    let text = read(file);
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
    write(file, text);
  }
}

function updateIndex() {
  let text = read("index.html");
  if (!text.includes("V441-V445 HOME STRIP START")) {
    const strip = `

      <!-- V441-V445 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Retrieval quality path">
        <span class="rp-eyebrow green">v4.4.5 retrieval quality</span>
        <h2>Retrieval quality path</h2>
        <p>The next layer turns retrieval into a visible discipline: fixture adapter, ranking contract, no-source behavior, citation packet, and QA harness before live AI.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Fixture Adapter</h3><p>Read fixtures before any answer exists.</p><a class="rp-button green" href="retrievalfixtureadapter.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Ranking Contract</h3><p>Rank by trust, not confidence alone.</p><a class="rp-button green" href="sourcecandidaterankingcontract.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>No-Source</h3><p>Say when the source is not there.</p><a class="rp-button green" href="nosourceanswerbehavior.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Citation Packet</h3><p>Render citation before answer.</p><a class="rp-button green" href="citationpacketrenderer.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>QA Harness</h3><p>Test retrieval before trusting it.</p><a class="rp-button green" href="retrievalqaharness.html">Open</a></article>
        </div>
      </article>
      <!-- V441-V445 HOME STRIP END -->
`;
    text = text.replace("      <!-- V436-V440 HOME STRIP END -->", `      <!-- V436-V440 HOME STRIP END -->${strip}`);
  }
  text = text.replace(/v4\.4\.0 retrieval shell/g, finalBadge);
  text = text.replace(/v4\.4\.0 pilot launch governance/g, "v4.4.5 retrieval quality");
  write("index.html", text);
}

function phaseHtml(number, title, description, active = false) {
  return `            <article class="phase">
              <span class="badge ${active ? "active" : "done"}">${active ? "Active" : "Done"}</span>
              <div>
                <strong>Phase ${number}: ${title}</strong>
                <p>${description}</p>
              </div>
              <div class="percent">100%</div>
            </article>
`;
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<strong>v4\.4\.0<\/strong>\s*<p>First Real Retrieval Adapter Shell completes[^<]+<\/p>/, `<strong>v4.4.5</strong>
          <p>Retrieval QA Harness completes the first source-first retrieval quality path from fixture adapter to citation packet and no-source tests.</p>`);
  text = text.replace(/<p>The clickable MVP now has a launch-governance chain[^<]+<\/p>/, `<p>The clickable MVP now has a retrieval-quality chain that proves source candidates, ranking, no-source behavior, citation packets, and QA cases before live AI.</p>`);
  text = text.replace(/<p>The source layer now adds rights approval[^<]+<\/p>/, `<p>The source layer now has testable retrieval behavior: evidence packets, ranking rules, refusal behavior, and fixture QA remain visible.</p>`);
  text = text.replace(/<strong>v4\.4\.1 Retrieval Fixture Adapter<\/strong>\s*<p>Implement the first fixture adapter[^<]+<\/p>/, `<strong>v4.4.6 Source Coverage Expansion</strong>
          <p>Expand curated source coverage carefully after the retrieval QA harness stabilizes.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 400: First Real Retrieval Adapter Shell<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 400: First Real Retrieval Adapter Shell</strong>`);
  if (!text.includes("Phase 405: Retrieval QA Harness")) {
    const phases = [
      phaseHtml(401, "Retrieval Fixture Adapter", "Makes local fixture retrieval visible with source ids, confidence, reasons, and blocked answer composition."),
      phaseHtml(402, "Source Candidate Ranking Contract", "Names the scoring lanes and penalties that decide whether a source may become answer-ready."),
      phaseHtml(403, "No-Source Answer Behavior", "Turns unsupported questions into calm no-source packets and review tickets instead of weak answers."),
      phaseHtml(404, "Citation Packet Renderer", "Renders citation, family, confidence, boundary, and carry action before answer text."),
      phaseHtml(405, "Retrieval QA Harness", "Checks pass, review, and no-source cases before retrieval changes affect answer cards.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }
  const oldNotes = `<div class="version-row"><span>Release</span><strong>v4.4.0 First Real Retrieval Adapter Shell</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.3.9 Feedback-to-Ticket Audit Trail</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Create a launch-governance bridge from private pilot readiness into bounded fixture retrieval.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for first fixture adapter implementation</strong></div>`;
  const newNotes = `<div class="version-row"><span>Release</span><strong>v4.4.5 Retrieval QA Harness</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.4.4 Citation Packet Renderer</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make retrieval behavior testable before source expansion or live AI retrieval.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for source coverage expansion after founder review</strong></div>`;
  text = text.replace(oldNotes, newNotes);
  const oldChecklist = `<li><span class="dot"></span><span>Implement fixture retrieval over curated JSON only.</span></li>
            <li><span class="dot"></span><span>Return source ids, citations, confidence, reasons, and no-answer results before answer text.</span></li>
            <li><span class="dot"></span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled.</span></li>`;
  const newChecklist = `<li><span class="dot"></span><span>Expand the curated source set only after QA cases stay green.</span></li>
            <li><span class="dot"></span><span>Add more source families without weakening citation, rights, review, and no-source behavior.</span></li>
            <li><span class="dot"></span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled.</span></li>`;
  text = text.replace(oldChecklist, newChecklist);
  write("build-status.html", text);
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
    "assets/vedapath-retrieval-pilot.js",
    "assets/vedapath-command-shell.js",
    "scripts/check-static-links.mjs",
    "index.html",
    "build-status.html",
    "README.md",
    "CHANGELOG.md"
  ].map((file) => `\`${file}\``).join(", ");
  return `## ${item.version} ${item.pageTitle}

- Changes made: ${item.changes}
- Files changed: ${files}.
- Checks run: ${checkCommand}.
- Known risks: ${staticRisk}
`;
}

function readmeEntry(item) {
  return `## ${item.version} ${item.pageTitle}
- ${item.changes}
- Primary files: \`${item.href}\`, \`${item.dataFile}\`, \`${item.docFile}\`.
- Product note: ${staticRisk}
`;
}

function updateDocs() {
  const block = versions.map(changelogEntry).join("\n");
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.4.5 Retrieval QA Harness")) {
    changelog = `${block}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  const readmeBlock = versions.map(readmeEntry).join("\n");
  let readme = read("README.md");
  if (!readme.includes("## v4.4.5 Retrieval QA Harness")) {
    readme = `${readmeBlock}\n${readme}`;
  }
  write("README.md", readme);
}

function verifyVersion(item) {
  JSON.parse(read(item.dataFile));
  const page = read(item.href);
  if (!page.includes(item.dataFile)) throw new Error(`${item.href} missing data file link`);
  if (!page.includes("assets/vedapath-command-shell.js")) throw new Error(`${item.href} missing command shell`);
  if (!page.includes('href="index.html#top"')) throw new Error(`${item.href} missing home logo link`);
  if (!page.includes(`data-kind="${item.kind}"`)) throw new Error(`${item.href} missing expected renderer kind`);
  if (!existsSync(filePath(item.docFile))) throw new Error(`${item.docFile} missing`);
  console.log(`${item.version} checks ok`);
}

for (const item of versions) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

updateRetrievalPilotAsset();
updateCommandShell();
updateStaticLinks();
updateInlineVersionBadges();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.4.1-v4.4.5 retrieval quality batch applied");
