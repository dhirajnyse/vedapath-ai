const ROLE_CAPABILITIES = {
  observer: ["read-review-queue"],
  "source-reviewer": ["read-review-queue", "claim-source-work", "record-source-decision"],
  "rights-reviewer": ["read-review-queue", "claim-rights-work", "record-rights-decision"],
  "release-reviewer": ["read-review-queue", "record-release-recommendation"]
};
const DIRECT_IDENTITY_KEYS = ["email", "name", "phone", "address", "password", "token"];
const MAX_LIFETIME_SECONDS = 14 * 24 * 60 * 60;

export function planReviewerAccounts(requests = [], options = {}) {
  const now = Number(options.now || Math.floor(Date.now() / 1000));
  const errors = [];
  const seen = new Set();
  const entries = [];

  if (!Array.isArray(requests)) requests = [];
  if (requests.length > 6) errors.push("reviewer-count-exceeds-private-pilot-limit");

  requests.forEach((request, index) => {
    const prefix = `reviewer:${index}`;
    if (!request || typeof request !== "object" || Array.isArray(request)) {
      errors.push(`${prefix}:invalid-request`);
      return;
    }
    if (DIRECT_IDENTITY_KEYS.some((key) => Object.hasOwn(request, key))) errors.push(`${prefix}:direct-identity-forbidden`);
    if (typeof request.reviewerId !== "string" || !/^reviewer:[a-z0-9-]{3,32}$/i.test(request.reviewerId)) errors.push(`${prefix}:pseudonymous-id-required`);
    if (seen.has(request.reviewerId)) errors.push(`${prefix}:duplicate-id`);
    seen.add(request.reviewerId);
    if (!ROLE_CAPABILITIES[request.role]) errors.push(`${prefix}:role-not-allowed`);
    if (typeof request.sponsor !== "string" || !/^owner:[a-z0-9-]{3,40}$/i.test(request.sponsor)) errors.push(`${prefix}:sponsor-required`);
    if (request.aal2 !== "required") errors.push(`${prefix}:aal2-required`);
    if (request.privacyConsent !== "recorded") errors.push(`${prefix}:privacy-consent-required`);
    if (!Number.isInteger(request.expiresAt) || request.expiresAt <= now || request.expiresAt - now > MAX_LIFETIME_SECONDS) errors.push(`${prefix}:expiry-invalid`);

    entries.push({
      reviewerId: request.reviewerId,
      role: request.role,
      sponsor: request.sponsor,
      expiresAt: request.expiresAt,
      assurance: "aal2-required",
      capabilities: ROLE_CAPABILITIES[request.role] || [],
      state: "planned-not-created"
    });
  });

  const valid = requests.length > 0 && errors.length === 0;
  return {
    schema: "vedapath.reviewer-account-provisioning-plan.v1",
    status: valid ? "provisioning-plan-valid-no-accounts" : "provisioning-plan-blocked",
    valid,
    errors,
    entries: valid ? entries : [],
    accountsCreated: 0,
    credentialsIssued: 0,
    invitationsIssued: 0,
    directIdentityStored: false,
    identityProviderConnected: false,
    activationAuthorized: false,
    publicLaunch: "blocked"
  };
}

export function reviewerProvisioningPacket(result) {
  if (!result || result.schema !== "vedapath.reviewer-account-provisioning-plan.v1") {
    throw new TypeError("A VedaPath reviewer provisioning plan is required.");
  }
  return [
    "VedaPath Reviewer Account Provisioning Runbook",
    `Status: ${result.status}`,
    `Planned reviewers: ${result.entries.length}`,
    `Errors: ${result.errors.length ? result.errors.join(", ") : "none"}`,
    "Accounts created: 0",
    "Credentials issued: 0",
    "Invitations issued: 0",
    "Direct identity stored: false",
    "Public launch: blocked"
  ].join("\n");
}
