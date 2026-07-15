import { createHash } from "node:crypto";

const REASONS = new Set([
  "consent-withdrawn",
  "founder-cancelled",
  "readiness-regressed",
  "security-hold"
]);

function digest(value) {
  const entries = Object.keys(value).sort().map((key) => `${key}:${JSON.stringify(value[key])}`).join("|");
  return createHash("sha256").update(entries).digest("hex");
}

export function createInvitationRevocationReceipt(input = {}) {
  const blockers = [];
  const issuedAt = Number(input.issuedAt);
  const revokedAt = Number(input.revokedAt);

  if (input.dryRunStatus !== "invitation-dry-run-valid-not-issued") blockers.push("valid-dry-run-required");
  if (!/^[a-f0-9]{64}$/.test(String(input.requestDigest || ""))) blockers.push("valid-request-digest-required");
  if (!/^invite-dry-run:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.invitationId || ""))) blockers.push("valid-dry-run-id-required");
  if (!REASONS.has(input.reason)) blockers.push("allowlisted-revocation-reason-required");
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.revokedBy || ""))) blockers.push("named-revocation-owner-required");
  if (!Number.isInteger(issuedAt) || !Number.isInteger(revokedAt) || revokedAt < issuedAt) blockers.push("valid-revocation-timeline-required");
  if (input.invitationIssued === true) blockers.push("issued-invitation-not-allowed-in-dry-run");
  if (input.tokenCreated === true) blockers.push("live-token-forbidden");
  if (input.invitationInUse === true) blockers.push("in-use-invitation-forbidden");
  if (Number(input.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const receipt = {
    requestDigest: input.requestDigest || null,
    invitationId: input.invitationId || null,
    reason: input.reason || null,
    issuedAt: Number.isInteger(issuedAt) ? issuedAt : null,
    revokedAt: Number.isInteger(revokedAt) ? revokedAt : null,
    revokedBy: input.revokedBy || null
  };
  const valid = blockers.length === 0;

  return {
    schema: "vedapath.invitation-revocation-receipt.v1",
    status: valid ? "revocation-drill-valid-no-live-invitation" : "revocation-drill-blocked",
    valid,
    blockers,
    receipt,
    receiptDigest: valid ? digest(receipt) : null,
    invitationRevoked: false,
    tokenRevoked: false,
    providerMutation: false,
    notificationSent: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function invitationRevocationReceiptPacket(result) {
  if (!result || result.schema !== "vedapath.invitation-revocation-receipt.v1") {
    throw new TypeError("A VedaPath invitation revocation receipt is required.");
  }
  return [
    "VedaPath Invitation Revocation Receipt Contract",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Receipt digest: ${result.receiptDigest || "not-created"}`,
    "Invitation revoked: false (no live invitation exists)",
    "Token revoked: false (no token exists)",
    "Provider mutation: false",
    "Notification sent: false",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}
