import { fileURLToPath } from "node:url";
import path from "node:path";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";

export function buildBackendHandoffPacket() {
  const suite = runFixtureSuite();
  return {
    release: "v4.7.5 Private Demo Backend Handoff",
    readiness: suite.failed === 0 ? "ready for private founder demo" : "blocked by fixture failure",
    checks: {
      fixtureTotal: suite.total,
      fixturePassed: suite.passed,
      fixtureFailed: suite.failed,
      localServer: "run node scripts/vedapath-local-source-api-server.mjs --port 8787",
      contract: "run node scripts/check-v471-v475-backend-spike.mjs"
    },
    demoSteps: [
      "Run contract checks from a clean worktree.",
      "Start the local Source API server.",
      "Call /health and /source with one approved source and one no-source claim.",
      "Show the browser fallback adapter boundary.",
      "Ask founder to approve the smallest real backend slice or keep hardening fixtures."
    ],
    launchLocks: [
      "No live AI generation.",
      "No production corpus delivery.",
      "No durable account, reviewer, telemetry, or payment storage.",
      "No therapeutic, ritual, legal, medical, or spiritual authority.",
      "No public launch until rights, privacy, security, support, and reviewer operations are real."
    ]
  };
}

export function formatBackendHandoffPacket(packet = buildBackendHandoffPacket()) {
  return [
    packet.release,
    "Readiness: " + packet.readiness,
    "Fixtures: " + packet.checks.fixturePassed + "/" + packet.checks.fixtureTotal + " passed",
    "Local server: " + packet.checks.localServer,
    "Contract: " + packet.checks.contract,
    "Demo steps:",
    ...packet.demoSteps.map((step, index) => (index + 1) + ". " + step),
    "Launch locks:",
    ...packet.launchLocks.map((lock) => "- " + lock)
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const packet = buildBackendHandoffPacket();
  console.log(formatBackendHandoffPacket(packet));
  if (packet.checks.fixtureFailed) process.exit(1);
}
