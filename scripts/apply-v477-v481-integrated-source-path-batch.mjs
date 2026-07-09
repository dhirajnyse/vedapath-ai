import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.8.1 source path";
const risk = "Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.";
const checks = "Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.";

const releases = [
  {
    version: "v4.7.7",
    title: "Backend Spike Review Gate",
    href: "backendspikereviewgate.html",
    dataFile: "data/vedapath-backend-spike-review-gate.json",
    docFile: "docs/BACKEND_SPIKE_REVIEW_GATE.md",
    bodyClass: "backend-spike-review-gate-page",
    label: "Spike Review",
    eyebrow: "Founder review",
    headline: "Approve the learning, not a premature launch.",
    copy: "A review gate now turns the private backend demo into a clear go, hold, or revise decision while production and public launch remain locked.",
    changes: "Adds an evidence-based backend spike review gate with acceptance criteria, unresolved risks, decision language, and explicit launch locks.",
    files: ["backendspikereviewgate.html", "data/vedapath-backend-spike-review-gate.json", "docs/BACKEND_SPIKE_REVIEW_GATE.md"],
    data: gateData(
      "Private backend spike accepted for continued prototyping",
      "The local source path is useful enough to harden, but not ready to host publicly.",
      "The review separates proof of packet behavior from production approval.",
      [
        posture("Source packet contract", "Pass", "Citation, family, confidence, reviewer state, rights state, and boundary stay visible."),
        posture("No-source behavior", "Pass", "Unsupported claims return a refusal packet instead of invented evidence."),
        posture("Private demo", "Pass", "The local server and browser fallback can be demonstrated without accounts or storage."),
        posture("Production service", "Hold", "Security, identity, rights, monitoring, and operations are not implemented."),
        posture("Public launch", "Blocked", "The spike is evidence for the next build, not launch authorization.")
      ],
      [
        step("Collect", "Read the v4.7.1-v4.7.6 evidence chain."),
        step("Check", "Run source packet and route safety contracts."),
        step("Decide", "Continue the local Node path for one bounded integration slice."),
        step("Lock", "Keep production storage, telemetry, payments, and public launch closed.")
      ],
      [
        decision("Spike decision", "Continue", "The local Node path proves contracts with the smallest operational surface."),
        decision("Next work", "Reliability", "Typed errors and request traceability come before richer retrieval."),
        decision("Deployment", "No", "No hosted backend is authorized by this gate."),
        decision("Launch", "Blocked", "Private demo evidence is not public readiness.")
      ],
      metrics("5", "3", "0", "Reliability contract"),
      "Backend Spike Review Gate v4.7.7\nDecision: continue the local Node source path for bounded prototyping.\nHold: hosted service, production storage, accounts, telemetry, payments, and public launch."
    )
  },
  {
    version: "v4.7.8",
    title: "Source API Reliability Contract",
    href: "sourceapireliabilitycontract.html",
    dataFile: "data/vedapath-source-api-reliability-contract.json",
    docFile: "docs/SOURCE_API_RELIABILITY_CONTRACT.md",
    bodyClass: "source-api-reliability-contract-page",
    label: "API Reliability",
    eyebrow: "API reliability",
    headline: "Every failure should be as clear as every source.",
    copy: "The local Source API now returns versioned envelopes, request IDs, typed errors, method rules, payload limits, and calm validation messages.",
    changes: "Hardens the local Source API with a versioned response contract, request tracing, 400, 404, 405, 413, and 422 error paths, and safer local CORS behavior.",
    files: ["sourceapireliabilitycontract.html", "data/vedapath-source-api-reliability-contract.json", "docs/SOURCE_API_RELIABILITY_CONTRACT.md", "scripts/vedapath-local-source-api-server.mjs", "assets/vedapath-local-api-adapter.js"],
    data: gateData(
      "Versioned local API contract",
      "The local backend now explains failures without leaking stack traces or leaving the UI guessing.",
      "Reliability starts with predictable envelopes, validation, and traceability.",
      [
        posture("Request ID", "Ready", "Every response includes a stable request identifier and response header."),
        posture("Contract version", "Ready", "Clients can verify the source packet envelope version."),
        posture("Invalid JSON", "400", "Malformed request bodies return a typed non-retryable error."),
        posture("Empty question", "422", "A missing question is named clearly before retrieval begins."),
        posture("Unknown method", "405", "Known endpoints advertise allowed methods.")
      ],
      [
        step("Receive", "Assign or accept a safe request ID."),
        step("Validate", "Check origin, method, body size, JSON, and question."),
        step("Resolve", "Return a source packet or a visible no-source packet."),
        step("Explain", "Use one typed envelope for success and failure.")
      ],
      [
        decision("Schema", "vedapath.source.v1", "A stable envelope lets the browser adapter validate responses."),
        decision("Payload limit", "16 KB", "The local query endpoint should remain small and predictable."),
        decision("Errors", "Typed", "Clients should distinguish invalid input, unavailable server, and no-source."),
        decision("CORS", "Local only", "The spike remains a private local service.")
      ],
      metrics("5", "6", "0", "Source registry"),
      "Source API Reliability Contract v4.7.8\nContract: vedapath.source.v1.\nErrors: invalid_json, question_required, payload_too_large, not_found, method_not_allowed.\nBoundary: local private demo only."
    )
  },
  {
    version: "v4.7.9",
    title: "Curated Source Registry",
    href: "curatedsourceregistry.html",
    dataFile: "data/vedapath-curated-source-registry.json",
    docFile: "docs/CURATED_SOURCE_REGISTRY.md",
    bodyClass: "curated-source-registry-page",
    label: "Source Registry",
    eyebrow: "Curated registry",
    headline: "Search a small reviewed registry before expanding the corpus.",
    copy: "A versioned source registry now powers bounded search, family filters, source status, and deterministic matching across eight citation records plus a no-source guard.",
    changes: "Adds a JSON-backed curated source registry, deterministic search module, source and search API endpoints, family filters, review states, and citation-only rights posture.",
    files: ["curatedsourceregistry.html", "data/vedapath-curated-source-registry.json", "data/vedapath-source-registry.json", "docs/CURATED_SOURCE_REGISTRY.md", "scripts/vedapath-source-registry.mjs", "scripts/vedapath-source-api-stub.mjs", "scripts/vedapath-local-source-api-server.mjs"],
    data: gateData(
      "Small reviewed registry before corpus scale",
      "VedaPath now has one visible source inventory instead of source records hidden inside application code.",
      "The registry is metadata and reviewed summaries only; it does not publish licensed translations.",
      [
        posture("Registry file", "Ready", "Nine deterministic records include citation, family, status, keywords, and boundary."),
        posture("GET /sources", "Ready", "Lists source metadata with optional family and status filters."),
        posture("GET /search", "Ready", "Returns ranked candidates and match reasons without composing answers."),
        posture("No-source guard", "Ready", "Unsupported modern and medical overclaims remain blocked."),
        posture("Full text", "Blocked", "The registry does not distribute licensed translation text.")
      ],
      [
        step("Load", "Read the versioned registry JSON."),
        step("Filter", "Apply family and reviewer-state constraints."),
        step("Rank", "Score exact phrases, keywords, titles, citations, and family terms."),
        step("Return", "Expose candidates or a transparent no-source result.")
      ],
      [
        decision("Registry size", "9 records", "A small fixture set keeps review quality visible."),
        decision("Families", "4 source lanes", "Bhagavad Gita, Veda, and Upanishad records stay categorized."),
        decision("Rights", "Citation only", "No licensed translation is exposed."),
        decision("Expansion", "Review first", "New records require boundary and reviewer status.")
      ],
      metrics("9", "4", "0", "Integrated Ask"),
      "Curated Source Registry v4.7.9\nRecords: 9 deterministic citation records including the no-source guard.\nEndpoints: GET /sources and GET /search.\nBoundary: citation metadata and reviewed summaries only."
    )
  },
  {
    version: "v4.8.0",
    title: "Integrated Ask Demo",
    href: "askdemo.html",
    dataFile: "data/vedapath-integrated-ask-demo.json",
    docFile: "docs/INTEGRATED_ASK_DEMO.md",
    bodyClass: "integrated-ask-demo-page",
    label: "Ask Demo",
    eyebrow: "Ask with evidence",
    headline: "One question. One source packet. One honest boundary.",
    copy: "The first integrated Ask demo works immediately from the reviewed static registry and can optionally connect to the private local Source API.",
    changes: "Adds an accessible learner-facing Ask workspace with sample questions, reviewed-preview and local-API modes, source cards, no-source states, visible boundaries, and no storage or telemetry.",
    files: ["askdemo.html", "data/vedapath-integrated-ask-demo.json", "docs/INTEGRATED_ASK_DEMO.md", "assets/vedapath-ask-demo.js", "assets/vedapath-ask-demo.css", "assets/vedapath-local-api-adapter.js", "index.html"],
    data: gateData(
      "Integrated reviewed-preview Ask path",
      "A learner can finally ask a question and see a complete source packet in one calm workspace.",
      "The default mode uses the bundled reviewed registry; local API mode is explicit and optional.",
      [
        posture("Reviewed preview", "Default", "Works on GitHub Pages with deterministic registry matching."),
        posture("Local API mode", "Optional", "Calls the private local Source API only when the user selects it."),
        posture("Source card", "Visible", "Citation, family, confidence, review state, rights state, and boundary stay together."),
        posture("No-source", "Visible", "Unsupported questions receive a clear limitation and next action."),
        posture("Memory", "None", "Questions and results are not stored or sent to telemetry.")
      ],
      [
        step("Ask", "Enter one question or choose a sample."),
        step("Match", "Use the reviewed registry or selected local API."),
        step("Read", "Inspect citation, category, confidence, and boundary."),
        step("Carry", "Leave with one next action or an honest no-source state.")
      ],
      [
        decision("Default mode", "Reviewed preview", "The public static site remains useful and honest without a server."),
        decision("Optional mode", "Local API", "Private demo users can exercise the backend spike."),
        decision("Storage", "None", "The demo keeps no question history."),
        decision("Answer generation", "No", "The demo shows source packets, not generated spiritual advice.")
      ],
      metrics("5", "2", "0", "E2E readiness"),
      "Integrated Ask Demo v4.8.0\nDefault: reviewed static registry.\nOptional: private local Source API.\nVisible: citation, family, confidence, review state, rights state, boundary, next action.\nStorage and telemetry: none."
    )
  },
  {
    version: "v4.8.1",
    title: "Source Path Readiness Console",
    href: "sourcepathreadinessconsole.html",
    dataFile: "data/vedapath-source-path-readiness-console.json",
    docFile: "docs/SOURCE_PATH_READINESS_CONSOLE.md",
    bodyClass: "source-path-readiness-console-page",
    label: "Path Readiness",
    eyebrow: "End-to-end evidence",
    headline: "Prove the whole source path before adding more power.",
    copy: "One executable readiness console now checks the review gate, API errors, registry search, Ask demo contracts, legacy backend checks, routes, and static links.",
    changes: "Adds an end-to-end source path checker and founder-readable readiness console covering success, refusal, validation, search, UI integration, legacy regressions, and launch locks.",
    files: ["sourcepathreadinessconsole.html", "data/vedapath-source-path-readiness-console.json", "docs/SOURCE_PATH_READINESS_CONSOLE.md", "scripts/apply-v477-v481-integrated-source-path-batch.mjs", "scripts/check-v477-v481-integrated-source-path.mjs", "scripts/check-v471-v475-backend-spike.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    data: gateData(
      "Integrated source path ready for private demo",
      "The ask-to-source path is now executable, visible, and testable as one bounded product slice.",
      "Passing checks authorize private demonstration only; they do not authorize production or public launch.",
      [
        posture("Review gate", "Pass", "The backend spike continuation decision and locks are explicit."),
        posture("API reliability", "Pass", "Success and typed failure envelopes are tested."),
        posture("Registry search", "Pass", "Approved, review, hold, and no-source lanes remain separate."),
        posture("Ask demo", "Pass", "The learner surface works in reviewed-preview mode and exposes local mode honestly."),
        posture("Public launch", "Blocked", "Security, rights operations, durable identity, privacy, and support remain unfinished.")
      ],
      [
        step("Syntax", "Check every executable module."),
        step("API", "Run health, source, error, source-list, and search contracts."),
        step("UI", "Validate Ask demo structure, accessibility labels, and static assets."),
        step("Regress", "Run legacy backend, route, and static-link checks.")
      ],
      [
        decision("Private demo", "Ready", "The complete bounded source path can be shown locally or in reviewed preview."),
        decision("Hosted backend", "Not yet", "Production security and operations are not in scope."),
        decision("Corpus expansion", "Review next", "Rights-cleared source growth is still required."),
        decision("Public launch", "Blocked", "This is a launch-candidate learning slice, not a released service.")
      ],
      metrics("20+", "9", "0", "Private runbook"),
      "Source Path Readiness Console v4.8.1\nChecks: review gate, API reliability, registry search, Ask demo, legacy backend, route safety, and static links.\nDecision: ready for private demo, blocked for public launch."
    )
  }
];

