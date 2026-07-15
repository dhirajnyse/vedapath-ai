import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { evaluateInfrastructureAuthorization, authorizationSummary } from "./vedapath-infrastructure-authorization.mjs";
import { validateDeploymentManifest } from "./vedapath-deployment-manifest.mjs";
import { validateReviewerClaims, authorizeReviewerOperation } from "./vedapath-reviewer-identity-contract.mjs";
import { createQueueLedger, appendQueueEvent, verifyQueueLedger, replayQueueLedger } from "./vedapath-durable-queue-ledger.mjs";
import { assessPrivatePilotReadiness, readinessPacket } from "./vedapath-private-pilot-readiness.mjs";

const versions = ["v4.9.7", "v4.9.8", "v4.9.9", "v5.0.0", "v5.0.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
assert(throughIndex >= 0, `unsupported through version ${through}`);

const filesByVersion = {
  "v4.9.7": ["pilotinfrastructureauthorization.html", "data/vedapath-pilot-infrastructure-authorization.json", "docs/PILOT_INFRASTRUCTURE_AUTHORIZATION_RECORD.md", "scripts/vedapath-infrastructure-authorization.mjs"],
  "v4.9.8": ["deploymentmanifestcontract.html", "data/vedapath-deployment-manifest-contract.json", "docs/DEPLOYMENT_MANIFEST_CONTRACT.md", "scripts/vedapath-deployment-manifest.mjs"],
  "v4.9.9": ["revieweridentityprovidercontract.html", "data/vedapath-reviewer-identity-provider-contract.json", "docs/REVIEWER_IDENTITY_PROVIDER_CONTRACT.md", "scripts/vedapath-reviewer-identity-contract.mjs"],
  "v5.0.0": ["durablequeuemigrationpack.html", "data/vedapath-durable-queue-migration-pack.json", "docs/DURABLE_QUEUE_MIGRATION_PACK.md", "scripts/vedapath-durable-queue-ledger.mjs"],
  "v5.0.1": ["privatepilotreadinesscontrolroom.html", "data/vedapath-private-pilot-readiness-control-room.json", "docs/PRIVATE_PILOT_READINESS_CONTROL_ROOM.md", "scripts/vedapath-private-pilot-readiness.mjs"]
};

const badges = {
  "v4.9.7": "v4.9.7 infrastructure authorization",
  "v4.9.8": "v4.9.8 deployment contract",
  "v4.9.9": "v4.9.9 identity contract",
  "v5.0.0": "v5.0.0 queue migration",
  "v5.0.1": "v5.0.1 pilot readiness control"
};

function text(name) { return readFileSync(name, "utf8"); }
function json(name) { return JSON.parse(text(name)); }
function has(version) { return versions.indexOf(version) <= throughIndex; }
function throwsWith(action, pattern, label) {
  assert.throws(action, pattern, label);
}

for (const version of versions.slice(0, throughIndex + 1)) {
  for (const name of filesByVersion[version]) assert(existsSync(name), `${version} file ${name}`);
  const page = text(filesByVersion[version][0]);
  assert(page.includes("VedaPath AI"), `${version} project identity`);
  assert(page.includes("vedapath-command-shell.js"), `${version} shared command shell`);
  assert(page.includes("vedapath-retrieval-pilot.js"), `${version} shared renderer`);
  assert(!/AnswerSeal/i.test(page), `${version} project isolation`);
}

function authorizationChecks() {
  const incomplete = evaluateInfrastructureAuthorization();
  assert.equal(incomplete.status, "blocked-incomplete-evidence");
  assert.equal(incomplete.privatelyAuthorized, false);
  assert.equal(incomplete.deploymentActivated, false);
  assert.equal(incomplete.invitationsIssued, 0);
  assert.equal(incomplete.publicLaunch, "blocked");

  const completeInput = {
    provider: "reviewed-private-provider",
    region: "reviewed-region",
    shutdownOwner: "founder-owner",
    incidentOwner: "security-owner",
    monthlyBudgetCapUsd: 120,
    privateAccessConfirmed: true,
    dataResidencyDocumented: true,
    redactedLoggingConfirmed: true,
    managedSecretsAvailable: true,
    reviewerIdentityReady: true,
    durableQueueReady: true,
    privacyReviewComplete: true,
    rightsReviewComplete: true,
    recoveryPlanTested: true,
    founderDecision: "approve-private-implementation",
    publicAccess: false,
    invitationsIssued: 0,
    writeRoutes: []
  };
  const complete = evaluateInfrastructureAuthorization(completeInput);
  assert.equal(complete.status, "authorized-for-private-implementation");
  assert.equal(complete.evidenceComplete, true);
  assert.equal(complete.privatelyAuthorized, true);
  assert.deepEqual(complete.blockers, []);
  assert.equal(complete.deploymentActivated, false);
  assert.equal(complete.externalParticipants, 0);
  assert.equal(authorizationSummary(complete).publicLaunch, "blocked");

  assert(evaluateInfrastructureAuthorization({ ...completeInput, founderDecision: "reject" }).status === "rejected");
  assert(evaluateInfrastructureAuthorization({ ...completeInput, monthlyBudgetCapUsd: 501 }).blockers.includes("budget-cap-exceeds-private-pilot-limit"));
  assert(evaluateInfrastructureAuthorization({ ...completeInput, publicAccess: true }).blockers.includes("public-access-forbidden"));
  assert(evaluateInfrastructureAuthorization({ ...completeInput, invitationsIssued: 1 }).blockers.includes("invitations-must-remain-zero"));
  assert(evaluateInfrastructureAuthorization({ ...completeInput, writeRoutes: ["POST /queue"] }).blockers.includes("write-routes-forbidden"));

  const data = json("data/vedapath-pilot-infrastructure-authorization.json");
  assert.equal(data.privately_authorized, false);
  assert.equal(data.provider_selected, false);
  assert.equal(data.invitations_issued, 0);
  assert.equal(data.public_launch, "blocked");
}

function manifestChecks() {
  const data = json("data/vedapath-deployment-manifest-contract.json");
  const manifest = data.reference_manifest;
  const valid = validateDeploymentManifest(manifest);
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, []);
  assert.equal(valid.endpointCreated, false);
  assert.equal(valid.credentialsSerialized, false);
  assert.equal(valid.safeSummary.writeRouteCount, 0);

  assert.equal(validateDeploymentManifest({ ...manifest, surprise: true }).valid, false);
  assert(validateDeploymentManifest({ ...manifest, access: "public" }).errors.includes("private-access-required"));
  assert(validateDeploymentManifest({ ...manifest, activated: true }).errors.includes("activation-forbidden"));
  assert(validateDeploymentManifest({ ...manifest, writeRoutes: ["POST /queue"] }).errors.includes("write-routes-must-be-empty"));
  assert(validateDeploymentManifest({ ...manifest, secretRefs: ["literal-secret-value"] }).errors.some((error) => error.startsWith("secret-reference-missing:")));
  assert(validateDeploymentManifest({ ...manifest, redactedLogFields: ["ip"] }).errors.some((error) => error.startsWith("redaction-missing:")));
  assert(validateDeploymentManifest({ ...manifest, limits: { ...manifest.limits, requestBytes: 9000 } }).errors.includes("request-byte-limit-invalid"));
  assert(validateDeploymentManifest({ ...manifest, rollback: { ...manifest.rollback, targetMinutes: 30 } }).errors.includes("rollback-target-invalid"));
  assert.equal(JSON.stringify(valid).includes("VEDAPATH_SESSION_SIGNING_SECRET"), false, "safe output omits secret references");
  assert.equal(data.endpoint_created, false);
  assert.equal(data.deployment_activated, false);
  assert.equal(data.public_launch, "blocked");
}

