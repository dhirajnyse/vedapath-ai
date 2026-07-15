import { existsSync, readFileSync } from "node:fs";
import {
  createPrivateInvitationDryRun,
  privateInvitationDryRunPacket
} from "./vedapath-private-invitation-dry-run.mjs";
import {
  createInvitationRevocationReceipt,
  invitationRevocationReceiptPacket
} from "./vedapath-invitation-revocation-receipt.mjs";
import {
  firstParticipantSessionSandboxPacket,
  runFirstParticipantSessionSandbox
} from "./vedapath-first-participant-session-sandbox.mjs";
import {
  pilotIncidentDrillPacket,
  runPilotIncidentDrill
} from "./vedapath-pilot-incident-drill.mjs";
import {
  evaluateFounderPrivatePilotDecision,
  founderPrivatePilotDecisionPacket
} from "./vedapath-founder-private-pilot-decision.mjs";

const versions = ["v5.0.7", "v5.0.8", "v5.0.9", "v5.1.0", "v5.1.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : versions.at(-1);
const throughIndex = versions.indexOf(through);
if (throughIndex < 0) throw new Error(`Unsupported --through version: ${through}`);

function assert(condition, message) {
  if (!condition) throw new Error(`v507-v511 check failed: ${message}`);
}

function text(name) { return readFileSync(name, "utf8"); }
function json(name) { return JSON.parse(text(name)); }
function checkPublicLock(result, label) { assert(result.publicLaunch === "blocked" && result.publicAccess === false, `${label} public lock`); }

const releaseFiles = [
  ["privateinvitationdryrun.html", "data/vedapath-private-invitation-dry-run.json", "docs/PRIVATE_INVITATION_ISSUANCE_DRY_RUN.md", "scripts/vedapath-private-invitation-dry-run.mjs"],
  ["invitationrevocationreceipt.html", "data/vedapath-invitation-revocation-receipt.json", "docs/INVITATION_REVOCATION_RECEIPT_CONTRACT.md", "scripts/vedapath-invitation-revocation-receipt.mjs"],
  ["firstparticipantsessionsandbox.html", "data/vedapath-first-participant-session-sandbox.json", "docs/FIRST_PARTICIPANT_SESSION_SANDBOX.md", "scripts/vedapath-first-participant-session-sandbox.mjs"],
  ["pilotincidentdrill.html", "data/vedapath-pilot-incident-drill.json", "docs/PILOT_INCIDENT_DRILL.md", "scripts/vedapath-pilot-incident-drill.mjs"],
  ["founderprivatepilotdecision.html", "data/vedapath-founder-private-pilot-decision.json", "docs/FOUNDER_PRIVATE_PILOT_GO_NO_GO.md", "scripts/vedapath-founder-private-pilot-decision.mjs"]
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
  const doc = text(releaseFiles[index][2]);
  for (const heading of ["## What Changed", "## Files Changed", "## Acceptance Checks", "## Known Risks"]) {
    assert(doc.includes(heading), `${versions[index]} document ${heading}`);
  }
}

const invitationInput = {
  activationDecision: "one-private-invitation-authorized-not-issued",
  invitationId: "invite-dry-run:first-private-learner",
  participantId: "participant:first-private-learner",
  role: "private-learner",
  purpose: "source-first-private-pilot",
  issuedAt: 1784073600,
  expiresAt: 1784077200,
  founderOperator: "owner:founder",
  privacyConsent: "recorded",
  deliveryChannel: "none",
  tokenRequested: false,
  accountRequested: false,
  emailRequested: false,
  publicAccess: false,
  existingInvitations: 0,
  externalParticipants: 0
};

function validDryRun() { return createPrivateInvitationDryRun(invitationInput); }

function checkV507() {
  const valid = validDryRun();
  assert(valid.valid && valid.status === "invitation-dry-run-valid-not-issued", "v5.0.7 valid dry run");
  assert(/^[a-f0-9]{64}$/.test(valid.requestDigest), "v5.0.7 deterministic request digest");
  assert(!valid.tokenCreated && !valid.accountCreated && !valid.emailSent && !valid.deliveryAttempted && !valid.invitationIssued, "v5.0.7 no issuance side effects");
  assert(valid.externalParticipants === 0, "v5.0.7 participant lock");
  checkPublicLock(valid, "v5.0.7");
  assert(privateInvitationDryRunPacket(valid).includes("Invitation issued: false"), "v5.0.7 packet lock");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, activationDecision: "blocked" }).valid, "v5.0.7 activation boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, email: "private@example.com" }).valid, "v5.0.7 direct identity boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, tokenRequested: true }).valid, "v5.0.7 token boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, emailRequested: true }).valid, "v5.0.7 email boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, deliveryChannel: "email" }).valid, "v5.0.7 delivery boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, expiresAt: invitationInput.issuedAt + 72 * 60 * 60 + 1 }).valid, "v5.0.7 expiry boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, publicAccess: true }).valid, "v5.0.7 public boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, existingInvitations: 1 }).valid, "v5.0.7 existing invitation boundary");
  assert(!createPrivateInvitationDryRun({ ...invitationInput, externalParticipants: 1 }).valid, "v5.0.7 participant boundary");
}

