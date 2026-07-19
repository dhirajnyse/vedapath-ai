import { createHash } from "node:crypto";

export const DEPLOYMENT_READINESS_BOUNDARY = "Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.";

const REQUIRED_BINDING_EVIDENCE = [
  "dataResidency",
  "rightsReview",
  "privacyReview",
  "securityReview",
  "rollbackTest",
  "exitPlan",
  "budgetApproved",
  "supportModel"
];

const REQUIRED_BINDING_REFS = ["runtime", "storage", "identity", "secrets"];
const REQUIRED_SECRET_REFS = ["SOURCE_STORE", "REVIEW_STORE", "IDENTITY_VERIFIER", "SESSION_SIGNING_KEY"];
const REQUIRED_TABLES = ["sources", "reviewQueue", "reviewAudit", "consentEvents"];

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

function closedBoundaryViolations(input = {}) {
  const violations = [];
  if (input.providerBound) violations.push("provider binding must remain false");
  if (input.regionBound) violations.push("region binding must remain false");
  if (input.deploymentAuthorized) violations.push("deployment authorization must remain false");
  if (input.productionCredentials) violations.push("production credentials must remain absent");
  if (input.productionData) violations.push("production data must remain absent");
  if (input.telemetryEnabled) violations.push("behavioral telemetry must remain disabled");
  if (input.liveAi) violations.push("live AI must remain disabled");
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
    boundary: DEPLOYMENT_READINESS_BOUNDARY,
    ...detail
  };
}

function validCandidate(value) {
  return /^[a-z][a-z0-9-]{2,60}$/.test(value || "");
}

function validBindingReference(value) {
  return /^binding:\/\/[A-Z][A-Z0-9_]{2,80}$/.test(value || "");
}

function validSecretReference(value) {
  return /^secret:\/\/[A-Z][A-Z0-9_]{2,80}$/.test(value || "");
}

export function evaluateHostedProviderBindingDecision(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (!["hold", "rework", "approve-controlled-implementation"].includes(input.decision)) {
    violations.push("decision must be hold, rework, or approve-controlled-implementation");
  }
  if (!validCandidate(input.providerCandidate)) violations.push("provider candidate requires a stable identifier");
  if (!validCandidate(input.regionCandidate)) violations.push("region candidate requires a stable identifier");
  if (!validCandidate(input.runtimeProfile)) violations.push("runtime profile requires a stable identifier");
  if (!validCandidate(input.decidedBy) || !validCandidate(input.reviewedBy)) {
    violations.push("decision maker and reviewer identifiers are required");
  } else if (input.decidedBy === input.reviewedBy) {
    violations.push("decision maker and reviewer must be different people");
  }
  for (const key of REQUIRED_BINDING_EVIDENCE) {
    if (input.evidence?.[key] !== true) violations.push(`missing ${key} evidence`);
  }
  for (const key of REQUIRED_BINDING_REFS) {
    if (!validBindingReference(input.bindingRefs?.[key])) violations.push(`invalid ${key} binding reference`);
  }
  if (input.decision === "approve-controlled-implementation" && violations.length) {
    violations.push("controlled implementation approval requires complete reviewed evidence");
  }

  const manifest = {
    manifestVersion: 1,
    providerCandidate: input.providerCandidate || null,
    regionCandidate: input.regionCandidate || null,
    runtimeProfile: input.runtimeProfile || null,
    bindingRefs: clone(input.bindingRefs || {}),
    evidence: Object.fromEntries(REQUIRED_BINDING_EVIDENCE.map((key) => [key, input.evidence?.[key] === true])),
    decidedBy: input.decidedBy || null,
    reviewedBy: input.reviewedBy || null,
    operationalBinding: false,
    deploymentAuthorized: false
  };
  const manifestChecksum = digest(manifest);
  const approved = violations.length === 0 && input.decision === "approve-controlled-implementation";
  return evaluation("hosted-provider-binding-decision", input, violations, {
    decision: approved ? "approved-for-controlled-implementation" : input.decision === "hold" ? "hold" : "rework",
    manifest: approved ? manifest : null,
    manifestChecksum: approved ? manifestChecksum : null,
    selectedProvider: null,
    selectedRegion: null,
    operationalBinding: false,
    deployable: false
  });
}

