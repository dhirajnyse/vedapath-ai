import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createLocalSourceApiServer } from "./vedapath-local-source-api-server.mjs";
import { querySource } from "./vedapath-source-registry.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadRunbook() {
  return JSON.parse(readFileSync(path.join(root, "data/vedapath-private-demo-runbook-v482.json"), "utf8"));
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ": expected " + JSON.stringify(expected) + ", received " + JSON.stringify(actual));
  }
}

async function startApi() {
  const server = createLocalSourceApiServer();
  const address = await new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", function () {
      resolve(server.address());
    });
  });
  return { server, base: "http://127.0.0.1:" + address.port };
}

function checkExpected(packet, expected, prefix) {
  for (const [key, value] of Object.entries(expected)) {
    if (["fallback_label", "storage"].includes(key)) continue;
    assertEqual(packet[key], value, prefix + " " + key);
  }
}

export async function runPrivateDemo() {
  const runbook = loadRunbook();
  const started = await startApi();
  const results = [];

  try {
    for (const scenario of runbook.scenarios) {
      if (scenario.id === "offline-fallback") {
        const askScript = readFileSync(path.join(root, "assets/vedapath-ask-demo.js"), "utf8");
        const pass = askScript.includes(scenario.expected.fallback_label) && !askScript.includes("localStorage") && !askScript.includes("sessionStorage");
        results.push({ id: scenario.id, pass, evidence: "visible reviewed fallback; no question persistence" });
        continue;
      }

      const previewPacket = querySource(scenario.question);
      checkExpected(previewPacket, scenario.expected, scenario.id + " preview");

      const response = await fetch(started.base + "/source?q=" + encodeURIComponent(scenario.question));
      const apiPacket = await response.json();
      assertEqual(response.status, 200, scenario.id + " API status");
      checkExpected(apiPacket, scenario.expected, scenario.id + " API");
      results.push({
        id: scenario.id,
        pass: true,
        evidence: apiPacket.citation + "; " + apiPacket.reviewer_state + "; " + apiPacket.rights_state
      });
    }
  } finally {
    await new Promise(function (resolve) {
      started.server.close(resolve);
    });
  }

  const passed = results.filter(function (result) { return result.pass; }).length;
  return {
    schema: "vedapath.private-demo-result.v1",
    release: "v4.8.2",
    passed,
    total: results.length,
    storage: "none",
    launch: "blocked",
    results
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await runPrivateDemo();
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const result of report.results) {
      console.log((result.pass ? "PASS" : "FAIL") + " " + result.id + " - " + result.evidence);
    }
    console.log("private-demo-runbook-ok " + report.passed + "/" + report.total);
  }
  if (report.passed !== report.total) process.exitCode = 1;
}
