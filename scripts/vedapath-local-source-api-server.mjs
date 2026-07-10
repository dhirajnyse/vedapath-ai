import http from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  fixtureQueries,
  querySource,
  registrySummary,
  searchSources,
  sourceRecords
} from "./vedapath-source-api-stub.mjs";

const serviceVersion = "v4.8.5";
const contractVersion = "vedapath.source.v1";
const maxBodyBytes = 16 * 1024;
let requestSequence = 0;

function nextRequestId(req) {
  const incoming = String(req.headers["x-vedapath-request-id"] || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64);
  requestSequence += 1;
  return incoming || "vp-local-" + String(requestSequence).padStart(6, "0");
}

function configuredOrigins() {
  const defaults = [
    "http://127.0.0.1",
    "http://localhost",
    "https://dhirajnyse.github.io"
  ];
  const configured = String(process.env.VEDAPATH_ALLOWED_ORIGINS || "").split(",").map(function (value) {
    return value.trim();
  }).filter(Boolean);
  return defaults.concat(configured);
}

function originAllowed(origin) {
  if (!origin) return true;
  if (origin === "null") return false;
  return configuredOrigins().some(function (allowed) {
    if (origin === allowed) return true;
    return (allowed === "http://127.0.0.1" || allowed === "http://localhost") && origin.startsWith(allowed + ":");
  });
}

function responseHeaders(req, requestId, extra = {}) {
  const origin = String(req.headers.origin || "");
  const headers = {
    "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "cross-origin-resource-policy": "cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-vedapath-contract": contractVersion,
    "x-vedapath-request-id": requestId,
    "vary": "origin",
    ...extra
  };
  if (originAllowed(origin)) {
    headers["access-control-allow-origin"] = origin || "*";
    headers["access-control-allow-methods"] = "GET,POST,OPTIONS";
    headers["access-control-allow-headers"] = "content-type,x-vedapath-request-id";
    headers["access-control-max-age"] = "600";
    if (req.headers["access-control-request-private-network"] === "true") {
      headers["access-control-allow-private-network"] = "true";
    }
  }
  return headers;
}

function json(req, res, status, payload, requestId, extraHeaders = {}) {
  const body = JSON.stringify({
    ...payload,
    contract: payload.contract || contractVersion,
    request_id: payload.request_id || requestId
  }, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...responseHeaders(req, requestId, extraHeaders)
  });
  res.end(body);
}

function noContent(req, res, requestId) {
  res.writeHead(204, responseHeaders(req, requestId));
  res.end();
}

function errorPayload(code, message, retryable = false, details = null) {
  return {
    ok: false,
    error: {
      code,
      message,
      retryable,
      details
    }
  };
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let body = "";
    let bytes = 0;
    let tooLarge = false;
    req.setEncoding("utf8");
    req.on("data", function (chunk) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > maxBodyBytes) {
        tooLarge = true;
        return;
      }
      if (!tooLarge) body += chunk;
    });
    req.on("end", function () {
      if (tooLarge) {
        const error = new Error("Request body exceeds 16 KB.");
        error.code = "payload_too_large";
        reject(error);
        return;
      }
      resolve(body);
    });
    req.on("error", reject);
  });
}

function healthPayload() {
  return {
    ok: true,
    service: "vedapath-local-source-api",
    version: serviceVersion,
    fixtures: fixtureQueries.length,
    records: sourceRecords.length,
    registry: registrySummary(),
    storage: "none",
    launch: "blocked",
    authority: "source packet prototype only"
  };
}

function knownPath(pathname) {
  return ["/health", "/fixtures", "/source", "/sources", "/search"].includes(pathname);
}

function methodAllowed(pathname, method) {
  if (pathname === "/source") return ["GET", "POST"].includes(method);
  return ["GET"].includes(method);
}

function allowedMethods(pathname) {
  return pathname === "/source" ? "GET, POST, OPTIONS" : "GET, OPTIONS";
}

function requiredQuestion(req, res, requestId, question) {
  if (String(question || "").trim()) return true;
  json(req, res, 422, errorPayload("question_required", "Enter a question before source matching begins."), requestId);
  return false;
}

