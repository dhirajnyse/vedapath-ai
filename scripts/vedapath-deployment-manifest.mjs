const ALLOWED_KEYS = new Set([
  "schema",
  "environment",
  "runtime",
  "region",
  "access",
  "apiPath",
  "healthPath",
  "secretRefs",
  "telemetry",
  "redactedLogFields",
  "limits",
  "writeRoutes",
  "rollback",
  "deploymentMode",
  "activated"
]);

const REQUIRED_SECRET_REFS = [
  "VEDAPATH_SESSION_SIGNING_SECRET",
  "VEDAPATH_REVIEWER_STORE_KEY"
];

const REQUIRED_REDACTIONS = ["question", "authorization", "cookie", "ip", "user-agent"];

function isPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.includes("//");
}

export function validateDeploymentManifest(manifest = {}) {
  const errors = [];
  const unknownKeys = Object.keys(manifest).filter((key) => !ALLOWED_KEYS.has(key));
  if (unknownKeys.length) errors.push(`unknown-keys:${unknownKeys.sort().join(",")}`);
  if (manifest.schema !== "vedapath.private-preview-manifest.v1") errors.push("schema-invalid");
  if (manifest.environment !== "pilot") errors.push("environment-must-be-pilot");
  if (manifest.runtime !== "web-standard") errors.push("runtime-must-be-web-standard");
  if (typeof manifest.region !== "string" || !manifest.region.trim()) errors.push("region-required");
  if (manifest.access !== "private-invite-only") errors.push("private-access-required");
  if (!isPath(manifest.apiPath)) errors.push("api-path-invalid");
  if (!isPath(manifest.healthPath)) errors.push("health-path-invalid");
  if (manifest.telemetry !== "aggregate-redacted") errors.push("telemetry-must-be-aggregate-redacted");
  if (manifest.deploymentMode !== "dry-run") errors.push("deployment-mode-must-be-dry-run");
  if (manifest.activated !== false) errors.push("activation-forbidden");
  if (!Array.isArray(manifest.writeRoutes) || manifest.writeRoutes.length !== 0) errors.push("write-routes-must-be-empty");

  const secretRefs = Array.isArray(manifest.secretRefs) ? manifest.secretRefs : [];
  for (const ref of REQUIRED_SECRET_REFS) {
    if (!secretRefs.includes(ref)) errors.push(`secret-reference-missing:${ref}`);
  }
  if (secretRefs.some((value) => typeof value !== "string" || !/^[A-Z][A-Z0-9_]+$/.test(value))) {
    errors.push("secret-references-must-be-names-only");
  }

  const redactions = Array.isArray(manifest.redactedLogFields) ? manifest.redactedLogFields : [];
  for (const field of REQUIRED_REDACTIONS) {
    if (!redactions.includes(field)) errors.push(`redaction-missing:${field}`);
  }

  const limits = manifest.limits || {};
  if (!Number.isInteger(limits.requestBytes) || limits.requestBytes < 512 || limits.requestBytes > 8192) errors.push("request-byte-limit-invalid");
  if (!Number.isInteger(limits.timeoutMs) || limits.timeoutMs < 250 || limits.timeoutMs > 5000) errors.push("timeout-limit-invalid");
  if (!Number.isInteger(limits.requestsPerMinute) || limits.requestsPerMinute < 1 || limits.requestsPerMinute > 30) errors.push("rate-limit-invalid");

  const rollback = manifest.rollback || {};
  if (rollback.strategy !== "disable-endpoint") errors.push("rollback-strategy-invalid");
  if (typeof rollback.owner !== "string" || !rollback.owner.trim()) errors.push("rollback-owner-required");
  if (!Number.isInteger(rollback.targetMinutes) || rollback.targetMinutes < 1 || rollback.targetMinutes > 15) errors.push("rollback-target-invalid");

  return {
    schema: "vedapath.deployment-manifest-validation.v1",
    valid: errors.length === 0,
    errors,
    safeSummary: {
      environment: manifest.environment || "unknown",
      runtime: manifest.runtime || "unknown",
      region: typeof manifest.region === "string" ? manifest.region.trim() : "unselected",
      access: manifest.access || "unknown",
      secretReferenceCount: secretRefs.length,
      writeRouteCount: Array.isArray(manifest.writeRoutes) ? manifest.writeRoutes.length : null,
      deploymentMode: manifest.deploymentMode || "unknown",
      activated: false
    },
    endpointCreated: false,
    credentialsSerialized: false,
    publicLaunch: "blocked"
  };
}
