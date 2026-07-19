export const HOSTED_CANDIDATE_BOUNDARY = "Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.";

const REQUIRED_SECRET_REFS = [
  "sessionVerifier",
  "reviewStore",
  "consentStore"
];

const ENVIRONMENT_KEYS = new Set([
  "environment",
  "serviceName",
  "publicOrigin",
  "corsAllowlist",
  "secretRefs",
  "vendor",
  "region",
  "persistence",
  "deploymentAuthorized",
  "productionStorage",
  "telemetryEnabled",
  "liveAi",
  "publicLaunch"
]);

const CONSENT_TYPES = new Set([
  "consent.granted",
  "consent.withdrawn",
  "export.requested",
  "deletion.requested"
]);

const QUEUE_TRANSITIONS = new Map([
  ["open", new Set(["claimed"])],
  ["claimed", new Set(["approved", "changes-requested", "open"])],
  ["changes-requested", new Set(["claimed"])]
]);

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function digest(value) {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function commonViolations(input = {}) {
  const violations = [];
  if (input.deploymentAuthorized) violations.push("deployment must remain unauthorized");
  if (input.productionStorage) violations.push("production storage must remain disabled");
  if (input.telemetryEnabled) violations.push("telemetry must remain disabled");
  if (input.liveAi) violations.push("live AI must remain disabled");
  if (input.publicLaunch) violations.push("public launch must remain disabled");
  if (input.vendor && input.vendor !== "not-selected") violations.push("vendor must remain not-selected");
  if (input.region && input.region !== "review-required") violations.push("region must remain review-required");
  return violations;
}

function evaluation(kind, input, violations, detail = {}) {
  return {
    kind,
    approved: violations.length === 0,
    violations,
    digest: digest({ kind, input }),
    boundary: HOSTED_CANDIDATE_BOUNDARY,
    ...detail
  };
}

function isLoopbackOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  } catch {
    return false;
  }
}

function isHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === value;
  } catch {
    return false;
  }
}

function validOrigin(value, environment) {
  return isHttpsOrigin(value) || (environment === "local" && isLoopbackOrigin(value));
}

function validSecretReference(value) {
  return typeof value === "string" && /^binding:\/\/[A-Z][A-Z0-9_]{2,80}$/.test(value);
}

function setOf(value) {
  return new Set(Array.isArray(value) ? value : []);
}

export function evaluateHostedImplementationAuthorization(input = {}) {
  const violations = commonViolations(input);
  const packet = setOf(input.packet);
  const required = [
    "scope:hosted-candidate-only",
    "pattern:edge-worker-relational",
    "frontend:static-pages",
    "secrets:references-only",
    "storage:ephemeral-adapter",
    "rollback:required"
  ];
  required.forEach((item) => {
    if (!packet.has(item)) violations.push(`missing ${item}`);
  });
  if (!new Set(["hold", "rework", "authorize-candidate"]).has(input.decision)) {
    violations.push("decision must be hold, rework, or authorize-candidate");
  }
  if (input.decision === "authorize-candidate" && input.scope !== "hosted-candidate-only") {
    violations.push("candidate authorization requires hosted-candidate-only scope");
  }
  return evaluation("hosted-pilot-implementation-authorization", input, violations, {
    authorizedCapability: violations.length === 0 && input.decision === "authorize-candidate"
      ? "build-and-test-provider-neutral-candidate"
      : "none"
  });
}

export function redactEnvironmentProfile(input = {}) {
  const refs = {};
  for (const key of Object.keys(input.secretRefs || {})) refs[key] = "binding://[configured]";
  return {
    environment: input.environment || null,
    serviceName: input.serviceName || null,
    publicOrigin: input.publicOrigin || null,
    corsAllowlist: clone(input.corsAllowlist || []),
    secretRefs: refs,
    vendor: input.vendor || null,
    region: input.region || null,
    persistence: input.persistence || null,
    deploymentAuthorized: Boolean(input.deploymentAuthorized),
    productionStorage: Boolean(input.productionStorage),
    telemetryEnabled: Boolean(input.telemetryEnabled),
    liveAi: Boolean(input.liveAi),
    publicLaunch: Boolean(input.publicLaunch)
  };
}