export function createLocalSourceApiServer() {
  return http.createServer(async function (req, res) {
    const requestId = nextRequestId(req);
    try {
      const origin = String(req.headers.origin || "");
      if (!originAllowed(origin)) {
        json(req, res, 403, errorPayload("origin_not_allowed", "This local API accepts only approved private-demo origins."), requestId);
        return;
      }

      if (req.method === "OPTIONS") {
        noContent(req, res, requestId);
        return;
      }

      const url = new URL(req.url || "/", "http://127.0.0.1");
      if (knownPath(url.pathname) && !methodAllowed(url.pathname, req.method || "GET")) {
        json(req, res, 405, errorPayload("method_not_allowed", "Use " + allowedMethods(url.pathname) + " for " + url.pathname + "."), requestId, {
          "allow": allowedMethods(url.pathname)
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/health") {
        json(req, res, 200, healthPayload(), requestId);
        return;
      }

      if (req.method === "GET" && url.pathname === "/fixtures") {
        json(req, res, 200, {
          ok: true,
          records: sourceRecords.map(function (record) {
            return {
              id: record.id,
              citation: record.citation,
              family: record.family,
              status: record.status,
              boundary: record.boundary
            };
          }),
          queries: fixtureQueries
        }, requestId);
        return;
      }

      if (req.method === "GET" && url.pathname === "/sources") {
        const family = url.searchParams.get("family") || "";
        const status = url.searchParams.get("status") || "";
        const includeGuards = url.searchParams.get("include_guards") === "true";
        const records = sourceRecords.filter(function (record) {
          if (!includeGuards && record.status === "no-source") return false;
          if (family && !record.family.toLowerCase().includes(family.toLowerCase())) return false;
          if (status && record.status.toLowerCase() !== status.toLowerCase()) return false;
          return true;
        });
        json(req, res, 200, {
          ok: true,
          count: records.length,
          filters: { family: family || null, status: status || null },
          records
        }, requestId);
        return;
      }

      if (req.method === "GET" && url.pathname === "/search") {
        const question = url.searchParams.get("question") || url.searchParams.get("q") || "";
        if (!requiredQuestion(req, res, requestId, question)) return;
        const candidates = searchSources(question, {
          family: url.searchParams.get("family") || "",
          status: url.searchParams.get("status") || "",
          limit: url.searchParams.get("limit") || 5
        });
        json(req, res, 200, {
          ok: true,
          query: question,
          count: candidates.length,
          candidates
        }, requestId);
        return;
      }

      if (req.method === "GET" && url.pathname === "/source") {
        const question = url.searchParams.get("question") || url.searchParams.get("q") || "";
        if (!requiredQuestion(req, res, requestId, question)) return;
        json(req, res, 200, { ok: true, ...querySource(question) }, requestId);
        return;
      }

      if (req.method === "POST" && url.pathname === "/source") {
        const body = await readBody(req);
        let parsed;
        try {
          parsed = body ? JSON.parse(body) : {};
        } catch (error) {
          json(req, res, 400, errorPayload("invalid_json", "Send a valid JSON object with a question field."), requestId);
          return;
        }
        const question = parsed.question || parsed.q || "";
        if (!requiredQuestion(req, res, requestId, question)) return;
        json(req, res, 200, { ok: true, ...querySource(question) }, requestId);
        return;
      }

      json(req, res, 404, {
        ...errorPayload("not_found", "No local Source API route matches this request."),
        allowed: ["/health", "/fixtures", "/sources", "/search?q=...", "/source?q=..."]
      }, requestId);
    } catch (error) {
      if (error.code === "payload_too_large") {
        if (!res.headersSent) {
          json(req, res, 413, errorPayload("payload_too_large", error.message), requestId);
        }
        return;
      }
      if (!res.headersSent) {
        json(req, res, 500, errorPayload("local_source_api_error", "The local source service could not complete this request.", true), requestId);
      } else {
        res.end();
      }
    }
  });
}

export function startLocalSourceApiServer(options = {}) {
  const host = options.host || "127.0.0.1";
  const port = Number(options.port || process.env.PORT || 8787);
  const server = createLocalSourceApiServer();
  return new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(port, host, function () {
      server.off("error", reject);
      resolve({ server, host, port: server.address().port });
    });
  });
}

function cliOptions(argv) {
  const portIndex = argv.indexOf("--port");
  const hostIndex = argv.indexOf("--host");
  return {
    port: portIndex >= 0 ? argv[portIndex + 1] : process.env.PORT || 8787,
    host: hostIndex >= 0 ? argv[hostIndex + 1] : "127.0.0.1"
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = cliOptions(process.argv.slice(2));
  const started = await startLocalSourceApiServer(options);
  console.log("vedapath-local-source-api listening http://" + started.host + ":" + started.port);
  console.log("contract: " + contractVersion + "; registry: " + registrySummary().release);
  console.log("boundary: private demo only; no storage, accounts, payments, public launch, or live AI");
}
