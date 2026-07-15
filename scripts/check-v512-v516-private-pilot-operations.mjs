import { existsSync, readFileSync } from "node:fs";
import {
  evaluatePrivateStackReadiness,
  privateStackReadinessPacket
} from "./vedapath-private-stack-readiness.mjs";
import {
  oneInvitationAdapterPacket,
  prepareOneInvitationAdapter
} from "./vedapath-one-invitation-adapter.mjs";
import {
  participantConsentHandshakePacket,
  recordParticipantConsentHandshake
} from "./vedapath-participant-consent-handshake.mjs";
import {
  evaluateFirstSessionObservability,
  firstSessionObservabilityPacket
} from "./vedapath-first-session-observability.mjs";
import {
  evaluateFounderPilotEvidenceReview,
  founderPilotEvidenceReviewPacket
} from "./vedapath-founder-pilot-evidence-review.mjs";

const versions = ["v5.1.2", "v5.1.3", "v5.1.4", "v5.1.5", "v5.1.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

function assert(condition, message) {
  if (!condition) throw new Error(`v512-v516 check failed: ${message}`);
}

function text(name) { return readFileSync(name, "utf8"); }
function json(name) { return JSON.parse(text(name)); }
function checkPublicLock(result, label) {
  assert(result.publicLaunch === "blocked" && result.publicAccess === false, `${label} public lock`);
}

const releaseFiles = [
  ["privatestackreadiness.html", "data/vedapath-private-stack-readiness.json", "docs/PRIVATE_STACK_READINESS_GATE.md", "scripts/vedapath-private-stack-readiness.mjs"],
  ["oneinvitationadapter.html", "data/vedapath-one-invitation-adapter.json", "docs/ONE_INVITATION_ADAPTER_CONTRACT.md", "scripts/vedapath-one-invitation-adapter.mjs"],
  ["participantconsenthandshake.html", "data/vedapath-participant-consent-handshake.json", "docs/PARTICIPANT_CONSENT_HANDSHAKE_CONTRACT.md", "scripts/vedapath-participant-consent-handshake.mjs"],
  ["firstsessionobservability.html", "data/vedapath-first-session-observability.json", "docs/FIRST_SESSION_OBSERVABILITY_AND_ROLLBACK.md", "scripts/vedapath-first-session-observability.mjs"],
  ["founderpilotevidencereview.html", "data/vedapath-founder-pilot-evidence-review.json", "docs/FOUNDER_PILOT_EVIDENCE_REVIEW.md", "scripts/vedapath-founder-pilot-evidence-review.mjs"]
];

function checkReleaseFiles(index) {
  for (const name of releaseFiles[index]) assert(existsSync(name), `${versions[index]} file ${name}`);
  const page = text(releaseFiles[index][0]);
  assert(page.includes("data-retrieval-app"), `${versions[index]} renderer mount`);
  assert(page.includes(releaseFiles[index][1]), `${versions[index]} data link`);
  assert(page.includes("vedapath-command-shell.js"), `${versions[index]} command shell`);
  assert(page.includes("<h1>"), `${versions[index]} page heading`);
  assert(page.includes('class="link active"'), `${versions[index]} static active navigation`);
  const data = json(releaseFiles[index][1]);
  assert(data.release === versions[index], `${versions[index]} data release`);
  assert(data.public_launch === "blocked", `${versions[index]} data public lock`);
  assert(data.packet.includes("Public launch: blocked"), `${versions[index]} founder packet public lock`);
  const doc = text(releaseFiles[index][2]);
  for (const heading of ["## What Changed", "## Files Changed", "## Acceptance Checks", "## Known Risks"]) {
    assert(doc.includes(heading), `${versions[index]} document ${heading}`);
  }
}

const stackInput = {
  authorizationStatus: "one-private-session-authorized-not-started",
  stackId: "stack-candidate:first-private-pilot",
  origin: "private-demo-origin",
  identityMode: "pseudonymous-only",
  rightsMode: "reviewed-source-only",
  queueMode: "review-events-only",
  privacyMode: "local-first",
  incidentMode: "tested",
  rollbackMode: "manual-owner",
  operationsOwner: "owner:operations",
  privacyOwner: "owner:privacy",
  securityOwner: "owner:security",
  assessedAt: 1784073600,
  expiresAt: 1784077200,
  maximumParticipants: 1,
  maximumSessions: 1,
  writeRoutes: ["POST /review-events"],
  credentialsPresent: false,
  providerConnected: false,
  deploymentActive: false,
  invitationIssued: false,
  sessionStarted: false,
  publicAccess: false
};

function validStack() { return evaluatePrivateStackReadiness(stackInput); }

function checkV512() {
  const valid = validStack();
  assert(valid.ready && valid.status === "private-stack-ready-no-activation", "v5.1.2 valid readiness");
  assert(Object.values(valid.checks).every(Boolean), "v5.1.2 all posture checks");
  assert(valid.maximumParticipants === 1 && valid.maximumSessions === 1, "v5.1.2 bounded scope");
  assert(!valid.credentialsPresent && !valid.providerConnected && !valid.deploymentActive && !valid.invitationIssued && !valid.sessionStarted, "v5.1.2 no activation effects");
  checkPublicLock(valid, "v5.1.2");
  assert(privateStackReadinessPacket(valid).includes("Deployment active: false"), "v5.1.2 packet lock");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, authorizationStatus: "blocked" }).ready, "v5.1.2 authorization boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, rightsMode: "unknown" }).ready, "v5.1.2 posture boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, privacyOwner: "anonymous" }).ready, "v5.1.2 owner boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, expiresAt: stackInput.assessedAt + 24 * 60 * 60 + 1 }).ready, "v5.1.2 expiry boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, maximumParticipants: 2 }).ready, "v5.1.2 participant boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, maximumSessions: 2 }).ready, "v5.1.2 session scope boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, writeRoutes: ["POST /participants"] }).ready, "v5.1.2 route boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, credentialsPresent: true }).ready, "v5.1.2 credential boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, providerConnected: true }).ready, "v5.1.2 provider boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, deploymentActive: true }).ready, "v5.1.2 deployment boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, invitationIssued: true }).ready, "v5.1.2 invitation boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, sessionStarted: true }).ready, "v5.1.2 session boundary");
  assert(!evaluatePrivateStackReadiness({ ...stackInput, publicAccess: true }).ready, "v5.1.2 public boundary");
}

