import crypto from "node:crypto";

const OWNER_RE = /^owner:[a-z0-9][a-z0-9-]{2,47}$/;
const BLOCKED = ["launchAuthorization", "productionStorage", "liveAi", "telemetryEnabled", "publicPilot", "corpusDelivery"];

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function asSet(values) {
  return new Set((values || []).map((value) => String(value).toLowerCase()));
}

function base(input) {
  const violations = [];
  for (const flag of BLOCKED) {
    if (input[flag]) violations.push(`${flag} must remain disabled`);
  }
  if (!Array.isArray(input.packet) || !input.packet.some((item) => OWNER_RE.test(String(item)))) {
    violations.push("packet must include owner:<slug>");
  }
  return violations;
}

function result(kind, input, violations) {
  return {
    kind,
    approved: violations.length === 0,
    violations,
    digest: digest({ kind, input }),
    boundary: "Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization."
  };
}

export function evaluatePilotToProductionGapMap(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["gap: security", "gap: privacy-consent", "gap: source-rights", "gap: hosted-architecture"].forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if ((input.gaps || 0) < 6) violations.push("gap map must name at least six launch gaps");
  return result("pilot-to-production-gap-map", input, violations);
}

export function evaluateSecurityThreatModel(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["asset: identity", "asset: source-records", "threat: prompt-injection", "mitigation: reviewer-gate"].forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if ((input.threats || 0) < 7) violations.push("threat model must name at least seven threats");
  if (input.secretValue || input.apiKey || input.tokenValue) violations.push("fixtures must not contain secrets");
  return result("security-threat-model", input, violations);
}

export function evaluateConsentPrivacyLedgerContract(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["consent: explicit", "withdrawal: required", "telemetry: disabled"].forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if (!String(input.retention || "").match(/day|delete|local/i)) violations.push("retention must be explicit");
  if (input.rawIdentity) violations.push("raw identity must not be stored in fixtures");
  return result("consent-privacy-ledger-contract", input, violations);
}

export function evaluateSourceRightsLicensePack(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["edition: named", "license: review-required", "allowed-use: citation-card", "corpus-delivery: blocked"].forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if ((input.sources || 0) < 4) violations.push("rights pack must cover multiple sources");
  return result("source-rights-license-pack", input, violations);
}

export function evaluateMinimalHostedPilotArchitectureDecision(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["architecture: minimal-hosted-pilot", "source-api: bounded", "review-queue: required", "consent-ledger: required"].forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if (!["hold", "spike", "review"].includes(input.decision)) violations.push("decision must be hold, spike, or review");
  return result("minimal-hosted-pilot-architecture-decision", input, violations);
}

export function productionReadinessPacket(label, evaluation) {
  return {
    label,
    approved: Boolean(evaluation.approved),
    digest: evaluation.digest,
    violations: evaluation.violations,
    boundary: evaluation.boundary
  };
}
