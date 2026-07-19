import { evaluatePrivatePilotOperationsGate } from "./vedapath-pilot-platform-contracts.mjs";
import { createDeploymentReadinessFixture } from "./serve-vedapath-deployment-readiness.mjs";
import {
  evaluateDurableDatabaseCutoverRehearsal,
  evaluateHostedProviderBindingDecision,
  evaluateManagedSecretsEnvironmentContract,
  evaluatePrivatePilotDeploymentReadinessGate,
  evaluateReviewerIdentityProvisioningRehearsal
} from "./vedapath-deployment-readiness-contracts.mjs";
import {
  createDurableDatabaseAdapterCandidate,
  createExternalReviewerIdentityCandidate,
  createHostedActivationApp,
  createManagedSecretStoreAdapter,
  evaluateDurableDatabaseAdapterEvidence,
  evaluateExternalReviewerIdentityEvidence,
  evaluateFounderHostedPilotActivationDecision,
  evaluateIntegratedHostedActivationGate,
  evaluateManagedSecretStoreAdapterEvidence,
  evaluateProviderManifestDryRun,
  hostedActivationPacket
} from "./vedapath-hosted-activation-contracts.mjs";

const releases = ["v5.4.7", "v5.4.8", "v5.4.9", "v5.5.0", "v5.5.1"];
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
  managedSecretStoreBound: false,
  durableDatabaseBound: false,
  externalIdentityBound: false,
  deploymentAuthorized: false,
  productionCredentials: false,
  productionData: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

function deploymentReadiness() {
  const bindingDecision = evaluateHostedProviderBindingDecision({
    decision: "approve-controlled-implementation",
    providerCandidate: "hosted-provider-candidate",
    regionCandidate: "residency-region-candidate",
    runtimeProfile: "edge-fetch-runtime",
    decidedBy: "founder-001",
    reviewedBy: "reviewer-001",
    bindingRefs: {
      runtime: "binding://HOSTED_RUNTIME",
      storage: "binding://DURABLE_STORE",
      identity: "binding://IDENTITY_PROVIDER",
      secrets: "binding://SECRET_MANAGER"
    },
    evidence: {
      dataResidency: true,
      rightsReview: true,
      privacyReview: true,
      securityReview: true,
      rollbackTest: true,
      exitPlan: true,
      budgetApproved: true,
      supportModel: true
    },
    ...closed
  });
  const secretsContract = evaluateManagedSecretsEnvironmentContract({
    profile: "private-pilot",
    serviceName: "vedapath-private-pilot",
    publicOrigin: "https://pilot.vedapath.invalid",
    publicConfig: { LOG_LEVEL: "info", CACHE_MODE: "no-store" },
    secretRefs: {
      SOURCE_STORE: "secret://SOURCE_STORE",
      REVIEW_STORE: "secret://REVIEW_STORE",
      IDENTITY_VERIFIER: "secret://IDENTITY_VERIFIER",
      SESSION_SIGNING_KEY: "secret://SESSION_SIGNING_KEY"
    },
    inlineSecrets: {},
    ...closed
  });
  const cutoverRehearsal = evaluateDurableDatabaseCutoverRehearsal({
    mode: "blue-green-memory-rehearsal",
    snapshotVerified: true,
    parityVerified: true,
    idempotencyVerified: true,
    rollbackVerified: true,
    durableProvider: null,
    ...closed
  });
  const reviewerProvisioning = evaluateReviewerIdentityProvisioningRehearsal({
    mode: "synthetic-maker-checker-provisioning",
    makerCheckerVerified: true,
    leastPrivilegeVerified: true,
    activationVerified: true,
    revocationVerified: true,
    auditVerified: true,
    externalIdentityProvider: null,
    ...closed
  });
  const operationsGate = evaluatePrivatePilotOperationsGate({
    mode: "redacted-technical-operations",
    healthChecks: true,
    incidentLifecycle: true,
    contentExcluded: true,
    reviewerOnly: true,
    rollbackReady: true,
    ...closed
  });
  return evaluatePrivatePilotDeploymentReadinessGate({
    evidence: { bindingDecision, secretsContract, cutoverRehearsal, reviewerProvisioning, operationsGate },
    privateDemoChecks: true,
    rollbackDrill: true,
    founderReview: true,
    ...closed
  });
}