function adapterInput() {
  return {
    stackReadinessStatus: validStack().status,
    adapterId: "adapter:first-private-pilot",
    invitationId: "invite-candidate:first-private-pilot",
    participantId: "participant:first-private-learner",
    idempotencyKey: "idem:first-private-pilot",
    role: "private-learner",
    purpose: "source-first-private-pilot",
    consentStatus: "consent-pending",
    deliveryMode: "fixture-only",
    transport: "none",
    mutationMode: "dry-run",
    preparedAt: 1784073600,
    expiresAt: 1784077200,
    tokenRequested: false,
    accountRequested: false,
    emailRequested: false,
    providerConnected: false,
    publicAccess: false
  };
}

function validAdapter() { return prepareOneInvitationAdapter(adapterInput()); }

function checkV513() {
  const valid = validAdapter();
  assert(valid.ready && valid.status === "one-invitation-adapter-ready-not-sent", "v5.1.3 valid adapter");
  assert(/^[a-f0-9]{64}$/.test(valid.requestDigest), "v5.1.3 request digest");
  assert(valid.requestDigest === prepareOneInvitationAdapter(adapterInput()).requestDigest, "v5.1.3 deterministic digest");
  assert(!valid.tokenCreated && !valid.accountCreated && !valid.emailSent && !valid.deliveryAttempted && !valid.providerMutation && !valid.invitationIssued, "v5.1.3 no adapter effects");
  checkPublicLock(valid, "v5.1.3");
  assert(oneInvitationAdapterPacket(valid).includes("Delivery attempted: false"), "v5.1.3 packet lock");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), stackReadinessStatus: "blocked" }).ready, "v5.1.3 readiness boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), idempotencyKey: "bad" }).ready, "v5.1.3 idempotency boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), role: "admin" }).ready, "v5.1.3 role boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), consentStatus: "accepted" }).ready, "v5.1.3 consent boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), transport: "email" }).ready, "v5.1.3 transport boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), expiresAt: adapterInput().preparedAt + 72 * 60 * 60 + 1 }).ready, "v5.1.3 expiry boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), email: "private@example.com" }).ready, "v5.1.3 identity boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), tokenRequested: true }).ready, "v5.1.3 token boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), accountRequested: true }).ready, "v5.1.3 account boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), emailRequested: true }).ready, "v5.1.3 email boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), providerConnected: true }).ready, "v5.1.3 provider boundary");
  assert(!prepareOneInvitationAdapter({ ...adapterInput(), publicAccess: true }).ready, "v5.1.3 public boundary");
}

