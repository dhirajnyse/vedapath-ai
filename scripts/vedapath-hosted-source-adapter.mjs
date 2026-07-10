import { handleReadonlySourceRequest } from "./vedapath-readonly-source-handler.mjs";

const contract = "vedapath.source.v1";
const defaultOrigins = Object.freeze([
  "https://dhirajnyse.github.io",
  "http://127.0.0.1",
  "http://localhost"
]);

function cleanRequestId(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 64) || "vp-hosted-preview-000001";
}

function allowedOrigin(origin, origins) {
  if (!origin) return true;
  if (origin === "null") return false;
  return origins.some(function (allowed) {
    if (origin === allowed) return true;
    return (allowed === "http://127.0.0.1" || allowed === "http://localhost") && origin.startsWith(allowed + ":");
  });
}

function errorBody(code, message, requestId, retryable = false, details = null) {
  return {
    ok: false,
    error: { code, message, retryable, details },
    contract,
    request_id: requestId
  };
}

function responseHeaders(requestId, origin, extra = {}) {
  const headers = new Headers({
    "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "cross-origin-resource-policy": "cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-vedapath-contract": contract,
    "x-vedapath-request-id": requestId,
    "vary": "origin",
    ...extra
  });
  if (origin) headers.set("access-control-allow-origin", origin);
  return headers;
}

function jsonResponse(status, body, requestId, origin, extra = {}) {
  const headers = responseHeaders(requestId, origin, extra);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body, null, 2), { status, headers });
}

function guardHeaders(decision) {
  if (!decision) return {};
  const result = {
    "x-ratelimit-limit": String(decision.limit),
    "x-ratelimit-remaining": String(Math.max(0, decision.remaining)),
    "x-ratelimit-reset": String(decision.retry_after_seconds)
  };
  if (!decision.allowed) result["retry-after"] = String(decision.retry_after_seconds);
  return result;
}

export function createHostedSourceAdapter(options = {}) {
  const origins = Array.isArray(options.allowedOrigins) && options.allowedOrigins.length
    ? options.allowedOrigins.slice()
    : defaultOrigins.slice();
  const maxBodyBytes = Number(options.maxBodyBytes || 16 * 1024);
  const guard = options.guard || null;

  return async function hostedSourceAdapter(request) {
    const origin = String(request.headers.get("origin") || "");
    const requestId = cleanRequestId(request.headers.get("x-vedapath-request-id"));
    let url;
    try {
      url = new URL(request.url);
    } catch (error) {
      return jsonResponse(400, errorBody("invalid_url", "The request URL is invalid.", requestId), requestId, "");
    }

    if (!allowedOrigin(origin, origins)) {
      return jsonResponse(403, errorBody("origin_not_allowed", "This preview accepts only approved VedaPath origins.", requestId), requestId, "");
    }

    const clientToken = String(request.headers.get("x-vedapath-client-token") || "anonymous");
    const guardDecision = guard ? guard.before({
      clientToken,
      method: request.method,
      pathname: url.pathname,
      requestId
    }) : null;
    if (guardDecision && !guardDecision.allowed) {
      const response = jsonResponse(429, errorBody(
        "rate_limited",
        "This private preview has reached its short request limit. Pause, then try again.",
        requestId,
        true,
        { retry_after_seconds: guardDecision.retry_after_seconds }
      ), requestId, origin, guardHeaders(guardDecision));
      guard.record({ ...guardDecision, method: request.method, pathname: url.pathname, status: 429, outcome: "limited" });
      return response;
    }

    function rejected(status, code, message, details = null) {
      const response = jsonResponse(status, errorBody(code, message, requestId, false, details), requestId, origin, guardHeaders(guardDecision));
      if (guard) guard.record({ ...guardDecision, method: request.method, pathname: url.pathname, status, outcome: "rejected" });
      return response;
    }

    const method = String(request.method || "GET").toUpperCase();
    let body = {};
    if (method === "POST") {
      const contentType = String(request.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        return rejected(415, "unsupported_media_type", "POST requests must use application/json.");
      }
      const declaredLength = Number(request.headers.get("content-length") || 0);
      if (declaredLength > maxBodyBytes) {
        return rejected(413, "payload_too_large", "Request body exceeds 16 KB.");
      }
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) {
        return rejected(413, "payload_too_large", "Request body exceeds 16 KB.");
      }
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch (error) {
        return rejected(400, "invalid_json", "Send a valid JSON object with a question field.");
      }
      if (!body || Array.isArray(body) || typeof body !== "object") {
        return rejected(400, "invalid_json_shape", "Send a JSON object with a question field.");
      }
    }

    const result = await handleReadonlySourceRequest({
      method,
      pathname: url.pathname,
      query: url.searchParams,
      body,
      requestId
    });
    const extra = guardHeaders(guardDecision);
    if (result.status === 405) extra.allow = url.pathname === "/source" ? "GET, POST, OPTIONS" : "GET, OPTIONS";
    if (method === "OPTIONS") {
      Object.assign(extra, {
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type,x-vedapath-request-id,x-vedapath-client-token",
        "access-control-max-age": "600"
      });
    }
    const response = result.status === 204
      ? new Response(null, { status: 204, headers: responseHeaders(requestId, origin, extra) })
      : jsonResponse(result.status, result.body, requestId, origin, extra);
    if (guard) guard.record({ ...guardDecision, method, pathname: url.pathname, status: result.status, outcome: result.status < 400 ? "served" : "rejected" });
    return response;
  };
}

export const hostedSourceAdapterDecision = Object.freeze({
  release: "v4.8.7",
  runtime: "web-request-response",
  provider: "unselected",
  storage: "none",
  write_routes: [],
  deployment: "not-activated",
  contract
});
