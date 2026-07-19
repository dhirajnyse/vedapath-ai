import {
  createConsentStore,
  createHostedPilotApp,
  createReviewerQueueStore
} from "./vedapath-hosted-candidate-contracts.mjs";
import {
  createHostedDeploymentAdapter,
  createPilotPlatformApp,
  createRedactedOperationsRecorder,
  createSignedIdentityCandidate,
  createTransactionalCandidateStore,
  evaluateDurableStorageMigrationCandidate,
  evaluateHostedDeploymentAdapterCandidate,
  evaluatePrivatePilotOperationsGate,
  evaluateProductionIdentityCandidate,
  evaluateProviderRegionSelectionGate,
  executeDurableStorageMigration,
  pilotPlatformPacket,
  planDurableStorageMigration
} from "./vedapath-pilot-platform-contracts.mjs";

const releases = ["v5.3.7", "v5.3.8", "v5.3.9", "v5.4.0", "v5.4.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg?.split("=")[1] || releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(`Unknown --through=${through}`);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const closed = {
  providerBound: false,
  regionBound: false,
  deploymentAuthorized: false,
  productionCredentials: false,
  productionData: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

const environment = {
  environment: "local",
  serviceName: "vedapath-pilot-platform-candidate",
  publicOrigin: "http://127.0.0.1:8111",
  corsAllowlist: ["http://127.0.0.1:8097"],
  secretRefs: {
    sessionVerifier: "binding://SESSION_VERIFIER",
    reviewStore: "binding://REVIEW_STORE",
    consentStore: "binding://CONSENT_STORE"
  },
  vendor: "not-selected",
  region: "review-required",
  persistence: "ephemeral",
  deploymentAuthorized: false,
  productionStorage: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

const sources = [
  { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture", excerpt: "Steadiness in action without clinging to results." },
  { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", rightsStatus: "reviewed-fixture", excerpt: "The cosmic form is identified with world-transforming Time." }
];

const signingSecret = "vedapath-ephemeral-fixture-signing-key-2026";
const identity = createSignedIdentityCandidate({
  secret: signingSecret,
  issuer: "https://identity.candidate.vedapath.invalid",
  audience: "vedapath-private-pilot",
  now: () => 1_785_000_000
});

const reviewerToken = identity.issue({ subject: "reviewer-001", role: "reviewer", expiresIn: 600, tokenId: "reviewer-check" });
const participantToken = identity.issue({ subject: "pilot-participant-001", role: "participant", expiresIn: 600, tokenId: "participant-check" });

function makeHostedApp() {
  return createHostedPilotApp({
    environment,
    featureLevel: 5,
    sourceRecords: sources,
    sessionVerifier: identity,
    queueStore: createReviewerQueueStore([
      { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null }
    ], { now: () => "2026-07-19T00:00:00.000Z" }),
    consentStore: createConsentStore([], { now: () => "2026-07-19T00:00:00.000Z" })
  });
}

function makeAdapter() {
  return createHostedDeploymentAdapter({
    app: makeHostedApp(),
    bindingRefs: {
      sessionVerifier: "binding://SESSION_VERIFIER",
      reviewStore: "binding://REVIEW_STORE",
      consentStore: "binding://CONSENT_STORE"
    }
  });
}

async function call(app, path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("origin")) headers.set("origin", "http://127.0.0.1:8097");
  return app.handle(new Request(`http://127.0.0.1:8111${path}`, { ...init, headers }));
}

const checks = [
  async () => {
    const complete = evaluateProviderRegionSelectionGate({
      decision: "recommend-candidate",
      providerCandidate: "provider-a-candidate",
      regionCandidate: "residency-region-a",
      monthlyCostCap: 150,
      evidence: {
        dataResidency: true,
        rightsReview: true,
        privacyReview: true,
        securityReview: true,
        rollbackTest: true,
        exitPlan: true
      },
      ...closed
    });
    assert(complete.approved, `complete selection evidence should pass: ${complete.violations.join(", ")}`);
    assert(complete.recommendation?.operationalBinding === false, "recommendation must not bind a provider");
    assert(complete.selectedProvider === null && complete.selectedRegion === null, "selection gate must not perform selection");
    assert(pilotPlatformPacket("selection", complete).approved, "selection packet should wrap");
    assert(!evaluateProviderRegionSelectionGate({ ...complete, decision: "recommend-candidate", providerBound: true }).approved, "provider binding must fail");
    assert(!evaluateProviderRegionSelectionGate({ decision: "recommend-candidate", providerCandidate: "candidate", regionCandidate: "region", evidence: {}, monthlyCostCap: 0, ...closed }).approved, "missing evidence must fail");
  },
  async () => {
    const evaluation = evaluateHostedDeploymentAdapterCandidate({
      interface: "fetch-request-response",
      target: "provider-neutral",
      bindingMode: "references-only",
      noStore: true,
      failClosed: true,
      ...closed
    });
    assert(evaluation.approved && evaluation.adapterReady && !evaluation.deployable, "provider-neutral adapter candidate should pass without becoming deployable");
    const adapter = makeAdapter();
    const description = JSON.stringify(adapter.describe());
    assert(description.includes("redacted") && !description.includes("SESSION_VERIFIER"), "adapter description must redact binding values");
    const response = await adapter.fetch(new Request("http://127.0.0.1:8111/v1/health", { headers: { origin: "http://127.0.0.1:8097" } }));
    assert(response.status === 200, "adapter should forward a health request");
    assert(response.headers.get("x-vedapath-adapter") === "provider-neutral-candidate", "adapter should identify its bounded runtime");
    assert(response.headers.get("cache-control") === "no-store", "adapter must force no-store");
    const invalid = await adapter.fetch({ url: "/v1/health" });
    assert(invalid.status === 400, "adapter should fail closed for non-Request input");
  },
  async () => {
    const evaluation = evaluateDurableStorageMigrationCandidate({
      schemaVersion: 1,
      transactional: true,
      idempotent: true,
      integrityChecked: true,
      rollbackTested: true,
      persistence: "transactional-memory-candidate",
      ...closed
    });
    assert(evaluation.approved && evaluation.durableProvider === null, "migration candidate should pass without durable provider binding");
    const seed = { schemaVersion: 0, tables: { sources: [], reviewQueue: [], reviewAudit: [], consentEvents: [] }, migrations: [] };
    const plan = planDurableStorageMigration({
      migrationId: "migration-platform-v1",
      sources,
      reviewQueue: [{ id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null }],
      reviewAudit: [],
      consentEvents: []
    });
    const store = createTransactionalCandidateStore(seed);
    const before = store.integrity();
    const failed = executeDurableStorageMigration({ store, plan, simulateFailureAt: "reviewQueue" });
    assert(!failed.ok && store.integrity() === before && store.snapshot().schemaVersion === 0, "failed migration must roll back completely");
    const migrated = executeDurableStorageMigration({ store, plan });
    assert(migrated.ok && migrated.schemaVersion === 1 && store.snapshot().tables.sources.length === 2, "migration should commit all fixture tables");
    const replay = executeDurableStorageMigration({ store, plan });
    assert(replay.ok && replay.replayed && store.snapshot().migrations.length === 1, "migration retry must be idempotent");
  },
  async () => {
    const evaluation = evaluateProductionIdentityCandidate({
      mode: "signed-fixture-claims",
      expiryEnforced: true,
      issuerAudienceEnforced: true,
      roleEnforced: true,
      signatureEnforced: true,
      externalIdentityProvider: null,
      ...closed
    });
    assert(evaluation.approved && !evaluation.productionIdentity, "signed identity candidate should pass without production identity");
    assert(identity.verify(`Bearer ${reviewerToken}`)?.role === "reviewer", "valid signed reviewer token should verify");
    const expired = identity.issue({ subject: "reviewer-002", role: "reviewer", expiresIn: -1, tokenId: "expired" });
    assert(identity.verify(`Bearer ${expired}`) === null, "expired token must fail");
    const tampered = reviewerToken.slice(0, -1) + (reviewerToken.endsWith("a") ? "b" : "a");
    assert(identity.verify(`Bearer ${tampered}`) === null, "tampered token must fail");
    const app = makeHostedApp();
    assert((await call(app, "/v1/review-queue", { headers: { authorization: `Bearer ${reviewerToken}` } })).status === 200, "signed reviewer identity should open reviewer queue");
    assert((await call(app, "/v1/review-queue", { headers: { authorization: `Bearer ${participantToken}` } })).status === 403, "participant identity must not open reviewer queue");
  },
  async () => {
    const evaluation = evaluatePrivatePilotOperationsGate({
      mode: "redacted-technical-operations",
      healthChecks: true,
      incidentLifecycle: true,
      contentExcluded: true,
      reviewerOnly: true,
      rollbackReady: true,
      ...closed
    });
    assert(evaluation.approved && evaluation.privatePilotOperational && !evaluation.publicLaunchReady, "operations gate should pass only for private candidate operations");
    const operations = createRedactedOperationsRecorder({ now: () => "2026-07-19T00:00:00.000Z" });
    const platform = createPilotPlatformApp({ adapter: makeAdapter(), identityVerifier: identity, operations, featureLevel: 5 });
    const source = await call(platform, "/v1/sources/bg-2-48-steadiness", { headers: { authorization: `Bearer ${participantToken}` } });
    assert(source.status === 200, "platform wrapper should preserve hosted source behavior");
    const publicReady = await call(platform, "/v1/platform/readiness");
    const publicBody = await publicReady.json();
    assert(publicBody.ok && !publicBody.providerBound && !publicBody.publicLaunch, "platform readiness must expose closed binding and launch state");
    assert((await call(platform, "/v1/ops/readiness", { headers: { authorization: `Bearer ${participantToken}` } })).status === 403, "participant must not read operations detail");
    const reviewerReady = await call(platform, "/v1/ops/readiness", { headers: { authorization: `Bearer ${reviewerToken}` } });
    const report = await reviewerReady.json();
    assert(reviewerReady.status === 200 && report.eventCount >= 1 && !report.participantContent && !report.behavioralTelemetry, "reviewer operations report must stay technical and redacted");
    const incident = await call(platform, "/v1/ops/incidents", {
      method: "POST",
      headers: { authorization: `Bearer ${reviewerToken}`, "content-type": "application/json" },
      body: JSON.stringify({ code: "source_latency", severity: "medium", question: "must be excluded" })
    });
    assert(incident.status === 200 && operations.report().incident.status === "open", "reviewer should open a bounded incident");
    operations.record({ kind: "request", status: 200, route: "/v1/source", question: "private content", authorization: "secret" });
    const serialized = JSON.stringify(operations.report());
    assert(!serialized.includes("private content") && !serialized.includes("secret"), "operations recorder must discard participant content and authorization values");
  }
];

for (const check of checks.slice(0, count)) await check();
console.log(`pilot-platform-ok ${count}/5`);
