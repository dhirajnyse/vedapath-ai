import { createHash } from "node:crypto";

const EVENT_ORDER = ["session-opened", "source-viewed", "boundary-acknowledged", "session-closed"];
const EVENT_FIELDS = new Set(["type", "at", "statusCode", "latencyMs"]);

function namedOwner(value) {
  return /^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(value || ""));
}

function eventDigest(events) {
  return createHash("sha256").update(JSON.stringify(events)).digest("hex");
}

export function evaluateFirstSessionObservability(input = {}) {
  const blockers = [];
  const startedAt = Number(input.startedAt);
  const endedAt = Number(input.endedAt);
  const events = Array.isArray(input.events) ? input.events : [];

  if (input.consentStatus !== "consent-handshake-fixture-valid-no-participant") blockers.push("consent-handshake-fixture-required");
  if (!/^session-fixture:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.sessionId || ""))) blockers.push("session-fixture-id-required");
  if (!/^participant:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.participantId || ""))) blockers.push("pseudonymous-participant-required");
  if (!namedOwner(input.rollbackOwner)) blockers.push("named-rollback-owner-required");
  if (!/^[a-f0-9]{64}$/.test(String(input.checkpointDigest || ""))) blockers.push("rollback-checkpoint-digest-required");
  if (input.telemetryMode !== "local-aggregate-only") blockers.push("local-aggregate-telemetry-required");
  if (!Number.isInteger(startedAt) || !Number.isInteger(endedAt) || endedAt <= startedAt || endedAt - startedAt > 30 * 60) blockers.push("fixture-duration-must-be-within-30-minutes");
  if (events.length !== EVENT_ORDER.length || events.some((event, index) => event?.type !== EVENT_ORDER[index])) blockers.push("event-order-invalid");
  if (events.some((event) => Object.keys(event || {}).some((key) => !EVENT_FIELDS.has(key)))) blockers.push("event-field-not-allowlisted");
  if (events.some((event, index) => !Number.isInteger(Number(event?.at)) || Number(event.at) < startedAt || Number(event.at) > endedAt || (index > 0 && Number(event.at) < Number(events[index - 1]?.at)))) blockers.push("event-timeline-invalid");
  if (events.some((event) => !Number.isInteger(Number(event?.statusCode)) || Number(event.statusCode) < 100 || Number(event.statusCode) > 599)) blockers.push("event-status-code-invalid");
  if (events.some((event) => !Number.isInteger(Number(event?.latencyMs)) || Number(event.latencyMs) < 0 || Number(event.latencyMs) > 10000)) blockers.push("event-latency-invalid");
  if (input.rawContentCaptured === true) blockers.push("raw-content-capture-forbidden");
  if (input.exportEnabled === true) blockers.push("telemetry-export-forbidden");
  if (input.providerConnected === true) blockers.push("provider-must-remain-disconnected");
  if (input.networkEnabled === true) blockers.push("network-must-remain-disabled");
  if (input.sessionStarted === true) blockers.push("live-session-must-remain-not-started");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const ready = blockers.length === 0;
  return {
    schema: "vedapath.first-session-observability.v1",
    status: ready ? "first-session-observability-ready-no-live-session" : "first-session-observability-blocked",
    ready,
    blockers,
    eventCount: ready ? events.length : 0,
    eventDigest: ready ? eventDigest(events) : null,
    rollbackAvailable: ready,
    rawContentCaptured: false,
    telemetryExported: false,
    providerConnected: false,
    networkRequests: 0,
    sessionStarted: false,
    participantCreated: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function firstSessionObservabilityPacket(result) {
  if (!result || result.schema !== "vedapath.first-session-observability.v1") {
    throw new TypeError("A VedaPath first-session observability result is required.");
  }
  return [
    "VedaPath First-Session Observability and Rollback",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Events: ${result.eventCount}`,
    `Event digest: ${result.eventDigest || "not-created"}`,
    `Rollback available: ${result.rollbackAvailable}`,
    "Raw content captured: false",
    "Telemetry exported: false",
    "Network requests: 0",
    "Live session started: false",
    "Participant created: false",
    "Public launch: blocked"
  ].join("\n");
}