function consentInput() {
  return {
    adapterStatus: validAdapter().status,
    consentId: "consent-fixture:first-private-pilot",
    participantId: "participant:first-private-learner",
    consentMode: "fixture-only",
    consentVersion: "private-pilot-consent-v1",
    privacyNoticeVersion: "private-pilot-privacy-v1",
    capacityAttestation: "adult-volunteer",
    scopeAcknowledgement: "source-first-reflection-only",
    dataUse: "session-safety-and-quality-only",
    telemetry: "none",
    withdrawal: "available-before-session",
    identityMode: "pseudonymous-only",
    acceptedAt: 1784073600,
    expiresAt: 1784077200,
    accountRequested: false,
    tokenRequested: false,
    sessionStarted: false,
    publicAccess: false
  };
}

function validConsent() { return recordParticipantConsentHandshake(consentInput()); }

function checkV514() {
  const valid = validConsent();
  assert(valid.valid && valid.status === "consent-handshake-fixture-valid-no-participant", "v5.1.4 valid consent fixture");
  assert(/^[a-f0-9]{64}$/.test(valid.receiptDigest), "v5.1.4 receipt digest");
  assert(valid.receiptDigest === recordParticipantConsentHandshake(consentInput()).receiptDigest, "v5.1.4 deterministic receipt");
  assert(!valid.accountCreated && !valid.tokenCreated && !valid.participantCreated && !valid.sessionStarted && !valid.telemetryEnabled, "v5.1.4 no participant effects");
  checkPublicLock(valid, "v5.1.4");
  assert(participantConsentHandshakePacket(valid).includes("Fixture only: true"), "v5.1.4 packet boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), adapterStatus: "blocked" }).valid, "v5.1.4 adapter boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), consentMode: "live" }).valid, "v5.1.4 fixture boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), consentVersion: "unknown" }).valid, "v5.1.4 version boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), capacityAttestation: "missing" }).valid, "v5.1.4 capacity boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), scopeAcknowledgement: "therapy" }).valid, "v5.1.4 scope boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), dataUse: "marketing" }).valid, "v5.1.4 data-use boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), telemetry: "enabled" }).valid, "v5.1.4 telemetry boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), withdrawal: "unavailable" }).valid, "v5.1.4 withdrawal boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), email: "private@example.com" }).valid, "v5.1.4 identity boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), expiresAt: consentInput().acceptedAt + 72 * 60 * 60 + 1 }).valid, "v5.1.4 expiry boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), accountRequested: true }).valid, "v5.1.4 account boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), tokenRequested: true }).valid, "v5.1.4 token boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), sessionStarted: true }).valid, "v5.1.4 session boundary");
  assert(!recordParticipantConsentHandshake({ ...consentInput(), publicAccess: true }).valid, "v5.1.4 public boundary");
}

