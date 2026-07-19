import {
  evaluateFounderHostedPilotReviewGate,
  evaluateBackendProviderDecision,
  createSourceApi,
  evaluateSourceApiMinimalEndpoint,
  createReviewerQueue,
  evaluateReviewerQueueMinimalBackend,
  createConsentLedger,
  evaluateConsentLedgerMinimalBackend,
  minimalBackendPacket
} from "./vedapath-minimal-backend-contracts.mjs";

const releases = ["v5.2.7", "v5.2.8", "v5.2.9", "v5.3.0", "v5.3.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(`Unknown --through=${through}`);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const sourceRecords = [
  { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture", excerpt: "Steadiness in action" },
  { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", rightsStatus: "reviewed-fixture", excerpt: "Time in the cosmic form" }
];

const checks = [
  () => {
    const ok = evaluateFounderHostedPilotReviewGate({ decision: "authorize-spike", scope: "bounded-local-spike-only", packet: ["evidence:gap-map", "evidence:threat-model", "evidence:privacy-ledger", "evidence:rights-pack", "decision:review"] });
    assert(ok.approved, "founder hosted-pilot review should pass");
    assert(!evaluateFounderHostedPilotReviewGate({ decision: "authorize-spike", scope: "deploy-production", publicLaunch: true, packet: [] }).approved, "unsafe founder review should fail");
    assert(minimalBackendPacket("review", ok).approved, "review packet should wrap");
  },
  () => {
    const ok = evaluateBackendProviderDecision({ vendor: "not-selected", packet: ["pattern:edge-worker-relational", "frontend:static-pages", "region:founder-reviewed", "secrets:binding-only", "rollback:required"] });
    assert(ok.approved, "backend provider pattern should pass");
    assert(!evaluateBackendProviderDecision({ vendor: "bound-without-review", secret: "unsafe", packet: [] }).approved, "unsafe provider decision should fail");
  },
  () => {
    const api = createSourceApi(sourceRecords);
    const found = api.request("GET", "bg-2-48-steadiness");
    assert(found.status === 200 && found.body.generatedAnswer === null, "source API should return citation packet without answer");
    assert(api.request("GET", "unknown").status === 404, "source API should return explicit no-source");
    assert(api.request("POST", "bg-2-48-steadiness").status === 405, "source API must reject mutation");
    assert(evaluateSourceApiMinimalEndpoint({ method: "GET", source: found.body.source }).approved, "source endpoint contract should pass");
  },
  () => {
    const queue = createReviewerQueue([{ id: "review-1", sourceId: "bg-2-48-steadiness", status: "open", owner: null }]);
    assert(queue.transition("review-1", "claimed", { id: "reviewer-1", role: "reviewer" }).ok, "reviewer should claim ticket");
    assert(queue.transition("review-1", "approved", { id: "reviewer-1", role: "reviewer" }, "Citation and boundary reviewed.").ok, "reviewer should approve with note");
    assert(!queue.transition("review-1", "approved", { id: "reviewer-1", role: "reviewer" }, "again").ok, "invalid transition should fail");
    assert(evaluateReviewerQueueMinimalBackend({ tickets: queue.list(), events: queue.history(), identityMode: "fixture" }).approved, "review queue contract should pass");
  },
  () => {
    const ledger = createConsentLedger();
    const base = { subject: "pilot-participant-001", purpose: "Private pilot learning", scope: ["pilot-session"] };
    assert(ledger.append({ ...base, type: "consent.granted" }).ok, "consent grant should append");
    assert(ledger.append({ ...base, type: "consent.withdrawn" }).ok, "consent withdrawal should append");
    assert(ledger.append({ ...base, type: "export.requested" }).ok, "export request should append");
    assert(ledger.append({ ...base, type: "deletion.requested" }).ok, "deletion request should append");
    assert(!ledger.append({ ...base, subject: "real-name", type: "consent.granted" }).ok, "raw identity should fail");
    assert(evaluateConsentLedgerMinimalBackend({ events: ledger.list(), appendOnly: true }).approved, "consent ledger contract should pass");
  }
];

checks.slice(0, count).forEach((check) => check());
console.log(`minimal-backend-ok ${count}/5`);
