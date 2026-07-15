import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createHostedSourceAdapter, hostedSourceAdapterDecision } from "./vedapath-hosted-source-adapter.mjs";
import { createPrivacySafeRequestGuard, privacyMonitorBoundary } from "./vedapath-private-request-guard.mjs";
import { evaluateReviewerCapability, reviewerIdentityBoundary, reviewerRoles } from "./vedapath-reviewer-authorization.mjs";
import { applyRightsQueueAction, normalizeRightsQueueRecord, rightsQueueBoundary } from "./vedapath-rights-operations-queue.mjs";

const versions = ["v4.8.7", "v4.8.8", "v4.8.9", "v4.9.0", "v4.9.1"];
const files = {
  "v4.8.7": ["hostedreadonlyapiadapter.html", "data/vedapath-hosted-readonly-api-adapter.json", "docs/HOSTED_READONLY_API_ADAPTER.md", "scripts/vedapath-hosted-source-adapter.mjs"],
  "v4.8.8": ["ratelimitprivacymonitoring.html", "data/vedapath-rate-limit-privacy-monitor.json", "docs/RATE_LIMIT_PRIVACY_MONITORING.md", "scripts/vedapath-private-request-guard.mjs"],
  "v4.8.9": ["revieweridentityroles.html", "data/vedapath-reviewer-identity-roles.json", "docs/REVIEWER_IDENTITY_ROLE_PROTOTYPE.md", "scripts/vedapath-reviewer-authorization.mjs", "assets/vedapath-reviewer-role-simulator.js"],
  "v4.9.0": ["rightsoperationsqueue.html", "data/vedapath-rights-operations-queue.json", "docs/RIGHTS_OPERATIONS_QUEUE.md", "scripts/vedapath-rights-operations-queue.mjs", "assets/vedapath-rights-operations-queue.js"],
  "v4.9.1": ["controlledexternalpilotgate.html", "data/vedapath-controlled-external-pilot-gate.json", "docs/CONTROLLED_EXTERNAL_PILOT_GATE.md"]
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
  const release = Object.values(files[version]).find(function (name) { return name.startsWith("data/"); });
  const document = Object.values(files[version]).find(function (name) { return name.startsWith("docs/"); });
  const page = Object.values(files[version]).find(function (name) { return name.endsWith(".html"); });
  assert.equal(json(release).release, version, version + " data release");
  assert(text(document).includes("## Known Risks"), version + " documented known risks");
  assert(text(page).includes("vedapath-command-shell.js"), version + " shared shell");
  assert(!/AnswerSeal/i.test(text(page) + text(document) + text(release)), version + " project isolation");
  assert(text("CHANGELOG.md").includes("## " + version), version + " changelog entry");
  assert(text("README.md").includes("## " + version), version + " README entry");
}

async function adapterChecks() {
  const adapter = createHostedSourceAdapter();
  const origin = "https://dhirajnyse.github.io";
  function request(pathname, options = {}) {
    return new Request("https://api.preview.vedapath.test" + pathname, {
      method: options.method || "GET",
      headers: { origin, "x-vedapath-request-id": options.requestId || "test-request", ...(options.headers || {}) },
      body: options.body
    });
  }

  let response = await adapter(request("/health"));
  assert.equal(response.status, 200, "hosted health status");
  assert.equal(response.headers.get("cache-control"), "no-store", "hosted no-store");
  assert.equal(response.headers.get("x-frame-options"), "DENY", "hosted frame denial");
  assert.equal(response.headers.get("access-control-allow-origin"), origin, "hosted CORS origin");
  assert.equal((await response.json()).writes, 0, "hosted health zero writes");

  response = await adapter(request("/sources"));
  const sources = await response.json();
  assert.equal(response.status, 200, "hosted sources status");
  assert(sources.count >= 8, "hosted reviewed registry records");

  response = await adapter(request("/search"));
  assert.equal(response.status, 422, "hosted empty search rejected");
  response = await adapter(request("/source", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: "What scripture did Oppenheimer quote?" }) }));
  const source = await response.json();
  assert.equal(response.status, 200, "hosted source POST status");
  assert.equal(source.citation, "Bhagavad Gita 11.32", "hosted source match");

  response = await adapter(request("/source", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }));
  assert.equal(response.status, 400, "hosted invalid JSON");
  response = await adapter(request("/source", { method: "POST", headers: { "content-type": "text/plain" }, body: "question" }));
  assert.equal(response.status, 415, "hosted media type");
  response = await adapter(request("/source", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: "x".repeat(17 * 1024) }) }));
  assert.equal(response.status, 413, "hosted payload limit");
  response = await adapter(new Request("https://api.preview.vedapath.test/health", { headers: { origin: "null" } }));
  assert.equal(response.status, 403, "hosted null origin denied");
  response = await adapter(new Request("https://api.preview.vedapath.test/health", { headers: { origin: "https://example.com" } }));
  assert.equal(response.status, 403, "hosted unknown origin denied");
  response = await adapter(request("/sources", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }));
  assert.equal(response.status, 405, "hosted method rule");
  response = await adapter(request("/unknown"));
  assert.equal(response.status, 404, "hosted unknown route");
  response = await adapter(request("/source", { method: "OPTIONS" }));
  assert.equal(response.status, 204, "hosted preflight");
  assert.equal(response.headers.get("access-control-allow-methods"), "GET,POST,OPTIONS", "hosted preflight methods");
  assert.equal(hostedSourceAdapterDecision.write_routes.length, 0, "hosted decision zero writes");
  assert.equal(hostedSourceAdapterDecision.deployment, "not-activated", "hosted decision not activated");
}

