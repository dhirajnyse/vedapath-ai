import { existsSync, readFileSync } from "node:fs";
import { createLocalSourceApiServer } from "./vedapath-local-source-api-server.mjs";
import { runPrivateDemo } from "./run-v482-private-demo.mjs";
import { handleReadonlySourceRequest, readonlySourceDecision } from "./vedapath-readonly-source-handler.mjs";
import { validateSourceIntake } from "./vedapath-source-intake-validator.mjs";

const versions = ["v4.8.2", "v4.8.3", "v4.8.4", "v4.8.5", "v4.8.6"];
const releaseFiles = {
  "v4.8.2": ["privatedemorunbook.html", "data/vedapath-private-demo-runbook-v482.json", "docs/PRIVATE_DEMO_RUNBOOK_V482.md"],
  "v4.8.3": ["reviewerobservations.html", "data/vedapath-reviewer-observation-capture.json", "docs/REVIEWER_OBSERVATION_CAPTURE.md"],
  "v4.8.4": ["rightsclearedsourceintake.html", "data/vedapath-rights-cleared-source-intake.json", "docs/RIGHTS_CLEARED_SOURCE_INTAKE.md"],
  "v4.8.5": ["securityprivacyreview.html", "data/vedapath-security-privacy-review.json", "docs/SECURITY_PRIVACY_REVIEW.md"],
  "v4.8.6": ["hostedbackenddecisiongate.html", "data/vedapath-hosted-backend-decision-gate.json", "docs/HOSTED_BACKEND_DECISION_GATE.md"]
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function text(name) {
  return readFileSync(name, "utf8");
}

function json(name) {
  return JSON.parse(text(name));
}

function throughVersion() {
  const index = process.argv.indexOf("--through");
  const version = index >= 0 ? process.argv[index + 1] : versions[versions.length - 1];
  assert(versions.includes(version), "Unknown --through version " + version);
  return version;
}

function selectedVersions(version) {
  return versions.slice(0, versions.indexOf(version) + 1);
}

function validateRelease(version) {
  const [pageFile, dataFile, docFile] = releaseFiles[version];
  for (const name of [pageFile, dataFile, docFile]) assert(existsSync(name), name + " missing");
  const page = text(pageFile);
  assert(page.includes(dataFile), pageFile + " missing data binding");
  assert(page.includes("assets/vedapath-command-shell.js"), pageFile + " missing command shell");
  assert(page.includes('href="index.html#top"'), pageFile + " missing logo home link");
  const data = json(dataFile);
  for (const key of ["position", "headline", "copy", "postures", "flow", "decisions", "metrics", "locks", "packet"]) {
    assert(Object.prototype.hasOwnProperty.call(data, key), dataFile + " missing " + key);
  }
  assert(data.flow.length >= 4, dataFile + " needs four flow steps");
  assert(data.locks.length >= 5, dataFile + " needs five locks");
}

async function v482Checks() {
  const runbook = json("data/vedapath-private-demo-runbook-v482.json");
  assert(runbook.schema === "vedapath.private-demo-runbook.v1", "runbook schema");
  assert(runbook.scenarios.length === 5, "runbook scenario count");
  assert(runbook.stop_conditions.length >= 6, "runbook stop conditions");
  const result = await runPrivateDemo();
  assert(result.passed === 5 && result.total === 5, "private demo runner must pass 5/5");
  assert(result.storage === "none", "private demo storage lock");
}

function v483Checks() {
  const page = text("reviewerobservations.html");
  const script = text("assets/vedapath-reviewer-observations.js");
  const data = json("data/vedapath-reviewer-observation-capture.json");
  for (const id of ["vpObservationForm", "vpObservationScenario", "vpObservationNotes", "vpCopyObservations", "vpClearObservations", "vpObservationStatus"]) {
    assert(page.includes('id="' + id + '"'), "observation page missing " + id);
  }
  assert(page.includes('aria-live="polite"'), "observation status must be announced");
  assert(data.schema === "vedapath.reviewer-observation-config.v1", "observation config schema");
  assert(data.criteria.length === 4, "observation criteria count");
  assert(data.privacy.persistence === "none" && data.privacy.telemetry === "none", "observation privacy lock");
  assert(!/localStorage|sessionStorage|indexedDB/.test(script), "observation script must not persist content");
  assert(!/gtag|google-analytics|mixpanel|segment\.|amplitude/i.test(script), "observation script must not include analytics");
  assert(script.includes("navigator.clipboard.writeText"), "observation copy action");
  assert(text("askdemo.html").includes("reviewerobservations.html"), "Ask demo reviewer handoff");
}

function v484Checks() {
  const page = text("rightsclearedsourceintake.html");
  const script = text("assets/vedapath-source-intake.js");
  const data = json("data/vedapath-rights-cleared-source-intake.json");
  assert(data.schema === "vedapath.source-intake-config.v1", "intake config schema");
  assert(data.rights_lanes.length === 5, "rights lane count");
  assert(data.invariants.includes("publication_state is blocked"), "publication invariant");
  const valid = validateSourceIntake(data.sample);
  assert(valid.ok, "sample intake should validate");
  assert(valid.candidate.publication_state === "blocked", "validated candidate publication lock");
  assert(valid.candidate.reviewer_state === "draft", "validated candidate review lock");
  assert(valid.candidate.translation_text_included === false, "translation text lock");
  const missingEvidence = validateSourceIntake({ ...data.sample, rights_evidence: "" });
  assert(!missingEvidence.ok, "rights evidence must be required");
  const translationAttempt = validateSourceIntake({ ...data.sample, translation_text: "copied text" });
  assert(!translationAttempt.ok, "translation text must be rejected");
  assert(page.includes('id="vpSourceIntakeForm"') && page.includes('id="vpIntakePacket"'), "intake form structure");
  assert(!/localStorage|sessionStorage|indexedDB/.test(script), "intake script must not persist content");
  assert(script.includes('publication_state: "blocked"'), "browser intake publication lock");
}

async function withLocalApi(callback) {
  const server = createLocalSourceApiServer();
  const address = await new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", function () { resolve(server.address()); });
  });
  try {
    return await callback("http://127.0.0.1:" + address.port);
  } finally {
    await new Promise(function (resolve) { server.close(resolve); });
  }
}

