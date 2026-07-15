import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.9.6 pilot implementation gate";
const sharedRisk = "Pilot implementation reference only; no provider deployment, real identity provider, production secrets, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.";

function file(name) { return path.join(root, name); }
function read(name) { return readFileSync(file(name), "utf8"); }
function write(name, value) { writeFileSync(file(name), value, "utf8"); }
function posture(title, decision, copy) { return { title, decision, copy }; }
function step(title, copy) { return { title, copy }; }
function decision(label, value, reason) { return { label, value, reason }; }
function metric(label, value) { return { label, value }; }

function locks() {
  return [
    posture("Deployment lock", "Closed", "No provider endpoint, domain, runtime, or credential has been activated."),
    posture("Identity lock", "Closed", "Signed test sessions do not authenticate a real reviewer."),
    posture("Storage lock", "Closed", "The queue repository is a reference implementation, not a connected durable store."),
    posture("Rights lock", "Closed", "Evidence-ready candidates remain blocked from publication and registry merge."),
    posture("Launch lock", "Closed", "Readiness evidence cannot activate invitations or a public service.")
  ];
}

function gateData(config) {
  return {
    release: config.version,
    position: config.position,
    headline: config.headline,
    copy: config.copy,
    postures: config.postures,
    flow: config.flow,
    decisions: config.decisions,
    metrics: config.metrics,
    locks: locks(),
    packet: config.packet,
    primary_action: config.primaryAction,
    ...config.extras
  };
}

