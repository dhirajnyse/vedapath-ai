import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.9.1 controlled pilot";
const sharedRisk = "Controlled-pilot foundation only; no provider deployment, real authentication, durable queue, production monitoring, licensed corpus delivery, live AI generation, payments, public launch, or medical, legal, ritual, or spiritual authority.";

function file(name) { return path.join(root, name); }
function read(name) { return readFileSync(file(name), "utf8"); }
function write(name, value) { writeFileSync(file(name), value, "utf8"); }
function posture(title, decision, copy) { return { title, decision, copy }; }
function step(title, copy) { return { title, copy }; }
function decision(label, value, reason) { return { label, value, reason }; }
function metric(label, value) { return { label, value }; }

function locks() {
  return [
    posture("Deployment lock", "Closed", "No provider endpoint, domain, secret, or production runtime is activated."),
    posture("Write lock", "Closed", "No source, rights, reviewer, or learner write route exists."),
    posture("Identity lock", "Closed", "Role simulations do not authenticate a person or grant production access."),
    posture("Rights lock", "Closed", "Evidence-ready candidates remain blocked from publication and registry merge."),
    posture("Launch lock", "Closed", "Pilot readiness evidence cannot activate an invitation or public service.")
  ];
}

function baseData(position, headline, copy, postures, flow, decisions, metrics, packet, extras = {}) {
  return { position, headline, copy, postures, flow, decisions, metrics, locks: locks(), packet, ...extras };
}

const roles = [
  { id: "observer", label: "Observer", capabilities: ["view-source", "view-rights", "copy-preview"] },
  { id: "source-reviewer", label: "Source reviewer", capabilities: ["view-source", "view-rights", "copy-preview", "claim-source-work", "route-source", "hold-candidate", "mark-source-evidence-ready"] },
  { id: "rights-reviewer", label: "Rights reviewer", capabilities: ["view-source", "view-rights", "copy-preview", "claim-rights-work", "route-rights", "hold-candidate", "mark-rights-evidence-ready"] },
  { id: "release-reviewer", label: "Release reviewer", capabilities: ["view-source", "view-rights", "copy-preview", "view-pilot-evidence", "hold-candidate", "recommend-pilot-decision"] }
];