async function v485Checks() {
  const security = json("data/vedapath-security-privacy-review.json");
  assert(security.schema === "vedapath.security-review.v1", "security schema");
  assert(security.threats.length === 8, "security threat count");
  assert(security.residual_risks.length >= 8, "security residual risk count");
  await withLocalApi(async function (base) {
    const approved = await fetch(base + "/health", { headers: { origin: "https://dhirajnyse.github.io" } });
    assert(approved.status === 200, "approved origin health");
    const requiredHeaders = ["cache-control", "content-security-policy", "cross-origin-resource-policy", "permissions-policy", "referrer-policy", "x-content-type-options", "x-frame-options"];
    for (const header of requiredHeaders) assert(approved.headers.get(header), "missing security header " + header);
    assert(approved.headers.get("cache-control") === "no-store", "API no-store header");
    assert(approved.headers.get("x-frame-options") === "DENY", "API frame denial");

    const disallowed = await fetch(base + "/health", { headers: { origin: "https://example.invalid" } });
    assert(disallowed.status === 403, "unapproved origin must be blocked");
    assert(!disallowed.headers.get("access-control-allow-origin"), "unapproved origin must not receive CORS header");
    const nullOrigin = await fetch(base + "/health", { headers: { origin: "null" } });
    assert(nullOrigin.status === 403, "null origin must be blocked");
  });

  for (const name of ["assets/vedapath-ask-demo.js", "assets/vedapath-reviewer-observations.js", "assets/vedapath-source-intake.js"]) {
    const source = text(name);
    assert(!/localStorage|sessionStorage|indexedDB/.test(source), name + " persists user input");
    assert(!/gtag|google-analytics|mixpanel|amplitude|segment\./i.test(source), name + " contains analytics");
  }
  const registry = text("data/vedapath-source-registry.json");
  assert(!/translation_text|full_text|verse_text/.test(registry), "registry must not expose translation text fields");
}

