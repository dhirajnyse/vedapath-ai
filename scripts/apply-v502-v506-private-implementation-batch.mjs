import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const versions = ["v5.0.2", "v5.0.3", "v5.0.4", "v5.0.5", "v5.0.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

const sharedRisk = "Private implementation evidence only; no credentials, secret values, reviewer accounts, provider endpoint, durable production migration, external invitation, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.";
const badges = {
  "v5.0.2": "v5.0.2 implementation decision",
  "v5.0.3": "v5.0.3 secret binding plan",
  "v5.0.4": "v5.0.4 reviewer account plan",
  "v5.0.5": "v5.0.5 queue cutover drill",
  "v5.0.6": "v5.0.6 invitation decision"
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
    posture("Credential lock", "Closed", "No secret value or reviewer credential is generated."),
    posture("Provider lock", "Closed", "No external account, runtime, endpoint, or domain is created."),
    posture("Invitation lock", "Closed", "The decision surfaces cannot issue an invitation."),
    posture("Participant lock", "Closed", "No external participant or public session exists."),
    posture("Public launch lock", "Closed", "Private implementation evidence cannot open public launch.")
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
    version: "v5.0.2",
    title: "Private Infrastructure Implementation Decision",
    label: "Implementation",
    href: "privateimplementationdecision.html",
    dataFile: "data/vedapath-private-implementation-decision.json",
    docFile: "docs/PRIVATE_INFRASTRUCTURE_IMPLEMENTATION_DECISION.md",
    moduleFile: "scripts/vedapath-private-implementation-decision.mjs",
    bodyClass: "private-infrastructure-implementation-decision-page",
    phase: 431,
    phaseCopy: "Records a bounded founder implementation decision while deployment stays closed.",
    eyebrow: "Decision before connection",
    headline: "Authorize a private implementation shape. Activate nothing.",
    copy: "A pure evaluator now separates permission to prepare one bounded infrastructure slice from deployment, credentials, write routes, invitations, and launch.",
    changes: "Adds an executable implementation-decision evaluator with nine named checks, a USD 500 monthly cap, named shutdown and incident owners, explicit approve, reject, and pending states, and permanent zero-deployment, zero-credential, zero-write, and zero-invitation outputs.",
    files: ["privateimplementationdecision.html", "data/vedapath-private-implementation-decision.json", "docs/PRIVATE_INFRASTRUCTURE_IMPLEMENTATION_DECISION.md", "scripts/vedapath-private-implementation-decision.mjs"],
    checks: "node --check scripts/vedapath-private-implementation-decision.mjs; incomplete, complete, rejected, over-budget, public-access, invitation, and write-route assertions; batch checker through v5.0.2; static links.",
    data: gateData({
      version: "v5.0.2",
      position: "Implementation permission is narrower than deployment and never implies activation",
      headline: "One bounded decision can be reviewed without creating an account, endpoint, credential, or invitation.",
      copy: "The current record keeps the decision pending until a provider candidate, region, budget, owners, dry-run manifest, private mode, readiness status, and founder authorization are all explicit.",
      postures: [
        posture("Decision evaluator", "Ready", "Nine prerequisites and three unsafe-state checks are deterministic."),
        posture("Founder implementation decision", "Pending", "No real provider or budget decision has been recorded."),
        posture("Deployment", "Closed", "Even complete evidence returns a no-deployment result."),
        posture("External access", "Closed", "Invitations and participants must remain zero.")
      ],
      flow: [
        step("Name", "Record provider candidate, region, budget, and owners."),
        step("Verify", "Confirm readiness, dry-run manifest, and private mode."),
        step("Decide", "Authorize bounded implementation, reject, or remain pending."),
        step("Hold", "Keep deployment, writes, credentials, and invitations closed.")
      ],
      decisions: [
        decision("Evaluator", "Executable", "Complete and unsafe states are covered by tests."),
        decision("Current decision", "Pending", "Real provider inputs are intentionally absent."),
        decision("Maximum monthly cap", "USD 500", "Higher budgets are rejected."),
        decision("Side effects", "0", "Evaluation does not create infrastructure.")
      ],
      metrics: [metric("Required checks", "9"), metric("Budget cap", "$500"), metric("Deployments", "0"), metric("Invitations", "0")],
      packet: "VedaPath Private Infrastructure Implementation Decision\nDecision evaluator: executable\nProvider candidate: pending\nRegion: pending\nBudget cap: USD 500 maximum\nShutdown owner: required\nIncident owner: required\nImplementation authorization: pending\nDeployment activated: false\nCredentials provisioned: false\nWrite routes enabled: false\nInvitations issued: 0\nPublic launch: blocked",
      primaryAction: { href: "managedsecretbindingplan.html", label: "Open Secret Binding Plan" },
      extras: {
        schema: "vedapath.private-implementation-decision.v1",
        evaluator: "scripts/vedapath-private-implementation-decision.mjs",
        required_checks: 9,
        monthly_budget_cap_usd: 500,
        implementation_authorized: false,
        deployment_activated: false,
        credentials_provisioned: false,
        write_routes_enabled: false,
        invitations_issued: 0,
        external_participants: 0,
        public_launch: "blocked",
        next_release: "v5.0.3 Managed Secret Binding Plan"
      }
    })
  },
  {
    version: "v5.0.3",
    title: "Managed Secret Binding Plan",
    label: "Secret Bindings",
    href: "managedsecretbindingplan.html",
    dataFile: "data/vedapath-managed-secret-binding-plan.json",
    docFile: "docs/MANAGED_SECRET_BINDING_PLAN.md",
    moduleFile: "scripts/vedapath-managed-secret-binding.mjs",
    bodyClass: "managed-secret-binding-plan-page",
    phase: 432,
    phaseCopy: "Defines three redacted managed-secret bindings without serializing a value.",
    eyebrow: "References without values",
    headline: "Bind three managed secret names. Expose zero secret values.",
    copy: "A strict validator now allowlists the session, reviewer-store, and queue-integrity bindings with owners, scopes, rotation windows, pilot-only environment, and mandatory redaction.",
    changes: "Adds a managed-secret binding validator for exactly three required names, secret-reference format checks, duplicate detection, scoped owners, ninety-day rotation ceilings, pilot-only environment rules, redacted safe summaries, and permanent no-apply and no-provider side effects.",
    files: ["managedsecretbindingplan.html", "data/vedapath-managed-secret-binding-plan.json", "docs/MANAGED_SECRET_BINDING_PLAN.md", "scripts/vedapath-managed-secret-binding.mjs"],
    checks: "node --check scripts/vedapath-managed-secret-binding.mjs; valid, missing, unknown, value-bearing, duplicate, rotation, environment, and redaction assertions; safe-output inspection; batch checker through v5.0.3; static links.",
    data: gateData({
      version: "v5.0.3",
      position: "A binding plan may name where secrets belong but must never contain their values",
      headline: "The contract shows what a provider must bind while keeping every secret absent from the repository.",
      copy: "Only three managed names are accepted. References are validated, then removed from the founder-safe output so no path or value leaks into the interface.",
      postures: [
        posture("Binding validator", "Ready", "Exactly three allowlisted names and scopes are enforced."),
        posture("Secret references", "Redacted", "Validated references never appear in safe output."),
        posture("Rotation", "Bounded", "Each owner must rotate within ninety days."),
        posture("Provider binding", "Not applied", "The plan has no external side effect.")
      ],
      flow: [
        step("Name", "Use the three approved environment binding names."),
        step("Scope", "Map each name to one narrow runtime purpose."),
        step("Own", "Assign a rotation owner and interval."),
        step("Redact", "Return metadata without reference paths or values.")
      ],
      decisions: [
        decision("Session signing", "Required", "One binding is reserved for private session integrity."),
        decision("Reviewer store", "Required", "One binding protects future reviewer persistence."),
        decision("Queue integrity", "Required", "One binding protects durable event verification."),
        decision("Secret values", "0", "Literal or unknown value-bearing keys are rejected.")
      ],
      metrics: [metric("Required bindings", "3"), metric("Max rotation", "90 days"), metric("Values serialized", "0"), metric("Bindings applied", "0")],
      packet: "VedaPath Managed Secret Binding Plan\nSession signing binding: specified, not applied\nReviewer store binding: specified, not applied\nQueue integrity binding: specified, not applied\nEnvironment: pilot only\nOwners: required\nRotation: 90 days maximum\nReference paths in safe output: 0\nSecret values serialized: 0\nProvider connected: false\nPublic launch: blocked",
      primaryAction: { href: "revieweraccountprovisioningrunbook.html", label: "Open Reviewer Account Plan" },
      extras: {
        schema: "vedapath.managed-secret-binding-plan.v1",
        validator: "scripts/vedapath-managed-secret-binding.mjs",
        required_bindings: 3,
        maximum_rotation_days: 90,
        secret_values_serialized: 0,
        bindings_applied: false,
        provider_connected: false,
        deployment_activated: false,
        invitations_issued: 0,
        public_launch: "blocked",
        next_release: "v5.0.4 Reviewer Account Provisioning Runbook"
      }
    })
  },
  {
    version: "v5.0.4",
    title: "Reviewer Account Provisioning Runbook",
    label: "Reviewer Accounts",
    href: "revieweraccountprovisioningrunbook.html",
    dataFile: "data/vedapath-reviewer-account-provisioning-runbook.json",
    docFile: "docs/REVIEWER_ACCOUNT_PROVISIONING_RUNBOOK.md",
    moduleFile: "scripts/vedapath-reviewer-account-plan.mjs",
    bodyClass: "reviewer-account-provisioning-runbook-page",
    phase: 433,
    phaseCopy: "Plans pseudonymous AAL2 reviewer access without creating an account.",
    eyebrow: "Accounts planned, not created",
    headline: "Plan narrow reviewer roles. Store no direct identity.",
    copy: "A provisioning planner now validates pseudonymous reviewer IDs, four bounded roles, named sponsors, AAL2 assurance, recorded privacy consent, fourteen-day expiry, and a six-reviewer private-pilot ceiling.",
    changes: "Adds a reviewer-account planning module with pseudonymous identifiers, direct-identity rejection, four role capability sets, sponsor and AAL2 requirements, recorded consent, fourteen-day expiry, duplicate checks, a six-reviewer ceiling, and permanent zero-account, zero-credential, and zero-invitation outputs.",
    files: ["revieweraccountprovisioningrunbook.html", "data/vedapath-reviewer-account-provisioning-runbook.json", "docs/REVIEWER_ACCOUNT_PROVISIONING_RUNBOOK.md", "scripts/vedapath-reviewer-account-plan.mjs"],
    checks: "node --check scripts/vedapath-reviewer-account-plan.mjs; valid plan plus direct-identity, unsupported-role, missing-AAL2, missing-consent, expiry, duplicate, and reviewer-limit assertions; batch checker through v5.0.4; static links.",
    data: gateData({
      version: "v5.0.4",
      position: "A reviewer plan is not an account, credential, identity-provider session, or invitation",
      headline: "The runbook defines who may review, for how long, and under whose sponsorship before identity is connected.",
      copy: "Every planned reviewer stays pseudonymous, time-bounded, privately sponsored, consented, and unable to publish, invite, or activate the product.",
      postures: [
        posture("Provisioning planner", "Ready", "Role, assurance, consent, expiry, and identity rules are executable."),
        posture("Direct identity", "Forbidden", "Email, name, phone, address, password, and token fields are rejected."),
        posture("Pilot scale", "Six maximum", "The runbook cannot silently expand the reviewer cohort."),
        posture("Accounts", "Not created", "The planner returns no credential or live identity.")
      ],
      flow: [
        step("Pseudonymize", "Assign a non-identifying reviewer ID."),
        step("Sponsor", "Name one accountable private-pilot owner."),
        step("Constrain", "Choose a bounded role, AAL2, consent, and expiry."),
        step("Provision later", "Create nothing until a reviewed identity provider exists.")
      ],
      decisions: [
        decision("Roles", "4 bounded", "Observer, source, rights, and release review remain separate."),
        decision("Session assurance", "AAL2 required", "Lower assurance is rejected."),
        decision("Maximum lifetime", "14 days", "Long-lived reviewer plans are refused."),
        decision("Created accounts", "0", "This release is a runbook and validator only.")
      ],
      metrics: [metric("Role types", "4"), metric("Reviewer ceiling", "6"), metric("Accounts created", "0"), metric("Invitations", "0")],
      packet: "VedaPath Reviewer Account Provisioning Runbook\nReviewer identifiers: pseudonymous only\nRole types: 4\nPrivate-pilot reviewer ceiling: 6\nSponsor: required\nAAL2: required\nPrivacy consent: recorded before provisioning\nMaximum lifetime: 14 days\nDirect identity stored: false\nAccounts created: 0\nCredentials issued: 0\nInvitations issued: 0\nPublic launch: blocked",
      primaryAction: { href: "durablequeuecutoverdrill.html", label: "Open Queue Cutover Drill" },
      extras: {
        schema: "vedapath.reviewer-account-provisioning-runbook.v1",
        planner: "scripts/vedapath-reviewer-account-plan.mjs",
        role_types: 4,
        private_reviewer_limit: 6,
        maximum_lifetime_days: 14,
        direct_identity_stored: false,
        accounts_created: 0,
        credentials_issued: 0,
        invitations_issued: 0,
        identity_provider_connected: false,
        public_launch: "blocked",
        next_release: "v5.0.5 Durable Queue Cutover Drill"
      }
    })
  },
  {
    version: "v5.0.5",
    title: "Durable Queue Cutover Drill",
    label: "Queue Cutover",
    href: "durablequeuecutoverdrill.html",
    dataFile: "data/vedapath-durable-queue-cutover-drill.json",
    docFile: "docs/DURABLE_QUEUE_CUTOVER_DRILL.md",
    moduleFile: "scripts/vedapath-queue-cutover-drill.mjs",
    bodyClass: "durable-queue-cutover-drill-page",
    phase: 434,
    phaseCopy: "Verifies deterministic queue snapshots and rollback without production migration.",
    eyebrow: "A rehearsal with no migration",
    headline: "Replay the queue. Compare every record. Roll back on one mismatch.",
    copy: "A cutover drill now turns the tamper-evident queue ledger into a canonical snapshot, compares source and target digests, checks the expected head hash, and fails closed before any provider write.",
    changes: "Adds deterministic queue snapshot creation, canonical SHA-256 record and snapshot digests, target divergence detection, checkpoint mismatch detection, tampered-source rejection, rollback signaling, and permanent no-provider, no-production-migration, and no-write outputs.",
    files: ["durablequeuecutoverdrill.html", "data/vedapath-durable-queue-cutover-drill.json", "docs/DURABLE_QUEUE_CUTOVER_DRILL.md", "scripts/vedapath-queue-cutover-drill.mjs"],
    checks: "node --check scripts/vedapath-queue-cutover-drill.mjs; passing drill, deterministic snapshot, target divergence, checkpoint mismatch, and tampered-source assertions; production-migration and write locks; batch checker through v5.0.5; static links.",
    data: gateData({
      version: "v5.0.5",
      position: "A passing replay proves the cutover method, not a provider migration",
      headline: "The drill can prove record parity and checkpoint integrity while durable production storage remains disconnected.",
      copy: "One mismatch forces rollback. A passing result still reports no migration, no provider connection, no queue writes, and no publication.",
      postures: [
        posture("Source ledger", "Verified", "Hash-chain integrity is checked before snapshotting."),
        posture("Snapshot", "Deterministic", "Canonical record ordering produces stable SHA-256 digests."),
        posture("Parity", "Fail closed", "Any record or checkpoint mismatch requires rollback."),
        posture("Production migration", "Not run", "The drill performs no durable write.")
      ],
      flow: [
        step("Verify", "Reject a tampered source event ledger."),
        step("Snapshot", "Canonicalize records and hash the checkpoint."),
        step("Compare", "Match target records and expected head hash."),
        step("Rollback", "Stop the drill on any divergence.")
      ],
      decisions: [
        decision("Snapshot contract", "Executable", "Record and snapshot digests are deterministic."),
        decision("Divergence handling", "Rollback", "The first mismatch fails the drill."),
        decision("Durable provider", "Disconnected", "No production service is attached."),
        decision("Queue writes", "0", "The drill cannot mutate production state.")
      ],
      metrics: [metric("Digest algorithm", "SHA-256"), metric("Mismatch tolerance", "0"), metric("Migrations", "0"), metric("Writes", "0")],
      packet: "VedaPath Durable Queue Cutover Drill\nSource ledger verification: executable\nCanonical snapshot: executable\nRecord digest: SHA-256\nCheckpoint comparison: required\nTarget divergence tolerance: 0\nRollback on mismatch: required\nDurable provider connected: false\nProduction migration run: false\nQueue writes enabled: false\nPublication: blocked\nPublic launch: blocked",
      primaryAction: { href: "invitationactivationdecisiongate.html", label: "Open Invitation Decision" },
      extras: {
        schema: "vedapath.durable-queue-cutover-drill.v1",
        drill: "scripts/vedapath-queue-cutover-drill.mjs",
        digest_algorithm: "sha256",
        divergence_tolerance: 0,
        rollback_on_mismatch: true,
        durable_provider_connected: false,
        production_migration_run: false,
        queue_writes_enabled: false,
        publication: "blocked",
        invitations_issued: 0,
        public_launch: "blocked",
        next_release: "v5.0.6 Invitation Activation Decision Gate"
      }
    })
  },
  {
    version: "v5.0.6",
    title: "Invitation Activation Decision Gate",
    label: "Invitation Decision",
    href: "invitationactivationdecisiongate.html",
    dataFile: "data/vedapath-invitation-activation-decision-gate.json",
    docFile: "docs/INVITATION_ACTIVATION_DECISION_GATE.md",
    moduleFile: "scripts/vedapath-invitation-activation-gate.mjs",
    bodyClass: "invitation-activation-decision-gate-page",
    phase: 435,
    phaseCopy: "Requires twelve live-stack proofs before one private invitation can be authorized but not issued.",
    eyebrow: "One invitation, separately decided",
    headline: "Require twelve live proofs. Authorize at most one invitation. Issue none here.",
    copy: "A final decision evaluator now keeps implementation, provider binding, reviewer accounts, durable queue, private health, security, privacy, rights, recovery, shutdown, telemetry consent, and founder activation evidence separate and visible.",
    changes: "Adds a twelve-evidence invitation activation evaluator, explicit one-invitation maximum, live-stack security, privacy, rights, recovery, shutdown, and telemetry consent checks, public-access, existing-invitation, participant, and write-route blockers, and a permanent no-issuance output.",
    files: ["invitationactivationdecisiongate.html", "data/vedapath-invitation-activation-decision-gate.json", "docs/INVITATION_ACTIVATION_DECISION_GATE.md", "scripts/vedapath-invitation-activation-gate.mjs", "scripts/apply-v502-v506-private-implementation-batch.mjs", "scripts/check-v502-v506-private-implementation.mjs", "scripts/check-v477-v481-integrated-source-path.mjs", "scripts/check-v482-v486-private-demo-hardening.mjs", "scripts/check-v487-v491-hosted-pilot-foundation.mjs", "scripts/check-v492-v496-pilot-implementation-foundation.mjs", "scripts/check-v497-v501-pilot-authorization.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md", "shared command-shell release badges across prior governance pages"],
    checks: "node --check scripts/vedapath-invitation-activation-gate.mjs; incomplete and complete hypothetical evidence, public-access, existing-invitation, participant, and unapproved-write assertions; permanent no-issuance and public-launch locks; full batch checker; prior regressions; static links; desktop and mobile visual QA.",
    data: gateData({
      version: "v5.0.6",
      position: "Implementation readiness, live-stack evidence, authorization, and invitation issuance remain four separate events",
      headline: "The current gate is blocked because no live provider stack exists. Even complete evidence would authorize one invitation without issuing it.",
      copy: "This is the strongest boundary in the private-pilot chain: twelve real-stack proofs, zero existing invitations, zero participants, private access, and one approved review-event route are required before a separate issuance step could begin.",
      postures: [
        posture("Evidence evaluator", "Ready", "Twelve required live-stack states are deterministic."),
        posture("Current evidence", "0/12", "No provider, live accounts, endpoint, or audits are connected."),
        posture("Maximum authorization", "One invitation", "The evaluator cannot authorize a wider cohort."),
        posture("Invitation issuance", "Not performed", "Authorization never creates a token or participant.")
      ],
      flow: [
        step("Connect", "Implement the approved private stack under named owners."),
        step("Prove", "Complete security, privacy, rights, recovery, shutdown, and consent evidence."),
        step("Decide", "Record a founder decision for one invitation only."),
        step("Issue later", "Use a separate audited step if every proof still holds.")
      ],
      decisions: [
        decision("Current activation", "Blocked", "All twelve live-stack checks remain incomplete."),
        decision("Hypothetical maximum", "1", "Complete evidence can authorize only one invitation."),
        decision("Invitations issued", "0", "This evaluator has no issuance side effect."),
        decision("Public launch", "Blocked", "A private invitation cannot open public access.")
      ],
      metrics: [metric("Live proofs required", "12"), metric("Current proofs", "0"), metric("Invitations issued", "0"), metric("Public access", "Closed")],
      packet: "VedaPath Invitation Activation Decision Gate\nImplementation decision: pending real execution\nManaged secret bindings: not live\nReviewer accounts: not live\nDurable queue cutover: not live\nPrivate endpoint: absent\nSecurity, privacy, rights reviews: pending live stack\nRecovery and shutdown drills: pending live stack\nTelemetry consent: pending\nFounder activation decision: pending\nCurrent evidence: 0/12\nSingle invitation authorized: false\nInvitation issued: false\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "build-status.html", label: "Open Build Status" },
      extras: {
        schema: "vedapath.invitation-activation-decision-gate.v1",
        evaluator: "scripts/vedapath-invitation-activation-gate.mjs",
        required_live_evidence: 12,
        completed_live_evidence: 0,
        single_invitation_authorized: false,
        maximum_invitations: 1,
        invitation_issued: false,
        external_participants: 0,
        public_access: false,
        public_launch: "blocked",
        next_release: "v5.0.7 Private Invitation Issuance Dry Run"
      }
    })
  }
];