function containsSecretLikeKey(value) {
  if (!value || typeof value !== "object") return false;
  return Object.keys(value).some((key) => /secret|token|password|privateKey|signingKey/i.test(key));
}

export function evaluateManagedSecretsEnvironmentContract(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.profile !== "private-pilot") violations.push("environment profile must be private-pilot");
  if (!validCandidate(input.serviceName)) violations.push("service name requires a stable identifier");
  if (!/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9._~!$&'()*+,;=:@%\/-]*)?$/.test(input.publicOrigin || "")) {
    violations.push("public origin must be an https URL");
  }
  if (containsSecretLikeKey(input.publicConfig)) violations.push("public config must not contain secret-like keys");
  if (input.inlineSecrets && Object.keys(input.inlineSecrets).length) violations.push("inline secret values are forbidden");
  for (const key of REQUIRED_SECRET_REFS) {
    if (!validSecretReference(input.secretRefs?.[key])) violations.push(`invalid or missing ${key} secret reference`);
  }
  const unknownRefs = Object.keys(input.secretRefs || {}).filter((key) => !REQUIRED_SECRET_REFS.includes(key));
  if (unknownRefs.length) violations.push(`unknown secret references: ${unknownRefs.sort().join(", ")}`);

  return evaluation("managed-secrets-environment-contract", input, violations, {
    profile: input.profile || null,
    publicConfig: clone(input.publicConfig || {}),
    secretReferences: Object.fromEntries(REQUIRED_SECRET_REFS.map((key) => [key, input.secretRefs?.[key] || null])),
    requiredReferences: [...REQUIRED_SECRET_REFS],
    valuesExposed: false,
    managedEnvironmentBound: false,
    productionCredentials: false
  });
}

export function createFixtureSecretResolver({ vault = {} } = {}) {
  const safeVault = new Map();
  for (const [reference, value] of Object.entries(vault)) {
    if (!validSecretReference(reference)) throw new Error(`invalid fixture secret reference: ${reference}`);
    if (typeof value !== "string" || value.length < 16) throw new Error(`fixture secret ${reference} must be at least 16 characters`);
    safeVault.set(reference, value);
  }
  const handles = new Map();
  return {
    mode: "fixture-secret-resolver",
    resolve(reference) {
      if (!validSecretReference(reference)) return { ok: false, code: "invalid_secret_reference" };
      if (!safeVault.has(reference)) return { ok: false, code: "secret_reference_missing" };
      const handle = `handle://${digest({ reference, value: safeVault.get(reference) })}`;
      handles.set(handle, reference);
      return { ok: true, reference, handle, value: "redacted", exportable: false };
    },
    inspect(handle) {
      return handles.has(handle)
        ? { ok: true, reference: handles.get(handle), value: "redacted", exportable: false }
        : { ok: false, code: "unknown_secret_handle" };
    },
    diagnostics() {
      return {
        mode: "fixture-secret-resolver",
        references: [...safeVault.keys()].sort(),
        resolvedHandles: handles.size,
        values: "redacted",
        managedSecretStore: false
      };
    }
  };
}

function emptyDataset() {
  return Object.fromEntries(REQUIRED_TABLES.map((table) => [table, []]));
}

function normalizeDataset(input = {}) {
  const result = emptyDataset();
  for (const table of REQUIRED_TABLES) {
    if (!Array.isArray(input[table])) throw new Error(`${table} must be an array`);
    result[table] = clone(input[table]);
  }
  const sourceIds = new Set(result.sources.map((record) => record.id));
  for (const ticket of result.reviewQueue) {
    if (!sourceIds.has(ticket.sourceId)) throw new Error(`queue source missing: ${ticket.sourceId}`);
  }
  return result;
}