function posture(title, decision, copy) {
  return { title, decision, copy };
}

function step(title, copy) {
  return { title, copy };
}

function decision(label, value, reason) {
  return { label, value, reason };
}

function metrics(endpoints, checksCount, storage, next) {
  return [
    { label: "Surface", value: endpoints },
    { label: "Checks", value: checksCount },
    { label: "Storage writes", value: storage },
    { label: "Next", value: next }
  ];
}

function locks() {
  return [
    { title: "Live AI lock", copy: "No live model call is enabled." },
    { title: "Storage lock", copy: "No durable user, reviewer, telemetry, or account storage is created." },
    { title: "Rights lock", copy: "No licensed translation or corpus delivery is assumed." },
    { title: "Authority lock", copy: "VedaPath remains source-backed study and reflection support, not a guru or clinician." },
    { title: "Launch lock", copy: "Private demo readiness does not authorize public launch." }
  ];
}

function gateData(position, headline, copy, postures, flow, decisions, metricsValue, packet) {
  return { position, headline, copy, postures, flow, decisions, metrics: metricsValue, locks: locks(), packet };
}

function file(name) {
  return path.join(root, name);
}

function read(name) {
  return readFileSync(file(name), "utf8");
}

function write(name, content) {
  writeFileSync(file(name), content, "utf8");
}