const selected = releases.slice(0, throughIndex + 1);
const current = selected.at(-1);
const next = releases[throughIndex + 1] || {
  version: "v5.0.7",
  title: "Private Invitation Issuance Dry Run",
  copy: "Design the auditable issuance receipt and revocation path without creating a token or inviting a participant."
};

function page(item) {
  const previousLinks = [
    ["Authorization", "pilotinfrastructureauthorization.html"],
    ["Manifest", "deploymentmanifestcontract.html"],
    ["Identity Contract", "revieweridentityprovidercontract.html"],
    ["Queue Migration", "durablequeuemigrationpack.html"],
    ["Readiness Control", "privatepilotreadinesscontrolroom.html"]
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
  <script src="assets/vedapath-retrieval-pilot.js?v=506-private-implementation"></script>
</body>
</html>
`;
}

function docEntry(item) {
  return [
    `# ${item.version} ${item.title}`,
    "",
    "## Purpose",
    "",
    item.copy,
    "",
    "## What Changed",
    "",
    item.changes,
    "",
    "## Files Changed",
    "",
    ...item.files.map((name) => `- \`${name}\``),
    "",
    "## Acceptance Checks",
    "",
    item.checks,
    "",
    "## Known Risks",
    "",
    sharedRisk,
    "",
    "## Founder Packet",
    "",
    item.data.packet,
    ""
  ].join("\n");
}