function identityChecks() {
  const now = 2_000_000_000;
  const policy = { issuer: "https://identity.example.invalid", audience: "vedapath-private-pilot" };
  const claims = {
    iss: policy.issuer,
    aud: policy.audience,
    sub: "reviewer:source-01",
    iat: now - 30,
    exp: now + 600,
    acr: "aal2",
    roles: ["source-reviewer"],
    revoked: false
  };
  const valid = validateReviewerClaims(claims, policy, now);
  assert.equal(valid.valid, true);
  assert(valid.capabilities.includes("claim-source-work"));
  assert.equal(valid.identityProviderConnected, false);
  assert.equal(valid.productionAllowed, false);
  assert.deepEqual(authorizeReviewerOperation(valid, "claim-source-work"), { allowed: true, reason: "role-capability-match" });
  assert.equal(authorizeReviewerOperation(valid, "claim-rights-work").allowed, false);
  for (const operation of ["publish-source", "merge-registry", "issue-invite", "activate-pilot", "public-launch"]) {
    assert.deepEqual(authorizeReviewerOperation(valid, operation), { allowed: false, reason: "operation-locked" });
  }

  assert(validateReviewerClaims({ ...claims, iss: "wrong" }, policy, now).errors.includes("issuer-mismatch"));
  assert(validateReviewerClaims({ ...claims, aud: "wrong" }, policy, now).errors.includes("audience-mismatch"));
  assert(validateReviewerClaims({ ...claims, exp: now - 1 }, policy, now).errors.includes("session-expired"));
  assert(validateReviewerClaims({ ...claims, exp: now + 3700 }, policy, now).errors.includes("session-too-long"));
  assert(validateReviewerClaims({ ...claims, acr: "aal1" }, policy, now).errors.includes("aal2-required"));
  assert(validateReviewerClaims({ ...claims, roles: ["admin"] }, policy, now).errors.includes("bounded-role-required"));
  assert(validateReviewerClaims({ ...claims, revoked: true }, policy, now).errors.includes("session-revoked"));
  assert(validateReviewerClaims({ ...claims, email: "person@example.com" }, policy, now).errors.includes("direct-identity-claims-forbidden"));

  const data = json("data/vedapath-reviewer-identity-provider-contract.json");
  assert.equal(data.identity_provider_connected, false);
  assert.equal(data.live_accounts, 0);
  assert.equal(data.production_allowed, false);
  assert.equal(data.public_launch, "blocked");
}

