import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.5.0 answer gate";
const checkCommand = "`node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";
const staticRisk = "Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.";

const navLinks = [
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
  ["QA Harness", "retrievalqaharness.html"],
  ["Coverage", "sourcecoverageexpansion.html"],
  ["Family Map", "sourcefamilycoveragemap.html"],
  ["Dossier", "passagedossierbuilder.html"],
  ["Approval Flow", "reviewerapprovalworkflow.html"],
  ["Answer Integration", "retrievaltoanswerintegrationgate.html"]
];

const sourceRecords = [
  {
    id: "bg-2-48-steadiness",
    status: "pass",
    title: "Steady action",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports a calm reflection on steady action while keeping outcomes and personal identity separate.",
    confidence: "High | 86/100",
    boundary: "Reflection support only; not therapy, medical advice, ritual instruction, or spiritual command.",
    missingFields: ["licensed translation display", "reviewer note"]
  },
  {
    id: "bg-11-32-time",
    status: "pass",
    title: "Oppenheimer source correction",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    summary: "Corrects the common category confusion: the famous line is associated with the Gita, not the four Vedas.",
    confidence: "High | 91/100",
    boundary: "Do not call it a direct quote from the four Vedas.",
    missingFields: ["translation variant review"]
  },
  {
    id: "rv-3-62-10-gayatri",
    status: "review",
    title: "Gayatri mantra review candidate",
    citation: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    summary: "High-value source candidate that must stay in review until Sanskrit, recitation, and rights posture are stronger.",
    confidence: "Medium | 68/100",
    boundary: "No ritual instruction, initiation advice, or pronunciation authority.",
    missingFields: ["recitation boundary", "rights approval", "mantra reviewer"]
  },
  {
    id: "isha-1-opening",
    status: "review",
    title: "Renunciation and stewardship candidate",
    citation: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    summary: "Useful for desire, possession, and restraint questions, but it needs commentary notes before learner-facing simplification.",
    confidence: "Medium | 72/100",
    boundary: "Do not flatten the verse into productivity advice or wealth advice.",
    missingFields: ["commentary lens", "translation rights"]
  },
  {
    id: "katha-1-2-23",
    status: "review",
    title: "Self-knowledge humility candidate",
    citation: "Katha Upanishad 1.2.23",
    family: "Upanishad | Shruti",
    summary: "Potentially useful for humility and self-knowledge boundaries, but requires tradition-aware commentary.",
    confidence: "Medium | 70/100",
    boundary: "Do not promise realization, status, or spiritual attainment.",
    missingFields: ["commentary review", "beginner phrasing"]
  },
  {
    id: "mbh-gita-category",
    status: "pass",
    title: "Gita classification",
    citation: "Mahabharata context",
    family: "Itihasa | Smriti",
    summary: "Helps explain that the Bhagavad Gita is part of the Mahabharata and is usually classified as Smriti.",
    confidence: "High | 84/100",
    boundary: "Use for classification only; do not overstate sectarian consensus.",
    missingFields: ["school-specific notes"]
  },
  {
    id: "purana-devotion-gap",
    status: "review",
    title: "Devotion story candidate",
    citation: "Purana candidate",
    family: "Purana | Smriti",
    summary: "Can help with story-based devotion questions after source edition and interpretation boundaries are added.",
    confidence: "Low | 54/100",
    boundary: "Do not present story material as direct Vedic statement.",
    missingFields: ["exact citation", "edition", "reviewer"]
  },
  {
    id: "commentary-shankara-gap",
    status: "review",
    title: "Commentary lens candidate",
    citation: "Vedanta commentary candidate",
    family: "Commentary | Tradition",
    summary: "Needed for interpretation differences, but must stay separate from source text and modern analogy.",
    confidence: "Low | 48/100",
    boundary: "Never collapse commentary into the base verse.",
    missingFields: ["commentary citation", "school label", "rights posture"]
  },
  {
    id: "modern-airplane-no-source",
    status: "no-source",
    title: "Unsupported modern technology claim",
    citation: "No reviewed source candidate",
    family: "Source gap",
    summary: "The current fixture set should refuse confident answers about modern technology claims.",
    confidence: "Low | 8/100",
    boundary: "Create a review ticket instead of inventing source support.",
    missingFields: ["reviewed source", "claim evidence", "scholar note"]
  }
];