const releases = [
  {
    version: "v4.9.2",
    title: "Provider & Region Decision Packet",
    label: "Provider Packet",
    href: "providerregiondecision.html",
    dataFile: "data/vedapath-provider-region-decision.json",
    docFile: "docs/PROVIDER_REGION_DECISION_PACKET.md",
    bodyClass: "provider-region-decision-page",
    eyebrow: "Provider-neutral deployment choice",
    headline: "Choose the hosting shape before choosing a vendor.",
    copy: "A scored provider and region packet now makes runtime compatibility, private access, data location, redacted logging, spend limits, ownership, and zero-write posture visible without activating infrastructure.",
    changes: "Adds an executable provider-readiness evaluator, eight acceptance criteria, region and logging posture, budget and owner gates, a founder decision packet, and an explicit zero-deployment result.",
    files: ["providerregiondecision.html", "data/vedapath-provider-region-decision.json", "docs/PROVIDER_REGION_DECISION_PACKET.md", "scripts/vedapath-provider-region-decision.mjs"],
    checks: "node --check scripts/vedapath-provider-region-decision.mjs; complete and incomplete provider candidate assertions; label sanitization; deployment and write-lock assertions; batch checker through v4.9.2.",
    data: gateData({
      version: "v4.9.2",
      position: "Decide the operational shape, not a marketing preference",
      headline: "A provider candidate must pass every safety and operating criterion before credentials exist.",
      copy: "The smallest first slice is a standards-based, read-only Web runtime in one documented region with private access, redacted logging, a spend cap, and one shutdown owner.",
      postures: [
        posture("Runtime", "Review", "Confirm compatibility with the existing Web Request/Response adapter."),
        posture("Region", "Review", "Document request, log, and temporary runtime data location."),
        posture("Operations", "Review", "Name the incident owner, shutdown route, and budget ceiling."),
        posture("Deployment", "Blocked", "No endpoint can be activated by this packet.")
      ],
      flow: [
        step("Shape", "Require a portable read-only Web runtime."),
        step("Locate", "Document one region and its data boundary."),
        step("Guard", "Require private access, redaction, and spend controls."),
        step("Decide", "Send a complete candidate to founder review only.")
      ],
      decisions: [
        decision("Runtime", "Edge or serverless Web", "Matches the adapter without a provider-specific rewrite."),
        decision("Write routes", "0", "The first provider slice remains read-only."),
        decision("Provider", "Unselected", "No vendor is approved by this release."),
        decision("Deployment", "Not activated", "Credentials and endpoints remain absent.")
      ],
      metrics: [metric("Criteria", "8"), metric("Required", "8/8"), metric("Credentials", "0"), metric("Deployments", "0")],
      packet: "VedaPath Provider & Region Decision Packet\nRuntime: standards-based Web Request/Response\nAccess: private preview required\nRegion: documented before implementation\nLogging: questions, tokens, IPs, referrers, and user agents excluded\nBudget: explicit cap and owner alert required\nWrite routes: 0\nDeployment: not activated\nDecision: complete the scorecard, then request founder review.",
      primaryAction: { href: "environmentsecretcontract.html", label: "Open Environment Contract" },
      extras: {
        schema: "vedapath.provider-region-decision.v1",
        decision: "criteria-defined-provider-unselected",
        criteria: ["request_response_compatible", "private_access_available", "region_controls_documented", "secret_management_available", "logging_redaction_confirmed", "spend_cap_set", "owner_named", "zero_write_routes"],
        provider_selected: false,
        region_selected: false,
        credentials_attached: false,
        deployment_activated: false,
        write_routes: [],
        public_launch: "blocked"
      }
    })
  },
  {
    version: "v4.9.3",
    title: "Environment & Secret Contract",
    label: "Environment",
    href: "environmentsecretcontract.html",
    dataFile: "data/vedapath-environment-secret-contract.json",
    docFile: "docs/ENVIRONMENT_SECRET_CONTRACT.md",
    bodyClass: "environment-secret-contract-page",
    eyebrow: "Configuration without secret values",
    headline: "Name every environment boundary. Store no secret in the product packet.",
    copy: "A strict local, preview, and pilot configuration contract now validates HTTPS origins, secret references, privacy-safe telemetry, zero write routes, and inactive deployment while refusing unknown or value-bearing keys.",
    changes: "Adds a pure environment validator, allowlisted configuration keys, reference-only secret handling, required pilot references, safe summaries, origin checks, and explicit deployment and write-route locks.",
    files: ["environmentsecretcontract.html", "data/vedapath-environment-secret-contract.json", "docs/ENVIRONMENT_SECRET_CONTRACT.md", "scripts/vedapath-environment-secret-contract.mjs"],
    checks: "node --check scripts/vedapath-environment-secret-contract.mjs; valid pilot config; missing reference, literal secret, unknown key, HTTP origin, telemetry, write-route, and activation rejection assertions; no-secret serialization scan; batch checker through v4.9.3.",
    data: gateData({
      version: "v4.9.3",
      position: "Configuration can be inspectable without exposing credentials",
      headline: "The deployment contract carries names and boundaries, never secret values.",
      copy: "Local, preview, and pilot environments now share one validated shape. Pilot configuration requires references for session signing and reviewer storage but cannot contain their values.",
      postures: [
        posture("Local", "Allowed", "Loopback origins may run local checks without provider credentials."),
        posture("Preview", "Review", "HTTPS origins and reference-only secrets are required."),
        posture("Pilot", "Blocked", "A valid packet still cannot activate an endpoint."),
        posture("Production", "Unavailable", "Production is outside this contract.")
      ],
      flow: [
        step("Name", "Choose local, preview, or pilot."),
        step("Reference", "Use managed environment-variable names only."),
        step("Validate", "Reject unknown keys, values, writes, and unsafe origins."),
        step("Redact", "Return a safe summary with zero secret values.")
      ],
      decisions: [
        decision("Secret values", "Rejected", "The validator accepts references only."),
        decision("Pilot references", "2 required", "Session signing and reviewer store keys must be named."),
        decision("Telemetry", "Aggregate only", "Raw questions and identity data remain excluded."),
        decision("Deployment", "Not activated", "Validation does not grant execution.")
      ],
      metrics: [metric("Environments", "3"), metric("Allowed keys", "7"), metric("Secret values", "0"), metric("Write routes", "0")],
      packet: "VedaPath Environment & Secret Contract\nEnvironments: local, preview, pilot\nOrigins: HTTPS; local loopback exception only\nSecrets: managed references only\nRequired pilot refs: VEDAPATH_SESSION_SIGNING_SECRET, VEDAPATH_REVIEWER_STORE_KEY\nTelemetry: privacy-safe aggregate only\nWrite routes: 0\nDeployment: not activated\nPublic launch: blocked.",
      primaryAction: { href: "reviewersessionspike.html", label: "Open Session Spike" },
      extras: {
        schema: "vedapath.environment-secret-contract.v1",
        environments: ["local", "preview", "pilot"],
        allowed_keys: ["environment", "public_origin", "api_origin", "secret_refs", "telemetry", "write_routes", "deployment"],
        required_pilot_secret_refs: ["VEDAPATH_SESSION_SIGNING_SECRET", "VEDAPATH_REVIEWER_STORE_KEY"],
        accepts_secret_values: false,
        serializes_secret_values: false,
        deployment: "not-activated",
        write_routes: [],
        public_launch: "blocked"
      }
    })
  },
  {
    version: "v4.9.4",
    title: "Reviewer Session Security Spike",
    label: "Reviewer Session",
    href: "reviewersessionspike.html",
    dataFile: "data/vedapath-reviewer-session-spike.json",
    docFile: "docs/REVIEWER_SESSION_SECURITY_SPIKE.md",
    bodyClass: "reviewer-session-security-spike-page",
    eyebrow: "Expiring role-bound test sessions",
    headline: "Prove expiry, revocation, signature, and role checks before choosing an identity provider.",
    copy: "A server-side HMAC test envelope now binds pseudonymous reviewer subjects to short-lived roles, rejects tampering, expiry, and revocation, and still reports identity-provider verified and production allowed as false.",
    changes: "Adds signed expiring reviewer sessions, pseudonymous subjects, one-hour maximum lifetime, signature verification, clock checks, caller-supplied revocation, role-bound authorization, and an accessible browser-state preview.",
    files: ["reviewersessionspike.html", "data/vedapath-reviewer-session-spike.json", "docs/REVIEWER_SESSION_SECURITY_SPIKE.md", "scripts/vedapath-reviewer-session-spike.mjs", "assets/vedapath-reviewer-session-simulator.js", "assets/vedapath-demo-operations.css"],
    checks: "node --check scripts/vedapath-reviewer-session-spike.mjs; node --check assets/vedapath-reviewer-session-simulator.js; valid, expired, revoked, tampered, role-allowed, role-denied, lifetime, and production-lock assertions; batch checker through v4.9.4; browser interaction QA.",
    data: {
      release: "v4.9.4",
      schema: "vedapath.reviewer-session-spike.v1",
      identity_provider: "not-connected",
      signing: "server-side-HMAC-test-only",
      maximum_lifetime_seconds: 3600,
      production_allowed: false,
      public_launch: "blocked",
      session_preview: {
        roles: [
          { id: "observer", label: "Observer", capabilities: ["view-source", "view-rights", "copy-preview"] },
          { id: "source-reviewer", label: "Source reviewer", capabilities: ["view-source", "claim-source-work", "route-source", "hold-candidate", "mark-source-evidence-ready"] },
          { id: "rights-reviewer", label: "Rights reviewer", capabilities: ["view-rights", "claim-rights-work", "route-rights", "hold-candidate", "mark-rights-evidence-ready"] },
          { id: "release-reviewer", label: "Release reviewer", capabilities: ["view-pilot-evidence", "hold-candidate", "recommend-pilot-decision"] }
        ],
        operations: [
          { id: "view-source", label: "View source" },
          { id: "claim-source-work", label: "Claim source work" },
          { id: "claim-rights-work", label: "Claim rights work" },
          { id: "mark-rights-evidence-ready", label: "Mark rights evidence ready" },
          { id: "recommend-pilot-decision", label: "Recommend pilot decision" },
          { id: "publish-source", label: "Publish source (always locked)" }
        ],
        states: [
          { id: "valid", label: "Valid test session", reason: "The session is inside its test lifetime." },
          { id: "expired", label: "Expired session", reason: "Expired sessions cannot carry a preview capability." },
          { id: "revoked", label: "Revoked session", reason: "Revoked sessions cannot carry a preview capability." }
        ]
      },
      packet: "Reviewer Session Security Spike\nSigned envelope: HMAC test only\nSubject: pseudonymous reviewer-* id\nLifetime: 60 to 3600 seconds\nRevocation: checked before authorization\nRole: evaluated against bounded capability policy\nIdentity provider verified: false\nProduction allowed: false\nNext: replace the spike with a real identity provider only after security review."
    },
    type: "session"
  },
  {
    version: "v4.9.5",
    title: "Rights Queue Persistence Contract",
    label: "Queue Contract",
    href: "rightsqueuepersistencecontract.html",
    dataFile: "data/vedapath-rights-queue-persistence-contract.json",
    docFile: "docs/RIGHTS_QUEUE_PERSISTENCE_CONTRACT.md",
    bodyClass: "rights-queue-persistence-contract-page",
    eyebrow: "Provider-neutral durable semantics",
    headline: "Define concurrency and audit behavior before connecting a database.",
    copy: "A reference repository now proves optimistic concurrency, idempotent event replay, role-aware transitions, append-only audit history, and immutable publication locks without pretending page memory is durable storage.",
    changes: "Adds a provider-neutral queue repository, expected-version conflicts, idempotency keys, append-only audit events, immutable publication and registry locks, a functional browser simulator, and explicit no-database posture.",
    files: ["rightsqueuepersistencecontract.html", "data/vedapath-rights-queue-persistence-contract.json", "docs/RIGHTS_QUEUE_PERSISTENCE_CONTRACT.md", "scripts/vedapath-rights-queue-repository.mjs", "assets/vedapath-queue-persistence-simulator.js", "assets/vedapath-demo-operations.css"],
    checks: "node --check scripts/vedapath-rights-queue-repository.mjs; node --check assets/vedapath-queue-persistence-simulator.js; successful transition, idempotent replay, stale conflict, denied role, immutable input, audit, publication, and registry-lock assertions; batch checker through v4.9.5; browser interaction QA.",
    data: {
      release: "v4.9.5",
      schema: "vedapath.rights-queue-persistence-contract.v1",
      implementation: "provider-neutral-in-memory-reference",
      durable_provider: "not-connected",
      identity_provider: "not-connected",
      optimistic_concurrency: true,
      idempotent_events: true,
      publication: "blocked",
      registry_merge: "manual-only",
      public_launch: "blocked",
      persistence_preview: {
        seed_record: {
          id: "candidate-isha-01",
          citation: "Isha Upanishad 1",
          family: "Upanishad | Shruti",
          status: "new",
          rights_state: "citation-only",
          source_state: "draft",
          review_lane: "Source reviewer",
          version: 1,
          publication_state: "blocked",
          registry_merge: "manual-only"
        }
      },
      packet: "Rights Queue Persistence Contract\nConcurrency: expected record version\nRetry safety: idempotent event id\nAudit: append one event per accepted transition\nAuthorization: bounded reviewer role\nPublication: blocked\nRegistry merge: manual only\nDurable provider: not connected\nIdentity provider: not connected."
    },
    type: "queue"
  },
  {
    version: "v4.9.6",
    title: "Invitation-Only Pilot Activation Gate",
    label: "Activation Gate",
    href: "invitationonlypilotgate.html",
    dataFile: "data/vedapath-invitation-only-pilot-gate.json",
    docFile: "docs/INVITATION_ONLY_PILOT_ACTIVATION_GATE.md",
    bodyClass: "invitation-only-pilot-activation-gate-page",
    eyebrow: "Evidence complete, activation closed",
    headline: "The implementation packet is coherent. The pilot is still not active.",
    copy: "One final gate now assembles provider criteria, safe configuration, reviewer sessions, queue persistence semantics, source controls, and launch locks into an honest invitation-only decision without creating credentials, participants, or public access.",
    changes: "Adds the pilot implementation evidence gate, dependency matrix, explicit activation prerequisites, shared navigation group, final build status, and one regression suite proving all five releases while every launch path remains closed.",
    files: ["invitationonlypilotgate.html", "data/vedapath-invitation-only-pilot-gate.json", "docs/INVITATION_ONLY_PILOT_ACTIVATION_GATE.md", "scripts/check-v492-v496-pilot-implementation-foundation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "batch checker through v4.9.6; all prior backend, source-path, private-demo, and hosted-pilot regressions; static links; local HTTP smoke; desktop and mobile visual QA; session and queue interaction QA; GitHub Pages verification.",
    data: gateData({
      version: "v4.9.6",
      position: "Ready to authorize infrastructure work, not ready to invite users",
      headline: "Five implementation contracts now agree on the same locked pilot boundary.",
      copy: "The provider packet, environment validator, test session envelope, and queue repository define the smallest implementation path. Real provider credentials, identity, durable storage, security review, rights approval, and founder authorization are still required.",
      postures: [
        posture("Provider contract", "Ready", "Criteria and region questions are explicit; provider remains unselected."),
        posture("Environment contract", "Ready", "Only safe references and zero-write configuration are accepted."),
        posture("Reviewer and queue", "Prototype", "Security and persistence semantics are testable but not connected."),
        posture("Activation", "Blocked", "No invitation, endpoint, or public launch exists.")
      ],
      flow: [
        step("Authorize", "Founder approves the smallest infrastructure slice."),
        step("Implement", "Connect provider, identity, secrets, and durable storage privately."),
        step("Audit", "Repeat security, rights, privacy, and failure-mode checks."),
        step("Invite", "Open a named invitation only after every prerequisite passes.")
      ],
      decisions: [
        decision("Implementation packet", "Ready", "Five contracts now define the same boundaries."),
        decision("Provider credentials", "Absent", "No provider account or secret has been connected."),
        decision("External participants", "0", "No invitation has been generated."),
        decision("Pilot activation", "Blocked", "Founder authorization and production controls are absent.")
      ],
      metrics: [metric("Contracts", "5/5"), metric("Deployments", "0"), metric("Participants", "0"), metric("Write routes", "0")],
      packet: "VedaPath Invitation-Only Pilot Activation Gate\nProvider criteria: defined, provider unselected\nEnvironment contract: validated, secrets absent\nReviewer session: cryptographic spike only, IdP unconnected\nQueue persistence: semantics proven, durable store unconnected\nRights publication: blocked\nExternal participants: 0\nPilot activated: false\nPublic launch: blocked\nDecision: ready for founder authorization of a private infrastructure implementation, not a user launch.",
      primaryAction: { href: "build-status.html", label: "Open Build Status" },
      extras: {
        schema: "vedapath.invitation-only-pilot-gate.v1",
        decision: "ready-for-infrastructure-authorization-not-activated",
        provider_selected: false,
        credentials_attached: false,
        identity_provider_connected: false,
        durable_store_connected: false,
        security_review_complete: false,
        rights_approval_complete: false,
        founder_activation_authorized: false,
        activated: false,
        invitations_issued: 0,
        external_participants: 0,
        deployment: "none",
        write_routes: [],
        public_launch: "blocked",
        next_release: "v4.9.7 Pilot Infrastructure Authorization"
      }
    })
  }
];

function navHtml(active) {
  const links = [
    ["Home", "index.html"], ["Build", "build-status.html"], ["Brand", "brand/brand-board.html"], ["Blueprint", "blueprint.html"], ["Answers", "citedanswerlab.html"], ["Review", "reviewqueuepersistence.html"], ["Mantra", "mantralenslab.html"], ["Life", "lifecompanionlab.html"], ["Talk", "conversationcompanionlab.html"], ["Pattern", "patterncompanionlab.html"], ["Daily", "daily.html"],
    ["Provider Packet", "providerregiondecision.html"], ["Environment", "environmentsecretcontract.html"], ["Reviewer Session", "reviewersessionspike.html"], ["Queue Contract", "rightsqueuepersistencecontract.html"], ["Activation Gate", "invitationonlypilotgate.html"]
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

function sessionPage(item) {
  return [head(item, "vedapath-demo-operations.css"), '<body class="' + item.bodyClass + '">', '  <main class="workspace vp-ops-workspace" id="top" data-session-config="' + item.dataFile + '">', header(item, "reviewer session security spike"), '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>', '      <aside><strong>Cryptographic boundary</strong><span>The Node contract signs and verifies test envelopes. This browser view shows states only and never handles a signing secret.</span></aside>', '    </section>', '    <section class="vp-contract-grid" aria-label="Session contract summary"><article class="vp-contract-stat"><span>Maximum lifetime</span><strong>60 minutes</strong></article><article class="vp-contract-stat"><span>Subject</span><strong>Pseudonymous</strong></article><article class="vp-contract-stat"><span>Identity provider</span><strong>Not connected</strong></article><article class="vp-contract-stat"><span>Production access</span><strong>Always false</strong></article></section>', '    <section class="vp-ops-columns">', '      <form class="vp-ops-form" id="vpSessionForm"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Session state preview</span><h2>Evaluate one bounded operation</h2></div><span>No token in browser</span></div><label for="vpSessionRole">Reviewer role</label><select id="vpSessionRole" required></select><label for="vpSessionOperation">Requested operation</label><select id="vpSessionOperation" required></select><label for="vpSessionState">Session state</label><select id="vpSessionState" required></select><div class="vp-ops-actions"><button class="vp-ops-primary" type="submit">Evaluate session</button><button class="vp-ops-quiet" type="button" id="vpResetSession">Reset</button></div><pre id="vpSessionResult" class="vp-ops-packet" hidden></pre><p class="vp-ops-status" id="vpSessionStatus" aria-live="polite">Loading session contract.</p></form>', '      <section class="vp-ops-output"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Server-side checks</span><h2>What the executable spike proves</h2></div><span>Test only</span></div><ul class="vp-role-capabilities"><li>HMAC signature checked with timing-safe comparison.</li><li>Expiry and future issue times rejected.</li><li>Revoked session ids denied before authorization.</li><li>Role capabilities evaluated after session verification.</li><li>Identity-provider verified and production allowed stay false.</li></ul><div class="vp-ops-empty"><div><strong>Not an authentication system</strong><p>A real identity provider, secure cookies, CSRF controls, account lifecycle, MFA, recovery, and immutable audit are still required.</p></div></div></section>', '    </section>', '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-reviewer-session-simulator.js"></script>', "</body>", "</html>", ""].join("\n");
}

function queuePage(item) {
  return [head(item, "vedapath-demo-operations.css"), '<body class="' + item.bodyClass + '">', '  <main class="workspace vp-ops-workspace" id="top" data-queue-config="' + item.dataFile + '">', header(item, "rights queue persistence contract"), '    <section class="vp-ops-opening">', '      <div><span class="vp-ops-eyebrow">' + item.eyebrow + '</span><h1>' + item.headline + '</h1><p>' + item.copy + '</p></div>', '      <aside><strong>Persistence boundary</strong><span>The executable repository is provider-neutral and in memory. The browser simulator resets with the page. No database is connected.</span></aside>', '    </section>', '    <section class="vp-contract-grid" aria-label="Queue contract summary"><article class="vp-contract-stat"><span>Concurrency</span><strong>Expected version</strong></article><article class="vp-contract-stat"><span>Retry safety</span><strong>Idempotent event id</strong></article><article class="vp-contract-stat"><span>Audit</span><strong>Append only</strong></article><article class="vp-contract-stat"><span>Publication</span><strong>Blocked</strong></article></section>', '    <section class="vp-ops-columns">', '      <section class="vp-ops-form"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Reference repository</span><h2>Test one queue record</h2></div><span>Page memory</span></div><div class="vp-ops-field-grid"><label>Reviewer role<select id="vpPersistenceRole"><option value="source-reviewer">Source reviewer</option><option value="rights-reviewer">Rights reviewer</option><option value="release-reviewer">Release reviewer</option><option value="observer">Observer</option></select></label><label>Transition<select id="vpPersistenceAction"><option value="claim-source">Claim source</option><option value="claim-rights">Claim rights</option><option value="hold">Hold</option><option value="source-evidence-ready">Source evidence ready</option><option value="rights-evidence-ready">Rights evidence ready</option></select></label></div><pre id="vpPersistenceRecord" class="vp-ops-packet"></pre><div class="vp-ops-actions"><button class="vp-ops-primary" type="button" id="vpApplyTransition">Apply transition</button><button class="vp-ops-secondary" type="button" id="vpReplayTransition">Replay event</button><button class="vp-ops-secondary" type="button" id="vpStaleTransition">Test stale version</button><button class="vp-ops-quiet" type="button" id="vpResetPersistence">Reset</button></div><p class="vp-ops-status" id="vpPersistenceStatus" aria-live="polite">Loading persistence contract.</p></section>', '      <section class="vp-ops-output"><div class="vp-ops-section-head"><div><span class="vp-ops-eyebrow">Visible audit</span><h2>Session events</h2></div><span>No durable write</span></div><div id="vpPersistenceAudit" class="vp-persistence-audit vp-ops-empty"><p>No persistence events in this page session.</p></div><div class="vp-ops-empty"><div><strong>Immutable boundary</strong><p>Every accepted state change keeps publication blocked and registry merge manual-only.</p></div></div></section>', '    </section>', '  </main>', '  <script src="assets/vedapath-command-shell.js"></script>', '  <script src="assets/vedapath-queue-persistence-simulator.js"></script>', "</body>", "</html>", ""].join("\n");
}

function docEntry(item) {
  return ["# " + item.version + " " + item.title, "", "## Purpose", "", item.copy, "", "## What Changed", "", item.changes, "", "## Acceptance Checks", "", item.checks, "", "## Known Risks", "", sharedRisk, "", "## Founder Packet", "", item.data.packet, ""].join("\n");
}

function changelogEntry(item) {
  return ["## " + item.version + " " + item.title, "", "- Changes made: " + item.changes, "- Files changed: " + item.files.map(function (name) { return "`" + name + "`"; }).join(", ") + ".", "- Checks run: " + item.checks, "- Known risks: " + sharedRisk, ""].join("\n");
}

function readmeEntry(item) {
  return ["## " + item.version + " " + item.title, "", item.copy, "", "- Open: [" + item.title + "](" + item.href + ")", "- Data: `" + item.dataFile + "`", "- Boundary: " + sharedRisk, ""].join("\n");
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, 'const releaseBadge = "' + finalBadge + '";');
  text = text.replace(/^    \{ title: "Pilot Implementation", labels: \[[^\n]+\n/gm, "");
  text = text.replace('    { title: "Hosted Pilot", labels: ["Hosted API", "Request Guard", "Reviewer Roles", "Rights Queue", "Pilot Gate"] },', '    { title: "Hosted Pilot", labels: ["Hosted API", "Request Guard", "Reviewer Roles", "Rights Queue", "Pilot Gate"] },\n    { title: "Pilot Implementation", labels: ["Provider Packet", "Environment", "Reviewer Session", "Queue Contract", "Activation Gate"] },');
  if (!text.includes('"Provider Packet": "Provider & Region Decision Packet"')) {
    text = text.replace('    "Pilot Gate": "Controlled External Pilot Gate"', '    "Pilot Gate": "Controlled External Pilot Gate",\n    "Provider Packet": "Provider & Region Decision Packet",\n    "Environment": "Environment & Secret Contract",\n    "Reviewer Session": "Reviewer Session Security Spike",\n    "Queue Contract": "Rights Queue Persistence Contract",\n    "Activation Gate": "Invitation-Only Pilot Activation Gate"');
  }
  if (!text.includes('"provider-region-decision-page": "Provider & Region Decision Packet"')) {
    text = text.replace('    "controlled-external-pilot-gate-page": "Controlled External Pilot Gate"', '    "controlled-external-pilot-gate-page": "Controlled External Pilot Gate",\n    "provider-region-decision-page": "Provider & Region Decision Packet",\n    "environment-secret-contract-page": "Environment & Secret Contract",\n    "reviewer-session-security-spike-page": "Reviewer Session Security Spike",\n    "rights-queue-persistence-contract-page": "Rights Queue Persistence Contract",\n    "invitation-only-pilot-activation-gate-page": "Invitation-Only Pilot Activation Gate"');
  }
  if (!text.includes('["Provider Packet", "providerregiondecision.html"]')) {
    text = text.replace('    ["Pilot Gate", "controlledexternalpilotgate.html"]', '    ["Pilot Gate", "controlledexternalpilotgate.html"],\n    ["Provider Packet", "providerregiondecision.html"],\n    ["Environment", "environmentsecretcontract.html"],\n    ["Reviewer Session", "reviewersessionspike.html"],\n    ["Queue Contract", "rightsqueuepersistencecontract.html"],\n    ["Activation Gate", "invitationonlypilotgate.html"]');
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes('"providerregiondecision.html"')) {
    text = text.replace('  "controlledexternalpilotgate.html"', '  "controlledexternalpilotgate.html",\n  "providerregiondecision.html",\n  "environmentsecretcontract.html",\n  "reviewersessionspike.html",\n  "rightsqueuepersistencecontract.html",\n  "invitationonlypilotgate.html"');
  }
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/v4\.9\.1 controlled pilot/g, finalBadge);
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)v4\.9\.1(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.9.6$2Invitation-Only Pilot Activation Gate completes provider criteria, safe environment configuration, signed reviewer-session semantics, concurrency-safe queue semantics, and one honest activation decision while every external path stays closed.$3');
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, '$1v4.9.7 Pilot Infrastructure Authorization$2Approve or reject one private provider implementation with named owner, region, budget, identity, durable storage, security, privacy, and rights prerequisites.$3');
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Release</span><strong>v4.9.6 Invitation-Only Pilot Activation Gate</strong></div>');
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Previous</span><strong>v4.9.5 Rights Queue Persistence Contract</strong></div>');
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Make the smallest private pilot implementation explicit, testable, provider-neutral, and impossible to confuse with an active launch.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Ready for founder infrastructure authorization; provider deployment and invitations remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Approve one provider, region, private access method, budget cap, and shutdown owner.</span></li>\n            <li><span class="dot"></span><span>Connect managed secrets, a real reviewer identity provider, and a durable queue in a private environment.</span></li>\n            <li><span class="dot"></span><span>Repeat security, privacy, rights, recovery, concurrency, and failure-mode reviews against the real stack.</span></li>\n            <li><span class="dot"></span><span>Require a separate founder activation decision before issuing any invitation.</span></li>\n          </ul>');
  write("build-status.html", text);
}

function updateLegacyCheckers() {
  let text = read("scripts/check-v487-v491-hosted-pilot-foundation.mjs");
  text = text.replace("assert(shell.includes('const releaseBadge = \"v4.9.1 controlled pilot\";'), \"final release badge\");", "assert(/const releaseBadge = \"(?:v4\\.9\\.1 controlled pilot|v4\\.9\\.6 pilot implementation gate)\";/.test(shell), \"compatible release badge\");");
  text = text.replace('assert(text("build-status.html").includes("<strong>v4.9.1</strong>"), "build status final version");', 'assert(/<strong>v4\\.9\\.(?:1|6)<\\/strong>/.test(text("build-status.html")), "build status compatible version");');
  write("scripts/check-v487-v491-hosted-pilot-foundation.mjs", text);

  for (const name of ["scripts/check-v482-v486-private-demo-hardening.mjs", "scripts/check-v477-v481-integrated-source-path.mjs"]) {
    text = read(name);
    text = text.replace('(?:v4\\.8\\.6 hosted gate|v4\\.9\\.1 controlled pilot)', '(?:v4\\.8\\.6 hosted gate|v4\\.9\\.1 controlled pilot|v4\\.9\\.6 pilot implementation gate)');
    text = text.replace('v4\\.(?:8\\.6|9\\.1)', 'v4\\.(?:8\\.6|9\\.(?:1|6))');
    write(name, text);
  }
}

function updateRootBadges() {
  for (const name of readdirSync(root).filter(function (entry) { return entry.endsWith(".html"); })) {
    let text = read(name);
    text = text.replace(/v4\.9\.1 controlled pilot/g, finalBadge);
    write(name, text);
  }
}

for (const item of releases) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docEntry(item));
  write(item.href, item.type === "session" ? sessionPage(item) : item.type === "queue" ? queuePage(item) : gatePage(item));
}

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateLegacyCheckers();
updateRootBadges();

const changelogPrefix = releases.slice().reverse().map(changelogEntry).join("\n");
let changelog = read("CHANGELOG.md");
if (!changelog.includes("## v4.9.6 Invitation-Only Pilot Activation Gate")) write("CHANGELOG.md", changelogPrefix + changelog);

const readmePrefix = releases.slice().reverse().map(readmeEntry).join("\n");
let readme = read("README.md");
if (!readme.includes("## v4.9.6 Invitation-Only Pilot Activation Gate")) write("README.md", readmePrefix + readme);

console.log("applied-v492-v496-pilot-implementation-foundation");
