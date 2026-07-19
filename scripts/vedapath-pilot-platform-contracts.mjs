import { createHmac, timingSafeEqual } from "node:crypto";

export const PILOT_PLATFORM_BOUNDARY = "Private-pilot platform candidate only; provider and region binding, production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.";

const ROLES = new Set(["reviewer", "participant"]);
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
  return createHmac("sha256", "vedapath-candidate-digest-v1")
    .update(JSON.stringify(stable(value)))
    .digest("hex")
    .slice(0, 20);
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
  return {
    kind,
    approved: violations.length === 0,
    violations,
    digest: digest({ kind, input }),
    boundary: PILOT_PLATFORM_BOUNDARY,
    ...detail
  };
}

export function evaluateProviderRegionSelectionGate(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (!["hold", "rework", "recommend-candidate"].includes(input.decision)) {
    violations.push("decision must be hold, rework, or recommend-candidate");
  }
  if (!/^[a-z][a-z0-9-]{2,60}$/.test(input.providerCandidate || "")) {
    violations.push("provider candidate requires a stable identifier");
  }
  if (!/^[a-z][a-z0-9-]{2,60}$/.test(input.regionCandidate || "")) {
    violations.push("region candidate requires a stable identifier");
  }
  const evidence = input.evidence || {};
  ["dataResidency", "rightsReview", "privacyReview", "securityReview", "rollbackTest", "exitPlan"].forEach((key) => {
    if (evidence[key] !== true) violations.push(`missing ${key} evidence`);
  });
  if (!Number.isFinite(input.monthlyCostCap) || input.monthlyCostCap <= 0) {
    violations.push("a positive monthly cost cap is required");
  }
  if (input.decision === "recommend-candidate" && violations.length) {
    violations.push("candidate recommendation requires complete evidence");
  }
  return evaluation("provider-region-selection-gate", input, [...new Set(violations)], {
    recommendation: violations.length === 0 && input.decision === "recommend-candidate"
      ? { providerCandidate: input.providerCandidate, regionCandidate: input.regionCandidate, operationalBinding: false }
      : null,
    selectedProvider: null,
    selectedRegion: null,
    operationalBinding: false
  });
}

export function evaluateHostedDeploymentAdapterCandidate(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.interface !== "fetch-request-response") violations.push("adapter must use the fetch request/response interface");
  if (input.target !== "provider-neutral") violations.push("adapter target must remain provider-neutral");
  if (input.bindingMode !== "references-only") violations.push("bindings must remain references-only");
  if (!input.noStore) violations.push("adapter responses must remain no-store");
  if (!input.failClosed) violations.push("adapter must fail closed");
  return evaluation("hosted-deployment-adapter-candidate", input, violations, {
    deployable: false,
    adapterReady: violations.length === 0
  });
}

