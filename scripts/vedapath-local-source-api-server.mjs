import http from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fixtureQueries, querySource, sourceRecords } from "./vedapath-source-api-stub.mjs";

const serviceVersion = "v4.7.2";

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
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
    storage: "none",
    launch: "blocked",
    authority: "source packet prototype only"
  };
}

export function createLocalSourceApiServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") {
        json(res, 204, {});
        return;
      }

      const url = new URL(req.url || "/", "http://127.0.0.1");

      if (req.method === "GET" && url.pathname === "/health") {
        json(res, 200, healthPayload());
        return;
      }

      if (req.method === "GET" && url.pathname === "/fixtures") {
        json(res, 200, {
          service: "vedapath-local-source-api",
          records: sourceRecords.map((record) => ({
            id: record.id,
            citation: record.citation,
            family: record.family,
            status: record.status,
            boundary: record.boundary
          })),
          queries: fixtureQueries
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/source") {
        const question = url.searchParams.get("question") || url.searchParams.get("q") || "";
        json(res, 200, querySource(question));
        return;
      }

      if (req.method === "POST" && url.pathname === "/source") {
        const body = await readBody(req);
        const parsed = body ? JSON.parse(body) : {};
        json(res, 200, querySource(parsed.question || parsed.q || ""));
        return;
      }

      json(res, 404, {
        ok: false,
        error: "not_found",
        allowed: ["/health", "/fixtures", "/source?q=..."]
      });
    } catch (error) {
      json(res, 500, {
        ok: false,
        error: "local_source_api_error",
        message: error.message
      });
    }
  });
}

export function startLocalSourceApiServer(options = {}) {
  const host = options.host || "127.0.0.1";
  const port = Number(options.port || process.env.PORT || 8787);
  const server = createLocalSourceApiServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
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
  const { host, port } = await startLocalSourceApiServer(options);
  console.log("vedapath-local-source-api listening http://" + host + ":" + port);
  console.log("boundary: private demo only; no storage, accounts, payments, public launch, or live AI");
}
