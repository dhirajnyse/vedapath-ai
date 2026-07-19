import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const HOSTED_ACTIVATION_BOUNDARY = "Hosted-pilot implementation evidence only; provider activation, managed production credentials, durable production data, real external identities, participant telemetry, live AI, deployment, and public launch remain closed.";

const REQUIRED_MANIFEST_BINDINGS = ["runtime", "database", "identity", "secrets"];
const REQUIRED_SECRET_NAMES = ["SOURCE_STORE", "REVIEW_STORE", "IDENTITY_VERIFIER", "SESSION_SIGNING_KEY"];

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function digest(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex").slice(0, 24);
}

function validId(value) {
  return /^[a-z][a-z0-9-]{2,80}$/.test(value || "");
}

function validBindingRef(value) {
  return /^binding:\/\/[A-Z][A-Z0-9_]{2,80}$/.test(value || "");
}

function validSecretRef(value) {
  return /^secret:\/\/[A-Z][A-Z0-9_]{2,80}(?:\/V[1-9][0-9]*)?$/.test(value || "");
}

function closedBoundaryViolations(input = {}) {
  const violations = [];
  if (input.providerBound) violations.push("provider binding must remain false");
  if (input.managedSecretStoreBound) violations.push("managed secret store binding must remain false");
  if (input.durableDatabaseBound) violations.push("durable production database binding must remain false");
  if (input.externalIdentityBound) violations.push("external identity provider binding must remain false");
  if (input.productionCredentials) violations.push("production credentials must remain absent");
  if (input.productionData) violations.push("production data must remain absent");
  if (input.telemetryEnabled) violations.push("participant telemetry must remain disabled");
  if (input.liveAi) violations.push("live AI must remain disabled");
  if (input.deploymentAuthorized) violations.push("deployment authorization must remain false");
  if (input.publicLaunch) violations.push("public launch must remain disabled");
  return violations;
}

function evaluation(kind, input, violations, detail = {}) {
  const unique = [...new Set(violations)];
  return {
    kind,
    approved: unique.length === 0,
    violations: unique,
    digest: digest({ kind, input }),
    boundary: HOSTED_ACTIVATION_BOUNDARY,
    ...detail
  };
}

export function evaluateFounderHostedPilotActivationDecision(input = {}) {
  const violations = closedBoundaryViolations(input);
  const allowed = ["hold", "rework", "authorize-implementation-preparation"];
  if (!allowed.includes(input.decision)) violations.push("decision must be hold, rework, or authorize-implementation-preparation");
  if (!validId(input.decidedBy) || !validId(input.reviewedBy)) {
    violations.push("stable founder and reviewer identifiers are required");
  } else if (input.decidedBy === input.reviewedBy) {
    violations.push("founder decision and independent review must be separate");
  }
  if (input.deploymentReadiness?.approved !== true || input.deploymentReadiness?.privateDemoReady !== true) {
    violations.push("approved private-demo deployment-readiness evidence is required");
  }
  for (const key of ["scopeOwner", "rollbackOwner", "securityOwner", "budgetOwner"]) {
    if (!validId(input.owners?.[key])) violations.push(`${key} is required`);
  }
  for (const key of ["boundaryAccepted", "blockersAccepted", "rollbackReviewed", "noLaunchConfirmed"]) {
    if (input.attestations?.[key] !== true) violations.push(`${key} attestation is required`);
  }

  const authorized = violations.length === 0 && input.decision === "authorize-implementation-preparation";
  const packet = {
    packetVersion: 1,
    decision: authorized ? "implementation-preparation-authorized" : input.decision || "rework",
    readinessDigest: input.deploymentReadiness?.digest || null,
    owners: clone(input.owners || {}),
    attestations: clone(input.attestations || {}),
    decidedBy: input.decidedBy || null,
    reviewedBy: input.reviewedBy || null,
    implementationPreparationAuthorized: authorized,
    providerActivationAuthorized: false,
    deploymentAuthorized: false,
    publicLaunch: false
  };
  return evaluation("founder-hosted-pilot-activation-decision", input, violations, {
    decision: authorized ? "implementation-preparation-authorized" : input.decision === "hold" ? "hold" : "rework",
    decisionPacket: authorized ? packet : null,
    packetChecksum: authorized ? digest(packet) : null,
    implementationPreparationAuthorized: authorized,
    hostedPilotActivatable: false,
    deploymentAuthorized: false,
    publicLaunchReady: false
  });
}

