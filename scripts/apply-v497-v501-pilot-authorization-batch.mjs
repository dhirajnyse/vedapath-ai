import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const versions = ["v4.9.7", "v4.9.8", "v4.9.9", "v5.0.0", "v5.0.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

const sharedRisk = "Private-pilot implementation evidence only; no provider account, credentials, endpoint, live identity provider, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.";
const badges = {
  "v4.9.7": "v4.9.7 infrastructure authorization",
  "v4.9.8": "v4.9.8 deployment contract",
  "v4.9.9": "v4.9.9 identity contract",
  "v5.0.0": "v5.0.0 queue migration",
  "v5.0.1": "v5.0.1 pilot readiness control"
};

function file(name) { return path.join(root, name); }
function read(name) { return readFileSync(file(name), "utf8"); }
function write(name, value) { writeFileSync(file(name), value, "utf8"); }
function posture(title, decision, copy) { return { title, decision, copy }; }
function step(title, copy) { return { title, copy }; }
function decision(label, value, reason) { return { label, value, reason }; }
function metric(label, value) { return { label, value }; }

function locks() {
  return [
    posture("Deployment lock", "Closed", "No provider endpoint, domain, runtime, or credential is active."),
    posture("Identity lock", "Closed", "The claim contract does not authenticate a real reviewer."),
    posture("Storage lock", "Closed", "Ledger semantics are verified without a connected durable provider."),
    posture("Invitation lock", "Closed", "No invitation token, participant, or external session exists."),
    posture("Public launch lock", "Closed", "Implementation readiness cannot activate a public service.")
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
    version: "v4.9.7",
    title: "Pilot Infrastructure Authorization Record",
    label: "Authorization",
    href: "pilotinfrastructureauthorization.html",
    dataFile: "data/vedapath-pilot-infrastructure-authorization.json",
    docFile: "docs/PILOT_INFRASTRUCTURE_AUTHORIZATION_RECORD.md",
    moduleFile: "scripts/vedapath-infrastructure-authorization.mjs",
    bodyClass: "pilot-infrastructure-authorization-page",
    eyebrow: "Decision evidence before infrastructure",
    headline: "Authorize one private implementation. Keep every launch path closed.",
    copy: "A deterministic evaluator now requires a provider, region, budget cap, owners, private access, managed secrets, reviewer identity, durable queue, privacy, rights, and recovery evidence before a founder decision can authorize implementation work.",
    changes: "Adds a pure infrastructure authorization evaluator, bounded budget and owner checks, thirteen evidence requirements, explicit reject and pending states, redacted summaries, and permanent zero-deployment and zero-invitation outputs.",
    files: ["pilotinfrastructureauthorization.html", "data/vedapath-pilot-infrastructure-authorization.json", "docs/PILOT_INFRASTRUCTURE_AUTHORIZATION_RECORD.md", "scripts/vedapath-infrastructure-authorization.mjs"],
    checks: "node --check scripts/vedapath-infrastructure-authorization.mjs; complete, incomplete, rejected, over-budget, public-access, invitation, and write-route assertions; batch checker through v4.9.7.",
    data: gateData({
      version: "v4.9.7",
      position: "Authorization is a recorded decision, never an implication from completed prototypes",
      headline: "The evaluator can authorize private implementation only after every named prerequisite passes.",
      copy: "The default project packet stays pending because no provider, region, owner, budget, identity provider, durable store, or real review evidence has been supplied.",
      postures: [
        posture("Decision contract", "Ready", "The evaluator and required evidence are explicit and testable."),
        posture("Founder decision", "Pending", "No private infrastructure implementation has been authorized."),
        posture("Provider and region", "Unselected", "No vendor account, region, or endpoint is attached."),
        posture("Activation", "Blocked", "Authorization for implementation would still not issue invitations.")
      ],
      flow: [
        step("Name", "Record provider, region, owners, and a budget cap."),
        step("Prove", "Attach security, privacy, rights, identity, storage, and recovery evidence."),
        step("Decide", "Approve private implementation, reject, or remain pending."),
        step("Hold", "Keep deployment and invitations closed after the decision.")
      ],
      decisions: [
        decision("Evaluator", "Executable", "Unsafe and incomplete inputs are rejected deterministically."),
        decision("Current authorization", "Pending", "Required real-world inputs remain absent."),
        decision("Deployment", "None", "This record cannot create infrastructure."),
        decision("External participants", "0", "Invitation issuance is forbidden.")
      ],
      metrics: [metric("Evidence rules", "13"), metric("Providers selected", "0"), metric("Deployments", "0"), metric("Invitations", "0")],
      packet: "VedaPath Pilot Infrastructure Authorization Record\nEvaluator: executable\nProvider: unselected\nRegion: unselected\nBudget cap: pending\nShutdown owner: unassigned\nIncident owner: unassigned\nSecurity, privacy, rights, identity, storage, recovery: pending real-stack evidence\nAuthorization: pending\nDeployment: none\nInvitations: 0\nPublic launch: blocked",
      primaryAction: { href: "deploymentmanifestcontract.html", label: "Open Deployment Contract" },
      extras: {
        schema: "vedapath.pilot-infrastructure-authorization-record.v1",
        decision: "pending-real-inputs",
        evaluator: "scripts/vedapath-infrastructure-authorization.mjs",
        required_evidence_count: 13,
        provider_selected: false,
        region_selected: false,
        privately_authorized: false,
        deployment_activated: false,
        invitations_issued: 0,
        external_participants: 0,
        write_routes: [],
        public_launch: "blocked",
        next_release: "v4.9.8 Deployment Manifest Contract"
      }
    })
  },
  {
    version: "v4.9.8",
    title: "Deployment Manifest Contract",
    label: "Manifest",
    href: "deploymentmanifestcontract.html",
    dataFile: "data/vedapath-deployment-manifest-contract.json",
    docFile: "docs/DEPLOYMENT_MANIFEST_CONTRACT.md",
    moduleFile: "scripts/vedapath-deployment-manifest.mjs",
    bodyClass: "deployment-manifest-contract-page",
    eyebrow: "Portable private-preview configuration",
    headline: "Validate the deployment shape before a provider receives it.",
    copy: "A provider-neutral manifest now enforces a Web-standard runtime, private invitation-only access, aggregate redacted telemetry, named secret references, strict request limits, zero writes, a shutdown owner, and dry-run-only posture.",
    changes: "Adds an allowlisted deployment manifest validator, safe path and region checks, required secret references, mandatory log redactions, request, timeout, and rate limits, rollback ownership, safe summaries, and hard activation and write-route rejections.",
    files: ["deploymentmanifestcontract.html", "data/vedapath-deployment-manifest-contract.json", "docs/DEPLOYMENT_MANIFEST_CONTRACT.md", "scripts/vedapath-deployment-manifest.mjs"],
    checks: "node --check scripts/vedapath-deployment-manifest.mjs; valid dry-run manifest plus unknown-key, literal-reference, activation, public-access, unsafe-limit, missing-redaction, write-route, and rollback rejection assertions; batch checker through v4.9.8.",
    data: gateData({
      version: "v4.9.8",
      position: "One portable manifest, no credentials and no endpoint",
      headline: "The dry-run manifest is complete enough to review and too constrained to launch.",
      copy: "The contract validates only names, boundaries, limits, and rollback posture. It never serializes a secret value or activates an endpoint.",
      postures: [
        posture("Runtime", "Ready", "The Web-standard request and response boundary is portable."),
        posture("Private access", "Required", "Only invitation-only access is accepted."),
        posture("Operational limits", "Ready", "Request size, timeout, rate, redaction, and rollback are bounded."),
        posture("Provider deployment", "Blocked", "The reference manifest is dry-run only.")
      ],
      flow: [
        step("Describe", "Name environment, runtime, region, routes, and access."),
        step("Reference", "Carry managed secret names without values."),
        step("Constrain", "Set privacy-safe logs, request limits, and zero writes."),
        step("Validate", "Return a redacted summary and no deployment side effect.")
      ],
      decisions: [
        decision("Manifest", "Valid reference", "The sample satisfies every dry-run safety rule."),
        decision("Secret values", "0", "Only managed names are accepted."),
        decision("Write routes", "0", "The first hosted slice remains read-only."),
        decision("Endpoint", "Not created", "Validation has no provider side effect.")
      ],
      metrics: [metric("Allowlisted keys", "16"), metric("Required redactions", "5"), metric("Write routes", "0"), metric("Deployments", "0")],
      packet: "VedaPath Deployment Manifest Contract\nEnvironment: pilot\nRuntime: web-standard\nAccess: private-invite-only\nTelemetry: aggregate-redacted\nSecret values: 0\nWrite routes: 0\nRollback: disable endpoint within 15 minutes\nDeployment mode: dry-run\nEndpoint created: false\nPublic launch: blocked",
      primaryAction: { href: "revieweridentityprovidercontract.html", label: "Open Identity Contract" },
      extras: {
        schema: "vedapath.deployment-manifest-contract.v1",
        validator: "scripts/vedapath-deployment-manifest.mjs",
        reference_manifest: {
          schema: "vedapath.private-preview-manifest.v1",
          environment: "pilot",
          runtime: "web-standard",
          region: "founder-selection-required",
          access: "private-invite-only",
          apiPath: "/api/source",
          healthPath: "/healthz",
          secretRefs: ["VEDAPATH_SESSION_SIGNING_SECRET", "VEDAPATH_REVIEWER_STORE_KEY"],
          telemetry: "aggregate-redacted",
          redactedLogFields: ["question", "authorization", "cookie", "ip", "user-agent"],
          limits: { requestBytes: 4096, timeoutMs: 3000, requestsPerMinute: 20 },
          writeRoutes: [],
          rollback: { strategy: "disable-endpoint", owner: "founder-selection-required", targetMinutes: 10 },
          deploymentMode: "dry-run",
          activated: false
        },
        credentials_serialized: false,
        endpoint_created: false,
        deployment_activated: false,
        public_launch: "blocked",
        next_release: "v4.9.9 Reviewer Identity Provider Contract"
      }
    })
  },
  {
    version: "v4.9.9",
    title: "Reviewer Identity Provider Contract",
    label: "Identity Contract",
    href: "revieweridentityprovidercontract.html",
    dataFile: "data/vedapath-reviewer-identity-provider-contract.json",
    docFile: "docs/REVIEWER_IDENTITY_PROVIDER_CONTRACT.md",
    moduleFile: "scripts/vedapath-reviewer-identity-contract.mjs",
    bodyClass: "reviewer-identity-provider-contract-page",
    eyebrow: "Bounded claims before live identity",
    headline: "Map reviewer claims to narrow capabilities. Deny every launch action.",
    copy: "An OIDC-style claim validator now checks issuer, audience, pseudonymous subject, one-hour expiry, AAL2 assurance, bounded roles, revocation, and direct-identity exclusion before any reviewer capability is returned.",
    changes: "Adds a pure reviewer claim validator, deterministic role-to-capability mapping, issuer and audience enforcement, AAL2 and lifetime checks, pseudonymous subjects, revocation handling, direct identity rejection, and permanent denial of publication, registry merge, invitations, activation, and public launch.",
    files: ["revieweridentityprovidercontract.html", "data/vedapath-reviewer-identity-provider-contract.json", "docs/REVIEWER_IDENTITY_PROVIDER_CONTRACT.md", "scripts/vedapath-reviewer-identity-contract.mjs"],
    checks: "node --check scripts/vedapath-reviewer-identity-contract.mjs; valid, wrong issuer, wrong audience, expired, overlong, revoked, direct-identity, missing-AAL2, unsupported-role, allowed-capability, denied-capability, and permanent-lock assertions; batch checker through v4.9.9.",
    data: gateData({
      version: "v4.9.9",
      position: "Verify a provider contract without pretending an identity provider is connected",
      headline: "Only short-lived pseudonymous AAL2 sessions can reach a bounded reviewer capability.",
      copy: "The contract defines the claims and capability policy a future identity provider must satisfy. It does not authenticate a real person or create an account.",
      postures: [
        posture("Issuer and audience", "Required", "Claims must be bound to one reviewed provider and VedaPath audience."),
        posture("Assurance", "AAL2", "One-hour maximum sessions and revocation are mandatory."),
        posture("Reviewer roles", "Bounded", "Four roles map only to review capabilities."),
        posture("Identity provider", "Unconnected", "The validator is a contract, not live authentication.")
      ],
      flow: [
        step("Verify", "Check issuer, audience, subject, time, assurance, and revocation."),
        step("Map", "Translate accepted roles into narrow capabilities."),
        step("Authorize", "Allow only an explicitly mapped review operation."),
        step("Deny", "Keep publication, invitation, activation, and launch locked.")
      ],
      decisions: [
        decision("Claims contract", "Executable", "Unsafe and identifying claims are rejected."),
        decision("Session lifetime", "60 minutes maximum", "Long-lived reviewer access is refused."),
        decision("Production authentication", "Absent", "No live issuer or account is connected."),
        decision("Launch capabilities", "Always denied", "Roles cannot cross the pilot boundary.")
      ],
      metrics: [metric("Reviewer roles", "4"), metric("Permanent locks", "5"), metric("Live accounts", "0"), metric("Invitations", "0")],
      packet: "VedaPath Reviewer Identity Provider Contract\nProtocol shape: OIDC-style claims\nSubject: pseudonymous reviewer id\nAssurance: AAL2 required\nLifetime: 60 minutes maximum\nRevocation: required\nDirect identity claims: rejected\nRoles: observer, source reviewer, rights reviewer, release reviewer\nPublish, merge, invite, activate, public launch: always denied\nIdentity provider connected: false",
      primaryAction: { href: "durablequeuemigrationpack.html", label: "Open Queue Migration" },
      extras: {
        schema: "vedapath.reviewer-identity-provider-contract.v1",
        validator: "scripts/vedapath-reviewer-identity-contract.mjs",
        assurance: "aal2",
        maximum_lifetime_seconds: 3600,
        direct_identity_claims_allowed: false,
        roles: ["observer", "source-reviewer", "rights-reviewer", "release-reviewer"],
        permanently_denied: ["publish-source", "merge-registry", "issue-invite", "activate-pilot", "public-launch"],
        identity_provider_connected: false,
        live_accounts: 0,
        production_allowed: false,
        public_launch: "blocked",
        next_release: "v5.0.0 Durable Queue Migration Pack"
      }
    })
  },
  {
    version: "v5.0.0",
    title: "Durable Queue Migration Pack",
    label: "Queue Migration",
    href: "durablequeuemigrationpack.html",
    dataFile: "data/vedapath-durable-queue-migration-pack.json",
    docFile: "docs/DURABLE_QUEUE_MIGRATION_PACK.md",
    moduleFile: "scripts/vedapath-durable-queue-ledger.mjs",
    bodyClass: "durable-queue-migration-pack-page",
    eyebrow: "Tamper-evident replay before database choice",
    headline: "Prove the queue event chain before migrating it to durable storage.",
    copy: "A hash-chained append-only ledger now verifies event order, expected record versions, retry idempotency, role-bounded transitions, replay recovery, immutable publication locks, and tamper detection before a database provider is connected.",
    changes: "Adds a canonical SHA-256 event ledger, genesis and previous-hash chaining, optimistic concurrency, idempotent receipts, bounded queue actions and reviewer roles, replay verification, tamper detection, and permanent publication and registry locks.",
    files: ["durablequeuemigrationpack.html", "data/vedapath-durable-queue-migration-pack.json", "docs/DURABLE_QUEUE_MIGRATION_PACK.md", "scripts/vedapath-durable-queue-ledger.mjs"],
    checks: "node --check scripts/vedapath-durable-queue-ledger.mjs; append, idempotent replay, stale version, denied action, denied role, lane mismatch, hash-chain verification, tamper detection, deterministic replay, publication, and registry-lock assertions; batch checker through v5.0.0.",
    data: gateData({
      version: "v5.0.0",
      position: "Migration semantics are executable; the durable provider is still a future connection",
      headline: "Every accepted queue event is ordered, hashed, replayable, and still unable to publish.",
      copy: "The ledger makes concurrency, retries, audit continuity, recovery, and tamper evidence testable without claiming that browser or process memory is production storage.",
      postures: [
        posture("Event chain", "Verified", "Every event carries its sequence, previous hash, and canonical hash."),
        posture("Retry safety", "Verified", "Idempotency keys return the first accepted receipt."),
        posture("Recovery replay", "Verified", "A valid chain reconstructs the queue state deterministically."),
        posture("Durable provider", "Unconnected", "No production database or migration has run.")
      ],
      flow: [
        step("Seed", "Start from versioned, publication-blocked records."),
        step("Append", "Check role, action, version, and idempotency before hashing."),
        step("Verify", "Detect sequence, previous-hash, content, or head tampering."),
        step("Replay", "Rebuild state only from a valid append-only chain.")
      ],
      decisions: [
        decision("Ledger", "Executable", "Hash-chain and replay semantics are testable."),
        decision("Concurrency", "Optimistic", "Every command names the expected record version."),
        decision("Durable provider", "Not connected", "No database choice is implied."),
        decision("Publication", "Blocked", "Every resulting record preserves the lock.")
      ],
      metrics: [metric("Allowed actions", "5"), metric("Reviewer roles", "3"), metric("Hash", "SHA-256"), metric("Durable stores", "0")],
      packet: "VedaPath Durable Queue Migration Pack\nEvent model: append-only\nHash chain: SHA-256 canonical event content\nConcurrency: expected record version\nRetry safety: idempotency key\nRecovery: verified deterministic replay\nPublication: blocked\nRegistry merge: manual only\nDurable provider: not connected\nProduction migration run: false",
      primaryAction: { href: "privatepilotreadinesscontrolroom.html", label: "Open Readiness Control" },
      extras: {
        schema: "vedapath.durable-queue-migration-pack.v1",
        ledger: "scripts/vedapath-durable-queue-ledger.mjs",
        hash: "sha256",
        append_only: true,
        optimistic_concurrency: true,
        idempotent_events: true,
        replay_verified: true,
        durable_provider_connected: false,
        production_migration_run: false,
        publication: "blocked",
        registry_merge: "manual-only",
        public_launch: "blocked",
        next_release: "v5.0.1 Private Pilot Readiness Control Room"
      }
    })
  },
  {
    version: "v5.0.1",
    title: "Private Pilot Readiness Control Room",
    label: "Readiness Control",
    href: "privatepilotreadinesscontrolroom.html",
    dataFile: "data/vedapath-private-pilot-readiness-control-room.json",
    docFile: "docs/PRIVATE_PILOT_READINESS_CONTROL_ROOM.md",
    moduleFile: "scripts/vedapath-private-pilot-readiness.mjs",
    bodyClass: "private-pilot-readiness-control-room-page",
    eyebrow: "One quiet decision surface",
    headline: "See what is proven, what is absent, and why the pilot remains closed.",
    copy: "A single readiness control now assembles authorization, deployment-manifest, reviewer-identity, durable-queue, security, privacy, rights, and recovery evidence into one deterministic decision without converting readiness into activation.",
    changes: "Adds a private-pilot readiness assessor, eight named evidence checks, stable blocker reporting, a founder-readable packet, one consolidated command-center surface, final navigation and build status, and regression coverage across the entire five-release authorization chain.",
    files: ["privatepilotreadinesscontrolroom.html", "data/vedapath-private-pilot-readiness-control-room.json", "docs/PRIVATE_PILOT_READINESS_CONTROL_ROOM.md", "scripts/vedapath-private-pilot-readiness.mjs", "scripts/check-v497-v501-pilot-authorization.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-private-pilot-readiness.mjs; complete and incomplete readiness assertions; permanent activation, deployment, invitation, participant, and public-launch locks; full v4.9.7-v5.0.1 checker; prior regression suites; static links; local HTTP smoke; desktop and mobile visual QA.",
    data: gateData({
      version: "v5.0.1",
      position: "The contracts are implementation-ready; every real connection and activation decision is still visible as missing",
      headline: "Four implementation contracts are proven. Real infrastructure and activation remain separate decisions.",
      copy: "The control room prevents a mature prototype from being mistaken for a live service. It shows the exact evidence still needed before private implementation, then requires another founder decision before any invitation.",
      postures: [
        posture("Authorization evaluator", "Ready", "The private implementation decision is deterministic and bounded."),
        posture("Manifest and identity", "Ready", "Configuration and claim contracts reject unsafe inputs."),
        posture("Queue migration", "Ready", "The event ledger detects tampering and replays state."),
        posture("Real infrastructure", "Blocked", "Provider, secrets, IdP, database, and audits are unconnected.")
      ],
      flow: [
        step("Review", "Read the authorization, manifest, identity, and queue evidence."),
        step("Connect", "Implement the smallest approved stack in a private environment."),
        step("Repeat", "Run security, privacy, rights, recovery, and failure-mode reviews."),
        step("Decide", "Require a separate founder activation record before one invitation.")
      ],
      decisions: [
        decision("Implementation contracts", "5/5", "The complete authorization chain is executable and linked."),
        decision("Real connections", "0/4", "Provider, secrets, identity, and database are absent."),
        decision("Pilot activation", "Not authorized", "Readiness cannot issue an invitation."),
        decision("External participants", "0", "No outside user has access.")
      ],
      metrics: [metric("Contracts", "5/5"), metric("Real connections", "0/4"), metric("Invitations", "0"), metric("Public launch", "Blocked")],
      packet: "VedaPath Private Pilot Readiness Control Room\nAuthorization evaluator: ready\nDeployment manifest validator: ready\nReviewer identity contract: ready\nDurable queue ledger: ready\nReadiness assessor: ready\nProvider, secrets, live IdP, durable database: not connected\nSecurity, privacy, rights, recovery reviews against real stack: pending\nActivation authorized: false\nDeployment activated: false\nInvitations issued: 0\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "build-status.html", label: "Open Build Status" },
      extras: {
        schema: "vedapath.private-pilot-readiness-control-room.v1",
        assessor: "scripts/vedapath-private-pilot-readiness.mjs",
        implementation_contracts_complete: 5,
        real_connections_complete: 0,
        required_real_connections: ["provider", "managed-secrets", "identity-provider", "durable-database"],
        security_review_against_real_stack: false,
        privacy_review_against_real_stack: false,
        rights_review_against_real_stack: false,
        recovery_drill_against_real_stack: false,
        activation_authorized: false,
        deployment_activated: false,
        invitations_issued: 0,
        external_participants: 0,
        public_launch: "blocked",
        next_release: "v5.0.2 Private Infrastructure Implementation Decision"
      }
    })
  }
];

const selected = releases.slice(0, throughIndex + 1);
const current = selected.at(-1);
const next = releases[throughIndex + 1] || {
  version: "v5.0.2",
  title: "Private Infrastructure Implementation Decision",
  copy: "Choose whether to connect the smallest provider, identity, secret, and durable-storage slice after reviewing the complete evidence chain."
};

function page(item) {
  const previousLinks = [
    ["Provider Packet", "providerregiondecision.html"],
    ["Environment", "environmentsecretcontract.html"],
    ["Reviewer Session", "reviewersessionspike.html"],
    ["Queue Contract", "rightsqueuepersistencecontract.html"],
    ["Activation Gate", "invitationonlypilotgate.html"]
  ];
  const newLinks = selected.map((release) => [release.label, release.href]);
  const links = previousLinks.concat(newLinks).map(([label, href]) => `        <a class="link${href === item.href ? " active" : ""}" href="${href}">${label}</a>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${item.title} | VedaPath AI</title>
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
        <span><strong>VedaPath AI</strong><small>${item.title.toLowerCase()}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
        <a class="link" href="index.html">Home</a>
        <a class="link" href="build-status.html">Build</a>
${links}
        <span class="version-pill">${badges[through]}</span>
      </nav>
    </header>
    <section class="rp-opening">
      <div><span class="rp-eyebrow">${item.eyebrow}</span><h1>${item.headline}</h1><p>${item.copy}</p></div>
      <aside class="rp-opening-card"><img src="assets/vedapath-3d-logo-concept.png" alt="" /><strong>${item.title}</strong><span>Source first. Calm path.</span></aside>
    </section>
    <section data-retrieval-app data-kind="gate" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-retrieval-pilot.js?v=501-copy2"></script>
</body>
</html>
`;
}

function docEntry(item) {
  return [`# ${item.version} ${item.title}`, "", "## Purpose", "", item.copy, "", "## What Changed", "", item.changes, "", "## Acceptance Checks", "", item.checks, "", "## Known Risks", "", sharedRisk, "", "## Founder Packet", "", item.data.packet, ""].join("\n");
}

function changelogEntry(item) {
  return [`## ${item.version} ${item.title}`, "", `- Changes made: ${item.changes}`, `- Files changed: ${item.files.map((name) => `\`${name}\``).join(", ")}.`, `- Checks run: ${item.checks}`, `- Known risks: ${sharedRisk}`, ""].join("\n");
}

function readmeEntry(item) {
  return [`## ${item.version} ${item.title}`, "", item.copy, "", `- Open: [${item.title}](${item.href})`, `- Data: \`${item.dataFile}\``, `- Boundary: ${sharedRisk}`, ""].join("\n");
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${badges[through]}";`);
  text = text.replace(/^    \{ title: "Pilot Authorization", labels: \[[^\n]+\n/gm, "");
  const group = `    { title: "Pilot Authorization", labels: [${selected.map((item) => `"${item.label}"`).join(", ")}] },`;
  text = text.replace('    { title: "Pilot Implementation", labels: ["Provider Packet", "Environment", "Reviewer Session", "Queue Contract", "Activation Gate"] },', '    { title: "Pilot Implementation", labels: ["Provider Packet", "Environment", "Reviewer Session", "Queue Contract", "Activation Gate"] },\n' + group);

  for (const item of releases) {
    text = text.replace(new RegExp(`^    "${item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    "${item.bodyClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    \\["${item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}", "[^"]+"\\],?\\r?\\n`, "gm"), "");
  }

  const titleLines = selected.map((item, index) => `    "${item.label}": "${item.title}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    "Activation Gate": "Invitation-Only Pilot Activation Gate"', '    "Activation Gate": "Invitation-Only Pilot Activation Gate",\n' + titleLines);
  const bodyLines = selected.map((item, index) => `    "${item.bodyClass}": "${item.title}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    "invitation-only-pilot-activation-gate-page": "Invitation-Only Pilot Activation Gate"', '    "invitation-only-pilot-activation-gate-page": "Invitation-Only Pilot Activation Gate",\n' + bodyLines);
  const linkLines = selected.map((item, index) => `    ["${item.label}", "${item.href}"]${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    ["Activation Gate", "invitationonlypilotgate.html"]', '    ["Activation Gate", "invitationonlypilotgate.html"],\n' + linkLines);
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const item of releases) {
    text = text.replace(new RegExp(`^  "${item.href}",?\\r?\\n`, "gm"), "");
  }
  const lines = selected.map((item, index) => `  "${item.href}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('  "invitationonlypilotgate.html"', '  "invitationonlypilotgate.html",\n' + lines);
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/v4\.9\.6 pilot implementation gate|v4\.9\.7 infrastructure authorization|v4\.9\.8 deployment contract|v4\.9\.9 identity contract|v5\.0\.0 queue migration|v5\.0\.1 pilot readiness control/g, badges[through]);
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${current.version}$2${current.copy}$3`);
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${next.version} ${next.title}$2${next.copy || "Review the next private implementation decision."}$3`);
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${current.version} ${current.title}</strong></div>`);
  const previous = throughIndex === 0 ? releases[0].version.replace("7", "6") + " Invitation-Only Pilot Activation Gate" : `${releases[throughIndex - 1].version} ${releases[throughIndex - 1].title}`;
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previous}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Turn private-pilot infrastructure decisions into explicit, executable evidence without confusing readiness with activation.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Ready for founder implementation review; provider deployment, invitations, and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Choose whether to authorize one private provider implementation with a named owner, region, and budget cap.</span></li>\n            <li><span class="dot"></span><span>Connect managed secrets, a reviewed identity provider, and a durable queue only after approval.</span></li>\n            <li><span class="dot"></span><span>Repeat security, privacy, rights, concurrency, recovery, and shutdown reviews against the real stack.</span></li>\n            <li><span class="dot"></span><span>Require a separate founder activation record before issuing even one invitation.</span></li>\n          </ul>');
  write("build-status.html", text);
}

function updateLegacyCheckers() {
  const acceptedBadges = '(?:v4\\.9\\.6 pilot implementation gate|v4\\.9\\.7 infrastructure authorization|v4\\.9\\.8 deployment contract|v4\\.9\\.9 identity contract|v5\\.0\\.0 queue migration|v5\\.0\\.1 pilot readiness control)';
  let text = read("scripts/check-v492-v496-pilot-implementation-foundation.mjs");
  text = text.replace('assert(shell.includes(\'const releaseBadge = "v4.9.6 pilot implementation gate";\'), "final release badge");', `assert(new RegExp('const releaseBadge = "${acceptedBadges}";').test(shell), "compatible release badge");`);
  text = text.replace('assert(text("build-status.html").includes("<strong>v4.9.6</strong>"), "build status final version");', 'assert(/<strong>(?:v4\\.9\\.[6-9]|v5\\.0\\.[01])<\\/strong>/.test(text("build-status.html")), "build status compatible version");');
  text = text.replace('assert(/infrastructure authorization/i.test(text("build-status.html")), "build status next decision");', 'assert(/(?:infrastructure authorization|private infrastructure implementation)/i.test(text("build-status.html")), "build status next decision");');
  write("scripts/check-v492-v496-pilot-implementation-foundation.mjs", text);

  for (const name of ["scripts/check-v487-v491-hosted-pilot-foundation.mjs", "scripts/check-v482-v486-private-demo-hardening.mjs", "scripts/check-v477-v481-integrated-source-path.mjs"]) {
    text = read(name);
    text = text.replace(/\(\?:v4\\\.9\\\.1 controlled pilot\|v4\\\.9\\\.6 pilot implementation gate\)/g, '(?:v4\\.9\\.1 controlled pilot|v4\\.9\\.6 pilot implementation gate|v4\\.9\\.7 infrastructure authorization|v4\\.9\\.8 deployment contract|v4\\.9\\.9 identity contract|v5\\.0\\.0 queue migration|v5\\.0\\.1 pilot readiness control)');
    text = text.replace(/\(\?:v4\\\.8\\\.6 hosted gate\|v4\\\.9\\\.1 controlled pilot\|v4\\\.9\\\.6 pilot implementation gate\)/g, '(?:v4\\.8\\.6 hosted gate|v4\\.9\\.1 controlled pilot|v4\\.9\\.6 pilot implementation gate|v4\\.9\\.7 infrastructure authorization|v4\\.9\\.8 deployment contract|v4\\.9\\.9 identity contract|v5\\.0\\.0 queue migration|v5\\.0\\.1 pilot readiness control)');
    text = text.replace(/<strong>v4\\\.9\\\.\(\?:1\|6\)<\\\/strong>/g, '<strong>(?:v4\\.9\\.[16789]|v5\\.0\\.[01])<\\/strong>');
    text = text.replace(/v4\\\.\(\?:8\\\.6\|9\\\.\(\?:1\|6\)\)/g, '(?:v4\\.8\\.6|v4\\.9\\.[16789]|v5\\.0\\.[01])');
    text = text.replace(/implementation-ready\|provider deployment and invitations remain blocked/g, 'implementation-ready|provider deployment and invitations remain blocked|founder implementation review');
    write(name, text);
  }
}

function updateBadges() {
  const names = readdirSync(root).filter((entry) => entry.endsWith(".html"));
  for (const name of names) {
    let text = read(name);
    text = text.replace(/v4\.9\.6 pilot implementation gate|v4\.9\.7 infrastructure authorization|v4\.9\.8 deployment contract|v4\.9\.9 identity contract|v5\.0\.0 queue migration|v5\.0\.1 pilot readiness control/g, badges[through]);
    write(name, text);
  }
  const brandName = "brand/brand-board.html";
  let brand = read(brandName);
  brand = brand.replace(/v4\.9\.6 pilot implementation gate|v4\.9\.7 infrastructure authorization|v4\.9\.8 deployment contract|v4\.9\.9 identity contract|v5\.0\.0 queue migration|v5\.0\.1 pilot readiness control/g, badges[through]);
  write(brandName, brand);
}

for (const item of selected) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docEntry(item));
  write(item.href, page(item));
}

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateLegacyCheckers();
updateBadges();

let changelog = read("CHANGELOG.md");
for (const item of selected) {
  if (!changelog.includes(`## ${item.version} ${item.title}`)) changelog = changelogEntry(item) + "\n" + changelog;
}
write("CHANGELOG.md", changelog);

let readme = read("README.md");
for (const item of selected) {
  if (!readme.includes(`## ${item.version} ${item.title}`)) readme = readmeEntry(item) + "\n" + readme;
}
write("README.md", readme);

console.log(`applied-v497-v501-pilot-authorization ${through}`);
