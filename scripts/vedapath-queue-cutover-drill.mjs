import { createHash } from "node:crypto";
import { replayQueueLedger, verifyQueueLedger } from "./vedapath-durable-queue-ledger.mjs";

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

export function createQueueCutoverSnapshot(ledger) {
  const verification = verifyQueueLedger(ledger);
  if (!verification.valid) throw new Error(`source-ledger-invalid:${verification.errors.join("|")}`);
  const replay = replayQueueLedger(ledger);
  const records = Object.fromEntries(Object.entries(replay.records).sort(([left], [right]) => left.localeCompare(right)));
  const snapshot = {
    schema: "vedapath.queue-cutover-snapshot.v1",
    eventCount: ledger.events.length,
    headHash: ledger.headHash,
    records,
    recordsDigest: digest(records)
  };
  return { ...snapshot, snapshotDigest: digest(snapshot) };
}

export function runQueueCutoverDrill({ sourceLedger, targetRecords, expectedHeadHash } = {}) {
  try {
    const snapshot = createQueueCutoverSnapshot(sourceLedger);
    const replayedTarget = targetRecords || snapshot.records;
    const targetDigest = digest(replayedTarget);
    const errors = [];
    if (targetDigest !== snapshot.recordsDigest) errors.push("target-record-divergence");
    if (expectedHeadHash && expectedHeadHash !== snapshot.headHash) errors.push("checkpoint-head-mismatch");
    const drillPassed = errors.length === 0;
    return {
      schema: "vedapath.queue-cutover-drill.v1",
      status: drillPassed ? "cutover-drill-passed-no-migration" : "cutover-drill-failed",
      drillPassed,
      errors,
      snapshotDigest: snapshot.snapshotDigest,
      sourceRecordsDigest: snapshot.recordsDigest,
      targetRecordsDigest: targetDigest,
      eventCount: snapshot.eventCount,
      headHash: snapshot.headHash,
      rollbackRequired: !drillPassed,
      durableProviderConnected: false,
      productionMigrationRun: false,
      queueWritesEnabled: false,
      publication: "blocked",
      publicLaunch: "blocked"
    };
  } catch (error) {
    return {
      schema: "vedapath.queue-cutover-drill.v1",
      status: "cutover-drill-failed",
      drillPassed: false,
      errors: [String(error.message || error)],
      rollbackRequired: true,
      durableProviderConnected: false,
      productionMigrationRun: false,
      queueWritesEnabled: false,
      publication: "blocked",
      publicLaunch: "blocked"
    };
  }
}

export function queueCutoverPacket(result) {
  if (!result || result.schema !== "vedapath.queue-cutover-drill.v1") {
    throw new TypeError("A VedaPath queue cutover drill result is required.");
  }
  return [
    "VedaPath Durable Queue Cutover Drill",
    `Status: ${result.status}`,
    `Events replayed: ${result.eventCount || 0}`,
    `Errors: ${result.errors.length ? result.errors.join(", ") : "none"}`,
    `Rollback required: ${result.rollbackRequired}`,
    "Production migration run: false",
    "Queue writes enabled: false",
    "Publication: blocked",
    "Public launch: blocked"
  ].join("\n");
}