async function v486Checks() {
  const gate = json("data/vedapath-hosted-backend-decision-gate.json");
  assert(gate.schema === "vedapath.hosted-backend-decision.v1", "hosted gate schema");
  assert(gate.decision === "deployment-neutral-read-only-handler", "hosted decision");
  assert(gate.writes.length === 0 && gate.launch === "blocked", "hosted write and launch locks");
  assert(readonlySourceDecision.deployment === "not-authorized", "handler deployment lock");
  assert(readonlySourceDecision.write_routes.length === 0, "handler write routes");

  const health = await handleReadonlySourceRequest({ method: "GET", pathname: "/health", requestId: "parity-health" });
  assert(health.status === 200 && health.body.storage === "none", "handler health");
  const hosted = await handleReadonlySourceRequest({ method: "GET", pathname: "/source", query: { q: "What scripture did Oppenheimer quote?" }, requestId: "parity-source" });
  assert(hosted.status === 200, "handler source status");
  assert(hosted.body.citation === "Bhagavad Gita 11.32", "handler source citation");
  const refusal = await handleReadonlySourceRequest({ method: "POST", pathname: "/source", body: { question: "Did the Vedas predict bitcoin?" }, requestId: "parity-refusal" });
  assert(refusal.body.source_found === false, "handler no-source parity");

  await withLocalApi(async function (base) {
    const local = await fetch(base + "/source?q=" + encodeURIComponent("What scripture did Oppenheimer quote?")).then(function (response) { return response.json(); });
    for (const key of ["citation", "family", "reviewer_state", "rights_state", "answer_boundary", "source_found"]) {
      assert(local[key] === hosted.body[key], "handler parity " + key);
    }
  });

  const shell = text("assets/vedapath-command-shell.js");
  for (const label of ["Demo Runbook", "Observations", "Rights Intake", "Security Review", "Hosted Gate"]) {
    assert(shell.includes(label), "command shell missing " + label);
  }
  assert(/const releaseBadge = "(?:v4\.8\.6 hosted gate|v4\.9\.1 controlled pilot|v4\.9\.6 pilot implementation gate|v4\.9\.7 infrastructure authorization|v4\.9\.8 deployment contract|v4\.9\.9 identity contract|v5\.0\.[0-6] [^"]+)";/.test(shell), "compatible release badge");
  const links = text("scripts/check-static-links.mjs");
  for (const files of Object.values(releaseFiles)) assert(links.includes(files[0]), "static links missing " + files[0]);
  assert(/<strong>(?:v4\.8\.6|v4\.9\.[16789]|v5\.0\.[0-6])<\/strong>/.test(text("build-status.html")), "build status current version");
  assert(text("CHANGELOG.md").includes("## v4.8.6 Hosted Backend Decision Gate"), "changelog final version");
  assert(text("README.md").includes("## v4.8.6 Hosted Backend Decision Gate"), "README final version");

  const activeFiles = [
    ...Object.values(releaseFiles).flat(),
    "assets/vedapath-demo-operations.css", "assets/vedapath-reviewer-observations.js", "assets/vedapath-source-intake.js",
    "scripts/run-v482-private-demo.mjs", "scripts/vedapath-source-intake-validator.mjs", "scripts/vedapath-readonly-source-handler.mjs"
  ];
  for (const name of activeFiles) assert(!/answerseal/i.test(text(name)), name + " contains cross-project text");
}

const through = throughVersion();
const selected = selectedVersions(through);
for (const version of selected) validateRelease(version);
if (selected.includes("v4.8.2")) await v482Checks();
if (selected.includes("v4.8.3")) v483Checks();
if (selected.includes("v4.8.4")) v484Checks();
if (selected.includes("v4.8.5")) await v485Checks();
if (selected.includes("v4.8.6")) await v486Checks();

console.log("private-demo-hardening-ok through " + through);
