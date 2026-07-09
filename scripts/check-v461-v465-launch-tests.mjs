import { existsSync, readFileSync } from "node:fs";

const files = [
  {
    "version": "v4.6.1",
    "page": "sourceapitestharness.html",
    "data": "data/vedapath-source-api-test-harness.json",
    "doc": "docs/SOURCE_API_TEST_HARNESS.md",
    "kind": "qa"
  },
  {
    "version": "v4.6.2",
    "page": "nosourceevaluationsuite.html",
    "data": "data/vedapath-no-source-evaluation-suite.json",
    "doc": "docs/NO_SOURCE_EVALUATION_SUITE.md",
    "kind": "qa"
  },
  {
    "version": "v4.6.3",
    "page": "sourcecandidatefixturerunner.html",
    "data": "data/vedapath-source-candidate-fixture-runner.json",
    "doc": "docs/SOURCE_CANDIDATE_FIXTURE_RUNNER.md",
    "kind": "desk"
  },
  {
    "version": "v4.6.4",
    "page": "adaptercontracttests.html",
    "data": "data/vedapath-adapter-contract-tests.json",
    "doc": "docs/ADAPTER_CONTRACT_TESTS.md",
    "kind": "desk"
  },
  {
    "version": "v4.6.5",
    "page": "privatedemoscript.html",
    "data": "data/vedapath-private-demo-script.json",
    "doc": "docs/PRIVATE_DEMO_SCRIPT.md",
    "kind": "gate"
  }
];

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
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

const sourceHarness = readJson("data/vedapath-source-api-test-harness.json");
if (!sourceHarness.records.some((record) => record.status === "no-source")) fail("source harness lacks no-source fixture");
if (!sourceHarness.records.some((record) => record.id === "trace-required")) fail("source harness lacks trace fixture");

const noSource = readJson("data/vedapath-no-source-evaluation-suite.json");
if (noSource.records.filter((record) => record.status === "no-source").length < 3) fail("no-source suite needs at least three refusal cases");

const runner = readJson("data/vedapath-source-candidate-fixture-runner.json");
if (!runner.candidates.every((candidate) => candidate.reason && candidate.packet)) fail("fixture runner candidates need reasons and packets");

const adapter = readJson("data/vedapath-adapter-contract-tests.json");
if (!adapter.candidates.some((candidate) => /refuse/i.test(candidate.decision))) fail("adapter tests need refusal case");
if (!adapter.candidates.some((candidate) => /hold/i.test(candidate.title))) fail("adapter tests need hold case");

const demo = readJson("data/vedapath-private-demo-script.json");
if (!demo.decisions.some((decision) => decision.label === "Public claims" && decision.value === "Blocked")) fail("demo script must block public claims");
if (!demo.packet.includes("Blocked: public launch")) fail("demo script packet must keep launch closed");

console.log("launch-tests-ok v4.6.1-v4.6.5");