function navHtml(active) {
  const links = [
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
    ["Ask Demo", "askdemo.html"],
    ["Path Readiness", "sourcepathreadinessconsole.html"]
  ];
  return links.map(function (item) {
    return '        <a class="link' + (item[0] === active ? ' active' : '') + '" href="' + item[1] + '">' + item[0] + '</a>';
  }).join("\n");
}

function pageTemplate(item) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <title>" + item.title + " | VedaPath AI</title>",
    '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />',
    '  <link rel="stylesheet" href="assets/vedapath-ui.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css" />',
    "</head>",
    '<body class="' + item.bodyClass + ' retrieval-pilot-surface">',
    '  <main class="workspace" id="top">',
    '    <header class="topbar">',
    '      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">',
    '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    "        <span><strong>VedaPath AI</strong><small>" + item.title.toLowerCase() + "</small></span>",
    "      </a>",
    '      <nav class="navlinks nav" aria-label="Primary navigation">',
    navHtml(item.label),
    '        <span class="version-pill">' + finalBadge + "</span>",
    "      </nav>",
    "    </header>",
    '    <section class="rp-opening">',
    "      <div>",
    '        <span class="rp-eyebrow">' + item.eyebrow + "</span>",
    "        <h1>" + item.headline + "</h1>",
    "        <p>" + item.copy + "</p>",
    "      </div>",
    '      <aside class="rp-opening-card">',
    '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    "        <strong>" + item.title + "</strong>",
    "        <span>Source first. Calm path.</span>",
    "      </aside>",
    "    </section>",
    '    <section data-retrieval-app data-kind="gate" data-data-file="' + item.dataFile + '"></section>',
    "  </main>",
    '  <script src="assets/vedapath-command-shell.js"></script>',
    '  <script src="assets/vedapath-retrieval-pilot.js"></script>',
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