async function guardChecks() {
  let clock = Date.parse("2026-07-10T00:00:00.000Z");
  const guard = createPrivacySafeRequestGuard({ limit: 2, windowMs: 60_000, now: function () { return clock; }, salt: "test-salt" });
  const adapter = createHostedSourceAdapter({ guard });
  function request() {
    return new Request("https://api.preview.vedapath.test/health", { headers: { origin: "https://dhirajnyse.github.io", "x-vedapath-client-token": "private-person-token" } });
  }
  assert.equal((await adapter(request())).status, 200, "guard first request");
  assert.equal((await adapter(request())).status, 200, "guard second request");
  const limited = await adapter(request());
  assert.equal(limited.status, 429, "guard limit status");
  assert.equal(limited.headers.get("retry-after"), "60", "guard retry after");
  const snapshot = guard.snapshot();
  assert.equal(snapshot.totals.served, 2, "guard served count");
  assert.equal(snapshot.totals.limited, 1, "guard limited count");
  const serialized = JSON.stringify(snapshot);
  for (const forbidden of ["private-person-token", "question", "raw_ip", "user_agent", "referrer"]) assert(!serialized.includes(forbidden), "guard excludes " + forbidden);
  for (const event of snapshot.events) assert.deepEqual(Object.keys(event).sort(), ["client_bucket", "method", "outcome", "path", "status_group", "time_bucket"], "guard safe event fields");
  clock += 60_000;
  assert.equal((await adapter(request())).status, 200, "guard next window");
  const rejectGuard = createPrivacySafeRequestGuard({ limit: 5, windowMs: 60_000, now: function () { return clock; }, salt: "reject-test" });
  const rejectAdapter = createHostedSourceAdapter({ guard: rejectGuard });
  const malformed = await rejectAdapter(new Request("https://api.preview.vedapath.test/source", {
    method: "POST",
    headers: { origin: "https://dhirajnyse.github.io", "content-type": "application/json", "x-vedapath-client-token": "never-store-this" },
    body: "{"
  }));
  assert.equal(malformed.status, 400, "guarded malformed request status");
  assert.equal(rejectGuard.snapshot().totals.rejected, 1, "guard records validated rejection");
  assert(!JSON.stringify(rejectGuard.snapshot()).includes("never-store-this"), "guarded rejection excludes raw token");
  assert.equal(privacyMonitorBoundary.stores_raw_question, false, "monitor excludes question");
  assert.equal(privacyMonitorBoundary.stores_raw_ip, false, "monitor excludes IP");
}

function roleChecks() {
  assert.equal(reviewerRoles().length, 4, "four reviewer roles");
  const observer = evaluateReviewerCapability({ role: "observer", operation: "view-source" });
  assert.equal(observer.preview_allowed, true, "observer view allowed");
  assert.equal(observer.production_allowed, false, "observer production denied");
  const rights = evaluateReviewerCapability({ role: "rights-reviewer", operation: "mark-rights-evidence-ready" });
  assert.equal(rights.preview_allowed, true, "rights preview allowed");
  assert.equal(rights.identity_verified, false, "rights identity unverified");
  const denied = evaluateReviewerCapability({ role: "rights-reviewer", operation: "mark-source-evidence-ready" });
  assert.equal(denied.preview_allowed, false, "cross-role operation denied");
  for (const operation of reviewerIdentityBoundary.forbidden_operations) {
    assert.equal(evaluateReviewerCapability({ role: "release-reviewer", operation }).preview_allowed, false, "global lock " + operation);
  }
  assert.equal(reviewerIdentityBoundary.authentication, "absent", "authentication absent");
  const rolePage = text("revieweridentityroles.html");
  assert(rolePage.includes("vpRoleForm") && rolePage.includes("vedapath-reviewer-role-simulator.js"), "role simulator wired");
}