function secretLikeContent(value, key = "") {
  if (/password|private.?key|secret.?value|access.?token|api.?key/i.test(key)) return true;
  if (typeof value === "string" && /(?:sk-|-----BEGIN|password\s*=|token\s*=)/i.test(value)) return true;
  if (Array.isArray(value)) return value.some((item) => secretLikeContent(item));
  if (value && typeof value === "object") return Object.entries(value).some(([childKey, item]) => secretLikeContent(item, childKey));
  return false;
}

export function evaluateProviderManifestDryRun(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.environment !== "private-pilot-candidate") violations.push("environment must be private-pilot-candidate");
  if (!validId(input.serviceName)) violations.push("service name requires a stable identifier");
  if (!validId(input.providerCandidate) || !validId(input.regionCandidate)) violations.push("provider and region candidates are required");
  if (input.authorization?.approved !== true || input.authorization?.implementationPreparationAuthorized !== true) {
    violations.push("founder implementation-preparation authorization is required");
  }
  for (const name of REQUIRED_MANIFEST_BINDINGS) {
    if (!validBindingRef(input.bindings?.[name])) violations.push(`invalid ${name} binding reference`);
  }
  if (!Array.isArray(input.routes) || input.routes.length < 2) violations.push("at least two explicit routes are required");
  for (const route of input.routes || []) {
    if (!/^\/(?:v1\/)?[a-z0-9\-\/]+$/.test(route.path || "")) violations.push("manifest routes require explicit safe paths");
    if (!Array.isArray(route.methods) || route.methods.some((method) => !["GET", "POST"].includes(method))) violations.push("route methods must be GET or POST");
    if (route.path === "*" || route.path?.includes("**")) violations.push("wildcard routes are forbidden");
  }
  if (!Array.isArray(input.rollbackSteps) || input.rollbackSteps.length < 3) violations.push("three rollback steps are required");
  if (secretLikeContent(input)) violations.push("manifest must not contain inline secret material");

  const dryRunPlan = {
    manifestVersion: 1,
    environment: input.environment || null,
    serviceName: input.serviceName || null,
    providerCandidate: input.providerCandidate || null,
    regionCandidate: input.regionCandidate || null,
    bindings: clone(input.bindings || {}),
    routes: clone(input.routes || []),
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
    rollbackSteps: clone(input.rollbackSteps || []),
    operations: ["validate-references", "validate-routes", "validate-security-headers", "verify-rollback-plan", "emit-redacted-receipt"],
    applied: false,
    providerBound: false,
    deploymentAuthorized: false
  };
  const approved = violations.length === 0;
  return evaluation("provider-manifest-dry-run", input, violations, {
    dryRunReady: approved,
    plan: approved ? dryRunPlan : null,
    planChecksum: approved ? digest(dryRunPlan) : null,
    applied: false,
    providerBound: false,
    deploymentAuthorized: false
  });
}

export function createManagedSecretStoreAdapter({ now = () => new Date().toISOString() } = {}) {
  const records = new Map();
  const audit = [];
  const record = (kind, name, actor, reference) => audit.push({ sequence: audit.length + 1, kind, name, actor, reference, at: now() });
  const rejectValue = (input) => input && ("value" in input || "secret" in input || secretLikeContent(input));
  return {
    mode: "reference-only-managed-secret-adapter-candidate",
    register(input = {}) {
      if (!REQUIRED_SECRET_NAMES.includes(input.name) || !validSecretRef(input.reference) || !validId(input.requestedBy) || rejectValue(input)) {
        return { ok: false, code: "invalid_reference_only_registration" };
      }
      if (records.has(input.name)) return { ok: false, code: "secret_reference_exists" };
      const item = { name: input.name, reference: input.reference, status: "active", version: 1, requestedBy: input.requestedBy };
      records.set(input.name, item);
      record("registered", input.name, input.requestedBy, input.reference);
      return { ok: true, record: clone(item), value: "redacted" };
    },
    rotate(input = {}) {
      const item = records.get(input.name);
      if (!item || item.status !== "active" || !validSecretRef(input.reference) || !validId(input.approvedBy) || rejectValue(input)) {
        return { ok: false, code: "rotation_not_allowed" };
      }
      if (input.approvedBy === item.requestedBy) return { ok: false, code: "maker_checker_required" };
      item.reference = input.reference;
      item.version += 1;
      item.rotatedBy = input.approvedBy;
      record("rotated", input.name, input.approvedBy, input.reference);
      return { ok: true, record: clone(item), value: "redacted" };
    },
    revoke(input = {}) {
      const item = records.get(input.name);
      if (!item || item.status !== "active" || !validId(input.revokedBy)) return { ok: false, code: "active_reference_required" };
      item.status = "revoked";
      item.revokedBy = input.revokedBy;
      record("revoked", input.name, input.revokedBy, item.reference);
      return { ok: true, record: clone(item), value: "redacted" };
    },
    resolve(name) {
      const item = records.get(name);
      return item?.status === "active"
        ? { ok: true, name, reference: item.reference, handle: `managed-handle://${digest(item)}`, value: "redacted", exportable: false }
        : { ok: false, code: "active_reference_not_found" };
    },
    report() {
      return {
        mode: "reference-only-managed-secret-adapter-candidate",
        records: [...records.values()].map(clone),
        audit: clone(audit),
        values: "redacted",
        managedSecretStore: null,
        productionCredentials: false
      };
    }
  };
}