const versions = [
  {
    version: "v4.4.6",
    badge: "v4.4.6 coverage",
    label: "Coverage",
    href: "sourcecoverageexpansion.html",
    pageClass: "source-coverage-expansion-page",
    pageTitle: "Source Coverage Expansion",
    small: "source coverage",
    kind: "qa",
    dataFile: "data/vedapath-source-coverage-expansion.json",
    docFile: "docs/SOURCE_COVERAGE_EXPANSION.md",
    changes: "Adds a coverage expansion room that shows ready, review, and no-source lanes before the corpus grows.",
    headline: "Grow coverage without losing trust.",
    copy: "VedaPath now expands source coverage through visible readiness lanes instead of quietly adding texts to answer behavior.",
    data: {
      headline: "Grow coverage without losing trust.",
      copy: "This coverage board shows which source candidates may support answers, which need review, and which remain no-source gaps.",
      progress: 76,
      boundary: "Coverage expansion is a planning surface. It does not grant rights, scholar approval, live retrieval, or production answer authority.",
      metrics: [
        { label: "Tracked sources", value: "9" },
        { label: "Answer-ready", value: "3" },
        { label: "Review-needed", value: "5" },
        { label: "No-source", value: "1" }
      ],
      filters: [
        { label: "All", value: "all" },
        { label: "Ready", value: "pass" },
        { label: "Review", value: "review" },
        { label: "No-source", value: "no-source" }
      ],
      records: sourceRecords.map((record) => ({
        citation: record.citation,
        family: record.family,
        status: record.status,
        risks: record.missingFields
      })),
      rules: [
        { title: "Coverage is not authority", copy: "A source family can be present without being answer-ready." },
        { title: "Review holds are healthy", copy: "The product should show thin areas before users depend on them." },
        { title: "Gaps stay visible", copy: "Unsupported modern claims remain explicit no-source cases." }
      ]
    }
  },
  {
    version: "v4.4.7",
    badge: "v4.4.7 family map",
    label: "Family Map",
    href: "sourcefamilycoveragemap.html",
    pageClass: "source-family-coverage-map-page",
    pageTitle: "Source Family Coverage Map",
    small: "family map",
    kind: "schema",
    dataFile: "data/vedapath-source-family-coverage-map.json",
    docFile: "docs/SOURCE_FAMILY_COVERAGE_MAP.md",
    changes: "Adds a family coverage map so Veda, Upanishad, Gita, Itihasa, Purana, commentary, and source-gap lanes remain separate.",
    headline: "Keep source families separate.",
    copy: "The map prevents category confusion by making every source family, review lane, and interpretation boundary visible.",
    data: {
      headline: "Keep source families separate.",
      copy: "Every answer should know what family it is standing in before it explains anything.",
      fields: [
        { name: "family", why: "Prevents calling every Hindu text Veda." },
        { name: "status", why: "Separates answer-ready, review-needed, and source-gap lanes." },
        { name: "reviewRole", why: "Names who should review the family before expansion." },
        { name: "boundary", why: "Keeps text, tradition, analogy, and modern claims distinct." }
      ],
      required: [
        { key: "Veda | Shruti", value: "High reverence, high review" },
        { key: "Upanishad | Shruti", value: "Commentary-sensitive" },
        { key: "Bhagavad Gita | Smriti", value: "Beginner-ready with category label" },
        { key: "Itihasa | Smriti", value: "Context and narrative boundary" },
        { key: "Purana | Smriti", value: "Story and devotion boundary" },
        { key: "Commentary | Tradition", value: "School-specific, not base text" }
      ],
      records: sourceRecords.slice(0, 8),
      example: {
        family: "Bhagavad Gita | Smriti",
        allowedUse: "classification, direct citation packet, calm reflection",
        notAllowed: "calling it direct Veda, ritual authority, medical or spiritual prescription",
        reviewRole: "source reviewer"
      },
      metrics: [
        { label: "Families", value: "6" },
        { label: "Ready lanes", value: "2" },
        { label: "Review lanes", value: "4" },
        { label: "Merged labels", value: "0" }
      ],
      rules: [
        { title: "Do not merge families", copy: "A Gita answer must not become a Veda answer for convenience." },
        { title: "Commentary is a layer", copy: "Commentary may explain the source but should not replace it." },
        { title: "Uncertain is allowed", copy: "A thin source family can be marked uncertain without shame." }
      ]
    }
  },
  {
    version: "v4.4.8",
    badge: "v4.4.8 dossier",
    label: "Dossier",
    href: "passagedossierbuilder.html",
    pageClass: "passage-dossier-builder-page",
    pageTitle: "Passage Dossier Builder",
    small: "passage dossier",
    kind: "desk",
    dataFile: "data/vedapath-passage-dossier-builder.json",
    docFile: "docs/PASSAGE_DOSSIER_BUILDER.md",
    changes: "Adds a passage dossier builder that turns each source candidate into meaning, use, boundary, missing fields, and reviewer notes.",
    headline: "Build the dossier before the answer.",
    copy: "A passage should become a learner answer only after its meaning capsule, category, allowed use, and boundary are visible.",
    data: {
      headline: "Build the dossier before the answer.",
      copy: "Dossiers keep the source record more important than the generated explanation.",
      metrics: [
        { label: "Dossiers", value: "5" },
        { label: "Ready", value: "2" },
        { label: "Review", value: "3" },
        { label: "Final answers", value: "0" }
      ],
      candidates: [
        {
          id: "dossier-bg-2-48",
          title: "Steady action dossier",
          citation: "Bhagavad Gita 2.48",
          score: "86",
          reason: "Strong calm-action fit, clear source family, and safe reflection boundary.",
          decision: "Ready for citation packet",
          packet: "Dossier: bg-2-48-steadiness\nMeaning capsule: steady action without identity collapse.\nAllowed use: calm reflection and carry action.\nBoundary: not therapy, command, ritual instruction, or guaranteed peace.",
          record: sourceRecords[0]
        },
        {
          id: "dossier-bg-11-32",
          title: "Oppenheimer correction dossier",
          citation: "Bhagavad Gita 11.32",
          score: "91",
          reason: "High-value public confusion case with precise source-category correction.",
          decision: "Ready for category correction",
          packet: "Dossier: bg-11-32-time\nMeaning capsule: source correction before cultural context.\nAllowed use: explain Gita vs Veda classification.\nBoundary: no sensational claim or direct-Veda label.",
          record: sourceRecords[1]
        },
        {
          id: "dossier-rv-gayatri",
          title: "Gayatri mantra dossier",
          citation: "Rigveda 3.62.10",
          score: "68",
          reason: "Important source candidate with mantra, recitation, and rights sensitivities.",
          decision: "Hold for mantra review",
          packet: "Dossier: rv-3-62-10-gayatri\nMeaning capsule: pending.\nAllowed use: source identification only.\nBoundary: no recitation authority, initiation advice, or ritual instruction.",
          record: sourceRecords[2]
        },
        {
          id: "dossier-isha",
          title: "Isha Upanishad dossier",
          citation: "Isha Upanishad 1",
          score: "72",
          reason: "Useful for possession, desire, and restraint questions but commentary-sensitive.",
          decision: "Hold for commentary lens",
          packet: "Dossier: isha-1-opening\nMeaning capsule: pending commentary review.\nAllowed use: source candidate only.\nBoundary: no productivity or wealth advice simplification.",
          record: sourceRecords[3]
        }
      ],
      steps: [
        { title: "Name source", copy: "Stable citation, family, and source id." },
        { title: "Meaning capsule", copy: "Plain-language summary with humility." },
        { title: "Allowed use", copy: "What learner question it may support." },
        { title: "Boundary", copy: "What the passage must not be used to claim." }
      ]
    }
  },
  {
    version: "v4.4.9",
    badge: "v4.4.9 approval",
    label: "Approval Flow",
    href: "reviewerapprovalworkflow.html",
    pageClass: "reviewer-approval-workflow-page",
    pageTitle: "Reviewer Approval Workflow",
    small: "approval workflow",
    kind: "gate",
    dataFile: "data/vedapath-reviewer-approval-workflow.json",
    docFile: "docs/REVIEWER_APPROVAL_WORKFLOW.md",
    changes: "Adds a reviewer approval workflow so source expansion requires role, scope, decision, audit, and boundary before answer promotion.",
    headline: "Review before the corpus speaks.",
    copy: "Reviewer approval turns source expansion into an auditable decision instead of a silent data change.",
    data: {
      position: "A source candidate can enter the learner path only after its reviewer, scope, decision, and boundary are visible.",
      headline: "Review before the corpus speaks.",
      copy: "This workflow keeps source expansion calm by making approval steps explicit before answer promotion.",
      postures: [
        { decision: "Allowed", title: "Approved for citation packet", copy: "Reviewer scope, source citation, rights posture, and boundary are complete." },
        { decision: "Review", title: "Needs specialist review", copy: "Mantra, commentary, ritual, medical, or category-sensitive cases need a named review lane." },
        { decision: "Blocked", title: "No answer promotion", copy: "No-source, rights-blocked, or high-overclaim records stay out of learner answers." }
      ],
      flow: [
        { title: "Assign role", copy: "Source, mantra, commentary, or safety reviewer." },
        { title: "Review source", copy: "Check family, citation, rights, and meaning capsule." },
        { title: "Decide", copy: "Approve, hold, revise, block, or route to no-source." },
        { title: "Audit", copy: "Preserve decision notes before answer promotion." }
      ],
      decisions: [
        { label: "Reviewer role", value: "required", reason: "Approval without role is not review." },
        { label: "Decision note", value: "required", reason: "Future users need to know why the source moved." },
        { label: "Rights posture", value: "required", reason: "Citation is not display permission." },
        { label: "Boundary text", value: "required", reason: "Answer cards must know what not to claim." },
        { label: "Audit id", value: "required", reason: "No silent source expansion." },
        { label: "Production write", value: "off", reason: "This prototype stores no production approval." }
      ],
      packet: "Reviewer approval packet v4.4.9\nsource_id:\nreviewer_role:\ndecision: approve | hold | revise | block | no-source\nscope:\nrights_posture:\nboundary:\naudit_note:\nanswer_promotion: disabled in prototype",
      metrics: [
        { label: "Review lanes", value: "4" },
        { label: "Approval fields", value: "6" },
        { label: "Silent changes", value: "0" },
        { label: "Production writes", value: "0" }
      ],
      locks: [
        { title: "Role before decision", copy: "Different source families need different reviewers." },
        { title: "Audit before promotion", copy: "A source should not become answer-ready without a visible decision trail." },
        { title: "Hold is success", copy: "The workflow should make restraint feel normal." }
      ]
    }
  },
  {
    version: "v4.5.0",
    badge: "v4.5.0 answer gate",
    label: "Answer Integration",
    href: "retrievaltoanswerintegrationgate.html",
    pageClass: "retrieval-to-answer-integration-gate-page",
    pageTitle: "Retrieval-to-Answer Integration Gate",
    small: "answer integration",
    kind: "ask",
    dataFile: "data/vedapath-retrieval-to-answer-integration-gate.json",
    docFile: "docs/RETRIEVAL_TO_ANSWER_INTEGRATION_GATE.md",
    changes: "Adds the retrieval-to-answer integration gate that defines when a source packet may become a learner-facing answer draft.",
    headline: "Only answer when the source can carry it.",
    copy: "The final gate links source coverage, dossier, approval, and no-source behavior into one careful learner-facing answer path.",
    data: {
      memoryKey: "vedapathRetrievalToAnswerGateV450",
      boundary: "Answer integration draft only. Live model calls, production storage, public release, and authority claims remain disabled.",
      questions: [
        {
          id: "steady-action",
          label: "Steady action",
          question: "How can I act calmly when results are uncertain?",
          recordIds: ["bg-2-48-steadiness"],
          answerTitle: "Answer-ready draft: begin with the next honest action.",
          plainMeaning: "This question may receive a learner-facing draft because citation, family, boundary, and carry action are present.",
          carry: "Do one small duty slowly and clearly before checking the result."
        },
        {
          id: "oppenheimer",
          label: "Oppenheimer source",
          question: "What scripture did Oppenheimer quote?",
          recordIds: ["bg-11-32-time"],
          answerTitle: "Answer-ready draft: the source is the Bhagavad Gita.",
          plainMeaning: "The answer should correct category confusion and show that the Gita is usually classified as Smriti.",
          carry: "Name the source family before widening the explanation."
        },
        {
          id: "gayatri",
          label: "Gayatri boundary",
          question: "Can you explain the Gayatri mantra?",
          recordIds: ["rv-3-62-10-gayatri"],
          answerTitle: "Review-needed draft: source identification only.",
          plainMeaning: "The gate blocks full explanation until mantra, recitation, and rights review are complete.",
          carry: "Respect the review hold and avoid ritual or pronunciation authority."
        }
      ],
      records: sourceRecords.slice(0, 3)
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
  const links = navLinks.map(([label, href]) => {
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
- The retrieval surface renders source coverage, review posture, boundaries, and safe next action.
- The room does not claim live AI, production storage, public launch readiness, or sacred-text authority.
`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${finalBadge}";`);

  if (!text.includes('{ title: "Source Expansion"')) {
    text = text.replace(
      '{ title: "Retrieval Quality", labels: ["Fixture Adapter", "Ranking Contract", "No-Source", "Citation Packet", "QA Harness"] }',
      '{ title: "Retrieval Quality", labels: ["Fixture Adapter", "Ranking Contract", "No-Source", "Citation Packet", "QA Harness"] },\n    { title: "Source Expansion", labels: ["Coverage", "Family Map", "Dossier", "Approval Flow", "Answer Integration"] }'
    );
  }

  text = insertAfterOnce(
    text,
    '    "QA Harness": "Retrieval QA Harness"',
    ',\n    Coverage: "Source Coverage Expansion",\n    "Family Map": "Source Family Coverage Map",\n    Dossier: "Passage Dossier Builder",\n    "Approval Flow": "Reviewer Approval Workflow",\n    "Answer Integration": "Retrieval-to-Answer Integration Gate"'
  );
  text = insertAfterOnce(
    text,
    '    "retrieval-qa-harness-page": "Retrieval QA Harness"',
    ',\n    "source-coverage-expansion-page": "Source Coverage Expansion",\n    "source-family-coverage-map-page": "Source Family Coverage Map",\n    "passage-dossier-builder-page": "Passage Dossier Builder",\n    "reviewer-approval-workflow-page": "Reviewer Approval Workflow",\n    "retrieval-to-answer-integration-gate-page": "Retrieval-to-Answer Integration Gate"'
  );

  const linkAdditions = [
    '    ["Coverage", "sourcecoverageexpansion.html"]',
    '    ["Family Map", "sourcefamilycoveragemap.html"]',
    '    ["Dossier", "passagedossierbuilder.html"]',
    '    ["Approval Flow", "reviewerapprovalworkflow.html"]',
    '    ["Answer Integration", "retrievaltoanswerintegrationgate.html"]'
  ].join(",\n");
  if (!text.includes('["Coverage", "sourcecoverageexpansion.html"]')) {
    text = text.replace('    ["QA Harness", "retrievalqaharness.html"]', `    ["QA Harness", "retrievalqaharness.html"],\n${linkAdditions}`);
  }

  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const additions = versions.map((item) => `  "${item.href}"`).join(",\n");
  if (!text.includes('"sourcecoverageexpansion.html"')) {
    text = text.replace('  "retrievalqaharness.html"', `  "retrievalqaharness.html",\n${additions}`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateInlineVersionBadges() {
  const htmlFiles = [
    "index.html",
    "build-status.html",
    "retrievalqaharness.html",
    "citationpacketrenderer.html",
    "sourcecandidaterankingcontract.html",
    "nosourceanswerbehavior.html",
    "retrievalfixtureadapter.html"
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
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/v4\.4\.5 retrieval quality/g, "v4.5.0 source expansion");
  if (!text.includes("V446-V450 HOME STRIP START")) {
    const strip = `

      <!-- V446-V450 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Source expansion path">
        <span class="rp-eyebrow green">v4.5.0 source expansion</span>
        <h2>Source expansion path</h2>
        <p>VedaPath can now grow the source set without becoming loose: coverage board, family map, passage dossier, reviewer approval, and an answer integration gate.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Coverage</h3><p>See ready, review, and no-source lanes before adding answers.</p><a class="rp-button green" href="sourcecoverageexpansion.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Family Map</h3><p>Keep Veda, Gita, Upanishad, Itihasa, Purana, and commentary separate.</p><a class="rp-button green" href="sourcefamilycoveragemap.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Dossier</h3><p>Build meaning, use, boundary, and missing fields before answers.</p><a class="rp-button green" href="passagedossierbuilder.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Approval Flow</h3><p>Require reviewer role, scope, decision, and audit trail.</p><a class="rp-button green" href="reviewerapprovalworkflow.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Answer Integration</h3><p>Only answer when the source can carry it.</p><a class="rp-button green" href="retrievaltoanswerintegrationgate.html">Open</a></article>
        </div>
      </article>
      <!-- V446-V450 HOME STRIP END -->
`;
    text = text.replace("      <!-- V441-V445 HOME STRIP END -->", `      <!-- V441-V445 HOME STRIP END -->${strip}`);
  }
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
  text = text.replace(/<strong>v4\.4\.5<\/strong>\s*<p>Retrieval QA Harness completes[^<]+<\/p>/, `<strong>v4.5.0</strong>
          <p>Retrieval-to-Answer Integration Gate completes the source expansion path from coverage and family map to reviewer approval and bounded answer drafts.</p>`);
  text = text.replace(/<p>The clickable MVP now has a retrieval-quality chain[^<]+<\/p>/, `<p>The clickable MVP now has a source-expansion chain for coverage, family separation, passage dossiers, reviewer approvals, and answer gating.</p>`);
  text = text.replace(/<p>The source layer now has testable retrieval behavior:[^<]+<\/p>/, `<p>The source layer now separates coverage growth from answer readiness, keeping review, rights, and no-source boundaries visible.</p>`);
  text = text.replace(/<strong>v4\.4\.6 Source Coverage Expansion<\/strong>\s*<p>Expand curated source coverage carefully[^<]+<\/p>/, `<strong>v4.5.1 Learner Answer Draft Review</strong>
          <p>Review the first learner-facing answer drafts after source integration, while live AI remains disabled.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 405: Retrieval QA Harness<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 405: Retrieval QA Harness</strong>`);

  if (!text.includes("Phase 410: Retrieval-to-Answer Integration Gate")) {
    const phases = [
      phaseHtml(406, "Source Coverage Expansion", "Shows ready, review, and no-source source lanes before the corpus grows."),
      phaseHtml(407, "Source Family Coverage Map", "Keeps Veda, Upanishad, Gita, Itihasa, Purana, commentary, and gap lanes separate."),
      phaseHtml(408, "Passage Dossier Builder", "Creates meaning capsules, allowed use, boundaries, and missing fields before answer drafts."),
      phaseHtml(409, "Reviewer Approval Workflow", "Requires reviewer role, scope, decision, and audit note before promotion."),
      phaseHtml(410, "Retrieval-to-Answer Integration Gate", "Allows source packets to become bounded answer drafts only when the source can carry the answer.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }

  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>v4\.4\.5 Retrieval QA Harness<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v4\.4\.4 Citation Packet Renderer<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make retrieval behavior testable before source expansion or live AI retrieval\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready for source coverage expansion after founder review<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.5.0 Retrieval-to-Answer Integration Gate</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.4.9 Reviewer Approval Workflow</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Let reviewed source packets become bounded answer drafts without enabling live AI.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for learner answer draft review</strong></div>`
  );
  text = text.replace(
    /<li><span class="dot"><\/span><span>Expand the curated source set only after QA cases stay green\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Add more source families without weakening citation, rights, review, and no-source behavior\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled\.<\/span><\/li>/,
    `<li><span class="dot"></span><span>Review first answer drafts using the new integration gate.</span></li>
            <li><span class="dot"></span><span>Keep answer text source-carded, boundary-first, and easy to revise.</span></li>
            <li><span class="dot"></span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled.</span></li>`
  );
  write("build-status.html", text);
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
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
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.5.0 Retrieval-to-Answer Integration Gate")) {
    changelog = `${versions.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.5.0 Retrieval-to-Answer Integration Gate")) {
    readme = `${versions.map(readmeEntry).join("\n")}\n${readme}`;
  }
  write("README.md", readme);
}

function verifyVersion(item) {
  JSON.parse(read(item.dataFile));
  const page = read(item.href);
  if (!page.includes(item.dataFile)) throw new Error(`${item.href} missing data file`);
  if (!page.includes("assets/vedapath-command-shell.js")) throw new Error(`${item.href} missing command shell`);
  if (!page.includes('href="index.html#top"')) throw new Error(`${item.href} missing home logo link`);
  if (!page.includes(`data-kind="${item.kind}"`)) throw new Error(`${item.href} missing renderer kind`);
  if (!existsSync(filePath(item.docFile))) throw new Error(`${item.docFile} missing`);
  console.log(`${item.version} checks ok`);
}

for (const item of versions) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

updateCommandShell();
updateStaticLinks();
updateInlineVersionBadges();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.4.6-v4.5.0 source expansion batch applied");
