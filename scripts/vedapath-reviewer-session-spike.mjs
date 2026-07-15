import { createHmac, timingSafeEqual } from "node:crypto";
import { evaluateReviewerCapability, reviewerRoles } from "./vedapath-reviewer-authorization.mjs";

function encode(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signature(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function validSecret(secret) {
  return typeof secret === "string" && secret.length >= 32;
}

function validSubject(subject) {
  return /^reviewer-[a-z0-9-]{3,60}$/.test(String(subject || ""));
}

export function issueReviewerSession(input = {}, options = {}) {
  if (!validSecret(options.secret)) throw new Error("A test signing secret of at least 32 characters is required.");
  if (!validSubject(input.subject)) throw new Error("Reviewer subject must be a pseudonymous reviewer-* identifier.");
  const validRoles = reviewerRoles().map(function (role) { return role.id; });
  if (!validRoles.includes(input.role)) throw new Error("Unknown reviewer role.");
  const now = Number.isFinite(options.now) ? options.now : Date.now();
  const lifetime = Math.min(3600, Math.max(60, Number(input.expires_in_seconds) || 900));
  const issuedAt = Math.floor(now / 1000);
  const header = { alg: "HS256", typ: "VP-SESSION", kid: "prototype-local-v1" };
  const claims = {
    schema: "vedapath.reviewer-session.v1",
    release: "v4.9.4",
    sub: input.subject,
    role: input.role,
    jti: String(options.sessionId || "prototype-session"),
    iat: issuedAt,
    exp: issuedAt + lifetime,
    identity_provider_verified: false,
    production_allowed: false
  };
  const unsigned = encode(header) + "." + encode(claims);
  return { token: unsigned + "." + signature(unsigned, options.secret), claims: { ...claims } };
}

export function verifyReviewerSession(token, options = {}) {
  if (!validSecret(options.secret)) return { ok: false, reason: "Missing or weak test signing secret.", claims: null };
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return { ok: false, reason: "Malformed session envelope.", claims: null };
  const unsigned = parts[0] + "." + parts[1];
  const expected = Buffer.from(signature(unsigned, options.secret));
  const received = Buffer.from(parts[2]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return { ok: false, reason: "Invalid session signature.", claims: null };

  let claims;
  try {
    claims = decode(parts[1]);
  } catch (error) {
    return { ok: false, reason: "Unreadable session claims.", claims: null };
  }

  const now = Math.floor((Number.isFinite(options.now) ? options.now : Date.now()) / 1000);
  if (!validSubject(claims.sub)) return { ok: false, reason: "Invalid reviewer subject.", claims: null };
  if (claims.exp <= now) return { ok: false, reason: "Session expired.", claims: { ...claims } };
  if (claims.iat > now + 30) return { ok: false, reason: "Session issue time is in the future.", claims: { ...claims } };
  const revoked = options.revokedTokenIds instanceof Set ? options.revokedTokenIds : new Set(options.revokedTokenIds || []);
  if (revoked.has(claims.jti)) return { ok: false, reason: "Session revoked.", claims: { ...claims } };
  if (claims.identity_provider_verified !== false || claims.production_allowed !== false) return { ok: false, reason: "Prototype boundary claims were altered.", claims: null };
  return { ok: true, reason: "Valid test session.", claims: { ...claims } };
}

export function authorizeReviewerSession(token, operation, options = {}) {
  const session = verifyReviewerSession(token, options);
  if (!session.ok) return { ...session, preview_allowed: false, production_allowed: false };
  const decision = evaluateReviewerCapability({ role: session.claims.role, operation });
  return {
    ok: decision.preview_allowed,
    reason: decision.reason,
    claims: session.claims,
    operation: String(operation || ""),
    preview_allowed: decision.preview_allowed,
    production_allowed: false,
    identity_provider_verified: false
  };
}

export const reviewerSessionBoundary = Object.freeze({
  release: "v4.9.4",
  identity_provider: "not-connected",
  session_signing: "local-test-spike-only",
  maximum_lifetime_seconds: 3600,
  revocation: "caller-supplied-test-set",
  production_allowed: false,
  public_launch: "blocked"
});
