import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const versions = ["v5.0.7", "v5.0.8", "v5.0.9", "v5.1.0", "v5.1.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

const sharedRisk = "Private-pilot validation evidence only; no credentials, direct identity, token, account, email, delivery, live invitation, real participant, external notification, provider mutation, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.";
const badges = {
  "v5.0.7": "v5.0.7 invite dry run",
  "v5.0.8": "v5.0.8 revocation proof",
  "v5.0.9": "v5.0.9 session sandbox",
  "v5.1.0": "v5.1.0 incident drill",
  "v5.1.1": "v5.1.1 pilot decision"
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
    posture("Identity lock", "Closed", "Only pseudonymous identifiers are accepted; direct identity is rejected."),
    posture("Invitation lock", "Closed", "No token, email, delivery, or live invitation is created."),
    posture("Participant lock", "Closed", "No participant account or real session exists."),
    posture("Provider lock", "Closed", "No external provider, notification, or durable participant write is touched."),
    posture("Public launch lock", "Closed", "Private validation cannot open public access.")
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
    version: "v5.0.7",
    title: "Private Invitation Issuance Dry Run",
    label: "Invite Dry Run",
    href: "privateinvitationdryrun.html",
    dataFile: "data/vedapath-private-invitation-dry-run.json",
    docFile: "docs/PRIVATE_INVITATION_ISSUANCE_DRY_RUN.md",
    moduleFile: "scripts/vedapath-private-invitation-dry-run.mjs",
    bodyClass: "private-invitation-dry-run-page",
    phase: 436,
    phaseCopy: "Creates a deterministic, pseudonymous invitation request digest while issuing nothing.",
    eyebrow: "Rehearse issuance without issuing",
    headline: "Validate one invitation request. Create no token. Contact no person.",
    copy: "A deterministic dry-run contract now proves the exact participant role, purpose, consent, expiry, founder owner, and zero-delivery boundary before any real invitation system is considered.",
    changes: "Adds a pure private-invitation dry-run evaluator with pseudonymous identifiers, direct-identity rejection, seventy-two-hour expiry, bounded role and purpose, consent and founder ownership checks, deterministic request digest, and permanent zero-token, zero-account, zero-email, zero-delivery, and zero-invitation outputs.",
    files: ["privateinvitationdryrun.html", "data/vedapath-private-invitation-dry-run.json", "docs/PRIVATE_INVITATION_ISSUANCE_DRY_RUN.md", "scripts/vedapath-private-invitation-dry-run.mjs", "scripts/apply-v507-v511-private-pilot-validation-batch.mjs", "scripts/check-v507-v511-private-pilot-validation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md", "historical compatibility checkers"],
    checks: "node --check scripts/vedapath-private-invitation-dry-run.mjs; valid, incomplete, direct-identity, token, email, delivery, expiry, public-access, existing-invitation, and participant assertions; batch checker through v5.0.7; static links.",
    data: gateData({
      version: "v5.0.7",
      position: "An authorization decision is not an invitation, and a dry run must have no delivery side effect",
      headline: "The request can be validated and hashed while identity, credentials, delivery, and participant access remain absent.",
      copy: "Only a pseudonymous participant, private learner role, bounded source-first purpose, recorded consent, named founder owner, no delivery channel, and a maximum seventy-two-hour window are accepted.",
      postures: [
        posture("Dry-run evaluator", "Ready", "Safe and unsafe request shapes are deterministic."),
        posture("Current invitation", "None", "The repository holds no live invitation."),
        posture("Direct identity", "Forbidden", "Email, name, and phone fields are rejected."),
        posture("Delivery", "Disabled", "No channel, token, account, or message is created.")
      ],
      flow: [step("Authorize", "Start from the bounded v5.0.6 decision."), step("Describe", "Use pseudonymous identity, purpose, consent, owner, and expiry."), step("Digest", "Create a deterministic founder-reviewable request hash."), step("Hold", "Issue nothing and contact nobody.")],
      decisions: [decision("Request contract", "Deterministic", "The dry-run evaluator is covered by safe and unsafe fixtures."), decision("Maximum scope", "1", "Only one bounded invitation request is modeled."), decision("Delivery attempts", "0", "The contract has no delivery path."), decision("Invitation issued", "No", "Issuance remains a separate real-world decision.")],
      metrics: [metric("Maximum requests", "1"), metric("Direct identity fields", "0"), metric("Tokens", "0"), metric("Invitations", "0")],
      packet: "VedaPath Private Invitation Issuance Dry Run\nActivation decision: required\nPseudonymous participant: required\nRole: private learner\nPurpose: source-first private pilot\nConsent: recorded\nMaximum expiry: 72 hours\nDelivery channel: none\nToken created: false\nAccount created: false\nEmail sent: false\nInvitation issued: false\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "invitationrevocationreceipt.html", label: "Open Revocation Receipt" },
      extras: { schema: "vedapath.private-invitation-dry-run.v1", evaluator: "scripts/vedapath-private-invitation-dry-run.mjs", maximum_invitations: 1, direct_identity_fields: 0, token_created: false, account_created: false, email_sent: false, invitation_issued: false, external_participants: 0, public_launch: "blocked", next_release: "v5.0.8 Invitation Revocation Receipt Contract" }
    })
  },
  {
    version: "v5.0.8",
    title: "Invitation Revocation Receipt Contract",
    label: "Revocation",
    href: "invitationrevocationreceipt.html",
    dataFile: "data/vedapath-invitation-revocation-receipt.json",
    docFile: "docs/INVITATION_REVOCATION_RECEIPT_CONTRACT.md",
    moduleFile: "scripts/vedapath-invitation-revocation-receipt.mjs",
    bodyClass: "invitation-revocation-receipt-page",
    phase: 437,
    phaseCopy: "Proves a dry-run request can be cancelled with a traceable receipt before use.",
    eyebrow: "Cancel before contact",
    headline: "Bind cancellation to the request digest. Revoke no live token because none exists.",
    copy: "A deterministic receipt now links one dry-run request to an allowlisted reason, named owner, ordered timeline, and immutable digest without mutating a provider or notifying a participant.",
    changes: "Adds a deterministic invitation-revocation receipt evaluator tied to the dry-run digest, allowlisted cancellation reasons, named owner and ordered timeline checks, receipt hashing, and explicit rejection of issued, tokenized, in-use, public, or participant-bearing states.",
    files: ["invitationrevocationreceipt.html", "data/vedapath-invitation-revocation-receipt.json", "docs/INVITATION_REVOCATION_RECEIPT_CONTRACT.md", "scripts/vedapath-invitation-revocation-receipt.mjs", "scripts/apply-v507-v511-private-pilot-validation-batch.mjs", "scripts/check-v507-v511-private-pilot-validation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-invitation-revocation-receipt.mjs; valid, digest, reason, owner, timeline, issued, token, in-use, participant, and public-access assertions; batch checker through v5.0.8; static links.",
    data: gateData({
      version: "v5.0.8",
      position: "A cancellation proof must exist before a real invitation path can be trusted",
      headline: "The dry-run request receives an immutable cancellation receipt while every live system remains untouched.",
      copy: "The receipt proves which request would be cancelled, why, by whom, and when. Since no invitation or token exists, the output records no provider mutation and no participant notification.",
      postures: [posture("Receipt evaluator", "Ready", "Safe and unsafe cancellation fixtures are covered."), posture("Dry-run linkage", "Digest bound", "The receipt requires a valid sixty-four-character request digest."), posture("Live token", "Absent", "Tokenized or in-use states are rejected."), posture("Provider mutation", "None", "No external revocation call is performed.")],
      flow: [step("Reference", "Use the validated invitation request digest."), step("Reason", "Choose an allowlisted cancellation cause."), step("Sign", "Record a named owner and ordered timestamp."), step("Verify", "Hash the receipt and preserve zero side effects.")],
      decisions: [decision("Receipt contract", "Deterministic", "The result is deterministic and traceable."), decision("Allowed reasons", "4", "Consent, founder, readiness, and security reasons are explicit."), decision("Provider calls", "0", "No live invitation exists to revoke."), decision("Notifications", "0", "No participant is contacted.")],
      metrics: [metric("Receipt digest", "SHA-256"), metric("Allowed reasons", "4"), metric("Provider mutations", "0"), metric("Notifications", "0")],
      packet: "VedaPath Invitation Revocation Receipt Contract\nDry-run request digest: required\nCancellation reason: allowlisted\nRevocation owner: required\nTimeline: ordered\nLive invitation: absent\nLive token: absent\nInvitation in use: false\nProvider mutation: false\nNotification sent: false\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "firstparticipantsessionsandbox.html", label: "Open Session Sandbox" },
      extras: { schema: "vedapath.invitation-revocation-receipt.v1", evaluator: "scripts/vedapath-invitation-revocation-receipt.mjs", receipt_digest: "deterministic-sha-256", invitation_revoked: false, token_revoked: false, provider_mutation: false, notification_sent: false, external_participants: 0, public_launch: "blocked", next_release: "v5.0.9 First Participant Session Sandbox" }
    })
  },
  {
    version: "v5.0.9",
    title: "First Participant Session Sandbox",
    label: "Session Sandbox",
    href: "firstparticipantsessionsandbox.html",
    dataFile: "data/vedapath-first-participant-session-sandbox.json",
    docFile: "docs/FIRST_PARTICIPANT_SESSION_SANDBOX.md",
    moduleFile: "scripts/vedapath-first-participant-session-sandbox.mjs",
    bodyClass: "first-participant-session-sandbox-page",
    phase: 438,
    phaseCopy: "Simulates one consented, pseudonymous, read-only session with no real participant.",
    eyebrow: "Practice the first session privately",
    headline: "Run one ordered session transcript. Create no participant. Send no network request.",
    copy: "A thirty-minute maximum sandbox now rehearses arrival, source reading, local reflection, and exit with pseudonymous consent, strict event fields, read-only mode, no live model, no persistence, and no external participant.",
    changes: "Adds a deterministic first-session sandbox with pseudonymous participant and consent checks, thirty-minute duration limit, four-event order and field allowlist, read-only and local-only requirements, direct-identity rejection, transcript hashing, and permanent zero-network, zero-durable-write, zero-participant, and zero-real-session outputs.",
    files: ["firstparticipantsessionsandbox.html", "data/vedapath-first-participant-session-sandbox.json", "docs/FIRST_PARTICIPANT_SESSION_SANDBOX.md", "scripts/vedapath-first-participant-session-sandbox.mjs", "scripts/apply-v507-v511-private-pilot-validation-batch.mjs", "scripts/check-v507-v511-private-pilot-validation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-first-participant-session-sandbox.mjs; valid, consent, identity, duration, event order, event field, read-only, local-only, network, persistence, live-model, write-route, participant, and public-access assertions; batch checker through v5.0.9; static links.",
    data: gateData({
      version: "v5.0.9",
      position: "A session rehearsal is not a participant session and must remain local, read-only, and identity-free",
      headline: "Four ordered events prove the session shape while accounts, networks, persistence, and real participation stay absent.",
      copy: "The sandbox accepts only arrival, source open, local reflection, and exit events. It hashes the transcript, then reports that no invitation, participant, network request, durable write, or live session occurred.",
      postures: [posture("Session evaluator", "Ready", "Safe and unsafe transcript fixtures are covered."), posture("Duration", "30 minutes max", "Longer sessions are rejected."), posture("Data mode", "Local and read-only", "Network, persistence, and write routes are disabled."), posture("Real participant", "None", "The transcript is a rehearsal only.")],
      flow: [step("Arrive", "Use a pseudonymous identifier and recorded sandbox consent."), step("Read", "Open one allowlisted source in read-only mode."), step("Reflect", "Record only a local reflection length, never the text."), step("Exit", "Close within thirty minutes and hash the transcript.")],
      decisions: [decision("Transcript contract", "Deterministic", "Four events and their order are enforced."), decision("Maximum duration", "30 minutes", "The rehearsal cannot become an open session."), decision("Network requests", "0", "The sandbox is local-only."), decision("Real sessions", "0", "No participant account or invitation exists.")],
      metrics: [metric("Allowed events", "4"), metric("Maximum minutes", "30"), metric("Network requests", "0"), metric("Participants", "0")],
      packet: "VedaPath First Participant Session Sandbox\nPseudonymous participant: required\nSandbox consent: recorded\nMaximum duration: 30 minutes\nMode: read-only and local-only\nAllowed events: 4\nLive model: disabled\nNetwork requests: 0\nDurable writes: 0\nParticipant created: false\nInvitation issued: false\nReal session started: false\nPublic launch: blocked",
      primaryAction: { href: "pilotincidentdrill.html", label: "Open Incident Drill" },
      extras: { schema: "vedapath.first-participant-session-sandbox.v1", evaluator: "scripts/vedapath-first-participant-session-sandbox.mjs", allowed_events: 4, maximum_minutes: 30, network_requests: 0, durable_writes: 0, participant_created: false, session_started: false, external_participants: 0, public_launch: "blocked", next_release: "v5.1.0 Pilot Incident Drill" }
    })
  },
  {
    version: "v5.1.0",
    title: "Pilot Incident Drill",
    label: "Incident Drill",
    href: "pilotincidentdrill.html",
    dataFile: "data/vedapath-pilot-incident-drill.json",
    docFile: "docs/PILOT_INCIDENT_DRILL.md",
    moduleFile: "scripts/vedapath-pilot-incident-drill.mjs",
    bodyClass: "pilot-incident-drill-page",
    phase: 439,
    phaseCopy: "Rehearses detection, containment, shutdown, and recovery against a sandbox-only incident.",
    eyebrow: "Prove the stop path",
    headline: "Detect in the sandbox. Contain in fifteen minutes. Recover without touching a provider.",
    copy: "A four-stage incident drill now enforces named incident and privacy owners, ordered timestamps, fifteen-minute containment, thirty-minute shutdown, sixty-minute recovery, and zero live notifications, mutations, writes, participants, or incidents.",
    changes: "Adds a deterministic pilot-incident drill with four allowlisted incident classes, named incident and privacy owners, ordered detection, containment, shutdown, and recovery timeline, response-time ceilings, evidence digest, and permanent no-live-incident, no-notification, no-provider-mutation, no-write, and no-participant outputs.",
    files: ["pilotincidentdrill.html", "data/vedapath-pilot-incident-drill.json", "docs/PILOT_INCIDENT_DRILL.md", "scripts/vedapath-pilot-incident-drill.mjs", "scripts/apply-v507-v511-private-pilot-validation-batch.mjs", "scripts/check-v507-v511-private-pilot-validation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-pilot-incident-drill.mjs; valid, incident type, severity, owner, timeline, containment, shutdown, recovery, live-incident, notification, provider-mutation, durable-write, participant, and public-access assertions; batch checker through v5.1.0; static links.",
    data: gateData({
      version: "v5.1.0",
      position: "Private-pilot readiness requires a tested stop path before it requires a start path",
      headline: "The sandbox incident is detected, contained, shut down, and recovered within explicit clocks and with zero external effect.",
      copy: "Privacy, consent, rights, and session-boundary drill classes are allowlisted. A valid result needs two named owners and an ordered response timeline, then creates only a deterministic evidence digest.",
      postures: [posture("Incident evaluator", "Ready", "Safe and unsafe timeline fixtures are covered."), posture("Containment", "15 minutes max", "Slow containment fails the drill."), posture("Shutdown", "30 minutes max", "The simulated surface must close quickly."), posture("Recovery", "60 minutes max", "Recovery proof cannot mutate a live provider.")],
      flow: [step("Detect", "Identify one sandbox-only incident class."), step("Contain", "Record containment within fifteen minutes."), step("Shut down", "Close the simulated session within thirty minutes."), step("Recover", "Complete evidence within sixty minutes without external effects.")],
      decisions: [decision("Incident runbook", "Deterministic", "Timeline and owner rules are deterministic."), decision("Incident classes", "4", "Consent, privacy, rights, and session boundaries are covered."), decision("External notifications", "0", "No live party is contacted."), decision("Provider mutations", "0", "The drill remains repository-local.")],
      metrics: [metric("Containment SLA", "15 min"), metric("Shutdown SLA", "30 min"), metric("Recovery SLA", "60 min"), metric("Live incidents", "0")],
      packet: "VedaPath Pilot Incident Drill\nSandbox evidence: required\nIncident class: allowlisted\nIncident owner: required\nPrivacy owner: required\nContainment: within 15 minutes\nShutdown: within 30 minutes\nRecovery: within 60 minutes\nLive incident: false\nExternal notifications: 0\nProvider mutations: 0\nDurable writes: 0\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "founderprivatepilotdecision.html", label: "Open Founder Decision" },
      extras: { schema: "vedapath.pilot-incident-drill.v1", evaluator: "scripts/vedapath-pilot-incident-drill.mjs", incident_classes: 4, containment_sla_minutes: 15, shutdown_sla_minutes: 30, recovery_sla_minutes: 60, live_incidents: 0, external_notifications: 0, provider_mutations: 0, external_participants: 0, public_launch: "blocked", next_release: "v5.1.1 Founder Private Pilot Go/No-Go" }
    })
  },
  {
    version: "v5.1.1",
    title: "Founder Private Pilot Go/No-Go",
    label: "Pilot Decision",
    href: "founderprivatepilotdecision.html",
    dataFile: "data/vedapath-founder-private-pilot-decision.json",
    docFile: "docs/FOUNDER_PRIVATE_PILOT_GO_NO_GO.md",
    moduleFile: "scripts/vedapath-founder-private-pilot-decision.mjs",
    bodyClass: "founder-private-pilot-decision-page",
    phase: 440,
    phaseCopy: "Combines invitation, revocation, session, and incident evidence into one bounded founder decision.",
    eyebrow: "One decision, still no execution",
    headline: "Review five proofs. Authorize at most one private session. Start nothing here.",
    copy: "A final founder evaluator now requires the invitation decision, issuance dry run, revocation receipt, first-session sandbox, incident drill, named pilot and shutdown owners, one-participant and one-session limits, and seventy-two-hour expiry before a bounded no-execution decision can pass.",
    changes: "Adds a founder private-pilot go/no-go evaluator that aggregates five exact evidence states, named pilot and shutdown owners, one-participant and one-session ceilings, seventy-two-hour authorization expiry, approve, reject, and blocked outcomes, write-route restriction, and permanent zero-invitation, zero-session, zero-participant, zero-credential, and public-launch locks.",
    files: ["founderprivatepilotdecision.html", "data/vedapath-founder-private-pilot-decision.json", "docs/FOUNDER_PRIVATE_PILOT_GO_NO_GO.md", "scripts/vedapath-founder-private-pilot-decision.mjs", "scripts/apply-v507-v511-private-pilot-validation-batch.mjs", "scripts/check-v507-v511-private-pilot-validation.mjs", "assets/vedapath-command-shell.js", "scripts/check-static-links.mjs", "build-status.html", "README.md", "CHANGELOG.md"],
    checks: "node --check scripts/vedapath-founder-private-pilot-decision.mjs; incomplete, complete, rejected, owner, participant limit, session limit, expiry, invitation, session, participant, public-access, and write-route assertions; batch checker through v5.1.1; historical regression; all script syntax; all JSON parse; static links; accessibility assertions; desktop and mobile visual QA.",
    data: gateData({
      version: "v5.1.1",
      position: "Founder authorization is a bounded decision record, not an invitation, participant, session, credential, or launch",
      headline: "Five exact proofs can authorize one private session while every execution switch remains off.",
      copy: "The current repository demonstrates the decision contract only. A real go decision would still require live-stack evidence and a separate audited invitation step outside this release.",
      postures: [posture("Founder evaluator", "Ready", "Approve, reject, blocked, and unsafe states are covered."), posture("Evidence chain", "5 proofs", "Activation, dry run, revocation, sandbox, and incident evidence remain separate."), posture("Maximum scope", "1 person / 1 session", "No cohort expansion is possible."), posture("Execution", "Off", "No invitation, credential, participant, or session is created.")],
      flow: [step("Gather", "Verify all five exact evidence states."), step("Bound", "Name owners, cap one participant and one session, and expire within seventy-two hours."), step("Decide", "Authorize one bounded session, reject, or remain blocked."), step("Hold", "Keep invitation issuance, session start, credentials, and public access off.")],
      decisions: [decision("Decision contract", "Deterministic", "Safe and unsafe founder decisions are deterministic."), decision("Current execution", "None", "The interface contains no live activation control."), decision("Maximum authorization", "1 session", "Scope cannot silently widen."), decision("Public launch", "Blocked", "Private validation never implies public availability.")],
      metrics: [metric("Required proofs", "5"), metric("Maximum participants", "1"), metric("Maximum sessions", "1"), metric("Real sessions started", "0")],
      packet: "VedaPath Founder Private Pilot Go/No-Go\nRequired evidence: 5 exact states\nPilot owner: required\nShutdown owner: required\nMaximum participants: 1\nMaximum sessions: 1\nAuthorization expiry: 72 hours maximum\nInvitation issued: false\nSession started: false\nParticipant created: false\nCredentials issued: false\nExternal participants: 0\nPublic launch: blocked",
      primaryAction: { href: "build-status.html", label: "Open Build Status" },
      extras: { schema: "vedapath.founder-private-pilot-decision.v1", evaluator: "scripts/vedapath-founder-private-pilot-decision.mjs", required_evidence: 5, maximum_participants: 1, maximum_sessions: 1, authorization_expiry_hours: 72, invitation_issued: false, session_started: false, participant_created: false, credentials_issued: false, external_participants: 0, public_launch: "blocked", next_release: "v5.1.2 Real Private Pilot Operations Decision Gate" }
    })
  }
];

const selected = releases.slice(0, throughIndex + 1);
const current = selected.at(-1);
const next = releases[throughIndex + 1] || { version: "v5.1.2", title: "Real Private Pilot Operations Decision Gate", copy: "Review the validation packet against a real private stack before any invitation can be issued." };

function page(item) {
  const previousLinks = [
    ["Implementation", "privateimplementationdecision.html"],
    ["Secret Bindings", "managedsecretbindingplan.html"],
    ["Reviewer Accounts", "revieweraccountprovisioningrunbook.html"],
    ["Queue Cutover", "durablequeuecutoverdrill.html"],
    ["Invitation Decision", "invitationactivationdecisiongate.html"]
  ];
  const links = previousLinks.concat(selected.map((release) => [release.label, release.href]))
    .map(([label, href]) => `        <a class="link${href === item.href ? " active" : ""}" href="${href}">${label}</a>`).join("\n");
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
  <script src="assets/vedapath-retrieval-pilot.js?v=511-private-pilot-validation"></script>
</body>
</html>
`;
}

function docEntry(item) {
  return [`# ${item.version} ${item.title}`, "", "## Purpose", "", item.copy, "", "## What Changed", "", item.changes, "", "## Files Changed", "", ...item.files.map((name) => `- \`${name}\``), "", "## Acceptance Checks", "", item.checks, "", "## Known Risks", "", sharedRisk, "", "## Founder Packet", "", item.data.packet, ""].join("\n");
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
  text = text.replace(/^    \{ title: "Private Pilot Validation", labels: \[[^\n]+\n/gm, "");
  text = text.replace(
    '    { title: "Private Implementation", labels: ["Implementation", "Secret Bindings", "Reviewer Accounts", "Queue Cutover", "Invitation Decision"] },',
    '    { title: "Private Implementation", labels: ["Implementation", "Secret Bindings", "Reviewer Accounts", "Queue Cutover", "Invitation Decision"] },\n' +
      `    { title: "Private Pilot Validation", labels: [${selected.map((item) => `"${item.label}"`).join(", ")}] },`
  );

  for (const item of releases) {
    const escapedLabel = item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedBody = item.bodyClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`^    "${escapedLabel}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    "${escapedBody}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    \\["${escapedLabel}", "[^"]+"\\],?\\r?\\n`, "gm"), "");
  }

  const titleLines = selected.map((item) => `    "${item.label}": "${item.title}",`).join("\n");
  text = text.replace('    "Invitation Decision": "Invitation Activation Decision Gate",', '    "Invitation Decision": "Invitation Activation Decision Gate",\n' + titleLines);
  const bodyLines = selected.map((item) => `    "${item.bodyClass}": "${item.title}",`).join("\n");
  text = text.replace('    "invitation-activation-decision-gate-page": "Invitation Activation Decision Gate",', '    "invitation-activation-decision-gate-page": "Invitation Activation Decision Gate",\n' + bodyLines);
  const linkLines = selected.map((item) => `    ["${item.label}", "${item.href}"],`).join("\n");
  text = text.replace('    ["Invitation Decision", "invitationactivationdecisiongate.html"],', '    ["Invitation Decision", "invitationactivationdecisiongate.html"],\n' + linkLines);
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const item of releases) text = text.replace(new RegExp(`^  "${item.href}",?\\r?\\n`, "gm"), "");
  const lines = selected.map((item) => `  "${item.href}",`).join("\n");
  text = text.replace('  "invitationactivationdecisiongate.html",', '  "invitationactivationdecisiongate.html",\n' + lines);
  write("scripts/check-static-links.mjs", text);
}

const priorPhases = [
  [431, "Private Infrastructure Implementation Decision", "Records a bounded founder implementation decision while deployment stays closed."],
  [432, "Managed Secret Binding Plan", "Defines three redacted managed-secret bindings without serializing a value."],
  [433, "Reviewer Account Provisioning Runbook", "Plans time-bounded reviewer identities without creating accounts or credentials."],
  [434, "Durable Queue Cutover Drill", "Proves deterministic migration and rollback evidence without touching a provider."],
  [435, "Invitation Activation Decision Gate", "Requires twelve live-stack proofs before one private invitation can be authorized but not issued."]
];

function phaseMarkup() {
  const prior = priorPhases.map(([phase, title, copy]) => `            <article class="phase"><span class="badge done">Done</span><div><strong>Phase ${phase}: ${title}</strong><p>${copy}</p></div><div class="percent">100%</div></article>`);
  const currentPhases = selected.map((item, index) => `            <article class="phase"><span class="badge ${index === selected.length - 1 ? "active" : "done"}">${index === selected.length - 1 ? "Active" : "Done"}</span><div><strong>Phase ${item.phase}: ${item.title}</strong><p>${item.phaseCopy}</p></div><div class="percent">100%</div></article>`);
  return prior.concat(currentPhases).join("\n");
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${current.version}$2${current.copy}$3`);
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${next.version} ${next.title}$2${next.copy}$3`);
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${current.version} ${current.title}</strong></div>`);
  const previous = throughIndex === 0 ? "v5.0.6 Invitation Activation Decision Gate" : `${releases[throughIndex - 1].version} ${releases[throughIndex - 1].title}`;
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previous}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Prove the smallest private-pilot invitation, cancellation, session, incident, and founder-decision contracts without creating a participant or opening launch.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Private-pilot validation complete; real invitation issuance, participant access, provider operations, and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Review the complete validation packet against a real private stack and named operating owners.</span></li>\n            <li><span class="dot"></span><span>Keep tokens, direct identity, delivery, participant access, and public launch disabled until a separate audited decision.</span></li>\n            <li><span class="dot"></span><span>Choose the smallest production-grade identity, rights, queue, privacy, and incident-response slice.</span></li>\n            <li><span class="dot"></span><span>Require fresh security, privacy, rights, recovery, shutdown, and consent evidence before any real session.</span></li>\n          </ul>');
  text = text.replace(/\s*<!-- V502-V511 PRIVATE PILOT PHASES START -->[\s\S]*?<!-- V502-V511 PRIVATE PILOT PHASES END -->\s*/g, "\n");
  const block = `            <!-- V502-V511 PRIVATE PILOT PHASES START -->\n${phaseMarkup()}\n            <!-- V502-V511 PRIVATE PILOT PHASES END -->\n`;
  text = text.replace("<!-- V410-V414 PHASES END -->", block + "<!-- V410-V414 PHASES END -->");
  write("build-status.html", text);
}

function updateBadges() {
  const patterns = ["v5.0.6 invitation decision", ...Object.values(badges)].map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const badgePattern = new RegExp(patterns, "g");
  for (const name of readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
    write(name, read(name).replace(badgePattern, badges[through]));
  }
  write("brand/brand-board.html", read("brand/brand-board.html").replace(badgePattern, badges[through]));
}

for (const item of selected) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.docFile, docEntry(item));
  write(item.href, page(item));
}

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateBadges();

let changelog = read("CHANGELOG.md");
for (const item of selected) if (!changelog.includes(`## ${item.version} ${item.title}`)) changelog = changelogEntry(item) + "\n" + changelog;
write("CHANGELOG.md", changelog);

let readme = read("README.md");
for (const item of selected) if (!readme.includes(`## ${item.version} ${item.title}`)) readme = readmeEntry(item) + "\n" + readme;
write("README.md", readme);

console.log(`applied-v507-v511-private-pilot-validation ${through}`);