function revocationInput() {
  const dryRun = validDryRun();
  return {
    dryRunStatus: dryRun.status,
    requestDigest: dryRun.requestDigest,
    invitationId: invitationInput.invitationId,
    reason: "founder-cancelled",
    issuedAt: invitationInput.issuedAt,
    revokedAt: invitationInput.issuedAt + 300,
    revokedBy: "owner:founder",
    invitationIssued: false,
    tokenCreated: false,
    invitationInUse: false,
    externalParticipants: 0,
    publicAccess: false
  };
}

function validRevocation() { return createInvitationRevocationReceipt(revocationInput()); }

function checkV508() {
  const valid = validRevocation();
  assert(valid.valid && valid.status === "revocation-drill-valid-no-live-invitation", "v5.0.8 valid revocation receipt");
  assert(/^[a-f0-9]{64}$/.test(valid.receiptDigest), "v5.0.8 deterministic receipt digest");
  assert(!valid.invitationRevoked && !valid.tokenRevoked && !valid.providerMutation && !valid.notificationSent, "v5.0.8 no revocation side effects");
  checkPublicLock(valid, "v5.0.8");
  assert(invitationRevocationReceiptPacket(valid).includes("Provider mutation: false"), "v5.0.8 packet lock");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), requestDigest: "bad" }).valid, "v5.0.8 digest boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), reason: "other" }).valid, "v5.0.8 reason boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), revokedBy: "anonymous" }).valid, "v5.0.8 owner boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), revokedAt: invitationInput.issuedAt - 1 }).valid, "v5.0.8 timeline boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), invitationIssued: true }).valid, "v5.0.8 issued boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), tokenCreated: true }).valid, "v5.0.8 token boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), invitationInUse: true }).valid, "v5.0.8 in-use boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), externalParticipants: 1 }).valid, "v5.0.8 participant boundary");
  assert(!createInvitationRevocationReceipt({ ...revocationInput(), publicAccess: true }).valid, "v5.0.8 public boundary");
}

function sessionInput() {
  const startedAt = 1784073600;
  return {
    activationDecision: "one-private-invitation-authorized-not-issued",
    dryRunStatus: validDryRun().status,
    revocationStatus: validRevocation().status,
    participantId: "participant:first-private-learner",
    consent: "recorded-for-sandbox",
    startedAt,
    endedAt: startedAt + 900,
    readOnly: true,
    localOnly: true,
    networkEnabled: false,
    persistenceEnabled: false,
    liveModelEnabled: false,
    writeRoutes: [],
    externalParticipants: 0,
    publicAccess: false,
    events: [
      { type: "session-started", at: startedAt },
      { type: "source-opened", at: startedAt + 120, sourceId: "bg-2-48" },
      { type: "reflection-recorded-locally", at: startedAt + 600, reflectionLength: 84 },
      { type: "session-ended", at: startedAt + 900 }
    ]
  };
}

function validSession() { return runFirstParticipantSessionSandbox(sessionInput()); }

