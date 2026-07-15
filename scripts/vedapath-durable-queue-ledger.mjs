import { createHash } from "node:crypto";

const ALLOWED_ACTIONS = new Set(["claim", "route", "hold", "mark-evidence-ready", "release-claim"]);
const ALLOWED_ROLES = new Set(["source-reviewer", "rights-reviewer", "release-reviewer"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash("sha256").update(canonical(value)).digest("hex");
}

function applyAction(record, action, actorRole) {
  const next = clone(record);
  if (action === "claim") next.ownerRole = actorRole;
  if (action === "route") next.reviewLane = actorRole;
  if (action === "hold") next.status = "held";
  if (action === "mark-evidence-ready") next.status = "evidence-ready";
  if (action === "release-claim") next.ownerRole = null;
  next.version += 1;
  next.publicationState = "blocked";
  next.registryMerge = "manual-only";
  return next;
}

export function createQueueLedger(seedRecords = []) {
  const records = {};
  for (const source of seedRecords) {
    if (!source || typeof source.id !== "string" || !source.id) throw new TypeError("Every seed record needs an id.");
    if (records[source.id]) throw new Error(`Duplicate seed record: ${source.id}`);
    records[source.id] = {
      id: source.id,
      status: source.status || "new",
      ownerRole: source.ownerRole || null,
      reviewLane: source.reviewLane || "source-reviewer",
      version: Number.isInteger(source.version) ? source.version : 1,
      publicationState: "blocked",
      registryMerge: "manual-only"
    };
  }
  return {
    schema: "vedapath.durable-queue-ledger.v1",
    seedRecords: clone(records),
    records,
    events: [],
    idempotency: {},
    headHash: "GENESIS",
    durableProvider: "not-connected",
    publicLaunch: "blocked"
  };
}

export function appendQueueEvent(ledger, command = {}) {
  if (!ledger || ledger.schema !== "vedapath.durable-queue-ledger.v1") throw new TypeError("A VedaPath queue ledger is required.");
  if (!ALLOWED_ACTIONS.has(command.action)) throw new Error("action-not-allowed");
  if (!ALLOWED_ROLES.has(command.actorRole)) throw new Error("role-not-allowed");
  if (typeof command.idempotencyKey !== "string" || command.idempotencyKey.length < 8) throw new Error("idempotency-key-required");
  if (ledger.idempotency[command.idempotencyKey]) return clone(ledger.idempotency[command.idempotencyKey]);

  const record = ledger.records[command.recordId];
  if (!record) throw new Error("record-not-found");
  if (record.version !== command.expectedVersion) throw new Error("version-conflict");
  if (command.action === "mark-evidence-ready" && command.actorRole === "release-reviewer") throw new Error("lane-role-mismatch");

  const nextRecord = applyAction(record, command.action, command.actorRole);
  const eventCore = {
    sequence: ledger.events.length + 1,
    eventId: String(command.eventId || `event-${ledger.events.length + 1}`),
    recordId: command.recordId,
    expectedVersion: command.expectedVersion,
    resultingVersion: nextRecord.version,
    action: command.action,
    actorRole: command.actorRole,
    idempotencyKey: command.idempotencyKey,
    previousHash: ledger.headHash,
    recordAfter: nextRecord
  };
  const event = { ...eventCore, hash: digest(eventCore) };
  ledger.records[command.recordId] = nextRecord;
  ledger.events.push(event);
  ledger.headHash = event.hash;

  const receipt = {
    accepted: true,
    eventId: event.eventId,
    record: clone(nextRecord),
    headHash: event.hash,
    publicationState: "blocked",
    registryMerge: "manual-only"
  };
  ledger.idempotency[command.idempotencyKey] = receipt;
  return clone(receipt);
}

export function verifyQueueLedger(ledger) {
  const errors = [];
  let previousHash = "GENESIS";
  for (let index = 0; index < ledger.events.length; index += 1) {
    const event = ledger.events[index];
    const { hash, ...core } = event;
    if (event.sequence !== index + 1) errors.push(`sequence:${index + 1}`);
    if (event.previousHash !== previousHash) errors.push(`previous-hash:${event.eventId}`);
    if (digest(core) !== hash) errors.push(`event-hash:${event.eventId}`);
    if (event.recordAfter.publicationState !== "blocked") errors.push(`publication:${event.eventId}`);
    previousHash = hash;
  }
  if (ledger.headHash !== previousHash) errors.push("head-hash");
  return { valid: errors.length === 0, errors, eventCount: ledger.events.length, headHash: previousHash };
}

export function replayQueueLedger(ledger) {
  const verification = verifyQueueLedger(ledger);
  if (!verification.valid) throw new Error(`ledger-invalid:${verification.errors.join(",")}`);
  const replay = createQueueLedger(Object.values(ledger.seedRecords));
  for (const event of ledger.events) {
    replay.records[event.recordId] = clone(event.recordAfter);
    replay.events.push(clone(event));
    replay.headHash = event.hash;
  }
  return { records: clone(replay.records), headHash: replay.headHash, eventCount: replay.events.length };
}
