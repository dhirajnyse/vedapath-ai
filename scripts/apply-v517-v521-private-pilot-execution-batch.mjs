import fs from "node:fs";
import path from "node:path";

const through = process.argv.find((arg) => arg.startsWith("--through="))?.split("=")[1] || "v5.2.1";
const order = ["v5.1.7", "v5.1.8", "v5.1.9", "v5.2.0", "v5.2.1"];
const throughIndex = order.indexOf(through);
if (throughIndex === -1) throw new Error(`Unknown --through version: ${through}`);

const boundary = "Private-pilot execution readiness evidence only; all records are deterministic fixtures. No credentials, direct identity, token value, account, email delivery, provider connection, deployment activation, live invitation, participant creation, live session, telemetry export, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.";
const blockers = [
  "No credential, token value, or direct participant identity may be generated.",
  "No provider, email, account, session, or telemetry endpoint may be activated.",
  "No production write, public launch, payment, licensed corpus delivery, or live AI generation is permitted."
];

const releases = [
  {
    version: "v5.1.7",
    slug: "audited-pilot-execution-decision-gate",
    file: "auditedpilotexecutiondecisiongate.html",
    bodyClass: "audited-pilot-execution-decision-gate-page",
    title: "Audited Pilot Execution Decision Gate",
    short: "Execution Gate",
    group: "Private Pilot Execution",
    summary: "A founder-safe decision gate now checks whether the private-pilot evidence chain is complete enough to design one audited execution path while every real execution capability remains disabled.",
    next: "v5.1.8 Single-Session Token Contract",
    kind: "gate",
    headline: "Decide before any execution exists.",
    copy: "The gate separates permission to design one audited path from permission to issue credentials, create a participant, or start a session.",
    primary: "Review execution gate",
    goal: "Separate execution-design permission from execution itself.",
    status: "Execution design may be reviewed; execution remains disabled",
    phase: "Phase 446: Audited Pilot Execution Decision Gate",
    phaseCopy: "Reviews whether private-pilot evidence can authorize a design-only execution path.",
    metrics: [
      ["Evidence states", "5"],
      ["Owners", "3"],
      ["Decision", "Design only"],
      ["Execution", "Off"]
    ],
    decisions: [
      "Approve design-only execution path",
      "Return to evidence review",
      "Block until owners re-acknowledge risk"
    ],
    flow: ["Evidence", "Owners", "Expiry", "Design-only decision"],
    packet: [
      "Decision: approve-design-only-execution-path",
      "Maximum participants: 1",
      "Maximum sessions: 1",
      "Execution enabled: false"
    ]
  },
  {
    version: "v5.1.8",
    slug: "single-session-token-contract",
    file: "singlesessiontokencontract.html",
    bodyClass: "single-session-token-contract-page",
    title: "Single-Session Token Contract",
    short: "Session Token",
    group: "Private Pilot Execution",
    summary: "A redacted token-request contract now defines one short-lived, one-session, pseudonymous access shape without issuing a token value, account, email, or provider mutation.",
    next: "v5.1.9 Ephemeral Participant Access Envelope",
    kind: "gate",
    headline: "Shape a token without issuing one.",
    copy: "The contract gives engineering a precise request envelope: one subject, one purpose, one scope, short TTL, idempotency, and no serialized secret.",
    primary: "Open token contract",
    goal: "Make private session access reviewable before any token exists.",
    status: "Token request fixture valid; token values remain absent",
    phase: "Phase 447: Single-Session Token Contract",
    phaseCopy: "Defines a redacted, short-lived session-token request without issuing credentials.",
    metrics: [
      ["TTL minutes", "30"],
      ["Scopes", "3"],
      ["Token value", "None"],
      ["Provider", "Off"]
    ],
    decisions: ["Accept redacted token envelope", "Reduce scope", "Reject until replay protection is clearer"],
    flow: ["Subject", "Scope", "TTL", "Digest"],
    packet: [
      "Subject: pilot-subject-001",
      "TTL: 30 minutes",
      "Token value: redacted-none",
      "Issuer: fixture-only"
    ]
  },
  {
    version: "v5.1.9",
    slug: "ephemeral-participant-access-envelope",
    file: "ephemeralparticipantaccessenvelope.html",
    bodyClass: "ephemeral-participant-access-envelope-page",
    title: "Ephemeral Participant Access Envelope",
    short: "Access Envelope",
    group: "Private Pilot Execution",
    summary: "A least-permission access envelope now binds the redacted session token to one pseudonymous participant role, one consent receipt, one session window, and one revocation path without creating identity or storage.",
    next: "v5.2.0 Audited Session Execution Sandbox",
    kind: "gate",
    headline: "Let access be temporary by default.",
    copy: "This release makes participant access narrow, revocable, and consent-bound before any durable account or live session is allowed.",
    primary: "Review access envelope",
    goal: "Keep participant access ephemeral, scoped, and reversible.",
    status: "Envelope valid; participant creation remains blocked",
    phase: "Phase 448: Ephemeral Participant Access Envelope",
    phaseCopy: "Binds one pseudonymous role, consent receipt, and revocation path without creating a participant.",
    metrics: [
      ["Roles", "1"],
      ["Consent", "Required"],
      ["Durable identity", "None"],
      ["Revocation", "Ready"]
    ],
    decisions: ["Accept access envelope", "Shorten session window", "Return to consent handshake"],
    flow: ["Token digest", "Consent receipt", "Role", "Revocation"],
    packet: [
      "Role: pilot-learner-readonly",
      "Consent receipt: consent-fixture-v1",
      "Session window: 30 minutes",
      "Durable account: false"
    ]
  },
  {
    version: "v5.2.0",
    slug: "audited-session-execution-sandbox",
    file: "auditedsessionexecutionsandbox.html",
    bodyClass: "audited-session-execution-sandbox-page",
    title: "Audited Session Execution Sandbox",
    short: "Execution Sandbox",
    group: "Private Pilot Execution",
    summary: "A local execution sandbox now simulates the one-session timeline with ordered events, source-card visibility, boundary acknowledgement, rollback ownership, and zero network, identity, telemetry export, or provider mutation.",
    next: "v5.2.1 Founder Private-Pilot Retrospective",
    kind: "gate",
    headline: "Rehearse the session before it is real.",
    copy: "The sandbox turns the private-pilot path into a deterministic timeline that can be inspected, reset, and rejected before any participant arrives.",
    primary: "Open execution sandbox",
    goal: "Prove the session sequence locally before live execution.",
    status: "Sandbox event chain valid; live session remains blocked",
    phase: "Phase 449: Audited Session Execution Sandbox",
    phaseCopy: "Simulates ordered session events, boundary acknowledgement, and rollback with no live session.",
    metrics: [
      ["Events", "5"],
      ["Rollback owner", "1"],
      ["Network", "Off"],
      ["Live session", "No"]
    ],
    decisions: ["Accept sandbox trace", "Replay fixture", "Block live path"],
    flow: ["Open", "Show source", "Acknowledge boundary", "Capture local event", "Close"],
    packet: [
      "Trace: local-execution-sandbox-001",
      "Event count: 5",
      "Raw content stored: false",
      "Rollback owner: owner:pilot-shutdown"
    ]
  },
  {
    version: "v5.2.1",
    slug: "founder-private-pilot-retrospective",
    file: "founderprivatepilotretrospective.html",
    bodyClass: "founder-private-pilot-retrospective-page",
    title: "Founder Private-Pilot Retrospective",
    short: "Pilot Retrospective",
    group: "Private Pilot Execution",
    summary: "A founder retrospective now aggregates the execution gate, token contract, access envelope, and sandbox trace into one review packet with explicit go, hold, and rework options while public launch stays blocked.",
    next: "v5.2.2 Pilot-to-Production Gap Map",
    kind: "gate",
    headline: "Review the pilot before inviting anyone.",
    copy: "The retrospective keeps the next decision calm: evidence first, risks visible, and no accidental drift from private pilot readiness into public launch.",
    primary: "Open retrospective",
    goal: "Give the founder one calm go/hold/rework packet after the execution-readiness chain.",
    status: "Execution-readiness retrospective complete; public launch remains blocked",
    phase: "Phase 450: Founder Private-Pilot Retrospective",
    phaseCopy: "Aggregates execution-readiness evidence into one founder go, hold, or rework decision packet.",
    metrics: [
      ["Artifacts", "4"],
      ["Choices", "3"],
      ["Public launch", "Blocked"],
      ["Next", "Gap map"]
    ],
    decisions: ["Go to private-pilot planning", "Hold for security review", "Rework token or access envelope"],
    flow: ["Gate", "Token", "Access", "Sandbox", "Founder decision"],
    packet: [
      "Gate: design-only approved",
      "Token: redacted fixture valid",
      "Access: ephemeral envelope valid",
      "Sandbox: local trace valid"
    ]
  }
];

