import { evaluatePrivatePilotOperationsGate } from "./vedapath-pilot-platform-contracts.mjs";
import { createPilotPlatformFixture } from "./serve-vedapath-pilot-platform.mjs";
import {
  createDeploymentReadinessApp,
  createDurableDatabaseCutoverRehearsal,
  createFixtureSecretResolver,
  createReviewerIdentityProvisioningRehearsal,
  deploymentReadinessPacket,
  evaluateDurableDatabaseCutoverRehearsal,
  evaluateHostedProviderBindingDecision,
  evaluateManagedSecretsEnvironmentContract,
  evaluatePrivatePilotDeploymentReadinessGate,
  evaluateReviewerIdentityProvisioningRehearsal,
  planDurableDatabaseCutover
} from "./vedapath-deployment-readiness-contracts.mjs";

const releases = ["v5.4.2", "v5.4.3", "v5.4.4", "v5.4.5", "v5.4.6"];
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

const completeBindingInput = {
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
};

const completeSecretInput = {
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
};

const sourceDataset = {
  sources: [
    { id: "bg-2-48-steadiness", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture" },
    { id: "bg-11-32-time", citation: "Bhagavad Gita 11.32", rightsStatus: "reviewed-fixture" }
  ],
  reviewQueue: [{ id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open" }],
  reviewAudit: [{ id: "audit-bg-2-48", sourceId: "bg-2-48-steadiness", action: "fixture-approved" }],
  consentEvents: []
};

function approvedEvidence() {
  const bindingDecision = evaluateHostedProviderBindingDecision(completeBindingInput);
  const secretsContract = evaluateManagedSecretsEnvironmentContract(completeSecretInput);
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
  return { bindingDecision, secretsContract, cutoverRehearsal, reviewerProvisioning, operationsGate };
}

const checks = [
  async () => {
    const complete = evaluateHostedProviderBindingDecision(completeBindingInput);
    const repeated = evaluateHostedProviderBindingDecision(completeBindingInput);
    assert(complete.approved, `complete hosted binding decision should pass: ${complete.violations.join(", ")}`);
    assert(complete.decision === "approved-for-controlled-implementation", "complete packet should reach controlled implementation decision");
    assert(complete.manifestChecksum === repeated.manifestChecksum, "binding manifest checksum must be deterministic");
    assert(complete.manifest?.operationalBinding === false && complete.operationalBinding === false, "decision packet must not bind infrastructure");
    assert(complete.selectedProvider === null && complete.selectedRegion === null && !complete.deployable, "decision must not perform deployment selection");
    assert(deploymentReadinessPacket("binding", complete).approved, "binding packet should wrap approved evidence");
    const incomplete = evaluateHostedProviderBindingDecision({
      ...completeBindingInput,
      evidence: { ...completeBindingInput.evidence, securityReview: false },
      reviewedBy: "founder-001"
    });
    assert(!incomplete.approved && incomplete.manifest === null, "missing evidence and self-review must block the decision manifest");
    assert(!evaluateHostedProviderBindingDecision({ ...completeBindingInput, providerBound: true }).approved, "operational provider binding must remain blocked");
  },
  async () => {
    const contract = evaluateManagedSecretsEnvironmentContract(completeSecretInput);
    assert(contract.approved && !contract.valuesExposed && !contract.managedEnvironmentBound, "reference-only secret contract should pass without managed binding");
    const inline = evaluateManagedSecretsEnvironmentContract({
      ...completeSecretInput,
      publicConfig: { SESSION_SIGNING_KEY: "inline-value" },
      inlineSecrets: { SESSION_SIGNING_KEY: "inline-value" }
    });
    assert(!inline.approved && inline.violations.some((item) => item.includes("inline")), "inline secrets must be rejected");
    const missing = evaluateManagedSecretsEnvironmentContract({
      ...completeSecretInput,
      secretRefs: { ...completeSecretInput.secretRefs, SOURCE_STORE: undefined }
    });
    assert(!missing.approved, "missing required secret reference must fail");
    const secretValue = "fixture-session-signing-value-2026";
    const resolver = createFixtureSecretResolver({
      vault: {
        "secret://SOURCE_STORE": "fixture-source-store-handle-2026",
        "secret://SESSION_SIGNING_KEY": secretValue
      }
    });
    const resolved = resolver.resolve("secret://SESSION_SIGNING_KEY");
    assert(resolved.ok && resolved.value === "redacted" && !resolved.exportable, "resolver must return a non-exportable redacted handle");
    assert(resolver.inspect(resolved.handle)?.value === "redacted", "handle inspection must remain redacted");
    assert(!JSON.stringify(resolver.diagnostics()).includes(secretValue), "secret diagnostics must never expose fixture values");
  },
  async () => {
    const evaluation = evaluateDurableDatabaseCutoverRehearsal({
      mode: "blue-green-memory-rehearsal",
      snapshotVerified: true,
      parityVerified: true,
      idempotencyVerified: true,
      rollbackVerified: true,
      durableProvider: null,
      ...closed
    });
    assert(evaluation.approved && evaluation.rehearsalReady && evaluation.durableProvider === null, "cutover rehearsal evidence should pass without a durable provider");
    const plan = planDurableDatabaseCutover({ cutoverId: "cutover-private-pilot-v1", sourceDataset });
    const rehearsal = createDurableDatabaseCutoverRehearsal(sourceDataset);
    const failed = rehearsal.rehearse(plan, { simulateFailureAt: "reviewQueue" });
    assert(!failed.ok && failed.activeSlot === "blue" && failed.counts.green.sources === 0, "failed copy must restore the full pre-cutover state");
    const cutover = rehearsal.rehearse(plan);
    assert(cutover.ok && cutover.parity && cutover.activeSlot === "green", "successful rehearsal must switch to the parity-checked green slot");
    assert(cutover.counts.green.sources === sourceDataset.sources.length, "cutover must preserve source counts");
    const replay = rehearsal.rehearse(plan);
    assert(replay.ok && replay.replayed && replay.runs.length === 1, "cutover replay must be idempotent");
    const rollback = rehearsal.rollback();
    assert(rollback.ok && rollback.activeSlot === "blue" && !rollback.productionCutover, "rollback must restore blue without production cutover");
  },
  async () => {
    const evaluation = evaluateReviewerIdentityProvisioningRehearsal({
      mode: "synthetic-maker-checker-provisioning",
      makerCheckerVerified: true,
      leastPrivilegeVerified: true,
      activationVerified: true,
      revocationVerified: true,
      auditVerified: true,
      externalIdentityProvider: null,
      ...closed
    });
    assert(evaluation.approved && evaluation.provisioningReady && !evaluation.realAccounts, "synthetic reviewer provisioning evidence should pass without real accounts");
    const provisioning = createReviewerIdentityProvisioningRehearsal({ now: () => "2026-07-19T00:00:00.000Z" });
    const requested = provisioning.request({ requestId: "provision-reviewer-alpha", subject: "reviewer-alpha", requestedBy: "founder-001" });
    assert(requested.ok, "reviewer request should be recorded");
    assert(!provisioning.approve({ requestId: "provision-reviewer-alpha", approvedBy: "founder-001" }).ok, "self-approval must fail");
    assert(provisioning.approve({ requestId: "provision-reviewer-alpha", approvedBy: "reviewer-002" }).ok, "independent reviewer should approve");
    const active = provisioning.activate({ requestId: "provision-reviewer-alpha", activatedBy: "operator-001" });
    assert(active.ok && provisioning.verifySession(active.sessionHandle)?.role === "reviewer", "approved synthetic reviewer should activate with least privilege");
    assert(provisioning.revoke({ requestId: "provision-reviewer-alpha", revokedBy: "operator-002" }).ok, "active reviewer should be revocable");
    assert(provisioning.verifySession(active.sessionHandle) === null, "revocation must invalidate the session immediately");
    const report = provisioning.report();
    assert(report.audit.map((item) => item.kind).join(",") === "requested,approved,activated,revoked", "provisioning audit must preserve ordered lifecycle events");
    assert(report.activeSessions === 0 && !report.realAccounts && report.externalIdentityProvider === null, "rehearsal must not create real accounts");
  },
  async () => {
    const evidence = approvedEvidence();
    const gate = evaluatePrivatePilotDeploymentReadinessGate({
      evidence,
      privateDemoChecks: true,
      rollbackDrill: true,
      founderReview: true,
      ...closed
    });
    assert(gate.approved && gate.privateDemoReady, `complete deployment evidence should pass review: ${gate.violations.join(", ")}`);
    assert(!gate.hostedPilotDeployable && !gate.deploymentAuthorized && !gate.publicLaunchReady, "review gate must not grant deployment or public launch");
    assert(gate.blockers.length >= 5, "gate must keep real infrastructure blockers visible");
    const incomplete = evaluatePrivatePilotDeploymentReadinessGate({
      evidence: { ...evidence, secretsContract: { approved: false } },
      privateDemoChecks: true,
      rollbackDrill: false,
      founderReview: true,
      ...closed
    });
    assert(!incomplete.approved && incomplete.decision === "rework", "missing evidence must send the gate to rework");

    const fixture = createPilotPlatformFixture();
    const app = createDeploymentReadinessApp({
      baseApp: fixture.app,
      identityVerifier: fixture.identity,
      evidence: { ...evidence, gate }
    });
    const call = (path, token = fixture.reviewerToken, method = "GET") => app.handle(new Request(`http://127.0.0.1:8111${path}`, {
      method,
      headers: { authorization: `Bearer ${token}`, origin: "http://127.0.0.1:8097" }
    }));
    const readiness = await call("/v1/deployment/readiness");
    const body = await readiness.json();
    assert(readiness.status === 200 && body.evidence.privateDemoReady && !body.deploymentAuthorized, "reviewer should read bounded deployment readiness");
    assert((await call("/v1/deployment/readiness", fixture.participantToken)).status === 403, "participant must not read deployment evidence");
    assert((await call("/v1/deployment/attempt", fixture.reviewerToken, "POST")).status === 403, "deployment attempt must remain blocked");
    assert((await call("/v1/platform/readiness")).status === 200, "deployment wrapper must preserve existing platform routes");
  }
];

for (const check of checks.slice(0, count)) await check();
console.log(`deployment-readiness-ok ${count}/5`);