function checkV509() {
  const valid = validSession();
  assert(valid.valid && valid.status === "sandbox-session-complete-no-participant-created", "v5.0.9 valid session sandbox");
  assert(valid.simulatedSessionCompleted && valid.eventCount === 4 && /^[a-f0-9]{64}$/.test(valid.transcriptDigest), "v5.0.9 deterministic transcript");
  assert(!valid.participantCreated && !valid.invitationIssued && !valid.sessionStarted && valid.networkRequests === 0 && valid.durableWrites === 0, "v5.0.9 no session side effects");
  checkPublicLock(valid, "v5.0.9");
  assert(firstParticipantSessionSandboxPacket(valid).includes("Real session started: false"), "v5.0.9 packet lock");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), consent: "missing" }).valid, "v5.0.9 consent boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), email: "private@example.com" }).valid, "v5.0.9 direct identity boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), endedAt: sessionInput().startedAt + 1801 }).valid, "v5.0.9 duration boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), events: [...sessionInput().events].reverse() }).valid, "v5.0.9 event order boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), events: sessionInput().events.map((event, index) => index === 1 ? { ...event, note: "not allowed" } : event) }).valid, "v5.0.9 event field boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), readOnly: false }).valid, "v5.0.9 read-only boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), localOnly: false }).valid, "v5.0.9 local-only boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), networkEnabled: true }).valid, "v5.0.9 network boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), persistenceEnabled: true }).valid, "v5.0.9 persistence boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), liveModelEnabled: true }).valid, "v5.0.9 live-model boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), writeRoutes: ["POST /participant"] }).valid, "v5.0.9 write-route boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), externalParticipants: 1 }).valid, "v5.0.9 participant boundary");
  assert(!runFirstParticipantSessionSandbox({ ...sessionInput(), publicAccess: true }).valid, "v5.0.9 public boundary");
}

function incidentInput() {
  const detectedAt = 1784073600;
  return {
    sandboxStatus: validSession().status,
    incidentType: "privacy-leak",
    severity: "drill-only",
    incidentOwner: "owner:security",
    privacyOwner: "owner:privacy",
    detectedAt,
    containedAt: detectedAt + 300,
    shutdownAt: detectedAt + 600,
    recoveredAt: detectedAt + 1200,
    liveIncident: false,
    externalNotifications: false,
    providerMutation: false,
    durableWrite: false,
    externalParticipants: 0,
    publicAccess: false
  };
}

function validIncident() { return runPilotIncidentDrill(incidentInput()); }

function checkV510() {
  const valid = validIncident();
  assert(valid.passed && valid.status === "incident-drill-passed-no-live-incident", "v5.1.0 passing incident drill");
  assert(/^[a-f0-9]{64}$/.test(valid.evidenceDigest), "v5.1.0 deterministic incident digest");
  assert(!valid.liveIncident && valid.externalNotifications === 0 && valid.providerMutations === 0 && valid.durableWrites === 0, "v5.1.0 no incident side effects");
  checkPublicLock(valid, "v5.1.0");
  assert(pilotIncidentDrillPacket(valid).includes("Live incident: false"), "v5.1.0 packet lock");
  assert(!runPilotIncidentDrill({ ...incidentInput(), incidentType: "other" }).passed, "v5.1.0 type boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), severity: "live" }).passed, "v5.1.0 severity boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), incidentOwner: "anonymous" }).passed, "v5.1.0 owner boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), containedAt: incidentInput().detectedAt - 1 }).passed, "v5.1.0 timeline boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), containedAt: incidentInput().detectedAt + 901 }).passed, "v5.1.0 containment boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), shutdownAt: incidentInput().detectedAt + 1801 }).passed, "v5.1.0 shutdown boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), recoveredAt: incidentInput().detectedAt + 3601 }).passed, "v5.1.0 recovery boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), liveIncident: true }).passed, "v5.1.0 live boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), externalNotifications: true }).passed, "v5.1.0 notification boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), providerMutation: true }).passed, "v5.1.0 provider boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), durableWrite: true }).passed, "v5.1.0 write boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), externalParticipants: 1 }).passed, "v5.1.0 participant boundary");
  assert(!runPilotIncidentDrill({ ...incidentInput(), publicAccess: true }).passed, "v5.1.0 public boundary");
}

function founderInput() {
  const decidedAt = 1784073600;
  return {
    activationDecision: "one-private-invitation-authorized-not-issued",
    invitationDryRun: validDryRun().status,
    revocationReceipt: validRevocation().status,
    sessionSandbox: validSession().status,
    incidentDrill: validIncident().status,
    pilotOwner: "owner:founder",
    shutdownOwner: "owner:security",
    maximumParticipants: 1,
    maximumSessions: 1,
    decidedAt,
    authorizationExpiresAt: decidedAt + 3600,
    founderDecision: "authorize-one-bounded-private-session",
    invitationIssued: false,
    sessionStarted: false,
    externalParticipants: 0,
    publicAccess: false,
    writeRoutes: ["POST /review-events"]
  };
}