function queueChecks() {
  const original = { id: "candidate-test", citation: "Isha Upanishad 1", family: "Upanishad | Shruti", status: "new", rights_state: "citation-only", source_state: "draft", review_lane: "Source reviewer" };
  const normalized = normalizeRightsQueueRecord(original);
  assert.equal(normalized.publication_state, "blocked", "queue publication invariant");
  const claimed = applyRightsQueueAction(original, "claim-source", { role: "source-reviewer" });
  assert.equal(claimed.ok, true, "source reviewer can claim source");
  assert.equal(claimed.record.status, "source-review", "source queue transition");
  assert.equal(claimed.record.publication_state, "blocked", "queue remains blocked");
  assert.equal(original.status, "new", "queue input immutable");
  const denied = applyRightsQueueAction(original, "claim-rights", { role: "source-reviewer" });
  assert.equal(denied.ok, false, "source reviewer cannot claim rights");
  const ready = applyRightsQueueAction({ ...original, status: "rights-review" }, "rights-evidence-ready", { role: "rights-reviewer" });
  assert.equal(ready.record.status, "evidence-ready", "rights evidence transition");
  assert.equal(ready.record.publication_state, "blocked", "evidence ready not published");
  assert.equal(rightsQueueBoundary.approval, "unavailable", "queue approval unavailable");
  assert.equal(rightsQueueBoundary.persistence, "session-memory-only", "queue session memory");
  const queuePage = text("rightsoperationsqueue.html");
  assert(queuePage.includes("vpRightsQueueList") && queuePage.includes("vedapath-rights-operations-queue.js"), "rights queue wired");
}

function finalChecks() {
  const gate = json("data/vedapath-controlled-external-pilot-gate.json");
  assert.equal(gate.schema, "vedapath.controlled-external-pilot-gate.v1", "pilot gate schema");
  assert.equal(gate.decision, "implementation-ready-not-activated", "pilot gate decision");
  assert.equal(gate.activated, false, "pilot inactive");
  assert.equal(gate.external_participants, 0, "no external participants");
  assert.equal(gate.deployment, "none", "no deployment");
  assert.equal(gate.write_routes.length, 0, "no write routes");
  assert.equal(gate.public_launch, "blocked", "public launch blocked");

  const shell = text("assets/vedapath-command-shell.js");
  assert.equal((shell.match(/title: "Private Demo"/g) || []).length, 1, "single Private Demo navigation group");
  assert.equal((shell.match(/title: "Hosted Pilot"/g) || []).length, 1, "single Hosted Pilot navigation group");
  assert(/const releaseBadge = "(?:v4\.9\.1 controlled pilot|v4\.9\.6 pilot implementation gate|v4\.9\.7 infrastructure authorization|v4\.9\.8 deployment contract|v4\.9\.9 identity contract|v5\.(?:0\.[0-9]|1\.[0-6]) [^"]+)";/.test(shell), "compatible release badge");
  for (const label of ["Hosted API", "Request Guard", "Reviewer Roles", "Rights Queue", "Pilot Gate"]) assert(shell.includes('"' + label + '"'), "shell link " + label);
  assert(/<strong>(?:v4\.9\.[16789]|v5\.(?:0\.[0-9]|1\.[0-6]))<\/strong>/.test(text("build-status.html")), "build status compatible version");
  assert(
    /implementation-ready|provider deployment,? (?:and )?invitations remain blocked|provider deployment, invitations, and public launch remain blocked|founder implementation review|private-pilot validation complete; real invitation issuance, participant access, provider operations, and public launch remain blocked|private-pilot operations evidence complete; real credentials, identity, provider connection, invitation, participant, live session, telemetry export, and public launch remain blocked/i.test(text("build-status.html")),
    "build status honest gate"
  );
  assert(!/AnswerSeal/i.test(shell + text("build-status.html")), "shared project isolation");
}

if (has("v4.8.7")) await adapterChecks();
if (has("v4.8.8")) await guardChecks();
if (has("v4.8.9")) roleChecks();
if (has("v4.9.0")) queueChecks();
if (has("v4.9.1")) finalChecks();

console.log("v487-v491-hosted-pilot-foundation-ok " + through);
