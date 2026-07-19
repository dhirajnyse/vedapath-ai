import { startHostedActivationServer } from "./serve-vedapath-hosted-activation.mjs";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const runtime = await startHostedActivationServer();
const origin = "http://127.0.0.1:8097";
const request = (path, init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("origin")) headers.set("origin", origin);
  return fetch(`${runtime.baseUrl}${path}`, { ...init, headers });
};

try {
  const health = await request("/v1/activation/health");
  const healthBody = await health.json();
  assert(health.status === 200 && healthBody.ok, "activation health should be publicly available");
  assert(health.headers.get("cache-control") === "no-store", "activation health must be no-store");
  assert(!healthBody.providerBound && !healthBody.productionData && !healthBody.telemetryEnabled, "health must preserve provider, data, and telemetry boundaries");
  assert(!healthBody.deploymentAuthorized && !healthBody.publicLaunch, "health must preserve deployment and launch boundaries");

  assert((await request("/v1/activation/readiness")).status === 401, "anonymous activation evidence must be rejected");
  assert((await request("/v1/activation/readiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  })).status === 401, "an unrelated participant identity must fail closed");

  const reviewerHeaders = { authorization: `Bearer ${runtime.hostedReviewerToken}` };
  const readiness = await request("/v1/activation/readiness", { headers: reviewerHeaders });
  const readinessBody = await readiness.json();
  assert(readiness.status === 200 && readinessBody.evidence.implementationCandidateReady, "hosted reviewer should see implementation-candidate readiness");
  assert(!readinessBody.evidence.hostedPilotActivatable && !readinessBody.hostedPilotActivatable, "readiness must not activate a hosted pilot");
  assert(!readinessBody.deploymentAuthorized && !readinessBody.publicLaunch, "readiness must not deploy or launch");
  assert(readinessBody.evidence.blockers.length === 5, "readiness must keep the real-world blockers visible");

  for (const path of ["founder-decision", "manifest", "secrets", "database", "identity"]) {
    const response = await request(`/v1/activation/${path}`, { headers: reviewerHeaders });
    const body = await response.json();
    assert(response.status === 200 && body.evidence?.approved, `${path} evidence should be reviewer-readable`);
    assert(!body.secretsExposed && !body.productionData, `${path} evidence must not expose secrets or production data`);
    assert(!body.hostedPilotActivatable && !body.deploymentAuthorized && !body.publicLaunch, `${path} evidence must preserve closed launch boundaries`);
  }

  const serializedSecrets = JSON.stringify(await (await request("/v1/activation/secrets", { headers: reviewerHeaders })).json());
  assert(!serializedSecrets.includes("fixture-session-signing-value") && !serializedSecrets.includes("sk-"), "activation evidence must not expose secret values");

  const attempt = await request("/v1/activation/attempt", { method: "POST", headers: reviewerHeaders });
  const attemptBody = await attempt.json();
  assert(attempt.status === 403 && attemptBody.code === "hosted_activation_not_authorized", "hosted activation attempt must fail closed");

  const deploymentHeaders = { authorization: `Bearer ${runtime.deploymentReviewerToken}` };
  const deployment = await request("/v1/deployment/readiness", { headers: deploymentHeaders });
  assert(deployment.status === 200, "hosted wrapper must preserve deployment-readiness evidence routes");
  const deploymentAttempt = await request("/v1/deployment/attempt", { method: "POST", headers: deploymentHeaders });
  assert(deploymentAttempt.status === 403, "delegated deployment attempt must remain blocked");

  const source = await request("/v1/sources/bg-2-48-steadiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  });
  assert(source.status === 200, "hosted wrapper must preserve reviewed fixture source access");

  console.log(`hosted-activation-http-ok ${runtime.baseUrl} routes=13 activation=blocked deployment=blocked launch=closed`);
} finally {
  await runtime.close();
}