export function validateEnvironmentProfile(input = {}) {
  const violations = commonViolations(input);
  for (const key of Object.keys(input)) {
    if (!ENVIRONMENT_KEYS.has(key)) violations.push(`unknown environment key: ${key}`);
  }
  if (!new Set(["local", "preview", "hosted-candidate"]).has(input.environment)) {
    violations.push("environment must be local, preview, or hosted-candidate");
  }
  if (!/^[a-z][a-z0-9-]{2,60}$/.test(input.serviceName || "")) {
    violations.push("serviceName must be a stable lowercase service label");
  }
  if (!validOrigin(input.publicOrigin, input.environment)) {
    violations.push("publicOrigin must be HTTPS, except loopback HTTP in local mode");
  }
  if (!Array.isArray(input.corsAllowlist) || input.corsAllowlist.length < 1) {
    violations.push("corsAllowlist requires at least one explicit origin");
  } else {
    input.corsAllowlist.forEach((origin) => {
      if (!validOrigin(origin, input.environment)) violations.push(`invalid CORS origin: ${origin}`);
    });
  }
  if (input.persistence !== "ephemeral") violations.push("candidate persistence must remain ephemeral");
  if (!input.secretRefs || typeof input.secretRefs !== "object" || Array.isArray(input.secretRefs)) {
    violations.push("secretRefs must be a reference map");
  } else {
    REQUIRED_SECRET_REFS.forEach((key) => {
      if (!validSecretReference(input.secretRefs[key])) violations.push(`missing or unsafe secret reference: ${key}`);
    });
    for (const [key, value] of Object.entries(input.secretRefs)) {
      if (!REQUIRED_SECRET_REFS.includes(key)) violations.push(`unknown secret reference: ${key}`);
      if (!validSecretReference(value)) violations.push(`literal or malformed secret reference: ${key}`);
    }
  }
  const summary = redactEnvironmentProfile(input);
  return evaluation("environment-secret-bootstrap", summary, violations, { summary });
}

export function evaluateHostedSourceApiCandidate(input = {}) {
  const violations = commonViolations(input);
  const routes = setOf(input.routes);
  ["GET /v1/health", "GET /v1/readiness", "GET /v1/sources/:id"].forEach((route) => {
    if (!routes.has(route)) violations.push(`missing route ${route}`);
  });
  if (input.answerGeneration !== false) violations.push("answer generation must remain disabled");
  if (input.mutationRoutes !== 0) violations.push("source mutation routes must remain zero");
  if (!input.explicitNoSource) violations.push("explicit no-source behavior is required");
  if (!input.corsAllowlist) violations.push("explicit CORS allowlist is required");
  if (!input.rateLimit) violations.push("ephemeral rate limiting is required");
  return evaluation("hosted-source-api-candidate", input, violations);
}

export function evaluateReviewerIdentityQueueCandidate(input = {}) {
  const violations = commonViolations(input);
  if (input.identityMode !== "fixture-session-verifier") violations.push("identity must use the fixture session verifier");
  if (!Array.isArray(input.roles) || !input.roles.includes("reviewer")) violations.push("reviewer role is required");
  if (input.persistence !== "ephemeral") violations.push("queue persistence must remain ephemeral");
  if (!input.appendOnlyAudit) violations.push("append-only audit is required");
  if (!input.idempotentTransitions) violations.push("idempotent transitions are required");
  return evaluation("reviewer-identity-queue-candidate", input, violations);
}

export function evaluateConsentLedgerServiceCandidate(input = {}) {
  const violations = commonViolations(input);
  if (input.identityMode !== "fixture-session-verifier") violations.push("participant identity must use the fixture session verifier");
  if (input.persistence !== "ephemeral") violations.push("consent persistence must remain ephemeral");
  if (!input.appendOnly) violations.push("append-only consent events are required");
  if (!input.effectiveProjection) violations.push("effective consent projection is required");
  if (!input.idempotentEvents) violations.push("idempotent consent events are required");
  if (input.telemetryDefault !== "off") violations.push("telemetry must default to off");
  return evaluation("consent-ledger-service-candidate", input, violations);
}

