const ROLE_CAPABILITIES = Object.freeze({
  observer: ["view-source", "view-rights", "view-pilot-evidence"],
  "source-reviewer": ["view-source", "claim-source-work", "route-source", "hold-candidate", "mark-source-evidence-ready"],
  "rights-reviewer": ["view-rights", "claim-rights-work", "route-rights", "hold-candidate", "mark-rights-evidence-ready"],
  "release-reviewer": ["view-pilot-evidence", "hold-candidate", "recommend-pilot-decision"]
});

const ALWAYS_DENIED = new Set(["publish-source", "merge-registry", "issue-invite", "activate-pilot", "public-launch"]);

function normalizeRoles(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((role) => Object.hasOwn(ROLE_CAPABILITIES, role)))].sort();
}

export function validateReviewerClaims(claims = {}, policy = {}, nowSeconds = Math.floor(Date.now() / 1000)) {
  const errors = [];
  const issuer = typeof claims.iss === "string" ? claims.iss : "";
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud].filter(Boolean);
  const roles = normalizeRoles(claims.roles);
  const expectedIssuer = String(policy.issuer || "");
  const expectedAudience = String(policy.audience || "");

  if (!expectedIssuer || issuer !== expectedIssuer) errors.push("issuer-mismatch");
  if (!expectedAudience || !audience.includes(expectedAudience)) errors.push("audience-mismatch");
  if (typeof claims.sub !== "string" || !/^reviewer:[a-z0-9-]{3,64}$/.test(claims.sub)) errors.push("subject-invalid");
  if (!Number.isInteger(claims.iat) || claims.iat > nowSeconds + 60) errors.push("issued-at-invalid");
  if (!Number.isInteger(claims.exp) || claims.exp <= nowSeconds) errors.push("session-expired");
  if (Number.isInteger(claims.iat) && Number.isInteger(claims.exp) && claims.exp - claims.iat > 3600) errors.push("session-too-long");
  if (claims.acr !== "aal2") errors.push("aal2-required");
  if (roles.length === 0) errors.push("bounded-role-required");
  if (claims.revoked === true) errors.push("session-revoked");
  if (claims.email || claims.name || claims.phone_number) errors.push("direct-identity-claims-forbidden");

  return {
    schema: "vedapath.reviewer-identity-validation.v1",
    valid: errors.length === 0,
    errors,
    subject: typeof claims.sub === "string" ? claims.sub : "invalid",
    roles,
    capabilities: [...new Set(roles.flatMap((role) => ROLE_CAPABILITIES[role]))].sort(),
    assurance: claims.acr || "missing",
    expiresAt: Number.isInteger(claims.exp) ? claims.exp : null,
    identityProviderConnected: false,
    productionAllowed: false,
    publicLaunch: "blocked"
  };
}

export function authorizeReviewerOperation(validation, operation) {
  if (!validation || validation.schema !== "vedapath.reviewer-identity-validation.v1") {
    throw new TypeError("A reviewer identity validation result is required.");
  }
  if (!validation.valid) return { allowed: false, reason: "identity-invalid" };
  if (ALWAYS_DENIED.has(operation)) return { allowed: false, reason: "operation-locked" };
  const allowed = validation.capabilities.includes(operation);
  return { allowed, reason: allowed ? "role-capability-match" : "capability-not-granted" };
}

export { ROLE_CAPABILITIES };