function founderDecision() {
  return evaluateFounderHostedPilotActivationDecision({
    decision: "authorize-implementation-preparation",
    deploymentReadiness: deploymentReadiness(),
    decidedBy: "founder-001",
    reviewedBy: "reviewer-001",
    owners: {
      scopeOwner: "product-owner-001",
      rollbackOwner: "operations-owner-001",
      securityOwner: "security-owner-001",
      budgetOwner: "finance-owner-001"
    },
    attestations: {
      boundaryAccepted: true,
      blockersAccepted: true,
      rollbackReviewed: true,
      noLaunchConfirmed: true
    },
    ...closed
  });
}

function manifestDryRun() {
  return evaluateProviderManifestDryRun({
    environment: "private-pilot-candidate",
    serviceName: "vedapath-hosted-candidate",
    providerCandidate: "hosted-provider-candidate",
    regionCandidate: "residency-region-candidate",
    authorization: founderDecision(),
    bindings: {
      runtime: "binding://HOSTED_RUNTIME",
      database: "binding://DURABLE_DATABASE",
      identity: "binding://EXTERNAL_IDENTITY",
      secrets: "binding://MANAGED_SECRETS"
    },
    routes: [
      { path: "/v1/source/search", methods: ["GET"] },
      { path: "/v1/review/queue", methods: ["GET", "POST"] },
      { path: "/v1/activation/readiness", methods: ["GET"] }
    ],
    rollbackSteps: ["disable candidate route", "restore prior binding references", "verify private demo health"],
    ...closed
  });
}

function secretEvidence() {
  return evaluateManagedSecretStoreAdapterEvidence({
    mode: "reference-only-managed-secret-adapter-candidate",
    registrationVerified: true,
    rotationVerified: true,
    revocationVerified: true,
    makerCheckerVerified: true,
    redactionVerified: true,
    auditVerified: true,
    managedSecretStore: null,
    ...closed
  });
}

function databaseEvidence() {
  return evaluateDurableDatabaseAdapterEvidence({
    mode: "transactional-memory-database-adapter-candidate",
    transactionVerified: true,
    idempotencyVerified: true,
    conflictVerified: true,
    rollbackVerified: true,
    checkpointVerified: true,
    restoreVerified: true,
    durableProvider: null,
    ...closed
  });
}

function identityEvidence() {
  return evaluateExternalReviewerIdentityEvidence({
    mode: "signed-external-identity-adapter-candidate",
    signatureVerified: true,
    issuerAudienceVerified: true,
    expiryVerified: true,
    roleVerified: true,
    revocationVerified: true,
    failClosedVerified: true,
    externalIdentityProvider: null,
    ...closed
  });
}

function integratedEvidence() {
  return {
    deploymentReadiness: deploymentReadiness(),
    founderDecision: founderDecision(),
    manifestDryRun: manifestDryRun(),
    secretStoreAdapter: secretEvidence(),
    databaseAdapter: databaseEvidence(),
    externalIdentity: identityEvidence()
  };
}

