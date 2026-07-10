import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.8.6 hosted gate";
const sharedRisk = "Private-demo tooling only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.";

function file(name) {
  return path.join(root, name);
}

function read(name) {
  return readFileSync(file(name), "utf8");
}

function write(name, content) {
  writeFileSync(file(name), content, "utf8");
}

function posture(title, decision, copy) {
  return { title, decision, copy };
}

function step(title, copy) {
  return { title, copy };
}

function decision(label, value, reason) {
  return { label, value, reason };
}

function metric(label, value) {
  return { label, value };
}

function locks() {
  return [
    posture("Live AI lock", "Closed", "No model call or generated scripture is enabled."),
    posture("Storage lock", "Closed", "No durable learner, reviewer, observation, or telemetry storage is created."),
    posture("Rights lock", "Closed", "No translation text is published without recorded rights evidence."),
    posture("Authority lock", "Closed", "The product remains study and reflection support, not a guru, clinician, or ritual authority."),
    posture("Launch lock", "Closed", "Private-demo evidence does not authorize a public service.")
  ];
}

function baseData(position, headline, copy, postures, flow, decisions, metrics, packet, extras = {}) {
  return { position, headline, copy, postures, flow, decisions, metrics, locks: locks(), packet, ...extras };
}

const releases = [
  {
    version: "v4.8.2",
    title: "Private Demo Runbook",
    label: "Demo Runbook",
    href: "privatedemorunbook.html",
    dataFile: "data/vedapath-private-demo-runbook-v482.json",
    docFile: "docs/PRIVATE_DEMO_RUNBOOK_V482.md",
    bodyClass: "private-demo-runbook-page",
    eyebrow: "Repeatable private demo",
    headline: "Show the source path the same honest way every time.",
    copy: "A canonical scenario set and executable runner now cover approved, review, hold, no-source, and offline-fallback behavior without creating user data.",
    changes: "Adds a canonical private-demo scenario contract, an executable API and registry runner, a human runbook, context-aware evidence labels, expected evidence, and explicit stop conditions.",
    files: ["privatedemorunbook.html", "data/vedapath-private-demo-runbook-v482.json", "docs/PRIVATE_DEMO_RUNBOOK_V482.md", "scripts/run-v482-private-demo.mjs", "assets/vedapath-retrieval-pilot.js"],
    checks: "node --check scripts/run-v482-private-demo.mjs; node scripts/run-v482-private-demo.mjs; batch checker through v4.8.2; static-link smoke.",
    data: baseData(
      "Private source-path demo is repeatable",
      "Five scenarios now prove what VedaPath can answer, hold, refuse, and recover from.",
      "The runner uses the same registry and local API contract as the learner Ask room, so demo evidence cannot drift into a separate product story.",
      [
        posture("Approved source", "Pass", "Oppenheimer resolves to Bhagavad Gita 11.32 with a category correction."),
        posture("Review source", "Pass", "Isha Upanishad remains visibly in review rather than silently promoted."),
        posture("Hold source", "Pass", "Gayatri context remains held for rights and reviewer work."),
        posture("No source", "Pass", "Bitcoin overclaim returns a transparent refusal packet."),
        posture("Offline API", "Pass", "The browser names the reviewed fallback instead of pretending the API responded.")
      ],
      [
        step("Prepare", "Open the Ask demo in reviewed-preview mode."),
        step("Prove", "Run approved, review, hold, and no-source questions."),
        step("Recover", "Switch to local mode with the API offline and observe the named fallback."),
        step("Close", "State the storage, rights, authority, and launch locks before discussion.")
      ],
      [
        decision("Demo posture", "Private", "The scenario set is suitable for founder and reviewer learning only."),
        decision("Evidence", "Executable", "Registry and local API results are checked from one runner."),
        decision("Observation", "Next", "Reviewer notes need an explicit session-only surface."),
        decision("Public launch", "Blocked", "A repeatable demo is not production authorization.")
      ],
      [metric("Scenarios", "5"), metric("Hidden writes", "0"), metric("Failure states", "2"), metric("Next", "Observation capture")],
      "Private Demo Runbook v4.8.2\nRun: node scripts/run-v482-private-demo.mjs\nExpected: 5/5 scenarios pass.\nBoundary: private demo only; stop if citation, review state, rights state, boundary, or fallback label is missing.",
      {
        labels: { posture: "Demo evidence", posture_question: "What must pass?", main: "Private demo runbook", decision: "Scenario decisions", packet: "Demo packet", pulse: "Scenario pulse", copy: "Copy demo packet" },
        primary_action: { href: "askdemo.html", label: "Open Ask Demo" },
        schema: "vedapath.private-demo-runbook.v1",
        release: "v4.8.2",
        scenarios: [
          { id: "approved-category", question: "What scripture did Oppenheimer quote?", expected: { citation: "Bhagavad Gita 11.32", reviewer_state: "approved", source_found: true } },
          { id: "review-context", question: "What does Isha Upanishad say about possession?", expected: { citation: "Isha Upanishad 1", reviewer_state: "review", source_found: true } },
          { id: "hold-practice", question: "What does the Gayatri mantra come from?", expected: { citation: "Rigveda 3.62.10", reviewer_state: "hold", source_found: true } },
          { id: "no-source-overclaim", question: "Did the Vedas predict bitcoin?", expected: { citation: "No direct source", reviewer_state: "no-source", source_found: false } },
          { id: "offline-fallback", question: "How can I act calmly when results are uncertain?", expected: { fallback_label: "Reviewed fallback", storage: "none" } }
        ],
        stop_conditions: ["citation missing", "source family missing", "review state hidden", "rights state hidden", "boundary missing", "fallback unnamed"]
      }
    )
  },
  {
    version: "v4.8.3",
    title: "Reviewer Observation Capture",
    label: "Observations",
    href: "reviewerobservations.html",
    dataFile: "data/vedapath-reviewer-observation-capture.json",
    docFile: "docs/REVIEWER_OBSERVATION_CAPTURE.md",
    bodyClass: "reviewer-observation-capture-page",
    eyebrow: "Visible human learning",
    headline: "Capture what a reviewer noticed, without quietly tracking the learner.",
    copy: "A session-only observation desk records source fit, boundary quality, usefulness, and notes, then creates a transparent copyable packet on demand.",
    changes: "Adds an accessible session-only reviewer observation desk, explicit criteria, copyable review packets, clear controls, and zero automatic persistence or telemetry.",
    files: ["reviewerobservations.html", "data/vedapath-reviewer-observation-capture.json", "docs/REVIEWER_OBSERVATION_CAPTURE.md", "assets/vedapath-demo-operations.css", "assets/vedapath-reviewer-observations.js", "assets/vedapath-ask-demo.css", "askdemo.html"],
    checks: "node --check assets/vedapath-reviewer-observations.js; batch checker through v4.8.3; static-link smoke; keyboard and browser visual QA.",
    type: "reviewer",
    data: baseData(
      "Reviewer observations are explicit and session only",
      "Human judgment now has a visible place without becoming hidden analytics.",
      "Nothing is saved automatically. The reviewer chooses what to record, copy, and clear, and the packet labels its limits.",
      [
        posture("Source fit", "Visible", "Reviewers assess whether the citation actually carries the response."),
        posture("Boundary quality", "Visible", "Reviewers assess whether overclaim and authority limits are clear."),
        posture("Usefulness", "Visible", "A simple rating captures whether the response helps the learner."),
        posture("Persistence", "None", "Refreshing the page clears the review session."),
        posture("Telemetry", "None", "No observation leaves the browser automatically.")
      ],
      [
        step("Choose", "Select the runbook scenario being reviewed."),
        step("Assess", "Set source fit, boundary quality, and usefulness."),
        step("Note", "Add a concise human observation without learner identifiers."),
        step("Control", "Copy the packet deliberately or clear the session.")
      ],
      [
        decision("Default", "No save", "Observation capture starts empty on every page load."),
        decision("Identity", "Optional label", "The prototype does not claim authenticated reviewer identity."),
        decision("Export", "Copy only", "Review packets move only through an explicit reviewer action."),
        decision("Production", "Blocked", "Real review operations need accounts, permissions, retention, and audit policy.")
      ],
      [metric("Criteria", "4"), metric("Auto-saves", "0"), metric("Network writes", "0"), metric("Next", "Rights intake")],
      "Reviewer Observation Capture v4.8.3\nStorage: memory only.\nExport: explicit copy action.\nProhibited: learner identifiers, hidden telemetry, automatic upload, and implied reviewer approval.",
      {
        schema: "vedapath.reviewer-observation-config.v1",
        release: "v4.8.3",
        criteria: [
          { id: "source_fit", label: "Source fit", options: ["Strong", "Partial", "Weak"] },
          { id: "boundary_quality", label: "Boundary quality", options: ["Clear", "Needs revision", "Missing"] },
          { id: "usefulness", label: "Usefulness", options: ["Helpful", "Mixed", "Not helpful"] },
          { id: "next_action", label: "Next action", options: ["Keep", "Revise", "Hold"] }
        ],
        scenarios: [
          { id: "approved-category", label: "Oppenheimer category correction", citation: "Bhagavad Gita 11.32" },
          { id: "review-context", label: "Isha Upanishad context", citation: "Isha Upanishad 1" },
          { id: "hold-practice", label: "Gayatri source hold", citation: "Rigveda 3.62.10" },
          { id: "no-source-overclaim", label: "Bitcoin no-source refusal", citation: "No direct source" }
        ],
        privacy: { persistence: "none", telemetry: "none", automatic_network_write: false, prohibited_fields: ["learner name", "email", "phone", "medical information"] }
      }
    )
  },
  {
    version: "v4.8.4",
    title: "Rights-Cleared Source Intake",
    label: "Rights Intake",
    href: "rightsclearedsourceintake.html",
    dataFile: "data/vedapath-rights-cleared-source-intake.json",
    docFile: "docs/RIGHTS_CLEARED_SOURCE_INTAKE.md",
    bodyClass: "rights-cleared-source-intake-page",
    eyebrow: "Guarded source growth",
    headline: "A source candidate should prove its rights posture before it approaches review.",
    copy: "The new intake contract validates citation, family, summary, boundary, rights lane, evidence, and reviewer routing while keeping every candidate blocked from publication.",
    changes: "Adds a machine-readable intake contract, pure validator, browser intake desk, guarded rights lanes, sample fixtures, and a publication lock that client input cannot override.",
    files: ["rightsclearedsourceintake.html", "data/vedapath-rights-cleared-source-intake.json", "docs/RIGHTS_CLEARED_SOURCE_INTAKE.md", "scripts/vedapath-source-intake-validator.mjs", "assets/vedapath-source-intake.js", "assets/vedapath-demo-operations.css"],
    checks: "node --check scripts/vedapath-source-intake-validator.mjs; node --check assets/vedapath-source-intake.js; valid and invalid intake fixtures; batch checker through v4.8.4; browser form QA.",
    type: "intake",
    data: baseData(
      "Source intake is rights-first and publication-blocked",
      "A candidate cannot become a reviewed source record by filling out a form.",
      "The intake packet records evidence and routing, then stops at draft status until real rights and reviewer operations exist.",
      [
        posture("Citation", "Required", "Every candidate names a precise source location."),
        posture("Rights lane", "Required", "Citation-only, public-domain, permission-recorded, needs-review, and blocked remain distinct."),
        posture("Evidence", "Required", "Any usable rights lane needs a human-readable evidence note."),
        posture("Reviewer route", "Required", "A named review lane must receive the candidate."),
        posture("Publication", "Blocked", "The validator always emits publication_state blocked.")
      ],
      [
        step("Identify", "Record citation, source family, and edition note."),
        step("Bound", "Write the summary and answer boundary without copied translation text."),
        step("Evidence", "Choose a rights lane and record its evidence."),
        step("Route", "Create a draft packet for human review, never publication.")
      ],
      [
        decision("Full text", "Excluded", "This intake stores metadata and summaries, not translation text."),
        decision("Approval", "Human gate", "A form submission cannot approve itself."),
        decision("Storage", "None", "The browser creates a copyable draft but does not save it."),
        decision("Registry merge", "Manual", "No candidate enters the reviewed registry automatically.")
      ],
      [metric("Required fields", "8"), metric("Rights lanes", "5"), metric("Auto-publish", "0"), metric("Next", "Security review")],
      "Rights-Cleared Source Intake v4.8.4\nOutput: vedapath.source-intake.v1 draft packet.\nInvariant: publication_state is always blocked.\nBoundary: metadata and reviewed summary only; no translation text.",
      {
        schema: "vedapath.source-intake-config.v1",
        release: "v4.8.4",
        required_fields: ["candidate_id", "citation", "family", "edition_note", "summary", "boundary", "rights_state", "rights_evidence", "review_lane"],
        rights_lanes: [
          { id: "citation-only", label: "Citation only", usable: true },
          { id: "public-domain", label: "Public domain evidence", usable: true },
          { id: "permission-recorded", label: "Permission recorded", usable: true },
          { id: "needs-review", label: "Needs rights review", usable: false },
          { id: "blocked", label: "Blocked", usable: false }
        ],
        invariants: ["publication_state is blocked", "reviewer_state is draft", "no translation_text field", "rights evidence required", "manual registry merge only"],
        sample: {
          candidate_id: "candidate-isha-1",
          citation: "Isha Upanishad 1",
          family: "Upanishad | Shruti",
          edition_note: "Citation metadata only; translation selection pending.",
          summary: "Candidate for a careful discussion of stewardship and restraint.",
          boundary: "Do not flatten the verse into financial or productivity advice.",
          rights_state: "citation-only",
          rights_evidence: "Only citation metadata and an original short summary are included.",
          review_lane: "Upanishad reviewer"
        }
      }
    )
  },
  {
    version: "v4.8.5",
    title: "Security & Privacy Review",
    label: "Security Review",
    href: "securityprivacyreview.html",
    dataFile: "data/vedapath-security-privacy-review.json",
    docFile: "docs/SECURITY_PRIVACY_REVIEW.md",
    bodyClass: "security-privacy-review-page",
    eyebrow: "Threat-aware private demo",
    headline: "Protect the learner before asking the source path to scale.",
    copy: "The active Ask path now has explicit origin, payload, storage, telemetry, framing, caching, rights, and authority controls with automated verification.",
    changes: "Hardens local API response headers and null-origin handling, adds a machine-readable threat model, and verifies the active Ask, observation, and intake surfaces for privacy regressions.",
    files: ["securityprivacyreview.html", "data/vedapath-security-privacy-review.json", "docs/SECURITY_PRIVACY_REVIEW.md", "scripts/vedapath-local-source-api-server.mjs", "scripts/check-v482-v486-private-demo-hardening.mjs"],
    checks: "API security-header assertions; disallowed and null-origin tests; no-storage and no-telemetry scans; rights-field scan; batch checker through v4.8.5.",
    data: baseData(
      "Private demo security baseline verified",
      "The active path now fails closed on origins, payloads, hidden persistence, and rights leakage.",
      "These controls reduce prototype risk, but they are not a substitute for production identity, secrets, monitoring, abuse prevention, or incident response.",
      [
        posture("Origin policy", "Pass", "Only approved local and GitHub Pages origins receive browser access."),
        posture("Null origin", "Blocked", "File-origin browser calls no longer receive local API access."),
        posture("Security headers", "Pass", "No-store, nosniff, frame, referrer, permission, and CSP headers are present."),
        posture("User content storage", "Pass", "Ask, observations, and intake do not persist user-entered content."),
        posture("Translation leakage", "Pass", "The registry and intake contract contain no translation_text field.")
      ],
      [
        step("Minimize", "Collect only the question or explicit reviewer draft needed for the task."),
        step("Validate", "Reject unsafe origins, oversized bodies, malformed JSON, and empty questions."),
        step("Contain", "Return source metadata and short summaries with no-store headers."),
        step("Review", "Keep public launch closed until production security operations exist.")
      ],
      [
        decision("Prototype risk", "Reduced", "The most likely local-demo failures now have verified controls."),
        decision("Production security", "Not ready", "Authentication, authorization, secrets, monitoring, rate limits, and incident response are absent."),
        decision("Sensitive data", "Prohibited", "The active flow should not collect medical, financial, or identifying information."),
        decision("Public launch", "Blocked", "Security review authorizes the next prototype decision only.")
      ],
      [metric("Threats", "8"), metric("Required headers", "7"), metric("Hidden writes", "0"), metric("Next", "Hosted gate")],
      "Security & Privacy Review v4.8.5\nScope: active private Ask path.\nVerified: origin, headers, payload, storage, telemetry, rights, and authority boundaries.\nResidual: production identity, secrets, rate limiting, monitoring, retention, support, and incident response.",
      {
        labels: { posture: "Control posture", posture_question: "What is protected?", main: "Security review", decision: "Residual decisions", packet: "Security packet", pulse: "Control pulse", copy: "Copy security packet" },
        primary_action: { href: "sourcepathreadinessconsole.html", label: "Open Path Readiness" },
        schema: "vedapath.security-review.v1",
        release: "v4.8.5",
        threats: [
          { id: "unapproved-origin", control: "origin allowlist", status: "verified" },
          { id: "file-origin-call", control: "null origin blocked", status: "verified" },
          { id: "oversized-payload", control: "16 KB body limit", status: "verified" },
          { id: "malformed-input", control: "typed validation errors", status: "verified" },
          { id: "hidden-persistence", control: "active input surfaces have no storage calls", status: "verified" },
          { id: "hidden-telemetry", control: "active input surfaces have no analytics calls", status: "verified" },
          { id: "rights-leak", control: "metadata-only registry and intake", status: "verified" },
          { id: "authority-overreach", control: "visible answer and intake boundaries", status: "verified" }
        ],
        residual_risks: ["authentication", "authorization", "secret management", "rate limiting", "monitoring", "incident response", "retention policy", "abuse support"]
      }
    )
  },
  {
    version: "v4.8.6",
    title: "Hosted Backend Decision Gate",
    label: "Hosted Gate",
    href: "hostedbackenddecisiongate.html",
    dataFile: "data/vedapath-hosted-backend-decision-gate.json",
    docFile: "docs/HOSTED_BACKEND_DECISION_GATE.md",
    bodyClass: "hosted-backend-decision-gate-page",
    eyebrow: "Smallest honest hosted slice",
    headline: "Choose a read-only source service before choosing infrastructure scale.",
    copy: "The decision gate selects a deployment-neutral read-only handler over the reviewed registry, proves contract parity locally, and leaves deployment and every write path unauthorized.",
    changes: "Adds a deployment-neutral read-only source handler, parity tests, architecture decision record, explicit service boundaries, and a hosted-backend decision gate without deploying infrastructure.",
    files: ["hostedbackenddecisiongate.html", "data/vedapath-hosted-backend-decision-gate.json", "docs/HOSTED_BACKEND_DECISION_GATE.md", "scripts/vedapath-readonly-source-handler.mjs", "scripts/check-v482-v486-private-demo-hardening.mjs", "scripts/apply-v482-v486-private-demo-hardening-batch.mjs", "scripts/check-v477-v481-integrated-source-path.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-readonly-source-handler.mjs; handler and local API parity fixtures; full batch checker; legacy source-path, backend, route, and static-link regressions; desktop and mobile browser QA.",
    data: baseData(
      "Read-only hosted adapter selected; deployment not authorized",
      "The next backend slice is one portable source contract, not a premature platform.",
      "A pure handler can serve health, source, sources, and search responses from the reviewed registry without accounts, writes, secrets, model calls, or framework lock-in.",
      [
        posture("Service shape", "Selected", "Deployment-neutral read-only request handler."),
        posture("Data source", "Selected", "Versioned reviewed registry bundled at build time."),
        posture("Write paths", "Blocked", "No learner, review, telemetry, or registry mutation endpoint."),
        posture("Live model", "Blocked", "No generation or model credential belongs in this slice."),
        posture("Deployment", "Not authorized", "Provider, region, budget, and operations remain a founder decision.")
      ],
      [
        step("Adapt", "Map a platform request into the pure handler contract."),
        step("Resolve", "Use the same reviewed registry and no-source behavior as the local API."),
        step("Return", "Emit the versioned source envelope with no-store and request trace metadata."),
        step("Observe", "Add production logging and abuse controls only after explicit privacy design.")
      ],
      [
        decision("Architecture", "Read-only adapter", "It preserves the proven contract with the smallest blast radius."),
        decision("Provider", "Deferred", "No cloud vendor is required to validate the service boundary."),
        decision("Database", "No", "The first hosted slice reads a reviewed build artifact."),
        decision("Next build", "Adapter prototype", "A provider-specific preview can follow only with credentials and deployment approval.")
      ],
      [metric("Read routes", "4"), metric("Write routes", "0"), metric("Model calls", "0"), metric("Deployment", "Blocked")],
      "Hosted Backend Decision Gate v4.8.6\nDecision: deployment-neutral read-only source handler.\nData: reviewed build-time registry.\nExcluded: database, accounts, writes, telemetry, payments, model calls, and public launch.\nNext candidate: v4.8.7 Read-only Hosted API Adapter.",
      {
        labels: { posture: "Decision posture", posture_question: "What may proceed?", main: "Architecture gate", decision: "Architecture decisions", packet: "Decision record", pulse: "Decision pulse", copy: "Copy decision record" },
        primary_action: { href: "curatedsourceregistry.html", label: "Open Source Registry" },
        schema: "vedapath.hosted-backend-decision.v1",
        release: "v4.8.6",
        decision: "deployment-neutral-read-only-handler",
        routes: ["GET /health", "GET /sources", "GET /search", "GET|POST /source"],
        writes: [],
        dependencies: ["versioned source registry", "vedapath.source.v1 contract"],
        deferred: ["provider", "region", "budget", "domain", "TLS operations", "rate limiting", "monitoring", "incident response"],
        launch: "blocked"
      }
    )
  }
];

function navHtml(active) {
  const links = [
    ["Home", "index.html"], ["Build", "build-status.html"], ["Brand", "brand/brand-board.html"], ["Blueprint", "blueprint.html"],
    ["Answers", "citedanswerlab.html"], ["Review", "reviewqueuepersistence.html"], ["Mantra", "mantralenslab.html"],
    ["Life", "lifecompanionlab.html"], ["Talk", "conversationcompanionlab.html"], ["Pattern", "patterncompanionlab.html"], ["Daily", "daily.html"],
    ["Ask Demo", "askdemo.html"], ["Path Readiness", "sourcepathreadinessconsole.html"], ["Demo Runbook", "privatedemorunbook.html"], ["Observations", "reviewerobservations.html"],
    ["Rights Intake", "rightsclearedsourceintake.html"], ["Security Review", "securityprivacyreview.html"], ["Hosted Gate", "hostedbackenddecisiongate.html"]
  ];
  return links.map(function ([label, href]) {
    return '        <a class="link' + (label === active ? ' active' : '') + '" href="' + href + '">' + label + '</a>';
  }).join("\n");
}

function header(item, subtitle) {
  return [
    '    <header class="topbar">',
    '      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">',
    '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    '        <span><strong>VedaPath AI</strong><small>' + subtitle + '</small></span>',
    '      </a>',
    '      <nav class="navlinks nav" aria-label="Primary navigation">',
    navHtml(item.label),
    '        <span class="version-pill">' + finalBadge + '</span>',
    '      </nav>',
    '    </header>'
  ].join("\n");
}

function gatePage(item) {
  return [
    "<!doctype html>", '<html lang="en">', "<head>", '  <meta charset="utf-8" />', '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <title>" + item.title + " | VedaPath AI</title>", '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />',
    '  <link rel="stylesheet" href="assets/vedapath-ui.css" />', '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css" />', "</head>",
    '<body class="' + item.bodyClass + ' retrieval-pilot-surface">', '  <main class="workspace" id="top">', header(item, item.title.toLowerCase()),
    '    <section class="rp-opening">', "      <div>", '        <span class="rp-eyebrow">' + item.eyebrow + '</span>',
    "        <h1>" + item.headline + "</h1>", "        <p>" + item.copy + "</p>", "      </div>",
    '      <aside class="rp-opening-card">', '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />',
    "        <strong>" + item.title + "</strong>", "        <span>Source first. Calm path.</span>", "      </aside>", "    </section>",
    '    <section data-retrieval-app data-kind="gate" data-data-file="' + item.dataFile + '"></section>',
    "  </main>", '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-retrieval-pilot.js"></script>',
    "</body>", "</html>", ""
  ].join("\n");
}

function reviewerPage(item) {
  return [
    "<!doctype html>", '<html lang="en">', "<head>", '  <meta charset="utf-8" />', '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <title>Reviewer Observation Capture | VedaPath AI</title>", '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />',
    '  <link rel="stylesheet" href="assets/vedapath-ui.css" />', '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-demo-operations.css" />', "</head>", '<body class="' + item.bodyClass + '">',
    '  <main class="workspace vp-ops-workspace" id="top" data-config="' + item.dataFile + '">', header(item, "reviewer observations"),
    '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>',
    '      <aside><strong>Session boundary</strong><span>No account. No automatic save. No analytics. Copy only when you choose.</span></aside>', '    </section>',
    '    <section class="vp-ops-columns">',
    '      <form class="vp-ops-form" id="vpObservationForm">', '        <div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Review one scenario</span><h2>What did the human notice?</h2></div><span>Required fields are marked</span></div>',
    '        <label for="vpObservationScenario">Scenario</label><select id="vpObservationScenario" required></select>',
    '        <div class="vp-ops-field-grid">',
    '          <label>Source fit<select id="vpSourceFit" required><option>Strong</option><option>Partial</option><option>Weak</option></select></label>',
    '          <label>Boundary quality<select id="vpBoundaryQuality" required><option>Clear</option><option>Needs revision</option><option>Missing</option></select></label>',
    '          <label>Usefulness<select id="vpUsefulness" required><option>Helpful</option><option>Mixed</option><option>Not helpful</option></select></label>',
    '          <label>Next action<select id="vpObservationAction" required><option>Keep</option><option>Revise</option><option>Hold</option></select></label>',
    '        </div>',
    '        <label for="vpReviewerLabel">Reviewer label <span>(optional, no personal data)</span></label><input id="vpReviewerLabel" maxlength="60" placeholder="Example: source reviewer" />',
    '        <label for="vpObservationNotes">Observation</label><textarea id="vpObservationNotes" rows="5" maxlength="800" required placeholder="What helped, what was unclear, and what should change?"></textarea>',
    '        <button class="vp-ops-primary" type="submit">Add observation</button>',
    '      </form>',
    '      <section class="vp-ops-output" aria-labelledby="vpObservationQueueTitle">',
    '        <div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Session packet</span><h2 id="vpObservationQueueTitle">Observations <span id="vpObservationCount">0</span></h2></div><span>Memory only</span></div>',
    '        <div id="vpObservationList" class="vp-ops-empty"><p>No observations yet. Review one scenario to begin.</p></div>',
    '        <div class="vp-ops-actions"><button class="vp-ops-secondary" type="button" id="vpCopyObservations" disabled>Copy session packet</button><button class="vp-ops-quiet" type="button" id="vpClearObservations" disabled>Clear session</button></div>',
    '        <p class="vp-ops-status" id="vpObservationStatus" aria-live="polite">Nothing has been stored or sent.</p>',
    '      </section>',
    '    </section>',
    '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-reviewer-observations.js"></script>',
    "</body>", "</html>", ""
  ].join("\n");
}

function intakePage(item) {
  return [
    "<!doctype html>", '<html lang="en">', "<head>", '  <meta charset="utf-8" />', '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <title>Rights-Cleared Source Intake | VedaPath AI</title>", '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />',
    '  <link rel="stylesheet" href="assets/vedapath-ui.css" />', '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />',
    '  <link rel="stylesheet" href="assets/vedapath-demo-operations.css" />', "</head>", '<body class="' + item.bodyClass + '">',
    '  <main class="workspace vp-ops-workspace" id="top" data-config="' + item.dataFile + '">', header(item, "rights-cleared intake"),
    '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>',
    '      <aside><strong>Publication lock</strong><span>Every output remains a draft. This form cannot approve, merge, or publish a source.</span></aside>', '    </section>',
    '    <section class="vp-ops-columns">',
    '      <form class="vp-ops-form" id="vpSourceIntakeForm">', '        <div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Candidate metadata</span><h2>Prepare a rights-aware draft</h2></div><button class="vp-ops-quiet" id="vpLoadIntakeSample" type="button">Load sample</button></div>',
    '        <div class="vp-ops-field-grid"><label>Candidate ID<input id="vpCandidateId" required maxlength="80" placeholder="candidate-unique-id" /></label><label>Citation<input id="vpCitation" required maxlength="120" placeholder="Text and passage" /></label><label>Source family<input id="vpFamily" required maxlength="120" placeholder="Upanishad | Shruti" /></label><label>Edition note<input id="vpEditionNote" required maxlength="240" placeholder="Edition or metadata posture" /></label></div>',
    '        <label for="vpCandidateSummary">Original short summary</label><textarea id="vpCandidateSummary" required rows="3" maxlength="500"></textarea>',
    '        <label for="vpCandidateBoundary">Answer boundary</label><textarea id="vpCandidateBoundary" required rows="3" maxlength="500"></textarea>',
    '        <div class="vp-ops-field-grid"><label>Rights lane<select id="vpRightsState" required></select></label><label>Review lane<input id="vpReviewLane" required maxlength="100" placeholder="Upanishad reviewer" /></label></div>',
    '        <label for="vpRightsEvidence">Rights evidence note</label><textarea id="vpRightsEvidence" required rows="3" maxlength="600" placeholder="Describe why this metadata and summary can be reviewed."></textarea>',
    '        <button class="vp-ops-primary" type="submit">Validate draft</button>',
    '      </form>',
    '      <section class="vp-ops-output" aria-labelledby="vpIntakeOutputTitle">',
    '        <div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Guarded output</span><h2 id="vpIntakeOutputTitle">Draft packet</h2></div><span id="vpIntakeState">Blocked</span></div>',
    '        <div id="vpIntakeMessages" class="vp-ops-empty"><p>Complete the form to validate a source candidate. No data is stored.</p></div>',
    '        <pre id="vpIntakePacket" class="vp-ops-packet" hidden></pre>',
    '        <div class="vp-ops-actions"><button class="vp-ops-secondary" type="button" id="vpCopyIntake" disabled>Copy draft packet</button><button class="vp-ops-quiet" type="button" id="vpResetIntake">Reset</button></div>',
    '        <p class="vp-ops-status" id="vpIntakeStatus" aria-live="polite">Publication remains blocked.</p>',
    '      </section>',
    '    </section>',
    '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-source-intake.js"></script>',
    "</body>", "</html>", ""
  ].join("\n");
}

function docEntry(item) {
  return [
    "# " + item.version + " " + item.title, "", "## Purpose", "", item.copy, "", "## What Changed", "", item.changes, "",
    "## Acceptance Checks", "", item.checks, "", "## Known Risks", "", sharedRisk, "", "## Founder Packet", "", item.data.packet, ""
  ].join("\n");
}

function changelogEntry(item) {
  return [
    "## " + item.version + " " + item.title, "", "- Changes made: " + item.changes,
    "- Files changed: " + item.files.map(function (name) { return "`" + name + "`"; }).join(", ") + ".",
    "- Checks run: " + item.checks, "- Known risks: " + sharedRisk, ""
  ].join("\n");
}

function readmeEntry(item) {
  return [
    "## " + item.version + " " + item.title, "", item.copy, "", "- Open: [" + item.title + "](" + item.href + ")",
    "- Data: `" + item.dataFile + "`", "- Boundary: " + sharedRisk, ""
  ].join("\n");
}

function updateOnce(text, marker, replacement) {
  return text.includes(replacement) ? text : text.replace(marker, replacement);
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, 'const releaseBadge = "' + finalBadge + '";');
  text = text.replace(
    '    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] }',
    '    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] },\n    { title: "Private Demo", labels: ["Demo Runbook", "Observations", "Rights Intake", "Security Review", "Hosted Gate"] }'
  );
  text = updateOnce(text, '    "Path Readiness": "Source Path Readiness Console"', '    "Path Readiness": "Source Path Readiness Console",\n    "Demo Runbook": "Private Demo Runbook",\n    "Observations": "Reviewer Observation Capture",\n    "Rights Intake": "Rights-Cleared Source Intake",\n    "Security Review": "Security & Privacy Review",\n    "Hosted Gate": "Hosted Backend Decision Gate"');
  text = updateOnce(text, '    "source-path-readiness-console-page": "Source Path Readiness Console"', '    "source-path-readiness-console-page": "Source Path Readiness Console",\n    "private-demo-runbook-page": "Private Demo Runbook",\n    "reviewer-observation-capture-page": "Reviewer Observation Capture",\n    "rights-cleared-source-intake-page": "Rights-Cleared Source Intake",\n    "security-privacy-review-page": "Security & Privacy Review",\n    "hosted-backend-decision-gate-page": "Hosted Backend Decision Gate"');
  text = updateOnce(text, '    ["Path Readiness", "sourcepathreadinessconsole.html"]', '    ["Path Readiness", "sourcepathreadinessconsole.html"],\n    ["Demo Runbook", "privatedemorunbook.html"],\n    ["Observations", "reviewerobservations.html"],\n    ["Rights Intake", "rightsclearedsourceintake.html"],\n    ["Security Review", "securityprivacyreview.html"],\n    ["Hosted Gate", "hostedbackenddecisiongate.html"]');
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  text = updateOnce(text, '  "sourcepathreadinessconsole.html"', '  "sourcepathreadinessconsole.html",\n  "privatedemorunbook.html",\n  "reviewerobservations.html",\n  "rightsclearedsourceintake.html",\n  "securityprivacyreview.html",\n  "hostedbackenddecisiongate.html"');
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v4\.8\.1 source path<\/span>/g, '<span class="version-pill">' + finalBadge + '</span>');
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)v4\.8\.1(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.8.6$2Hosted Backend Decision Gate selects a deployment-neutral read-only handler, proves source-contract parity, and keeps deployment plus every write path blocked.$3');
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.8.7 Read-only Hosted API Adapter$2Build one provider-specific preview only after credentials, cost, privacy, and deployment approval.$3');
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Release</span><strong>v4.8.6 Hosted Backend Decision Gate</strong></div>');
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Previous</span><strong>v4.8.5 Security &amp; Privacy Review</strong></div>');
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Make the private Ask path repeatable, reviewable, rights-aware, secure, and ready for one bounded hosting decision.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Read-only hosted shape selected; deployment and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Choose a hosting provider, region, budget, and custom-domain posture.</span></li>\n            <li><span class="dot"></span><span>Add rate limits, monitoring, incident response, and privacy-safe logs.</span></li>\n            <li><span class="dot"></span><span>Keep source registry writes and learner accounts outside the first hosted slice.</span></li>\n            <li><span class="dot"></span><span>Require credentials and explicit deployment approval before publishing an endpoint.</span></li>\n          </ul>');
  write("build-status.html", text);
}

