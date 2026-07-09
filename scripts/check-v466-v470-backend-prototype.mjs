import { existsSync, readFileSync } from "node:fs";
import { querySource } from "./vedapath-source-api-stub.mjs";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";

const files = [
  {
    "version": "v4.6.6",
    "page": "backendprototypedecisiongate.html",
    "data": "data/vedapath-backend-prototype-decision-gate.json",
    "doc": "docs/BACKEND_PROTOTYPE_DECISION_GATE.md",
    "kind": "gate"
  },
  {
    "version": "v4.6.7",
    "page": "sourceapistub.html",
    "data": "data/vedapath-source-api-stub.json",
    "doc": "docs/SOURCE_API_STUB.md",
    "kind": "schema"
  },
  {
    "version": "v4.6.8",
    "page": "retrievalfixturecli.html",
    "data": "data/vedapath-retrieval-fixture-cli.json",
    "doc": "docs/RETRIEVAL_FIXTURE_CLI.md",
    "kind": "desk"
  },
  {
    "version": "v4.6.9",
    "page": "privatedemosessionledger.html",
    "data": "data/vedapath-private-demo-session-ledger.json",
    "doc": "docs/PRIVATE_DEMO_SESSION_LEDGER.md",
    "kind": "qa"
  },
  {
    "version": "v4.7.0",
    "page": "backendreadinesscontrolroom.html",
    "data": "data/vedapath-backend-readiness-control-room.json",
    "doc": "docs/BACKEND_READINESS_CONTROL_ROOM.md",
    "kind": "gate"
  }
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

for (const item of files) {
  if (!existsSync(item.page)) fail("missing page " + item.page);
  if (!existsSync(item.data)) fail("missing data " + item.data);
  if (!existsSync(item.doc)) fail("missing doc " + item.doc);
  const page = readFileSync(item.page, "utf8");
  if (!page.includes(item.data)) fail(item.page + " missing data reference");
  if (!page.includes('data-kind="' + item.kind + '"')) fail(item.page + " missing renderer kind");
  if (!page.includes('href="index.html#top"')) fail(item.page + " missing home logo link");
  readJson(item.data);
}

const commandShell = readFileSync("assets/vedapath-command-shell.js", "utf8");
for (const label of ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"]) {
  if (!commandShell.includes(label)) fail("command shell missing " + label);
}
if (!commandShell.includes("v4.7.0 backend ready")) fail("command shell release badge not updated");

const staticLinks = readFileSync("scripts/check-static-links.mjs", "utf8");
for (const item of files) {
  if (!staticLinks.includes(item.page)) fail("static link checker missing " + item.page);
}

const oppenheimer = querySource("What scripture did Oppenheimer quote?");
if (!oppenheimer.source_found || oppenheimer.citation !== "Bhagavad Gita 11.32") fail("Oppenheimer fixture did not return Gita source");

const bitcoin = querySource("Did the Vedas predict bitcoin?");
if (bitcoin.source_found || !bitcoin.no_source_reason) fail("Bitcoin fixture must return no-source");

const gayatri = querySource("Teach me Gayatri mantra practice");
if (gayatri.reviewer_state !== "hold") fail("Gayatri fixture must stay on reviewer hold");

const suite = runFixtureSuite();
if (suite.failed) fail("fixture CLI has failing cases");
if (suite.total < 6) fail("fixture CLI needs at least six cases");
if (!suite.results.some((item) => item.result.source_found === false)) fail("fixture CLI needs no-source result");

const readiness = readJson("data/vedapath-backend-readiness-control-room.json");
if (!readiness.decisions.some((decision) => decision.label === "Public launch" && decision.value === "Blocked")) fail("readiness room must keep public launch blocked");
if (!readiness.locks.some((lock) => /Live AI/.test(lock.title))) fail("readiness room must keep live AI lock visible");

console.log("backend-prototype-ok v4.6.6-v4.7.0");