function askDemoTemplate(item) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <title>Integrated Ask Demo | VedaPath AI</title>",
    '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />',
    '  <link rel="stylesheet" href="assets/vedapath-ui.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-ask-demo.css" />',
    "</head>",
    '<body class="integrated-ask-demo-page">',
    '  <main class="workspace vp-ask-workspace" id="top" data-release-file="data/vedapath-integrated-ask-demo.json">',
    '    <header class="topbar">',
    '      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">',
    '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    "        <span><strong>VedaPath AI</strong><small>integrated ask demo</small></span>",
    "      </a>",
    '      <nav class="navlinks nav" aria-label="Primary navigation">',
    navHtml("Ask Demo"),
    '        <span class="version-pill">' + finalBadge + "</span>",
    "      </nav>",
    "    </header>",
    '    <section class="vp-ask-intro">',
    "      <div>",
    '        <span class="vp-ask-eyebrow">' + item.eyebrow + "</span>",
    "        <h1>" + item.headline + "</h1>",
    "        <p>" + item.copy + "</p>",
    "      </div>",
    '      <div class="vp-ask-mode" role="group" aria-label="Source mode">',
    '        <button class="is-active" type="button" data-source-mode="preview" aria-pressed="true">Reviewed preview</button>',
    '        <button type="button" data-source-mode="api" aria-pressed="false">Local API</button>',
    '        <p id="vpModeNote">Uses the bundled reviewed registry. No question leaves this page.</p>',
    "      </div>",
    "    </section>",
    '    <section class="vp-ask-layout" data-ask-demo>',
    '      <form class="vp-ask-form" id="vpAskForm">',
    "        <div>",
    '          <span class="vp-ask-eyebrow">Ask simply</span>',
    "          <h2>What would you like to understand?</h2>",
    "          <p>Ask about a source, concept, category, or practical reflection. VedaPath will show what the current reviewed set can and cannot support.</p>",
    "        </div>",
    '        <label for="vpQuestion">Question</label>',
    '        <textarea id="vpQuestion" name="question" rows="5" maxlength="500" required>What scripture did Oppenheimer quote?</textarea>',
    '        <div class="vp-ask-actions">',
    '          <button class="vp-primary" type="submit">Find source</button>',
    '          <button class="vp-secondary" type="button" id="vpClearQuestion">Clear</button>',
    "        </div>",
    '        <div class="vp-samples" aria-label="Sample questions">',
    '          <button type="button" data-sample="How can I act calmly when results are uncertain?">Steady action</button>',
    '          <button type="button" data-sample="What does the Gayatri mantra come from?">Gayatri source</button>',
    '          <button type="button" data-sample="Did the Vedas predict bitcoin?">Modern claim</button>',
    '          <button type="button" data-sample="What does Isha Upanishad say about possession?">Isha Upanishad</button>',
    "        </div>",
    '        <p class="vp-ask-privacy">Session only. No account, storage, analytics, or telemetry.</p>',
    "      </form>",
    '      <section class="vp-source-result" aria-labelledby="vpResultTitle" aria-live="polite">',
    '        <div class="vp-result-head">',
    "          <div>",
    '            <span class="vp-ask-eyebrow" id="vpResultMode">Reviewed preview</span>',
    '            <h2 id="vpResultTitle">Ready for one question</h2>',
    "          </div>",
    '          <span class="vp-result-status" id="vpResultStatus">Ready</span>',
    "        </div>",
    '        <div id="vpResultBody" class="vp-result-empty">',
    '          <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    "          <p>Your source packet will appear here with its citation, category, confidence, review state, and boundary.</p>",
    "        </div>",
    "      </section>",
    "    </section>",
    '    <aside class="vp-ask-boundary">',
    "      <strong>Calm boundary</strong>",
    "      <span>This demo retrieves reviewed citation metadata and summaries. It does not generate scripture, therapy, ritual instruction, or spiritual commands.</span>",
    "    </aside>",
    "  </main>",
    '  <script src="assets/vedapath-command-shell.js"></script>',
    '  <script src="assets/vedapath-local-api-adapter.js"></script>',
    '  <script src="assets/vedapath-ask-demo.js"></script>',
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

