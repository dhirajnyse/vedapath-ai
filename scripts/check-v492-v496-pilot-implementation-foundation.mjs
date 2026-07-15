import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { evaluateProviderRegionCandidate, providerRegionBoundary } from "./vedapath-provider-region-decision.mjs";
import { environmentSecretBoundary, validateEnvironmentSecretContract } from "./vedapath-environment-secret-contract.mjs";
import { authorizeReviewerSession, issueReviewerSession, reviewerSessionBoundary, verifyReviewerSession } from "./vedapath-reviewer-session-spike.mjs";
import { createRightsQueueRepository, rightsQueueRepositoryBoundary } from "./vedapath-rights-queue-repository.mjs";

const versions = ["v4.9.2", "v4.9.3", "v4.9.4", "v4.9.5", "v4.9.6"];
const files = {
  "v4.9.2": ["providerregiondecision.html", "data/vedapath-provider-region-decision.json", "docs/PROVIDER_REGION_DECISION_PACKET.md", "scripts/vedapath-provider-region-decision.mjs"],
  "v4.9.3": ["environmentsecretcontract.html", "data/vedapath-environment-secret-contract.json", "docs/ENVIRONMENT_SECRET_CONTRACT.md", "scripts/vedapath-environment-secret-contract.mjs"],
  "v4.9.4": ["reviewersessionspike.html", "data/vedapath-reviewer-session-spike.json", "docs/REVIEWER_SESSION_SECURITY_SPIKE.md", "scripts/vedapath-reviewer-session-spike.mjs", "assets/vedapath-reviewer-session-simulator.js"],
  "v4.9.5": ["rightsqueuepersistencecontract.html", "data/vedapath-rights-queue-persistence-contract.json", "docs/RIGHTS_QUEUE_PERSISTENCE_CONTRACT.md", "scripts/vedapath-rights-queue-repository.mjs", "assets/vedapath-queue-persistence-simulator.js"],
  "v4.9.6": ["invitationonlypilotgate.html", "data/vedapath-invitation-only-pilot-gate.json", "docs/INVITATION_ONLY_PILOT_ACTIVATION_GATE.md"]
};

function text(name) { return readFileSync(name, "utf8"); }
function json(name) { return JSON.parse(text(name)); }
function has(version) { return selected.includes(version); }

const throughIndex = process.argv.indexOf("--through");
const through = throughIndex >= 0 ? process.argv[throughIndex + 1] : versions.at(-1);
assert(versions.includes(through), "unknown --through version");
const selected = versions.slice(0, versions.indexOf(through) + 1);

for (const version of selected) {
  for (const name of files[version]) assert(existsSync(name), version + " missing " + name);
  const releaseFile = files[version].find(function (name) { return name.startsWith("data/"); });
  const document = files[version].find(function (name) { return name.startsWith("docs/"); });
  const page = files[version].find(function (name) { return name.endsWith(".html"); });
  assert.equal(json(releaseFile).release, version, version + " data release");
  assert(text(document).includes("## Known Risks"), version + " documented risks");
  assert(text(page).includes("vedapath-command-shell.js"), version + " shared shell");
  assert(!/AnswerSeal/i.test(text(page) + text(document) + text(releaseFile)), version + " project isolation");
  assert(text("CHANGELOG.md").includes("## " + version), version + " changelog entry");
  assert(text("README.md").includes("## " + version), version + " README entry");
}

function providerChecks() {
  const complete = evaluateProviderRegionCandidate({
    provider_label: "Private Provider A",
    region_label: "Documented Region 1",
    request_response_compatible: true,
    private_access_available: true,
    region_controls_documented: true,
    secret_management_available: true,
    logging_redaction_confirmed: true,
    spend_cap_set: true,
    owner_named: true,
    zero_write_routes: true
  });
  assert.equal(complete.ready_for_implementation, true, "complete provider candidate ready");
  assert.equal(complete.score, 100, "provider score");
  assert.equal(complete.deployment_activated, false, "provider candidate does not deploy");
  assert.equal(complete.write_routes.length, 0, "provider candidate zero writes");
  const incomplete = evaluateProviderRegionCandidate({ provider_label: "Unsafe<script>" });
  assert.equal(incomplete.ready_for_implementation, false, "incomplete provider candidate blocked");
  assert.equal(incomplete.missing.length, 8, "all missing criteria visible");
  assert(!/[<>]/.test(incomplete.provider_label), "provider label sanitized");
  assert.equal(providerRegionBoundary.provider_selected, false, "provider remains unselected");
  assert.equal(providerRegionBoundary.deployment, "not-activated", "provider deployment locked");
}