export function createHostedDeploymentAdapter({ app, bindingRefs = {}, target = "provider-neutral" } = {}) {
  if (!app || typeof app.handle !== "function") throw new Error("hosted app handle is required");
  for (const [key, value] of Object.entries(bindingRefs)) {
    if (!/^[a-z][A-Za-z0-9_]{2,50}$/.test(key) || !/^binding:\/\/[A-Z][A-Z0-9_]{2,80}$/.test(value)) {
      throw new Error(`unsafe binding reference: ${key}`);
    }
  }
  return {
    target,
    describe() {
      return {
        target,
        interface: "fetch-request-response",
        bindingNames: Object.keys(bindingRefs).sort(),
        bindingValues: "redacted",
        deploymentAuthorized: false,
        boundary: PILOT_PLATFORM_BOUNDARY
      };
    },
    async fetch(request) {
      if (!(request instanceof Request)) {
        return new Response(JSON.stringify({ code: "request_required" }), {
          status: 400,
          headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
        });
      }
      const response = await app.handle(request);
      const headers = new Headers(response.headers);
      headers.set("cache-control", "no-store");
      headers.set("x-vedapath-adapter", "provider-neutral-candidate");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
  };
}

function emptyDatabase() {
  return {
    schemaVersion: 0,
    tables: Object.fromEntries(REQUIRED_TABLES.map((table) => [table, []])),
    migrations: []
  };
}

function validateDatabase(state) {
  if (!Number.isInteger(state.schemaVersion) || state.schemaVersion < 0) throw new Error("invalid schema version");
  for (const table of REQUIRED_TABLES) {
    if (!Array.isArray(state.tables?.[table])) throw new Error(`missing table ${table}`);
  }
  const sourceIds = new Set(state.tables.sources.map((record) => record.id));
  for (const ticket of state.tables.reviewQueue) {
    if (!sourceIds.has(ticket.sourceId)) throw new Error(`queue source missing: ${ticket.sourceId}`);
  }
  return true;
}

export function createTransactionalCandidateStore(seed = emptyDatabase()) {
  let state = clone(seed);
  validateDatabase(state);
  return {
    persistence: "transactional-memory-candidate",
    snapshot() {
      return clone(state);
    },
    integrity() {
      return digest(state);
    },
    transaction(mutator) {
      const before = clone(state);
      const draft = clone(state);
      try {
        const value = mutator(draft);
        validateDatabase(draft);
        state = draft;
        return { ok: true, value: clone(value), integrity: digest(state) };
      } catch (error) {
        state = before;
        return { ok: false, code: "transaction_rolled_back", message: error.message, integrity: digest(state) };
      }
    },
    restore(snapshot) {
      const candidate = clone(snapshot);
      validateDatabase(candidate);
      state = candidate;
      return { ok: true, integrity: digest(state) };
    }
  };
}

export function planDurableStorageMigration({ migrationId, sources = [], reviewQueue = [], reviewAudit = [], consentEvents = [] } = {}) {
  if (!/^migration-[a-z0-9-]{4,80}$/.test(migrationId || "")) throw new Error("stable migrationId is required");
  const snapshot = { sources, reviewQueue, reviewAudit, consentEvents };
  for (const table of REQUIRED_TABLES) {
    if (!Array.isArray(snapshot[table])) throw new Error(`${table} must be an array`);
  }
  const plan = {
    migrationId,
    fromSchema: 0,
    toSchema: 1,
    tables: REQUIRED_TABLES,
    counts: Object.fromEntries(REQUIRED_TABLES.map((table) => [table, snapshot[table].length])),
    snapshot: clone(snapshot),
    dryRun: true,
    providerBinding: false,
    regionBinding: false
  };
  return { ...plan, checksum: digest(plan) };
}

export function executeDurableStorageMigration({ store, plan, simulateFailureAt = "" } = {}) {
  if (!store || typeof store.transaction !== "function") throw new Error("transactional store is required");
  if (!plan || plan.checksum !== digest({ ...plan, checksum: undefined })) {
    const copy = clone(plan || {});
    delete copy.checksum;
    if (!plan || plan.checksum !== digest(copy)) throw new Error("migration checksum mismatch");
  }
  const current = store.snapshot();
  if (current.migrations.some((migration) => migration.id === plan.migrationId)) {
    return { ok: true, replayed: true, schemaVersion: current.schemaVersion, integrity: store.integrity() };
  }
  const result = store.transaction((draft) => {
    for (const table of REQUIRED_TABLES) {
      draft.tables[table] = clone(plan.snapshot[table]);
      if (simulateFailureAt === table) throw new Error(`simulated failure at ${table}`);
    }
    draft.schemaVersion = plan.toSchema;
    draft.migrations.push({ id: plan.migrationId, checksum: plan.checksum, toSchema: plan.toSchema });
    return { counts: clone(plan.counts), schemaVersion: draft.schemaVersion };
  });
  return { ...result, replayed: false, schemaVersion: store.snapshot().schemaVersion };
}

export function evaluateDurableStorageMigrationCandidate(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.schemaVersion !== 1) violations.push("candidate schema version must be 1");
  if (!input.transactional) violations.push("transactional migration is required");
  if (!input.idempotent) violations.push("idempotent migration is required");
  if (!input.integrityChecked) violations.push("integrity check is required");
  if (!input.rollbackTested) violations.push("rollback test is required");
  if (input.persistence !== "transactional-memory-candidate") violations.push("real durable storage must remain unbound");
  return evaluation("durable-storage-migration-candidate", input, violations, {
    durableProvider: null,
    productionCutover: false
  });
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signature(secret, value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSignedIdentityCandidate({ secret, issuer, audience, now = () => Math.floor(Date.now() / 1000) } = {}) {
  if (typeof secret !== "string" || secret.length < 32) throw new Error("ephemeral signing secret must be at least 32 characters");
  if (!issuer || !audience) throw new Error("issuer and audience are required");
  return {
    mode: "signed-fixture-claims",
    describe() {
      return { mode: "signed-fixture-claims", issuer, audience, externalProvider: null, secret: "redacted" };
    },
    issue({ subject, role, expiresIn = 300, tokenId = `fixture-${now()}` } = {}) {
      if (!subject || !ROLES.has(role)) throw new Error("valid subject and role are required");
      const header = { alg: "HS256", typ: "VPS1" };
      const payload = { iss: issuer, aud: audience, sub: subject, role, iat: now(), exp: now() + expiresIn, jti: tokenId };
      const unsigned = `${encode(header)}.${encode(payload)}`;
      return `${unsigned}.${signature(secret, unsigned)}`;
    },
    verify(header = "") {
      const match = /^Bearer\s+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(header);
      if (!match) return null;
      const [encodedHeader, encodedPayload, supplied] = match[1].split(".");
      const unsigned = `${encodedHeader}.${encodedPayload}`;
      const expected = signature(secret, unsigned);
      const suppliedBytes = Buffer.from(supplied);
      const expectedBytes = Buffer.from(expected);
      if (suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) return null;
      try {
        const tokenHeader = decode(encodedHeader);
        const claims = decode(encodedPayload);
        if (tokenHeader.alg !== "HS256" || tokenHeader.typ !== "VPS1") return null;
        if (claims.iss !== issuer || claims.aud !== audience || claims.exp <= now() || claims.iat > now() + 30) return null;
        if (!claims.sub || !claims.jti || !ROLES.has(claims.role)) return null;
        return { id: claims.sub, subject: claims.sub, role: claims.role, tokenId: claims.jti, expiresAt: claims.exp };
      } catch {
        return null;
      }
    }
  };
}

export function evaluateProductionIdentityCandidate(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "signed-fixture-claims") violations.push("signed fixture claims are required");
  if (!input.expiryEnforced) violations.push("token expiry must be enforced");
  if (!input.issuerAudienceEnforced) violations.push("issuer and audience must be enforced");
  if (!input.roleEnforced) violations.push("reviewer and participant roles must be enforced");
  if (!input.signatureEnforced) violations.push("signature verification must be enforced");
  if (input.externalIdentityProvider !== null) violations.push("external identity provider must remain unbound");
  return evaluation("production-identity-integration-candidate", input, violations, {
    productionIdentity: false,
    externalIdentityProvider: null
  });
}

const OPS_ALLOWED = new Set(["kind", "status", "route", "requestId", "latencyBucket", "code"]);
const OPS_FORBIDDEN = /content|answer|excerpt|question|subject|token|authorization|email|name|note/i;

export function createRedactedOperationsRecorder({ now = () => new Date().toISOString(), maxEvents = 200 } = {}) {
  const events = [];
  let incident = null;
  function record(input = {}) {
    const event = {};
    for (const [key, value] of Object.entries(input)) {
      if (OPS_ALLOWED.has(key) && !OPS_FORBIDDEN.test(key)) event[key] = String(value).slice(0, 120);
    }
    event.sequence = events.length + 1;
    event.at = now();
    events.push(event);
    if (events.length > maxEvents) events.shift();
    return clone(event);
  }
  return {
    mode: "redacted-technical-operations",
    record,
    openIncident({ code, severity = "medium" } = {}) {
      if (!/^[a-z][a-z0-9_]{2,60}$/.test(code || "") || !["low", "medium", "high"].includes(severity)) {
        return { ok: false, code: "invalid_incident" };
      }
      incident = { code, severity, openedAt: now(), status: "open" };
      record({ kind: "incident", status: "open", code });
      return { ok: true, incident: clone(incident) };
    },
    closeIncident() {
      if (!incident) return { ok: false, code: "incident_not_open" };
      incident.status = "closed";
      incident.closedAt = now();
      record({ kind: "incident", status: "closed", code: incident.code });
      return { ok: true, incident: clone(incident) };
    },
    report() {
      const statusCounts = {};
      events.forEach((event) => { statusCounts[event.status || "unknown"] = (statusCounts[event.status || "unknown"] || 0) + 1; });
      return {
        healthy: !incident || incident.status === "closed",
        eventCount: events.length,
        statusCounts,
        incident: clone(incident),
        events: clone(events),
        participantContent: false,
        behavioralTelemetry: false
      };
    }
  };
}

export function evaluatePrivatePilotOperationsGate(input = {}) {
  const violations = closedBoundaryViolations(input);
  if (input.mode !== "redacted-technical-operations") violations.push("redacted technical operations mode is required");
  if (!input.healthChecks) violations.push("health checks are required");
  if (!input.incidentLifecycle) violations.push("incident lifecycle is required");
  if (!input.contentExcluded) violations.push("participant content must be excluded");
  if (!input.reviewerOnly) violations.push("operations detail must be reviewer-only");
  if (!input.rollbackReady) violations.push("rollback evidence is required");
  return evaluation("private-pilot-operations-observability-gate", input, violations, {
    privatePilotOperational: violations.length === 0,
    publicLaunchReady: false
  });
}

function platformJson(status, body) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
  });
}

