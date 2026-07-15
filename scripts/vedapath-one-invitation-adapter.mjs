import { createHash } from "node:crypto";

const DIRECT_IDENTITY_KEYS = new Set(["email", "emailAddress", "fullName", "name", "phone", "phoneNumber"]);

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

function containsDirectIdentity(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) => DIRECT_IDENTITY_KEYS.has(key) || containsDirectIdentity(child));
}

export function prepareOneInvitationAdapter(input = {}) {
  const blockers = [];
  const preparedAt = Number(input.preparedAt);
  const expiresAt = Number(input.expiresAt);

  if (input.stackReadinessStatus !== "private-stack-ready-no-activation") blockers.push("private-stack-readiness-required");
  if (!/^adapter:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.adapterId || ""))) blockers.push("adapter-id-required");
  if (!/^invite-candidate:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.invitationId || ""))) blockers.push("invitation-candidate-id-required");
  if (!/^participant:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.participantId || ""))) blockers.push("pseudonymous-participant-required");
  if (!/^idem:[a-z0-9][a-z0-9-]{7,63}$/.test(String(input.idempotencyKey || ""))) blockers.push("idempotency-key-required");
  if (input.role !== "private-learner") blockers.push("private-learner-role-required");
  if (input.purpose !== "source-first-private-pilot") blockers.push("bounded-purpose-required");
  if (input.consentStatus !== "consent-pending") blockers.push("consent-must-remain-pending");
  if (input.deliveryMode !== "fixture-only") blockers.push("fixture-delivery-mode-required");
  if (input.transport !== "none") blockers.push("transport-must-be-none");
  if (input.mutationMode !== "dry-run") blockers.push("dry-run-mutation-mode-required");
  if (!Number.isInteger(preparedAt) || !Number.isInteger(expiresAt) || expiresAt <= preparedAt || expiresAt - preparedAt > 72 * 60 * 60) blockers.push("expiry-must-be-within-72-hours");
  if (containsDirectIdentity(input)) blockers.push("direct-identity-forbidden");
  if (input.tokenRequested === true) blockers.push("token-request-forbidden");
  if (input.accountRequested === true) blockers.push("account-request-forbidden");
  if (input.emailRequested === true) blockers.push("email-request-forbidden");
  if (input.providerConnected === true) blockers.push("provider-must-remain-disconnected");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const request = {
    adapterId: input.adapterId || null,
    invitationId: input.invitationId || null,
    participantId: input.participantId || null,
    idempotencyKey: input.idempotencyKey || null,
    role: input.role || null,
    purpose: input.purpose || null,
    preparedAt: Number.isInteger(preparedAt) ? preparedAt : null,
    expiresAt: Number.isInteger(expiresAt) ? expiresAt : null,
    deliveryMode: input.deliveryMode || null,
    transport: input.transport || null
  };
  const ready = blockers.length === 0;

  return {
    schema: "vedapath.one-invitation-adapter.v1",
    status: ready ? "one-invitation-adapter-ready-not-sent" : "one-invitation-adapter-blocked",
    ready,
    blockers,
    requestDigest: ready ? digest(request) : null,
    request,
    maximumInvitations: ready ? 1 : 0,
    tokenCreated: false,
    accountCreated: false,
    emailSent: false,
    deliveryAttempted: false,
    providerMutation: false,
    invitationIssued: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function oneInvitationAdapterPacket(result) {
  if (!result || result.schema !== "vedapath.one-invitation-adapter.v1") {
    throw new TypeError("A VedaPath one-invitation adapter result is required.");
  }
  return [
    "VedaPath One-Invitation Adapter Contract",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Request digest: ${result.requestDigest || "not-created"}`,
    `Maximum invitations: ${result.maximumInvitations}`,
    "Token created: false",
    "Account created: false",
    "Email sent: false",
    "Delivery attempted: false",
    "Provider mutation: false",
    "Invitation issued: false",
    "Public launch: blocked"
  ].join("\n");
}