export function evaluateManagedSecretStoreAdapterEvidence(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "reference-only-managed-secret-adapter-candidate") violations.push("reference-only adapter candidate mode is required");
  for (const key of ["registrationVerified", "rotationVerified", "revocationVerified", "makerCheckerVerified", "redactionVerified", "auditVerified"]) {
    if (input[key] !== true) violations.push(`${key} is required`);
  }
  if (input.managedSecretStore !== null) violations.push("real managed secret store must remain unbound");
  return evaluation("managed-secret-store-adapter-evidence", input, violations, {
    adapterReady: violations.length === 0,
    managedSecretStore: null,
    productionCredentials: false,
    valuesExposed: false
  });
}

function safeSyntheticRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return !Object.keys(value).some((key) => /email|phone|address|participant|full.?name|user.?name/i.test(key));
}

export function createDurableDatabaseAdapterCandidate({ schemaVersion = 1 } = {}) {
  let revision = 0;
  let tables = { sources: {}, reviewQueue: {}, reviewAudit: {}, consentEvents: {} };
  const receipts = new Map();
  const checkpoints = new Map();
  const snapshot = () => clone({ schemaVersion, revision, tables });
  return {
    mode: "transactional-memory-database-adapter-candidate",
    transact(input = {}) {
      if (!/^txn-[a-z0-9-]{4,80}$/.test(input.transactionId || "")) return { ok: false, code: "invalid_transaction_id" };
      if (receipts.has(input.transactionId)) return { ...clone(receipts.get(input.transactionId)), replayed: true };
      if (input.expectedRevision !== revision) return { ok: false, code: "revision_conflict", revision };
      if (!Array.isArray(input.operations) || !input.operations.length) return { ok: false, code: "operations_required" };
      const before = snapshot();
      try {
        for (const operation of input.operations) {
          if (!(operation.table in tables) || !/^[a-z][a-z0-9-]{2,80}$/.test(operation.id || "")) throw new Error("invalid_operation_target");
          if (operation.kind === "put") {
            if (!safeSyntheticRecord(operation.value)) throw new Error("synthetic_non_personal_record_required");
            tables[operation.table][operation.id] = clone(operation.value);
          } else if (operation.kind === "delete") {
            delete tables[operation.table][operation.id];
          } else {
            throw new Error("unsupported_operation");
          }
        }
        revision += 1;
        const receipt = { ok: true, transactionId: input.transactionId, revision, checksum: digest(snapshot()), replayed: false };
        receipts.set(input.transactionId, receipt);
        return clone(receipt);
      } catch (error) {
        ({ schemaVersion, revision, tables } = before);
        return { ok: false, code: "transaction_rolled_back", message: error.message, revision };
      }
    },
    checkpoint(input = {}) {
      if (!/^checkpoint-[a-z0-9-]{4,80}$/.test(input.checkpointId || "")) return { ok: false, code: "invalid_checkpoint_id" };
      const data = snapshot();
      checkpoints.set(input.checkpointId, data);
      return { ok: true, checkpointId: input.checkpointId, revision, checksum: digest(data), durableProvider: null };
    },
    restore(checkpointId) {
      const data = checkpoints.get(checkpointId);
      if (!data) return { ok: false, code: "checkpoint_not_found" };
      ({ schemaVersion, revision, tables } = clone(data));
      return { ok: true, checkpointId, revision, checksum: digest(snapshot()), durableProvider: null };
    },
    inspect() {
      return {
        ...snapshot(),
        receiptCount: receipts.size,
        checkpointCount: checkpoints.size,
        checksum: digest(snapshot()),
        durableProvider: null,
        productionData: false
      };
    }
  };
}