function docTemplate(item) {
  return [
    "# " + item.version + " " + item.title,
    "",
    "## Purpose",
    "",
    item.copy,
    "",
    "## What Changed",
    "",
    item.changes,
    "",
    "## Acceptance Checks",
    "",
    checks,
    "",
    "## Known Risks",
    "",
    risk,
    "",
    "## Founder Packet",
    "",
    item.data.packet,
    ""
  ].join("\n");
}

function changelogEntry(item) {
  return [
    "## " + item.version + " " + item.title,
    "",
    "- Changes made: " + item.changes,
    "- Files changed: " + item.files.map(function (name) { return "'" + name + "'"; }).join(", ") + ".",
    "- Checks run: " + checks,
    "- Known risks: " + risk,
    ""
  ].join("\n");
}

function readmeEntry(item) {
  return [
    "## " + item.version + " " + item.title,
    "",
    item.copy,
    "",
    "- Open: [" + item.title + "](" + item.href + ")",
    "- Data: " + item.dataFile,
    "- Boundary: " + risk,
    ""
  ].join("\n");
}

function registryData() {
  return {
    schema: "vedapath.source-registry.v1",
    release: "v4.7.9",
    rights_posture: "citation metadata and reviewed summary only",
    records: [
      record("bg-2-48-steadiness", "approved", "Steady action", "Bhagavad Gita 2.48", "Bhagavad Gita | Smriti", "Supports practical answers about steady action while avoiding promises of guaranteed calm.", 86, "Reflection support only; not therapy, ritual instruction, or spiritual command.", ["result", "results", "steady", "steadiness", "calm", "action", "uncertain", "outcome"], ["licensed translation display", "final reviewer signature"]),
      record("bg-11-32-category", "approved", "Oppenheimer category correction", "Bhagavad Gita 11.32", "Bhagavad Gita | Smriti", "Corrects the common claim: the famous line is associated with the Gita, not the four Vedas.", 91, "Do not call it a direct quote from the four Vedas.", ["oppenheimer", "destroyer", "death", "time", "gita", "scripture", "quote"], ["translation variant note"]),
      record("rv-3-62-10-gayatri", "hold", "Gayatri mantra care", "Rigveda 3.62.10", "Veda | Shruti", "Useful for source context, but learner-facing practice needs reviewer and rights review.", 68, "No ritual instruction, initiation advice, or recitation authority.", ["gayatri", "savitr", "mantra", "chant", "recitation", "rigveda"], ["mantra reviewer", "recitation boundary", "rights approval"]),
      record("isha-1-stewardship", "review", "Stewardship and restraint", "Isha Upanishad 1", "Upanishad | Shruti", "Can support careful answers about possession and restraint if commentary and rights notes are visible.", 72, "Do not flatten the verse into wealth advice or productivity advice.", ["isha", "possession", "stewardship", "restraint", "wealth"], ["commentary lens", "translation rights"]),
      record("katha-1-3-chariot", "review", "Chariot image and self-mastery", "Katha Upanishad 1.3.3-9", "Upanishad | Shruti", "Offers a layered image of self, intellect, mind, senses, and their objects for careful study.", 74, "Treat this as a philosophical image, not diagnosis or a claim that one school exhausts its meaning.", ["katha", "chariot", "senses", "mind", "intellect", "self mastery"], ["commentary comparison", "translation rights"]),
      record("mundaka-1-1-4-knowledge", "review", "Two kinds of knowledge", "Mundaka Upanishad 1.1.4-5", "Upanishad | Shruti", "Distinguishes two approaches to knowledge and needs commentary before modern educational analogy.", 71, "Do not reduce the distinction to anti-science or anti-education messaging.", ["mundaka", "knowledge", "higher", "lower", "education", "learning"], ["commentary lens", "translation rights"]),
      record("rv-10-129-nasadiya", "hold", "Nasadiya inquiry", "Rigveda 10.129", "Veda | Shruti", "Supports study of early cosmological inquiry and disciplined uncertainty.", 69, "Do not present the hymn as proof of a modern scientific theory.", ["nasadiya", "creation", "cosmology", "origin", "uncertainty", "rigveda"], ["Vedic reviewer", "translation rights", "modern analogy boundary"]),
      record("bg-6-5-self-lift", "review", "Self-support and self-discipline", "Bhagavad Gita 6.5", "Bhagavad Gita | Smriti", "Can support reflection on agency when read with context and without blaming people for suffering.", 73, "Do not use this verse to dismiss mental health care, social conditions, or other support.", ["self", "agency", "discipline", "support", "lift", "mind"], ["context note", "care boundary review"]),
      record("no-source-overclaim", "no-source", "Unsupported modern overclaim", "No direct source", "No-source behavior", "Used to refuse inflated claims when no reviewed source can carry the answer.", 95, "Say no reliable reviewed source is present; do not invent validation.", ["bitcoin", "airplane", "medical", "cure", "diagnosis", "therapy", "predict"], ["none"])
    ]
  };
}

