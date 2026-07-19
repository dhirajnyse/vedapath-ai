import { startDeploymentReadinessServer } from "./serve-vedapath-deployment-readiness.mjs";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const runtime = await startDeploymentReadinessServer();
const origin = "http://127.0.0.1:8097";
const request = (path, init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("origin")) headers.set("origin", origin);
  return fetch(`${runtime.baseUrl}${path}`, { ...init, headers });
};

try {
  const health = await request("/v1/deployment/health");
  const healthBody = await health.json();
  assert(health.status === 200 && healthBody.ok, "deployment health should be publicly available");
  assert(health.headers.get("cache-control") === "no-store", "deployment health must be no-store");
  assert(!healthBody.telemetryEnabled && !healthBody.publicLaunch, "health must preserve telemetry and launch boundaries");

  assert((await request("/v1/deployment/readiness")).status === 401, "anonymous deployment evidence must be rejected");
  assert((await request("/v1/deployment/readiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  })).status === 403, "participant must not read deployment evidence");

  const reviewerHeaders = { authorization: `Bearer ${runtime.reviewerToken}` };
  const readiness = await request("/v1/deployment/readiness", { headers: reviewerHeaders });
  const readinessBody = await readiness.json();
  assert(readiness.status === 200 && readinessBody.evidence.privateDemoReady, "reviewer should see private demo readiness");
  assert(!readinessBody.evidence.hostedPilotDeployable && !readinessBody.deploymentAuthorized, "readiness must not grant hosted deployment");
  assert(readinessBody.evidence.blockers.length >= 5, "readiness must expose unresolved production blockers");

  for (const path of ["binding", "secrets", "cutover", "reviewer-identity"]) {
    const response = await request(`/v1/deployment/${path}`, { headers: reviewerHeaders });
    const body = await response.json();
    assert(response.status === 200 && body.evidence?.approved, `${path} evidence should be reviewer-readable`);
    assert(!body.secretsExposed && !body.deploymentAuthorized && !body.publicLaunch, `${path} evidence must preserve closed boundaries`);
  }

  const serializedSecrets = JSON.stringify(await (await request("/v1/deployment/secrets", { headers: reviewerHeaders })).json());
  assert(!serializedSecrets.includes("fixture-session-signing-value"), "deployment evidence must not expose secret values");

  const attempt = await request("/v1/deployment/attempt", { method: "POST", headers: reviewerHeaders });
  const attemptBody = await attempt.json();
  assert(attempt.status === 403 && attemptBody.code === "deployment_not_authorized", "deployment attempt must fail closed");

  const source = await request("/v1/sources/bg-2-48-steadiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  });
  assert(source.status === 200, "deployment wrapper must preserve reviewed fixture source access");
  const platform = await request("/v1/platform/readiness");
  const platformBody = await platform.json();
  assert(platform.status === 200 && !platformBody.providerBound && !platformBody.publicLaunch, "existing platform readiness must remain delegated and closed");

  console.log(`deployment-readiness-http-ok ${runtime.baseUrl} routes=10 deployment=blocked launch=closed`);
} finally {
  await runtime.close();
}