const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function replace(file, pattern, value) {
  const text = read(file);
  if (!pattern.test(text)) throw new Error(`Pattern not found in ${file}`);
  write(file, text.replace(pattern, value));
}

function makeJson(release, index) {
  return {
    id: release.slug,
    release: release.version,
    title: release.title,
    type: "private-pilot-execution-readiness",
    updated: "2026-07-17",
    position: release.goal,
    headline: release.headline,
    copy: release.copy,
    text_family: "Private pilot governance | Fixture",
    pramana_level: "Deterministic fixture contract",
    confidence: "High for prototype boundaries",
    boundary,
    primary_action: release.primary,
    postures: [
      "One private participant maximum",
      "One private session maximum",
      "Execution-readiness review only",
      "Public launch remains blocked"
    ],
    flow: release.flow.map((label, step) => ({
      step: step + 1,
      label,
      detail: step === release.flow.length - 1 ? "Founder-readable evidence packet." : "Required before the next step."
    })),
    decisions: release.decisions.map((label, step) => ({
      step: step + 1,
      label,
      result: step === 0 ? "Allowed as fixture evidence only." : "Keeps execution closed until resolved."
    })),
    metrics: release.metrics.map(([label, value]) => ({ label, value })),
    locks: blockers,
    packet: release.packet,
    launch_state: {
      credentialsIssued: false,
      tokenValueIssued: false,
      participantCreated: false,
      sessionStarted: false,
      providerConnected: false,
      telemetryExported: false,
      publicLaunch: false
    },
    next_release: index === releases.length - 1 ? "v5.2.2 Pilot-to-Production Gap Map" : releases[index + 1].title
  };
}