export function createMemoryRateLimiter({ limit = 60, windowMs = 60_000, now = Date.now } = {}) {
  const windows = new Map();
  return {
    take(key = "anonymous") {
      const current = now();
      const state = windows.get(key);
      if (!state || current - state.startedAt >= windowMs) {
        windows.set(key, { startedAt: current, count: 1 });
        return { allowed: true, remaining: Math.max(0, limit - 1), resetAt: current + windowMs };
      }
      state.count += 1;
      return {
        allowed: state.count <= limit,
        remaining: Math.max(0, limit - state.count),
        resetAt: state.startedAt + windowMs
      };
    },
    clear() {
      windows.clear();
    }
  };
}

export function createSourceStore(records = []) {
  const index = new Map(records.map((record) => [record.id, clone(record)]));
  return {
    count() {
      return index.size;
    },
    get(id) {
      const record = index.get(id);
      if (!record) return { ok: false, code: "source_not_found" };
      if (!record.citation || !record.family || record.rightsStatus !== "reviewed-fixture") {
        return { ok: false, code: "source_not_ready" };
      }
      return {
        ok: true,
        source: {
          id: record.id,
          family: record.family,
          citation: record.citation,
          title: record.title,
          excerpt: record.excerpt,
          rightsStatus: record.rightsStatus,
          edition: record.edition || "fixture-edition",
          answerGeneration: false
        }
      };
    }
  };
}

export function createFixtureSessionVerifier(entries = []) {
  const sessions = new Map(entries.map((entry) => [entry.session, clone(entry.actor)]));
  return {
    mode: "fixture-session-verifier",
    verify(header = "") {
      const match = /^Session\s+([A-Za-z0-9._-]{4,120})$/.exec(header);
      return match && sessions.has(match[1]) ? clone(sessions.get(match[1])) : null;
    }
  };
}

export function createReviewerQueueStore(seed = [], { now = () => new Date().toISOString() } = {}) {
  const tickets = new Map(seed.map((ticket) => [ticket.id, clone(ticket)]));
  const events = [];
  const idempotency = new Map();
  return {
    persistence: "ephemeral",
    list() {
      return [...tickets.values()].map((ticket) => clone(ticket));
    },
    audit() {
      return events.map((event) => clone(event));
    },
    transition({ ticketId, nextStatus, note = "", actor, idempotencyKey }) {
      if (!idempotencyKey) return { ok: false, status: 400, code: "idempotency_key_required" };
      if (idempotency.has(idempotencyKey)) return { ...clone(idempotency.get(idempotencyKey)), replayed: true };
      const ticket = tickets.get(ticketId);
      if (!ticket) return { ok: false, status: 404, code: "ticket_not_found" };
      if (!actor || actor.role !== "reviewer" || !String(actor.id || "").startsWith("reviewer-")) {
        return { ok: false, status: 403, code: "reviewer_required" };
      }
      if (!QUEUE_TRANSITIONS.get(ticket.status)?.has(nextStatus)) {
        return { ok: false, status: 409, code: "invalid_transition", currentStatus: ticket.status };
      }
      if (ticket.status === "claimed" && ticket.owner !== actor.id) {
        return { ok: false, status: 409, code: "owner_mismatch" };
      }
      if (["approved", "changes-requested"].includes(nextStatus) && !note.trim()) {
        return { ok: false, status: 400, code: "decision_note_required" };
      }
      const previous = ticket.status;
      ticket.status = nextStatus;
      if (nextStatus === "claimed") ticket.owner = actor.id;
      if (nextStatus === "open") ticket.owner = null;
      const event = {
        sequence: events.length + 1,
        ticketId,
        previous,
        next: nextStatus,
        actor: actor.id,
        note: note.trim() || null,
        at: now()
      };
      events.push(event);
      const result = { ok: true, status: 200, ticket: clone(ticket), event: clone(event), replayed: false };
      idempotency.set(idempotencyKey, result);
      return clone(result);
    }
  };
}

