import { fixtureQueries, querySource } from "./vedapath-source-api-stub.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export { fixtureQueries };

const expectations = [
  { question: fixtureQueries[0], expectSource: true, expectCitation: "Bhagavad Gita 11.32", expectState: "approved" },
  { question: fixtureQueries[1], expectSource: true, expectCitation: "Bhagavad Gita 2.48", expectState: "approved" },
  { question: fixtureQueries[2], expectSource: true, expectCitation: "Rigveda 3.62.10", expectState: "hold" },
  { question: fixtureQueries[3], expectSource: false, expectCitation: "No direct source", expectState: "no-source" },
  { question: fixtureQueries[4], expectSource: false, expectCitation: "No direct source", expectState: "no-source" },
  { question: fixtureQueries[5], expectSource: true, expectCitation: "Isha Upanishad 1", expectState: "review" }
];

function evaluate(expectation) {
  const result = querySource(expectation.question);
  const passed = result.source_found === expectation.expectSource &&
    result.citation === expectation.expectCitation &&
    result.reviewer_state === expectation.expectState;
  return {
    question: expectation.question,
    passed,
    expected: expectation,
    result
  };
}

export function runFixtureSuite() {
  const results = expectations.map(evaluate);
  const passed = results.filter((item) => item.passed).length;
  return {
    suite: "vedapath-retrieval-fixture-cli",
    total: results.length,
    passed,
    failed: results.length - passed,
    results
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = runFixtureSuite();
  console.log(JSON.stringify(report, null, 2));
  if (report.failed) process.exit(1);
}
