import { applyRightsQueueAction, normalizeRightsQueueRecord } from "./vedapath-rights-operations-queue.mjs";

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function cleanId(value, label) {
  const id = String(value || "").trim().slice(0, 100);
  if (!/^[a-zA-Z0-9._:-]+$/.test(id)) throw new Error(label + " is required and may contain letters, numbers, dot, colon, dash, and underscore.");
  return id;
}

export function createRightsQueueRepository(seedRecords = []) {
  const records = new Map();
  const events = new Map();

  for (const seed of seedRecords) {
    const record = normalizeRightsQueueRecord(seed);
    if (!record.id) throw new Error("Every seed record requires an id.");
    records.set(record.id, { ...record, version: Math.max(1, Number(seed.version) || 1), audit: [] });
  }

  function get(candidateId) {
    const record = records.get(String(candidateId || ""));
    return record ? copy(record) : null;
  }

  function transition(input = {}) {
    const candidateId = cleanId(input.candidate_id, "Candidate id");
    const eventId = cleanId(input.event_id, "Event id");
    if (events.has(eventId)) return { ok: true, idempotent: true, event: copy(events.get(eventId)), record: get(candidateId) };
    const current = records.get(candidateId);
    if (!current) return { ok: false, conflict: false, reason: "Candidate not found.", record: null, event: null };
    const expectedVersion = Number(input.expected_version);
    if (!Number.isInteger(expectedVersion) || expectedVersion !== current.version) {
      return { ok: false, conflict: true, reason: "Version conflict.", expected_version: expectedVersion, current_version: current.version, record: get(candidateId), event: null };
    }

    const result = applyRightsQueueAction(current, input.action, { role: input.reviewer_role }, { now: input.occurred_at || "repository-preview" });
    if (!result.ok) return { ok: false, conflict: false, reason: result.decision.reason, record: get(candidateId), event: null };
    const event = {
      ...result.event,
      schema: "vedapath.rights-queue-persistence-event.v1",
      release: "v4.9.5",
      event_id: eventId,
      version_before: current.version,
      version_after: current.version + 1,
      identity_provider_verified: false,
      publication_state: "blocked",
      registry_merge: "manual-only"
    };
    const next = {
      ...result.record,
      version: current.version + 1,
      publication_state: "blocked",
      registry_merge: "manual-only",
      audit: current.audit.concat([event])
    };
    records.set(candidateId, next);
    events.set(eventId, event);
    return { ok: true, idempotent: false, record: get(candidateId), event: copy(event) };
  }

  function snapshot() {
    return Array.from(records.values()).map(copy);
  }

  return { get, transition, snapshot };
}

export const rightsQueueRepositoryBoundary = Object.freeze({
  release: "v4.9.5",
  implementation: "provider-neutral-in-memory-reference",
  optimistic_concurrency: true,
  idempotent_events: true,
  durable_provider: "not-connected",
  identity_provider: "not-connected",
  publication: "blocked",
  registry_merge: "manual-only",
  public_launch: "blocked"
});
