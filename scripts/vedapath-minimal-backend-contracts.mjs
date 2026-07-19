import { createHash } from "node:crypto";

export const MINIMAL_BACKEND_BOUNDARY = "Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.";
const forbidden = ["apiKey", "secret", "password", "token", "privateKey"];

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

function common(input = {}) {
  const violations = [];
  for (const key of forbidden) if (input[key]) violations.push(`forbidden credential field: ${key}`);
  if (input.deploymentAuthorized) violations.push("deployment must remain unauthorized");
  if (input.productionStorage) violations.push("production storage must remain disabled");
  if (input.liveAi) violations.push("live AI must remain disabled");
  if (input.telemetryEnabled) violations.push("telemetry must remain disabled");
  if (input.publicLaunch) violations.push("public launch must remain disabled");
  return violations;
}

function result(kind, input, violations) {
  return { kind, approved: violations.length === 0, violations, digest: digest({ kind, input }), boundary: MINIMAL_BACKEND_BOUNDARY };
}

function setOf(value) { return new Set(Array.isArray(value) ? value : []); }

export function evaluateFounderHostedPilotReviewGate(input = {}) {
  const violations = common(input);
  const packet = setOf(input.packet);
  ["evidence:gap-map", "evidence:threat-model", "evidence:privacy-ledger", "evidence:rights-pack"].forEach((item) => { if (!packet.has(item)) violations.push(`missing ${item}`); });
  if (!["hold", "rework", "authorize-spike"].includes(input.decision)) violations.push("decision must be hold, rework, or authorize-spike");
  if (input.decision === "authorize-spike" && input.scope !== "bounded-local-spike-only") violations.push("spike authorization requires bounded-local-spike-only scope");
  return result("founder-hosted-pilot-review-gate", input, violations);
}

export function evaluateBackendProviderDecision(input = {}) {
  const violations = common(input);
  const packet = setOf(input.packet);
  ["pattern:edge-worker-relational", "frontend:static-pages", "region:founder-reviewed", "secrets:binding-only", "rollback:required"].forEach((item) => { if (!packet.has(item)) violations.push(`missing ${item}`); });
  if (input.vendor && input.vendor !== "not-selected") violations.push("vendor binding requires a separate approved decision");
  return result("backend-provider-decision", input, violations);
}

export function createSourceApi(records = []) {
  const index = new Map(records.map((record) => [record.id, structuredClone(record)]));
  return {
    getSource(id) {
      const record = index.get(id);
      if (!record) return { status: 404, body: { code: "source_not_found", source: null, generatedAnswer: null } };
      if (!record.citation || !record.family || record.rightsStatus !== "reviewed-fixture") return { status: 409, body: { code: "source_not_ready", source: null, generatedAnswer: null } };
      return { status: 200, body: { source: structuredClone(record), generatedAnswer: null, mutation: false } };
    },
    request(method, id) {
      if (method !== "GET") return { status: 405, body: { code: "method_not_allowed", allowed: ["GET"] } };
      return this.getSource(id);
    }
  };
}

export function evaluateSourceApiMinimalEndpoint(input = {}) {
  const violations = common(input);
  if (input.method !== "GET") violations.push("source endpoint must be read-only GET");
  if (!input.source?.id || !input.source?.citation || !input.source?.family) violations.push("source packet requires id, citation, and family");
  if (input.source?.rightsStatus !== "reviewed-fixture") violations.push("source packet requires reviewed-fixture rights status");
  if (input.generatedAnswer) violations.push("endpoint must not generate answers");
  return result("source-api-minimal-endpoint", input, violations);
}

const queueTransitions = new Map([
  ["open", new Set(["claimed"])],
  ["claimed", new Set(["approved", "changes-requested", "open"])],
  ["changes-requested", new Set(["claimed"])],
  ["approved", new Set(["open"])]
]);

export function createReviewerQueue(seed = []) {
  const tickets = new Map(seed.map((ticket) => [ticket.id, structuredClone(ticket)]));
  const events = [];
  return {
    list() { return [...tickets.values()].map((ticket) => structuredClone(ticket)); },
    history() { return events.map((event) => structuredClone(event)); },
    transition(id, nextStatus, actor, note = "") {
      const ticket = tickets.get(id);
      if (!ticket) return { ok: false, code: "ticket_not_found" };
      if (!queueTransitions.get(ticket.status)?.has(nextStatus)) return { ok: false, code: "invalid_transition", status: ticket.status };
      if (!actor?.id || actor.role !== "reviewer") return { ok: false, code: "reviewer_required" };
      if (["approved", "changes-requested"].includes(nextStatus) && !note.trim()) return { ok: false, code: "decision_note_required" };
      const previous = ticket.status;
      ticket.status = nextStatus;
      if (nextStatus === "claimed") ticket.owner = actor.id;
      events.push({ sequence: events.length + 1, ticketId: id, previous, next: nextStatus, actor: actor.id, note: note.trim() || null });
      return { ok: true, ticket: structuredClone(ticket), event: structuredClone(events.at(-1)) };
    }
  };
}

export function evaluateReviewerQueueMinimalBackend(input = {}) {
  const violations = common(input);
  if (!Array.isArray(input.tickets) || input.tickets.length < 1) violations.push("queue requires tickets");
  if (!Array.isArray(input.events)) violations.push("queue requires append-only events");
  if (input.identityMode !== "fixture") violations.push("identity must remain fixture-only");
  return result("reviewer-queue-minimal-backend", input, violations);
}

const consentTypes = new Set(["consent.granted", "consent.withdrawn", "export.requested", "deletion.requested"]);

export function createConsentLedger(seed = []) {
  const events = seed.map((event) => structuredClone(event));
  return {
    append(event) {
      if (!consentTypes.has(event.type)) return { ok: false, code: "invalid_event_type" };
      if (!event.subject || !event.subject.startsWith("pilot-participant-")) return { ok: false, code: "pseudonymous_subject_required" };
      if (!event.purpose || !Array.isArray(event.scope) || event.scope.length === 0) return { ok: false, code: "purpose_and_scope_required" };
      const stored = { ...structuredClone(event), sequence: events.length + 1 };
      events.push(stored);
      return { ok: true, event: structuredClone(stored) };
    },
    list() { return events.map((event) => structuredClone(event)); }
  };
}

export function evaluateConsentLedgerMinimalBackend(input = {}) {
  const violations = common(input);
  if (!Array.isArray(input.events) || input.events.length < 1) violations.push("consent ledger requires events");
  if (input.events?.some((event) => !consentTypes.has(event.type))) violations.push("ledger contains an unsupported event type");
  if (input.events?.some((event) => !String(event.subject || "").startsWith("pilot-participant-"))) violations.push("ledger subjects must be pseudonymous");
  if (!input.appendOnly) violations.push("ledger must be append-only");
  return result("consent-ledger-minimal-backend", input, violations);
}

export function minimalBackendPacket(label, evaluation) {
  return { label, approved: Boolean(evaluation.approved), digest: evaluation.digest, violations: evaluation.violations, boundary: evaluation.boundary };
}