function ledgerChecks() {
  const ledger = createQueueLedger([{ id: "source-01", status: "new", version: 1 }]);
  const command = {
    eventId: "event-claim-01",
    recordId: "source-01",
    expectedVersion: 1,
    action: "claim",
    actorRole: "source-reviewer",
    idempotencyKey: "claim-source-01"
  };
  const accepted = appendQueueEvent(ledger, command);
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.record.version, 2);
  assert.equal(accepted.record.publicationState, "blocked");
  assert.equal(accepted.record.registryMerge, "manual-only");
  assert.deepEqual(appendQueueEvent(ledger, command), accepted, "idempotent receipt");
  assert.equal(ledger.events.length, 1, "idempotent retry does not append");
  throwsWith(() => appendQueueEvent(ledger, { ...command, eventId: "stale", idempotencyKey: "stale-event", expectedVersion: 1, action: "hold" }), /version-conflict/, "stale version rejected");
  throwsWith(() => appendQueueEvent(ledger, { ...command, idempotencyKey: "bad-action", expectedVersion: 2, action: "publish" }), /action-not-allowed/, "publication action rejected");
  throwsWith(() => appendQueueEvent(ledger, { ...command, idempotencyKey: "bad-role-1", expectedVersion: 2, actorRole: "admin" }), /role-not-allowed/, "unbounded role rejected");
  throwsWith(() => appendQueueEvent(ledger, { ...command, idempotencyKey: "lane-mismatch", expectedVersion: 2, action: "mark-evidence-ready", actorRole: "release-reviewer" }), /lane-role-mismatch/, "lane mismatch rejected");
  assert.equal(verifyQueueLedger(ledger).valid, true);
  const replay = replayQueueLedger(ledger);
  assert.deepEqual(replay.records, ledger.records);
  assert.equal(replay.headHash, ledger.headHash);

  const tampered = JSON.parse(JSON.stringify(ledger));
  tampered.events[0].recordAfter.status = "published";
  const verification = verifyQueueLedger(tampered);
  assert.equal(verification.valid, false);
  assert(verification.errors.some((error) => error.startsWith("event-hash:")));

  const data = json("data/vedapath-durable-queue-migration-pack.json");
  assert.equal(data.replay_verified, true);
  assert.equal(data.durable_provider_connected, false);
  assert.equal(data.production_migration_run, false);
  assert.equal(data.publication, "blocked");
  assert.equal(data.public_launch, "blocked");
}

