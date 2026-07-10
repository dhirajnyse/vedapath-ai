const roleCapabilities = Object.freeze({
  observer: Object.freeze(["view-source", "view-rights", "copy-preview"]),
  "source-reviewer": Object.freeze(["view-source", "view-rights", "copy-preview", "claim-source-work", "route-source", "hold-candidate", "mark-source-evidence-ready"]),
  "rights-reviewer": Object.freeze(["view-source", "view-rights", "copy-preview", "claim-rights-work", "route-rights", "hold-candidate", "mark-rights-evidence-ready"]),
  "release-reviewer": Object.freeze(["view-source", "view-rights", "copy-preview", "view-pilot-evidence", "hold-candidate", "recommend-pilot-decision"])
});

const forbidden = Object.freeze([
  "publish-source",
  "merge-registry",
  "deploy-service",
  "activate-pilot",
  "launch-public",
  "grant-production-access"
]);

export function reviewerRoles() {
  return Object.entries(roleCapabilities).map(function ([id, capabilities]) {
    return { id, capabilities: capabilities.slice() };
  });
}

export function evaluateReviewerCapability(input = {}) {
  const role = roleCapabilities[input.role] ? input.role : "observer";
  const operation = String(input.operation || "");
  const globallyForbidden = forbidden.includes(operation);
  const previewAllowed = !globallyForbidden && roleCapabilities[role].includes(operation);
  return {
    schema: "vedapath.reviewer-capability.v1",
    release: "v4.8.9",
    role,
    operation,
    identity_verified: false,
    preview_allowed: previewAllowed,
    production_allowed: false,
    reason: globallyForbidden
      ? "This operation is locked in every prototype role."
      : previewAllowed
        ? "The role may simulate this bounded operation in page memory only."
        : "The selected prototype role does not carry this capability."
  };
}

export const reviewerIdentityBoundary = Object.freeze({
  release: "v4.8.9",
  authentication: "absent",
  authorization: "preview-policy-only",
  identity_verified: false,
  production_permissions: [],
  forbidden_operations: forbidden.slice()
});