function changelogEntry(item) {
  return [
    `## ${item.version} ${item.title}`,
    "",
    `- Changes made: ${item.changes}`,
    `- Files changed: ${item.files.map((name) => `\`${name}\``).join(", ")}.`,
    `- Checks run: ${item.checks}`,
    `- Known risks: ${sharedRisk}`,
    ""
  ].join("\n");
}

function readmeEntry(item) {
  return [
    `## ${item.version} ${item.title}`,
    "",
    item.copy,
    "",
    `- Open: [${item.title}](${item.href})`,
    `- Data: \`${item.dataFile}\``,
    `- Boundary: ${sharedRisk}`,
    ""
  ].join("\n");
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${badges[through]}";`);
  text = text.replace(/^    \{ title: "Private Implementation", labels: \[[^\n]+\n/gm, "");
  const group = `    { title: "Private Implementation", labels: [${selected.map((item) => `"${item.label}"`).join(", ")}] },`;
  text = text.replace(
    '    { title: "Pilot Authorization", labels: ["Authorization", "Manifest", "Identity Contract", "Queue Migration", "Readiness Control"] },',
    '    { title: "Pilot Authorization", labels: ["Authorization", "Manifest", "Identity Contract", "Queue Migration", "Readiness Control"] },\n' + group
  );

  for (const item of releases) {
    const escapedLabel = item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedBody = item.bodyClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`^    "${escapedLabel}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    "${escapedBody}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    \\["${escapedLabel}", "[^"]+"\\],?\\r?\\n`, "gm"), "");
  }

  const titleLines = selected.map((item, index) => `    "${item.label}": "${item.title}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    "Readiness Control": "Private Pilot Readiness Control Room"', '    "Readiness Control": "Private Pilot Readiness Control Room",\n' + titleLines);
  const bodyLines = selected.map((item, index) => `    "${item.bodyClass}": "${item.title}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    "private-pilot-readiness-control-room-page": "Private Pilot Readiness Control Room"', '    "private-pilot-readiness-control-room-page": "Private Pilot Readiness Control Room",\n' + bodyLines);
  const linkLines = selected.map((item, index) => `    ["${item.label}", "${item.href}"]${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('    ["Readiness Control", "privatepilotreadinesscontrolroom.html"]', '    ["Readiness Control", "privatepilotreadinesscontrolroom.html"],\n' + linkLines);
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const item of releases) {
    text = text.replace(new RegExp(`^  "${item.href}",?\\r?\\n`, "gm"), "");
  }
  const lines = selected.map((item, index) => `  "${item.href}"${index === selected.length - 1 ? "" : ","}`).join("\n");
  text = text.replace('  "privatepilotreadinesscontrolroom.html",', '  "privatepilotreadinesscontrolroom.html",\n' + lines + ',');
  write("scripts/check-static-links.mjs", text);
}

function phaseMarkup() {
  return selected.map((item) => `            <article class="phase">
              <span class="badge active">Active</span>
              <div>
                <strong>Phase ${item.phase}: ${item.title}</strong>
                <p>${item.phaseCopy}</p>
              </div>
              <div class="percent">100%</div>
            </article>`).join("\n");
}

function updateBuildStatus() {
  let text = read("build-status.html");
  const badgePattern = /v5\.0\.1 pilot readiness control|v5\.0\.2 implementation decision|v5\.0\.3 secret binding plan|v5\.0\.4 reviewer account plan|v5\.0\.5 queue cutover drill|v5\.0\.6 invitation decision/g;
  text = text.replace(badgePattern, badges[through]);
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${current.version}$2${current.copy}$3`);
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${next.version} ${next.title}$2${next.copy}$3`);
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${current.version} ${current.title}</strong></div>`);
  const previous = throughIndex === 0 ? "v5.0.1 Private Pilot Readiness Control Room" : `${releases[throughIndex - 1].version} ${releases[throughIndex - 1].title}`;
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previous}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Turn a reviewed private implementation decision into testable operational evidence while preserving every deployment, identity, invitation, and public-launch boundary.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Private implementation evidence complete; provider deployment, invitations, and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Review the five private-implementation contracts as one founder evidence packet.</span></li>\n            <li><span class="dot"></span><span>Select a provider, region, owner, and budget only through a separate real-world decision.</span></li>\n            <li><span class="dot"></span><span>Run the secret, identity, queue, security, privacy, rights, recovery, and shutdown checks against the live private stack.</span></li>\n            <li><span class="dot"></span><span>Design a separate invitation issuance dry run; keep tokens, participants, and public access at zero.</span></li>\n          </ul>');

  const marker = /\s*<!-- V502-V506 PHASES START -->[\s\S]*?<!-- V502-V506 PHASES END -->\s*/;
  text = text.replace(marker, "\n");
  const block = `            <!-- V502-V506 PHASES START -->\n${phaseMarkup()}\n            <!-- V502-V506 PHASES END -->\n`;
  text = text.replace("            <!-- V410-V414 PHASES END -->", block + "            <!-- V410-V414 PHASES END -->");
  write("build-status.html", text);
}

