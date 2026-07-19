import http from "node:http";
import { pathToFileURL } from "node:url";
import { createDeploymentReadinessFixture } from "./serve-vedapath-deployment-readiness.mjs";
import {
  HOSTED_ACTIVATION_BOUNDARY,
  createExternalReviewerIdentityCandidate,
  createHostedActivationApp,
  evaluateDurableDatabaseAdapterEvidence,
  evaluateExternalReviewerIdentityEvidence,
  evaluateFounderHostedPilotActivationDecision,
  evaluateIntegratedHostedActivationGate,
  evaluateManagedSecretStoreAdapterEvidence,
  evaluateProviderManifestDryRun
} from "./vedapath-hosted-activation-contracts.mjs";

const closed = {
  providerBound: false,
  regionBound: false,
  managedSecretStoreBound: false,
  durableDatabaseBound: false,
  externalIdentityBound: false,
  deploymentAuthorized: false,
  productionCredentials: false,
  productionData: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

function hostedActivationEvidence(deploymentReadiness) {
  const founderDecision = evaluateFounderHostedPilotActivationDecision({
    decision: "authorize-implementation-preparation",
    deploymentReadiness,
    decidedBy: "founder-001",
    reviewedBy: "reviewer-001",
    owners: {
      scopeOwner: "product-owner-001",
      rollbackOwner: "operations-owner-001",
      securityOwner: "security-owner-001",
      budgetOwner: "finance-owner-001"
    },
    attestations: {
      boundaryAccepted: true,
      blockersAccepted: true,
      rollbackReviewed: true,
      noLaunchConfirmed: true
    },
    ...closed
  });
  const manifestDryRun = evaluateProviderManifestDryRun({
    environment: "private-pilot-candidate",
    serviceName: "vedapath-hosted-candidate",
    providerCandidate: "hosted-provider-candidate",
    regionCandidate: "residency-region-candidate",
    authorization: founderDecision,
    bindings: {
      runtime: "binding://HOSTED_RUNTIME",
      database: "binding://DURABLE_DATABASE",
      identity: "binding://EXTERNAL_IDENTITY",
      secrets: "binding://MANAGED_SECRETS"
    },
    routes: [
      { path: "/v1/source/search", methods: ["GET"] },
      { path: "/v1/review/queue", methods: ["GET", "POST"] },
      { path: "/v1/activation/readiness", methods: ["GET"] }
    ],
    rollbackSteps: ["disable candidate route", "restore prior binding references", "verify private demo health"],
    ...closed
  });
  const secretStoreAdapter = evaluateManagedSecretStoreAdapterEvidence({
    mode: "reference-only-managed-secret-adapter-candidate",
    registrationVerified: true,
    rotationVerified: true,
    revocationVerified: true,
    makerCheckerVerified: true,
    redactionVerified: true,
    auditVerified: true,
    managedSecretStore: null,
    ...closed
  });
  const databaseAdapter = evaluateDurableDatabaseAdapterEvidence({
    mode: "transactional-memory-database-adapter-candidate",
    transactionVerified: true,
    idempotencyVerified: true,
    conflictVerified: true,
    rollbackVerified: true,
    checkpointVerified: true,
    restoreVerified: true,
    durableProvider: null,
    ...closed
  });
  const externalIdentity = evaluateExternalReviewerIdentityEvidence({
    mode: "signed-external-identity-adapter-candidate",
    signatureVerified: true,
    issuerAudienceVerified: true,
    expiryVerified: true,
    roleVerified: true,
    revocationVerified: true,
    failClosedVerified: true,
    externalIdentityProvider: null,
    ...closed
  });
  const evidence = {
    deploymentReadiness,
    founderDecision,
    manifestDryRun,
    secretStoreAdapter,
    databaseAdapter,
    externalIdentity
  };
  return { ...evidence, gate: evaluateIntegratedHostedActivationGate({ evidence, ...closed }) };
}

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

export function createHostedActivationFixture() {
  const deployment = createDeploymentReadinessFixture();
  const evidence = hostedActivationEvidence(deployment.evidence.gate);
  const identity = createExternalReviewerIdentityCandidate({ nowSeconds: () => 1_800_000_000 });
  const hostedReviewerToken = identity.issueFixtureToken({
    subject: "hosted-reviewer-001",
    tokenId: "hosted-review-session-001",
    expiresIn: 300
  });
  const app = createHostedActivationApp({ baseApp: deployment.app, identityVerifier: identity, evidence });
  return {
    ...deployment,
    app,
    evidence,
    hostedIdentity: identity,
    hostedReviewerToken,
    deploymentReviewerToken: deployment.reviewerToken
  };
}

export async function startHostedActivationServer({ port = 0 } = {}) {
  const fixture = createHostedActivationFixture();
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
      response.end(JSON.stringify({ code: "hosted_activation_server_error", message: error.message }));
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
  const port = Number(portArg?.split("=")[1] || process.env.PORT || 8113);
  const runtime = await startHostedActivationServer({ port });
  console.log(`vedapath-hosted-activation ${runtime.baseUrl}`);
  console.log("fixture provider=unbound secrets=references-only database=memory identity=fixture-signed activation=blocked deployment=blocked launch=closed");
  console.log(HOSTED_ACTIVATION_BOUNDARY);
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => runtime.close().then(() => process.exit(0)));
  }
}
