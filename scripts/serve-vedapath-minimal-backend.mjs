import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createSourceApi, createReviewerQueue, createConsentLedger } from "./vedapath-minimal-backend-contracts.mjs";

const root = process.cwd();
const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const port = Number(portArg ? portArg.split("=")[1] : 8099);
const sourceData = JSON.parse(fs.readFileSync(path.join(root, "data", "vedapath-source-api-minimal-endpoint.json"), "utf8"));
const queueData = JSON.parse(fs.readFileSync(path.join(root, "data", "vedapath-reviewer-queue-minimal-backend.json"), "utf8"));
const api = createSourceApi(sourceData.records);
const queue = createReviewerQueue(queueData.tickets);
const consent = createConsentLedger();

function send(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "http://127.0.0.1" });
  response.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { ok: true, service: "vedapath-minimal-backend", production: false });
  if (url.pathname.startsWith("/api/sources/")) return send(response, ...Object.values(api.request(request.method, decodeURIComponent(url.pathname.slice(13)))));
  if (request.method === "GET" && url.pathname === "/api/review-queue") return send(response, 200, { tickets: queue.list(), events: queue.history(), identityMode: "fixture" });
  if (request.method === "GET" && url.pathname === "/api/consent-ledger") return send(response, 200, { events: consent.list(), appendOnly: true, telemetryEnabled: false });
  return send(response, 404, { code: "route_not_found" });
});

server.listen(port, "127.0.0.1", () => console.log(`vedapath-minimal-backend http://127.0.0.1:${port}`));
