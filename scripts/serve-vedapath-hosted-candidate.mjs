import http from "node:http";
import {
  createConsentStore,
  createFixtureSessionVerifier,
  createHostedPilotApp,
  createReviewerQueueStore
} from "./vedapath-hosted-candidate-contracts.mjs";

const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const featureArg = process.argv.find((arg) => arg.startsWith("--feature-level="));
const port = Number(portArg?.split("=")[1] || process.env.PORT || 8101);
const featureLevel = Number(featureArg?.split("=")[1] || 5);

const environment = {
  environment: "local",
  serviceName: "vedapath-hosted-candidate",
  publicOrigin: `http://127.0.0.1:${port}`,
  corsAllowlist: ["http://127.0.0.1:8097", "http://localhost:8097"],
  secretRefs: {
    sessionVerifier: "binding://SESSION_VERIFIER",
    reviewStore: "binding://REVIEW_STORE",
    consentStore: "binding://CONSENT_STORE"
  },
  vendor: "not-selected",
  region: "review-required",
  persistence: "ephemeral",
  deploymentAuthorized: false,
  productionStorage: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

const app = createHostedPilotApp({
  environment,
  featureLevel,
  sourceRecords: [
    { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture", excerpt: "Steadiness in action without clinging to results." },
    { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", rightsStatus: "reviewed-fixture", excerpt: "The cosmic form is identified with world-transforming Time." }
  ],
  sessionVerifier: createFixtureSessionVerifier([
    { session: "reviewer-demo", actor: { id: "reviewer-001", role: "reviewer", subject: "reviewer-001" } },
    { session: "participant-demo", actor: { id: "participant-001", role: "participant", subject: "pilot-participant-001" } }
  ]),
  queueStore: createReviewerQueueStore([
    { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null },
    { id: "review-bg-11-32", sourceId: "bg-11-32-time", status: "open", owner: null }
  ]),
  consentStore: createConsentStore()
});

function headersFromNode(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
    else if (value !== undefined) headers.set(key, value);
  }
  return headers;
}

async function requestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

const server = http.createServer(async (request, response) => {
  try {
    const body = await requestBody(request);
    const fetchRequest = new Request(`http://127.0.0.1:${port}${request.url || "/"}`, {
      method: request.method,
      headers: headersFromNode(request.headers),
      body: ["GET", "HEAD"].includes(request.method || "GET") ? undefined : body
    });
    const fetchResponse = await app.handle(fetchRequest);
    response.writeHead(fetchResponse.status, Object.fromEntries(fetchResponse.headers.entries()));
    response.end(Buffer.from(await fetchResponse.arrayBuffer()));
  } catch (error) {
    response.writeHead(500, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({ code: "hosted_candidate_server_error", message: error.message }));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`vedapath-hosted-candidate http://127.0.0.1:${port} feature-level=${featureLevel}`);
  console.log("fixture sessions: reviewer-demo, participant-demo; persistence=ephemeral; launch=closed");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