export function createConsentStore(seed = [], { now = () => new Date().toISOString() } = {}) {
  const events = seed.map((event) => clone(event));
  const idempotency = new Map();

  function effective(subject) {
    const purposes = new Map();
    for (const event of events.filter((item) => item.subject === subject)) {
      const state = purposes.get(event.purpose) || {
        purpose: event.purpose,
        active: false,
        scope: [],
        lastSequence: 0,
        exportRequested: false,
        deletionRequested: false
      };
      if (event.type === "consent.granted") {
        state.active = true;
        state.scope = clone(event.scope);
      }
      if (event.type === "consent.withdrawn") state.active = false;
      if (event.type === "export.requested") state.exportRequested = true;
      if (event.type === "deletion.requested") state.deletionRequested = true;
      state.lastSequence = event.sequence;
      purposes.set(event.purpose, state);
    }
    return { subject, purposes: [...purposes.values()].map((item) => clone(item)), eventCount: events.filter((item) => item.subject === subject).length };
  }

  return {
    persistence: "ephemeral",
    append({ type, purpose, scope, actor, idempotencyKey }) {
      if (!idempotencyKey) return { ok: false, status: 400, code: "idempotency_key_required" };
      if (idempotency.has(idempotencyKey)) return { ...clone(idempotency.get(idempotencyKey)), replayed: true };
      if (!actor || actor.role !== "participant" || !String(actor.subject || "").startsWith("pilot-participant-")) {
        return { ok: false, status: 403, code: "participant_required" };
      }
      if (!CONSENT_TYPES.has(type)) return { ok: false, status: 400, code: "invalid_event_type" };
      if (!purpose || !Array.isArray(scope) || scope.length < 1) {
        return { ok: false, status: 400, code: "purpose_and_scope_required" };
      }
      const event = {
        sequence: events.length + 1,
        type,
        subject: actor.subject,
        purpose,
        scope: [...new Set(scope.map(String))].sort(),
        at: now()
      };
      events.push(event);
      const result = { ok: true, status: 201, event: clone(event), effective: effective(actor.subject), replayed: false };
      idempotency.set(idempotencyKey, result);
      return clone(result);
    },
    effective,
    eventCount() {
      return events.length;
    }
  };
}

function responseHeaders(requestId, origin, allowedOrigin) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-request-id": requestId,
    "vary": "Origin"
  });
  if (origin && origin === allowedOrigin) headers.set("access-control-allow-origin", origin);
  return headers;
}

function json(status, body, context) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: responseHeaders(context.requestId, context.origin, context.allowedOrigin)
  });
}

async function readJson(request, context) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8192) return { ok: false, response: json(413, { code: "body_too_large" }, context) };
  const text = await request.text();
  if (text.length > 8192) return { ok: false, response: json(413, { code: "body_too_large" }, context) };
  try {
    return { ok: true, value: text ? JSON.parse(text) : {} };
  } catch {
    return { ok: false, response: json(400, { code: "invalid_json" }, context) };
  }
}

function authenticate(request, sessionVerifier, role, context) {
  const actor = sessionVerifier?.verify(request.headers.get("authorization") || "");
  if (!actor) return { ok: false, response: json(401, { code: "session_required" }, context) };
  if (actor.role !== role) return { ok: false, response: json(403, { code: `${role}_required` }, context) };
  return { ok: true, actor };
}