function readinessChecks() {
  const incomplete = assessPrivatePilotReadiness({});
  assert.equal(incomplete.status, "blocked-before-private-implementation");
  assert.equal(incomplete.completedChecks, 0);
  assert.equal(incomplete.blockers.length, 8);

  const evidence = {
    infrastructureAuthorization: "authorized-for-private-implementation",
    deploymentManifest: "valid-dry-run",
    reviewerIdentity: "contract-verified-provider-unconnected",
    durableQueue: "ledger-verified-provider-unconnected",
    securityReview: "complete",
    privacyReview: "complete",
    rightsReview: "complete",
    recoveryDrill: "complete",
    publicAccess: false,
    invitationsIssued: 0,
    externalParticipants: 0
  };
  const ready = assessPrivatePilotReadiness(evidence);
  assert.equal(ready.status, "ready-for-private-implementation-not-activation");
  assert.equal(ready.completedChecks, 8);
  assert.equal(ready.implementationReady, true);
  assert.equal(ready.activationAuthorized, false);
  assert.equal(ready.deploymentActivated, false);
  assert.equal(ready.invitationsIssued, 0);
  assert.equal(ready.externalParticipants, 0);
  assert.equal(ready.publicLaunch, "blocked");
  assert(readinessPacket(ready).includes("Activation authorized: false"));
  assert.equal(assessPrivatePilotReadiness({ ...evidence, invitationsIssued: 1 }).implementationReady, false);
  assert.equal(assessPrivatePilotReadiness({ ...evidence, publicAccess: true }).implementationReady, false);

  const data = json("data/vedapath-private-pilot-readiness-control-room.json");
  assert.equal(data.implementation_contracts_complete, 5);
  assert.equal(data.real_connections_complete, 0);
  assert.equal(data.activation_authorized, false);
  assert.equal(data.deployment_activated, false);
  assert.equal(data.invitations_issued, 0);
  assert.equal(data.external_participants, 0);
  assert.equal(data.public_launch, "blocked");
}

if (has("v4.9.7")) authorizationChecks();
if (has("v4.9.8")) manifestChecks();
if (has("v4.9.9")) identityChecks();
if (has("v5.0.0")) ledgerChecks();
if (has("v5.0.1")) readinessChecks();

const shell = text("assets/vedapath-command-shell.js");
assert.equal((shell.match(/title: "Pilot Authorization"/g) || []).length, 1, "single pilot authorization group");
for (const version of versions.slice(0, throughIndex + 1)) {
  const label = {
    "v4.9.7": "Authorization",
    "v4.9.8": "Manifest",
    "v4.9.9": "Identity Contract",
    "v5.0.0": "Queue Migration",
    "v5.0.1": "Readiness Control"
  }[version];
  assert(shell.includes(`"${label}"`), `shell link ${label}`);
}
assert(/const releaseBadge = "v5\.(?:0\.[1-9]|1\.[01]) [^"]+";/.test(shell), "compatible release badge");
assert(/<strong>v5\.(?:0\.[1-9]|1\.[01])<\/strong>/.test(text("build-status.html")), "build status compatible version");
assert(
  /provider deployment, invitations, and public launch remain blocked|private-pilot validation complete; real invitation issuance, participant access, provider operations, and public launch remain blocked/i.test(text("build-status.html")),
  "honest build status boundary"
);
assert(!/AnswerSeal/i.test(shell + text("build-status.html")), "shared project isolation");

console.log(`v497-v501-pilot-authorization-ok ${through}`);
