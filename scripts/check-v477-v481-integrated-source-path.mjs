import { existsSync, readFileSync } from "node:fs";
import { createLocalSourceApiServer } from "./vedapath-local-source-api-server.mjs";
import {
  querySource,
  registrySummary,
  searchSources,
  sourceRecords
} from "./vedapath-source-registry.mjs";

const versions = ["v4.7.7", "v4.7.8", "v4.7.9", "v4.8.0", "v4.8.1"];
const releaseFiles = {
  "v4.7.7": {
    page: "backendspikereviewgate.html",
    data: "data/vedapath-backend-spike-review-gate.json",
    doc: "docs/BACKEND_SPIKE_REVIEW_GATE.md"
  },
  "v4.7.8": {
    page: "sourceapireliabilitycontract.html",
    data: "data/vedapath-source-api-reliability-contract.json",
    doc: "docs/SOURCE_API_RELIABILITY_CONTRACT.md"
  },
  "v4.7.9": {
    page: "curatedsourceregistry.html",
    data: "data/vedapath-curated-source-registry.json",
    doc: "docs/CURATED_SOURCE_REGISTRY.md"
  },
  "v4.8.0": {
    page: "askdemo.html",
    data: "data/vedapath-integrated-ask-demo.json",
    doc: "docs/INTEGRATED_ASK_DEMO.md"
  },
  "v4.8.1": {
    page: "sourcepathreadinessconsole.html",
    data: "data/vedapath-source-path-readiness-console.json",
    doc: "docs/SOURCE_PATH_READINESS_CONSOLE.md"
  }
};

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function text(file) {
  return readFileSync(file, "utf8");
}

function json(file) {
  return JSON.parse(text(file));
}

function requestedThrough() {
  const index = process.argv.indexOf("--through");
  const value = index >= 0 ? process.argv[index + 1] : versions[versions.length - 1];
  assert(versions.includes(value), "Unknown --through version " + value);
  return value;
}

function versionsThrough(version) {
  return versions.slice(0, versions.indexOf(version) + 1);
}

function validateRelease(version) {
  const files = releaseFiles[version];
  for (const file of Object.values(files)) {
    assert(existsSync(file), file + " missing");
  }
  const page = text(files.page);
  assert(page.includes(files.data), files.page + " missing data binding");
  assert(page.includes("assets/vedapath-command-shell.js"), files.page + " missing command shell");
  assert(page.includes('href="index.html#top"'), files.page + " missing logo home link");
  const data = json(files.data);
  for (const key of ["position", "headline", "copy", "postures", "flow", "decisions", "metrics", "locks", "packet"]) {
    assert(Object.prototype.hasOwnProperty.call(data, key), files.data + " missing " + key);
  }
  assert(data.flow.length >= 4, files.data + " needs four flow steps");
  assert(data.locks.length >= 5, files.data + " needs five launch locks");
}

async function apiChecks() {
  const server = createLocalSourceApiServer();
  const address = await new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", function () {
      resolve(server.address());
    });
  });
  const base = "http://127.0.0.1:" + address.port;

  async function response(pathname, options) {
    const result = await fetch(base + pathname, options);
    const body = result.status === 204 ? null : await result.json();
    return { result, body };
  }

  try {
    const health = await response("/health");
    assert(health.result.status === 200, "health status");
    assert(health.body.ok === true, "health ok");
    assert(health.body.contract === "vedapath.source.v1", "health contract");
    assert(health.body.storage === "none", "health storage lock");
    assert(health.body.launch === "blocked", "health launch lock");
    assert(health.result.headers.get("x-vedapath-request-id"), "health request id header");

    const getSource = await response("/source?q=What%20scripture%20did%20Oppenheimer%20quote%3F");
    assert(getSource.body.citation === "Bhagavad Gita 11.32", "source citation");
    assert(getSource.body.source_found === true, "source found");
    assert(getSource.body.request_id, "source request id");

    const invalidJson = await response("/source", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{broken"
    });
    assert(invalidJson.result.status === 400, "invalid JSON status");
    assert(invalidJson.body.error.code === "invalid_json", "invalid JSON code");

    const empty = await response("/source");
    assert(empty.result.status === 422, "empty question status");
    assert(empty.body.error.code === "question_required", "empty question code");

    const method = await response("/source", { method: "PUT" });
    assert(method.result.status === 405, "method status");
    assert(method.body.error.code === "method_not_allowed", "method code");
    assert((method.result.headers.get("allow") || "").includes("POST"), "method allow header");

    const missing = await response("/missing");
    assert(missing.result.status === 404, "missing route status");
    assert(missing.body.error.code === "not_found", "missing route code");

    const large = await response("/source", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "x".repeat(17000) })
    });
    assert(large.result.status === 413, "payload limit status");
    assert(large.body.error.code === "payload_too_large", "payload limit code");

    return { base, response };
  } finally {
    await new Promise(function (resolve) {
      server.close(resolve);
    });
  }
}

