(function () {
  const node = document.getElementById("pilotPlatformData");
  if (!node) return;
  const data = JSON.parse(node.textContent);
  const output = document.querySelector("[data-platform-output]");
  const render = (value) => { if (output) output.textContent = JSON.stringify(value, null, 2); };
  const boundary = {
    providerBound: false,
    regionBound: false,
    deploymentAuthorized: false,
    productionCredentials: false,
    productionData: false,
    telemetryEnabled: false,
    liveAi: false,
    publicLaunch: false
  };

  const buttons = document.querySelectorAll("[data-platform-action]");
  let migrated = false;
  let incident = null;

  function result(action) {
    if (data.control === "selection") {
      const complete = action === "complete";
      return {
        approved: complete,
        decision: complete ? "recommend-candidate" : "rework",
        recommendation: complete ? { providerCandidate: "provider-a-candidate", regionCandidate: "residency-region-a", operationalBinding: false } : null,
        missingEvidence: complete ? [] : ["dataResidency", "rollbackTest", "exitPlan"],
        selectedProvider: null,
        selectedRegion: null,
        ...boundary
      };
    }
    if (data.control === "adapter") {
      return action === "health"
        ? { status: 200, service: "vedapath-hosted-candidate", adapter: "provider-neutral-candidate", cache: "no-store", production: false, ...boundary }
        : action === "source"
          ? { status: 200, source: { id: "bg-2-48-steadiness", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture" }, generatedAnswer: null, mutation: false, ...boundary }
          : { status: 403, code: "deployment_not_authorized", ...boundary };
    }
    if (data.control === "migration") {
      if (action === "fail") return { ok: false, code: "transaction_rolled_back", schemaVersion: migrated ? 1 : 0, integrityPreserved: true, ...boundary };
      if (action === "rollback") {
        migrated = false;
        return { ok: true, restored: true, schemaVersion: 0, durableProvider: null, ...boundary };
      }
      const replayed = migrated;
      migrated = true;
      return { ok: true, replayed, schemaVersion: 1, counts: { sources: 2, reviewQueue: 1, reviewAudit: 0, consentEvents: 0 }, integrityChecked: true, durableProvider: null, productionCutover: false, ...boundary };
    }
    if (data.control === "identity") {
      if (action === "valid") return { verified: true, subject: "reviewer-001", role: "reviewer", expiresIn: "5 minutes", signature: "verified", externalIdentityProvider: null, ...boundary };
      return { verified: false, code: action === "expired" ? "token_expired" : "signature_invalid", externalIdentityProvider: null, ...boundary };
    }
    if (action === "incident") incident = { code: "source_latency", severity: "medium", status: "open" };
    if (action === "close") incident = incident ? { ...incident, status: "closed" } : null;
    return {
      healthy: !incident || incident.status === "closed",
      incident,
      events: [{ kind: "request", status: "200", route: "/v1/sources/:id", latencyBucket: "under-100ms" }],
      participantContent: false,
      behavioralTelemetry: false,
      reviewerOnly: true,
      ...boundary
    };
  }

  buttons.forEach((button) => button.addEventListener("click", () => render(result(button.dataset.platformAction))));
  render({ release: `${data.version} ${data.title}`, ready: true, instruction: data.initialInstruction, boundary: data.boundary });
})();
