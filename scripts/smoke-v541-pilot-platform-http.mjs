import { startPilotPlatformServer } from "./serve-vedapath-pilot-platform.mjs";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const runtime = await startPilotPlatformServer();
const origin = "http://127.0.0.1:8097";
const request = (path, init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("origin")) headers.set("origin", origin);
  return fetch(`${runtime.baseUrl}${path}`, { ...init, headers });
};

try {
  const readiness = await request("/v1/platform/readiness");
  const readinessBody = await readiness.json();
  assert(readiness.status === 200, "platform readiness should be available");
  assert(readiness.headers.get("cache-control") === "no-store", "readiness must be no-store");
  assert(readinessBody.providerBound === false && readinessBody.regionBound === false, "provider and region must remain unbound");
  assert(readinessBody.deploymentAuthorized === false && readinessBody.publicLaunch === false, "deployment and launch must remain closed");

  const source = await request("/v1/sources/bg-2-48-steadiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  });
  assert(source.status === 200, "participant should read a reviewed fixture source");
  assert(source.headers.get("x-vedapath-adapter") === "provider-neutral-candidate", "source response must traverse the deployment adapter");

  const participantOps = await request("/v1/ops/readiness", {
    headers: { authorization: `Bearer ${runtime.participantToken}` }
  });
  assert(participantOps.status === 403, "participant must not read operations details");

  const reviewerOps = await request("/v1/ops/readiness", {
    headers: { authorization: `Bearer ${runtime.reviewerToken}` }
  });
  const reviewerBody = await reviewerOps.json();
  assert(reviewerOps.status === 200 && reviewerBody.behavioralTelemetry === false, "reviewer should see only redacted technical operations");
  assert(JSON.stringify(reviewerBody).includes("Steadiness in action") === false, "operations output must exclude source content");

  const openIncident = await request("/v1/ops/incidents", {
    method: "POST",
    headers: { authorization: `Bearer ${runtime.reviewerToken}`, "content-type": "application/json" },
    body: JSON.stringify({ code: "adapter_degraded", severity: "high", participantContent: "must-not-survive" })
  });
  assert(openIncident.status === 200, "reviewer should open a bounded incident");
  const duringIncident = await request("/v1/ops/readiness", {
    headers: { authorization: `Bearer ${runtime.reviewerToken}` }
  });
  assert((await duringIncident.json()).healthy === false, "open incident should make readiness unhealthy");
  const closeIncident = await request("/v1/ops/incidents", {
    method: "POST",
    headers: { authorization: `Bearer ${runtime.reviewerToken}`, "content-type": "application/json" },
    body: JSON.stringify({ action: "close" })
  });
  assert(closeIncident.status === 200, "reviewer should close a bounded incident");
  const finalOps = await request("/v1/ops/readiness", {
    headers: { authorization: `Bearer ${runtime.reviewerToken}` }
  });
  const finalBody = await finalOps.json();
  assert(finalBody.healthy === true, "closed incident should restore candidate readiness");
  assert(finalBody.participantContent === false && finalBody.behavioralTelemetry === false, "operations report must preserve privacy boundaries");
  console.log(`pilot-platform-http-ok ${runtime.baseUrl} routes=7 launch=closed`);
} finally {
  await runtime.close();
}
