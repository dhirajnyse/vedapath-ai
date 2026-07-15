import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const versions = ["v5.1.2", "v5.1.3", "v5.1.4", "v5.1.5", "v5.1.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

const sharedRisk = "Private-pilot operations contract evidence only; candidate stack, invitation adapter, consent, observability, and founder review remain deterministic fixtures. No credentials, direct identity, token, account, email, delivery, provider connection, deployment activation, real invitation, participant, live session, exported telemetry, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.";
const badges = {
  "v5.1.2": "v5.1.2 stack readiness",
  "v5.1.3": "v5.1.3 invite adapter",
  "v5.1.4": "v5.1.4 consent contract",
  "v5.1.5": "v5.1.5 session observability",
  "v5.1.6": "v5.1.6 evidence review"
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
    posture("Identity lock", "Pseudonymous", "Direct identity fields are rejected by every contract."),
    posture("Execution lock", "Closed", "No invitation, account, credential, participant, or live session is created."),
    posture("Provider lock", "Disconnected", "No provider mutation, delivery channel, or exported telemetry exists."),
    posture("Evidence lock", "Deterministic", "Only fixture evidence and canonical digests are produced."),
    posture("Public launch lock", "Closed", "Private evidence review cannot open public access.")
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

const commonFiles = [
  "scripts/apply-v512-v516-private-pilot-operations-batch.mjs",
  "scripts/check-v512-v516-private-pilot-operations.mjs",
  "assets/vedapath-command-shell.js",
  "scripts/check-static-links.mjs",
  "build-status.html",
  "README.md",
  "CHANGELOG.md",
  "historical compatibility checkers"
];

const releases = [
  {
    version: "v5.1.2",
    title: "Private Stack Readiness Gate",
    label: "Stack Readiness",
    href: "privatestackreadiness.html",
    dataFile: "data/vedapath-private-stack-readiness.json",
    docFile: "docs/PRIVATE_STACK_READINESS_GATE.md",
    moduleFile: "scripts/vedapath-private-stack-readiness.mjs",
    bodyClass: "private-stack-readiness-page",
    phase: 441,
    phaseCopy: "Validates six candidate-stack postures while credentials, providers, deployment, and sessions remain off.",
    eyebrow: "Inspect the candidate stack without activating it",
    headline: "Prove six operating postures. Keep every execution switch off.",
    copy: "A twenty-four-hour readiness gate now requires pseudonymous identity, reviewed-source rights, review-event-only writes, local-first privacy, tested incident response, manual rollback, three named owners, and one-person, one-session limits.",
    changes: "Adds a pure private-stack readiness evaluator with six exact posture checks, named operations, privacy, and security owners, twenty-four-hour evidence expiry, one-person and one-session limits, a single review-event write route, and permanent no-credential, no-provider, no-deployment, no-invitation, no-session, and public-launch locks.",
    files: ["privatestackreadiness.html", "data/vedapath-private-stack-readiness.json", "docs/PRIVATE_STACK_READINESS_GATE.md", "scripts/vedapath-private-stack-readiness.mjs", ...commonFiles],
    checks: "node --check scripts/vedapath-private-stack-readiness.mjs; complete, posture, owner, expiry, scope, route, credential, provider, deployment, invitation, session, and public-access assertions; batch checker through v5.1.2; static links.",
    data: gateData({
      version: "v5.1.2",
      position: "A repository decision becomes operational evidence only after the candidate stack passes explicit, short-lived posture checks",
      headline: "Six exact postures can pass while credentials, provider connection, deployment, invitation, and session remain absent.",
      copy: "This is a candidate configuration review, not proof that a live stack exists. Every check expires within twenty-four hours and still needs a later audited execution decision.",
      postures: [posture("Identity", "Pseudonymous only", "No direct identity or participant account."), posture("Rights", "Reviewed source only", "Only reviewed source material is in scope."), posture("Writes", "Review events only", "No participant or publication write route."), posture("Rollback", "Named manual owner", "A human stop path remains mandatory.")],
      flow: [step("Authorize", "Start from the bounded v5.1.1 founder decision."), step("Inspect", "Check identity, rights, queue, privacy, incident, and rollback posture."), step("Expire", "Time-box the evidence to twenty-four hours."), step("Hold", "Activate no deployment, provider, invitation, or session.")],
      decisions: [decision("Required postures", "6", "Every posture must match exactly."), decision("Named owners", "3", "Operations, privacy, and security stay accountable."), decision("Allowed write routes", "1", "Only review-event evidence is modeled."), decision("Execution", "Off", "Readiness is not activation.")],
      metrics: [metric("Posture checks", "6"), metric("Evidence life", "24h max"), metric("Participants", "0"), metric("Live sessions", "0")],
      packet: "VedaPath Private Stack Readiness Gate\nFounder authorization: required\nCandidate stack: required\nPosture checks: 6 exact states\nNamed owners: 3\nMaximum participants: 1\nMaximum sessions: 1\nEvidence expiry: 24 hours maximum\nCredentials present: false\nProvider connected: false\nDeployment active: false\nInvitation issued: false\nSession started: false\nPublic launch: blocked",
      primaryAction: { href: "oneinvitationadapter.html", label: "Open Invite Adapter" },
      extras: { schema: "vedapath.private-stack-readiness.v1", evaluator: "scripts/vedapath-private-stack-readiness.mjs", required_postures: 6, evidence_expiry_hours: 24, maximum_participants: 1, maximum_sessions: 1, credentials_present: false, provider_connected: false, deployment_active: false, invitation_issued: false, session_started: false, public_launch: "blocked", next_release: "v5.1.3 One-Invitation Adapter Contract" }
    })
  },
  {
    version: "v5.1.3",
    title: "One-Invitation Adapter Contract",
    label: "Invite Adapter",
    href: "oneinvitationadapter.html",
    dataFile: "data/vedapath-one-invitation-adapter.json",
    docFile: "docs/ONE_INVITATION_ADAPTER_CONTRACT.md",
    moduleFile: "scripts/vedapath-one-invitation-adapter.mjs",
    bodyClass: "one-invitation-adapter-page",
    phase: 442,
    phaseCopy: "Prepares one idempotent fixture request while transport, delivery, provider mutation, and issuance stay absent.",
    eyebrow: "Prepare one request without sending it",
    headline: "Shape one invitation candidate. Hash it. Deliver nothing.",
    copy: "A fixture-only adapter now binds readiness, pseudonymous identity, role, purpose, idempotency, pending consent, and seventy-two-hour expiry into one deterministic digest with no transport or provider path.",
    changes: "Adds a one-invitation adapter evaluator with stack-readiness dependency, pseudonymous identifiers, idempotency, bounded role and purpose, pending-consent posture, seventy-two-hour expiry, canonical request digest, direct-identity rejection, and permanent no-token, no-account, no-email, no-delivery, no-provider-mutation, and no-invitation outputs.",
    files: ["oneinvitationadapter.html", "data/vedapath-one-invitation-adapter.json", "docs/ONE_INVITATION_ADAPTER_CONTRACT.md", "scripts/vedapath-one-invitation-adapter.mjs", ...commonFiles],
    checks: "node --check scripts/vedapath-one-invitation-adapter.mjs; valid, readiness, identifiers, idempotency, role, purpose, consent, transport, expiry, identity, token, account, email, provider, and public-access assertions; batch checker through v5.1.3; static links.",
    data: gateData({
      version: "v5.1.3",
      position: "An adapter contract should prove request shape and idempotency before it gains transport or provider authority",
      headline: "One pseudonymous request becomes reviewable while token creation, delivery, provider mutation, and invitation issuance stay false.",
      copy: "The adapter is deliberately fixture-only. It cannot receive an email address, create an account, connect to a provider, or send anything.",
      postures: [posture("Readiness", "Required", "The candidate stack gate must pass first."), posture("Idempotency", "Required", "Repeated preparation resolves to one request shape."), posture("Consent", "Pending", "Preparation cannot pretend consent has happened."), posture("Transport", "None", "No message or token leaves the repository.")],
      flow: [step("Inherit", "Require the private stack readiness status."), step("Describe", "Use pseudonymous participant, role, purpose, and pending consent."), step("Hash", "Create one canonical idempotent request digest."), step("Hold", "Keep transport, delivery, provider, token, and issuance off.")],
      decisions: [decision("Maximum requests", "1", "No cohort or bulk path exists."), decision("Consent state", "Pending", "Consent remains a separate contract."), decision("Delivery attempts", "0", "The adapter has no transport."), decision("Provider mutations", "0", "The adapter is a local fixture.")],
      metrics: [metric("Maximum invitations", "1"), metric("Digest", "SHA-256"), metric("Delivery attempts", "0"), metric("Invitations issued", "0")],
      packet: "VedaPath One-Invitation Adapter Contract\nStack readiness: required\nPseudonymous participant: required\nRole and purpose: bounded\nConsent: pending\nIdempotency key: required\nExpiry: 72 hours maximum\nDelivery mode: fixture only\nTransport: none\nToken created: false\nAccount created: false\nEmail sent: false\nProvider mutation: false\nInvitation issued: false\nPublic launch: blocked",
      primaryAction: { href: "participantconsenthandshake.html", label: "Open Consent Handshake" },
      extras: { schema: "vedapath.one-invitation-adapter.v1", evaluator: "scripts/vedapath-one-invitation-adapter.mjs", maximum_invitations: 1, expiry_hours: 72, token_created: false, account_created: false, email_sent: false, delivery_attempted: false, provider_mutation: false, invitation_issued: false, public_launch: "blocked", next_release: "v5.1.4 Participant Consent Handshake Contract" }
    })
  },
  {
    version: "v5.1.4",
    title: "Participant Consent Handshake Contract",
    label: "Consent Handshake",
    href: "participantconsenthandshake.html",
    dataFile: "data/vedapath-participant-consent-handshake.json",
    docFile: "docs/PARTICIPANT_CONSENT_HANDSHAKE_CONTRACT.md",
    moduleFile: "scripts/vedapath-participant-consent-handshake.mjs",
    bodyClass: "participant-consent-handshake-page",
    phase: 443,
    phaseCopy: "Validates a versioned consent fixture with withdrawal and zero telemetry, without creating a participant.",
    eyebrow: "Make consent explicit and reversible",
    headline: "Version the promise. Bound the data use. Preserve withdrawal.",
    copy: "A fixture-only consent handshake now requires an adult-volunteer attestation, source-first scope, bounded safety-and-quality data use, zero telemetry, pre-session withdrawal, pseudonymous identity, and seventy-two-hour expiry.",
    changes: "Adds a participant-consent handshake evaluator with adapter dependency, versioned consent and privacy notice, adult-volunteer attestation, source-first scope, bounded data use, zero-telemetry and withdrawal requirements, seventy-two-hour expiry, deterministic receipt digest, direct-identity rejection, and permanent no-account, no-token, no-participant, and no-session outputs.",
    files: ["participantconsenthandshake.html", "data/vedapath-participant-consent-handshake.json", "docs/PARTICIPANT_CONSENT_HANDSHAKE_CONTRACT.md", "scripts/vedapath-participant-consent-handshake.mjs", ...commonFiles],
    checks: "node --check scripts/vedapath-participant-consent-handshake.mjs; valid, adapter, fixture mode, versions, attestation, scope, data use, telemetry, withdrawal, identity, expiry, account, token, session, and public-access assertions; batch checker through v5.1.4; static links.",
    data: gateData({
      version: "v5.1.4",
      position: "Consent must be versioned, scoped, time-bounded, and withdrawable before any participant or session can exist",
      headline: "A deterministic consent receipt can be reviewed while the person, account, token, telemetry, and session remain absent.",
      copy: "This release tests the consent language contract only. It does not collect real consent or establish a participant relationship.",
      postures: [posture("Consent mode", "Fixture only", "No real person is enrolled."), posture("Scope", "Source-first reflection", "Therapy, diagnosis, and spiritual authority are excluded."), posture("Telemetry", "None", "No behavior or content is exported."), posture("Withdrawal", "Before session", "The stop path precedes any session decision.")],
      flow: [step("Version", "Bind consent and privacy notice versions."), step("Acknowledge", "Record adult-volunteer and source-first scope fixtures."), step("Bound", "Limit data use and keep telemetry off."), step("Withdraw", "Preserve a pre-session withdrawal path.")],
      decisions: [decision("Consent mode", "Fixture", "No real consent is collected."), decision("Identity mode", "Pseudonymous", "Direct identity fields are forbidden."), decision("Telemetry", "0", "The fixture exports no behavioral data."), decision("Participant created", "No", "A receipt is not an account.")],
      metrics: [metric("Consent versions", "2"), metric("Maximum life", "72h"), metric("Telemetry events", "0"), metric("Participants", "0")],
      packet: "VedaPath Participant Consent Handshake Contract\nAdapter status: required\nConsent mode: fixture only\nConsent version: required\nPrivacy notice version: required\nAdult volunteer attestation: required\nScope: source-first reflection only\nData use: session safety and quality only\nTelemetry: none\nWithdrawal: available before session\nExpiry: 72 hours maximum\nAccount created: false\nParticipant created: false\nSession started: false\nPublic launch: blocked",
      primaryAction: { href: "firstsessionobservability.html", label: "Open Session Observability" },
      extras: { schema: "vedapath.participant-consent-handshake.v1", evaluator: "scripts/vedapath-participant-consent-handshake.mjs", consent_mode: "fixture-only", expiry_hours: 72, telemetry_enabled: false, account_created: false, token_created: false, participant_created: false, session_started: false, public_launch: "blocked", next_release: "v5.1.5 First-Session Observability and Rollback" }
    })
  },
  {
    version: "v5.1.5",
    title: "First-Session Observability and Rollback",
    label: "Observability",
    href: "firstsessionobservability.html",
    dataFile: "data/vedapath-first-session-observability.json",
    docFile: "docs/FIRST_SESSION_OBSERVABILITY_AND_ROLLBACK.md",
    moduleFile: "scripts/vedapath-first-session-observability.mjs",
    bodyClass: "first-session-observability-page",
    phase: 444,
    phaseCopy: "Allows four aggregate fixture events and a named rollback owner while raw content and exports stay off.",
    eyebrow: "Observe the shape, never the reflection",
    headline: "Count four safe events. Capture no content. Keep rollback human-owned.",
    copy: "A thirty-minute fixture now accepts only opened, source-viewed, boundary-acknowledged, and closed events with status and latency metadata, a checkpoint digest, named rollback owner, no raw content, no export, no network, and no live session.",
    changes: "Adds a first-session observability evaluator with consent dependency, pseudonymous fixture identifiers, four ordered event types, strict metadata field allowlist, status and latency bounds, thirty-minute duration, named rollback owner, checkpoint digest, local aggregate-only telemetry, and permanent no-raw-content, no-export, no-provider, no-network, no-participant, and no-live-session outputs.",
    files: ["firstsessionobservability.html", "data/vedapath-first-session-observability.json", "docs/FIRST_SESSION_OBSERVABILITY_AND_ROLLBACK.md", "scripts/vedapath-first-session-observability.mjs", ...commonFiles],
    checks: "node --check scripts/vedapath-first-session-observability.mjs; valid, consent, identifiers, owner, checkpoint, telemetry, duration, event order, field, timeline, status, latency, raw content, export, provider, network, session, and public-access assertions; batch checker through v5.1.5; static links.",
    data: gateData({
      version: "v5.1.5",
      position: "Operational observability should measure safety and performance without collecting the question, source passage, or reflection",
      headline: "Four aggregate events prove the control surface while raw content, network, export, and live participation remain absent.",
      copy: "The event contract records only type, time, status, and latency. A named rollback owner and checkpoint digest keep the stop path visible.",
      postures: [posture("Events", "4 allowlisted", "No custom event or field can enter the fixture."), posture("Content", "Never captured", "Questions, passages, and reflections stay outside telemetry."), posture("Export", "Disabled", "Aggregate fixture data stays local."), posture("Rollback", "Named owner", "A human remains accountable for the stop path.")],
      flow: [step("Open", "Record one local fixture open event."), step("View", "Measure source-view latency without source content."), step("Acknowledge", "Record only that the boundary was shown."), step("Close", "End within thirty minutes and retain a rollback checkpoint.")],
      decisions: [decision("Allowed events", "4", "The event vocabulary is closed."), decision("Allowed fields", "4", "Only type, time, status, and latency."), decision("Raw content", "0", "No user or source text enters observability."), decision("Network requests", "0", "The fixture remains local.")],
      metrics: [metric("Allowed events", "4"), metric("Maximum minutes", "30"), metric("Raw content fields", "0"), metric("Live sessions", "0")],
      packet: "VedaPath First-Session Observability and Rollback\nConsent fixture: required\nSession fixture: pseudonymous\nAllowed events: 4\nAllowed event fields: 4\nMaximum duration: 30 minutes\nRollback owner: required\nCheckpoint digest: required\nTelemetry mode: local aggregate only\nRaw content captured: false\nTelemetry exported: false\nProvider connected: false\nNetwork requests: 0\nLive session started: false\nParticipant created: false\nPublic launch: blocked",
      primaryAction: { href: "founderpilotevidencereview.html", label: "Open Evidence Review" },
      extras: { schema: "vedapath.first-session-observability.v1", evaluator: "scripts/vedapath-first-session-observability.mjs", allowed_events: 4, allowed_fields: 4, maximum_minutes: 30, raw_content_captured: false, telemetry_exported: false, network_requests: 0, session_started: false, participant_created: false, public_launch: "blocked", next_release: "v5.1.6 Founder Pilot Evidence Review" }
    })
  },
  {
    version: "v5.1.6",
    title: "Founder Pilot Evidence Review",
    label: "Evidence Review",
    href: "founderpilotevidencereview.html",
    dataFile: "data/vedapath-founder-pilot-evidence-review.json",
    docFile: "docs/FOUNDER_PILOT_EVIDENCE_REVIEW.md",
    moduleFile: "scripts/vedapath-founder-pilot-evidence-review.mjs",
    bodyClass: "founder-pilot-evidence-review-page",
    phase: 445,
    phaseCopy: "Combines five exact evidence states and five risk acknowledgements into one no-execution founder review.",
    eyebrow: "Review the proof without crossing the boundary",
    headline: "Confirm five proofs. Acknowledge five limits. Execute nothing.",
    copy: "A twenty-four-hour founder review now requires the original authorization, stack readiness, invitation adapter, consent handshake, session observability, three named owners, five explicit risk acknowledgements, and one-person, one-session limits.",
    changes: "Adds a founder pilot evidence-review evaluator with five exact evidence dependencies, five allowlisted risk acknowledgements, named founder, privacy, and security owners, twenty-four-hour expiry, one-participant and one-session ceilings, approve, reject, and blocked outcomes, and permanent no-credential, no-invitation, no-session, no-participant, no-provider, and public-launch locks.",
    files: ["founderpilotevidencereview.html", "data/vedapath-founder-pilot-evidence-review.json", "docs/FOUNDER_PILOT_EVIDENCE_REVIEW.md", "scripts/vedapath-founder-pilot-evidence-review.mjs", ...commonFiles],
    checks: "node --check scripts/vedapath-founder-pilot-evidence-review.mjs; complete, missing evidence, acknowledgement, owner, expiry, scope, credential, invitation, session, participant, provider, public-access, reject, and missing-decision assertions; batch checker through v5.1.6; historical regression; all script syntax; all JSON parse; static links; desktop and mobile visual QA.",
    data: gateData({
      version: "v5.1.6",
      position: "Founder evidence approval confirms that the private-pilot contract is coherent; it still does not authorize execution",
      headline: "Five proofs and five limits can pass while credentials, invitation, participant, provider, session, and public access remain false.",
      copy: "The only valid approval outcome keeps execution disabled and points to a separate audited execution decision. Rejection and incomplete evidence remain first-class outcomes.",
      postures: [posture("Evidence", "5 exact states", "Authorization, readiness, adapter, consent, and observability must agree."), posture("Acknowledgements", "5 explicit limits", "Identity, rights, consent, telemetry, and execution boundaries stay visible."), posture("Ownership", "3 named roles", "Founder, privacy, and security decisions remain attributable."), posture("Execution", "Disabled", "Approval cannot create or start anything.")],
      flow: [step("Gather", "Verify all five exact evidence states."), step("Acknowledge", "Confirm the five non-negotiable risk boundaries."), step("Decide", "Approve evidence, reject it, or remain blocked."), step("Separate", "Send any execution question to a new audited gate.")],
      decisions: [decision("Evidence states", "5", "Every upstream contract must pass exactly."), decision("Risk acknowledgements", "5", "Unknown or missing acknowledgements block approval."), decision("Review life", "24h max", "Stale evidence cannot carry forward."), decision("Execution", "Disabled", "Evidence approval is not operational authority.")],
      metrics: [metric("Required evidence", "5"), metric("Acknowledgements", "5"), metric("Maximum sessions", "1"), metric("Real sessions started", "0")],
      packet: "VedaPath Founder Pilot Evidence Review\nRequired evidence: 5 exact states\nRequired acknowledgements: 5\nFounder owner: required\nPrivacy owner: required\nSecurity owner: required\nMaximum participants: 1\nMaximum sessions: 1\nReview expiry: 24 hours maximum\nCredentials issued: false\nInvitation issued: false\nSession started: false\nParticipant created: false\nProvider connected: false\nPublic launch: blocked\nNext action: separate audited execution decision",
      primaryAction: { href: "build-status.html", label: "Open Build Status" },
      extras: { schema: "vedapath.founder-pilot-evidence-review.v1", evaluator: "scripts/vedapath-founder-pilot-evidence-review.mjs", required_evidence: 5, required_acknowledgements: 5, review_expiry_hours: 24, maximum_participants: 1, maximum_sessions: 1, credentials_issued: false, invitation_issued: false, session_started: false, participant_created: false, provider_connected: false, public_launch: "blocked", next_release: "v5.1.7 Audited Pilot Execution Decision Gate" }
    })
  }
];

const selected = releases.slice(0, throughIndex + 1);
const current = selected.at(-1);
const next = releases[throughIndex + 1] || { version: "v5.1.7", title: "Audited Pilot Execution Decision Gate", copy: "Review whether a single private fixture may cross into one audited execution path while public launch stays closed." };

function page(item) {
  const previousLinks = [
    ["Invite Dry Run", "privateinvitationdryrun.html"],
    ["Revocation", "invitationrevocationreceipt.html"],
    ["Session Sandbox", "firstparticipantsessionsandbox.html"],
    ["Incident Drill", "pilotincidentdrill.html"],
    ["Pilot Decision", "founderprivatepilotdecision.html"]
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
  <script src="assets/vedapath-retrieval-pilot.js?v=516-private-pilot-operations"></script>
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
  text = text.replace(/^    \{ title: "Private Pilot Operations", labels: \[[^\n]+\n/gm, "");
  text = text.replace(
    '    { title: "Private Pilot Validation", labels: ["Invite Dry Run", "Revocation", "Session Sandbox", "Incident Drill", "Pilot Decision"] },',
    '    { title: "Private Pilot Validation", labels: ["Invite Dry Run", "Revocation", "Session Sandbox", "Incident Drill", "Pilot Decision"] },\n' +
      `    { title: "Private Pilot Operations", labels: [${selected.map((item) => `"${item.label}"`).join(", ")}] },`
  );

  for (const item of releases) {
    const escapedLabel = item.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedBody = item.bodyClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`^    "${escapedLabel}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    "${escapedBody}": "[^"]+",?\\r?\\n`, "gm"), "");
    text = text.replace(new RegExp(`^    \\["${escapedLabel}", "[^"]+"\\],?\\r?\\n`, "gm"), "");
  }

  const titleLines = selected.map((item) => `    "${item.label}": "${item.title}",`).join("\n");
  text = text.replace('    "Pilot Decision": "Founder Private Pilot Go/No-Go",', '    "Pilot Decision": "Founder Private Pilot Go/No-Go",\n' + titleLines);
  const bodyLines = selected.map((item) => `    "${item.bodyClass}": "${item.title}",`).join("\n");
  text = text.replace('    "founder-private-pilot-decision-page": "Founder Private Pilot Go/No-Go",', '    "founder-private-pilot-decision-page": "Founder Private Pilot Go/No-Go",\n' + bodyLines);
  const linkLines = selected.map((item) => `    ["${item.label}", "${item.href}"],`).join("\n");
  text = text.replace('    ["Pilot Decision", "founderprivatepilotdecision.html"],', '    ["Pilot Decision", "founderprivatepilotdecision.html"],\n' + linkLines);
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const item of releases) text = text.replace(new RegExp(`^  "${item.href}",?\\r?\\n`, "gm"), "");
  const lines = selected.map((item) => `  "${item.href}",`).join("\n");
  text = text.replace('  "founderprivatepilotdecision.html",', '  "founderprivatepilotdecision.html",\n' + lines);
  write("scripts/check-static-links.mjs", text);
}

function phaseMarkup() {
  return selected.map((item, index) => `            <article class="phase"><span class="badge ${index === selected.length - 1 ? "active" : "done"}">${index === selected.length - 1 ? "Active" : "Done"}</span><div><strong>Phase ${item.phase}: ${item.title}</strong><p>${item.phaseCopy}</p></div><div class="percent">100%</div></article>`).join("\n");
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/(<span>Current version<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${current.version}$2${current.copy}$3`);
  text = text.replace(/(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/, `$1${next.version} ${next.title}$2${next.copy}$3`);
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${current.version} ${current.title}</strong></div>`);
  const previous = throughIndex === 0 ? "v5.1.1 Founder Private Pilot Go/No-Go" : `${releases[throughIndex - 1].version} ${releases[throughIndex - 1].title}`;
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previous}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Turn the founder private-pilot decision into stack, adapter, consent, observability, and evidence-review contracts while every execution boundary remains closed.</strong></div>');
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, '<div class="version-row"><span>Status</span><strong>Private-pilot operations evidence complete; real credentials, identity, provider connection, invitation, participant, live session, telemetry export, and public launch remain blocked</strong></div>');
  text = text.replace(/<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/, '<h2>Next Build Checklist</h2>\n          <ul class="checklist">\n            <li><span class="dot"></span><span>Review whether one audited private execution path should be built at all.</span></li>\n            <li><span class="dot"></span><span>Keep direct identity, credentials, delivery, provider connection, participant creation, and public launch disabled by default.</span></li>\n            <li><span class="dot"></span><span>Require fresh rights, privacy, security, rollback, and incident evidence before any execution decision.</span></li>\n            <li><span class="dot"></span><span>Separate evidence approval from operational authority in both UI and code.</span></li>\n          </ul>');
  text = text.replace(/\s*<!-- V512-V516 PRIVATE PILOT OPERATIONS START -->[\s\S]*?<!-- V512-V516 PRIVATE PILOT OPERATIONS END -->\s*/g, "\n");
  const block = `            <!-- V512-V516 PRIVATE PILOT OPERATIONS START -->\n${phaseMarkup()}\n            <!-- V512-V516 PRIVATE PILOT OPERATIONS END -->\n`;
  text = text.replace("<!-- V502-V511 PRIVATE PILOT PHASES END -->", "<!-- V502-V511 PRIVATE PILOT PHASES END -->\n" + block);
  write("build-status.html", text);
}

function updateBadges() {
  const patterns = ["v5.1.1 pilot decision", ...Object.values(badges)].map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const badgePattern = new RegExp(patterns, "g");
  for (const name of readdirSync(root).filter((entry) => entry.endsWith(".html"))) write(name, read(name).replace(badgePattern, badges[through]));
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

console.log(`applied-v512-v516-private-pilot-operations ${through}`);