function updateAskDemo() {
  let text = read("askdemo.html");
  if (!text.includes("reviewerobservations.html")) {
    text = text.replace(
      '<aside class="vp-ask-boundary">\n      <strong>Calm boundary</strong>',
      '<aside class="vp-ask-boundary">\n      <strong>Calm boundary</strong>'
    );
    text = text.replace(
      '      <span>This demo retrieves reviewed citation metadata and summaries. It does not generate scripture, therapy, ritual instruction, or spiritual commands.</span>\n    </aside>',
      '      <span>This demo retrieves reviewed citation metadata and summaries. It does not generate scripture, therapy, ritual instruction, or spiritual commands.</span>\n      <a class="vp-boundary-link" href="reviewerobservations.html">Open session-only reviewer notes</a>\n    </aside>'
    );
  }
  write("askdemo.html", text);
}

function updateDocs() {
  const entries = releases.slice().reverse();
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.8.6 Hosted Backend Decision Gate")) changelog = entries.map(changelogEntry).join("\n") + "\n" + changelog;
  write("CHANGELOG.md", changelog);
  let readme = read("README.md");
  if (!readme.includes("## v4.8.6 Hosted Backend Decision Gate")) readme = entries.map(readmeEntry).join("\n") + "\n" + readme;
  write("README.md", readme);
}

function hardenLocalApi() {
  let text = read("scripts/vedapath-local-source-api-server.mjs");
  text = text.replace('const serviceVersion = "v4.7.9";', 'const serviceVersion = "v4.8.5";');
  text = text.replace('  if (!origin || origin === "null") return true;', '  if (!origin) return true;\n  if (origin === "null") return false;');
  text = updateOnce(
    text,
    '    "cache-control": "no-store",\n    "x-content-type-options": "nosniff",',
    '    "cache-control": "no-store",\n    "content-security-policy": "default-src \'none\'; frame-ancestors \'none\'; base-uri \'none\'",\n    "cross-origin-resource-policy": "cross-origin",\n    "permissions-policy": "camera=(), microphone=(), geolocation=()",\n    "referrer-policy": "no-referrer",\n    "x-content-type-options": "nosniff",\n    "x-frame-options": "DENY",'
  );
  write("scripts/vedapath-local-source-api-server.mjs", text);
}

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docEntry(item));
  write(item.href, item.type === "reviewer" ? reviewerPage(item) : item.type === "intake" ? intakePage(item) : gatePage(item));
}

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateAskDemo();
updateDocs();
hardenLocalApi();

console.log("v4.8.2-v4.8.6 private demo hardening batch scaffold applied");