export function evaluateDurableDatabaseAdapterEvidence(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "transactional-memory-database-adapter-candidate") violations.push("transactional memory adapter candidate mode is required");
  for (const key of ["transactionVerified", "idempotencyVerified", "conflictVerified", "rollbackVerified", "checkpointVerified", "restoreVerified"]) {
    if (input[key] !== true) violations.push(`${key} is required`);
  }
  if (input.durableProvider !== null) violations.push("real durable database provider must remain unbound");
  return evaluation("durable-database-adapter-evidence", input, violations, {
    adapterReady: violations.length === 0,
    durableProvider: null,
    productionData: false
  });
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

export function createExternalReviewerIdentityCandidate({
  issuer = "https://identity.vedapath.invalid",
  audience = "vedapath-private-pilot",
  nowSeconds = () => Math.floor(Date.now() / 1000)
} = {}) {
  const fixtureKey = "vedapath-fixture-identity-key-not-for-production";
  const revoked = new Set();
  const audit = [];
  const sign = (message) => createHmac("sha256", fixtureKey).update(message).digest("base64url");
  return {
    mode: "signed-external-identity-adapter-candidate",
    issueFixtureToken({ subject, role = "reviewer", expiresIn = 300, tokenId } = {}) {
      if (!validId(subject) || role !== "reviewer" || !validId(tokenId) || expiresIn < 30 || expiresIn > 900) throw new Error("invalid fixture identity claim");
      const header = encode({ alg: "HS256", typ: "JWT", kid: "fixture-only" });
      const payload = encode({ iss: issuer, aud: audience, sub: subject, role, jti: tokenId, iat: nowSeconds(), exp: nowSeconds() + expiresIn });
      return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
    },
    verify(authorization = "") {
      const token = authorization.replace(/^Bearer\s+/i, "");
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      try {
        const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`));
        const supplied = Buffer.from(parts[2]);
        if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
        const claim = decode(parts[1]);
        if (claim.iss !== issuer || claim.aud !== audience || claim.role !== "reviewer") return null;
        if (!validId(claim.sub) || !validId(claim.jti) || claim.exp <= nowSeconds() || revoked.has(claim.jti)) return null;
        return { id: claim.sub, role: claim.role, tokenId: claim.jti, expiresAt: claim.exp };
      } catch {
        return null;
      }
    },
    revoke(tokenId, revokedBy) {
      if (!validId(tokenId) || !validId(revokedBy)) return { ok: false, code: "invalid_revocation" };
      revoked.add(tokenId);
      audit.push({ sequence: audit.length + 1, kind: "revoked", tokenId, revokedBy });
      return { ok: true, tokenId };
    },
    report() {
      return { mode: "signed-external-identity-adapter-candidate", issuer, audience, revoked: revoked.size, audit: clone(audit), externalIdentityProvider: null, realAccounts: false };
    }
  };
}

export function evaluateExternalReviewerIdentityEvidence(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "signed-external-identity-adapter-candidate") violations.push("signed external identity adapter candidate mode is required");
  for (const key of ["signatureVerified", "issuerAudienceVerified", "expiryVerified", "roleVerified", "revocationVerified", "failClosedVerified"]) {
    if (input[key] !== true) violations.push(`${key} is required`);
  }
  if (input.externalIdentityProvider !== null) violations.push("real external identity provider must remain unbound");
  return evaluation("external-reviewer-identity-evidence", input, violations, {
    adapterReady: violations.length === 0,
    externalIdentityProvider: null,
    realAccounts: false
  });
}

export function evaluateIntegratedHostedActivationGate(input = {}) {
  const violations = closedBoundaryViolations(input);
  const required = ["deploymentReadiness", "founderDecision", "manifestDryRun", "secretStoreAdapter", "databaseAdapter", "externalIdentity"];
  for (const key of required) {
    if (input.evidence?.[key]?.approved !== true) violations.push(`${key} evidence is not approved`);
  }
  if (input.evidence?.founderDecision?.implementationPreparationAuthorized !== true) violations.push("founder implementation-preparation authorization is required");
  if (input.evidence?.manifestDryRun?.dryRunReady !== true || input.evidence?.manifestDryRun?.applied !== false) violations.push("unapplied provider manifest dry run is required");
  if (input.evidence?.secretStoreAdapter?.managedSecretStore !== null) violations.push("managed secret store must remain unbound");
  if (input.evidence?.databaseAdapter?.durableProvider !== null) violations.push("durable provider must remain unbound");
  if (input.evidence?.externalIdentity?.externalIdentityProvider !== null) violations.push("external identity provider must remain unbound");
  const approved = violations.length === 0;
  return evaluation("integrated-hosted-activation-gate", input, violations, {
    decision: approved ? "implementation-candidate-ready-activation-blocked" : "rework",
    implementationCandidateReady: approved,
    privateDemoReady: approved,
    hostedPilotActivatable: false,
    deploymentAuthorized: false,
    publicLaunchReady: false,
    blockers: [
      "bind a reviewed provider account and residency region",
      "bind a managed secret store without exposing values",
      "bind and operate a durable encrypted database",
      "bind an external identity provider with reviewer operations",
      "complete production security, privacy, legal, support, and incident authorization"
    ],
    nextAction: approved ? "Founder may choose one production implementation slice; activation and deployment remain denied." : "Repair the missing evidence before implementation review."
  });
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

export function createHostedActivationApp({ baseApp, identityVerifier, evidence } = {}) {
  if (!baseApp || typeof baseApp.handle !== "function") throw new Error("base deployment-readiness app is required");
  if (!identityVerifier || typeof identityVerifier.verify !== "function") throw new Error("external identity candidate verifier is required");
  const safeEvidence = clone(evidence || {});
  return {
    boundary: HOSTED_ACTIVATION_BOUNDARY,
    async handle(request) {
      const url = new URL(request.url);
      if (request.method === "GET" && url.pathname === "/v1/activation/health") {
        return jsonResponse(200, { ok: true, service: "vedapath-hosted-activation-candidate", providerBound: false, productionData: false, telemetryEnabled: false, deploymentAuthorized: false, publicLaunch: false });
      }
      if (url.pathname.startsWith("/v1/activation/")) {
        const actor = identityVerifier.verify(request.headers.get("authorization") || "");
        if (!actor) return jsonResponse(401, { code: "signed_external_identity_required" });
        if (actor.role !== "reviewer") return jsonResponse(403, { code: "reviewer_required" });
        if (request.method === "POST" && url.pathname === "/v1/activation/attempt") {
          return jsonResponse(403, { code: "hosted_activation_not_authorized", hostedPilotActivatable: false, deploymentAuthorized: false, publicLaunch: false, boundary: HOSTED_ACTIVATION_BOUNDARY });
        }
        if (request.method !== "GET") return jsonResponse(405, { code: "method_not_allowed" });
        const keyByPath = {
          "/v1/activation/readiness": "gate",
          "/v1/activation/founder-decision": "founderDecision",
          "/v1/activation/manifest": "manifestDryRun",
          "/v1/activation/secrets": "secretStoreAdapter",
          "/v1/activation/database": "databaseAdapter",
          "/v1/activation/identity": "externalIdentity"
        };
        const key = keyByPath[url.pathname];
        if (!key) return jsonResponse(404, { code: "not_found" });
        return jsonResponse(200, {
          evidence: clone(safeEvidence[key] || null),
          reviewer: actor.id,
          secretsExposed: false,
          productionData: false,
          hostedPilotActivatable: false,
          deploymentAuthorized: false,
          publicLaunch: false,
          boundary: HOSTED_ACTIVATION_BOUNDARY
        });
      }
      return baseApp.handle(request);
    }
  };
}

export function hostedActivationPacket(label, result) {
  return {
    label,
    approved: Boolean(result?.approved),
    digest: result?.digest || null,
    violations: clone(result?.violations || []),
    boundary: result?.boundary || HOSTED_ACTIVATION_BOUNDARY
  };
}