async function registryApiChecks() {
  const server = createLocalSourceApiServer();
  const address = await new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", function () {
      resolve(server.address());
    });
  });
  const base = "http://127.0.0.1:" + address.port;
  try {
    const sourcesResponse = await fetch(base + "/sources");
    const sources = await sourcesResponse.json();
    assert(sourcesResponse.status === 200, "sources status");
    assert(sources.count === 8, "sources default count");
    assert(sources.records.every(function (record) { return record.status !== "no-source"; }), "sources guard leak");

    const approved = await fetch(base + "/sources?status=approved").then(function (value) {
      return value.json();
    });
    assert(approved.count === 2, "approved source count");

    const search = await fetch(base + "/search?q=Oppenheimer").then(function (value) {
      return value.json();
    });
    assert(search.count >= 1, "search count");
    assert(search.candidates[0].citation === "Bhagavad Gita 11.32", "search ranking");
  } finally {
    await new Promise(function (resolve) {
      server.close(resolve);
    });
  }
}

function registryChecks() {
  const registryFile = json("data/vedapath-source-registry.json");
  assert(registryFile.schema === "vedapath.source-registry.v1", "registry schema");
  assert(sourceRecords.length === 9, "registry record count");
  const summary = registrySummary();
  assert(summary.source_records === 8, "registry source count");
  assert(summary.no_source_guards === 1, "registry guard count");
  const candidates = searchSources("Oppenheimer quote", { limit: 3 });
  assert(candidates[0].citation === "Bhagavad Gita 11.32", "registry Oppenheimer match");
  assert(querySource("Did the Vedas predict bitcoin?").source_found === false, "registry overclaim refusal");
  assert(querySource("Teach me Gayatri mantra practice").reviewer_state === "hold", "registry reviewer hold");
}

function askDemoChecks() {
  const page = text("askdemo.html");
  const script = text("assets/vedapath-ask-demo.js");
  const style = text("assets/vedapath-ask-demo.css");
  assert(page.includes('data-source-mode="preview"'), "Ask demo preview mode");
  assert(page.includes('data-source-mode="api"'), "Ask demo API mode");
  assert(page.includes('aria-live="polite"'), "Ask demo live region");
  assert(page.includes('maxlength="500"'), "Ask demo input limit");
  assert(page.includes("assets/vedapath-local-api-adapter.js"), "Ask demo adapter");
  assert(script.includes("data/vedapath-source-registry.json"), "Ask demo registry");
  assert(script.includes("Reviewed fallback"), "Ask demo visible fallback");
  assert(!script.includes("localStorage"), "Ask demo must not store questions");
  assert(style.includes("@media (max-width: 640px)"), "Ask demo mobile layout");
  assert(text("index.html").includes('href="askdemo.html">Begin with Ask</a>'), "Home Ask entry");
}

function finalChecks() {
  const shell = text("assets/vedapath-command-shell.js");
  for (const label of ["Spike Review", "API Reliability", "Source Registry", "Ask Demo", "Path Readiness"]) {
    assert(shell.includes(label), "command shell missing " + label);
  }
  assert(/const releaseBadge = "(?:v4\.8\.6 hosted gate|v4\.9\.1 controlled pilot|v4\.9\.6 pilot implementation gate)";/.test(shell), "command shell compatible badge");
  const staticLinks = text("scripts/check-static-links.mjs");
  for (const files of Object.values(releaseFiles)) {
    assert(staticLinks.includes(files.page), "static links missing " + files.page);
  }
  assert(/<strong>v4\.(?:8\.6|9\.(?:1|6))<\/strong>/.test(text("build-status.html")), "build status compatible current version");
  assert(text("README.md").includes("## v4.8.1 Source Path Readiness Console"), "README final release");
  assert(text("CHANGELOG.md").includes("## v4.8.1 Source Path Readiness Console"), "changelog final release");
}

const through = requestedThrough();
for (const version of versionsThrough(through)) validateRelease(version);

if (versionsThrough(through).includes("v4.7.7")) {
  const gate = json(releaseFiles["v4.7.7"].data);
  assert(gate.decisions.some(function (item) { return item.value === "Continue"; }), "review decision missing");
}
if (versionsThrough(through).includes("v4.7.8")) await apiChecks();
if (versionsThrough(through).includes("v4.7.9")) {
  registryChecks();
  await registryApiChecks();
}
if (versionsThrough(through).includes("v4.8.0")) askDemoChecks();
if (versionsThrough(through).includes("v4.8.1")) finalChecks();

console.log("source-path-ok through " + through);