function datasetCounts(dataset) {
  return Object.fromEntries(REQUIRED_TABLES.map((table) => [table, dataset[table].length]));
}

export function planDurableDatabaseCutover({ cutoverId, sourceDataset } = {}) {
  if (!/^cutover-[a-z0-9-]{4,80}$/.test(cutoverId || "")) throw new Error("stable cutoverId is required");
  const snapshot = normalizeDataset(sourceDataset);
  const plan = {
    planVersion: 1,
    cutoverId,
    sourceSlot: "blue",
    targetSlot: "green",
    sourceDataset: snapshot,
    expectedCounts: datasetCounts(snapshot),
    expectedChecksum: digest(snapshot),
    providerBinding: false,
    productionCutover: false
  };
  return { ...plan, checksum: digest(plan) };
}

export function createDurableDatabaseCutoverRehearsal(seedDataset = emptyDataset()) {
  let state = {
    activeSlot: "blue",
    blue: normalizeDataset(seedDataset),
    green: emptyDataset(),
    runs: []
  };
  const inspect = () => ({
    activeSlot: state.activeSlot,
    counts: { blue: datasetCounts(state.blue), green: datasetCounts(state.green) },
    checksums: { blue: digest(state.blue), green: digest(state.green) },
    runs: clone(state.runs),
    durableProvider: null,
    productionCutover: false
  });
  return {
    mode: "blue-green-memory-rehearsal",
    inspect,
    rehearse(plan, { simulateFailureAt = "" } = {}) {
      const copy = clone(plan || {});
      const suppliedChecksum = copy.checksum;
      delete copy.checksum;
      if (!plan || suppliedChecksum !== digest(copy)) throw new Error("cutover plan checksum mismatch");
      const completed = state.runs.find((run) => run.cutoverId === plan.cutoverId && run.status === "complete");
      if (completed) return { ok: true, replayed: true, parity: true, ...inspect() };
      const before = clone(state);
      try {
        const target = emptyDataset();
        for (const table of REQUIRED_TABLES) {
          target[table] = clone(plan.sourceDataset[table]);
          if (simulateFailureAt === table) throw new Error(`simulated failure at ${table}`);
        }
        normalizeDataset(target);
        const parity = digest(target) === plan.expectedChecksum
          && JSON.stringify(datasetCounts(target)) === JSON.stringify(plan.expectedCounts);
        if (simulateFailureAt === "parity") throw new Error("simulated parity failure");
        if (!parity) throw new Error("cutover parity failed");
        state.green = target;
        state.activeSlot = "green";
        state.runs.push({ cutoverId: plan.cutoverId, status: "complete", checksum: plan.checksum });
        return { ok: true, replayed: false, parity: true, ...inspect() };
      } catch (error) {
        state = before;
        return { ok: false, code: "cutover_rolled_back", message: error.message, parity: false, ...inspect() };
      }
    },
    rollback() {
      state.activeSlot = "blue";
      return { ok: true, restoredSlot: "blue", ...inspect() };
    }
  };
}

export function evaluateDurableDatabaseCutoverRehearsal(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "blue-green-memory-rehearsal") violations.push("blue-green memory rehearsal mode is required");
  if (!input.snapshotVerified) violations.push("snapshot verification is required");
  if (!input.parityVerified) violations.push("count and checksum parity are required");
  if (!input.idempotencyVerified) violations.push("idempotent replay is required");
  if (!input.rollbackVerified) violations.push("rollback verification is required");
  if (input.durableProvider !== null) violations.push("real durable provider must remain unbound");
  return evaluation("durable-database-cutover-rehearsal", input, violations, {
    rehearsalReady: violations.length === 0,
    durableProvider: null,
    productionCutover: false
  });
}

