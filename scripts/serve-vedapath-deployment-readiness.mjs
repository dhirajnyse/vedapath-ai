import http from "node:http";
import { pathToFileURL } from "node:url";
import { evaluatePrivatePilotOperationsGate } from "./vedapath-pilot-platform-contracts.mjs";
import { createPilotPlatformFixture } from "./serve-vedapath-pilot-platform.mjs";
import {
  createDeploymentReadinessApp,
  DEPLOYMENT_READINESS_BOUNDARY,
  evaluateDurableDatabaseCutoverRehearsal,
  evaluateHostedProviderBindingDecision,
  evaluateManagedSecretsEnvironmentContract,
  evaluatePrivatePilotDeploymentReadinessGate,
  evaluateReviewerIdentityProvisioningRehearsal
} from "./vedapath-deployment-readiness-contracts.mjs";

const closed = {
  providerBound: false,
  regionBound: false,
  deploymentAuthorized: false,
  productionCredentials: false,
  productionData: false,
  telemetryEnabled: false,
  liveAi: false,
  publicLaunch: false
};

function deploymentEvidenceFixture() {
  const bindingDecision = evaluateHostedProviderBindingDecision({
    decision: "approve-controlled-implementation",
    providerCandidate: "hosted-provider-candidate",
    regionCandidate: "residency-region-candidate",
    runtimeProfile: "edge-fetch-runtime",
    decidedBy: "founder-001",
    reviewedBy: "reviewer-001",
    bindingRefs: {
      runtime: "binding://HOSTED_RUNTIME",
      storage: "binding://DURABLE_STORE",
      identity: "binding://IDENTITY_PROVIDER",
      secrets: "binding://SECRET_MANAGER"
    },
    evidence: {
      dataResidency: true,
      rightsReview: true,
      privacyReview: true,
      securityReview: true,
      rollbackTest: true,
      exitPlan: true,
      budgetApproved: true,
      supportModel: true
    },
    ...closed
  });
  const secretsContract = evaluateManagedSecretsEnvironmentContract({
    profile: "private-pilot",
    serviceName: "vedapath-private-pilot",
    publicOrigin: "https://pilot.vedapath.invalid",
    publicConfig: { LOG_LEVEL: "info", CACHE_MODE: "no-store" },
    secretRefs: {
      SOURCE_STORE: "secret://SOURCE_STORE",
      REVIEW_STORE: "secret://REVIEW_STORE",
      IDENTITY_VERIFIER: "secret://IDENTITY_VERIFIER",
      SESSION_SIGNING_KEY: "secret://SESSION_SIGNING_KEY"
    },
    inlineSecrets: {},
    ...closed
  });
  const cutoverRehearsal = evaluateDurableDatabaseCutoverRehearsal({
    mode: "blue-green-memory-rehearsal",
    snapshotVerified: true,
    parityVerified: true,
    idempotencyVerified: true,
    rollbackVerified: true,
    durableProvider: null,
    ...closed
  });
  const reviewerProvisioning = evaluateReviewerIdentityProvisioningRehearsal({
    mode: "synthetic-maker-checker-provisioning",
    makerCheckerVerified: true,
    leastPrivilegeVerified: true,
    activationVerified: true,
    revocationVerified: true,
    auditVerified: true,
    externalIdentityProvider: null,
    ...closed
  });
  const operationsGate = evaluatePrivatePilotOperationsGate({
    mode: "redacted-technical-operations",
    healthChecks: true,
    incidentLifecycle: true,
    contentExcluded: true,
    reviewerOnly: true,
    rollbackReady: true,
    ...closed
  });
  const evidence = { bindingDecision, secretsContract, cutoverRehearsal, reviewerProvisioning, operationsGate };
  const gate = evaluatePrivatePilotDeploymentReadinessGate({
    evidence,
    privateDemoChecks: true,
    rollbackDrill: true,
    founderReview: true,
    ...closed
  });
  return { ...evidence, gate };
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

export function createDeploymentReadinessFixture() {
  const platform = createPilotPlatformFixture();
  const evidence = deploymentEvidenceFixture();
  const app = createDeploymentReadinessApp({
    baseApp: platform.app,
    identityVerifier: platform.identity,
    evidence
  });
  return { ...platform, app, evidence };
}

export async function startDeploymentReadinessServer({ port = 0 } = {}) {
  const fixture = createDeploymentReadinessFixture();
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
      response.end(JSON.stringify({ code: "deployment_readiness_server_error", message: error.message }));
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
  const port = Number(portArg?.split("=")[1] || process.env.PORT || 8112);
  const runtime = await startDeploymentReadinessServer({ port });
  console.log(`vedapath-deployment-readiness ${runtime.baseUrl}`);
  console.log("fixture identity=ephemeral storage=memory provider=unbound region=unbound deployment=blocked launch=closed");
  console.log(DEPLOYMENT_READINESS_BOUNDARY);
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => runtime.close().then(() => process.exit(0)));
  }
}