function environmentChecks() {
  const safe = validateEnvironmentSecretContract({
    environment: "pilot",
    public_origin: "https://pilot.example.test",
    api_origin: "https://api.pilot.example.test",
    secret_refs: ["VEDAPATH_SESSION_SIGNING_SECRET", "VEDAPATH_REVIEWER_STORE_KEY"],
    telemetry: "privacy-safe-aggregate-only",
    write_routes: [],
    deployment: "not-activated"
  });
  assert.equal(safe.ok, true, "safe pilot environment accepted");
  assert.equal(safe.safe_summary.secret_values_present, false, "safe summary excludes values");
  assert.equal(safe.safe_summary.write_route_count, 0, "safe summary zero writes");

  const secretValue = "never-serialize-this-secret-value";
  const unsafe = validateEnvironmentSecretContract({
    environment: "pilot",
    public_origin: "http://pilot.example.test",
    api_origin: "https://api.pilot.example.test",
    secret_refs: ["literal-secret-value"],
    secret_value: secretValue,
    telemetry: "raw-events",
    write_routes: ["/review"],
    deployment: "active"
  });
  assert.equal(unsafe.ok, false, "unsafe config rejected");
  assert(unsafe.errors.length >= 6, "unsafe config reports boundaries");
  assert(!JSON.stringify(unsafe).includes(secretValue), "secret value never serialized");
  assert.equal(environmentSecretBoundary.accepts_secret_values, false, "secret values refused");
  assert.equal(environmentSecretBoundary.deployment, "not-activated", "environment deployment locked");
}

function sessionChecks() {
  const secret = "test-only-session-secret-1234567890";
  const now = Date.parse("2026-07-15T00:00:00.000Z");
  const issued = issueReviewerSession({ subject: "reviewer-source-01", role: "source-reviewer", expires_in_seconds: 120 }, { secret, now, sessionId: "session-01" });
  assert.equal(issued.claims.production_allowed, false, "issued session production denied");
  assert.equal(verifyReviewerSession(issued.token, { secret, now: now + 30_000 }).ok, true, "valid session verified");
  assert.equal(authorizeReviewerSession(issued.token, "view-source", { secret, now: now + 30_000 }).preview_allowed, true, "role operation allowed");
  assert.equal(authorizeReviewerSession(issued.token, "publish-source", { secret, now: now + 30_000 }).preview_allowed, false, "global operation locked");
  assert.equal(verifyReviewerSession(issued.token, { secret, now: now + 121_000 }).reason, "Session expired.", "expired session rejected");
  assert.equal(verifyReviewerSession(issued.token, { secret, now: now + 30_000, revokedTokenIds: new Set(["session-01"]) }).reason, "Session revoked.", "revoked session rejected");
  const tampered = issued.token.slice(0, -1) + (issued.token.endsWith("a") ? "b" : "a");
  assert.equal(verifyReviewerSession(tampered, { secret, now: now + 30_000 }).ok, false, "tampered session rejected");
  const capped = issueReviewerSession({ subject: "reviewer-rights-02", role: "rights-reviewer", expires_in_seconds: 99_999 }, { secret, now, sessionId: "session-02" });
  assert.equal(capped.claims.exp - capped.claims.iat, 3600, "session lifetime capped");
  assert.throws(function () { issueReviewerSession({ subject: "real@email.test", role: "observer" }, { secret, now }); }, /pseudonymous/, "real-looking identity rejected");
  assert.equal(reviewerSessionBoundary.identity_provider, "not-connected", "identity provider not connected");
  assert(!JSON.stringify(issued.claims).includes(secret), "session claims exclude signing secret");
  const page = text("reviewersessionspike.html");
  assert(page.includes("vpSessionForm") && page.includes("vedapath-reviewer-session-simulator.js"), "session simulator wired");
}