export function createReviewerIdentityProvisioningRehearsal({ now = () => new Date().toISOString() } = {}) {
  const requests = new Map();
  const sessions = new Map();
  const audit = [];
  const record = (kind, requestId, actor) => audit.push({ sequence: audit.length + 1, kind, requestId, actor, at: now() });
  const find = (requestId) => requests.get(requestId);
  return {
    mode: "synthetic-maker-checker-provisioning",
    request({ requestId, subject, requestedBy, role = "reviewer" } = {}) {
      if (!/^provision-[a-z0-9-]{4,80}$/.test(requestId || "") || !validCandidate(subject) || !validCandidate(requestedBy)) {
        return { ok: false, code: "invalid_provisioning_request" };
      }
      if (role !== "reviewer" || requests.has(requestId)) return { ok: false, code: "request_not_allowed" };
      const item = { requestId, subject, requestedBy, role, status: "requested", externalAccount: null };
      requests.set(requestId, item);
      record("requested", requestId, requestedBy);
      return { ok: true, request: clone(item) };
    },
    approve({ requestId, approvedBy } = {}) {
      const item = find(requestId);
      if (!item) return { ok: false, code: "request_not_found" };
      if (!validCandidate(approvedBy) || approvedBy === item.requestedBy) return { ok: false, code: "maker_checker_required" };
      if (item.status !== "requested") return { ok: false, code: "request_not_pending" };
      item.status = "approved";
      item.approvedBy = approvedBy;
      record("approved", requestId, approvedBy);
      return { ok: true, request: clone(item) };
    },
    activate({ requestId, activatedBy } = {}) {
      const item = find(requestId);
      if (!item) return { ok: false, code: "request_not_found" };
      if (item.status !== "approved" || !validCandidate(activatedBy)) return { ok: false, code: "approval_required" };
      item.status = "active";
      item.activatedBy = activatedBy;
      const handle = `session://${digest({ requestId, subject: item.subject, sequence: audit.length + 1 })}`;
      sessions.set(handle, { requestId, subject: item.subject, role: item.role, active: true });
      item.sessionHandle = handle;
      record("activated", requestId, activatedBy);
      return { ok: true, request: clone(item), sessionHandle: handle };
    },
    verifySession(handle) {
      const session = sessions.get(handle);
      return session?.active ? clone(session) : null;
    },
    revoke({ requestId, revokedBy } = {}) {
      const item = find(requestId);
      if (!item || item.status !== "active" || !validCandidate(revokedBy)) return { ok: false, code: "active_request_required" };
      item.status = "revoked";
      item.revokedBy = revokedBy;
      const session = sessions.get(item.sessionHandle);
      if (session) session.active = false;
      record("revoked", requestId, revokedBy);
      return { ok: true, request: clone(item) };
    },
    report() {
      return {
        requests: [...requests.values()].map((item) => ({ ...clone(item), sessionHandle: item.sessionHandle ? "redacted" : null })),
        activeSessions: [...sessions.values()].filter((session) => session.active).length,
        audit: clone(audit),
        externalIdentityProvider: null,
        realAccounts: false
      };
    }
  };
}

export function evaluateReviewerIdentityProvisioningRehearsal(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "synthetic-maker-checker-provisioning") violations.push("synthetic maker-checker provisioning mode is required");
  if (!input.makerCheckerVerified) violations.push("maker-checker approval is required");
  if (!input.leastPrivilegeVerified) violations.push("least-privilege reviewer role is required");
  if (!input.activationVerified) violations.push("activation verification is required");
  if (!input.revocationVerified) violations.push("revocation verification is required");
  if (!input.auditVerified) violations.push("immutable-style audit evidence is required");
  if (input.externalIdentityProvider !== null) violations.push("external identity provider must remain unbound");
  return evaluation("reviewer-identity-provisioning-rehearsal", input, violations, {
    provisioningReady: violations.length === 0,
    externalIdentityProvider: null,
    realAccounts: false
  });
}

