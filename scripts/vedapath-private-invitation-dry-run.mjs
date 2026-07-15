import { createHash } from "node:crypto";

const DIRECT_IDENTITY_KEYS = new Set([
  "email",
  "emailAddress",
  "fullName",
  "name",
  "phone",
  "phoneNumber"
]);

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash("sha256").update(canonical(value)).digest("hex");
}

function findDirectIdentity(value, path = "input") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const current = `${path}.${key}`;
    const own = DIRECT_IDENTITY_KEYS.has(key) ? [current] : [];
    return own.concat(findDirectIdentity(child, current));
  });
}

export function createPrivateInvitationDryRun(input = {}) {
  const blockers = [];
  const issuedAt = Number(input.issuedAt);
  const expiresAt = Number(input.expiresAt);
  const ttlSeconds = expiresAt - issuedAt;
  const directIdentityFields = findDirectIdentity(input);

  if (input.activationDecision !== "one-private-invitation-authorized-not-issued") blockers.push("activation-decision-required");
  if (!/^invite-dry-run:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.invitationId || ""))) blockers.push("invalid-dry-run-id");
  if (!/^participant:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.participantId || ""))) blockers.push("pseudonymous-participant-id-required");
  if (input.role !== "private-learner") blockers.push("private-learner-role-required");
  if (input.purpose !== "source-first-private-pilot") blockers.push("bounded-purpose-required");
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.founderOperator || ""))) blockers.push("named-founder-operator-required");
  if (input.privacyConsent !== "recorded") blockers.push("privacy-consent-required");
  if (input.deliveryChannel !== "none") blockers.push("delivery-channel-must-be-none");
  if (!Number.isInteger(issuedAt) || !Number.isInteger(expiresAt) || ttlSeconds <= 0 || ttlSeconds > 72 * 60 * 60) blockers.push("expiry-must-be-within-72-hours");
  if (directIdentityFields.length) blockers.push("direct-identity-forbidden");
  if (input.tokenRequested === true) blockers.push("token-request-forbidden");
  if (input.accountRequested === true) blockers.push("account-request-forbidden");
  if (input.emailRequested === true) blockers.push("email-request-forbidden");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");
  if (Number(input.existingInvitations || 0) !== 0) blockers.push("existing-invitations-must-be-zero");
  if (Number(input.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");

  const request = {
    activationDecision: input.activationDecision || null,
    invitationId: input.invitationId || null,
    participantId: input.participantId || null,
    role: input.role || null,
    purpose: input.purpose || null,
    issuedAt: Number.isInteger(issuedAt) ? issuedAt : null,
    expiresAt: Number.isInteger(expiresAt) ? expiresAt : null,
    founderOperator: input.founderOperator || null,
    privacyConsent: input.privacyConsent || null,
    deliveryChannel: input.deliveryChannel || null
  };
  const valid = blockers.length === 0;

  return {
    schema: "vedapath.private-invitation-dry-run.v1",
    status: valid ? "invitation-dry-run-valid-not-issued" : "invitation-dry-run-blocked",
    valid,
    blockers,
    directIdentityFields,
    requestDigest: valid ? digest(request) : null,
    request,
    maximumInvitations: valid ? 1 : 0,
    tokenCreated: false,
    accountCreated: false,
    emailSent: false,
    deliveryAttempted: false,
    invitationIssued: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function privateInvitationDryRunPacket(result) {
  if (!result || result.schema !== "vedapath.private-invitation-dry-run.v1") {
    throw new TypeError("A VedaPath private invitation dry run is required.");
  }
  return [
    "VedaPath Private Invitation Issuance Dry Run",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Request digest: ${result.requestDigest || "not-created"}`,
    `Maximum invitations: ${result.maximumInvitations}`,
    "Token created: false",
    "Account created: false",
    "Email sent: false",
    "Delivery attempted: false",
    "Invitation issued: false",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}