function observabilityInput() {
  return {
    consentStatus: validConsent().status,
    sessionId: "session-fixture:first-private-pilot",
    participantId: "participant:first-private-learner",
    rollbackOwner: "owner:operations",
    checkpointDigest: "a".repeat(64),
    telemetryMode: "local-aggregate-only",
    startedAt: 1784073600,
    endedAt: 1784073720,
    events: [
      { type: "session-opened", at: 1784073600, statusCode: 200, latencyMs: 4 },
      { type: "source-viewed", at: 1784073630, statusCode: 200, latencyMs: 18 },
      { type: "boundary-acknowledged", at: 1784073660, statusCode: 204, latencyMs: 2 },
      { type: "session-closed", at: 1784073720, statusCode: 200, latencyMs: 3 }
    ],
    rawContentCaptured: false,
    exportEnabled: false,
    providerConnected: false,
    networkEnabled: false,
    sessionStarted: false,
    publicAccess: false
  };
}

function validObservability() { return evaluateFirstSessionObservability(observabilityInput()); }

function checkV515() {
  const valid = validObservability();
  assert(valid.ready && valid.status === "first-session-observability-ready-no-live-session", "v5.1.5 valid observability fixture");
  assert(valid.eventCount === 4 && /^[a-f0-9]{64}$/.test(valid.eventDigest), "v5.1.5 event evidence");
  assert(valid.rollbackAvailable && !valid.rawContentCaptured && !valid.telemetryExported && !valid.providerConnected && valid.networkRequests === 0 && !valid.sessionStarted && !valid.participantCreated, "v5.1.5 observability boundaries");
  checkPublicLock(valid, "v5.1.5");
  assert(firstSessionObservabilityPacket(valid).includes("Raw content captured: false"), "v5.1.5 packet lock");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), consentStatus: "blocked" }).ready, "v5.1.5 consent boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), rollbackOwner: "anonymous" }).ready, "v5.1.5 owner boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), checkpointDigest: "bad" }).ready, "v5.1.5 checkpoint boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), telemetryMode: "exported" }).ready, "v5.1.5 telemetry boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), endedAt: observabilityInput().startedAt + 30 * 60 + 1 }).ready, "v5.1.5 duration boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), events: observabilityInput().events.toReversed() }).ready, "v5.1.5 event order boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), events: observabilityInput().events.map((event, index) => index ? event : { ...event, rawText: "forbidden" }) }).ready, "v5.1.5 event field boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), events: observabilityInput().events.map((event, index) => index ? event : { ...event, latencyMs: 10001 }) }).ready, "v5.1.5 latency boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), rawContentCaptured: true }).ready, "v5.1.5 raw-content boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), exportEnabled: true }).ready, "v5.1.5 export boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), providerConnected: true }).ready, "v5.1.5 provider boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), networkEnabled: true }).ready, "v5.1.5 network boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), sessionStarted: true }).ready, "v5.1.5 session boundary");
  assert(!evaluateFirstSessionObservability({ ...observabilityInput(), publicAccess: true }).ready, "v5.1.5 public boundary");
}

const acknowledgements = [
  "identity-is-pseudonymous",
  "rights-are-reviewed-source-only",
  "consent-is-fixture-only",
  "telemetry-is-local-aggregate-only",
  "execution-needs-separate-audit"
];

function founderInput() {
  return {
    founderAuthorization: "one-private-session-authorized-not-started",
    stackReadiness: validStack().status,
    invitationAdapter: validAdapter().status,
    consentHandshake: validConsent().status,
    sessionObservability: validObservability().status,
    acknowledgements,
    founderOwner: "owner:founder",
    privacyOwner: "owner:privacy",
    securityOwner: "owner:security",
    reviewedAt: 1784073600,
    expiresAt: 1784077200,
    maximumParticipants: 1,
    maximumSessions: 1,
    founderDecision: "approve-evidence-keep-execution-disabled",
    credentialsIssued: false,
    invitationIssued: false,
    sessionStarted: false,
    participantCreated: false,
    providerConnected: false,
    publicAccess: false
  };
}

