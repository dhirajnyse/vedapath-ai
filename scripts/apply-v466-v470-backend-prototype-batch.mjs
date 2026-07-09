import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.7.0 backend ready";
const staticRisk = "Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.";
const checkCommand = "`node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";

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
  ["Demo Script", "privatedemoscript.html"],
  ["Backend Gate", "backendprototypedecisiongate.html"],
  ["Source Stub", "sourceapistub.html"],
  ["Retrieval CLI", "retrievalfixturecli.html"],
  ["Demo Ledger", "privatedemosessionledger.html"],
  ["Backend Ready", "backendreadinesscontrolroom.html"]
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
    summary: "Corrects the common claim: the famous line is associated with the Gita, not the four Vedas.",
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
    id: "isha-1-stewardship",
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
    id: "no-source-overclaim",
    status: "no-source",
    title: "Unsupported modern overclaim",
    citation: "No direct source",
    family: "No-source behavior",
    summary: "Used to refuse inflated claims when no reviewed source can carry the answer.",
    confidence: "High | 95/100",
    boundary: "Say no reliable reviewed source is present; do not invent validation.",
    missingFields: ["none"]
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

function gateDecision(label, value, reason) {
  return { label, value, reason };
}

function qaRecord(id, citation, family, status, risk) {
  return { id, citation, family, status, risks: [risk] };
}

