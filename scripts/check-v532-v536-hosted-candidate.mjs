import {
  createConsentStore,
  createFixtureSessionVerifier,
  createHostedPilotApp,
  createMemoryRateLimiter,
  createReviewerQueueStore,
  evaluateConsentLedgerServiceCandidate,
  evaluateHostedImplementationAuthorization,
  evaluateHostedSourceApiCandidate,
  evaluateReviewerIdentityQueueCandidate,
  hostedCandidatePacket,
  redactEnvironmentProfile,
  validateEnvironmentProfile
} from "./vedapath-hosted-candidate-contracts.mjs";

const releases = ["v5.3.2", "v5.3.3", "v5.3.4", "v5.3.5", "v5.3.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(`Unknown --through=${through}`);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const profile = {
  environment: "local",
  serviceName: "vedapath-hosted-candidate",
  publicOrigin: "http://127.0.0.1:8101",
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
  {
    id: "bg-2-48-steadiness",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 2.48",
    rightsStatus: "reviewed-fixture",
    excerpt: "Steadiness in action without clinging to the result."
  },
  {
    id: "bg-11-32-time",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 11.32",
    rightsStatus: "reviewed-fixture",
    excerpt: "The cosmic form is identified with world-transforming Time."
  }
];

function makeApp(featureLevel = 5, rateLimiter) {
  return createHostedPilotApp({
    environment: profile,
    sourceRecords: sources,
    featureLevel,
    rateLimiter,
    sessionVerifier: createFixtureSessionVerifier([
      { session: "reviewer-demo", actor: { id: "reviewer-001", role: "reviewer", subject: "reviewer-001" } },
      { session: "participant-demo", actor: { id: "participant-001", role: "participant", subject: "pilot-participant-001" } }
    ]),
    queueStore: createReviewerQueueStore([
      { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null }
    ], { now: () => "2026-07-19T00:00:00.000Z" }),
    consentStore: createConsentStore([], { now: () => "2026-07-19T00:00:00.000Z" })
  });
}

async function call(app, path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("origin")) headers.set("origin", "http://127.0.0.1:8097");
  return app.handle(new Request(`http://127.0.0.1:8101${path}`, { ...init, headers }));
}

async function body(response) {
  return response.json();
}