function checkV516() {
  const valid = evaluateFounderPilotEvidenceReview(founderInput());
  assert(valid.approved && valid.status === "private-pilot-evidence-approved-execution-disabled", "v5.1.6 valid evidence approval");
  assert(valid.completedEvidence === 5 && valid.totalEvidence === 5 && valid.acknowledgementCount === 5, "v5.1.6 complete evidence");
  assert(valid.maximumParticipants === 1 && valid.maximumSessions === 1, "v5.1.6 bounded scope");
  assert(!valid.credentialsIssued && !valid.invitationIssued && !valid.sessionStarted && !valid.participantCreated && !valid.providerConnected, "v5.1.6 execution remains disabled");
  assert(valid.nextAction === "separate-audited-execution-decision", "v5.1.6 separate execution decision");
  checkPublicLock(valid, "v5.1.6");
  assert(founderPilotEvidenceReviewPacket(valid).includes("Invitation issued: false"), "v5.1.6 packet lock");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), stackReadiness: "blocked" }).approved, "v5.1.6 evidence boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), acknowledgements: acknowledgements.slice(0, 4) }).approved, "v5.1.6 acknowledgement boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), acknowledgements: [...acknowledgements, "unknown"] }).approved, "v5.1.6 acknowledgement allowlist");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), privacyOwner: "anonymous" }).approved, "v5.1.6 owner boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), expiresAt: founderInput().reviewedAt + 24 * 60 * 60 + 1 }).approved, "v5.1.6 expiry boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), maximumParticipants: 2 }).approved, "v5.1.6 participant boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), maximumSessions: 2 }).approved, "v5.1.6 session scope boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), credentialsIssued: true }).approved, "v5.1.6 credential boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), invitationIssued: true }).approved, "v5.1.6 invitation boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), sessionStarted: true }).approved, "v5.1.6 session boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), participantCreated: true }).approved, "v5.1.6 participant creation boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), providerConnected: true }).approved, "v5.1.6 provider boundary");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), publicAccess: true }).approved, "v5.1.6 public boundary");
  const rejected = evaluateFounderPilotEvidenceReview({ ...founderInput(), founderDecision: "reject-pilot-evidence" });
  assert(!rejected.approved && rejected.status === "private-pilot-evidence-rejected", "v5.1.6 rejection outcome");
  assert(!evaluateFounderPilotEvidenceReview({ ...founderInput(), founderDecision: "" }).approved, "v5.1.6 decision boundary");
}

const checks = [checkV512, checkV513, checkV514, checkV515, checkV516];
for (let index = 0; index <= throughIndex; index += 1) {
  checkReleaseFiles(index);
  checks[index]();
}

const shell = text("assets/vedapath-command-shell.js");
assert(shell.includes(`const releaseBadge = "${through} `), "current release badge");
assert(shell.includes('{ title: "Private Pilot Operations"'), "private pilot operations navigation group");
for (let index = 0; index <= throughIndex; index += 1) {
  assert(shell.includes(`"${["Stack Readiness", "Invite Adapter", "Consent Handshake", "Observability", "Evidence Review"][index]}"`), `${versions[index]} shell label`);
}

const build = text("build-status.html");
assert(build.includes(`<strong>${through}</strong>`), "build status current version");
assert(build.includes(`Phase ${441 + throughIndex}:`), "build status current phase");
assert(build.includes("PRIVATE PILOT OPERATIONS"), "build status operations marker");

const changelog = text("CHANGELOG.md");
const readme = text("README.md");
for (let index = 0; index <= throughIndex; index += 1) {
  assert(changelog.includes(`## ${versions[index]} `), `${versions[index]} changelog entry`);
  assert(readme.includes(`## ${versions[index]} `), `${versions[index]} readme entry`);
}

console.log(`v512-v516-private-pilot-operations-ok ${through}`);