export function evaluatePrivatePilotDeploymentReadinessGate(input = {}) {
  const violations = closedBoundaryViolations(input);
  const requiredEvidence = ["bindingDecision", "secretsContract", "cutoverRehearsal", "reviewerProvisioning", "operationsGate"];
  for (const key of requiredEvidence) {
    if (input.evidence?.[key]?.approved !== true) violations.push(`${key} evidence is not approved`);
  }
  if (input.privateDemoChecks !== true) violations.push("private demo checks are required");
  if (input.rollbackDrill !== true) violations.push("rollback drill evidence is required");
  if (input.founderReview !== true) violations.push("founder review evidence is required");
  const approved = violations.length === 0;
  const blockers = [
    "hosted provider account is not bound",
    "managed secret store is not bound",
    "durable database is not bound",
    "external reviewer identity is not bound",
    "production security and privacy operations are not authorized"
  ];
  return evaluation("private-pilot-deployment-readiness-gate", input, violations, {
    decision: approved ? "private-demo-ready-hosted-deployment-blocked" : "rework",
    privateDemoReady: approved,
    hostedPilotDeployable: false,
    deploymentAuthorized: false,
    publicLaunchReady: false,
    blockers,
    nextAction: approved ? "Founder may review the smallest controlled hosted implementation; no deployment permission is granted." : "Repair missing evidence before founder review."
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

export function createDeploymentReadinessApp({ baseApp, identityVerifier, evidence } = {}) {
  if (!baseApp || typeof baseApp.handle !== "function") throw new Error("base pilot platform app is required");
  if (!identityVerifier || typeof identityVerifier.verify !== "function") throw new Error("identity verifier is required");
  const reviewer = (request) => identityVerifier.verify(request.headers.get("authorization") || "");
  const safeEvidence = clone(evidence || {});
  return {
    boundary: DEPLOYMENT_READINESS_BOUNDARY,
    async handle(request) {
      const url = new URL(request.url);
      if (request.method === "GET" && url.pathname === "/v1/deployment/health") {
        return jsonResponse(200, { ok: true, service: "vedapath-deployment-readiness-candidate", participantContent: false, telemetryEnabled: false, publicLaunch: false });
      }
      if (url.pathname.startsWith("/v1/deployment/")) {
        const actor = reviewer(request);
        if (!actor) return jsonResponse(401, { code: "signed_identity_required" });
        if (actor.role !== "reviewer") return jsonResponse(403, { code: "reviewer_required" });
        if (request.method === "POST" && url.pathname === "/v1/deployment/attempt") {
          return jsonResponse(403, { code: "deployment_not_authorized", deploymentAuthorized: false, publicLaunch: false, boundary: DEPLOYMENT_READINESS_BOUNDARY });
        }
        if (request.method !== "GET") return jsonResponse(405, { code: "method_not_allowed" });
        const keyByPath = {
          "/v1/deployment/readiness": "gate",
          "/v1/deployment/binding": "bindingDecision",
          "/v1/deployment/secrets": "secretsContract",
          "/v1/deployment/cutover": "cutoverRehearsal",
          "/v1/deployment/reviewer-identity": "reviewerProvisioning"
        };
        const key = keyByPath[url.pathname];
        if (!key) return jsonResponse(404, { code: "not_found" });
        return jsonResponse(200, {
          evidence: clone(safeEvidence[key] || null),
          reviewer: actor.id,
          participantContent: false,
          secretsExposed: false,
          deploymentAuthorized: false,
          publicLaunch: false,
          boundary: DEPLOYMENT_READINESS_BOUNDARY
        });
      }
      return baseApp.handle(request);
    }
  };
}

export function deploymentReadinessPacket(label, result) {
  return {
    label,
    approved: Boolean(result?.approved),
    digest: result?.digest || null,
    violations: clone(result?.violations || []),
    boundary: result?.boundary || DEPLOYMENT_READINESS_BOUNDARY
  };
}
