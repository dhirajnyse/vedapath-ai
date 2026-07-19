import {
  evaluatePilotToProductionGapMap,
  evaluateSecurityThreatModel,
  evaluateConsentPrivacyLedgerContract,
  evaluateSourceRightsLicensePack,
  evaluateMinimalHostedPilotArchitectureDecision,
  productionReadinessPacket
} from "./vedapath-production-readiness-contracts.mjs";

const releases = ["v5.2.2", "v5.2.3", "v5.2.4", "v5.2.5", "v5.2.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(`Unknown --through=${through}`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const checks = [
  () => {
    const ok = evaluatePilotToProductionGapMap({ gaps: 8, packet: ["gap: security", "gap: privacy-consent", "gap: source-rights", "gap: hosted-architecture", "owner:founder"] });
    assert(ok.approved, "gap map should pass");
    assert(!evaluatePilotToProductionGapMap({ gaps: 2, launchAuthorization: true, packet: ["owner:founder"] }).approved, "unsafe gap map should fail");
    assert(productionReadinessPacket("gap", ok).approved, "gap packet should wrap");
  },
  () => {
    const ok = evaluateSecurityThreatModel({ threats: 9, packet: ["asset: identity", "asset: source-records", "threat: prompt-injection", "mitigation: reviewer-gate", "owner:security"] });
    assert(ok.approved, "threat model should pass");
    assert(!evaluateSecurityThreatModel({ threats: 9, apiKey: "secret", packet: ["asset: identity", "owner:security"] }).approved, "secret-bearing model should fail");
  },
  () => {
    const ok = evaluateConsentPrivacyLedgerContract({ retention: "30 days then delete/export on request", packet: ["consent: explicit", "withdrawal: required", "telemetry: disabled", "owner:privacy"] });
    assert(ok.approved, "privacy ledger should pass");
    assert(!evaluateConsentPrivacyLedgerContract({ retention: "forever", telemetryEnabled: true, rawIdentity: true, packet: ["owner:privacy"] }).approved, "unsafe privacy ledger should fail");
  },
  () => {
    const ok = evaluateSourceRightsLicensePack({ sources: 12, packet: ["edition: named", "license: review-required", "allowed-use: citation-card", "corpus-delivery: blocked", "owner:rights"] });
    assert(ok.approved, "rights pack should pass");
    assert(!evaluateSourceRightsLicensePack({ sources: 1, corpusDelivery: true, packet: ["owner:rights"] }).approved, "unsafe rights pack should fail");
  },
  () => {
    const ok = evaluateMinimalHostedPilotArchitectureDecision({ decision: "review", packet: ["architecture: minimal-hosted-pilot", "source-api: bounded", "review-queue: required", "consent-ledger: required", "owner:founder"] });
    assert(ok.approved, "hosted decision should pass");
    assert(!evaluateMinimalHostedPilotArchitectureDecision({ decision: "launch", productionStorage: true, packet: ["owner:founder"] }).approved, "production architecture should fail");
  }
];

checks.slice(0, count).forEach((check) => check());
console.log(`production-readiness-ok ${count}/5`);
