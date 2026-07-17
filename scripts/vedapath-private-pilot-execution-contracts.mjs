import crypto from "node:crypto";

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
  for (const item of required) if (!input.evidence?.includes(item)) blockers.push(`missing-evidence:${item}`);
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
  for (const scope of ["source:read", "answer:preview", "feedback:local"]) if (!scopes.includes(scope)) blockers.push(`missing-scope:${scope}`);
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
    if (events[index]?.type !== name) blockers.push(`event-order:${name}`);
    if (!Number.isInteger(events[index]?.at)) blockers.push(`event-time:${name}`);
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
  for (const item of required) if (!input.artifacts?.includes(item)) blockers.push(`missing-artifact:${item}`);
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
    `VedaPath ${label}`,
    `Status: ${result.status}`,
    `Approved: ${result.approved}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    "Credentials issued: false",
    "Token value issued: false",
    "Participant created: false",
    "Session started: false",
    "Provider connected: false",
    "Telemetry exported: false",
    "Public launch: blocked",
    `Next action: ${result.nextAction}`
  ].join("\n");
}
