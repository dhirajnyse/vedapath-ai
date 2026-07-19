(function () {
  const node = document.getElementById("deploymentReadinessData");
  if (!node) return;
  const data = JSON.parse(node.textContent);
  const output = document.querySelector("[data-readiness-output]");
  const render = (value) => {
    if (output) output.textContent = JSON.stringify(value, null, 2);
  };
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

  let cutoverComplete = false;
  let provisioningState = "not-requested";

  function bindingResult(action) {
    const complete = action === "complete";
    return {
      approved: complete,
      decision: complete ? "approved-for-controlled-implementation" : "rework",
      manifestChecksum: complete ? "1f53f36aa8ca22ed4b4711ef" : null,
      evidence: complete ? "8/8" : "5/8",
      makerChecker: complete,
      operationalBinding: false,
      deployable: false,
      ...closed
    };
  }

  function secretResult(action) {
    if (action === "inline") {
      return {
        approved: false,
        code: "inline_secrets_forbidden",
        violations: ["public config must not contain secret-like keys", "inline secret values are forbidden"],
        valuesExposed: false,
        ...closed
      };
    }
    if (action === "resolve") {
      return {
        approved: true,
        mode: "fixture-secret-resolver",
        handle: "handle://38f50bd62c98a0843f58b0dc",
        value: "redacted",
        exportable: false,
        managedSecretStore: false,
        ...closed
      };
    }
    return {
      approved: true,
      profile: "private-pilot",
      requiredReferences: 4,
      validReferences: 4,
      inlineValues: 0,
      valuesExposed: false,
      managedEnvironmentBound: false,
      ...closed
    };
  }

  function cutoverResult(action) {
    if (action === "fail") {
      return {
        ok: false,
        code: "cutover_rolled_back",
        activeSlot: cutoverComplete ? "green" : "blue",
        parity: false,
        statePreserved: true,
        durableProvider: null,
        ...closed
      };
    }
    if (action === "rollback") {
      cutoverComplete = false;
      return { ok: true, restoredSlot: "blue", activeSlot: "blue", productionCutover: false, durableProvider: null, ...closed };
    }
    const replayed = cutoverComplete;
    cutoverComplete = true;
    return {
      ok: true,
      replayed,
      activeSlot: "green",
      parity: true,
      counts: { sources: 2, reviewQueue: 1, reviewAudit: 1, consentEvents: 0 },
      checksumsMatch: true,
      productionCutover: false,
      durableProvider: null,
      ...closed
    };
  }

  function identityResult(action) {
    if (action === "request") provisioningState = "requested";
    if (action === "approve" && provisioningState === "requested") provisioningState = "approved";
    if (action === "activate" && provisioningState === "approved") provisioningState = "active";
    if (action === "revoke" && provisioningState === "active") provisioningState = "revoked";
    const allowed = (action === "request")
      || (action === "approve" && ["approved", "active", "revoked"].includes(provisioningState))
      || (action === "activate" && ["active", "revoked"].includes(provisioningState))
      || (action === "revoke" && provisioningState === "revoked");
    return {
      ok: allowed,
      requestId: "provision-reviewer-alpha",
      state: provisioningState,
      role: "reviewer",
      makerChecker: provisioningState !== "requested" && provisioningState !== "not-requested",
      activeSession: provisioningState === "active",
      auditEvents: ["not-requested", "requested", "approved", "active", "revoked"].indexOf(provisioningState),
      externalIdentityProvider: null,
      realAccounts: false,
      ...closed
    };
  }

  function gateResult(action) {
    if (action === "deploy") {
      return { status: 403, code: "deployment_not_authorized", privateDemoReady: true, hostedPilotDeployable: false, ...closed };
    }
    const complete = action === "evaluate";
    return {
      approved: complete,
      decision: complete ? "private-demo-ready-hosted-deployment-blocked" : "rework",
      evidence: complete ? "5/5" : "3/5",
      privateDemoReady: complete,
      hostedPilotDeployable: false,
      blockers: complete
        ? ["provider account", "managed secrets", "durable database", "external identity", "production operations"]
        : ["managed secret contract evidence", "rollback drill evidence"],
      nextAction: complete ? "Founder review of the smallest controlled hosted implementation." : "Repair missing evidence.",
      ...closed
    };
  }

  function result(action) {
    if (data.control === "binding") return bindingResult(action);
    if (data.control === "secrets") return secretResult(action);
    if (data.control === "cutover") return cutoverResult(action);
    if (data.control === "provisioning") return identityResult(action);
    return gateResult(action);
  }

  document.querySelectorAll("[data-readiness-action]").forEach((button) => {
    button.addEventListener("click", () => render(result(button.dataset.readinessAction)));
  });
  render({
    release: `${data.version} ${data.title}`,
    ready: true,
    instruction: data.initialInstruction,
    boundary: data.boundary
  });
})();
