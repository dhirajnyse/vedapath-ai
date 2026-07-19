import http from "node:http";
import { pathToFileURL } from "node:url";
import {
  createConsentStore,
  createHostedPilotApp,
  createReviewerQueueStore
} from "./vedapath-hosted-candidate-contracts.mjs";
import {
  createHostedDeploymentAdapter,
  createPilotPlatformApp,
  createRedactedOperationsRecorder,
  createSignedIdentityCandidate,
  PILOT_PLATFORM_BOUNDARY
} from "./vedapath-pilot-platform-contracts.mjs";

const FIXTURE_SECRET = "vedapath-ephemeral-platform-fixture-key-2026";
const FIXTURE_SOURCES = [
  {
    id: "bg-2-48-steadiness",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 2.48",
    rightsStatus: "reviewed-fixture",
    excerpt: "Steadiness in action without clinging to results."
  },
  {
    id: "bg-11-32-time",
    family: "Bhagavad Gita | Smriti",
    citation: "Bhagavad Gita 11.32",
    rightsStatus: "reviewed-fixture",
    excerpt: "The cosmic form is identified with world-transforming Time."
  }
];

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

export function createPilotPlatformFixture({ advertisedPort = 8111 } = {}) {
  const identity = createSignedIdentityCandidate({
    secret: FIXTURE_SECRET,
    issuer: "https://identity.candidate.vedapath.invalid",
    audience: "vedapath-private-pilot"
  });
  const environment = {
    environment: "local",
    serviceName: "vedapath-pilot-platform-candidate",
    publicOrigin: `http://127.0.0.1:${advertisedPort}`,
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
  const hostedApp = createHostedPilotApp({
    environment,
    featureLevel: 5,
    sourceRecords: FIXTURE_SOURCES,
    sessionVerifier: identity,
    queueStore: createReviewerQueueStore([
      { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null }
    ]),
    consentStore: createConsentStore()
  });
  const adapter = createHostedDeploymentAdapter({
    app: hostedApp,
    bindingRefs: {
      sessionVerifier: "binding://SESSION_VERIFIER",
      reviewStore: "binding://REVIEW_STORE",
      consentStore: "binding://CONSENT_STORE"
    }
  });
  const operations = createRedactedOperationsRecorder();
  const app = createPilotPlatformApp({ adapter, identityVerifier: identity, operations, featureLevel: 5 });
  return {
    app,
    identity,
    operations,
    reviewerToken: identity.issue({ subject: "reviewer-001", role: "reviewer", expiresIn: 900, tokenId: "reviewer-http-fixture" }),
    participantToken: identity.issue({ subject: "pilot-participant-001", role: "participant", expiresIn: 900, tokenId: "participant-http-fixture" })
  };
}

export async function startPilotPlatformServer({ port = 0 } = {}) {
  const fixture = createPilotPlatformFixture({ advertisedPort: port || 8111 });
  const server = http.createServer(async (request, response) => {
    try {
      const body = await requestBody(request);
      const fetchRequest = new Request(`http://127.0.0.1:${server.address()?.port || port}${request.url || "/"}`, {
        method: request.method,
        headers: headersFromNode(request.headers),
        body: ["GET", "HEAD"].includes(request.method || "GET") ? undefined : body
      });
      const fetchResponse = await fixture.app.handle(fetchRequest);
      response.writeHead(fetchResponse.status, Object.fromEntries(fetchResponse.headers.entries()));
      response.end(Buffer.from(await fetchResponse.arrayBuffer()));
    } catch (error) {
      response.writeHead(500, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      });
      response.end(JSON.stringify({ code: "pilot_platform_server_error", message: error.message }));
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  const actualPort = server.address().port;
  return {
    ...fixture,
    server,
    baseUrl: `http://127.0.0.1:${actualPort}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) {
  const portArg = process.argv.find((arg) => arg.startsWith("--port="));
  const port = Number(portArg?.split("=")[1] || process.env.PORT || 8111);
  const runtime = await startPilotPlatformServer({ port });
  console.log(`vedapath-pilot-platform ${runtime.baseUrl}`);
  console.log(`fixture identity=ephemeral storage=memory provider=unbound region=unbound launch=closed`);
  console.log(PILOT_PLATFORM_BOUNDARY);
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => runtime.close().then(() => process.exit(0)));
  }
}