export function createHostedPilotApp({
  environment,
  sourceRecords = [],
  queueStore = createReviewerQueueStore(),
  consentStore = createConsentStore(),
  sessionVerifier = createFixtureSessionVerifier(),
  featureLevel = 5,
  rateLimiter = createMemoryRateLimiter(),
  requestId = (() => {
    let sequence = 0;
    return () => `vp-${String(++sequence).padStart(6, "0")}`;
  })()
} = {}) {
  const environmentCheck = validateEnvironmentProfile(environment);
  if (!environmentCheck.approved) throw new Error(`Invalid hosted candidate environment: ${environmentCheck.violations.join("; ")}`);
  const sources = createSourceStore(sourceRecords);
  const allowlist = new Set(environment.corsAllowlist);

  return {
    boundary: HOSTED_CANDIDATE_BOUNDARY,
    async handle(request) {
      const url = new URL(request.url);
      const origin = request.headers.get("origin") || "";
      const allowedOrigin = origin && allowlist.has(origin) ? origin : "";
      const context = { requestId: requestId(), origin, allowedOrigin };
      if (origin && !allowedOrigin) return json(403, { code: "origin_not_allowed" }, context);

      const clientKey = request.headers.get("x-client-key") || "anonymous";
      const rate = rateLimiter.take(clientKey);
      if (!rate.allowed) return json(429, { code: "rate_limited", resetAt: rate.resetAt }, context);

      if (request.method === "OPTIONS") {
        const headers = responseHeaders(context.requestId, origin, allowedOrigin);
        headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
        headers.set("access-control-allow-headers", "authorization, content-type, idempotency-key, x-client-key");
        return new Response(null, { status: 204, headers });
      }

      if (request.method === "GET" && url.pathname === "/v1/health") {
        return json(200, { ok: true, service: environment.serviceName, environment: environment.environment, production: false }, context);
      }

      if (request.method === "GET" && url.pathname === "/v1/readiness") {
        return json(200, {
          ok: true,
          featureLevel,
          environment: environmentCheck.summary,
          sourceRecords: sources.count(),
          identityMode: sessionVerifier.mode,
          queuePersistence: queueStore.persistence,
          consentPersistence: consentStore.persistence,
          consentEvents: consentStore.eventCount(),
          deploymentAuthorized: false,
          productionStorage: false,
          telemetryEnabled: false,
          publicLaunch: false,
          boundary: HOSTED_CANDIDATE_BOUNDARY
        }, context);
      }

      if (url.pathname.startsWith("/v1/sources/")) {
        if (request.method !== "GET") return json(405, { code: "method_not_allowed", allowed: ["GET"] }, context);
        const id = decodeURIComponent(url.pathname.slice("/v1/sources/".length));
        if (!id || id.length > 120) return json(400, { code: "invalid_source_id" }, context);
        const result = sources.get(id);
        if (!result.ok) return json(result.code === "source_not_found" ? 404 : 409, { code: result.code, source: null, generatedAnswer: null }, context);
        return json(200, { source: result.source, generatedAnswer: null, mutation: false }, context);
      }

      if (featureLevel >= 4 && request.method === "GET" && url.pathname === "/v1/review-queue") {
        const auth = authenticate(request, sessionVerifier, "reviewer", context);
        if (!auth.ok) return auth.response;
        return json(200, { tickets: queueStore.list(), auditCount: queueStore.audit().length, persistence: queueStore.persistence }, context);
      }

      const transitionMatch = featureLevel >= 4 && /^\/v1\/review-queue\/([^/]+)\/transitions$/.exec(url.pathname);
      if (transitionMatch) {
        if (request.method !== "POST") return json(405, { code: "method_not_allowed", allowed: ["POST"] }, context);
        const auth = authenticate(request, sessionVerifier, "reviewer", context);
        if (!auth.ok) return auth.response;
        const body = await readJson(request, context);
        if (!body.ok) return body.response;
        const result = queueStore.transition({
          ticketId: decodeURIComponent(transitionMatch[1]),
          nextStatus: body.value.nextStatus,
          note: body.value.note || "",
          actor: auth.actor,
          idempotencyKey: request.headers.get("idempotency-key") || ""
        });
        return json(result.status, result, context);
      }

      if (featureLevel >= 4 && request.method === "GET" && url.pathname === "/v1/review-audit") {
        const auth = authenticate(request, sessionVerifier, "reviewer", context);
        if (!auth.ok) return auth.response;
        return json(200, { events: queueStore.audit(), appendOnly: true }, context);
      }

      if (featureLevel >= 5 && request.method === "GET" && url.pathname === "/v1/consent") {
        const auth = authenticate(request, sessionVerifier, "participant", context);
        if (!auth.ok) return auth.response;
        return json(200, consentStore.effective(auth.actor.subject), context);
      }

      if (featureLevel >= 5 && url.pathname === "/v1/consent-events") {
        if (request.method !== "POST") return json(405, { code: "method_not_allowed", allowed: ["POST"] }, context);
        const auth = authenticate(request, sessionVerifier, "participant", context);
        if (!auth.ok) return auth.response;
        const body = await readJson(request, context);
        if (!body.ok) return body.response;
        const result = consentStore.append({
          type: body.value.type,
          purpose: body.value.purpose,
          scope: body.value.scope,
          actor: auth.actor,
          idempotencyKey: request.headers.get("idempotency-key") || ""
        });
        return json(result.status, result, context);
      }

      return json(404, { code: "route_not_found" }, context);
    }
  };
}

export function hostedCandidatePacket(label, result) {
  return {
    label,
    approved: Boolean(result.approved),
    digest: result.digest,
    violations: clone(result.violations),
    boundary: result.boundary
  };
}