function repositoryChecks() {
  const seed = { id: "candidate-test", citation: "Isha Upanishad 1", family: "Upanishad | Shruti", status: "new", rights_state: "citation-only", source_state: "draft", review_lane: "Source reviewer", version: 1 };
  const original = JSON.stringify(seed);
  const repository = createRightsQueueRepository([seed]);
  const applied = repository.transition({ candidate_id: "candidate-test", event_id: "event-01", expected_version: 1, action: "claim-source", reviewer_role: "source-reviewer", occurred_at: "2026-07-15T00:00:00Z" });
  assert.equal(applied.ok, true, "queue transition applied");
  assert.equal(applied.idempotent, false, "first event not replay");
  assert.equal(applied.record.version, 2, "queue version incremented");
  assert.equal(applied.record.publication_state, "blocked", "publication remains blocked");
  assert.equal(applied.record.registry_merge, "manual-only", "registry remains manual");
  assert.equal(applied.record.audit.length, 1, "audit event appended");
  const replay = repository.transition({ candidate_id: "candidate-test", event_id: "event-01", expected_version: 2, action: "claim-source", reviewer_role: "source-reviewer" });
  assert.equal(replay.idempotent, true, "event replay idempotent");
  assert.equal(replay.record.version, 2, "replay does not change version");
  const conflict = repository.transition({ candidate_id: "candidate-test", event_id: "event-stale", expected_version: 1, action: "hold", reviewer_role: "source-reviewer" });
  assert.equal(conflict.conflict, true, "stale version rejected");
  const denied = repository.transition({ candidate_id: "candidate-test", event_id: "event-denied", expected_version: 2, action: "claim-rights", reviewer_role: "source-reviewer" });
  assert.equal(denied.ok, false, "cross-role queue action denied");
  assert.equal(repository.get("candidate-test").version, 2, "denied action leaves version unchanged");
  assert.equal(JSON.stringify(seed), original, "seed input remains immutable");
  assert.equal(rightsQueueRepositoryBoundary.durable_provider, "not-connected", "durable provider absent");
  const page = text("rightsqueuepersistencecontract.html");
  assert(page.includes("vpApplyTransition") && page.includes("vedapath-queue-persistence-simulator.js"), "persistence simulator wired");
}

function finalChecks() {
  const gate = json("data/vedapath-invitation-only-pilot-gate.json");
  assert.equal(gate.schema, "vedapath.invitation-only-pilot-gate.v1", "activation gate schema");
  assert.equal(gate.decision, "ready-for-infrastructure-authorization-not-activated", "activation gate decision");
  for (const field of ["provider_selected", "credentials_attached", "identity_provider_connected", "durable_store_connected", "security_review_complete", "rights_approval_complete", "founder_activation_authorized", "activated"]) assert.equal(gate[field], false, field + " remains false");
  assert.equal(gate.invitations_issued, 0, "no invitations issued");
  assert.equal(gate.external_participants, 0, "no external participants");
  assert.equal(gate.deployment, "none", "no deployment");
  assert.equal(gate.write_routes.length, 0, "no write routes");
  assert.equal(gate.public_launch, "blocked", "public launch blocked");

  const shell = text("assets/vedapath-command-shell.js");
  assert.equal((shell.match(/title: "Pilot Implementation"/g) || []).length, 1, "single pilot implementation group");
  assert(shell.includes('const releaseBadge = "v4.9.6 pilot implementation gate";'), "final release badge");
  for (const label of ["Provider Packet", "Environment", "Reviewer Session", "Queue Contract", "Activation Gate"]) assert(shell.includes('"' + label + '"'), "shell link " + label);
  assert(text("build-status.html").includes("<strong>v4.9.6</strong>"), "build status final version");
  assert(/infrastructure authorization/i.test(text("build-status.html")), "build status next decision");
  assert(!/AnswerSeal/i.test(shell + text("build-status.html")), "shared project isolation");
}

if (has("v4.9.2")) providerChecks();
if (has("v4.9.3")) environmentChecks();
if (has("v4.9.4")) sessionChecks();
if (has("v4.9.5")) repositoryChecks();
if (has("v4.9.6")) finalChecks();

console.log("v492-v496-pilot-implementation-foundation-ok " + through);
