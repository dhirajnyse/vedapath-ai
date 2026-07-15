import { existsSync, readFileSync } from "node:fs";
import { appendQueueEvent, createQueueLedger } from "./vedapath-durable-queue-ledger.mjs";
import {
  evaluatePrivateImplementationDecision,
  implementationDecisionPacket
} from "./vedapath-private-implementation-decision.mjs";
import {
  secretBindingPacket,
  validateManagedSecretBindings
} from "./vedapath-managed-secret-binding.mjs";
import {
  planReviewerAccounts,
  reviewerProvisioningPacket
} from "./vedapath-reviewer-account-plan.mjs";
import {
  createQueueCutoverSnapshot,
  queueCutoverPacket,
  runQueueCutoverDrill
} from "./vedapath-queue-cutover-drill.mjs";
import {
  evaluateInvitationActivationGate,
  invitationActivationPacket
} from "./vedapath-invitation-activation-gate.mjs";

const versions = ["v5.0.2", "v5.0.3", "v5.0.4", "v5.0.5", "v5.0.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

function assert(condition, message) {
  if (!condition) throw new Error(`v502-v506 check failed: ${message}`);
}

function text(name) {
  return readFileSync(name, "utf8");
}

function json(name) {
  return JSON.parse(text(name));
}

function checkLocks(result, label) {
  assert(result.publicLaunch === "blocked", `${label} public launch lock`);
}

function checkReleaseFiles(index) {
  const files = [
    [
      "privateimplementationdecision.html",
      "data/vedapath-private-implementation-decision.json",
      "docs/PRIVATE_INFRASTRUCTURE_IMPLEMENTATION_DECISION.md",
      "scripts/vedapath-private-implementation-decision.mjs"
    ],
    [
      "managedsecretbindingplan.html",
      "data/vedapath-managed-secret-binding-plan.json",
      "docs/MANAGED_SECRET_BINDING_PLAN.md",
      "scripts/vedapath-managed-secret-binding.mjs"
    ],
    [
      "revieweraccountprovisioningrunbook.html",
      "data/vedapath-reviewer-account-provisioning-runbook.json",
      "docs/REVIEWER_ACCOUNT_PROVISIONING_RUNBOOK.md",
      "scripts/vedapath-reviewer-account-plan.mjs"
    ],
    [
      "durablequeuecutoverdrill.html",
      "data/vedapath-durable-queue-cutover-drill.json",
      "docs/DURABLE_QUEUE_CUTOVER_DRILL.md",
      "scripts/vedapath-queue-cutover-drill.mjs"
    ],
    [
      "invitationactivationdecisiongate.html",
      "data/vedapath-invitation-activation-decision-gate.json",
      "docs/INVITATION_ACTIVATION_DECISION_GATE.md",
      "scripts/vedapath-invitation-activation-gate.mjs"
    ]
  ];
  for (const name of files[index]) assert(existsSync(name), `${versions[index]} file ${name}`);
  const page = text(files[index][0]);
  assert(page.includes("data-retrieval-app"), `${versions[index]} renderer mount`);
  assert(page.includes(files[index][1]), `${versions[index]} data link`);
  assert(page.includes("vedapath-command-shell.js"), `${versions[index]} command shell`);
  const data = json(files[index][1]);
  assert(data.release === versions[index], `${versions[index]} data release`);
  assert(data.public_launch === "blocked", `${versions[index]} data public lock`);
}

function checkV502() {
  const incomplete = evaluatePrivateImplementationDecision();
  assert(!incomplete.implementationAuthorized, "v5.0.2 incomplete decision remains blocked");
  assert(incomplete.blockers.length === 9, "v5.0.2 all required blockers visible");

  const completeInput = {
    readinessStatus: "ready-for-private-implementation-not-activation",
    providerCandidate: "private-provider-candidate",
    region: "me-central-1",
    monthlyBudgetCapUsd: 240,
    shutdownOwner: "founder-owner",
    incidentOwner: "security-owner",
    manifestStatus: "valid-dry-run",
    environmentMode: "private-dry-run",
    founderDecision: "authorize-bounded-implementation",
    publicAccess: false,
    invitationsIssued: 0,
    writeRoutes: []
  };
  const authorized = evaluatePrivateImplementationDecision(completeInput);
  assert(authorized.status === "implementation-authorized-deployment-closed", "v5.0.2 bounded authorization");
  assert(authorized.implementationAuthorized, "v5.0.2 implementation authorized");
  assert(!authorized.deploymentActivated && !authorized.credentialsProvisioned, "v5.0.2 deployment and credential locks");
  assert(authorized.invitationsIssued === 0 && authorized.externalParticipants === 0, "v5.0.2 participant locks");
  checkLocks(authorized, "v5.0.2");
  assert(implementationDecisionPacket(authorized).includes("Deployment activated: false"), "v5.0.2 packet lock");

  assert(evaluatePrivateImplementationDecision({ ...completeInput, founderDecision: "reject-private-implementation" }).status === "rejected", "v5.0.2 rejection");
  assert(!evaluatePrivateImplementationDecision({ ...completeInput, monthlyBudgetCapUsd: 501 }).implementationAuthorized, "v5.0.2 budget cap");
  assert(!evaluatePrivateImplementationDecision({ ...completeInput, publicAccess: true }).implementationAuthorized, "v5.0.2 public access block");
  assert(!evaluatePrivateImplementationDecision({ ...completeInput, invitationsIssued: 1 }).implementationAuthorized, "v5.0.2 invitation block");
  assert(!evaluatePrivateImplementationDecision({ ...completeInput, writeRoutes: ["POST /review-events"] }).implementationAuthorized, "v5.0.2 write route block");
}

function validBindings() {
  return [
    { name: "VEDAPATH_SESSION_SIGNING_SECRET", ref: "secret://pilot/session-signing", scope: "session-signing", owner: "owner:security", rotationDays: 30, environment: "pilot", redacted: true },
    { name: "VEDAPATH_REVIEWER_STORE_KEY", ref: "secret://pilot/reviewer-store", scope: "reviewer-store", owner: "owner:review-ops", rotationDays: 60, environment: "pilot", redacted: true },
    { name: "VEDAPATH_QUEUE_HASH_KEY", ref: "secret://pilot/queue-integrity", scope: "queue-integrity", owner: "owner:queue-ops", rotationDays: 90, environment: "pilot", redacted: true }
  ];
}

function checkV503() {
  const valid = validateManagedSecretBindings(validBindings());
  assert(valid.valid && valid.status === "binding-plan-valid-not-applied", "v5.0.3 valid binding plan");
  assert(valid.safeBindings.length === 3 && !JSON.stringify(valid.safeBindings).includes("secret://"), "v5.0.3 redacted safe output");
  assert(valid.secretValuesSerialized === 0 && !valid.bindingsApplied && !valid.providerConnected, "v5.0.3 no provider side effects");
  checkLocks(valid, "v5.0.3");
  assert(secretBindingPacket(valid).includes("Bindings applied: false"), "v5.0.3 packet lock");
  assert(!validateManagedSecretBindings(validBindings().slice(0, 2)).valid, "v5.0.3 missing binding");
  assert(!validateManagedSecretBindings([...validBindings(), { ...validBindings()[0], name: "UNSAFE_SECRET" }]).valid, "v5.0.3 unknown binding");
  assert(!validateManagedSecretBindings(validBindings().map((item, index) => index ? item : { ...item, value: "not-allowed" })).valid, "v5.0.3 value-bearing key");
  assert(!validateManagedSecretBindings(validBindings().map((item, index) => index === 1 ? { ...item, name: validBindings()[0].name } : item)).valid, "v5.0.3 duplicate name");
  assert(!validateManagedSecretBindings(validBindings().map((item, index) => index ? item : { ...item, rotationDays: 91 })).valid, "v5.0.3 rotation boundary");
  assert(!validateManagedSecretBindings(validBindings().map((item, index) => index ? item : { ...item, environment: "production" })).valid, "v5.0.3 environment boundary");
}

function validReviewers(now) {
  return [
    { reviewerId: "reviewer:source-alpha", role: "source-reviewer", sponsor: "owner:founder", aal2: "required", privacyConsent: "recorded", expiresAt: now + 86400 },
    { reviewerId: "reviewer:rights-beta", role: "rights-reviewer", sponsor: "owner:founder", aal2: "required", privacyConsent: "recorded", expiresAt: now + 172800 }
  ];
}

function checkV504() {
  const now = 1784073600;
  const valid = planReviewerAccounts(validReviewers(now), { now });
  assert(valid.valid && valid.entries.length === 2, "v5.0.4 valid provisioning plan");
  assert(valid.accountsCreated === 0 && valid.credentialsIssued === 0 && valid.invitationsIssued === 0, "v5.0.4 zero account side effects");
  assert(!valid.directIdentityStored && !valid.identityProviderConnected && !valid.activationAuthorized, "v5.0.4 identity locks");
  checkLocks(valid, "v5.0.4");
  assert(reviewerProvisioningPacket(valid).includes("Accounts created: 0"), "v5.0.4 packet lock");
  assert(!planReviewerAccounts(validReviewers(now).map((item, index) => index ? item : { ...item, email: "user@example.com" }), { now }).valid, "v5.0.4 direct identity block");
  assert(!planReviewerAccounts(validReviewers(now).map((item, index) => index ? item : { ...item, role: "administrator" }), { now }).valid, "v5.0.4 role boundary");
  assert(!planReviewerAccounts(validReviewers(now).map((item, index) => index ? item : { ...item, aal2: "optional" }), { now }).valid, "v5.0.4 assurance boundary");
  assert(!planReviewerAccounts(validReviewers(now).map((item, index) => index ? item : { ...item, privacyConsent: "missing" }), { now }).valid, "v5.0.4 consent boundary");
  assert(!planReviewerAccounts(validReviewers(now).map((item, index) => index ? item : { ...item, expiresAt: now + (15 * 86400) }), { now }).valid, "v5.0.4 expiry boundary");
  assert(!planReviewerAccounts(Array.from({ length: 7 }, (_, index) => ({ ...validReviewers(now)[0], reviewerId: `reviewer:user-${index}`, expiresAt: now + 86400 })), { now }).valid, "v5.0.4 private pilot reviewer limit");
}

function queueFixture() {
  const ledger = createQueueLedger([{ id: "source-001", status: "new" }]);
  appendQueueEvent(ledger, {
    recordId: "source-001",
    expectedVersion: 1,
    action: "claim",
    actorRole: "source-reviewer",
    idempotencyKey: "cutover-claim-001",
    eventId: "cutover-event-001"
  });
  return ledger;
}

function checkV505() {
  const ledger = queueFixture();
  const snapshot = createQueueCutoverSnapshot(ledger);
  assert(snapshot.eventCount === 1 && snapshot.snapshotDigest.length === 64, "v5.0.5 deterministic snapshot");
  const passing = runQueueCutoverDrill({ sourceLedger: ledger, expectedHeadHash: ledger.headHash });
  assert(passing.drillPassed && passing.status === "cutover-drill-passed-no-migration", "v5.0.5 passing drill");
  assert(!passing.durableProviderConnected && !passing.productionMigrationRun && !passing.queueWritesEnabled, "v5.0.5 migration locks");
  checkLocks(passing, "v5.0.5");
  assert(queueCutoverPacket(passing).includes("Production migration run: false"), "v5.0.5 packet lock");
  const divergence = runQueueCutoverDrill({ sourceLedger: ledger, targetRecords: { "source-001": { id: "source-001", status: "changed" } } });
  assert(!divergence.drillPassed && divergence.errors.includes("target-record-divergence"), "v5.0.5 target divergence");
  const checkpoint = runQueueCutoverDrill({ sourceLedger: ledger, expectedHeadHash: "not-the-head" });
  assert(!checkpoint.drillPassed && checkpoint.errors.includes("checkpoint-head-mismatch"), "v5.0.5 checkpoint mismatch");
  const tampered = JSON.parse(JSON.stringify(ledger));
  tampered.events[0].recordAfter.status = "tampered";
  const tamperResult = runQueueCutoverDrill({ sourceLedger: tampered });
  assert(!tamperResult.drillPassed && tamperResult.rollbackRequired, "v5.0.5 tampered source rejection");
}

function completeActivationEvidence() {
  return {
    implementationDecision: "implementation-authorized-deployment-closed",
    secretBindings: "verified-live-provider-bound",
    reviewerAccounts: "verified-live-accounts-no-invites",
    queueCutover: "verified-live-durable-queue",
    privateEndpoint: "healthy-private-endpoint",
    securityReview: "complete-against-live-stack",
    privacyReview: "complete-against-live-stack",
    rightsReview: "complete-against-live-stack",
    recoveryDrill: "complete-against-live-stack",
    shutdownDrill: "complete",
    telemetryConsent: "approved-minimal-aggregate",
    founderDecision: "authorize-one-private-invitation",
    publicAccess: false,
    existingInvitations: 0,
    externalParticipants: 0,
    writeRoutes: ["POST /review-events"]
  };
}

function checkV506() {
  const incomplete = evaluateInvitationActivationGate({});
  assert(!incomplete.singleInvitationAuthorized && incomplete.completedChecks === 0, "v5.0.6 current state blocked");
  const complete = evaluateInvitationActivationGate(completeActivationEvidence());
  assert(complete.singleInvitationAuthorized && complete.status === "one-private-invitation-authorized-not-issued", "v5.0.6 bounded hypothetical authorization");
  assert(!complete.invitationIssued && complete.maximumInvitations === 1 && complete.externalParticipants === 0, "v5.0.6 invitation remains unissued");
  checkLocks(complete, "v5.0.6");
  assert(invitationActivationPacket(complete).includes("Invitation issued: false"), "v5.0.6 packet lock");
  assert(!evaluateInvitationActivationGate({ ...completeActivationEvidence(), publicAccess: true }).singleInvitationAuthorized, "v5.0.6 public access block");
  assert(!evaluateInvitationActivationGate({ ...completeActivationEvidence(), existingInvitations: 1 }).singleInvitationAuthorized, "v5.0.6 existing invitation block");
  assert(!evaluateInvitationActivationGate({ ...completeActivationEvidence(), externalParticipants: 1 }).singleInvitationAuthorized, "v5.0.6 participant block");
  assert(!evaluateInvitationActivationGate({ ...completeActivationEvidence(), writeRoutes: ["POST /review-events", "POST /publish"] }).singleInvitationAuthorized, "v5.0.6 write route block");
}

const checks = [checkV502, checkV503, checkV504, checkV505, checkV506];
for (let index = 0; index <= throughIndex; index += 1) {
  checks[index]();
  checkReleaseFiles(index);
}

const shell = text("assets/vedapath-command-shell.js");
assert(/const releaseBadge = "v5\.(?:0\.[2-9]|1\.[01]) [^"]+";/.test(shell), "current compatible release badge");
assert(shell.includes('{ title: "Private Implementation"'), "private implementation navigation group");
const currentData = json([
  "data/vedapath-private-implementation-decision.json",
  "data/vedapath-managed-secret-binding-plan.json",
  "data/vedapath-reviewer-account-provisioning-runbook.json",
  "data/vedapath-durable-queue-cutover-drill.json",
  "data/vedapath-invitation-activation-decision-gate.json"
][throughIndex]);
assert(currentData.release === through, "current release data matches through");
assert(/<strong>v5\.(?:0\.[2-9]|1\.[01])<\/strong>/.test(text("build-status.html")), "build status current version");
assert(text("CHANGELOG.md").includes(`## ${through} `), "changelog current version");
assert(text("README.md").includes(`## ${through} `), "readme current version");
assert(!existsSync("answerseal.html") && !existsSync("answerseal"), "AnswerSeal isolation");
assert(shell.includes('aria-current="page"'), "active command rail link exposes aria-current");

console.log(`v502-v506-private-implementation-ok ${through}`);