function record(id, status, title, citation, family, summary, confidence, boundary, keywords, missing_fields) {
  return { id, status, title, citation, family, summary, confidence, boundary, keywords, missing_fields, rights_state: status === "approved" ? "citation-only" : "needs-review" };
}

function updateOnce(text, marker, replacement) {
  return text.includes(replacement) ? text : text.replace(marker, replacement);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, 'const releaseBadge = "' + finalBadge + '";');
  text = text.replace(
    /    \{ title: "Source", labels: \[[^\]]+\] \}/,
    '    { title: "Source", labels: ["Ask Demo", "Answers", "Review", "Mantra"] }'
  );
  if (/    \{ title: "Source Path", labels: \[[^\]]+\] \}/.test(text)) {
    text = text.replace(
      /    \{ title: "Source Path", labels: \[[^\]]+\] \}/,
      '    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] }'
    );
  } else {
    text = text.replace(
      '    { title: "Backend Spike", labels: ["Backend Choice", "Local API", "Packet Tests", "API Adapter", "Backend Handoff"] }',
      '    { title: "Backend Spike", labels: ["Backend Choice", "Local API", "Packet Tests", "API Adapter", "Backend Handoff"] },\n    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] }'
    );
  }
  text = updateOnce(
    text,
    '    "Backend Handoff": "Private Demo Backend Handoff"',
    '    "Backend Handoff": "Private Demo Backend Handoff",\n    "Spike Review": "Backend Spike Review Gate",\n    "API Reliability": "Source API Reliability Contract",\n    "Source Registry": "Curated Source Registry",\n    "Ask Demo": "Integrated Ask Demo",\n    "Path Readiness": "Source Path Readiness Console"'
  );
  text = updateOnce(
    text,
    '    "backend-spike-choice-page": "Backend Spike Choice"',
    '    "backend-spike-choice-page": "Backend Spike Choice",\n    "backend-spike-review-gate-page": "Backend Spike Review Gate",\n    "source-api-reliability-contract-page": "Source API Reliability Contract",\n    "curated-source-registry-page": "Curated Source Registry",\n    "integrated-ask-demo-page": "Integrated Ask Demo",\n    "source-path-readiness-console-page": "Source Path Readiness Console"'
  );
  text = updateOnce(
    text,
    '    ["Backend Choice", "backendspikechoice.html"]',
    '    ["Backend Choice", "backendspikechoice.html"],\n    ["Spike Review", "backendspikereviewgate.html"],\n    ["API Reliability", "sourceapireliabilitycontract.html"],\n    ["Source Registry", "curatedsourceregistry.html"],\n    ["Ask Demo", "askdemo.html"],\n    ["Path Readiness", "sourcepathreadinessconsole.html"]'
  );
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  text = updateOnce(
    text,
    '  "privatedemobackendhandoff.html"',
    '  "privatedemobackendhandoff.html",\n  "backendspikereviewgate.html",\n  "sourceapireliabilitycontract.html",\n  "curatedsourceregistry.html",\n  "askdemo.html",\n  "sourcepathreadinessconsole.html"'
  );
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v4\.7\.6 route guard<\/span>/g, '<span class="version-pill">' + finalBadge + '</span>');
  text = text.replace("<strong>v4.7.6</strong>\n          <p>Route Safety Guard fixes Brand-board subfolder links, protects stale /brand/*.html URLs, and adds route checks so GitHub Pages does not strand users on broken nested pages.</p>", "<strong>v4.8.1</strong>\n          <p>Source Path Readiness Console completes the first integrated ask-to-source slice: review gate, reliable local API, curated registry, usable Ask demo, and end-to-end checks.</p>");
  text = text.replace("<strong>v4.7.7 Backend Spike Review Gate</strong>\n          <p>Review the private demo evidence and choose the smallest production-grade backend slice.</p>", "<strong>v4.8.2 Private Demo Runbook</strong>\n          <p>Turn the integrated source path into a repeatable founder and reviewer demo with measured outcomes.</p>");
  text = text.replace('<div class="version-row"><span>Release</span><strong>v4.7.6 Route Safety Guard</strong></div>', '<div class="version-row"><span>Release</span><strong>v4.8.1 Source Path Readiness Console</strong></div>');
  text = text.replace('<div class="version-row"><span>Previous</span><strong>v4.7.5 Private Demo Backend Handoff</strong></div>', '<div class="version-row"><span>Previous</span><strong>v4.8.0 Integrated Ask Demo</strong></div>');
  text = text.replace("Keep every command-shell link root-safe on GitHub Pages, including subfolder pages and stale nested routes.", "Prove one complete, source-first ask path while preserving visible boundaries and launch locks.");
  text = text.replace("Brand route 404 fixed and ready for backend spike review gate", "Integrated source path ready for private demo; public launch remains blocked");
  text = text.replace('<li><span class="dot"></span><span>Review the local Source API demo output.</span></li>\n            <li><span class="dot"></span><span>Choose production backend slice: Node service, serverless route, or hosted prototype.</span></li>\n            <li><span class="dot"></span><span>Keep real corpus, accounts, telemetry, payment, and public launch closed until reviewed.</span></li>\n            <li><span class="dot"></span><span>Convert handoff packet into implementation acceptance criteria.</span></li>', '<li><span class="dot"></span><span>Run the private Ask demo in reviewed-preview and local API modes.</span></li>\n            <li><span class="dot"></span><span>Collect founder and reviewer observations without hidden telemetry.</span></li>\n            <li><span class="dot"></span><span>Plan rights-cleared source expansion and production security separately.</span></li>\n            <li><span class="dot"></span><span>Keep accounts, payments, public launch, and authority claims closed.</span></li>');
  write("build-status.html", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace('<a class="button primary" href="#ask">Begin with Ask</a>', '<a class="button primary" href="askdemo.html">Begin with Ask</a>');
  write("index.html", text);
}

function updateDocs() {
  const entries = releases.slice().reverse();
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.8.1 Source Path Readiness Console")) {
    changelog = entries.map(changelogEntry).join("\n") + "\n" + changelog;
  }
  write("CHANGELOG.md", changelog);
  let readme = read("README.md");
  if (!readme.includes("## v4.8.1 Source Path Readiness Console")) {
    readme = entries.map(readmeEntry).join("\n") + "\n" + readme;
  }
  write("README.md", readme);
}

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docTemplate(item));
  write(item.href, item.version === "v4.8.0" ? askDemoTemplate(item) : pageTemplate(item));
}

write("data/vedapath-source-registry.json", JSON.stringify(registryData(), null, 2) + "\n");
updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateIndex();
updateDocs();

console.log("v4.7.7-v4.8.1 integrated source path batch scaffold applied");