function updateLegacyChecker() {
  const name = "scripts/check-v497-v501-pilot-authorization.mjs";
  let text = read(name);
  text = text.replace('assert(shell.includes(`const releaseBadge = "${badges[through]}";`), "current release badge");', 'assert(/const releaseBadge = "v5\\.0\\.[1-6] [^"]+";/.test(shell), "compatible release badge");');
  text = text.replace('assert(text("build-status.html").includes(`<strong>${through}</strong>`), "build status current version");', 'assert(/<strong>v5\\.0\\.[1-6]<\\/strong>/.test(text("build-status.html")), "build status compatible version");');
  text = text.replace('assert(/provider deployment, invitations, and public launch remain blocked/i.test(text("build-status.html")), "honest build status boundary");', 'assert(/provider deployment, invitations, and public launch remain blocked/i.test(text("build-status.html")), "honest build status boundary");');
  write(name, text);
}

function updateBadges() {
  const names = readdirSync(root).filter((entry) => entry.endsWith(".html"));
  const badgePattern = /v5\.0\.1 pilot readiness control|v5\.0\.2 implementation decision|v5\.0\.3 secret binding plan|v5\.0\.4 reviewer account plan|v5\.0\.5 queue cutover drill|v5\.0\.6 invitation decision/g;
  for (const name of names) {
    let text = read(name);
    text = text.replace(badgePattern, badges[through]);
    write(name, text);
  }
  const brandName = "brand/brand-board.html";
  let brand = read(brandName);
  brand = brand.replace(badgePattern, badges[through]);
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
updateLegacyChecker();
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

console.log(`applied-v502-v506-private-implementation ${through}`);