function checkV511() {
  const incomplete = evaluateFounderPrivatePilotDecision({});
  assert(!incomplete.pilotAuthorized && incomplete.status === "private-pilot-decision-blocked", "v5.1.1 incomplete decision blocked");
  const valid = evaluateFounderPrivatePilotDecision(founderInput());
  assert(valid.pilotAuthorized && valid.status === "one-private-session-authorized-not-started", "v5.1.1 bounded founder authorization");
  assert(valid.maximumParticipants === 1 && valid.maximumSessions === 1, "v5.1.1 one-person one-session limit");
  assert(!valid.invitationIssued && !valid.sessionStarted && !valid.participantCreated && !valid.credentialsIssued, "v5.1.1 no execution side effects");
  checkPublicLock(valid, "v5.1.1");
  assert(founderPrivatePilotDecisionPacket(valid).includes("Session started: false"), "v5.1.1 packet lock");
  assert(evaluateFounderPrivatePilotDecision({ ...founderInput(), founderDecision: "reject-private-pilot" }).status === "private-pilot-rejected", "v5.1.1 rejection");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), pilotOwner: "anonymous" }).pilotAuthorized, "v5.1.1 owner boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), maximumParticipants: 2 }).pilotAuthorized, "v5.1.1 participant limit");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), maximumSessions: 2 }).pilotAuthorized, "v5.1.1 session limit");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), authorizationExpiresAt: founderInput().decidedAt + 72 * 60 * 60 + 1 }).pilotAuthorized, "v5.1.1 expiry boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), invitationIssued: true }).pilotAuthorized, "v5.1.1 invitation boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), sessionStarted: true }).pilotAuthorized, "v5.1.1 session boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), externalParticipants: 1 }).pilotAuthorized, "v5.1.1 external participant boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), publicAccess: true }).pilotAuthorized, "v5.1.1 public boundary");
  assert(!evaluateFounderPrivatePilotDecision({ ...founderInput(), writeRoutes: ["POST /publish"] }).pilotAuthorized, "v5.1.1 write route boundary");
}

const checks = [checkV507, checkV508, checkV509, checkV510, checkV511];
for (let index = 0; index <= throughIndex; index += 1) {
  checks[index]();
  checkReleaseFiles(index);
}

const shell = text("assets/vedapath-command-shell.js");
const badge = shell.match(/const releaseBadge = "v(\d+)\.(\d+)\.(\d+) [^"]+";/);
assert(badge, "current release badge");
const badgeVersion = badge.slice(1).map(Number);
const throughVersion = through.slice(1).split(".").map(Number);
assert(
  badgeVersion[0] > throughVersion[0] ||
  (badgeVersion[0] === throughVersion[0] && badgeVersion[1] > throughVersion[1]) ||
  (badgeVersion[0] === throughVersion[0] && badgeVersion[1] === throughVersion[1] && badgeVersion[2] >= throughVersion[2]),
  "release badge older than private pilot validation"
);
assert(shell.includes('{ title: "Private Pilot Validation"'), "private pilot validation navigation group");
assert(shell.includes('aria-current="page"'), "active command rail link exposes aria-current");
assert(text("build-status.html").includes("Phase 440: Founder Private Pilot Go/No-Go"), "build status private pilot phase");
assert(text("CHANGELOG.md").includes(`## ${through} `), "changelog current version");
assert(text("README.md").includes(`## ${through} `), "readme current version");
for (let index = 0; index <= throughIndex; index += 1) {
  const entry = text("CHANGELOG.md").split(`## ${versions[index]} `)[1]?.split("\n## ")[0] || "";
  for (const label of ["Changes made:", "Files changed:", "Checks run:", "Known risks:"]) assert(entry.includes(label), `${versions[index]} changelog ${label}`);
  assert(text("scripts/check-static-links.mjs").includes(releaseFiles[index][0]), `${versions[index]} static link registry`);
}
assert(!existsSync("answerseal.html") && !existsSync("answerseal"), "AnswerSeal filesystem isolation");
assert(!/answerseal/i.test(shell), "AnswerSeal shell isolation");

console.log(`v507-v511-private-pilot-validation-ok ${through}`);