export function createPilotPlatformApp({ adapter, identityVerifier, operations = createRedactedOperationsRecorder(), featureLevel = 5 } = {}) {
  if (!adapter || typeof adapter.fetch !== "function") throw new Error("deployment adapter is required");
  if (!identityVerifier || typeof identityVerifier.verify !== "function") throw new Error("identity verifier is required");
  return {
    boundary: PILOT_PLATFORM_BOUNDARY,
    operations,
    async handle(request) {
      const url = new URL(request.url);
      if (request.method === "GET" && url.pathname === "/v1/platform/readiness") {
        return platformJson(200, {
          ok: true,
          featureLevel,
          adapter: adapter.describe(),
          identity: identityVerifier.describe(),
          operationsMode: operations.mode,
          providerBound: false,
          regionBound: false,
          deploymentAuthorized: false,
          publicLaunch: false,
          boundary: PILOT_PLATFORM_BOUNDARY
        });
      }
      if (featureLevel >= 5 && url.pathname === "/v1/ops/readiness") {
        if (request.method !== "GET") return platformJson(405, { code: "method_not_allowed" });
        const actor = identityVerifier.verify(request.headers.get("authorization") || "");
        if (!actor) return platformJson(401, { code: "signed_identity_required" });
        if (actor.role !== "reviewer") return platformJson(403, { code: "reviewer_required" });
        return platformJson(200, { ...operations.report(), reviewer: actor.id, publicLaunch: false, behavioralTelemetry: false });
      }
      if (featureLevel >= 5 && url.pathname === "/v1/ops/incidents") {
        if (request.method !== "POST") return platformJson(405, { code: "method_not_allowed" });
        const actor = identityVerifier.verify(request.headers.get("authorization") || "");
        if (!actor) return platformJson(401, { code: "signed_identity_required" });
        if (actor.role !== "reviewer") return platformJson(403, { code: "reviewer_required" });
        let body;
        try { body = await request.json(); } catch { return platformJson(400, { code: "invalid_json" }); }
        const result = body.action === "close" ? operations.closeIncident() : operations.openIncident(body);
        return platformJson(result.ok ? 200 : 400, result);
      }
      const started = Date.now();
      const response = await adapter.fetch(request);
      operations.record({
        kind: "request",
        status: response.status,
        route: url.pathname.replace(/[A-Za-z0-9_-]{20,}/g, ":id"),
        requestId: response.headers.get("x-request-id") || "adapter",
        latencyBucket: Date.now() - started < 100 ? "under-100ms" : "100ms-plus"
      });
      return response;
    }
  };
}

export function pilotPlatformPacket(label, result) {
  return {
    label,
    approved: Boolean(result.approved),
    digest: result.digest,
    violations: clone(result.violations || []),
    boundary: result.boundary || PILOT_PLATFORM_BOUNDARY
  };
}
