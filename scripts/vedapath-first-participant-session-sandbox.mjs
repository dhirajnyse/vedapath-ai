import { createHash } from "node:crypto";

const EVENT_ORDER = ["session-started", "source-opened", "reflection-recorded-locally", "session-ended"];
const DIRECT_IDENTITY_KEYS = new Set(["email", "fullName", "name", "phone", "phoneNumber"]);

function containsDirectIdentity(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) => DIRECT_IDENTITY_KEYS.has(key) || containsDirectIdentity(child));
}

function transcriptDigest(events) {
  return createHash("sha256").update(JSON.stringify(events.map(({ type, at }) => ({ type, at })))).digest("hex");
}

export function runFirstParticipantSessionSandbox(input = {}) {
  const blockers = [];
  const startedAt = Number(input.startedAt);
  const endedAt = Number(input.endedAt);
  const durationSeconds = endedAt - startedAt;
  const events = Array.isArray(input.events) ? input.events : [];

  if (input.activationDecision !== "one-private-invitation-authorized-not-issued") blockers.push("activation-decision-required");
  if (input.dryRunStatus !== "invitation-dry-run-valid-not-issued") blockers.push("valid-invitation-dry-run-required");
  if (input.revocationStatus !== "revocation-drill-valid-no-live-invitation") blockers.push("revocation-drill-proof-required");
  if (!/^participant:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.participantId || ""))) blockers.push("pseudonymous-participant-required");
  if (input.consent !== "recorded-for-sandbox") blockers.push("sandbox-consent-required");
  if (!Number.isInteger(startedAt) || !Number.isInteger(endedAt) || durationSeconds <= 0 || durationSeconds > 30 * 60) blockers.push("session-duration-must-be-within-30-minutes");
  if (input.readOnly !== true) blockers.push("read-only-mode-required");
  if (input.localOnly !== true) blockers.push("local-only-mode-required");
  if (input.networkEnabled === true) blockers.push("network-must-be-disabled");
  if (input.persistenceEnabled === true) blockers.push("persistence-must-be-disabled");
  if (input.liveModelEnabled === true) blockers.push("live-model-must-be-disabled");
  if (input.writeRoutes?.length) blockers.push("write-routes-forbidden");
  if (containsDirectIdentity(input)) blockers.push("direct-identity-forbidden");
  if (Number(input.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const eventTypes = events.map((event) => event?.type);
  if (eventTypes.length !== EVENT_ORDER.length || eventTypes.some((type, index) => type !== EVENT_ORDER[index])) blockers.push("sandbox-event-order-invalid");
  if (events.some((event, index) => !Number.isInteger(Number(event?.at)) || Number(event.at) < startedAt || Number(event.at) > endedAt || (index && Number(event.at) < Number(events[index - 1]?.at)))) blockers.push("sandbox-event-timeline-invalid");
  if (events.some((event) => Object.keys(event || {}).some((key) => !["type", "at", "sourceId", "reflectionLength"].includes(key)))) blockers.push("sandbox-event-field-not-allowlisted");

  const valid = blockers.length === 0;
  return {
    schema: "vedapath.first-participant-session-sandbox.v1",
    status: valid ? "sandbox-session-complete-no-participant-created" : "sandbox-session-blocked",
    valid,
    blockers,
    durationSeconds: valid ? durationSeconds : 0,
    eventCount: valid ? events.length : 0,
    transcriptDigest: valid ? transcriptDigest(events) : null,
    simulatedSessionCompleted: valid,
    participantCreated: false,
    invitationIssued: false,
    sessionStarted: false,
    networkRequests: 0,
    durableWrites: 0,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function firstParticipantSessionSandboxPacket(result) {
  if (!result || result.schema !== "vedapath.first-participant-session-sandbox.v1") {
    throw new TypeError("A VedaPath first participant session sandbox result is required.");
  }
  return [
    "VedaPath First Participant Session Sandbox",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Simulated duration seconds: ${result.durationSeconds}`,
    `Transcript digest: ${result.transcriptDigest || "not-created"}`,
    "Participant created: false",
    "Invitation issued: false",
    "Real session started: false",
    "Network requests: 0",
    "Durable writes: 0",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}
