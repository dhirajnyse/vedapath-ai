import { existsSync, readFileSync } from "node:fs";
import { createLocalSourceApiServer } from "./vedapath-local-source-api-server.mjs";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";
import { buildBackendHandoffPacket } from "./vedapath-private-demo-backend-handoff.mjs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const files = [
  {
    "page": "backendspikechoice.html",
    "data": "data/vedapath-backend-spike-choice.json",
    "doc": "docs/BACKEND_SPIKE_CHOICE.md",
    "label": "Backend Choice"
  },
  {
    "page": "localsourceapiserver.html",
    "data": "data/vedapath-local-source-api-server.json",
    "doc": "docs/LOCAL_SOURCE_API_SERVER.md",
    "label": "Local API"
  },
  {
    "page": "sourcepacketcontracttests.html",
    "data": "data/vedapath-source-packet-contract-tests.json",
    "doc": "docs/SOURCE_PACKET_CONTRACT_TESTS.md",
    "label": "Packet Tests"
  },
  {
    "page": "localapiadapterfallback.html",
    "data": "data/vedapath-local-api-adapter-fallback.json",
    "doc": "docs/LOCAL_API_ADAPTER_FALLBACK.md",
    "label": "API Adapter"
  },
  {
    "page": "privatedemobackendhandoff.html",
    "data": "data/vedapath-private-demo-backend-handoff.json",
    "doc": "docs/PRIVATE_DEMO_BACKEND_HANDOFF.md",
    "label": "Backend Handoff"
  }
];

for (const item of files) {
  assert(existsSync(item.page), item.page + " missing");
  assert(existsSync(item.data), item.data + " missing");
  assert(existsSync(item.doc), item.doc + " missing");
  const page = readFileSync(item.page, "utf8");
  assert(page.includes(item.data), item.page + " missing data binding");
  assert(page.includes("assets/vedapath-command-shell.js"), item.page + " missing command shell");
  assert(page.includes('href="index.html#top"'), item.page + " missing home logo link");
  const data = JSON.parse(readFileSync(item.data, "utf8"));
  for (const key of ["position", "headline", "copy", "postures", "flow", "decisions", "metrics", "locks", "packet"]) {
    assert(Object.prototype.hasOwnProperty.call(data, key), item.data + " missing " + key);
  }
}

const commandShell = readFileSync("assets/vedapath-command-shell.js", "utf8");
for (const item of files) {
  assert(commandShell.includes(item.label), "command shell missing " + item.label);
}
assert(/v4\.7\.[5-9] [^"]+/.test(commandShell), "command shell release badge not updated");
assert(commandShell.includes("Backend Spike"), "command shell missing Backend Spike group");

const staticLinks = readFileSync("scripts/check-static-links.mjs", "utf8");
for (const item of files) {
  assert(staticLinks.includes(item.page), "static link checker missing " + item.page);
}

const adapter = readFileSync("assets/vedapath-local-api-adapter.js", "utf8");
assert(adapter.includes("VedaPathLocalApiAdapter"), "browser adapter global missing");
assert(adapter.includes("local-server-unavailable"), "browser adapter fallback reason missing");

const suite = runFixtureSuite();
assert(suite.failed === 0, "fixture suite failed");

const server = createLocalSourceApiServer();
const address = await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => resolve(server.address()));
});

try {
  const baseUrl = "http://127.0.0.1:" + address.port;
  const health = await fetch(baseUrl + "/health").then((response) => response.json());
  assert(health.ok === true, "health not ok");
  assert(health.storage === "none", "health must declare no storage");
  assert(health.launch === "blocked", "health must keep launch blocked");

  const getPacket = await fetch(baseUrl + "/source?q=What%20scripture%20did%20Oppenheimer%20quote%3F").then((response) => response.json());
  assert(getPacket.citation === "Bhagavad Gita 11.32", "GET source did not return Gita citation");
  assert(getPacket.source_found === true, "GET source should find source");
  for (const key of ["trace_id", "query", "primary_source_id", "family", "confidence", "reviewer_state", "rights_state", "answer_boundary", "next_action"]) {
    assert(Object.prototype.hasOwnProperty.call(getPacket, key), "GET packet missing " + key);
  }

  const postPacket = await fetch(baseUrl + "/source", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "Did the Vedas predict bitcoin?" })
  }).then((response) => response.json());
  assert(postPacket.source_found === false, "POST no-source should not find source");
  assert(postPacket.no_source_reason, "POST no-source reason missing");
} finally {
  await new Promise((resolve) => server.close(resolve));
}

const handoff = buildBackendHandoffPacket();
assert(handoff.readiness.includes("private founder demo"), "handoff readiness missing");
assert(handoff.launchLocks.length >= 5, "handoff launch locks missing");

console.log("backend-spike-ok v4.7.1-v4.7.5");
