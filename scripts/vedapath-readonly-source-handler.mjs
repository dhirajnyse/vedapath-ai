import { querySource, registrySummary, searchSources, sourceRecords } from "./vedapath-source-registry.mjs";

const contract = "vedapath.source.v1";

function response(status, body, requestId) {
  return {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "x-vedapath-contract": contract,
      "x-vedapath-request-id": requestId
    },
    body: { ...body, contract, request_id: requestId }
  };
}

function error(code, message) {
  return { ok: false, error: { code, message, retryable: false, details: null } };
}

function queryValue(query, key) {
  if (query instanceof URLSearchParams) return query.get(key) || "";
  return String((query || {})[key] || "");
}

function questionFrom(request) {
  if (request.method === "POST") return String((request.body || {}).question || (request.body || {}).q || "").trim();
  return (queryValue(request.query, "question") || queryValue(request.query, "q")).trim();
}

export async function handleReadonlySourceRequest(input = {}) {
  const request = {
    method: String(input.method || "GET").toUpperCase(),
    pathname: String(input.pathname || "/"),
    query: input.query || {},
    body: input.body || {},
    requestId: String(input.requestId || "vp-hosted-preview-000001").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64) || "vp-hosted-preview-000001"
  };
  const known = ["/health", "/sources", "/search", "/source"];

  if (!known.includes(request.pathname)) return response(404, error("not_found", "No read-only Source API route matches this request."), request.requestId);
  if (request.method === "OPTIONS") return response(204, { ok: true }, request.requestId);
  const allowed = request.pathname === "/source" ? ["GET", "POST"] : ["GET"];
  if (!allowed.includes(request.method)) return response(405, error("method_not_allowed", "This read-only route does not accept " + request.method + "."), request.requestId);

  if (request.pathname === "/health") {
    return response(200, {
      ok: true,
      service: "vedapath-readonly-source-handler",
      version: "v4.8.6",
      registry: registrySummary(),
      storage: "none",
      writes: 0,
      launch: "blocked"
    }, request.requestId);
  }

  if (request.pathname === "/sources") {
    const family = queryValue(request.query, "family").toLowerCase();
    const status = queryValue(request.query, "status").toLowerCase();
    const records = sourceRecords.filter(function (record) {
      if (record.status === "no-source") return false;
      if (family && !record.family.toLowerCase().includes(family)) return false;
      if (status && record.status.toLowerCase() !== status) return false;
      return true;
    });
    return response(200, { ok: true, count: records.length, records }, request.requestId);
  }

  const question = questionFrom(request);
  if (!question) return response(422, error("question_required", "Enter a question before source matching begins."), request.requestId);
  if (request.pathname === "/search") {
    const candidates = searchSources(question, {
      family: queryValue(request.query, "family"),
      status: queryValue(request.query, "status"),
      limit: queryValue(request.query, "limit") || 5
    });
    return response(200, { ok: true, query: question, count: candidates.length, candidates }, request.requestId);
  }
  return response(200, { ok: true, ...querySource(question) }, request.requestId);
}

export const readonlySourceDecision = Object.freeze({
  release: "v4.8.6",
  deployment: "not-authorized",
  storage: "none",
  write_routes: [],
  contract
});
