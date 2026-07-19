(function () {
  const node = document.getElementById("hostedActivationData");
  if (!node) return;
  const data = JSON.parse(node.textContent);
  const output = document.querySelector("[data-activation-output]");
  const render = (value) => {
    if (output) output.textContent = JSON.stringify(value, null, 2);
  };
  const closed = {
    providerBound: false,
    managedSecretStoreBound: false,
    durableDatabaseBound: false,
    externalIdentityBound: false,
    productionCredentials: false,
    productionData: false,
    telemetryEnabled: false,
    liveAi: false,
    hostedPilotActivatable: false,
    deploymentAuthorized: false,
    publicLaunch: false
  };

  let secretVersion = 0;
  let databaseRevision = 0;
  let identityState = "unverified";

  function founder(action) {
    const complete = action === "authorize";
    return {
      approved: complete,
      decision: complete ? "implementation-preparation-authorized" : "rework",
      evidence: complete ? "5/5 + 4 attestations" : "3/5",
      review: complete ? "maker-checker" : "incomplete",
      packetChecksum: complete ? "de5cccd43b7d4d8398b06f36" : null,
      implementationPreparationAuthorized: complete,
      ...closed
    };
  }

  function manifest(action) {
    if (action === "unsafe") {
      return { approved: false, code: "inline_secret_material", violations: ["manifest must not contain inline secret material"], applied: false, ...closed };
    }
    if (action === "apply") {
      return { status: 403, code: "provider_application_not_authorized", dryRunReady: true, applied: false, ...closed };
    }
    return {
      approved: true,
      dryRunReady: true,
      planChecksum: "8021f5fa2ea927e16ae03d80",
      operations: ["references", "routes", "headers", "rollback", "receipt"],
      routes: 3,
      bindings: 4,
      applied: false,
      ...closed
    };
  }

  function secrets(action) {
    if (action === "value") return { ok: false, code: "invalid_reference_only_registration", valuesExposed: false, ...closed };
    if (action === "register") secretVersion = 1;
    if (action === "rotate" && secretVersion === 1) secretVersion = 2;
    if (action === "revoke" && secretVersion > 0) secretVersion = -secretVersion;
    const active = secretVersion > 0;
    return {
      ok: action === "register" || (action === "rotate" && secretVersion === 2) || (action === "revoke" && secretVersion < 0),
      lifecycle: secretVersion < 0 ? "revoked" : active ? `active-v${secretVersion}` : "unregistered",
      reference: secretVersion ? `secret://SOURCE_STORE/V${Math.abs(secretVersion)}` : null,
      value: "redacted",
      exportable: false,
      auditEvents: secretVersion < 0 ? 3 : secretVersion,
      ...closed
    };
  }

  function database(action) {
    if (action === "conflict") return { ok: false, code: "revision_conflict", revision: databaseRevision, statePreserved: true, ...closed };
    if (action === "unsafe") return { ok: false, code: "transaction_rolled_back", reason: "synthetic_non_personal_record_required", revision: databaseRevision, ...closed };
    if (action === "transact") databaseRevision = Math.max(databaseRevision, 1);
    return {
      ok: true,
      replayed: action === "replay",
      revision: databaseRevision,
      checkpoint: action === "checkpoint" ? "checkpoint-private-demo-001" : null,
      checksum: "75b94329379413ae635e8ff1",
      mode: "transactional-memory-database-adapter-candidate",
      durableProvider: null,
      ...closed
    };
  }

  function identity(action) {
    if (action === "tamper" || action === "expire") identityState = "rejected";
    if (action === "verify") identityState = "verified-reviewer";
    if (action === "revoke") identityState = "revoked";
    return {
      ok: identityState === "verified-reviewer",
      state: identityState,
      issuer: "https://identity.vedapath.invalid",
      audience: "vedapath-private-pilot",
      role: identityState === "verified-reviewer" ? "reviewer" : null,
      expiresIn: identityState === "verified-reviewer" ? 300 : 0,
      failClosed: identityState !== "verified-reviewer",
      externalIdentityProvider: null,
      realAccounts: false,
      ...closed
    };
  }

  function gate(action) {
    if (action === "activate") return { status: 403, code: "hosted_activation_not_authorized", implementationCandidateReady: true, ...closed };
    const complete = action === "evaluate";
    return {
      approved: complete,
      decision: complete ? "implementation-candidate-ready-activation-blocked" : "rework",
      evidence: complete ? "6/6" : "4/6",
      implementationCandidateReady: complete,
      privateDemoReady: complete,
      blockers: complete ? ["provider", "managed secrets", "durable database", "external identity", "production operations"] : ["database adapter evidence", "external identity evidence"],
      nextAction: complete ? "Choose one production implementation slice; do not activate." : "Repair missing evidence.",
      ...closed
    };
  }

  function result(action) {
    if (data.control === "founder") return founder(action);
    if (data.control === "manifest") return manifest(action);
    if (data.control === "secrets") return secrets(action);
    if (data.control === "database") return database(action);
    if (data.control === "identity") return identity(action);
    return gate(action);
  }

  document.querySelectorAll("[data-activation-action]").forEach((button) => {
    button.addEventListener("click", () => render(result(button.dataset.activationAction)));
  });

  render({
    release: `${data.version} ${data.title}`,
    ready: true,
    instruction: data.initialInstruction,
    boundary: data.boundary
  });
})();