const checks = [
  async () => {
    const safe = evaluateHostedImplementationAuthorization({
      decision: "authorize-candidate",
      scope: "hosted-candidate-only",
      packet: [
        "scope:hosted-candidate-only",
        "pattern:edge-worker-relational",
        "frontend:static-pages",
        "secrets:references-only",
        "storage:ephemeral-adapter",
        "rollback:required"
      ],
      vendor: "not-selected",
      region: "review-required",
      deploymentAuthorized: false,
      productionStorage: false,
      telemetryEnabled: false,
      liveAi: false,
      publicLaunch: false
    });
    assert(safe.approved, "bounded hosted implementation authorization should pass");
    assert(safe.authorizedCapability === "build-and-test-provider-neutral-candidate", "authorization must remain candidate-only");
    assert(hostedCandidatePacket("authorization", safe).approved, "authorization packet should wrap");
    const unsafe = evaluateHostedImplementationAuthorization({
      decision: "authorize-candidate",
      scope: "production",
      packet: [],
      vendor: "bound",
      deploymentAuthorized: true,
      publicLaunch: true
    });
    assert(!unsafe.approved, "production or public authorization must fail");
  },
  async () => {
    const valid = validateEnvironmentProfile(profile);
    assert(valid.approved, `safe environment profile should pass: ${valid.violations.join(", ")}`);
    const redacted = JSON.stringify(redactEnvironmentProfile(profile));
    assert(!redacted.includes("SESSION_VERIFIER"), "redacted profile must hide session reference names");
    assert(!redacted.includes("REVIEW_STORE"), "redacted profile must hide review reference names");
    assert(!redacted.includes("CONSENT_STORE"), "redacted profile must hide consent reference names");
    assert(redacted.includes("binding://[configured]"), "redacted profile should confirm configured references");
    assert(!validateEnvironmentProfile({ ...profile, secretRefs: { ...profile.secretRefs, sessionVerifier: "literal-secret" } }).approved, "literal secret must fail");
    assert(!validateEnvironmentProfile({ ...profile, surprise: true }).approved, "unknown environment key must fail");
    assert(!validateEnvironmentProfile({ ...profile, environment: "preview", publicOrigin: "http://preview.example" }).approved, "preview HTTP origin must fail");
  },
  async () => {
    const evaluation = evaluateHostedSourceApiCandidate({
      routes: ["GET /v1/health", "GET /v1/readiness", "GET /v1/sources/:id"],
      answerGeneration: false,
      mutationRoutes: 0,
      explicitNoSource: true,
      corsAllowlist: true,
      rateLimit: true,
      vendor: "not-selected",
      region: "review-required"
    });
    assert(evaluation.approved, "hosted Source API candidate contract should pass");
    const app = makeApp(3);
    const found = await call(app, "/v1/sources/bg-2-48-steadiness");
    const foundBody = await body(found);
    assert(found.status === 200 && foundBody.generatedAnswer === null, "known source should return without an answer");
    assert(foundBody.mutation === false, "source response must be read-only");
    assert((await call(app, "/v1/sources/unknown")).status === 404, "unknown source should be explicit no-source");
    assert((await call(app, "/v1/sources/bg-2-48-steadiness", { method: "POST" })).status === 405, "source mutation should fail");
    assert((await call(app, "/v1/sources/bg-2-48-steadiness", { headers: { origin: "https://not-allowed.example" } })).status === 403, "unknown origin should fail");
    const limited = makeApp(3, createMemoryRateLimiter({ limit: 1, now: () => 1000 }));
    assert((await call(limited, "/v1/health", { headers: { "x-client-key": "rate-test" } })).status === 200, "first rate-limited request should pass");
    assert((await call(limited, "/v1/health", { headers: { "x-client-key": "rate-test" } })).status === 429, "second rate-limited request should fail");
  },
  async () => {
    const evaluation = evaluateReviewerIdentityQueueCandidate({
      identityMode: "fixture-session-verifier",
      roles: ["reviewer", "participant"],
      persistence: "ephemeral",
      appendOnlyAudit: true,
      idempotentTransitions: true,
      vendor: "not-selected",
      region: "review-required"
    });
    assert(evaluation.approved, "reviewer identity and queue candidate contract should pass");
    const app = makeApp(4);
    assert((await call(app, "/v1/review-queue")).status === 401, "queue should require a session");
    assert((await call(app, "/v1/review-queue", { headers: { authorization: "Session participant-demo" } })).status === 403, "participant should not read reviewer queue");
    assert((await call(app, "/v1/review-queue", { headers: { authorization: "Session reviewer-demo" } })).status === 200, "reviewer should read queue");
    const claimInit = {
      method: "POST",
      headers: { authorization: "Session reviewer-demo", "content-type": "application/json", "idempotency-key": "claim-001" },
      body: JSON.stringify({ nextStatus: "claimed" })
    };
    const claim = await call(app, "/v1/review-queue/review-bg-2-48/transitions", claimInit);
    assert(claim.status === 200 && !(await body(claim)).replayed, "reviewer should claim a ticket once");
    const replay = await body(await call(app, "/v1/review-queue/review-bg-2-48/transitions", claimInit));
    assert(replay.replayed === true && replay.event.sequence === 1, "duplicate transition should replay without another event");
    const approval = await body(await call(app, "/v1/review-queue/review-bg-2-48/transitions", {
      method: "POST",
      headers: { authorization: "Session reviewer-demo", "content-type": "application/json", "idempotency-key": "approve-001" },
      body: JSON.stringify({ nextStatus: "approved", note: "Citation and boundary reviewed." })
    }));
    assert(approval.ok && approval.event.sequence === 2, "reviewer should approve with a traceable note");
    const audit = await body(await call(app, "/v1/review-audit", { headers: { authorization: "Session reviewer-demo" } }));
    assert(audit.appendOnly && audit.events.length === 2, "audit should remain append-only and idempotent");
  },
  async () => {
    const evaluation = evaluateConsentLedgerServiceCandidate({
      identityMode: "fixture-session-verifier",
      persistence: "ephemeral",
      appendOnly: true,
      effectiveProjection: true,
      idempotentEvents: true,
      telemetryDefault: "off",
      vendor: "not-selected",
      region: "review-required"
    });
    assert(evaluation.approved, "consent ledger service candidate contract should pass");
    const app = makeApp(5);
    const append = (type, key) => call(app, "/v1/consent-events", {
      method: "POST",
      headers: { authorization: "Session participant-demo", "content-type": "application/json", "idempotency-key": key },
      body: JSON.stringify({ type, purpose: "private-pilot-learning", scope: ["source-feedback", "pilot-session"] })
    });
    const grant = await body(await append("consent.granted", "consent-001"));
    assert(grant.ok && grant.effective.purposes[0].active, "grant should activate effective consent");
    const replay = await body(await append("consent.granted", "consent-001"));
    assert(replay.replayed && replay.event.sequence === 1, "duplicate consent event should replay");
    const active = await body(await call(app, "/v1/consent", { headers: { authorization: "Session participant-demo" } }));
    assert(active.purposes[0].active && active.eventCount === 1, "effective consent should derive from one append-only event");
    const withdrawn = await body(await append("consent.withdrawn", "consent-002"));
    assert(!withdrawn.effective.purposes[0].active, "withdrawal should deactivate effective consent");
    assert((await append("export.requested", "consent-003")).status === 201, "export request should append");
    assert((await append("deletion.requested", "consent-004")).status === 201, "deletion request should append");
    const readiness = await body(await call(app, "/v1/readiness"));
    assert(readiness.featureLevel === 5 && readiness.queuePersistence === "ephemeral" && readiness.consentPersistence === "ephemeral", "integrated candidate must expose ephemeral persistence");
    assert(!readiness.deploymentAuthorized && !readiness.productionStorage && !readiness.telemetryEnabled && !readiness.publicLaunch, "all launch boundaries must remain closed");
  }
];

for (const check of checks.slice(0, count)) await check();
console.log(`hosted-candidate-ok ${count}/5`);