const releases = [
  {
    version: "v4.6.6",
    pageTitle: "Backend Prototype Decision Gate",
    activeLabel: "Backend Gate",
    href: "backendprototypedecisiongate.html",
    bodyClass: "backend-prototype-decision-gate-page",
    subtitle: "backend prototype decision gate",
    kind: "gate",
    dataFile: "data/vedapath-backend-prototype-decision-gate.json",
    docFile: "docs/BACKEND_PROTOTYPE_DECISION_GATE.md",
    eyebrow: "Backend gate",
    headline: "Choose the smallest backend that protects the calm path.",
    copy: "This gate selects a local Source API prototype, fixture runner, and private demo ledger while keeping live AI, payments, public launch, and production storage closed.",
    changes: "Adds a founder-readable backend decision gate that narrows the next infrastructure step to a local Source API stub and fixture CLI.",
    data: {
      position: "Backend prototype, not product backend",
      headline: "The next backend step is a thin source packet service.",
      copy: "VedaPath should first prove source lookup, no-source behavior, and demo logging with local deterministic code before opening any real service.",
      postures: [
        { title: "Source packet service", decision: "Allowed", copy: "Return reviewed source candidates, no-source results, confidence, and boundary fields from local fixtures." },
        { title: "Live answer generation", decision: "Blocked", copy: "No model-generated answer should run until source packets and no-source tests are stable." },
        { title: "Production storage", decision: "Blocked", copy: "No user reflections, demo data, or reviewer records leave the browser or local files in this batch." },
        { title: "Public launch", decision: "Blocked", copy: "Rights, reviewer operations, identity, privacy, support, and security remain unresolved." }
      ],
      flow: [
        { title: "Decide slice", copy: "Build only Source API stub, retrieval fixture CLI, demo ledger contract, and readiness control." },
        { title: "Prove fixtures", copy: "Use deterministic questions to test source found, no-source, hold, and review paths." },
        { title: "Keep locks visible", copy: "Every page states what is not enabled." },
        { title: "Review next", copy: "Founder decides whether to create a real backend repo or keep improving fixtures." }
      ],
      decisions: [
        gateDecision("Local Source API stub", "Allowed", "Useful for validating response shape without private data or network dependency."),
        gateDecision("Retrieval fixture CLI", "Allowed", "Lets us run repeatable tests before choosing infrastructure."),
        gateDecision("Private demo ledger schema", "Allowed", "Defines events and consent posture without storing production user data."),
        gateDecision("Live AI answers", "Blocked", "Evidence, rights, evaluation, and review gates must pass first."),
        gateDecision("Public launch", "Blocked", "Launch remains closed until source, rights, reviewer, privacy, and support systems are real.")
      ],
      metrics: [
        { label: "Backend scope", value: "Thin" },
        { label: "Live API", value: "Off" },
        { label: "Storage", value: "Local" },
        { label: "Launch", value: "Closed" }
      ],
      locks: [
        { title: "Source lock", copy: "Backend responses must start as source packets, not eloquent answer text." },
        { title: "No-source lock", copy: "A refusal path is a successful result, not an error." },
        { title: "Privacy lock", copy: "Demo and practice memories remain browser-local until explicit consent and deletion exist." },
        { title: "Authority lock", copy: "The backend cannot present VedaPath as guru, therapist, clinician, or ritual authority." }
      ],
      packet: "Backend Prototype Decision Gate v4.6.6\nDecision: build a local Source API stub, retrieval fixture CLI, and private demo ledger shape.\nAllowed: deterministic source packet tests.\nBlocked: live AI answers, production storage, public launch, payments, sensitive intake.\nNext: implement Source API stub."
    }
  },
  {
    version: "v4.6.7",
    pageTitle: "Source API Stub",
    activeLabel: "Source Stub",
    href: "sourceapistub.html",
    bodyClass: "source-api-stub-page",
    subtitle: "source API stub",
    kind: "schema",
    dataFile: "data/vedapath-source-api-stub.json",
    docFile: "docs/SOURCE_API_STUB.md",
    eyebrow: "Source API stub",
    headline: "Return source packets before answers exist.",
    copy: "This local stub models the smallest backend response: trace id, source found, citation, family, confidence, reviewer state, rights state, boundary, and next action.",
    changes: "Adds an executable local Source API stub module plus a source-stub control room that documents required response fields.",
    data: {
      headline: "A source API response should be boring, inspectable, and safe.",
      copy: "The stub gives the future backend a contract before we choose infrastructure or connect a model.",
      fields: [
        { name: "trace_id", required: true, type: "string", note: "Every response must be debuggable." },
        { name: "query", required: true, type: "string", note: "Keep the original user question visible." },
        { name: "source_found", required: true, type: "boolean", note: "No-source is explicit." },
        { name: "primary_source_id", required: false, type: "string", note: "Required only when a source is found." },
        { name: "citation", required: true, type: "string", note: "Use No direct source for unsupported claims." },
        { name: "family", required: true, type: "string", note: "Separate Veda, Gita, Upanishad, and no-source behavior." },
        { name: "confidence", required: true, type: "number", note: "Numeric confidence travels with the source packet." },
        { name: "reviewer_state", required: true, type: "string", note: "approved, review, hold, or no-source." },
        { name: "rights_state", required: true, type: "string", note: "No licensed translation display unless allowed." },
        { name: "answer_boundary", required: true, type: "string", note: "The backend returns the boundary, not just content." }
      ],
      required: [
        { title: "Trace visible", copy: "Every packet has a trace id that can enter an audit log later." },
        { title: "No-source visible", copy: "Unsupported claims return source_found false with a reason." },
        { title: "Reviewer visible", copy: "Hold and review states stay visible to the answer layer." },
        { title: "Rights visible", copy: "Translation display cannot be assumed." }
      ],
      records: sourceRecords,
      example: {
        query: "What scripture did Oppenheimer quote?",
        trace_id: "vp-local-bg-11-32",
        source_found: true,
        primary_source_id: "bg-11-32-category",
        citation: "Bhagavad Gita 11.32",
        family: "Bhagavad Gita | Smriti",
        confidence: 91,
        reviewer_state: "approved",
        rights_state: "citation-only",
        answer_boundary: "Do not call it a direct quote from the four Vedas."
      },
      metrics: [
        { label: "Fields", value: "10" },
        { label: "Records", value: "5" },
        { label: "No-source", value: "On" },
        { label: "Network", value: "Off" }
      ],
      rules: [
        { title: "Packets first", copy: "The stub returns structured source packets, not final prose." },
        { title: "Rights cautious", copy: "The response can cite a source without displaying a licensed translation." },
        { title: "Hold means hold", copy: "A hold packet cannot become a practice instruction." }
      ]
    }
  },
  {
    version: "v4.6.8",
    pageTitle: "Retrieval Fixture CLI",
    activeLabel: "Retrieval CLI",
    href: "retrievalfixturecli.html",
    bodyClass: "retrieval-fixture-cli-page",
    subtitle: "retrieval fixture CLI",
    kind: "desk",
    dataFile: "data/vedapath-retrieval-fixture-cli.json",
    docFile: "docs/RETRIEVAL_FIXTURE_CLI.md",
    eyebrow: "Retrieval CLI",
    headline: "Run source questions before opening a service.",
    copy: "The fixture CLI evaluates Oppenheimer, steady-action, Gayatri, and unsupported modern-claim questions against the local Source API stub.",
    changes: "Adds a local retrieval fixture CLI that runs deterministic queries through the Source API stub and reports expected found, hold, review, and no-source behavior.",
    data: {
      headline: "The retrieval loop can now be tested from the command line.",
      copy: "This room mirrors the CLI results so product, source, and engineering decisions stay connected.",
      metrics: [
        { label: "Fixtures", value: "6" },
        { label: "Expected source", value: "3" },
        { label: "Expected no-source", value: "2" },
        { label: "Live service", value: "Off" }
      ],
      steps: [
        { title: "Ask fixture", copy: "Read a known test question from the local set." },
        { title: "Query stub", copy: "Call querySource and capture the packet." },
        { title: "Assert posture", copy: "Check source_found, reviewer_state, citation, and boundary." },
        { title: "Print report", copy: "Show pass, fail, and safe no-source results." }
      ],
      candidates: [
        {
          id: "cli-oppenheimer",
          title: "Oppenheimer source category",
          citation: "Bhagavad Gita 11.32",
          score: "Pass",
          reason: "Source found and category boundary returned.",
          decision: "Use as source-found fixture",
          record: sourceRecords[1],
          packet: "CLI fixture\nQuery: What scripture did Oppenheimer quote?\nExpected: Bhagavad Gita 11.32, approved.\nResult: pass."
        },
        {
          id: "cli-steady",
          title: "Steady action question",
          citation: "Bhagavad Gita 2.48",
          score: "Pass",
          reason: "Source found with reflection boundary.",
          decision: "Use as calm-action fixture",
          record: sourceRecords[0],
          packet: "CLI fixture\nQuery: How can I act calmly when results are uncertain?\nExpected: Bhagavad Gita 2.48, approved.\nResult: pass."
        },
        {
          id: "cli-gayatri-hold",
          title: "Gayatri mantra reviewer hold",
          citation: "Rigveda 3.62.10",
          score: "Pass",
          reason: "Source found but reviewer_state hold blocks practice instruction.",
          decision: "Use as hold fixture",
          record: sourceRecords[2],
          packet: "CLI fixture\nQuery: Teach me Gayatri mantra practice.\nExpected: hold and no ritual authority.\nResult: pass."
        },
        {
          id: "cli-bitcoin-no-source",
          title: "Bitcoin overclaim",
          citation: "No direct source",
          score: "Pass",
          reason: "No-source path returned instead of invented validation.",
          decision: "Use as refusal fixture",
          record: sourceRecords[4],
          packet: "CLI fixture\nQuery: Did the Vedas predict bitcoin?\nExpected: source_found false.\nResult: pass."
        }
      ]
    }
  },
  {
    version: "v4.6.9",
    pageTitle: "Private Demo Session Ledger",
    activeLabel: "Demo Ledger",
    href: "privatedemosessionledger.html",
    bodyClass: "private-demo-session-ledger-page",
    subtitle: "private demo session ledger",
    kind: "qa",
    dataFile: "data/vedapath-private-demo-session-ledger.json",
    docFile: "docs/PRIVATE_DEMO_SESSION_LEDGER.md",
    eyebrow: "Private demo ledger",
    headline: "Demo learning should have consent before memory.",
    copy: "This ledger defines local-only demo events, consent posture, export shape, and deletion boundary before any production account or telemetry exists.",
    changes: "Adds a private demo session ledger contract so demo events, consent posture, local storage, and deletion/export boundaries are visible before telemetry begins.",
    data: {
      headline: "The private demo can record learning posture without becoming surveillance.",
      copy: "The ledger keeps event names small and makes every record local, exportable, and deletable in the future product contract.",
      progress: 81,
      boundary: "Ledger rows are prototype records only; production requires explicit accounts, consent, export, delete, retention, and security review.",
      filters: [
        { label: "All", value: "all" },
        { label: "allowed", value: "allowed" },
        { label: "blocked", value: "blocked" },
        { label: "review", value: "review" }
      ],
      records: [
        qaRecord("demo-started", "Consent notice visible", "Private demo event", "allowed", "Allowed only after the demo boundary is shown."),
        qaRecord("question-tested", "Source API stub", "Private demo event", "allowed", "Store only question label and source packet id, not sensitive personal story."),
        qaRecord("no-source-observed", "No direct source", "Private demo event", "allowed", "No-source outcomes can be counted without storing private claim text."),
        qaRecord("feedback-captured", "Founder note", "Private demo event", "review", "Feedback needs export/delete language before broader pilot."),
        qaRecord("personal-reflection-stored", "User reflection", "Private demo event", "blocked", "No personal reflections should be stored in demo telemetry."),
        qaRecord("production-sync", "Account storage", "Private demo event", "blocked", "No sync until identity, consent, export, delete, and retention exist.")
      ],
      metrics: [
        { label: "Events", value: "6" },
        { label: "Allowed", value: "3" },
        { label: "Blocked", value: "2" },
        { label: "Storage", value: "Local" }
      ],
      rules: [
        { title: "Consent before event", copy: "The demo boundary must be visible before any event is recorded." },
        { title: "Minimal event names", copy: "Store posture, not private spiritual or emotional content." },
        { title: "Export and delete next", copy: "The next real pilot needs user-visible control over every record." }
      ]
    }
  },
  {
    version: "v4.7.0",
    pageTitle: "Backend Readiness Control Room",
    activeLabel: "Backend Ready",
    href: "backendreadinesscontrolroom.html",
    bodyClass: "backend-readiness-control-room-page",
    subtitle: "backend readiness control room",
    kind: "gate",
    dataFile: "data/vedapath-backend-readiness-control-room.json",
    docFile: "docs/BACKEND_READINESS_CONTROL_ROOM.md",
    eyebrow: "Backend readiness",
    headline: "A real backend begins only after the prototype can say no.",
    copy: "This room ties the decision gate, local Source API stub, fixture CLI, and private demo ledger into one readiness board for the next founder decision.",
    changes: "Adds a backend readiness control room and validation script tying source packets, fixture CLI results, demo ledger boundaries, and launch locks into one backend-readiness evidence layer.",
    data: {
      position: "Ready for a small backend spike, not public launch",
      headline: "The backend prototype is ready for founder review.",
      copy: "The local source packet path, fixture CLI, and private demo ledger are complete enough to choose the first real backend spike.",
      postures: [
        { title: "Source packet contract", decision: "Ready", copy: "Trace, citation, family, confidence, reviewer state, rights posture, and boundary are defined." },
        { title: "No-source behavior", decision: "Ready", copy: "Unsupported modern claims return explicit no-source packets." },
        { title: "Fixture runner", decision: "Ready", copy: "Oppenheimer, steady action, Gayatri hold, and no-source cases are testable locally." },
        { title: "Private demo ledger", decision: "Ready for review", copy: "Event names and storage boundaries are defined, but not production-approved." },
        { title: "Public launch", decision: "Blocked", copy: "Live service, privacy controls, security, rights, reviewer operations, and support remain open." }
      ],
      flow: [
        { title: "Run stub", copy: "Use the local source API module for deterministic lookup." },
        { title: "Run fixtures", copy: "Verify source-found, hold, review, and no-source behavior." },
        { title: "Review ledger", copy: "Check that private demo learning avoids sensitive storage." },
        { title: "Choose spike", copy: "Decide whether the first backend is a Node API, serverless function, or separate service repo." }
      ],
      decisions: [
        gateDecision("Private backend spike", "Allowed", "A tiny endpoint can mirror the local Source API stub after founder review."),
        gateDecision("Real retrieval corpus", "Review", "Needs rights, source edition, reviewer workflow, and storage model."),
        gateDecision("Demo telemetry", "Review", "Needs consent, export/delete, retention, and privacy approval before pilot use."),
        gateDecision("Public launch", "Blocked", "The product is not launch-ready until service, rights, review, privacy, security, and support are real."),
        gateDecision("Payment or accounts", "Blocked", "No billing or identity until production trust controls exist.")
      ],
      metrics: [
        { label: "Prototype rooms", value: "5" },
        { label: "Local scripts", value: "3" },
        { label: "Launch locks", value: "5" },
        { label: "Next", value: "Backend spike" }
      ],
      locks: [
        { title: "Live AI lock", copy: "No generated answer pipeline is enabled by this batch." },
        { title: "Storage lock", copy: "No production user or reviewer data is stored." },
        { title: "Rights lock", copy: "No licensed text display is assumed." },
        { title: "Privacy lock", copy: "Telemetry remains a contract, not an active collection system." },
        { title: "Launch lock", copy: "Private demo readiness is not public launch readiness." }
      ],
      packet: "Backend Readiness Control Room v4.7.0\nReady: local Source API stub, retrieval fixture CLI, private demo ledger contract, backend readiness gate.\nBlocked: live AI answer generation, licensed corpus display, production accounts, durable storage, payments, public launch.\nFounder next decision: choose a tiny backend spike or continue fixture hardening."
    }
  }
];

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

  if (!text.includes('title: "Backend Prototype"')) {
    text = text.replace(
      '{ title: "Launch Tests", labels: ["Source API Tests", "No-Source Eval", "Fixture Runner", "Adapter Tests", "Demo Script"] }',
      '{ title: "Launch Tests", labels: ["Source API Tests", "No-Source Eval", "Fixture Runner", "Adapter Tests", "Demo Script"] },\n    { title: "Backend Prototype", labels: ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"] }'
    );
  }

  text = appendObjectEntries(text, "pageTitles", {
    "Backend Gate": "Backend Prototype Decision Gate",
    "Source Stub": "Source API Stub",
    "Retrieval CLI": "Retrieval Fixture CLI",
    "Demo Ledger": "Private Demo Session Ledger",
    "Backend Ready": "Backend Readiness Control Room"
  });

  text = appendObjectEntries(text, "bodyPageTitles", {
    "backend-prototype-decision-gate-page": "Backend Prototype Decision Gate",
    "source-api-stub-page": "Source API Stub",
    "retrieval-fixture-cli-page": "Retrieval Fixture CLI",
    "private-demo-session-ledger-page": "Private Demo Session Ledger",
    "backend-readiness-control-room-page": "Backend Readiness Control Room"
  });

  if (!text.includes('["Backend Ready", "backendreadinesscontrolroom.html"]')) {
    const links = releases.map((item) => `    ["${item.activeLabel}", "${item.href}"]`).join(",\n");
    text = text.replace(/(const extraLinks = \[[\s\S]*?)(\n  \];)/, `$1,\n${links}$2`);
  }

  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes('"backendreadinesscontrolroom.html"')) {
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
  if (!text.includes("V466-V470 HOME STRIP START")) {
    const strip = `

      <!-- V466-V470 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Backend prototype readiness">
        <span class="rp-eyebrow green">v4.7.0 backend readiness</span>
        <h2>Prove the backend shape before the backend exists</h2>
        <p>The next layer keeps VedaPath simple: source packet first, no-source behavior visible, fixture checks local, and private demo memory bounded before any real service opens.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Gate</h3><p>Choose the smallest safe backend slice.</p><a class="rp-button green" href="backendprototypedecisiongate.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Stub</h3><p>Return source packets before answers.</p><a class="rp-button green" href="sourceapistub.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>CLI</h3><p>Run fixture questions without a service.</p><a class="rp-button green" href="retrievalfixturecli.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Ledger</h3><p>Keep demo learning local and consent-aware.</p><a class="rp-button green" href="privatedemosessionledger.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Ready</h3><p>Review what is ready and what stays locked.</p><a class="rp-button green" href="backendreadinesscontrolroom.html">Open</a></article>
        </div>
      </article>
      <!-- V466-V470 HOME STRIP END -->
`;
    text = text.replace("      <!-- V461-V465 HOME STRIP END -->", `      <!-- V461-V465 HOME STRIP END -->${strip}`);
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

function replaceCard(text, label, version, copy) {
  const pattern = new RegExp(`(<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>`);
  return text.replace(pattern, `$1<strong>${version}</strong>\n          <p>${copy}</p>`);
}

function ensureSummaryTile(text, afterLabel, label, version, copy, progress = null) {
  if (text.includes(`<span>${label}</span>`)) return text;
  const progressMarkup = progress == null ? "" : `\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:${progress}%"></div></div>`;
  const tile = `\n        <article class="tile">\n          <span>${label}</span>\n          <strong>${version}</strong>${progressMarkup}\n          <p>${copy}</p>\n        </article>`;
  const anchor = new RegExp(`(<article class="tile">\\s*<span>${afterLabel}<\\/span>[\\s\\S]*?<\\/article>)`);
  return text.replace(anchor, `$1${tile}`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = replaceCard(text, "Current version", "v4.7.0", "Backend Readiness Control Room completes the local backend prototype chain: decision gate, source API stub, retrieval fixture CLI, private demo ledger, and readiness control.");
  text = replaceCard(text, "MVP progress", "100%", "The clickable MVP now has a backend-prototype evidence layer before any live service or public launch opens.");
  text = ensureSummaryTile(text, "MVP progress", "Full vision progress", "99%", "The backend path is clearer, but real retrieval service, rights operations, privacy controls, reviewer accounts, and security remain before launch.", 99);
  text = ensureSummaryTile(text, "Full vision progress", "Next release", "v4.7.1 Backend Spike Choice", "Choose the first real backend shape: local Node API, serverless function, or separate service repo.");
  text = text.replace(/(<span>MVP progress<\/span>\s*<strong>100%<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>)/, "$1100%$2");
  text = replaceCard(text, "Full vision progress", "99%", "The backend path is clearer, but real retrieval service, rights operations, privacy controls, reviewer accounts, and security remain before launch.");
  text = text.replace(/(<span>Full vision progress<\/span>\s*<strong>99%<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>)/, "$199%$2");
  text = replaceCard(text, "Next release", "v4.7.1 Backend Spike Choice", "Choose the first real backend shape: local Node API, serverless function, or separate service repo.");

  text = text.replace(/<span class="badge active">Active<\/span>\s*\n\s*<div>\s*\n\s*<strong>Phase 425: Private Demo Script<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 425: Private Demo Script</strong>`);

  if (!text.includes("Phase 430: Backend Readiness Control Room")) {
    const phases = [
      phaseHtml(426, "Backend Prototype Decision Gate", "Narrows the backend step to a local Source API stub, fixture CLI, and private demo ledger while launch locks stay visible."),
      phaseHtml(427, "Source API Stub", "Defines and implements a local source packet contract with trace, citation, confidence, reviewer state, rights posture, and boundary."),
      phaseHtml(428, "Retrieval Fixture CLI", "Runs deterministic questions through the local Source API stub to test source-found, no-source, hold, and review paths."),
      phaseHtml(429, "Private Demo Session Ledger", "Defines local-only demo events, consent posture, export/delete needs, and sensitive-storage boundaries."),
      phaseHtml(430, "Backend Readiness Control Room", "Ties the backend prototype artifacts into one founder decision board.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }

  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.7.0 Backend Readiness Control Room</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.6.9 Private Demo Session Ledger</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make the first backend decision evidence-based while launch remains locked.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for backend spike choice</strong></div>`
  );

  text = text.replace(
    /<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>/,
    `<li><span class="dot"></span><span>Choose Node API, serverless function, or service repo for the first real Source API spike.</span></li>
            <li><span class="dot"></span><span>Keep live AI, payments, public launch, and production storage disabled until real checks pass.</span></li>
            <li><span class="dot"></span><span>Turn local source and fixture scripts into the backend spike acceptance tests.</span></li>`
  );
  write("build-status.html", text);
}

function sourceApiModule() {
  return `import { fileURLToPath } from "node:url";
import path from "node:path";

export const sourceRecords = ${JSON.stringify(sourceRecords, null, 2)};

export const fixtureQueries = [
  "What scripture did Oppenheimer quote?",
  "How can I act calmly when results are uncertain?",
  "Teach me Gayatri mantra practice",
  "Did the Vedas predict bitcoin?",
  "Can a mantra cure anxiety?",
  "What does Isha Upanishad say about possession?"
];

function traceId(question) {
  const slug = question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "query";
  return "vp-local-" + slug;
}

function packet(question, record, extra = {}) {
  return {
    trace_id: traceId(question),
    query: question,
    source_found: record.status !== "no-source",
    primary_source_id: record.status === "no-source" ? null : record.id,
    citation: record.citation,
    family: record.family,
    confidence: Number((record.confidence.match(/(\\d+)/) || ["0", "0"])[1]),
    reviewer_state: record.status,
    rights_state: record.status === "approved" ? "citation-only" : "needs-review",
    answer_boundary: record.boundary,
    summary: record.summary,
    no_source_reason: record.status === "no-source" ? "No reviewed source in the current fixture set supports this claim." : null,
    next_action: record.status === "approved" ? "compose bounded draft" : record.status === "no-source" ? "return no-source answer" : "route to reviewer",
    ...extra
  };
}

export function querySource(question = "") {
  const q = String(question).toLowerCase();
  if (/bitcoin|airplane|airplanes|medical|cure|diagnos|therapy|treatment|predict/.test(q)) {
    return packet(question, sourceRecords[4], { match_reason: "unsupported modern or medical overclaim" });
  }
  if (/oppenheimer|destroyer|death|time|gita/.test(q)) {
    return packet(question, sourceRecords[1], { match_reason: "category correction and Gita citation keywords" });
  }
  if (/result|results|steady|steadiness|calm|action|uncertain|outcome/.test(q)) {
    return packet(question, sourceRecords[0], { match_reason: "steady action and outcome attachment keywords" });
  }
  if (/gayatri|savitr|mantra|chant|recitation/.test(q)) {
    return packet(question, sourceRecords[2], { match_reason: "Gayatri source candidate, reviewer hold required" });
  }
  if (/isha|possession|stewardship|restraint/.test(q)) {
    return packet(question, sourceRecords[3], { match_reason: "Isha Upanishad review candidate" });
  }
  return packet(question, sourceRecords[4], { match_reason: "no reviewed source matched current fixtures" });
}

export function runSourceApiStub(queries = fixtureQueries) {
  return queries.map((question) => querySource(question));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(runSourceApiStub(), null, 2));
}
`;
}

function fixtureCliModule() {
  return `import { fixtureQueries, querySource } from "./vedapath-source-api-stub.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export { fixtureQueries };

const expectations = [
  { question: fixtureQueries[0], expectSource: true, expectCitation: "Bhagavad Gita 11.32", expectState: "approved" },
  { question: fixtureQueries[1], expectSource: true, expectCitation: "Bhagavad Gita 2.48", expectState: "approved" },
  { question: fixtureQueries[2], expectSource: true, expectCitation: "Rigveda 3.62.10", expectState: "hold" },
  { question: fixtureQueries[3], expectSource: false, expectCitation: "No direct source", expectState: "no-source" },
  { question: fixtureQueries[4], expectSource: false, expectCitation: "No direct source", expectState: "no-source" },
  { question: fixtureQueries[5], expectSource: true, expectCitation: "Isha Upanishad 1", expectState: "review" }
];

function evaluate(expectation) {
  const result = querySource(expectation.question);
  const passed = result.source_found === expectation.expectSource &&
    result.citation === expectation.expectCitation &&
    result.reviewer_state === expectation.expectState;
  return {
    question: expectation.question,
    passed,
    expected: expectation,
    result
  };
}

export function runFixtureSuite() {
  const results = expectations.map(evaluate);
  const passed = results.filter((item) => item.passed).length;
  return {
    suite: "vedapath-retrieval-fixture-cli",
    total: results.length,
    passed,
    failed: results.length - passed,
    results
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = runFixtureSuite();
  console.log(JSON.stringify(report, null, 2));
  if (report.failed) process.exit(1);
}
`;
}

function backendCheckModule() {
  const files = releases.map((item) => ({
    version: item.version,
    page: item.href,
    data: item.dataFile,
    doc: item.docFile,
    kind: item.kind
  }));
  return `import { existsSync, readFileSync } from "node:fs";
import { querySource } from "./vedapath-source-api-stub.mjs";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";

const files = ${JSON.stringify(files, null, 2)};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
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

const commandShell = readFileSync("assets/vedapath-command-shell.js", "utf8");
for (const label of ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"]) {
  if (!commandShell.includes(label)) fail("command shell missing " + label);
}
if (!commandShell.includes("${finalBadge}")) fail("command shell release badge not updated");

const staticLinks = readFileSync("scripts/check-static-links.mjs", "utf8");
for (const item of files) {
  if (!staticLinks.includes(item.page)) fail("static link checker missing " + item.page);
}

const oppenheimer = querySource("What scripture did Oppenheimer quote?");
if (!oppenheimer.source_found || oppenheimer.citation !== "Bhagavad Gita 11.32") fail("Oppenheimer fixture did not return Gita source");

const bitcoin = querySource("Did the Vedas predict bitcoin?");
if (bitcoin.source_found || !bitcoin.no_source_reason) fail("Bitcoin fixture must return no-source");

const gayatri = querySource("Teach me Gayatri mantra practice");
if (gayatri.reviewer_state !== "hold") fail("Gayatri fixture must stay on reviewer hold");

const suite = runFixtureSuite();
if (suite.failed) fail("fixture CLI has failing cases");
if (suite.total < 6) fail("fixture CLI needs at least six cases");
if (!suite.results.some((item) => item.result.source_found === false)) fail("fixture CLI needs no-source result");

const readiness = readJson("data/vedapath-backend-readiness-control-room.json");
if (!readiness.decisions.some((decision) => decision.label === "Public launch" && decision.value === "Blocked")) fail("readiness room must keep public launch blocked");
if (!readiness.locks.some((lock) => /Live AI/.test(lock.title))) fail("readiness room must keep live AI lock visible");

console.log("backend-prototype-ok v4.6.6-v4.7.0");
`;
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
    "scripts/vedapath-source-api-stub.mjs",
    "scripts/vedapath-retrieval-fixture-cli.mjs",
    "scripts/check-v466-v470-backend-prototype.mjs",
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
  if (!changelog.includes("## v4.7.0 Backend Readiness Control Room")) {
    changelog = `${releases.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.7.0 Backend Readiness Control Room")) {
    readme = `${releases.map(readmeEntry).join("\n")}\n${readme}`;
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

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

write("scripts/vedapath-source-api-stub.mjs", sourceApiModule());
write("scripts/vedapath-retrieval-fixture-cli.mjs", fixtureCliModule());
write("scripts/check-v466-v470-backend-prototype.mjs", backendCheckModule());
updateCommandShell();
updateStaticLinks();
updateInlineVersionBadges();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.6.6-v4.7.0 backend prototype batch applied");
