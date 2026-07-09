import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.6.5 demo script";
const staticRisk = "Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.";
const checkCommand = "`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";

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
  ["Answer Integration", "retrievaltoanswerintegrationgate.html"],
  ["Draft Review", "learneranswerdraftreview.html"],
  ["Revision", "answerrevisionworkbench.html"],
  ["Trace", "sourcetoanswertraceview.html"],
  ["Audience Views", "audienceviewtoggle.html"],
  ["Evidence Pack", "launchreadinessevidencepack.html"],
  ["Source API", "realsourceapicontract.html"],
  ["Retrieval Boundary", "retrievalserviceboundary.html"],
  ["Answer Adapter", "mockanswergenerationadapter.html"],
  ["Review Handoff", "reviewerapprovalhandoff.html"],
  ["Private Gate", "privatelaunchgate.html"],
  ["Source API Tests", "sourceapitestharness.html"],
  ["No-Source Eval", "nosourceevaluationsuite.html"],
  ["Fixture Runner", "sourcecandidatefixturerunner.html"],
  ["Adapter Tests", "adaptercontracttests.html"],
  ["Demo Script", "privatedemoscript.html"]
];

const sourceRecords = [
  {
    id: "bg-2-48-steadiness",
    status: "approved",
    title: "Steady action",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports practical answers about steady action while avoiding promises of guaranteed calm.",
    confidence: "High | 86/100",
    boundary: "Reflection support only; not therapy, ritual instruction, or spiritual command.",
    missingFields: ["licensed translation display", "final reviewer signature"]
  },
  {
    id: "bg-11-32-category",
    status: "approved",
    title: "Oppenheimer category correction",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports correcting the common claim: the famous line is associated with the Gita, not the four Vedas.",
    confidence: "High | 91/100",
    boundary: "Do not call it a direct quote from the four Vedas.",
    missingFields: ["translation variant note"]
  },
  {
    id: "rv-3-62-10-gayatri",
    status: "hold",
    title: "Gayatri mantra care",
    citation: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    summary: "Useful for source context, but learner-facing practice needs reviewer and rights review.",
    confidence: "Medium | 68/100",
    boundary: "No ritual instruction, initiation advice, or recitation authority.",
    missingFields: ["mantra reviewer", "recitation boundary", "rights approval"]
  },
  {
    id: "isha-1-opening",
    status: "review",
    title: "Stewardship and restraint",
    citation: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    summary: "Can support careful answers about possession and restraint if commentary and rights notes are visible.",
    confidence: "Medium | 72/100",
    boundary: "Do not flatten the verse into wealth advice or productivity advice.",
    missingFields: ["commentary lens", "translation rights"]
  },
  {
    id: "no-source-modern-airplanes",
    status: "no-source",
    title: "Modern aircraft overclaim",
    citation: "No direct source",
    family: "No-source behavior",
    summary: "Used to refuse inflated claims when no reviewed source can carry the answer.",
    confidence: "High | 95/100",
    boundary: "Say no reliable source is present; do not invent validation.",
    missingFields: ["none"]
  }
];

function qaRecord(id, citation, family, status, risk) {
  return { id, citation, family, status, risks: [risk] };
}