const releases = [
  {
    version: "v4.8.7", title: "Read-only Hosted API Adapter", label: "Hosted API", href: "hostedreadonlyapiadapter.html",
    dataFile: "data/vedapath-hosted-readonly-api-adapter.json", docFile: "docs/HOSTED_READONLY_API_ADAPTER.md", bodyClass: "hosted-readonly-api-adapter-page",
    eyebrow: "Provider-neutral request boundary", headline: "Turn the reviewed source handler into one strict Web API shape.",
    copy: "A standards-based Request-to-Response adapter now enforces approved origins, JSON shape, 16 KB payloads, security headers, typed errors, and read-only routes without choosing or deploying a provider.",
    changes: "Adds an executable Web Request/Response adapter over the reviewed source handler, strict origin and payload controls, CORS preflight behavior, typed errors, security headers, and explicit zero-write deployment posture.",
    files: ["hostedreadonlyapiadapter.html", "data/vedapath-hosted-readonly-api-adapter.json", "docs/HOSTED_READONLY_API_ADAPTER.md", "scripts/vedapath-hosted-source-adapter.mjs"],
    checks: "node --check scripts/vedapath-hosted-source-adapter.mjs; adapter health, source, search, POST, CORS, malformed JSON, oversized payload, origin, method, and route assertions; batch checker through v4.8.7.",
    data: baseData(
      "Hosted shape is executable, deployment is not",
      "One adapter can run at an edge or serverless boundary without changing the source contract.",
      "The adapter accepts standard Web Requests and returns standard Web Responses, which keeps the first hosted slice portable and testable.",
      [
        posture("Read routes", "4", "Health, sources, search, and source matching are the only routes."),
        posture("Write routes", "0", "No mutation, upload, account, review, or telemetry endpoint is present."),
        posture("Origins", "Allowlisted", "GitHub Pages and private local preview origins are accepted; null and unknown origins fail closed."),
        posture("Payload", "16 KB", "JSON requests are bounded before source matching."),
        posture("Runtime", "Portable", "The adapter uses Web Request and Response primitives, not provider APIs.")
      ],
      [step("Receive", "Validate origin, request ID, method, media type, and payload size."), step("Translate", "Map the Web Request into the existing read-only source handler."), step("Respond", "Return typed JSON and security headers with no-store caching."), step("Stop", "Leave deployment, secrets, domains, and writes unconfigured.")],
      [decision("Provider", "Unselected", "Portability is proven before infrastructure commitment."), decision("Storage", "None", "The adapter does not add persistence."), decision("Contract", "vedapath.source.v1", "Browser, local API, and hosted adapter keep one envelope."), decision("Launch", "Blocked", "An executable adapter is not a live service.")],
      [metric("Routes", "4"), metric("Writes", "0"), metric("Body limit", "16 KB"), metric("Next", "Request guard")],
      "Read-only Hosted API Adapter v4.8.7\nRuntime: Web Request -> Response.\nProvider: unselected.\nDeployment: not activated.\nWrites: none.",
      { schema: "vedapath.hosted-readonly-adapter.v1", release: "v4.8.7", contract: "vedapath.source.v1", routes: ["GET /health", "GET /sources", "GET /search", "GET|POST /source"], write_routes: [], provider: "unselected", deployment: "not-activated" }
    )
  },
  {
    version: "v4.8.8", title: "Rate Limit & Privacy-Safe Monitoring", label: "Request Guard", href: "ratelimitprivacymonitoring.html",
    dataFile: "data/vedapath-rate-limit-privacy-monitor.json", docFile: "docs/RATE_LIMIT_PRIVACY_MONITORING.md", bodyClass: "rate-limit-monitoring-contract-page",
    eyebrow: "Bounded private traffic", headline: "Protect a preview without turning learner questions into analytics.",
    copy: "A deterministic request guard now limits short bursts and records only time buckets, pseudonymous client buckets, route, status class, and outcome in instance memory.",
    changes: "Adds a testable fixed-window request guard, privacy-safe aggregate event envelope, 429 and Retry-After behavior, bounded in-memory retention, and explicit exclusions for raw questions, IPs, referrers, and user agents.",
    files: ["ratelimitprivacymonitoring.html", "data/vedapath-rate-limit-privacy-monitor.json", "docs/RATE_LIMIT_PRIVACY_MONITORING.md", "scripts/vedapath-private-request-guard.mjs", "scripts/vedapath-hosted-source-adapter.mjs"],
    checks: "node --check scripts/vedapath-private-request-guard.mjs; deterministic allowance and 429 tests; safe-event field scan; no raw token or question assertions; batch checker through v4.8.8.",
    data: baseData(
      "Abuse protection is visible and data-minimal",
      "The preview can slow repeated requests without retaining what a learner asked.",
      "This is instance-local prototype protection. Production needs a distributed limiter, alerting, retention policy, on-call ownership, and incident response.",
      [
        posture("Rate window", "Visible", "The default private-preview limit is explicit and testable."),
        posture("Raw questions", "Excluded", "Question text never enters monitoring events."),
        posture("Raw IP", "Excluded", "The guard accepts a private client token and stores only a short one-way bucket."),
        posture("Retention", "100 events", "Only bounded instance memory is retained."),
        posture("Production ops", "Missing", "Distributed state, alerting, and incident response remain unbuilt.")
      ],
      [step("Bucket", "Create a short pseudonymous client and time bucket."), step("Limit", "Allow a bounded number of requests in the current window."), step("Record", "Store route, outcome, and status class only."), step("Discard", "Lose all monitor state when the instance stops.")],
      [decision("Telemetry consent", "Not required", "The prototype does not create learner analytics."), decision("Operational event", "Minimal", "Only service health fields are represented."), decision("Durability", "None", "Events remain process-local."), decision("Public service", "Blocked", "A local limiter is not production abuse prevention.")],
      [metric("Raw questions", "0"), metric("Raw IPs", "0"), metric("Max events", "100"), metric("Next", "Reviewer roles")],
      "Rate Limit & Privacy-Safe Monitoring v4.8.8\nDefault: 12 requests per minute per pseudonymous bucket.\nStored: route, status class, outcome, time bucket.\nNot stored: question, IP, referrer, user agent.",
      { schema: "vedapath.request-guard.v1", release: "v4.8.8", limit: 12, window_seconds: 60, max_events: 100, persistence: "instance-memory-only", allowed_event_fields: ["time_bucket", "client_bucket", "method", "path", "status_group", "outcome"], prohibited_fields: ["question", "raw_ip", "user_agent", "referrer", "email", "name"] }
    )
  },
  {
    version: "v4.8.9", title: "Reviewer Identity & Role Prototype", label: "Reviewer Roles", href: "revieweridentityroles.html",
    dataFile: "data/vedapath-reviewer-identity-roles.json", docFile: "docs/REVIEWER_IDENTITY_ROLE_PROTOTYPE.md", bodyClass: "reviewer-identity-role-prototype-page", type: "role",
    eyebrow: "Permission before identity infrastructure", headline: "Define who may preview a decision before claiming anyone is authenticated.",
    copy: "A role simulator now separates observer, source, rights, and release-review capabilities while globally denying publish, deploy, registry merge, pilot activation, and public launch.",
    changes: "Adds a pure role-capability evaluator, four bounded reviewer roles, globally forbidden operations, an accessible in-browser simulator, and explicit identity-unverified and production-denied outputs.",
    files: ["revieweridentityroles.html", "data/vedapath-reviewer-identity-roles.json", "docs/REVIEWER_IDENTITY_ROLE_PROTOTYPE.md", "scripts/vedapath-reviewer-authorization.mjs", "assets/vedapath-reviewer-role-simulator.js", "assets/vedapath-demo-operations.css"],
    checks: "node --check scripts/vedapath-reviewer-authorization.mjs; node --check assets/vedapath-reviewer-role-simulator.js; role allow/deny matrix and global lock assertions; batch checker through v4.8.9; keyboard browser QA.",
    data: baseData(
      "Reviewer roles are explicit, identity is still unverified",
      "The product can discuss capabilities honestly before selecting an authentication provider.",
      "Every simulator result says identity_verified false and production_allowed false, even when a bounded preview action is available.",
      [posture("Observer", "Read only", "Can inspect source and rights evidence."), posture("Source reviewer", "Source preview", "Can route and mark source evidence ready."), posture("Rights reviewer", "Rights preview", "Can route and mark rights evidence ready."), posture("Release reviewer", "Evidence preview", "Can recommend a pilot decision."), posture("Production permission", "None", "No role can publish, deploy, or launch.")],
      [step("Choose", "Select a prototype role."), step("Request", "Choose one bounded or forbidden operation."), step("Evaluate", "See the exact preview decision and denial reason."), step("Defer", "Add real identity proof, sessions, revocation, and audit before production.")],
      [decision("Authentication", "Absent", "The role label is not a verified person."), decision("Preview policy", "Executable", "Capability rules are deterministic and tested."), decision("Production access", "Denied", "Every result keeps production_allowed false."), decision("Next", "Rights queue", "Use the policy only in a session-local operations preview.")],
      [metric("Roles", "4"), metric("Global locks", "6"), metric("Verified identities", "0"), metric("Next", "Rights queue")],
      "Reviewer Identity & Role Prototype v4.8.9\nAuthentication: absent.\nIdentity verified: false.\nProduction permissions: none.\nPurpose: preview a capability contract before choosing identity infrastructure.",
      { schema: "vedapath.reviewer-role-config.v1", release: "v4.8.9", roles, operations: [
        { id: "view-source", label: "View source evidence" }, { id: "route-source", label: "Route to source review" }, { id: "route-rights", label: "Route to rights review" }, { id: "mark-source-evidence-ready", label: "Mark source evidence ready" }, { id: "mark-rights-evidence-ready", label: "Mark rights evidence ready" }, { id: "recommend-pilot-decision", label: "Recommend a pilot decision" }, { id: "publish-source", label: "Publish a source" }, { id: "merge-registry", label: "Merge into registry" }, { id: "deploy-service", label: "Deploy a service" }, { id: "activate-pilot", label: "Activate a pilot" }, { id: "launch-public", label: "Launch publicly" }
      ], forbidden_operations: ["publish-source", "merge-registry", "deploy-service", "activate-pilot", "launch-public", "grant-production-access"], identity_verified: false, production_permissions: [] }
    )
  },
  {
    version: "v4.9.0", title: "Rights Operations Queue", label: "Rights Queue", href: "rightsoperationsqueue.html",
    dataFile: "data/vedapath-rights-operations-queue.json", docFile: "docs/RIGHTS_OPERATIONS_QUEUE.md", bodyClass: "rights-operations-queue-page", type: "queue",
    eyebrow: "Visible rights work", headline: "Route evidence through a queue without turning a preview into approval.",
    copy: "A session-only queue now lets bounded prototype roles claim, route, hold, and mark evidence ready while preserving immutable publication and registry locks.",
    changes: "Adds a pure queue transition contract, role-aware session workflow, status filters, visible audit events, explicit copy and reset controls, and invariants that keep publication blocked and registry merge manual.",
    files: ["rightsoperationsqueue.html", "data/vedapath-rights-operations-queue.json", "docs/RIGHTS_OPERATIONS_QUEUE.md", "scripts/vedapath-rights-operations-queue.mjs", "assets/vedapath-rights-operations-queue.js", "assets/vedapath-demo-operations.css"],
    checks: "node --check scripts/vedapath-rights-operations-queue.mjs; node --check assets/vedapath-rights-operations-queue.js; authorized and denied transition tests; invariant and immutability assertions; batch checker through v4.9.0; browser interaction QA.",
    data: baseData(
      "Rights work has a visible, reversible preview flow",
      "Candidates can move between review lanes without ever becoming published sources.",
      "The queue begins from metadata-only fixtures, records role-labelled session events, and disappears on refresh unless a reviewer explicitly copies a packet.",
      [posture("Queue state", "Session only", "Refresh returns to fixture state."), posture("Role checks", "Required", "Every transition evaluates a bounded capability."), posture("Audit", "Visible", "The page shows every session transition."), posture("Publication", "Blocked", "Evidence-ready is not approved or published."), posture("Registry merge", "Manual only", "No queue action edits the source registry.")],
      [step("Filter", "Choose a queue state and inspect evidence metadata."), step("Assume role", "Select a prototype source or rights reviewer."), step("Route", "Claim, route, hold, or mark evidence ready if allowed."), step("Export", "Copy the visible packet deliberately or reset the session.")],
      [decision("Persistence", "None", "The queue is a workflow prototype, not operations storage."), decision("Approval", "Unavailable", "No approve or publish transition exists."), decision("Identity", "Unverified", "Audit events record role, not a verified person."), decision("Production queue", "Deferred", "Needs database, auth, concurrency, retention, and audit guarantees.")],
      [metric("Candidates", "4"), metric("Actions", "7"), metric("Approve actions", "0"), metric("Next", "Pilot gate")],
      "Rights Operations Queue v4.9.0\nPersistence: page session only.\nIdentity: unverified role label.\nPublication: blocked.\nRegistry merge: manual only.",
      { schema: "vedapath.rights-operations-queue.v1", release: "v4.9.0", roles, actions: [
        { id: "claim-source", label: "Claim source", capability: "claim-source-work", status: "source-review" },
        { id: "claim-rights", label: "Claim rights", capability: "claim-rights-work", status: "rights-review" },
        { id: "route-source", label: "Route source", capability: "route-source", status: "source-review" },
        { id: "route-rights", label: "Route rights", capability: "route-rights", status: "rights-review" },
        { id: "hold", label: "Hold", capability: "hold-candidate", status: "hold" },
        { id: "source-evidence-ready", label: "Source evidence ready", capability: "mark-source-evidence-ready", status: "evidence-ready" },
        { id: "rights-evidence-ready", label: "Rights evidence ready", capability: "mark-rights-evidence-ready", status: "evidence-ready" }
      ], candidates: [
        { id: "candidate-isha-1", citation: "Isha Upanishad 1", family: "Upanishad | Shruti", rights_state: "citation-only", source_state: "review", status: "new", review_lane: "Upanishad reviewer", publication_state: "blocked", registry_merge: "manual-only" },
        { id: "candidate-rigveda-36210", citation: "Rigveda 3.62.10", family: "Veda | Shruti", rights_state: "needs-review", source_state: "hold", status: "rights-review", review_lane: "Rights reviewer", publication_state: "blocked", registry_merge: "manual-only" },
        { id: "candidate-katha-123", citation: "Katha Upanishad 1.2.3", family: "Upanishad | Shruti", rights_state: "citation-only", source_state: "draft", status: "source-review", review_lane: "Source reviewer", publication_state: "blocked", registry_merge: "manual-only" },
        { id: "candidate-gita-648", citation: "Bhagavad Gita 6.48", family: "Bhagavad Gita | Smriti", rights_state: "blocked", source_state: "draft", status: "hold", review_lane: "Rights reviewer", publication_state: "blocked", registry_merge: "manual-only" }
      ], persistence: "none", approval: "unavailable", publication: "blocked" }
    )
  },
  {
    version: "v4.9.1", title: "Controlled External Pilot Gate", label: "Pilot Gate", href: "controlledexternalpilotgate.html",
    dataFile: "data/vedapath-controlled-external-pilot-gate.json", docFile: "docs/CONTROLLED_EXTERNAL_PILOT_GATE.md", bodyClass: "controlled-external-pilot-gate-page",
    eyebrow: "Evidence before activation", headline: "Declare the pilot foundation ready without pretending the pilot is live.",
    copy: "The final gate assembles hosted adapter, request protection, reviewer roles, rights operations, source quality, and privacy evidence into one conditional decision: implementation-ready, not activated.",
    changes: "Adds a controlled external-pilot evidence gate, dependency and lock matrix, launch decision language, shared navigation cleanup, build status update, and one batch regression that proves every new contract while keeping deployment and public launch closed.",
    files: ["controlledexternalpilotgate.html", "data/vedapath-controlled-external-pilot-gate.json", "docs/CONTROLLED_EXTERNAL_PILOT_GATE.md", "scripts/check-v487-v491-hosted-pilot-foundation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "batch checker through v4.9.1; all prior backend/source-path/private-demo regression suites; static-link check; local HTTP smoke; desktop and mobile visual QA; role and queue interaction QA; GitHub Pages live verification.",
    data: baseData(
      "Controlled pilot foundation is implementation-ready, not activated",
      "The smallest external learning loop now has an honest technical and operational boundary.",
      "A provider endpoint, identity service, durable rights queue, production monitoring, incident response, licensed source operations, and explicit founder activation are still required before anyone is invited.",
      [posture("Hosted adapter", "Ready", "The read-only Web contract is executable and provider-neutral."), posture("Request guard", "Preview ready", "Rate and privacy behavior is deterministic but not distributed."), posture("Reviewer roles", "Preview ready", "Capabilities are explicit while authentication remains absent."), posture("Rights queue", "Preview ready", "Transitions are visible while durable operations remain absent."), posture("Pilot activation", "Closed", "No endpoint, invite, or external session is active.")],
      [step("Review", "Inspect the five release evidence packets and automated checks."), step("Choose", "Select provider, region, budget, identity, storage, and operations owners."), step("Implement", "Build the smallest production-grade read-only slice behind private access."), step("Activate", "Require a separate founder decision after security and rights sign-off.")],
      [decision("Foundation", "Ready", "The contract and operating boundaries are coherent."), decision("Deployment", "Not activated", "No credentials or provider resources were used."), decision("External pilot", "Not active", "No participant can access a hosted endpoint."), decision("Public launch", "Blocked", "A controlled pilot remains several gates before public release.")],
      [metric("Evidence areas", "5"), metric("Open write routes", "0"), metric("Activated pilots", "0"), metric("Next", "Provider preview")],
      "Controlled External Pilot Gate v4.9.1\nDecision: implementation-ready-not-activated.\nDeployment: none.\nExternal participants: none.\nNext: choose and privately preview one provider-backed read-only deployment after explicit approval.",
      { schema: "vedapath.controlled-external-pilot-gate.v1", release: "v4.9.1", decision: "implementation-ready-not-activated", evidence: ["hosted-readonly-adapter", "privacy-safe-request-guard", "reviewer-role-policy", "rights-operations-preview", "source-path-regressions"], activated: false, external_participants: 0, provider: "unselected", deployment: "none", write_routes: [], public_launch: "blocked", next_release: "v4.9.2 Provider Deployment Preview" }
    )
  }
];

function navHtml(active) {
  const links = [
    ["Home", "index.html"], ["Build", "build-status.html"], ["Brand", "brand/brand-board.html"], ["Blueprint", "blueprint.html"], ["Answers", "citedanswerlab.html"], ["Review", "reviewqueuepersistence.html"], ["Mantra", "mantralenslab.html"], ["Life", "lifecompanionlab.html"], ["Talk", "conversationcompanionlab.html"], ["Pattern", "patterncompanionlab.html"], ["Daily", "daily.html"],
    ["Ask Demo", "askdemo.html"], ["Path Readiness", "sourcepathreadinessconsole.html"], ["Demo Runbook", "privatedemorunbook.html"], ["Observations", "reviewerobservations.html"], ["Rights Intake", "rightsclearedsourceintake.html"], ["Security Review", "securityprivacyreview.html"], ["Hosted Gate", "hostedbackenddecisiongate.html"],
    ["Hosted API", "hostedreadonlyapiadapter.html"], ["Request Guard", "ratelimitprivacymonitoring.html"], ["Reviewer Roles", "revieweridentityroles.html"], ["Rights Queue", "rightsoperationsqueue.html"], ["Pilot Gate", "controlledexternalpilotgate.html"]
  ];
  return links.map(function ([label, href]) { return '        <a class="link' + (label === active ? ' active' : '') + '" href="' + href + '">' + label + '</a>'; }).join("\n");
}

function header(item, subtitle) {
  return ['    <header class="topbar">', '      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">', '        <img src="assets/vedapath-3d-logo-concept.png" alt="" />', '        <span><strong>VedaPath AI</strong><small>' + subtitle + '</small></span>', '      </a>', '      <nav class="navlinks nav" aria-label="Primary navigation">', navHtml(item.label), '        <span class="version-pill">' + finalBadge + '</span>', '      </nav>', '    </header>'].join("\n");
}

function head(item, css) {
  return ["<!doctype html>", '<html lang="en">', "<head>", '  <meta charset="utf-8" />', '  <meta name="viewport" content="width=device-width, initial-scale=1" />', "  <title>" + item.title + " | VedaPath AI</title>", '  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />', '  <link rel="stylesheet" href="assets/vedapath-ui.css" />', '  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />', '  <link rel="stylesheet" href="assets/' + css + '" />', "</head>"].join("\n");
}

function gatePage(item) {
  return [head(item, "vedapath-retrieval-pilot.css"), '<body class="' + item.bodyClass + ' retrieval-pilot-surface">', '  <main class="workspace" id="top">', header(item, item.title.toLowerCase()), '    <section class="rp-opening">', '      <div><span class="rp-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>', '      <aside class="rp-opening-card"><img src="assets/vedapath-3d-logo-concept.png" alt="" /><strong>' + item.title + '</strong><span>Source first. Calm path.</span></aside>', '    </section>', '    <section data-retrieval-app data-kind="gate" data-data-file="' + item.dataFile + '"></section>', '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-retrieval-pilot.js"></script>', "</body>", "</html>", ""].join("\n");
}

function rolePage(item) {
  return [head(item, "vedapath-demo-operations.css"), '<body class="' + item.bodyClass + '">', '  <main class="workspace vp-ops-workspace" id="top" data-config="' + item.dataFile + '">', header(item, "reviewer role prototype"), '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>', '      <aside><strong>Identity boundary</strong><span>This page does not sign anyone in. Every result keeps identity verified and production allowed set to false.</span></aside>', '    </section>', '    <section class="vp-ops-columns">', '      <form class="vp-ops-form" id="vpRoleForm"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Capability check</span><h2>Test one role decision</h2></div><span>Policy preview</span></div><label for="vpReviewerRole">Prototype role</label><select id="vpReviewerRole" required></select><label for="vpReviewerOperation">Requested operation</label><select id="vpReviewerOperation" required></select><button class="vp-ops-primary" type="submit">Evaluate capability</button><pre id="vpRoleResult" class="vp-ops-packet" hidden></pre><p class="vp-ops-status" id="vpRoleStatus" aria-live="polite">Loading the role contract.</p></form>', '      <section class="vp-ops-output"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Visible scope</span><h2>Role capabilities</h2></div><span>Preview only</span></div><ul class="vp-role-capabilities" id="vpRoleCapabilities"></ul><div class="vp-ops-empty"><strong>Global lock</strong><p>No prototype role can publish a source, merge the registry, deploy a service, activate a pilot, or launch publicly.</p></div></section>', '    </section>', '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-reviewer-role-simulator.js"></script>', "</body>", "</html>", ""].join("\n");
}

function queuePage(item) {
  return [head(item, "vedapath-demo-operations.css"), '<body class="' + item.bodyClass + '">', '  <main class="workspace vp-ops-workspace" id="top" data-config="' + item.dataFile + '">', header(item, "rights operations queue"), '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>', '      <aside><strong>Queue boundary</strong><span>Session memory only. Evidence-ready is not approved. Publication remains blocked and registry merge remains manual.</span></aside>', '    </section>', '    <section class="vp-ops-columns">', '      <section class="vp-ops-form"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Rights candidates</span><h2>Queue <span id="vpQueueCount">0</span></h2></div><span>Session only</span></div><div class="vp-ops-field-grid"><label>Prototype role<select id="vpQueueRole"></select></label><label>Status filter<select id="vpQueueFilter"><option value="all">All states</option><option value="new">New</option><option value="source-review">Source review</option><option value="rights-review">Rights review</option><option value="hold">Hold</option><option value="evidence-ready">Evidence ready</option></select></label></div><div class="vp-queue-list" id="vpRightsQueueList"></div></section>', '      <section class="vp-ops-output"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Visible audit</span><h2>Session decisions</h2></div><span>Identity unverified</span></div><div id="vpRightsQueueAudit" class="vp-ops-empty"><p>No queue decisions in this session.</p></div><div class="vp-ops-actions"><button class="vp-ops-secondary" type="button" id="vpCopyQueuePacket">Copy queue packet</button><button class="vp-ops-quiet" type="button" id="vpResetQueue">Reset session</button></div><p class="vp-ops-status" id="vpQueueStatus" aria-live="polite">Loading queue contract.</p></section>', '    </section>', '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-rights-operations-queue.js"></script>', "</body>", "</html>", ""].join("\n");
}

function docEntry(item) { return ["# " + item.version + " " + item.title, "", "## Purpose", "", item.copy, "", "## What Changed", "", item.changes, "", "## Acceptance Checks", "", item.checks, "", "## Known Risks", "", sharedRisk, "", "## Founder Packet", "", item.data.packet, ""].join("\n"); }
function changelogEntry(item) { return ["## " + item.version + " " + item.title, "", "- Changes made: " + item.changes, "- Files changed: " + item.files.map(function (name) { return "`" + name + "`"; }).join(", ") + ".", "- Checks run: " + item.checks, "- Known risks: " + sharedRisk, ""].join("\n"); }
function readmeEntry(item) { return ["## " + item.version + " " + item.title, "", item.copy, "", "- Open: [" + item.title + "](" + item.href + ")", "- Data: `" + item.dataFile + "`", "- Boundary: " + sharedRisk, ""].join("\n"); }

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, 'const releaseBadge = "' + finalBadge + '";');
  text = text.replace(/^    \{ title: "Private Demo", labels: \[[^\n]+\n/gm, "");
  text = text.replace(/^    \{ title: "Hosted Pilot", labels: \[[^\n]+\n/gm, "");
  text = text.replace('    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] },', '    { title: "Source Path", labels: ["Spike Review", "API Reliability", "Source Registry", "Path Readiness"] },\n    { title: "Private Demo", labels: ["Demo Runbook", "Observations", "Rights Intake", "Security Review", "Hosted Gate"] },\n    { title: "Hosted Pilot", labels: ["Hosted API", "Request Guard", "Reviewer Roles", "Rights Queue", "Pilot Gate"] },');
  if (!text.includes('"Hosted API": "Read-only Hosted API Adapter"')) {
    text = text.replace('    "Hosted Gate": "Hosted Backend Decision Gate"', '    "Hosted Gate": "Hosted Backend Decision Gate",\n    "Hosted API": "Read-only Hosted API Adapter",\n    "Request Guard": "Rate Limit & Privacy-Safe Monitoring",\n    "Reviewer Roles": "Reviewer Identity & Role Prototype",\n    "Rights Queue": "Rights Operations Queue",\n    "Pilot Gate": "Controlled External Pilot Gate"');
  }
  if (!text.includes('"hosted-readonly-api-adapter-page": "Read-only Hosted API Adapter"')) {
    text = text.replace('    "hosted-backend-decision-gate-page": "Hosted Backend Decision Gate"', '    "hosted-backend-decision-gate-page": "Hosted Backend Decision Gate",\n    "hosted-readonly-api-adapter-page": "Read-only Hosted API Adapter",\n    "rate-limit-monitoring-contract-page": "Rate Limit & Privacy-Safe Monitoring",\n    "reviewer-identity-role-prototype-page": "Reviewer Identity & Role Prototype",\n    "rights-operations-queue-page": "Rights Operations Queue",\n    "controlled-external-pilot-gate-page": "Controlled External Pilot Gate"');
  }
  if (!text.includes('["Hosted API", "hostedreadonlyapiadapter.html"]')) {
    text = text.replace('    ["Hosted Gate", "hostedbackenddecisiongate.html"]', '    ["Hosted Gate", "hostedbackenddecisiongate.html"],\n    ["Hosted API", "hostedreadonlyapiadapter.html"],\n    ["Request Guard", "ratelimitprivacymonitoring.html"],\n    ["Reviewer Roles", "revieweridentityroles.html"],\n    ["Rights Queue", "rightsoperationsqueue.html"],\n    ["Pilot Gate", "controlledexternalpilotgate.html"]');
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes('"hostedreadonlyapiadapter.html"')) {
    text = text.replace('  "hostedbackenddecisiongate.html"', '  "hostedbackenddecisiongate.html",\n  "hostedreadonlyapiadapter.html",\n  "ratelimitprivacymonitoring.html",\n  "revieweridentityroles.html",\n  "rightsoperationsqueue.html",\n  "controlledexternalpilotgate.html"');
  }
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/v4\.8\.6 hosted gate/g, finalBadge);
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)v4\.8\.6(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.9.1$2Controlled External Pilot Gate assembles hosted adapter, request guard, reviewer role, rights queue, source-path, and privacy evidence while keeping deployment and every launch path inactive.$3');
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.9.2 Provider Deployment Preview$2Choose one provider, region, budget, identity boundary, and private endpoint only after explicit credentials and deployment approval.$3');
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Release</span><strong>v4.9.1 Controlled External Pilot Gate</strong></div>');
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Previous</span><strong>v4.9.0 Rights Operations Queue</strong></div>');
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Make the smallest external-pilot foundation executable, privacy-aware, role-bounded, rights-visible, and honest about every missing production system.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Implementation-ready, not activated; provider deployment and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Select one provider, region, budget, private domain, and secret-management posture.</span></li>\n            <li><span class="dot"></span><span>Replace instance-local limiting with production abuse protection and monitoring ownership.</span></li>\n            <li><span class="dot"></span><span>Add authenticated reviewer identity, revocation, durable rights operations, and immutable audit.</span></li>\n            <li><span class="dot"></span><span>Require explicit founder approval before any endpoint or external invitation is activated.</span></li>\n          </ul>');
  write("build-status.html", text);
}

function updateLegacyChecker() {
  let text = read("scripts/check-v482-v486-private-demo-hardening.mjs");
  text = text.replace('assert(shell.includes(\'const releaseBadge = "v4.8.6 hosted gate";\'), "final release badge");', 'assert(/const releaseBadge = "(?:v4\\.8\\.6 hosted gate|v4\\.9\\.1 controlled pilot)";/.test(shell), "compatible release badge");');
  text = text.replace('assert(text("build-status.html").includes("<strong>v4.8.6</strong>"), "build status final version");', 'assert(/<strong>v4\\.(?:8\\.6|9\\.1)<\\/strong>/.test(text("build-status.html")), "build status current version");');
  write("scripts/check-v482-v486-private-demo-hardening.mjs", text);
  text = read("scripts/check-v477-v481-integrated-source-path.mjs");
  text = text.replace('assert(shell.includes(\'const releaseBadge = "v4.8.6 hosted gate";\'), "command shell current badge");', 'assert(/const releaseBadge = "(?:v4\\.8\\.6 hosted gate|v4\\.9\\.1 controlled pilot)";/.test(shell), "command shell compatible badge");');
  text = text.replace('assert(text("build-status.html").includes("<strong>v4.8.6</strong>"), "build status current version");', 'assert(/<strong>v4\\.(?:8\\.6|9\\.1)<\\/strong>/.test(text("build-status.html")), "build status compatible current version");');
  write("scripts/check-v477-v481-integrated-source-path.mjs", text);
}

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docEntry(item));
  write(item.href, item.type === "role" ? rolePage(item) : item.type === "queue" ? queuePage(item) : gatePage(item));
}

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateLegacyChecker();

for (const name of readdirSync(root).filter(function (name) { return name.endsWith(".html"); })) {
  const value = read(name).replace(/v4\.8\.6 hosted gate/g, finalBadge);
  write(name, value);
}

let changelog = read("CHANGELOG.md");
if (!changelog.includes("## v4.9.1 Controlled External Pilot Gate")) changelog = releases.slice().reverse().map(changelogEntry).join("\n") + "\n" + changelog;
write("CHANGELOG.md", changelog);
let readme = read("README.md");
if (!readme.includes("## v4.9.1 Controlled External Pilot Gate")) readme = releases.slice().reverse().map(readmeEntry).join("\n") + "\n" + readme;
write("README.md", readme);

console.log("v4.8.7-v4.9.1 hosted pilot foundation batch generated");
