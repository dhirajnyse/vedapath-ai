const criteria = Object.freeze([
  ["request_response_compatible", "Runs the existing standards-based Request/Response adapter."],
  ["private_access_available", "Supports a private preview that is not publicly discoverable."],
  ["region_controls_documented", "Documents where requests, logs, and temporary runtime data are handled."],
  ["secret_management_available", "Provides managed secret references without client-side values."],
  ["logging_redaction_confirmed", "Can exclude questions, tokens, IP addresses, and user-agent strings from application logs."],
  ["spend_cap_set", "Has an explicit pilot budget ceiling and owner alert."],
  ["owner_named", "Names one operational owner for incidents and shutdown."],
  ["zero_write_routes", "Preserves the read-only route boundary for the first hosted slice."]
]);

function clean(value, max = 80) {
  return String(value || "").trim().replace(/[^a-zA-Z0-9 ._\/-]/g, "").slice(0, max);
}

export function providerRegionCriteria() {
  return criteria.map(function ([id, label]) { return { id, label }; });
}

export function evaluateProviderRegionCandidate(input = {}) {
  const checks = criteria.map(function ([id, label]) {
    return { id, label, passed: input[id] === true };
  });
  const missing = checks.filter(function (check) { return !check.passed; }).map(function (check) { return check.id; });
  const score = Math.round(((checks.length - missing.length) / checks.length) * 100);
  const providerLabel = clean(input.provider_label) || "Unselected provider";
  const regionLabel = clean(input.region_label) || "Unselected region";

  return {
    schema: "vedapath.provider-region-candidate.v1",
    release: "v4.9.2",
    provider_label: providerLabel,
    region_label: regionLabel,
    runtime_shape: "standards-based edge or serverless Web runtime",
    checks,
    missing,
    score,
    ready_for_implementation: missing.length === 0,
    deployment_activated: false,
    credentials_attached: false,
    write_routes: [],
    public_launch: "blocked",
    decision: missing.length === 0 ? "candidate-ready-for-founder-review" : "candidate-incomplete"
  };
}

export const providerRegionBoundary = Object.freeze({
  release: "v4.9.2",
  provider_selected: false,
  region_selected: false,
  deployment: "not-activated",
  credentials: "absent",
  durable_storage: "absent",
  write_routes: Object.freeze([]),
  public_launch: "blocked"
});
