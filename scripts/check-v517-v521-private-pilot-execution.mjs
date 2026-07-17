import { evaluateAuditedPilotExecutionDecisionGate, evaluateSingleSessionTokenContract, evaluateEphemeralParticipantAccessEnvelope, evaluateAuditedSessionExecutionSandbox, evaluateFounderPrivatePilotRetrospective, privatePilotExecutionPacket } from './vedapath-private-pilot-execution-contracts.mjs';
import { existsSync, readFileSync } from "node:fs";

const through = process.argv.find((arg) => arg.startsWith("--through="))?.split("=")[1] || "v5.2.1";
const order = ["v5.1.7", "v5.1.8", "v5.1.9", "v5.2.0", "v5.2.1"];
const end = order.indexOf(through);
if (end === -1) throw new Error(`Unknown --through: ${through}`);

const fixtures = {
  "v5.1.7": () => evaluateAuditedPilotExecutionDecisionGate({
    evidence: ["private-pilot-evidence-approved-execution-disabled", "three-named-owners-present", "one-participant-one-session-limit", "rollback-owner-present", "execution-design-only"],
    founderOwner: "owner:founder",
    privacyOwner: "owner:privacy",
    securityOwner: "owner:security",
    decision: "approve-design-only-execution-path",
    executionEnabled: false
  }),
  "v5.1.8": () => evaluateSingleSessionTokenContract({
    subject: "pilot-subject-001",
    ttlMinutes: 30,
    scopes: ["source:read", "answer:preview", "feedback:local"],
    idempotencyKey: "idem-v518",
    nonce: "nonce-v518",
    issuer: "fixture-only"
  }),
  "v5.1.9": () => {
    const token = fixtures["v5.1.8"]();
    return evaluateEphemeralParticipantAccessEnvelope({
      tokenRequestDigest: token.tokenRequestDigest,
      role: "pilot-learner-readonly",
      consentReceipt: "consent-fixture-v1",
      sessionWindowMinutes: 30,
      durableAccount: false,
      revocationPath: "pre-session-owner-shutdown"
    });
  },
  "v5.2.0": () => evaluateAuditedSessionExecutionSandbox({
    events: [
      { type: "opened", at: 1 },
      { type: "source-card-shown", at: 2 },
      { type: "boundary-acknowledged", at: 3 },
      { type: "local-event-recorded", at: 4 },
      { type: "closed", at: 5 }
    ],
    rollbackOwner: "owner:pilot-shutdown",
    rawContentStored: false,
    networkUsed: false
  }),
  "v5.2.1": () => evaluateFounderPrivatePilotRetrospective({
    artifacts: ["execution-gate-approved", "token-contract-valid", "access-envelope-valid", "sandbox-trace-valid"],
    founderDecision: "go-to-private-pilot-planning",
    founderOwner: "owner:founder",
    publicLaunch: false
  })
};

const files = {
  "v5.1.7": ["auditedpilotexecutiondecisiongate.html", "data/vedapath-audited-pilot-execution-decision-gate.json", "docs/AUDITED_PILOT_EXECUTION_DECISION_GATE.md"],
  "v5.1.8": ["singlesessiontokencontract.html", "data/vedapath-single-session-token-contract.json", "docs/SINGLE_SESSION_TOKEN_CONTRACT.md"],
  "v5.1.9": ["ephemeralparticipantaccessenvelope.html", "data/vedapath-ephemeral-participant-access-envelope.json", "docs/EPHEMERAL_PARTICIPANT_ACCESS_ENVELOPE.md"],
  "v5.2.0": ["auditedsessionexecutionsandbox.html", "data/vedapath-audited-session-execution-sandbox.json", "docs/AUDITED_SESSION_EXECUTION_SANDBOX.md"],
  "v5.2.1": ["founderprivatepilotretrospective.html", "data/vedapath-founder-private-pilot-retrospective.json", "docs/FOUNDER_PRIVATE_PILOT_RETROSPECTIVE.md"]
};

for (const version of order.slice(0, end + 1)) {
  for (const file of files[version]) if (!existsSync(file)) throw new Error(`Missing ${file}`);
  const data = JSON.parse(readFileSync(files[version][1], "utf8"));
  if (data.release !== version) throw new Error(`Wrong release in ${files[version][1]}`);
  if (data.launch_state.publicLaunch !== false) throw new Error(`Public launch must stay false for ${version}`);
  const result = fixtures[version]();
  if (!result.approved) throw new Error(`${version} fixture did not approve: ${result.blockers.join(", ")}`);
  if (result.publicLaunch !== "blocked") throw new Error(`${version} public launch boundary failed`);
  if (!privatePilotExecutionPacket(version, result).includes("Public launch: blocked")) throw new Error(`${version} packet boundary missing`);
}

console.log(`private-pilot-execution-ok ${end + 1}/5`);