const checks = [
  async () => {
    const decision = founderDecision();
    const repeated = founderDecision();
    assert(decision.approved, `complete founder decision should pass: ${decision.violations.join(", ")}`);
    assert(decision.implementationPreparationAuthorized, "founder decision should authorize only implementation preparation");
    assert(decision.packetChecksum === repeated.packetChecksum, "founder decision packet checksum must be deterministic");
    assert(!decision.hostedPilotActivatable && !decision.deploymentAuthorized && !decision.publicLaunchReady, "founder decision must not activate, deploy, or launch");
    assert(hostedActivationPacket("founder", decision).approved, "founder decision should produce approved evidence packet");
    const selfReviewed = evaluateFounderHostedPilotActivationDecision({
      ...decision.decisionPacket,
      decision: "authorize-implementation-preparation",
      deploymentReadiness: deploymentReadiness(),
      decidedBy: "founder-001",
      reviewedBy: "founder-001",
      owners: decision.decisionPacket.owners,
      attestations: decision.decisionPacket.attestations,
      ...closed
    });
    assert(!selfReviewed.approved, "self-reviewed founder authorization must fail");
    assert(!evaluateFounderHostedPilotActivationDecision({ ...founderDecision(), providerBound: true }).approved, "bound provider must invalidate the closed decision");
  },
  async () => {
    const manifest = manifestDryRun();
    const repeated = manifestDryRun();
    assert(manifest.approved && manifest.dryRunReady, `provider manifest dry run should pass: ${manifest.violations.join(", ")}`);
    assert(manifest.planChecksum === repeated.planChecksum, "provider manifest plan must be deterministic");
    assert(manifest.plan.operations.length === 5 && manifest.plan.applied === false, "dry run should produce operations without applying them");
    assert(!manifest.providerBound && !manifest.deploymentAuthorized, "manifest dry run must not bind or deploy");
    const unsafe = evaluateProviderManifestDryRun({
      ...manifestDryRun().plan,
      authorization: founderDecision(),
      apiKey: "sk-unsafe-inline-value",
      ...closed
    });
    assert(!unsafe.approved && unsafe.violations.some((item) => item.includes("secret")), "inline credential material must fail manifest validation");
    const wildcard = evaluateProviderManifestDryRun({
      ...manifestDryRun().plan,
      authorization: founderDecision(),
      routes: [{ path: "*", methods: ["GET"] }],
      ...closed
    });
    assert(!wildcard.approved, "wildcard routes must fail closed");
  },
  async () => {
    const evaluation = secretEvidence();
    assert(evaluation.approved && evaluation.adapterReady && evaluation.managedSecretStore === null, "reference-only secret adapter evidence should pass without provider binding");
    const adapter = createManagedSecretStoreAdapter({ now: () => "2026-07-19T00:00:00.000Z" });
    assert(adapter.register({ name: "SOURCE_STORE", reference: "secret://SOURCE_STORE/V1", requestedBy: "operator-001" }).ok, "reference should register");
    assert(!adapter.register({ name: "REVIEW_STORE", reference: "secret://REVIEW_STORE/V1", requestedBy: "operator-001", value: "forbidden" }).ok, "secret value must be rejected");
    assert(!adapter.rotate({ name: "SOURCE_STORE", reference: "secret://SOURCE_STORE/V2", approvedBy: "operator-001" }).ok, "rotation self-approval must fail");
    assert(adapter.rotate({ name: "SOURCE_STORE", reference: "secret://SOURCE_STORE/V2", approvedBy: "reviewer-001" }).ok, "independent rotation should pass");
    const resolved = adapter.resolve("SOURCE_STORE");
    assert(resolved.ok && resolved.value === "redacted" && !resolved.exportable, "active reference should resolve only to a redacted non-exportable handle");
    assert(adapter.revoke({ name: "SOURCE_STORE", revokedBy: "security-owner-001" }).ok, "reference should revoke");
    assert(!adapter.resolve("SOURCE_STORE").ok, "revoked reference must not resolve");
    const report = adapter.report();
    assert(report.audit.map((item) => item.kind).join(",") === "registered,rotated,revoked", "secret audit should preserve lifecycle order");
    assert(!JSON.stringify(report).includes("forbidden") && report.values === "redacted", "adapter report must never expose submitted values");
  },
  async () => {
    const evaluation = databaseEvidence();
    assert(evaluation.approved && evaluation.adapterReady && evaluation.durableProvider === null, "database adapter evidence should pass without a durable provider");
    const database = createDurableDatabaseAdapterCandidate();
    const first = database.transact({
      transactionId: "txn-source-seed-001",
      expectedRevision: 0,
      operations: [{ kind: "put", table: "sources", id: "bg-2-48-steadiness", value: { citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture" } }]
    });
    assert(first.ok && first.revision === 1, "transaction should commit atomically");
    const replay = database.transact({ transactionId: "txn-source-seed-001", expectedRevision: 0, operations: [] });
    assert(replay.ok && replay.replayed && replay.revision === 1, "transaction replay must be idempotent");
    assert(database.transact({ transactionId: "txn-conflict-001", expectedRevision: 0, operations: [{ kind: "delete", table: "sources", id: "bg-2-48-steadiness" }] }).code === "revision_conflict", "stale revision must conflict");
    const checkpoint = database.checkpoint({ checkpointId: "checkpoint-private-demo-001" });
    assert(checkpoint.ok, "checkpoint should be checksummed");
    const unsafe = database.transact({
      transactionId: "txn-unsafe-personal-001",
      expectedRevision: 1,
      operations: [{ kind: "put", table: "reviewQueue", id: "review-person-001", value: { participantEmail: "person@example.invalid" } }]
    });
    assert(!unsafe.ok && unsafe.code === "transaction_rolled_back" && database.inspect().revision === 1, "unsafe personal row must roll back the whole transaction");
    const second = database.transact({
      transactionId: "txn-review-seed-001",
      expectedRevision: 1,
      operations: [{ kind: "put", table: "reviewQueue", id: "review-bg-2-48", value: { sourceId: "bg-2-48-steadiness", status: "open" } }]
    });
    assert(second.ok && second.revision === 2, "second transaction should advance revision");
    const restored = database.restore("checkpoint-private-demo-001");
    assert(restored.ok && restored.revision === 1 && !database.inspect().tables.reviewQueue["review-bg-2-48"], "checkpoint restore should return the previous snapshot");
    assert(database.inspect().durableProvider === null && !database.inspect().productionData, "candidate must remain memory-backed and synthetic");
  },
  async () => {
    const evaluation = identityEvidence();
    assert(evaluation.approved && evaluation.adapterReady && evaluation.externalIdentityProvider === null, "signed identity candidate evidence should pass without a real IdP");
    let now = 1_800_000_000;
    const identity = createExternalReviewerIdentityCandidate({ nowSeconds: () => now });
    const token = identity.issueFixtureToken({ subject: "reviewer-alpha", tokenId: "session-alpha", expiresIn: 120 });
    assert(identity.verify(`Bearer ${token}`)?.role === "reviewer", "signed reviewer claim should verify");
    assert(identity.verify(`Bearer ${token.slice(0, -2)}xx`) === null, "tampered token must fail closed");
    now += 121;
    assert(identity.verify(`Bearer ${token}`) === null, "expired token must fail closed");
    const revokedToken = identity.issueFixtureToken({ subject: "reviewer-beta", tokenId: "session-beta", expiresIn: 120 });
    assert(identity.revoke("session-beta", "security-owner-001").ok, "fixture token should be revocable");
    assert(identity.verify(`Bearer ${revokedToken}`) === null, "revoked token must fail immediately");

    const evidence = integratedEvidence();
    const gate = evaluateIntegratedHostedActivationGate({ evidence, ...closed });
    assert(gate.approved && gate.implementationCandidateReady && gate.privateDemoReady, `integrated gate should pass review: ${gate.violations.join(", ")}`);
    assert(!gate.hostedPilotActivatable && !gate.deploymentAuthorized && !gate.publicLaunchReady, "integrated gate must not activate, deploy, or launch");
    assert(gate.blockers.length === 5, "integrated gate must keep five real-world blockers visible");
    const incomplete = evaluateIntegratedHostedActivationGate({ evidence: { ...evidence, databaseAdapter: { approved: false } }, ...closed });
    assert(!incomplete.approved && incomplete.decision === "rework", "missing adapter evidence must send the gate to rework");

    const deployment = createDeploymentReadinessFixture();
    const runtimeIdentity = createExternalReviewerIdentityCandidate({ nowSeconds: () => 1_800_000_000 });
    const reviewerToken = runtimeIdentity.issueFixtureToken({ subject: "reviewer-runtime", tokenId: "session-runtime", expiresIn: 300 });
    const app = createHostedActivationApp({ baseApp: deployment.app, identityVerifier: runtimeIdentity, evidence: { ...evidence, gate } });
    const call = (path, tokenValue = reviewerToken, method = "GET") => app.handle(new Request(`http://127.0.0.1:8113${path}`, {
      method,
      headers: tokenValue ? { authorization: `Bearer ${tokenValue}` } : {}
    }));
    assert((await call("/v1/activation/health", "")).status === 200, "activation health should remain content-free and public");
    const readiness = await call("/v1/activation/readiness");
    const body = await readiness.json();
    assert(readiness.status === 200 && body.evidence.implementationCandidateReady && !body.hostedPilotActivatable, "reviewer should read bounded activation evidence");
    assert((await call("/v1/activation/readiness", "invalid-token")).status === 401, "invalid external identity must fail closed");
    assert((await call("/v1/activation/attempt", reviewerToken, "POST")).status === 403, "hosted activation attempt must be denied");
    const base = await app.handle(new Request("http://127.0.0.1:8113/v1/deployment/readiness", { headers: { authorization: `Bearer ${deployment.reviewerToken}` } }));
    assert(base.status === 200, "activation wrapper must preserve deployment-readiness routes");
  }
];

for (const check of checks.slice(0, count)) await check();
console.log(`hosted-activation-ok ${count}/5`);