const releases = [
  {
    version: "v4.6.1",
    badge: "v4.6.1 source tests",
    href: "sourceapitestharness.html",
    bodyClass: "source-api-test-harness-page",
    pageTitle: "Source API Test Harness",
    activeLabel: "Source API Tests",
    subtitle: "source API test harness",
    kind: "qa",
    dataFile: "data/vedapath-source-api-test-harness.json",
    docFile: "docs/SOURCE_API_TEST_HARNESS.md",
    eyebrow: "Source API tests",
    headline: "A source response should be testable before it is trusted.",
    copy: "This harness turns the v4.5.6 source contract into fixture checks for trace IDs, source IDs, family labels, confidence, reviewer state, and no-source flags.",
    changes: "Adds executable-style source API fixtures and a validation script so contract readiness can be checked before live retrieval exists.",
    data: {
      headline: "Source API fixtures make the next backend measurable.",
      copy: "Each row is a required contract behavior. A real API must satisfy these before answer generation opens.",
      progress: 72,
      boundary: "Harness data is prototype evidence, not a live endpoint or production API test.",
      filters: [
        { label: "All", value: "all" },
        { label: "Pass", value: "pass" },
        { label: "Review", value: "review" },
        { label: "No-source", value: "no-source" }
      ],
      records: [
        qaRecord("trace-required", "vp-trace-*", "API contract", "pass", "Every response needs a trace id."),
        qaRecord("source-id-required", "bg-2-48-steadiness", "Source identity", "pass", "Every source_found response needs primary_source_id."),
        qaRecord("family-label-required", "Bhagavad Gita | Smriti", "Source family", "pass", "Family label must travel with the result."),
        qaRecord("reviewer-state-required", "approved | review | hold", "Reviewer state", "pass", "Reviewer state cannot be hidden."),
        qaRecord("rights-state-required", "translation rights", "Rights posture", "review", "Translation display needs explicit rights fields."),
        qaRecord("no-source-explicit", "No direct source", "No-source behavior", "no-source", "Unsupported claims must return no_source=true.")
      ],
      metrics: [
        { label: "Fixtures", value: "6" },
        { label: "Required checks", value: "9" },
        { label: "Live endpoint", value: "Off" },
        { label: "Next", value: "No-source eval" }
      ],
      rules: [
        { title: "Trace first", copy: "If a trace id is absent, the response cannot feed an answer." },
        { title: "Reviewer state first", copy: "Hold and review records must remain visible to the answer adapter." },
        { title: "No-source is a result", copy: "No-source is not failure; it is the safe outcome for unsupported claims." }
      ]
    }
  },
  {
    version: "v4.6.2",
    badge: "v4.6.2 no-source eval",
    href: "nosourceevaluationsuite.html",
    bodyClass: "no-source-evaluation-suite-page",
    pageTitle: "No-Source Evaluation Suite",
    activeLabel: "No-Source Eval",
    subtitle: "no-source evaluation suite",
    kind: "qa",
    dataFile: "data/vedapath-no-source-evaluation-suite.json",
    docFile: "docs/NO_SOURCE_EVALUATION_SUITE.md",
    eyebrow: "No-source eval",
    headline: "The product earns trust when it can say no.",
    copy: "This suite defines the refusal behavior for inflated claims, unsupported modern-science claims, missing rights, and ritual authority gaps.",
    changes: "Adds a no-source evaluation suite with refusal cases, expected boundaries, and public-launch blockers for unsupported claims.",
    data: {
      headline: "No-source answers protect the product from overclaiming.",
      copy: "The answer layer should refuse, redirect, or ask for reviewed sources instead of inventing certainty.",
      progress: 78,
      boundary: "Evaluation cases are static examples; they do not prove all unsupported claims are covered.",
      filters: [
        { label: "All", value: "all" },
        { label: "no-source", value: "no-source" },
        { label: "hold", value: "hold" },
        { label: "review", value: "review" }
      ],
      records: [
        qaRecord("airplanes-claim", "No direct source", "Modern science overclaim", "no-source", "Refuse ancient-airplanes proof claims without reviewed evidence."),
        qaRecord("bitcoin-claim", "No direct source", "Modern finance overclaim", "no-source", "Refuse claims that Vedas predicted bitcoin."),
        qaRecord("medical-cure-claim", "No direct source", "Medical overclaim", "no-source", "Refuse diagnosis, cure, and treatment framing."),
        qaRecord("ritual-instruction", "Rigveda 3.62.10", "Veda | Shruti", "hold", "Identify source family but do not provide ritual instruction."),
        qaRecord("private-reflection", "Bhagavad Gita 2.48", "Bhagavad Gita | Smriti", "review", "Reflection support allowed only with non-therapy boundary.")
      ],
      metrics: [
        { label: "Eval cases", value: "5" },
        { label: "Must refuse", value: "3" },
        { label: "Hold path", value: "1" },
        { label: "Public launch", value: "Blocked" }
      ],
      rules: [
        { title: "Refuse cleanly", copy: "State that no reviewed source supports the claim." },
        { title: "Do not shame", copy: "Correct category errors gently and offer a source family path." },
        { title: "Boundary remains visible", copy: "Medical, ritual, spiritual authority, and modern-science claims need strict boundaries." }
      ]
    }
  },
  {
    version: "v4.6.3",
    badge: "v4.6.3 fixture runner",
    href: "sourcecandidatefixturerunner.html",
    bodyClass: "source-candidate-fixture-runner-page",
    pageTitle: "Source Candidate Fixture Runner",
    activeLabel: "Fixture Runner",
    subtitle: "source candidate fixture runner",
    kind: "desk",
    dataFile: "data/vedapath-source-candidate-fixture-runner.json",
    docFile: "docs/SOURCE_CANDIDATE_FIXTURE_RUNNER.md",
    eyebrow: "Fixture runner",
    headline: "A candidate match should show why it matched.",
    copy: "This runner tests source-candidate ranking with visible match reasons, rejected alternatives, confidence posture, and reviewer state.",
    changes: "Adds a source candidate fixture runner that models ranking output, match reasons, rejected alternatives, and reviewer decisions.",
    data: {
      headline: "Source candidates need reasons, not mystery ranking.",
      copy: "The future retrieval layer should return why a candidate matched, what was rejected, and what still blocks display.",
      metrics: [
        { label: "Fixtures", value: "4" },
        { label: "Rank reasons", value: "4" },
        { label: "Rejected paths", value: "4" },
        { label: "Live ranking", value: "Off" }
      ],
      steps: [
        { title: "Read query", copy: "Keep original user intent visible." },
        { title: "Score source", copy: "Rank source candidates with explicit reasons." },
        { title: "Reject overreach", copy: "Show rejected source paths when they are unsafe." },
        { title: "Return packet", copy: "Send only source packets to the adapter." }
      ],
      candidates: [
        {
          id: "runner-steady",
          title: "Results feel uncertain",
          citation: "Bhagavad Gita 2.48",
          score: "86/100",
          reason: "Matches steady action, outcome attachment, and non-therapy boundary.",
          decision: "Return candidate",
          record: sourceRecords[0],
          packet: "Fixture runner result\nQuery: How can I act calmly when results are uncertain?\nCandidate: Bhagavad Gita 2.48\nAccepted because: steady action and outcome boundary match.\nRejected: medical calming claim, guaranteed peace claim.\nReviewer state: approved"
        },
        {
          id: "runner-oppenheimer",
          title: "Oppenheimer quote source",
          citation: "Bhagavad Gita 11.32",
          score: "91/100",
          reason: "Matches quote-category correction and public trust example.",
          decision: "Return candidate",
          record: sourceRecords[1],
          packet: "Fixture runner result\nQuery: What scripture did Oppenheimer quote?\nCandidate: Bhagavad Gita 11.32\nAccepted because: source category correction is clear.\nRejected: four Vedas direct quote.\nReviewer state: approved"
        },
        {
          id: "runner-gayatri",
          title: "Gayatri mantra practice",
          citation: "Rigveda 3.62.10",
          score: "68/100",
          reason: "Source is relevant, but ritual and recitation boundaries block learner practice.",
          decision: "Return hold candidate",
          record: sourceRecords[2],
          packet: "Fixture runner result\nQuery: Teach me Gayatri mantra practice.\nCandidate: Rigveda 3.62.10\nAccepted only for source identification.\nRejected: recitation authority and ritual instruction.\nReviewer state: hold"
        },
        {
          id: "runner-no-source",
          title: "Vedas predicted bitcoin",
          citation: "No direct source",
          score: "95/100 refusal",
          reason: "No reviewed source packet supports the modern finance claim.",
          decision: "Return no-source",
          record: sourceRecords[4],
          packet: "Fixture runner result\nQuery: Did the Vedas predict bitcoin?\nCandidate: none\nAccepted path: no-source refusal.\nRejected: invented validation.\nReviewer state: no-source"
        }
      ]
    }
  },
  {
    version: "v4.6.4",
    badge: "v4.6.4 adapter tests",
    href: "adaptercontracttests.html",
    bodyClass: "adapter-contract-tests-page",
    pageTitle: "Adapter Contract Tests",
    activeLabel: "Adapter Tests",
    subtitle: "adapter contract tests",
    kind: "desk",
    dataFile: "data/vedapath-adapter-contract-tests.json",
    docFile: "docs/ADAPTER_CONTRACT_TESTS.md",
    eyebrow: "Adapter tests",
    headline: "The answer adapter must keep evidence above eloquence.",
    copy: "These tests define how source packets become answer drafts: direct answer, source card, plain meaning, boundary, and one carry action.",
    changes: "Adds adapter contract tests for evidence order, no-source refusal, reviewer hold handling, and boundary-preserving answer draft packets.",
    data: {
      headline: "Adapter tests stop beautiful prose from hiding weak evidence.",
      copy: "A future model can be helpful only when it obeys the source packet and refuses unsupported claims.",
      metrics: [
        { label: "Adapter tests", value: "5" },
        { label: "Must refuse", value: "1" },
        { label: "Hold blocked", value: "1" },
        { label: "Order", value: "Fixed" }
      ],
      steps: [
        { title: "Cite", copy: "Show the source card before depth." },
        { title: "Explain", copy: "Keep the beginner answer plain." },
        { title: "Bound", copy: "Say what not to overclaim." },
        { title: "Carry", copy: "Offer one grounded action." }
      ],
      candidates: [
        {
          id: "adapter-test-order",
          title: "Answer anatomy order",
          citation: "Bhagavad Gita 2.48",
          score: "Pass",
          reason: "Draft contains answer, source card, plain meaning, boundary, and carry action.",
          decision: "Allow private demo draft",
          record: sourceRecords[0],
          packet: "Adapter test\nExpected order: direct answer > source card > plain meaning > boundary > carry.\nObserved: pass.\nRisk: none beyond prototype labels."
        },
        {
          id: "adapter-test-category",
          title: "Category correction",
          citation: "Bhagavad Gita 11.32",
          score: "Pass",
          reason: "Draft corrects Gita vs Vedas without shaming the user.",
          decision: "Allow private demo draft",
          record: sourceRecords[1],
          packet: "Adapter test\nExpected: correct category and explain connection carefully.\nObserved: pass.\nBoundary: do not call it direct Vedic quote."
        },
        {
          id: "adapter-test-hold",
          title: "Hold record blocks practice",
          citation: "Rigveda 3.62.10",
          score: "Blocked",
          reason: "Hold state prevents practice instruction.",
          decision: "Do not compose practice guidance",
          record: sourceRecords[2],
          packet: "Adapter test\nExpected: identify source family only and route to reviewer.\nObserved: pass if no practice instruction is generated.\nBoundary: no ritual authority."
        },
        {
          id: "adapter-test-refusal",
          title: "No-source refusal",
          citation: "No direct source",
          score: "Pass",
          reason: "Unsupported claims produce a no-source answer rather than invented proof.",
          decision: "Refuse unsupported claim",
          record: sourceRecords[4],
          packet: "Adapter test\nExpected: I do not have a reviewed source that supports that claim.\nObserved: pass.\nBoundary: no invented validation."
        }
      ]
    }
  },
  {
    version: "v4.6.5",
    badge: "v4.6.5 demo script",
    href: "privatedemoscript.html",
    bodyClass: "private-demo-script-page",
    pageTitle: "Private Demo Script",
    activeLabel: "Demo Script",
    subtitle: "private demo script",
    kind: "gate",
    dataFile: "data/vedapath-private-demo-script.json",
    docFile: "docs/PRIVATE_DEMO_SCRIPT.md",
    eyebrow: "Private demo script",
    headline: "Demo the calm path without pretending it is launched.",
    copy: "This script gives a founder-safe private walkthrough: ask, source, answer boundary, review receipt, feedback, and explicit launch locks.",
    changes: "Adds a private demo script with talk track, allowed claims, blocked claims, and founder-ready handoff packet.",
    data: {
      position: "VedaPath can be shown privately as a source-first prototype, not as a public AI product or spiritual authority.",
      headline: "The private demo should feel calm, honest, and bounded.",
      copy: "Walk through one question, one source packet, one answer boundary, and one reviewer receipt. Then stop and collect feedback.",
      postures: [
        { title: "Say", decision: "Allowed", copy: "This is a prototype of a source-first learning companion." },
        { title: "Say", decision: "Allowed", copy: "Public launch waits for rights, reviewer operations, privacy, and live retrieval tests." },
        { title: "Do not say", decision: "Blocked", copy: "Do not claim live AI, final scholarship, spiritual authority, therapy, or public launch readiness." },
        { title: "Do not collect", decision: "Blocked", copy: "Do not collect sensitive personal reflections outside the local prototype boundary." }
      ],
      flow: [
        { title: "Open simply", copy: "State the prototype boundary in one sentence." },
        { title: "Ask", copy: "Use the Oppenheimer question or steady-action question." },
        { title: "Show source", copy: "Point to citation, source family, confidence, and boundary." },
        { title: "Show review", copy: "Explain reviewer receipts and blocked fields." },
        { title: "Close", copy: "Ask what felt trustworthy, confusing, or too much." }
      ],
      decisions: [
        { label: "Private founder demo", value: "Allowed", reason: "Script keeps source-first posture and launch locks visible." },
        { label: "Public claims", value: "Blocked", reason: "Real API, rights, privacy, and reviewer ops are not complete." },
        { label: "Sensitive intake", value: "Blocked", reason: "No production consent, export, delete, or support flow exists." },
        { label: "Live model", value: "Blocked", reason: "Adapter and no-source tests must pass in real service first." }
      ],
      metrics: [
        { label: "Demo length", value: "7 min" },
        { label: "Questions", value: "2" },
        { label: "Launch locks", value: "4" },
        { label: "Public launch", value: "Closed" }
      ],
      locks: [
        { title: "Prototype lock", copy: "Every demo begins by saying this is not a launched product." },
        { title: "Rights lock", copy: "Do not display unapproved translations as public product content." },
        { title: "Privacy lock", copy: "Do not collect sensitive user stories or promise account memory." },
        { title: "Authority lock", copy: "Do not position VedaPath as guru, therapist, ritual authority, or final scholar." }
      ],
      packet: "VedaPath Private Demo Script v4.6.5\nOpening: This is a source-first learning prototype, not a launched AI authority.\nDemo path: Ask > Source packet > Bounded answer > Reviewer receipt > Feedback.\nAllowed: private founder-led walkthrough with static data.\nBlocked: public launch, live AI claims, payments, production storage, sensitive intake.\nClose: What felt trustworthy? What felt confusing? What should become simpler?"
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

function navHtml(activeLabel) {
  return navLinks.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${href}">${label}</a>`;
  }).join("\n");
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
<body class="${item.bodyClass} retrieval-pilot-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${item.subtitle}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(item.activeLabel)}
        <span class="version-pill">${finalBadge}</span>
      </nav>
    </header>

    <section class="rp-opening">
      <div>
        <span class="rp-eyebrow">${item.eyebrow}</span>
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

Version: ${item.version}

## Purpose

${item.copy}

## What Changed

${item.changes}

## Product Boundary

${staticRisk}

## Primary Files

- ${item.href}
- ${item.dataFile}
- ${item.docFile}

## Checks

${checkCommand}
`;
}

function appendObjectEntries(text, objectName, entries) {
  const firstKey = Object.keys(entries)[0];
  if (text.includes(`"${firstKey}":`)) return text;
  const block = Object.entries(entries).map(([key, value]) => `    "${key}": "${value}"`).join(",\n");
  const pattern = new RegExp(`(const ${objectName} = \\{[\\s\\S]*?)(\\n  \\};)`);
  return text.replace(pattern, `$1,\n${block}$2`);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${finalBadge}";`);

  if (!text.includes('title: "Launch Tests"')) {
    text = text.replace(/\n  \];/, ',\n    { title: "Launch Tests", labels: ["Source API Tests", "No-Source Eval", "Fixture Runner", "Adapter Tests", "Demo Script"] }\n  ];');
  }

  text = appendObjectEntries(text, "pageTitles", {
    "Source API Tests": "Source API Test Harness",
    "No-Source Eval": "No-Source Evaluation Suite",
    "Fixture Runner": "Source Candidate Fixture Runner",
    "Adapter Tests": "Adapter Contract Tests",
    "Demo Script": "Private Demo Script"
  });

  text = appendObjectEntries(text, "bodyPageTitles", {
    "source-api-test-harness-page": "Source API Test Harness",
    "no-source-evaluation-suite-page": "No-Source Evaluation Suite",
    "source-candidate-fixture-runner-page": "Source Candidate Fixture Runner",
    "adapter-contract-tests-page": "Adapter Contract Tests",
    "private-demo-script-page": "Private Demo Script"
  });

  if (!text.includes('["Demo Script", "privatedemoscript.html"]')) {
    const links = releases.map((item) => `    ["${item.activeLabel}", "${item.href}"]`).join(",\n");
    text = text.replace(/(const extraLinks = \[[\s\S]*?)(\n  \];)/, `$1,\n${links}$2`);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes('"sourceapitestharness.html"')) {
    const additions = releases.map((item) => `  "${item.href}"`).join(",\n");
    text = text.replace(/\n\];\n\nconst missing/, `,\n${additions}\n];\n\nconst missing`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateInlineVersionBadges() {
  const htmlFiles = [...new Set(navLinks.map(([, href]) => href).filter((href) => href.endsWith(".html")))];
  for (const file of htmlFiles) {
    if (!existsSync(filePath(file))) continue;
    let text = read(file);
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
    text = text.replace(/<span class="version">v[0-9][^<]+<\/span>/g, `<span class="version">${finalBadge}</span>`);
    write(file, text);
  }
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<span class="version">v[0-9][^<]+<\/span>/g, `<span class="version">${finalBadge}</span>`);
  if (!text.includes("V461-V465 HOME STRIP START")) {
    const strip = `

      <!-- V461-V465 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Launch test stack">
        <span class="rp-eyebrow green">v4.6.5 launch test stack</span>
        <h2>Test the launch claim</h2>
        <p>VedaPath now has a source API harness, no-source evaluation suite, fixture runner, adapter contract tests, and a bounded private demo script before any public launch step.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>API Tests</h3><p>Make source packets measurable before live retrieval.</p><a class="rp-button green" href="sourceapitestharness.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>No-Source</h3><p>Prove the product can refuse unsupported claims.</p><a class="rp-button green" href="nosourceevaluationsuite.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Runner</h3><p>Show why source candidates match or are rejected.</p><a class="rp-button green" href="sourcecandidatefixturerunner.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Adapter</h3><p>Keep evidence order above beautiful prose.</p><a class="rp-button green" href="adaptercontracttests.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Demo</h3><p>Show the prototype privately without pretending launch is open.</p><a class="rp-button green" href="privatedemoscript.html">Open</a></article>
        </div>
      </article>
      <!-- V461-V465 HOME STRIP END -->
`;
    text = text.replace("      <!-- V456-V460 HOME STRIP END -->", `      <!-- V456-V460 HOME STRIP END -->${strip}`);
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
  text = text.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>v4.6.5</strong>
          <p>Private Demo Script completes the launch-test stack: source API harness, no-source evals, fixture runner, adapter contract tests, and founder-safe demo script.</p>`);
  text = text.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>The clickable MVP now has testable launch evidence for source response, refusal behavior, fixture ranking, adapter boundaries, and private demo posture.</p>`);
  text = text.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>99%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>
          <p>The product is better prepared for private demo, while real backend tests, reviewer operations, rights, and privacy still block public launch.</p>`);
  text = text.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>v4.6.6 Backend Prototype Decision Gate</strong>
          <p>Decide the smallest real backend slice for Source API, retrieval fixtures, and private demo storage boundaries.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 420: Private Launch Gate<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 420: Private Launch Gate</strong>`);
  if (!text.includes("Phase 425: Private Demo Script")) {
    const phases = [
      phaseHtml(421, "Source API Test Harness", "Turns source contract fields into fixture checks for trace, confidence, reviewer state, and no-source behavior."),
      phaseHtml(422, "No-Source Evaluation Suite", "Defines refusal cases for unsupported modern claims, medical claims, and ritual authority gaps."),
      phaseHtml(423, "Source Candidate Fixture Runner", "Models candidate ranking output with match reasons, rejected paths, and reviewer state."),
      phaseHtml(424, "Adapter Contract Tests", "Tests answer anatomy order, refusal behavior, hold handling, and boundary preservation."),
      phaseHtml(425, "Private Demo Script", "Gives a founder-safe private walkthrough while public launch, live AI, and storage stay closed.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }
  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.6.5 Private Demo Script</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.6.4 Adapter Contract Tests</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make private demo readiness measurable, bounded, and easy to explain.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for backend prototype decision gate</strong></div>`
  );
  text = text.replace(
    /<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>/,
    `<li><span class="dot"></span><span>Choose the smallest backend slice for the real Source API test harness.</span></li>
            <li><span class="dot"></span><span>Keep public launch, live AI, payment, and production storage locked until real checks pass.</span></li>
            <li><span class="dot"></span><span>Turn the private demo script into a short founder rehearsal path.</span></li>`
  );
  write("build-status.html", text);
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
    "scripts/check-v461-v465-launch-tests.mjs",
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
  if (!changelog.includes("## v4.6.5 Private Demo Script")) {
    changelog = `${releases.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.6.5 Private Demo Script")) {
    readme = `${releases.map(readmeEntry).join("\n")}\n${readme}`;
  }
  write("README.md", readme);
}

function writeHarnessCheck() {
  const files = releases.map((item) => ({
    version: item.version,
    page: item.href,
    data: item.dataFile,
    doc: item.docFile,
    kind: item.kind
  }));
  const source = `import { existsSync, readFileSync } from "node:fs";

const files = ${JSON.stringify(files, null, 2)};

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const item of files) {
  if (!existsSync(item.page)) fail("missing page " + item.page);
  if (!existsSync(item.data)) fail("missing data " + item.data);
  if (!existsSync(item.doc)) fail("missing doc " + item.doc);
  const page = readFileSync(item.page, "utf8");
  if (!page.includes(item.data)) fail(item.page + " missing data reference");
  if (!page.includes('data-kind="' + item.kind + '"')) fail(item.page + " missing renderer kind");
  if (!page.includes('href="index.html#top"')) fail(item.page + " missing home logo link");
  readJson(item.data);
}

const sourceHarness = readJson("data/vedapath-source-api-test-harness.json");
if (!sourceHarness.records.some((record) => record.status === "no-source")) fail("source harness lacks no-source fixture");
if (!sourceHarness.records.some((record) => record.id === "trace-required")) fail("source harness lacks trace fixture");

const noSource = readJson("data/vedapath-no-source-evaluation-suite.json");
if (noSource.records.filter((record) => record.status === "no-source").length < 3) fail("no-source suite needs at least three refusal cases");

const runner = readJson("data/vedapath-source-candidate-fixture-runner.json");
if (!runner.candidates.every((candidate) => candidate.reason && candidate.packet)) fail("fixture runner candidates need reasons and packets");

const adapter = readJson("data/vedapath-adapter-contract-tests.json");
if (!adapter.candidates.some((candidate) => /refuse/i.test(candidate.decision))) fail("adapter tests need refusal case");
if (!adapter.candidates.some((candidate) => /hold/i.test(candidate.title))) fail("adapter tests need hold case");

const demo = readJson("data/vedapath-private-demo-script.json");
if (!demo.decisions.some((decision) => decision.label === "Public claims" && decision.value === "Blocked")) fail("demo script must block public claims");
if (!demo.packet.includes("Blocked: public launch")) fail("demo script packet must keep launch closed");

console.log("launch-tests-ok v4.6.1-v4.6.5");
`;
  write("scripts/check-v461-v465-launch-tests.mjs", source);
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

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

writeHarnessCheck();
updateCommandShell();
updateStaticLinks();
updateInlineVersionBadges();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.6.1-v4.6.5 launch-test batch applied");
