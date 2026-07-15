import { createHash } from "node:crypto";

const DIRECT_IDENTITY_KEYS = new Set(["email", "emailAddress", "fullName", "name", "phone", "phoneNumber"]);

function containsDirectIdentity(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) => DIRECT_IDENTITY_KEYS.has(key) || containsDirectIdentity(child));
}

function receiptDigest(receipt) {
  return createHash("sha256").update(JSON.stringify(receipt)).digest("hex");
}

export function recordParticipantConsentHandshake(input = {}) {
  const blockers = [];
  const acceptedAt = Number(input.acceptedAt);
  const expiresAt = Number(input.expiresAt);

  if (input.adapterStatus !== "one-invitation-adapter-ready-not-sent") blockers.push("one-invitation-adapter-required");
  if (!/^consent-fixture:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.consentId || ""))) blockers.push("consent-fixture-id-required");
  if (!/^participant:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.participantId || ""))) blockers.push("pseudonymous-participant-required");
  if (input.consentMode !== "fixture-only") blockers.push("fixture-consent-mode-required");
  if (input.consentVersion !== "private-pilot-consent-v1") blockers.push("consent-version-required");
  if (input.privacyNoticeVersion !== "private-pilot-privacy-v1") blockers.push("privacy-notice-version-required");
  if (input.capacityAttestation !== "adult-volunteer") blockers.push("adult-volunteer-attestation-required");
  if (input.scopeAcknowledgement !== "source-first-reflection-only") blockers.push("source-first-scope-acknowledgement-required");
  if (input.dataUse !== "session-safety-and-quality-only") blockers.push("bounded-data-use-required");
  if (input.telemetry !== "none") blockers.push("telemetry-must-be-none");
  if (input.withdrawal !== "available-before-session") blockers.push("withdrawal-path-required");
  if (input.identityMode !== "pseudonymous-only") blockers.push("pseudonymous-identity-mode-required");
  if (!Number.isInteger(acceptedAt) || !Number.isInteger(expiresAt) || expiresAt <= acceptedAt || expiresAt - acceptedAt > 72 * 60 * 60) blockers.push("consent-expiry-must-be-within-72-hours");
  if (containsDirectIdentity(input)) blockers.push("direct-identity-forbidden");
  if (input.accountRequested === true) blockers.push("account-request-forbidden");
  if (input.tokenRequested === true) blockers.push("token-request-forbidden");
  if (input.sessionStarted === true) blockers.push("session-must-remain-not-started");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const receipt = {
    consentId: input.consentId || null,
    participantId: input.participantId || null,
    consentMode: input.consentMode || null,
    consentVersion: input.consentVersion || null,
    privacyNoticeVersion: input.privacyNoticeVersion || null,
    capacityAttestation: input.capacityAttestation || null,
    scopeAcknowledgement: input.scopeAcknowledgement || null,
    dataUse: input.dataUse || null,
    telemetry: input.telemetry || null,
    withdrawal: input.withdrawal || null,
    acceptedAt: Number.isInteger(acceptedAt) ? acceptedAt : null,
    expiresAt: Number.isInteger(expiresAt) ? expiresAt : null
  };
  const valid = blockers.length === 0;

  return {
    schema: "vedapath.participant-consent-handshake.v1",
    status: valid ? "consent-handshake-fixture-valid-no-participant" : "consent-handshake-blocked",
    valid,
    blockers,
    receiptDigest: valid ? receiptDigest(receipt) : null,
    receipt,
    accountCreated: false,
    tokenCreated: false,
    participantCreated: false,
    sessionStarted: false,
    telemetryEnabled: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function participantConsentHandshakePacket(result) {
  if (!result || result.schema !== "vedapath.participant-consent-handshake.v1") {
    throw new TypeError("A VedaPath participant consent handshake result is required.");
  }
  return [
    "VedaPath Participant Consent Handshake Contract",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Receipt digest: ${result.receiptDigest || "not-created"}`,
    "Fixture only: true",
    "Account created: false",
    "Token created: false",
    "Participant created: false",
    "Session started: false",
    "Telemetry enabled: false",
    "Public launch: blocked"
  ].join("\n");
}