function pageHtml(release) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath ${release.title}</title>
    <link rel="stylesheet" href="assets/vedapath-ui.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
    <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css">
  </head>
  <body class="${release.bodyClass}">
    <div id="top"></div>
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
        <span><strong>VedaPath AI</strong><small>${release.title}</small></span>
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="index.html#top">Home</a>
        <a href="build-status.html">Build</a>
        <a href="brand/brand-board.html">Brand</a>
        <a href="blueprint.html">Blueprint</a>
        <a href="founderpilotevidencereview.html">Evidence Review</a>
        <a class="active" href="${release.file}">${release.short}</a>
        <span class="version-pill">${release.version}</span>
      </nav>
    </header>
    <main class="page">
      <section class="vp-retrieval-shell" data-kind="gate" data-source="data/vedapath-${release.slug}.json" aria-live="polite">
        <article class="panel">
          <p>Loading ${release.title}...</p>
        </article>
      </section>
    </main>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-retrieval-pilot.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.title}

${release.summary}

## Goal

${release.goal}

## Boundary

${boundary}

## Required Flow

${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Decision Options

${release.decisions.map((item) => `- ${item}`).join("\n")}

## Packet

${release.packet.map((item) => `- ${item}`).join("\n")}

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, create participants, start a session, export telemetry, or authorize public launch.
`;
}

function evaluatorJs() {
  return `import crypto from "node:crypto";

const OWNER_RE = /^owner:[a-z0-9][a-z0-9-]{2,47}$/;

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function owner(value) {
  return OWNER_RE.test(String(value || ""));
}

function baseResult(schema, blockers, extra = {}) {
  const approved = blockers.length === 0;
  return {
    schema,
    approved,
    status: approved ? "fixture-approved-execution-disabled" : "fixture-blocked",
    blockers: [...new Set(blockers)],
    credentialsIssued: false,
    tokenValueIssued: false,
    participantCreated: false,
    sessionStarted: false,
    providerConnected: false,
    telemetryExported: false,
    publicLaunch: "blocked",
    ...extra
  };
}

export function evaluateAuditedPilotExecutionDecisionGate(input = {}) {
  const blockers = [];
  const required = [
    "private-pilot-evidence-approved-execution-disabled",
    "three-named-owners-present",
    "one-participant-one-session-limit",
    "rollback-owner-present",
    "execution-design-only"
  ];
  for (const item of required) if (!input.evidence?.includes(item)) blockers.push(\`missing-evidence:\${item}\`);
  if (!owner(input.founderOwner)) blockers.push("founder-owner-required");
  if (!owner(input.privacyOwner)) blockers.push("privacy-owner-required");
  if (!owner(input.securityOwner)) blockers.push("security-owner-required");
  if (input.decision !== "approve-design-only-execution-path") blockers.push("design-only-founder-decision-required");
  if (input.executionEnabled === true) blockers.push("execution-must-remain-disabled");
  return baseResult("vedapath.audited-pilot-execution-decision-gate.v1", blockers, {
    nextAction: blockers.length ? "return-to-evidence-review" : "draft-redacted-session-token-contract"
  });
}

export function evaluateSingleSessionTokenContract(input = {}) {
  const blockers = [];
  const scopes = Array.isArray(input.scopes) ? input.scopes : [];
  if (input.subject !== "pilot-subject-001") blockers.push("pseudonymous-subject-required");
  if (Number(input.ttlMinutes) > 30 || Number(input.ttlMinutes) < 5) blockers.push("ttl-must-be-5-to-30-minutes");
  for (const scope of ["source:read", "answer:preview", "feedback:local"]) if (!scopes.includes(scope)) blockers.push(\`missing-scope:\${scope}\`);
  if (scopes.some((scope) => !["source:read", "answer:preview", "feedback:local"].includes(scope))) blockers.push("unknown-scope");
  if (!input.idempotencyKey || !input.nonce) blockers.push("idempotency-and-nonce-required");
  if (input.tokenValue) blockers.push("token-value-must-not-be-present");
  if (input.issuer !== "fixture-only") blockers.push("issuer-must-be-fixture-only");
  return baseResult("vedapath.single-session-token-contract.v1", blockers, {
    tokenRequestDigest: digest({ subject: input.subject, ttlMinutes: input.ttlMinutes, scopes, nonce: input.nonce }),
    nextAction: blockers.length ? "repair-token-contract" : "draft-ephemeral-access-envelope"
  });
}

export function evaluateEphemeralParticipantAccessEnvelope(input = {}) {
  const blockers = [];
  if (!input.tokenRequestDigest || !String(input.tokenRequestDigest).match(/^[a-f0-9]{24}$/)) blockers.push("valid-token-request-digest-required");
  if (input.role !== "pilot-learner-readonly") blockers.push("readonly-pilot-role-required");
  if (input.consentReceipt !== "consent-fixture-v1") blockers.push("consent-fixture-required");
  if (Number(input.sessionWindowMinutes) !== 30) blockers.push("session-window-must-be-30-minutes");
  if (input.durableAccount === true) blockers.push("durable-account-forbidden");
  if (input.revocationPath !== "pre-session-owner-shutdown") blockers.push("revocation-path-required");
  return baseResult("vedapath.ephemeral-participant-access-envelope.v1", blockers, {
    accessEnvelopeDigest: digest({ tokenRequestDigest: input.tokenRequestDigest, role: input.role, consentReceipt: input.consentReceipt }),
    nextAction: blockers.length ? "repair-access-envelope" : "run-local-session-execution-sandbox"
  });
}

export function evaluateAuditedSessionExecutionSandbox(input = {}) {
  const blockers = [];
  const expected = ["opened", "source-card-shown", "boundary-acknowledged", "local-event-recorded", "closed"];
  const events = Array.isArray(input.events) ? input.events : [];
  if (events.length !== expected.length) blockers.push("five-events-required");
  expected.forEach((name, index) => {
    if (events[index]?.type !== name) blockers.push(\`event-order:\${name}\`);
    if (!Number.isInteger(events[index]?.at)) blockers.push(\`event-time:\${name}\`);
  });
  for (let index = 1; index < events.length; index += 1) if (events[index].at <= events[index - 1].at) blockers.push("event-times-must-increase");
  if (!owner(input.rollbackOwner)) blockers.push("rollback-owner-required");
  if (input.rawContentStored === true) blockers.push("raw-content-storage-forbidden");
  if (input.networkUsed === true) blockers.push("network-use-forbidden");
  return baseResult("vedapath.audited-session-execution-sandbox.v1", blockers, {
    sandboxTraceDigest: digest({ events, rollbackOwner: input.rollbackOwner }),
    nextAction: blockers.length ? "replay-local-sandbox" : "prepare-founder-retrospective"
  });
}

export function evaluateFounderPrivatePilotRetrospective(input = {}) {
  const blockers = [];
  const required = ["execution-gate-approved", "token-contract-valid", "access-envelope-valid", "sandbox-trace-valid"];
  for (const item of required) if (!input.artifacts?.includes(item)) blockers.push(\`missing-artifact:\${item}\`);
  if (!["go-to-private-pilot-planning", "hold-for-security-review", "rework-token-or-access"].includes(input.founderDecision)) blockers.push("founder-retrospective-decision-required");
  if (!owner(input.founderOwner)) blockers.push("founder-owner-required");
  if (input.publicLaunch === true) blockers.push("public-launch-forbidden");
  return baseResult("vedapath.founder-private-pilot-retrospective.v1", blockers, {
    retrospectiveDigest: digest({ artifacts: input.artifacts, founderDecision: input.founderDecision, founderOwner: input.founderOwner }),
    nextAction: blockers.length ? "repair-retrospective-evidence" : "map-pilot-to-production-gaps"
  });
}

export function privatePilotExecutionPacket(label, result) {
  if (!result || !result.schema) throw new TypeError("A VedaPath private-pilot execution result is required.");
  return [
    \`VedaPath \${label}\`,
    \`Status: \${result.status}\`,
    \`Approved: \${result.approved}\`,
    \`Blockers: \${result.blockers.length ? result.blockers.join(", ") : "none"}\`,
    "Credentials issued: false",
    "Token value issued: false",
    "Participant created: false",
    "Session started: false",
    "Provider connected: false",
    "Telemetry exported: false",
    "Public launch: blocked",
    \`Next action: \${result.nextAction}\`
  ].join("\\n");
}
`;
}

function checkerJs() {
  const imports = "import { evaluateAuditedPilotExecutionDecisionGate, evaluateSingleSessionTokenContract, evaluateEphemeralParticipantAccessEnvelope, evaluateAuditedSessionExecutionSandbox, evaluateFounderPrivatePilotRetrospective, privatePilotExecutionPacket } from './vedapath-private-pilot-execution-contracts.mjs';";
  return `${imports}
import { existsSync, readFileSync } from "node:fs";

const through = process.argv.find((arg) => arg.startsWith("--through="))?.split("=")[1] || "v5.2.1";
const order = ["v5.1.7", "v5.1.8", "v5.1.9", "v5.2.0", "v5.2.1"];
const end = order.indexOf(through);
if (end === -1) throw new Error(\`Unknown --through: \${through}\`);

const fixtures = {
  "v5.1.7": () => evaluateAuditedPilotExecutionDecisionGate({
    evidence: ["private-pilot-evidence-approved-execution-disabled", "three-named-owners-present", "one-participant-one-session-limit", "rollback-owner-present", "execution-design-only"],
    founderOwner: "owner:founder",
    privacyOwner: "owner:privacy",
    securityOwner: "owner:security",
    decision: "approve-design-only-execution-path",
    executionEnabled: false
  }),
  "v5.1.8": () => evaluateSingleSessionTokenContract({
    subject: "pilot-subject-001",
    ttlMinutes: 30,
    scopes: ["source:read", "answer:preview", "feedback:local"],
    idempotencyKey: "idem-v518",
    nonce: "nonce-v518",
    issuer: "fixture-only"
  }),
  "v5.1.9": () => {
    const token = fixtures["v5.1.8"]();
    return evaluateEphemeralParticipantAccessEnvelope({
      tokenRequestDigest: token.tokenRequestDigest,
      role: "pilot-learner-readonly",
      consentReceipt: "consent-fixture-v1",
      sessionWindowMinutes: 30,
      durableAccount: false,
      revocationPath: "pre-session-owner-shutdown"
    });
  },
  "v5.2.0": () => evaluateAuditedSessionExecutionSandbox({
    events: [
      { type: "opened", at: 1 },
      { type: "source-card-shown", at: 2 },
      { type: "boundary-acknowledged", at: 3 },
      { type: "local-event-recorded", at: 4 },
      { type: "closed", at: 5 }
    ],
    rollbackOwner: "owner:pilot-shutdown",
    rawContentStored: false,
    networkUsed: false
  }),
  "v5.2.1": () => evaluateFounderPrivatePilotRetrospective({
    artifacts: ["execution-gate-approved", "token-contract-valid", "access-envelope-valid", "sandbox-trace-valid"],
    founderDecision: "go-to-private-pilot-planning",
    founderOwner: "owner:founder",
    publicLaunch: false
  })
};

const files = {
  "v5.1.7": ["auditedpilotexecutiondecisiongate.html", "data/vedapath-audited-pilot-execution-decision-gate.json", "docs/AUDITED_PILOT_EXECUTION_DECISION_GATE.md"],
  "v5.1.8": ["singlesessiontokencontract.html", "data/vedapath-single-session-token-contract.json", "docs/SINGLE_SESSION_TOKEN_CONTRACT.md"],
  "v5.1.9": ["ephemeralparticipantaccessenvelope.html", "data/vedapath-ephemeral-participant-access-envelope.json", "docs/EPHEMERAL_PARTICIPANT_ACCESS_ENVELOPE.md"],
  "v5.2.0": ["auditedsessionexecutionsandbox.html", "data/vedapath-audited-session-execution-sandbox.json", "docs/AUDITED_SESSION_EXECUTION_SANDBOX.md"],
  "v5.2.1": ["founderprivatepilotretrospective.html", "data/vedapath-founder-private-pilot-retrospective.json", "docs/FOUNDER_PRIVATE_PILOT_RETROSPECTIVE.md"]
};

for (const version of order.slice(0, end + 1)) {
  for (const file of files[version]) if (!existsSync(file)) throw new Error(\`Missing \${file}\`);
  const data = JSON.parse(readFileSync(files[version][1], "utf8"));
  if (data.release !== version) throw new Error(\`Wrong release in \${files[version][1]}\`);
  if (data.launch_state.publicLaunch !== false) throw new Error(\`Public launch must stay false for \${version}\`);
  const result = fixtures[version]();
  if (!result.approved) throw new Error(\`\${version} fixture did not approve: \${result.blockers.join(", ")}\`);
  if (result.publicLaunch !== "blocked") throw new Error(\`\${version} public launch boundary failed\`);
  if (!privatePilotExecutionPacket(version, result).includes("Public launch: blocked")) throw new Error(\`\${version} packet boundary missing\`);
}

console.log(\`private-pilot-execution-ok \${end + 1}/5\`);
`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} ${latest.version === "v5.2.1" ? "retrospective" : latest.short.toLowerCase()}";`);
  if (!text.includes('Private Pilot Execution')) {
    text = text.replace(
      '    { title: "Private Pilot Operations", labels: ["Stack Readiness", "Invite Adapter", "Consent Handshake", "Observability", "Evidence Review"] },',
      '    { title: "Private Pilot Operations", labels: ["Stack Readiness", "Invite Adapter", "Consent Handshake", "Observability", "Evidence Review"] },\n    { title: "Private Pilot Execution", labels: ["Execution Gate", "Session Token", "Access Envelope", "Execution Sandbox", "Pilot Retrospective"] },'
    );
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Evidence Review": "Founder Pilot Evidence Review",', '    "Evidence Review": "Founder Pilot Evidence Review",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "founder-pilot-evidence-review-page": "Founder Pilot Evidence Review",', '    "founder-pilot-evidence-review-page": "Founder Pilot Evidence Review",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Evidence Review", "founderpilotevidencereview.html"],', '    ["Evidence Review", "founderpilotevidencereview.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "founderpilotevidencereview.html",', '  "founderpilotevidencereview.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateBuildStatus() {
  const previous = selected.length > 1 ? selected.at(-2) : { version: "v5.1.6", title: "Founder Pilot Evidence Review" };
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} ${latest.version === "v5.2.1" ? "retrospective" : "execution readiness"}</span>`);
  text = text.replace(/<strong>v5\.1\.6<\/strong>\s*<p>[\s\S]*?<\/p>/, `<strong>${latest.version}</strong>\n          <p>${latest.summary}</p>`);
  text = text.replace(/<strong>v5\.1\.7 Audited Pilot Execution Decision Gate<\/strong>\s*<p>[\s\S]*?<\/p>/, `<strong>${latest.next}</strong>\n          <p>${latest.version === "v5.2.1" ? "Map the remaining production gaps after private-pilot execution readiness." : "Continue the private-pilot execution readiness chain while real execution stays closed."}</p>`);
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.phaseCopy}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V517-V521 PRIVATE PILOT EXECUTION START -->\n${phases}\n            <!-- V517-V521 PRIVATE PILOT EXECUTION END -->`;
  if (text.includes("<!-- V517-V521 PRIVATE PILOT EXECUTION START -->")) {
    text = text.replace(/            <!-- V517-V521 PRIVATE PILOT EXECUTION START -->[\s\S]*?            <!-- V517-V521 PRIVATE PILOT EXECUTION END -->/, block);
  } else {
    text = text.replace('            <!-- V512-V516 PRIVATE PILOT OPERATIONS END -->', '            <!-- V512-V516 PRIVATE PILOT OPERATIONS END -->\n' + block);
  }
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${latest.version} ${latest.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previous.version} ${previous.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${latest.goal}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${latest.status}; credentials, token values, identity, invitations, live sessions, telemetry export, provider writes, and public launch remain blocked</strong></div>`);
  write("build-status.html", text);
}

function updateReadme() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n${release.summary}\n\n- Open: [${release.title}](${release.file})\n- Data: \`data/vedapath-${release.slug}.json\`\n- Boundary: ${boundary}\n`).reverse().join("\n");
  let text = read("README.md");
  for (const release of selected) {
    text = text.replace(new RegExp(`## ${release.version.replace(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  }
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added the ${release.short} command-shell page, data contract, documentation, and deterministic checker coverage.\n- Kept the private-pilot boundary explicit: no credentials, token values, identities, participants, live sessions, telemetry export, provider writes, or public launch.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`scripts/vedapath-private-pilot-execution-contracts.mjs\`\n- \`scripts/check-v517-v521-private-pilot-execution.mjs\`\n- shared navigation/build docs where applicable\n\n### Checks run\n- \`node scripts/apply-v517-v521-private-pilot-execution-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-private-pilot-execution-contracts.mjs\`\n- \`node --check scripts/check-v517-v521-private-pilot-execution.mjs\`\n- \`node scripts/check-v517-v521-private-pilot-execution.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`\n\n### Known risks\n- Fixture evidence only; production credentials, provider access, durable storage, live AI, real participants, and public launch remain intentionally blocked.\n`).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of selected) {
    text = text.replace(new RegExp(`## ${release.version.replace(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  }
  write("CHANGELOG.md", entries + "\n" + text.trimStart());
}

for (const [index, release] of selected.entries()) {
  write(`data/vedapath-${release.slug}.json`, JSON.stringify(makeJson(release, index), null, 2) + "\n");
  write(release.file, pageHtml(release));
  write(`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md`, docMd(release));
}

write("scripts/vedapath-private-pilot-execution-contracts.mjs", evaluatorJs());
write("scripts/check-v517-v521-private-pilot-execution.mjs", checkerJs());
updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateReadme();
updateChangelog();

console.log(`applied-private-pilot-execution ${latest.version} (${selected.length}/5)`);
